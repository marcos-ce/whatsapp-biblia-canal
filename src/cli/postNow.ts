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
    `🚀 Disparo manual de teste para o canal: Foto HD + Devocional de ${period === "morning" ? "☀️ BOM DIA" : "🌙 BOA NOITE"}...`
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

  const post = BibleService.getDevotional(period);
  logger.info(
    { verse: `${post.book} ${post.chapter}:${post.verse}`, photo: post.imageUrl },
    "Devocional selecionado com foto HD"
  );

  const success = await ChannelPublisher.publishDevotional(post);

  if (success) {
    logger.info("🎉 Sucesso! Foto HD e devocional entregues no canal.");
  } else {
    logger.error("Falha no disparo manual. Verifique o CHANNEL_JID ou convite do canal.");
  }

  setTimeout(() => process.exit(0), 3000);
}

run().catch((err) => {
  logger.error({ err }, "Erro fatal no disparo manual");
  process.exit(1);
});
