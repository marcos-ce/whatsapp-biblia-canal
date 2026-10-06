import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleService } from "../bible/bibleService.js";
import { ChannelPublisher } from "../channel/publisher.js";

let lastMorningRunDate: string = "";
let lastEveningRunDate: string = "";

export function startDailyScheduler(): void {
  const pad = (n: number) => String(n).padStart(2, "0");

  logger.info(
    `⏰ Agendador ativo! Programado para 2 envios diários:\n` +
      `   ☀️ Bom Dia:   ${pad(env.MORNING_HOUR)}:${pad(env.MORNING_MINUTE)} (Horário de Brasília)\n` +
      `   🌙 Boa Noite:  ${pad(env.EVENING_HOUR)}:${pad(env.EVENING_MINUTE)} (Horário de Brasília)`
  );

  // Checa a cada 30 segundos
  setInterval(async () => {
    try {
      const now = new Date();
      // Converte para horário de Brasília
      const brTimeStr = now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      const todayStr = now.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });

      const [hourStr, minStr] = brTimeStr.split(":");
      const currentHour = parseInt(hourStr, 10);
      const currentMinute = parseInt(minStr, 10);

      // 1. Disparo de Bom Dia (Manhã)
      if (
        currentHour === env.MORNING_HOUR &&
        currentMinute === env.MORNING_MINUTE &&
        lastMorningRunDate !== todayStr
      ) {
        lastMorningRunDate = todayStr;
        logger.info(`☀️ Horário da manhã atingido (${brTimeStr}). Publicando BOM DIA no canal...`);

        const verse = BibleService.getVerseForPeriod("morning");
        await ChannelPublisher.publishVerse(verse, "morning");
      }

      // 2. Disparo de Boa Noite (Noite)
      if (
        currentHour === env.EVENING_HOUR &&
        currentMinute === env.EVENING_MINUTE &&
        lastEveningRunDate !== todayStr
      ) {
        lastEveningRunDate = todayStr;
        logger.info(`🌙 Horário da noite atingido (${brTimeStr}). Publicando BOA NOITE no canal...`);

        const verse = BibleService.getVerseForPeriod("evening");
        await ChannelPublisher.publishVerse(verse, "evening");
      }
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "Erro na execução do agendador diário.");
    }
  }, 30_000);
}
