export interface DevotionalPost {
  id: number;
  period: "morning" | "evening";
  book: string;
  chapter: number;
  verse: number | string;
  scripture: string;
  greeting: string;
  reflection: string;
  blessing: string;
  imageUrl?: string;
}

/**
 * Devocionais pré-carregados mantidos por compatibilidade.
 * O bot utiliza o motor dinâmico PastoralGenerator em conjunto com ImageGenerator,
 * gerando a arte oficial com a Oração/Bênção sobreposta à Bíblia Sagrada.
 */
export const DEVOTIONALS: DevotionalPost[] = [];
