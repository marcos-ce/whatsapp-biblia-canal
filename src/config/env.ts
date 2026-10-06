import dotenv from "dotenv";
dotenv.config();

export const env = {
  CHANNEL_JID: process.env.CHANNEL_JID || "",
  CHANNEL_NAME: process.env.CHANNEL_NAME || "Palavra Diária",
  CHANNEL_INVITE_LINK: process.env.CHANNEL_INVITE_LINK || "",
  MORNING_HOUR: parseInt(process.env.MORNING_HOUR || "6", 10),
  MORNING_MINUTE: parseInt(process.env.MORNING_MINUTE || "0", 10),
  EVENING_HOUR: parseInt(process.env.EVENING_HOUR || "18", 10),
  EVENING_MINUTE: parseInt(process.env.EVENING_MINUTE || "0", 10),
  BIBLE_VERSION: process.env.BIBLE_VERSION || "NVI",
};
