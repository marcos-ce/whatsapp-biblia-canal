import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { BibleService } from "../bible/bibleService.js";
import { ChannelPublisher } from "../channel/publisher.js";

let lastMorningRunDate: string = "";
let lastEveningRunDate: string = "";

export function startDailyScheduler(): void {
  const pad = (n: number) => String(n).padStart(2, "0");

  logger.info(
    `⏰ Agendador ativo e 100% automático:\n` +
      `   ☀️ 06h00: Foto HD + Devocional de BOM DIA\n` +
      `   🌙 18h00: Foto HD + Devocional de BOA NOITE`
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
        logger.info(`☀️ Horário da manhã atingido (${brTimeStr}). Publicando foto e devocional no canal...`);

        const post = BibleService.getDevotional("morning");
        await ChannelPublisher.publishDevotional(post);
      }

      // 2. Disparo de Boa Noite (Noite)
      if (
        currentHour === env.EVENING_HOUR &&
        currentMinute === env.EVENING_MINUTE &&
        lastEveningRunDate !== todayStr
      ) {
        lastEveningRunDate = todayStr;
        logger.info(`🌙 Horário da noite atingido (${brTimeStr}). Publicando foto e devocional no canal...`);

        const post = BibleService.getDevotional("evening");
        await ChannelPublisher.publishDevotional(post);
      }
    } catch (err: any) {
      logger.error({ err: err?.message || err }, "Erro na execução do agendador diário.");
    }
  }, 30_000);
}
