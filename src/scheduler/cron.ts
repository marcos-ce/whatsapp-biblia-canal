import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleService } from "../bible/bibleService.js";
import { ChannelPublisher } from "../channel/publisher.js";

let lastRunDate: string = "";

export function startDailyScheduler(): void {
  const targetHour = env.SCHEDULE_HOUR;
  const targetMinute = env.SCHEDULE_MINUTE;

  const pad = (n: number) => String(n).padStart(2, "0");
  logger.info(
    `⏰ Agendador ativo! Postagem diária configurada para as ${pad(targetHour)}:${pad(targetMinute)} (Horário de Brasília).`
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

      if (
        currentHour === targetHour &&
        currentMinute === targetMinute &&
        lastRunDate !== todayStr
      ) {
        lastRunDate = todayStr;
        logger.info(`⏰ Horário atingido (${brTimeStr}). Iniciando postagem matinal no canal...`);

        const verse = BibleService.getDailyVerse();
        await ChannelPublisher.publishVerse(verse);
      }
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "Erro na execução do agendador diário.");
    }
  }, 30_000);
}
