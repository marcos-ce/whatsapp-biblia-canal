import { connectToWhatsApp } from "../whatsapp/connection.js";
import { logger } from "../utils/logger.js";

async function run() {
  logger.info("🔍 Buscando grupos e canais acessíveis pelo WhatsApp...");

  const sock = await connectToWhatsApp();

  await new Promise<void>((resolve) => {
    sock.ev.on("connection.update", (update) => {
      if (update.connection === "open") {
        resolve();
      }
    });
  });

  try {
    const groups = await sock.groupFetchAllParticipating();
    console.log("\n📋 GRUPOS PARTICIPANTES:");
    for (const [id, meta] of Object.entries(groups)) {
      console.log(` • [${meta.subject}] -> JID: ${id}`);
    }
  } catch (err: any) {
    logger.warn("Não foi possível listar grupos automaticamente.");
  }

  console.log("\n💡 DICA PARA CANAIS DO WHATSAPP (Newsletters):");
  console.log(" O JID de um canal do WhatsApp termina com '@newsletter' (ex: 120363xxxxxxxxxxxx@newsletter).");
  console.log(" Ao criar o canal, adicione este número como administrador e configure o CHANNEL_JID no .env.\n");

  setTimeout(() => process.exit(0), 3000);
}

run().catch((err) => {
  logger.error({ err }, "Erro ao listar canais");
  process.exit(1);
});
