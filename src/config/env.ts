import dotenv from "dotenv";
dotenv.config();

export const env = {
  CHANNEL_JID: process.env.CHANNEL_JID || "",
  CHANNEL_NAME: process.env.CHANNEL_NAME || "Palavra Diária",
  CHANNEL_INVITE_LINK: process.env.CHANNEL_INVITE_LINK || "",
  SCHEDULE_HOUR: parseInt(process.env.SCHEDULE_HOUR || "6", 10),
  SCHEDULE_MINUTE: parseInt(process.env.SCHEDULE_MINUTE || "30", 10),
  BIBLE_VERSION: process.env.BIBLE_VERSION || "NVI",
};
