import fs from "fs";
import path from "path";
import sharp from "sharp";
import { DevotionalPost } from "./devotionals.js";
import { logger } from "../utils/logger.js";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function cleanTextForImage(text: string): string {
  // Remove emojis para renderização limpa e universal em fontes de servidores Linux/Windows
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapText(text: string, maxCharsPerLine = 44): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      if (current.trim()) lines.push(current.trim());
      current = word;
    } else {
      current += (current ? " " : "") + word;
    }
  }

  if (current.trim()) {
    lines.push(current.trim());
  }

  return lines;
}

export class ImageGenerator {
  /**
   * Renderiza a imagem devocional sagrada sobrepondo o texto de Bênçãos e Orações
   * sobre a imagem oficial da Bíblia Sagrada em alta resolução e fonte ampliada.
   */
  static async generateDevotionalCard(post: DevotionalPost): Promise<Buffer> {
    const assetPath = path.resolve(process.cwd(), "assets", "images", "bible-background.jpg");
    let bgBuffer: Buffer;

    if (fs.existsSync(assetPath)) {
      bgBuffer = fs.readFileSync(assetPath);
    } else {
      logger.warn({ assetPath }, "Imagem de fundo da Bíblia não encontrada. Gerando fundo gradiente alternativo.");
      bgBuffer = await sharp({
        create: {
          width: 1024,
          height: 682,
          channels: 3,
          background: { r: 15, g: 23, b: 42 },
        },
      })
        .jpeg()
        .toBuffer();
    }

    const meta = await sharp(bgBuffer).metadata();
    const width = meta.width || 1024;
    const height = meta.height || 682;

    const isMorning = post.period === "morning";
    const headerTitle = isMorning
      ? "✦ ORAÇÃO E BÊNÇÃO DA MANHÃ ✦"
      : "✦ ORAÇÃO E BÊNÇÃO DA NOITE ✦";

    const cleanBlessing = cleanTextForImage(post.blessing);
    const lines = wrapText(cleanBlessing, 44);

    // Tipografia ampliada: fonte 32px (ou 28px se mais de 3 linhas) para legibilidade perfeita no celular
    const fontSize = lines.length > 3 ? 28 : 32;
    const lineHeight = fontSize + 16;

    // Calcula posição vertical para centralizar com perfeição no terço escuro superior da foto
    const totalTextHeight = lines.length * lineHeight;
    const availableCenterY = 210;
    const startY = Math.max(145, Math.round(availableCenterY - totalTextHeight / 2));

    const tspans = lines
      .map((line, idx) => {
        const escaped = escapeXml(line);
        return `<tspan x="512" dy="${idx === 0 ? "0" : `${lineHeight}`}">${escaped}</tspan>`;
      })
      .join("");

    const headerEscaped = escapeXml(headerTitle);

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.88"/>
          <stop offset="65%" stop-color="#000000" stop-opacity="0.60"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.0"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.98"/>
        </filter>
      </defs>
      
      <!-- Degradê suave para contraste absoluto do texto sobre o fundo -->
      <rect x="0" y="0" width="${width}" height="400" fill="url(#overlay)" />
      
      <!-- Título de Oração / Bênção em Ouro (24px em negrito com sombra) -->
      <text x="512" y="68" text-anchor="middle" font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" fill="#facc15" letter-spacing="3" filter="url(#shadow)">${headerEscaped}</text>
      
      <!-- Linha dourada de destaque e separação -->
      <line x1="280" y1="92" x2="744" y2="92" stroke="#facc15" stroke-width="2" stroke-opacity="0.8" />
      
      <!-- Texto da Bênção / Oração em tipografia ampliada de alto impacto -->
      <text x="512" y="${startY}" text-anchor="middle" font-family="DejaVu Sans, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="600" fill="#ffffff" filter="url(#shadow)">${tspans}</text>
    </svg>`;

    return sharp(bgBuffer)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 92 })
      .toBuffer();
  }
}
