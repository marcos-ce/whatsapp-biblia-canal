import fs from "fs";
import path from "path";
import { CURATED_VERSES, BibleVerse, DayPeriod } from "./verses.js";
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
  lastSentMorningDate?: string;
  lastSentEveningDate?: string;
}

function loadHistory(): VerseHistory {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) {
    return { sentVerseIds: [] };
  }
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { sentVerseIds: [] };
  }
}

function saveHistory(history: VerseHistory): void {
  ensureDataDir();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
}

export class BibleService {
  /**
   * Obtém o versículo do período (manhã ou noite) evitando repetições recentes
   */
  static getVerseForPeriod(period: "morning" | "evening"): BibleVerse {
    const history = loadHistory();

    // Filtra pelo período desejado
    const pool = CURATED_VERSES.filter((v) => v.period === period || v.period === "any");
    const available = pool.filter((v) => !history.sentVerseIds.includes(v.id));

    let chosen: BibleVerse;

    if (available.length > 0) {
      const index = Math.floor(Math.random() * available.length);
      chosen = available[index];
    } else {
      // Se todos os versículos do período já foram usados, reinicia a lista daquele período
      const poolIds = new Set(pool.map((v) => v.id));
      history.sentVerseIds = history.sentVerseIds.filter((id) => !poolIds.has(id));
      const index = Math.floor(Math.random() * pool.length);
      chosen = pool[index];
    }

    // Registra no histórico
    history.sentVerseIds.push(chosen.id);
    const today = new Date().toISOString().split("T")[0];
    if (period === "morning") {
      history.lastSentMorningDate = today;
    } else {
      history.lastSentEveningDate = today;
    }
    saveHistory(history);

    return chosen;
  }

  /**
   * Formata a mensagem com base no período (Bom dia ou Boa noite)
   */
  static formatMessage(verse: BibleVerse, period: "morning" | "evening"): string {
    const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long",
      timeZone: "America/Sao_Paulo",
    }).format(new Date());

    const channelFooter = env.CHANNEL_INVITE_LINK
      ? `\n📢 *Canal Oficial:* ${env.CHANNEL_NAME}\n📲 *Participe:* ${env.CHANNEL_INVITE_LINK}`
      : `\n✨ *${env.CHANNEL_NAME}*`;

    if (period === "morning") {
      return (
        `☀️ *BOM DIA COM DEUS* ☀️\n` +
        `📅 _${dateFormatted}_\n\n` +
        `📖 *${verse.book} ${verse.chapter}:${verse.verse}* (${verse.version})\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `"${verse.text}"\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🕊️ *Tema:* ${verse.theme}\n` +
        `_Que o Senhor abençoe o seu dia e ilumine cada um dos seus passos!_${channelFooter}`
      );
    } else {
      return (
        `🌙 *BOA NOITE NA PAZ DE DEUS* 🌙\n` +
        `📅 _${dateFormatted}_\n\n` +
        `📖 *${verse.book} ${verse.chapter}:${verse.verse}* (${verse.version})\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `"${verse.text}"\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🕊️ *Tema:* ${verse.theme}\n` +
        `_Entregue o dia que passou ao Senhor e tenha uma noite de sono tranquilo e descanso renovador!_${channelFooter}`
      );
    }
  }
}
