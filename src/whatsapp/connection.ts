import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import QRCode from "qrcode-terminal";
import { logger } from "../utils/logger.js";

let activeSocket: WASocket | null = null;
let botPhone: string = "";

export function getSocket(): WASocket {
  if (!activeSocket) {
    throw new Error("WhatsApp socket não está inicializado ou conectado.");
  }
  return activeSocket;
}

export function isWhatsAppConnected(): boolean {
  return activeSocket !== null;
}

export function getBotPhone(): string {
  return botPhone;
}

export async function connectToWhatsApp(): Promise<WASocket> {
  const authDir = path.resolve(process.cwd(), "data/auth");
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  logger.info({ version }, "Iniciando Baileys para o Canal Bíblico...");

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger as any),
    },
    printQRInTerminal: false,
    logger: logger.child({ name: "baileys" }) as any,
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    browser: ["Ubuntu", "Chrome", "120.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n📱 ESCANEIE ESTE QR CODE PARA CONECTAR AO CANAL DA BÍBLIA:\n");
      QRCode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;

      logger.warn({ statusCode, loggedOut }, "Conexão WhatsApp encerrada.");
      activeSocket = null;

      if (loggedOut) {
        logger.error("Deslogado do WhatsApp. Exclua data/auth e reinicie para escanear novamente.");
        process.exit(1);
      } else {
        logger.info("Reconectando em 5 segundos...");
        setTimeout(() => connectToWhatsApp(), 5000);
      }
    } else if (connection === "open") {
      activeSocket = sock;
      botPhone = (sock.user?.id ?? "").split(":")[0].split("@")[0];
      logger.info({ botPhone }, "✅ WhatsApp conectado com sucesso para o Canal Bíblico!");
    }
  });

  return sock;
}
