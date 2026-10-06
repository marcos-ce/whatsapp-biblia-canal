import { WASocket } from "@whiskeysockets/baileys";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleService } from "../bible/bibleService.js";
import { ChannelPublisher } from "../channel/publisher.js";

export function registerAdminCommands(sock: WASocket): void {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" && type !== "append") return;

    for (const msg of messages) {
      if (!msg.message) continue;

      const remoteJid = msg.key.remoteJid || "";

      // 🛡️ SEGURANÇA MÁXIMA: Ignora grupos, canais e mensagens de broadcast
      if (
        remoteJid.endsWith("@g.us") ||
        remoteJid.endsWith("@newsletter") ||
        remoteJid === "status@broadcast"
      ) {
        continue;
      }

      const text = (
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ""
      )
        .trim()
        .toLowerCase();

      // Só processa se começar com '/' ou '!'
      if (!text.startsWith("/") && !text.startsWith("!")) {
        continue;
      }

      // Verifica se quem enviou é o Administrador:
      // 1. Mensagens enviadas do próprio aparelho do bot (chat 'Você' / Mensagens Salvas) -> fromMe = true
      // 2. Ou mensagens enviadas pelo número pessoal do admin configurado em ADMIN_PHONE
      const isFromMe = Boolean(msg.key.fromMe);
      const adminPhoneDigits = env.ADMIN_PHONE ? env.ADMIN_PHONE.replace(/\D/g, "") : "";
      const senderDigits = remoteJid.replace(/\D/g, "");

      const isAdmin =
        isFromMe || (adminPhoneDigits.length >= 8 && senderDigits.includes(adminPhoneDigits));

      // Se NÃO for admin, ignora 100% silenciosamente (sem responder nada para clientes)
      if (!isAdmin) {
        continue;
      }

      const cmd = text.slice(1).trim().split(" ")[0];
      logger.info({ cmd, remoteJid, isFromMe }, "Comando administrativo recebido no WhatsApp!");

      // 1. /postar ou /teste: posta de acordo com a hora atual
      if (cmd === "postar" || cmd === "teste") {
        const currentHour = new Date().getHours();
        const period: "morning" | "evening" =
          currentHour >= 15 || currentHour < 4 ? "evening" : "morning";

        await sock.sendMessage(remoteJid, {
          text: `⏳ *Iniciando postagem no canal:* Foto HD + Devocional de ${period === "morning" ? "☀️ Bom Dia" : "🌙 Boa Noite"}...`,
        });

        const post = BibleService.getDevotional(period);
        const success = await ChannelPublisher.publishDevotional(post);

        if (success) {
          await sock.sendMessage(remoteJid, {
            text: `✅ *Sucesso!* Postagem de ${period === "morning" ? "☀️ Bom Dia" : "🌙 Boa Noite"} publicada no canal com a Foto HD.`,
          });
        } else {
          await sock.sendMessage(remoteJid, {
            text: `❌ Falha ao publicar no canal. Verifique os logs na VPS.`,
          });
        }
        continue;
      }

      // 2. /bomdia: força envio de Bom Dia com foto do amanhecer
      if (cmd === "bomdia" || cmd === "manha" || cmd === "manhã") {
        await sock.sendMessage(remoteJid, {
          text: "⏳ Disparando devocional de ☀️ *BOM DIA* com foto do nascer do sol para o canal...",
        });

        const post = BibleService.getDevotional("morning");
        const success = await ChannelPublisher.publishDevotional(post);

        if (success) {
          await sock.sendMessage(remoteJid, {
            text: `✅ *Devocional de Bom Dia postado com sucesso no canal!*`,
          });
        } else {
          await sock.sendMessage(remoteJid, {
            text: `❌ Falha ao publicar no canal.`,
          });
        }
        continue;
      }

      // 3. /boanoite: força envio de Boa Noite com foto do entardecer/noite
      if (cmd === "boanoite" || cmd === "noite") {
        await sock.sendMessage(remoteJid, {
          text: "⏳ Disparando devocional de 🌙 *BOA NOITE* com foto do entardecer para o canal...",
        });

        const post = BibleService.getDevotional("evening");
        const success = await ChannelPublisher.publishDevotional(post);

        if (success) {
          await sock.sendMessage(remoteJid, {
            text: `✅ *Devocional de Boa Noite postado com sucesso no canal!*`,
          });
        } else {
          await sock.sendMessage(remoteJid, {
            text: `❌ Falha ao publicar no canal.`,
          });
        }
        continue;
      }

      // 4. /status ou /ajuda
      if (cmd === "status" || cmd === "ajuda" || cmd === "help" || cmd === "menu") {
        const pad = (n: number) => String(n).padStart(2, "0");
        const statusMsg =
          `📖 *Bíblia Sagrada Canal - Comandos de Teste*\n\n` +
          `📢 *Canal:* ${env.CHANNEL_NAME}\n` +
          `⏰ *Disparos Automáticos:*\n` +
          ` • ☀️ Bom Dia: ${pad(env.MORNING_HOUR)}:${pad(env.MORNING_MINUTE)}\n` +
          ` • 🌙 Boa Noite: ${pad(env.EVENING_HOUR)}:${pad(env.EVENING_MINUTE)}\n\n` +
          `🛠️ *Comandos para Disparar Agora (sem esperar o horário):*\n` +
          `• */postar* — Posta o devocional do horário no canal\n` +
          `• */bomdia* — Força o envio de Bom Dia com foto HD\n` +
          `• */boanoite* — Força o envio de Boa Noite com foto HD`;

        await sock.sendMessage(remoteJid, { text: statusMsg });
        continue;
      }
    }
  });
}
