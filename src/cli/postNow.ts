import { connectToWhatsApp } from "../whatsapp/connection.js";
import { BibleService } from "../bible/bibleService.js";
import { ChannelPublisher } from "../channel/publisher.js";
import { logger } from "../utils/logger.js";

async function run() {
  const arg = process.argv[2]?.toLowerCase();
  const currentHour = new Date().getHours();
  const period: "morning" | "evening" =
    arg === "evening" || arg === "noite"
      ? "evening"
      : arg === "morning" || arg === "manha" || arg === "manhã"
      ? "morning"
      : currentHour >= 16 || currentHour < 4
      ? "evening"
      : "morning";

  logger.info(
    `🚀 Disparo manual de teste para o canal: ${period === "morning" ? "☀️ BOM DIA" : "🌙 BOA NOITE"}...`
  );

  const sock = await connectToWhatsApp();

  logger.info("Aguardando conexão com o WhatsApp...");
  await new Promise<void>((resolve) => {
    sock.ev.on("connection.update", (update) => {
      if (update.connection === "open") {
        resolve();
      }
    });
  });

  const verse = BibleService.getVerseForPeriod(period);
  logger.info({ verse: `${verse.book} ${verse.chapter}:${verse.verse}` }, "Versículo selecionado");

  const success = await ChannelPublisher.publishVerse(verse, period);

  if (success) {
    logger.info("🎉 Sucesso! Mensagem entregue no canal.");
  } else {
    logger.error("Falha no disparo manual. Verifique o CHANNEL_JID no .env.");
  }

  setTimeout(() => process.exit(0), 2000);
}

run().catch((err) => {
  logger.error({ err }, "Erro fatal no disparo manual");
  process.exit(1);
});
