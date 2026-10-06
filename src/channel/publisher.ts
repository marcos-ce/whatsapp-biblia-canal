import { getSocket, isWhatsAppConnected } from "../whatsapp/connection.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleVerse } from "../bible/verses.js";
import { BibleService } from "../bible/bibleService.js";

export class ChannelPublisher {
  /**
   * Publica o versículo no canal oficial configurado
   */
  static async publishVerse(verse: BibleVerse, imageUrl?: string): Promise<boolean> {
    if (!isWhatsAppConnected()) {
      logger.error("Não é possível publicar: WhatsApp não está conectado.");
      return false;
    }

    const channelJid = env.CHANNEL_JID.trim();
    if (!channelJid) {
      logger.error("CHANNEL_JID não configurado no .env! Defina o JID do canal antes de publicar.");
      return false;
    }

    const sock = getSocket();
    const messageText = BibleService.formatMessage(verse);

    logger.info({ channelJid, verse: `${verse.book} ${verse.chapter}:${verse.verse}` }, "Publicando versículo no canal...");

    try {
      if (imageUrl) {
        // Envia foto com a legenda formatada
        await sock.sendMessage(channelJid, {
          image: { url: imageUrl },
          caption: messageText,
        });
      } else {
        // Envia mensagem em texto formatado
        await sock.sendMessage(channelJid, {
          text: messageText,
        });
      }

      logger.info("✅ Versículo publicado com sucesso no canal!");
      return true;
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "❌ Falha ao publicar no canal do WhatsApp.");
      return false;
    }
  }
}
