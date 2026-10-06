import { getSocket, isWhatsAppConnected } from "../whatsapp/connection.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleVerse } from "../bible/verses.js";
import { BibleService } from "../bible/bibleService.js";

let resolvedChannelJid: string | null = null;

export class ChannelPublisher {
  /**
   * Resolve o JID oficial (@newsletter) a partir do link de convite ou JID direto
   */
  static async resolveChannelJid(): Promise<string | null> {
    if (resolvedChannelJid) return resolvedChannelJid;

    const target = env.CHANNEL_JID.trim();
    if (!target) return null;

    // Se já é um JID completo de newsletter ou grupo
    if (target.endsWith("@newsletter") || target.endsWith("@g.us")) {
      resolvedChannelJid = target;
      return resolvedChannelJid;
    }

    // Se for link do WhatsApp Channel: https://whatsapp.com/channel/0029VbDYU2MAInPrO6krdG0g
    const match = target.match(/whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)/i);
    const inviteCode = match ? match[1] : target;

    try {
      const sock = getSocket() as any;
      logger.info({ inviteCode }, "Resolvendo JID oficial do canal via WhatsApp...");

      if (typeof sock.newsletterMetadata === "function") {
        const meta = await sock.newsletterMetadata("invite", inviteCode);
        if (meta?.id) {
          resolvedChannelJid = meta.id;
          logger.info(
            { jid: resolvedChannelJid, name: meta.name },
            "✅ JID do canal resolvido com sucesso pelo link de convite!"
          );
          return resolvedChannelJid;
        }
      }
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "Erro ao resolver JID pelo convite do canal.");
    }

    return null;
  }

  /**
   * Publica o versículo no canal oficial configurado
   */
  static async publishVerse(
    verse: BibleVerse,
    period: "morning" | "evening" = "morning",
    imageUrl?: string
  ): Promise<boolean> {
    if (!isWhatsAppConnected()) {
      logger.error("Não é possível publicar: WhatsApp não está conectado.");
      return false;
    }

    const channelJid = await this.resolveChannelJid();
    if (!channelJid) {
      logger.error("Não foi possível determinar o JID do canal. Verifique se o link ou JID no .env está correto.");
      return false;
    }

    // 🛡️ TRAVA DE SEGURANÇA MÁXIMA: Impede terminantemente envio para números individuais
    if (channelJid.endsWith("@s.whatsapp.net") || /^\d+$/.test(channelJid)) {
      logger.fatal(
        { channelJid },
        "⛔ BLOQUEIO DE SEGURANÇA: Destinatário resolvido é um número privado! O bot foi desenvolvido EXCLUSIVAMENTE para canais (@newsletter) e grupos (@g.us). Envio cancelado."
      );
      return false;
    }

    if (!channelJid.endsWith("@newsletter") && !channelJid.endsWith("@g.us")) {
      logger.error(
        { channelJid },
        "⛔ Destinatário inválido: deve terminar com '@newsletter' (canal oficial) ou '@g.us' (grupo)."
      );
      return false;
    }

    const sock = getSocket();
    const messageText = BibleService.formatMessage(verse, period);

    logger.info(
      { channelJid, period, verse: `${verse.book} ${verse.chapter}:${verse.verse}` },
      `Publicando mensagem de ${period === "morning" ? "BOM DIA" : "BOA NOITE"} no canal...`
    );

    try {
      if (imageUrl) {
        await sock.sendMessage(channelJid, {
          image: { url: imageUrl },
          caption: messageText,
        });
      } else {
        await sock.sendMessage(channelJid, {
          text: messageText,
        });
      }

      logger.info(`✅ Mensagem de ${period === "morning" ? "BOM DIA" : "BOA NOITE"} publicada com sucesso no canal!`);
      return true;
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "❌ Falha ao publicar no canal do WhatsApp.");
      return false;
    }
  }
}
