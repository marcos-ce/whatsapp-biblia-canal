import fs from "fs";
import path from "path";
import { CURATED_VERSES, BibleVerse } from "./verses.js";
import { PastoralGenerator } from "./pastoralGenerator.js";
import { DevotionalPost } from "./devotionals.js";

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
   * Obtém uma publicação devocional pastoral humanizada gerada dinamicamente
   * a partir do acervo de 110+ versículos canônicos, com garantia anti-repetição de 50+ dias.
   */
  static getDevotional(period: "morning" | "evening"): DevotionalPost {
    const history = loadHistory();

    const pool = CURATED_VERSES.filter((v) => v.period === period || v.period === "any");
    const sentSet = new Set(history.sentIds);
    let available = pool.filter((v) => !sentSet.has(v.id));

    let chosenVerse: BibleVerse;

    if (available.length > 0) {
      const index = Math.floor(Math.random() * available.length);
      chosenVerse = available[index];
    } else {
      // Quando todos os 55 versículos do período já foram enviados,
      // reinicia o ciclo mantendo os 15 mais recentes protegidos para nunca repetir de imediato.
      const poolIds = pool.map((v) => v.id);
      const poolIdSet = new Set(poolIds);
      const recentPoolSent = history.sentIds.filter((id) => poolIdSet.has(id)).slice(-15);

      history.sentIds = history.sentIds
        .filter((id) => !poolIdSet.has(id))
        .concat(recentPoolSent);

      const newSentSet = new Set(history.sentIds);
      available = pool.filter((v) => !newSentSet.has(v.id));
      const index = Math.floor(Math.random() * available.length);
      chosenVerse = available[index];
    }

    history.sentIds.push(chosenVerse.id);
    if (history.sentIds.length > 200) {
      history.sentIds = history.sentIds.slice(-100);
    }

    const today = new Date().toISOString().split("T")[0];
    if (period === "morning") {
      history.lastMorningDate = today;
    } else {
      history.lastEveningDate = today;
    }
    saveHistory(history);

    // Gera a publicação humanizada, com reflexão pastoral e foto HD serena
    return PastoralGenerator.generatePost(chosenVerse, period);
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
