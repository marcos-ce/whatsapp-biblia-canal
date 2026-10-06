import dotenv from "dotenv";
dotenv.config();

export const env = {
  // Aceita o JID direto (@newsletter) OU o link de convite completo do canal
  CHANNEL_JID:
    process.env.CHANNEL_JID ||
    "https://whatsapp.com/channel/0029VbDYU2MAInPrO6krdG0g",
  CHANNEL_NAME:
    process.env.CHANNEL_NAME ||
    "Bíblia Sagrada - Versículos E Devocional",
  CHANNEL_INVITE_LINK:
    process.env.CHANNEL_INVITE_LINK ||
    "https://whatsapp.com/channel/0029VbDYU2MAInPrO6krdG0g",

  // Seu número pessoal de WhatsApp para poder mandar comandos de teste (opcional)
  // Ex: 5585999999999 (mensagens enviadas por você mesmo no próprio aparelho sempre funcionam)
  ADMIN_PHONE: process.env.ADMIN_PHONE || "",

  MORNING_HOUR: parseInt(process.env.MORNING_HOUR || "6", 10),
  MORNING_MINUTE: parseInt(process.env.MORNING_MINUTE || "0", 10),
  EVENING_HOUR: parseInt(process.env.EVENING_HOUR || "18", 10),
  EVENING_MINUTE: parseInt(process.env.EVENING_MINUTE || "0", 10),
  BIBLE_VERSION: process.env.BIBLE_VERSION || "NVI",
};
