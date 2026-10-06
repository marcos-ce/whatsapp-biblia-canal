import { connectToWhatsApp } from "./whatsapp/connection.js";
import { startDailyScheduler } from "./scheduler/cron.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

async function main() {
  const pad = (n: number) => String(n).padStart(2, "0");

  console.log("\x1b[36m" + "=".repeat(60) + "\x1b[0m");
  console.log("\x1b[36m  📖 INICIANDO BOT CANAL DA BÍBLIA (WHATSAPP)\x1b[0m");
  console.log(`\x1b[36m  Canal: ${env.CHANNEL_NAME}\x1b[0m`);
  console.log(`\x1b[36m  ☀️ Bom Dia:  ${pad(env.MORNING_HOUR)}:${pad(env.MORNING_MINUTE)} | 🌙 Boa Noite: ${pad(env.EVENING_HOUR)}:${pad(env.EVENING_MINUTE)}\x1b[0m`);
  console.log("\x1b[36m" + "=".repeat(60) + "\x1b[0m");

  // Inicia conexão do Baileys
  await connectToWhatsApp();

  // Inicia agendador diário (manhã e noite)
  startDailyScheduler();

  logger.info("Bot do Canal Bíblico pronto e operando.");
}

main().catch((err) => {
  logger.error({ err }, "Erro fatal na inicialização");
  process.exit(1);
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, "Encerrando processo do canal bíblico...");
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
