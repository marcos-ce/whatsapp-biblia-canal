import fs from "fs";
import path from "path";
import { DEVOTIONALS, DevotionalPost } from "./devotionals.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const HISTORY_FILE = path.resolve(DATA_DIR, "history.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

interface DevotionalHistory {
  sentIds: number[];
  lastMorningDate?: string;
  lastEveningDate?: string;
}

function loadHistory(): DevotionalHistory {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) {
    return { sentIds: [] };
  }
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { sentIds: [] };
  }
}

function saveHistory(history: DevotionalHistory): void {
  ensureDataDir();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
}

export class BibleService {
  /**
   * Obtém o devocional humanizado do período (manhã ou noite) sem repetições recentes
   */
  static getDevotional(period: "morning" | "evening"): DevotionalPost {
    const history = loadHistory();

    const pool = DEVOTIONALS.filter((d) => d.period === period);
    const available = pool.filter((d) => !history.sentIds.includes(d.id));

    let chosen: DevotionalPost;

    if (available.length > 0) {
      const index = Math.floor(Math.random() * available.length);
      chosen = available[index];
    } else {
      // Se todos os devocionais do período já foram enviados, reinicia o histórico desse período
      const poolIds = new Set(pool.map((d) => d.id));
      history.sentIds = history.sentIds.filter((id) => !poolIds.has(id));
      const index = Math.floor(Math.random() * pool.length);
      chosen = pool[index];
    }

    history.sentIds.push(chosen.id);
    const today = new Date().toISOString().split("T")[0];
    if (period === "morning") {
      history.lastMorningDate = today;
    } else {
      history.lastEveningDate = today;
    }
    saveHistory(history);

    return chosen;
  }

  /**
   * Formata a mensagem com tom 100% acolhedor, humano e natural (sem linhas robóticas ou tags)
   */
  static formatMessage(post: DevotionalPost): string {
    return (
      `${post.greeting}\n\n` +
      `${post.reflection}\n\n` +
      `📖 *${post.book} ${post.chapter}:${post.verse}*\n` +
      `"${post.scripture}"\n\n` +
      `${post.blessing}`
    );
  }
}
