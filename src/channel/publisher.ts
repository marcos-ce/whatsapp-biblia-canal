import { getSocket, isWhatsAppConnected } from "../whatsapp/connection.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleVerse } from "../bible/verses.js";
import { BibleService } from "../bible/bibleService.js";

export class ChannelPublisher {
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

    const channelJid = env.CHANNEL_JID.trim();
    if (!channelJid) {
      logger.error("CHANNEL_JID não configurado no .env! Defina o JID do canal antes de publicar.");
      return false;
    }

    // 🛡️ TRAVA DE SEGURANÇA MÁXIMA: Impede terminantemente envio para números individuais
    if (channelJid.endsWith("@s.whatsapp.net") || /^\d+$/.test(channelJid)) {
      logger.fatal(
        { channelJid },
        "⛔ BLOQUEIO DE SEGURANÇA: CHANNEL_JID configurado é um número privado! O bot foi desenvolvido EXCLUSIVAMENTE para canais (@newsletter) e grupos (@g.us). Envio cancelado."
      );
      return false;
    }

    if (!channelJid.endsWith("@newsletter") && !channelJid.endsWith("@g.us")) {
      logger.error(
        { channelJid },
        "⛔ CHANNEL_JID inválido: deve terminar com '@newsletter' (canal oficial) ou '@g.us' (grupo). Destinatários privados não são permitidos."
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
