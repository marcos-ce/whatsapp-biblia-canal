import { connectToWhatsApp } from "./whatsapp/connection.js";
import { startDailyScheduler } from "./scheduler/cron.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

async function main() {
  console.log("\x1b[36m" + "=".repeat(55) + "\x1b[0m");
  console.log("\x1b[36m  📖 INICIANDO BOT CANAL DA BÍBLIA (WHATSAPP)\x1b[0m");
  console.log(`\x1b[36m  Canal: ${env.CHANNEL_NAME} | Horário: ${String(env.SCHEDULE_HOUR).padStart(2, "0")}:${String(env.SCHEDULE_MINUTE).padStart(2, "0")}\x1b[0m`);
  console.log("\x1b[36m" + "=".repeat(55) + "\x1b[0m");

  // Inicia conexão do Baileys
  await connectToWhatsApp();

  // Inicia agendador diário da manhã
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
