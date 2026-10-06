import fs from "fs";
import path from "path";
import { CURATED_VERSES, BibleVerse } from "./verses.js";
import { env } from "../config/env.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const HISTORY_FILE = path.resolve(DATA_DIR, "history.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

interface VerseHistory {
  sentVerseIds: number[];
  lastSentDate: string;
}

function loadHistory(): VerseHistory {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) {
    return { sentVerseIds: [], lastSentDate: "" };
  }
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { sentVerseIds: [], lastSentDate: "" };
  }
}

function saveHistory(history: VerseHistory): void {
  ensureDataDir();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
}

export class BibleService {
  /**
   * Obtém o versículo do dia evitando repetições recentes
   */
  static getDailyVerse(): BibleVerse {
    const history = loadHistory();
    const available = CURATED_VERSES.filter((v) => !history.sentVerseIds.includes(v.id));

    let chosen: BibleVerse;

    if (available.length > 0) {
      // Sorteia entre os versículos que ainda não foram enviados recentemente
      const index = Math.floor(Math.random() * available.length);
      chosen = available[index];
    } else {
      // Se todos já foram enviados, reinicia o ciclo
      history.sentVerseIds = [];
      const index = Math.floor(Math.random() * CURATED_VERSES.length);
      chosen = CURATED_VERSES[index];
    }

    // Registra no histórico
    history.sentVerseIds.push(chosen.id);
    history.lastSentDate = new Date().toISOString().split("T")[0];
    saveHistory(history);

    return chosen;
  }

  /**
   * Formata a mensagem bíblica com estética limpa e profissional para o WhatsApp
   */
  static formatMessage(verse: BibleVerse): string {
    const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long",
      timeZone: "America/Sao_Paulo",
    }).format(new Date());

    const channelFooter = env.CHANNEL_INVITE_LINK
      ? `\n📢 *Canal Oficial:* ${env.CHANNEL_NAME}\n📲 *Participe:* ${env.CHANNEL_INVITE_LINK}`
      : `\n✨ *${env.CHANNEL_NAME}*`;

    return (
      `☀️ *PALAVRA DO DIA* ☀️\n` +
      `📅 _${dateFormatted}_\n\n` +
      `📖 *${verse.book} ${verse.chapter}:${verse.verse}* (${verse.version})\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `"${verse.text}"\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🕊️ *Tema:* ${verse.theme}\n` +
      `_Que a paz e a sabedoria do Senhor guiem o seu dia!_${channelFooter}`
    );
  }
}
