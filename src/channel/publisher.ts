import { getSocket, isWhatsAppConnected } from "../whatsapp/connection.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { DevotionalPost } from "../bible/devotionals.js";
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

    if (target.endsWith("@newsletter") || target.endsWith("@g.us")) {
      resolvedChannelJid = target;
      return resolvedChannelJid;
    }

    const match = target.match(/whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)/i);
    const inviteCode = match ? match[1] : target;

    try {
      const sock = getSocket() as any;
      logger.info({ inviteCode }, "Resolvendo JID oficial do canal via WhatsApp...");

      if (typeof sock.newsletterMetadata === "function") {
        const meta = await sock.newsletterMetadata("invite", inviteCode);
        if (meta?.id) {
          const rawId = String(meta.id);
          resolvedChannelJid = rawId.includes("@") ? rawId : `${rawId}@newsletter`;
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
   * Publica o devocional no canal com foto HD e legenda humanizada
   */
  static async publishDevotional(post: DevotionalPost): Promise<boolean> {
    if (!isWhatsAppConnected()) {
      logger.error("Não é possível publicar: WhatsApp não está conectado.");
      return false;
    }

    const channelJid = await this.resolveChannelJid();
    if (!channelJid) {
      logger.error("Não foi possível determinar o JID do canal. Verifique o link ou JID no .env.");
      return false;
    }

    // 🛡️ TRAVA DE SEGURANÇA MÁXIMA: Impede envio para números individuais
    if (channelJid.endsWith("@s.whatsapp.net") || /^\d+$/.test(channelJid)) {
      logger.fatal(
        { channelJid },
        "⛔ BLOQUEIO DE SEGURANÇA: Destinatário é um número privado! O bot foi desenvolvido EXCLUSIVAMENTE para canais (@newsletter) e grupos (@g.us). Envio cancelado."
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
    const captionText = BibleService.formatMessage(post);

    logger.info(
      { channelJid, period: post.period, verse: `${post.book} ${post.chapter}:${post.verse}` },
      `Publicando devocional de ${post.period === "morning" ? "BOM DIA" : "BOA NOITE"} com foto HD no canal...`
    );

    // 1. Tenta enviar com a Foto HD profissional
    if (post.imageUrl) {
      try {
        await sock.sendMessage(channelJid, {
          image: { url: post.imageUrl },
          caption: captionText,
        });
        logger.info(`✅ Foto HD + Devocional de ${post.period === "morning" ? "BOM DIA" : "BOA NOITE"} publicados com sucesso!`);
        return true;
      } catch (imgErr: any) {
        logger.warn({ err: imgErr?.message }, "Falha ao baixar/enviar a foto. Alternando para envio de texto direto...");
      }
    }

    // 2. Fallback de segurança: se a imagem falhar, envia o texto direto
    try {
      await sock.sendMessage(channelJid, {
        text: captionText,
      });
      logger.info(`✅ Devocional publicado com sucesso em formato texto!`);
      return true;
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "❌ Falha ao publicar no canal do WhatsApp.");
      return false;
    }
  }
}
