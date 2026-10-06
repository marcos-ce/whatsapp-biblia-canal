import { connectToWhatsApp, getSocket } from "../whatsapp/connection.js";
import { BibleService } from "../bible/bibleService.js";
import { ChannelPublisher } from "../channel/publisher.js";
import { logger } from "../utils/logger.js";

async function run() {
  logger.info("🚀 Iniciando disparo manual de teste para o canal...");

  const sock = await connectToWhatsApp();

  // Aguarda conexão estabelecer
  logger.info("Aguardando conexão com o WhatsApp...");
  await new Promise<void>((resolve) => {
    sock.ev.on("connection.update", (update) => {
      if (update.connection === "open") {
        resolve();
      }
    });
  });

  const verse = BibleService.getDailyVerse();
  logger.info({ verse: `${verse.book} ${verse.chapter}:${verse.verse}` }, "Versículo selecionado");

  const success = await ChannelPublisher.publishVerse(verse);

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
