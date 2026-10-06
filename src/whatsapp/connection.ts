import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  WASocket,
  CacheStore,
  proto,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import QRCode from "qrcode-terminal";
import { logger } from "../utils/logger.js";
import { registerAdminCommands } from "../commands/adminCommands.js";

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

// ── Cache de mensagens e retentativas (evita travamento e erros E2EE) ──
const recentMessagesCache = new Map<string, proto.IMessage>();

function createMemoryCache(): CacheStore {
  const map = new Map<string, any>();
  return {
    get<T>(key: string): T | undefined {
      return map.get(key);
    },
    set<T>(key: string, value: T): void {
      map.set(key, value);
      if (map.size > 2000) {
        const first = map.keys().next().value;
        if (first) map.delete(first);
      }
    },
    del(key: string): void {
      map.delete(key);
    },
    flushAll(): void {
      map.clear();
    },
  };
}

const msgRetryCounterCache = createMemoryCache();

export async function connectToWhatsApp(): Promise<WASocket> {
  const authDir = path.resolve(process.cwd(), "data/auth");
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  logger.info({ version, isLatest }, "Iniciando Baileys para o Canal Bíblico...");

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
    // ⚡ Ignora histórico de mensagens antigas: economiza RAM na VPS e previne timeout 408 no handshake inicial
    shouldSyncHistoryMessage: () => false,
    markOnlineOnConnect: false,
    browser: ["Mac OS", "Chrome", "120.0.0"],
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 90_000,
    keepAliveIntervalMs: 25_000,
    msgRetryCounterCache,
    getMessage: async (key: proto.IMessageKey): Promise<proto.IMessage | undefined> => {
      if (key.id) {
        return recentMessagesCache.get(key.id);
      }
      return undefined;
    },
  });

  sock.ev.on("creds.update", saveCreds);

  // Armazena mensagens em cache para o Baileys responder a retry requests de forma instantânea
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (msg.key.id && msg.message) {
        recentMessagesCache.set(msg.key.id, msg.message);
        if (recentMessagesCache.size > 1000) {
          const oldestKey = recentMessagesCache.keys().next().value;
          if (oldestKey) recentMessagesCache.delete(oldestKey);
        }
      }
    }
  });

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

      // Keep-alive de presença a cada 30 segundos: impede que o WhatsApp desconecte por ociosidade
      const keepAliveInterval = setInterval(async () => {
        if (activeSocket !== sock) {
          clearInterval(keepAliveInterval);
          return;
        }
        try {
          await sock.sendPresenceUpdate("available");
        } catch {
          // Ignora silenciosamente
        }
      }, 30_000);
      keepAliveInterval.unref();
    }
  });

  // Registra comandos administrativos privados para testes imediatos (/postar, /bomdia, /boanoite, /status)
  registerAdminCommands(sock);

  return sock;
}
