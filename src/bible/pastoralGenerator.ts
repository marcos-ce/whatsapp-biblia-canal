import { BibleVerse, VerseTheme } from "./verses.js";
import { DevotionalPost } from "./devotionals.js";

// ─────────────────────────────────────────────────────────────────
// ☀️ SAUDAÇÕES DA MANHÃ (HUMANIZADAS, ACOLHEDORAS, NATURAIS)
// ─────────────────────────────────────────────────────────────────
const MORNING_GREETINGS = [
  "Bom dia! Que a presença e a paz de Deus encham o seu coração nesta manhã. ✨",
  "A paz do Senhor! Hoje é um novo dia, e com ele vem uma nova oportunidade de recomeçar. ☀️",
  "Bom dia com alegria e gratidão! Que o Espírito Santo renove suas forças logo cedo. 🌿",
  "Bom dia! Levante a cabeça com fé e ânimo, pois Deus preparou um dia abençoado para você. 🦁",
  "A paz de Cristo, família! Que a sua manhã comece leve, serena e cercada pela graça divina. 🕊️",
  "Bom dia! Mais uma manhã se inicia debaixo dos cuidados fiéis do nosso Pai Celestial. 🌅",
  "Bom dia na doce presença do Senhor! Que sua mente seja guardada em paz em cada decisão de hoje. 💡",
  "A paz do Senhor para o seu coração! Entregue o seu acordar a Deus e confie nos Seus planos perfeitos. 🌸",
  "Bom dia! Que o amor do Senhor seja o seu escudo e a sua força em cada passo desta jornada. 🛡️",
  "Bom dia, amados! O sol raiou e a misericórdia do Pai se renovou sobre a sua vida e seu lar. 🌾",
  "A paz de Cristo! Respire fundo, agradeça pelo dom da vida e comece o dia com o coração firmado em Deus. ☕",
  "Bom dia! Que a sabedoria do Alto guie suas palavras, seus pensamentos e suas ações hoje. 📖",
  "Bom dia! Não temas o dia de hoje, pois Aquele que te chamou já vai à sua frente aplainando caminhos. 🚶‍♂️",
  "A paz do Senhor! Que a bondade de Deus te alcance logo cedo e encha seu dia de esperança. 🏡",
  "Bom dia! O Senhor é bom em todo o tempo, e hoje não será diferente. Tenha um amanhecer abençoado! ☀️",
  "Bom dia, povo de Deus! Que a paz que excede todo o entendimento tome conta do seu coração. 🕊️",
  "A paz de Cristo! Desperte o seu coração com louvor, pois grandes coisas o Senhor fará hoje por você. 🎶",
  "Bom dia! Que nenhuma preocupação roube o entusiasmo de viver este dia que Deus nos deu de presente. 🌼",
  "Bom dia na paz do Senhor! Que as bênçãos dos céus desçam sobre o seu trabalho e os seus projetos. 🌱",
  "A paz do Senhor! Que a fidelidade de Deus te sustente em cada momento deste novo dia. 🧭",
];

// ─────────────────────────────────────────────────────────────────
// 🌙 SAUDAÇÕES DA NOITE (TRANQUILIZADORAS, PROFUNDAS, SERENAS)
// ─────────────────────────────────────────────────────────────────
const EVENING_GREETINGS = [
  "Boa noite! Que a paz e o doce descanso de Deus envolvam o seu coração agora. 🌙",
  "A paz do Senhor! O dia terminou e agora é o momento de descansar debaixo das asas do Pai. 🕊️",
  "Boa noite, família! Deixe as correrias de lado e permita que a serenidade de Deus tome conta do seu lar. 🕯️",
  "Boa noite! Entregue todas as lutas e cansaços deste dia nas mãos do Senhor, pois Ele cuida de você. ✨",
  "A paz de Cristo! Que o silêncio desta noite traga alívio e renovação profunda para a sua alma. 🌌",
  "Boa noite! É hora de acalmar os pensamentos e se deitar com a certeza de que Deus está no controle de tudo. 🛏️",
  "A paz do Senhor! Que o amor do Pai encha seu quarto de paz e afaste todo peso ou preocupação. 🌿",
  "Boa noite! Mais um dia vivido debaixo da fidelidade divina. Seja grato pelo que passou e descanse em fé. 🌾",
  "Boa noite na presença de Jesus! Solte o fardo das mãos; o Senhor vela o seu sono enquanto você dorme. 🛡️",
  "A paz de Cristo para você e sua família! Que esta seja uma noite de descanso suave e reparador. 🌠",
  "Boa noite! Não leve para a cama as ansiedades de amanhã. O amanhã pertence a Deus. ☕",
  "A paz do Senhor! Descanse sua mente na certeza de que nada foge aos olhos do nosso Protetor. 📖",
  "Boa noite, amados! Que os anjos do Senhor guardem a sua casa e guardem os seus sonhos nesta noite. 🏠",
  "Boa noite! Respire em paz. Você fez o seu melhor hoje, e o que faltou, Deus completa com graça. 🕊️",
  "A paz de Cristo! Uma noite abençoada para renovar as energias e acordar cheio de vigor e esperança. 💤",
  "Boa noite! Que a mansidão do Espírito Santo acalme todas as tempestades internas do seu coração. 🌊",
  "A paz do Senhor! Em silêncio e oração, agradecemos a Deus por cada vitória e livramento deste dia. 🙏",
  "Boa noite! Que a segurança do Todo-Poderoso seja a sua cobertura e o seu refúgio durante a noite. 🏰",
  "Boa noite! Durma em profunda serenidade sabendo que o Senhor que te guarda nunca dorme nem cochila. 👁️",
  "A paz de Cristo! Que o refrigério do céu visite a sua vida e renove completamente suas forças. 🌟",
];

// ─────────────────────────────────────────────────────────────────
// 📖 REFLEXÕES PASTORAIS POR TEMA (MANHÃ E NOITE)
// ─────────────────────────────────────────────────────────────────
const THEME_REFLECTIONS: Record<VerseTheme, { morning: string[]; evening: string[] }> = {
  Paz: {
    morning: [
      "A paz não é a ausência de lutas ou de problemas ao nosso redor; é a presença constante de Jesus no centro da nossa vida. Comece o seu dia descansando na certeza de que nenhum imprevisto pode abalar quem está firmado na rocha.",
      "Antes que a pressa do mundo tente acelerar os seus passos, encha o seu coração da serenidade do Senhor. Quando andamos em harmonia com Deus, as tempestades externas perdem a força de nos desestabilizar.",
      "Em um mundo que tantas vezes nos sobrecarrega com barulho e pressa, a paz de Cristo é o nosso ancoradouro seguro. Deixe que essa tranquilidade guie suas palavras, seus pensamentos e suas atitudes em cada minuto deste dia.",
      "Você não precisa carregar o peso do mundo nos ombros logo cedo. Entregue suas preocupações a Deus e permita que a paz celestial reine sobre a sua casa e suas decisões hoje.",
      "Quando a nossa confiança está em Deus, até os dias mais agitados transcorrem com leveza no espírito. Respire fundo, receba a paz divina e siga com serenidade e convicção.",
    ],
    evening: [
      "O dia chegou ao fim, e é hora de desarmar o coração de todas as tensões acumuladas. Entregue os acontecimentos de hoje nas mãos de Deus e receba a paz que acalma a mente e restaura a alma.",
      "Deixe as preocupações do lado de fora do seu quarto. O que você não conseguiu resolver hoje, Deus já está cuidando nos bastidores. Acalme o seu espírito e acolha o silêncio restaurador desta noite.",
      "Não permita que a ansiedade roube a sua noite de repouso. Jesus nos deixou a Sua própria paz — uma paz que o mundo não entende nem pode tirar. Descanse com essa garantia.",
      "Aquiete a sua alma diante do Senhor. Desligue as cobranças, solte as incertezas e confie que o Deus da paz é o guardião dos seus caminhos e do seu lar.",
      "Esta noite é um presente para você recuperar a serenidade. Olhe para trás apenas para agradecer e deite-se debaixo da doce paz que vem do Espírito Santo.",
    ],
  },
  Fé: {
    morning: [
      "A fé não exige que vejamos todas as respostas antes de dar o primeiro passo; ela nos dá a coragem de caminhar sabendo Quem segura a nossa mão. Dê o primeiro passo hoje com total confiança em Deus.",
      "Começar o dia com fé muda completamente a nossa perspectiva. Onde os olhos naturais enxergam barreiras, os olhos da fé contemplam o agir poderoso do Altíssimo abrindo portas.",
      "Não meça o tamanho do seu dia pelas suas próprias limitações, mas pelo poder infinito do Deus a quem você serve. Firme a sua fé na fidelidade do Senhor e avance sem hesitar.",
      "A cada amanhecer, Deus nos convida a renovar a nossa confiança n'Ele. Mesmo que você não saiba exatamente o que o dia trará, você sabe que o Senhor já está em cada detalhe.",
      "Fé é o oxigênio que sustenta a nossa caminhada. Não permita que a dúvida enfraqueça o seu ânimo hoje: o mesmo Deus que te sustentou no passado é fiel para fazer infinitamente mais neste dia.",
    ],
    evening: [
      "Terminar o dia com fé é ter a humildade de dizer: 'Senhor, eu fiz o que pude, e agora descanso confiando na Tua soberania'. O Seu cuidado não cessa quando nós dormimos.",
      "Talvez nem tudo tenha saído como você planejou hoje, mas a fé nos lembra de que Deus tem o tempo certo para cada propósito. Feche os olhos com a certeza de que o amanhã trará novidade de vida.",
      "Quando deitamos nossa cabeça no travesseiro com o coração cheio de fé, o medo do futuro se dissipa. Aquele que começou uma boa obra em você permanece fiel e continuará cuidando de tudo.",
      "A fé é o melhor lençol para a nossa alma. Ela nos permite adormecer tranquilos, certos de que as promessas de Deus continuam de pé sobre a nossa vida e a nossa família.",
      "Mesmo no escuro da noite, a luz da fé brilha nos corações que confiam no Pai. Durma em paz, sabendo que as orações feitas hoje foram ouvidas nos céus.",
    ],
  },
  Força: {
    morning: [
      "Existem manhãs em que acordamos sentindo o cansaço do caminho, mas a Palavra nos ensina que o poder de Deus se aperfeiçoa na nossa fraqueza. Levante-se sabendo que você é capacitado pelo Alto para vencer.",
      "Você não precisa enfrentar os desafios de hoje dependendo apenas dos seus próprios recursos. O Senhor renova o vigor dos cansados e multiplica as forças daquele que não tem nenhum vigor.",
      "Não olhe para os obstáculos à sua frente com desânimo. O Deus que te chamou é a sua fortaleza inabalável, e com Ele você é mais do que vencedor em qualquer circunstância.",
      "A verdadeira coragem nasce quando reconhecemos que o Todo-Poderoso vai à nossa frente. Respire com determinação, erga a cabeça e tome posse da força que Deus reservou para o seu dia.",
      "Que a alegria do Senhor seja a sua força nesta manhã! Ela é o combustível que sustenta o nosso caminhar mesmo em meio às tarefas mais exigentes da rotina.",
    ],
    evening: [
      "Você lutou com dedicação hoje, suportou as pressões e chegou até aqui. Agora, é o momento sagrado de depor as armas e receber a força restauradora que Deus concede através do repouso.",
      "Não se sinta culpado pelo cansaço do corpo ou da mente. Ele é o lembrete de que somos humanos e de que dependemos do cuidado do nosso Criador para recarregar nossas energias.",
      "A força de amanhã começa na capacidade de descansar hoje. Solte as rédeas das suas lutas, deite em paz e permita que o Senhor restabeleça o seu vigor enquanto você dorme.",
      "Deus viu cada esforço que você fez ao longo deste dia. Entregue a Ele todo o desgaste acumulado e confie que Ele está renovando sua vitalidade interior nesta noite.",
      "O mesmo Deus forte que te deu vitória durante o dia é a rocha que te sustenta em repouso durante a noite. Durma com o coração fortalecido em Sua graça.",
    ],
  },
  Sabedoria: {
    morning: [
      "Em cada conversa, decisão e encruzilhada de hoje, busque a sabedoria do Alto. Ela é luz para o discernimento e nos livra de palavras precipitadas e escolhas desgastantes.",
      "Mais valiosa do que qualquer conquista passageira é a sabedoria que vem de Deus. Peça a orientação do Espírito Santo para cada detalhe do seu trabalho e relacionamentos hoje.",
      "Quando começamos o dia consultando o Senhor, os nossos passos se tornam mais firmes e a nossa mente ganha clareza para distinguir o que é essencial do que é secundário.",
      "Que os seus pensamentos sejam moldados pela verdade da Palavra de Deus nesta manhã. A sabedoria divina transforma problemas complicados em oportunidades de aprendizado e crescimento.",
      "Não se apoie apenas na sua própria intuição. Consagre seus planos a Deus logo cedo, e Ele alinhará suas ações com o Seu propósito perfeito.",
    ],
    evening: [
      "Ao olhar para o dia que termina, a sabedoria nos ensina a guardar no coração as lições preciosas e a soltar aquilo que não podemos mudar. Que a reflexão desta noite traga maturidade ao seu espírito.",
      "Dormir em paz é uma atitude de sabedoria. Compreender que somos finitos e que Deus é infinito nos liberta da ilusão de querer controlar tudo a todo momento.",
      "A sabedoria do Senhor nos aconselha até durante o silêncio da noite. Deixe que os pensamentos de Deus acalmem seu coração enquanto você se prepara para dormir.",
      "Agradeça pelas decisões acertadas e entregue à misericórdia de Deus os erros do percurso. O sábio descansa sabendo que cada dia traz uma nova chance de crescer.",
      "Que o silêncio da noite seja um refúgio para a sua alma meditar na grandeza de Deus e acolher Sua sabedoria para o novo dia que virá.",
    ],
  },
  Esperança: {
    morning: [
      "Uma nova manhã significa que a história de Deus com você não terminou. Por mais escura que tenha sido a noite, o sol sempre nasce, trazendo novas misericórdias e horizontes de esperança.",
      "A esperança bíblica não é um mero otimismo humano; é a convicção inabalável de que o futuro pertence a um Deus bom que tem pensamentos de paz sobre a nossa vida.",
      "Comece este dia com o coração aberto para ser surpreendido pela bondade do Pai. As promessas d'Ele não falham, e o melhor d'Ele ainda está sendo tecido em sua história.",
      "Não permita que experiências difíceis do passado ditem o tom do seu presente. Hoje é um novo capítulo assinado pela graça de Deus, cheio de possibilidades e vitórias.",
      "A esperança no Senhor renova a nossa alegria e ilumina nosso olhar. Levante-se com o coração pulsando fé: Deus já está trabalhando naquilo que você tem pedido em oração.",
    ],
    evening: [
      "Mesmo que o dia de hoje tenha trazido dores ou incertezas, a esperança cristã permanece como uma âncora firme na alma. O choro pode durar uma noite, mas a alegria do Senhor sempre vem.",
      "Ao fechar os olhos nesta noite, lembre-se de que o amanhã é uma página em branco nas mãos do Criador. Descanse com a certeza de que Ele continua sendo o Deus das surpresas e das restaurações.",
      "A esperança em Deus não nos decepciona. Guarde o seu coração no amor do Pai e adormeça com a doce expectativa de que coisas grandiosas estão sendo preparadas para você.",
      "Não desanime com o ritmo do processo. Cada noite que você se deita em fidelidade a Deus é um passo mais próximo do cumprimento dos planos perfeitos d'Ele para sua vida.",
      "Deixe a esperança embalar o seu sono. O Senhor está no comando de tudo, e a fidelidade d'Ele dura para sempre.",
    ],
  },
  Amor: {
    morning: [
      "O amor incondicional de Deus é o abraço que nos acolhe a cada despertar. Saber que somos infinitamente amados pelo Pai nos dá segurança para viver este dia com leveza e generosidade.",
      "Que o amor de Cristo seja o filtro pelo qual você enxergará as pessoas hoje. Seja um instrumento de gentileza, paciência e compaixão em um mundo tão carente de acolhimento.",
      "Nada neste mundo tem o poder de nos separar do amor de Deus. Caminhe hoje com a certeza de que você é precioso, querido e guardado pelo Criador do universo.",
      "Começar o dia lembrando do amor divino nos liberta de todo medo e cobrança excessiva. Permita que esse amor encha o seu coração e transborde para todos ao seu redor.",
      "O maior mandamento é o amor, e é no amor que a nossa vida encontra seu mais nobre sentido. Que hoje suas palavras e ações reflitam o carinho do Pai Celestial.",
    ],
    evening: [
      "Nesta noite, sinta-se envolvido pelo amor paciente e eterno de Deus. Ele te conhece por inteiro, conhece suas dores e celebra suas vitórias com alegria paternal.",
      "O perfeito amor de Deus afasta todo medo e inquietação. Acomode-se no cuidado do Pai, sabendo que você nunca estará só ou desamparado.",
      "Agradeça pelo amor demonstrado nos pequenos detalhes do dia que passou: no alimento, no abraço de alguém querido, no fôlego de vida. Descanse envolto nessa doce afeição.",
      "Não durma guardando ressentimentos ou mágoas. Perdoe, liberte o seu coração e permita que o amor de Jesus limpe qualquer amargura, trazendo um sono suave.",
      "O amor do Pai é o lar seguro onde a nossa alma encontra descanso verdadeiro. Durma abençoado e amado além de qualquer medida.",
    ],
  },
  Gratidão: {
    morning: [
      "Acordar com vida, saúde e fôlego já é um milagre extraordinário. Quando começamos a manhã com um coração grato, tudo ao nosso redor ganha uma cor mais bonita e vibrante.",
      "A gratidão abre as janelas da alma para contemplar as bênçãos diárias que tantas vezes passam despercebidas. Que a sua oração de hoje comece com um sincero 'Obrigado, meu Deus!'.",
      "Em vez de focar no que ainda falta, escolha celebrar o que Deus já colocou em suas mãos. Um espírito agradecido atrai a presença do Senhor e enche o dia de alegria genuína.",
      "Este é um novo dia concedido pela bondade de Deus. Receba cada hora como um presente divino e viva com entusiasmo e louvor no coração.",
      "A gratidão é o antídoto contra a murmuração e o desânimo. Comece a sua jornada de hoje exaltando a fidelidade do Criador que nunca falha.",
    ],
    evening: [
      "Quantos livramentos silenciosos e bênçãos discretas Deus nos concedeu ao longo deste dia! Antes de fechar os olhos, tire um momento para agradecer por cada detalhe da Sua providência.",
      "Mesmo que o dia tenha sido desafiador, sempre há motivos para agradecer: pela proteção, pelo pão de cada dia, pelo amparo nas horas difíceis. A gratidão fecha o dia com chave de ouro.",
      "Deitar com o coração grato faz a alma descansar leve. Reconhecer a mão de Deus em nossa história é o segredo para ter um sono verdadeiramente reparador.",
      "Obrigado, Senhor, por mais um dia vencido debaixo da Tua graça. Que o nosso louvor desta noite suba como incenso suave até a Tua presença.",
      "Dê graças por tudo o que aconteceu hoje, pois até nos momentos difíceis o Senhor esteve te moldando e te sustentando. Tenha uma noite repleta de santa gratidão.",
    ],
  },
  Proteção: {
    morning: [
      "Ao sair para as tarefas de hoje, lembre-se de que o Senhor é o seu escudo e a sua fortaleza. Você não caminha desprotegido; os olhos de Deus velam continuamente por você.",
      "Nenhuma adversidade do caminho pode prevalecer contra a vida de quem está abrigado debaixo das asas do Altíssimo. Caminhe com segurança e tranquilidade hoje.",
      "Deus promete guardar a sua entrada e a sua saída, hoje e para todo o sempre. Confie a sua família, seu trabalho e seus passos ao cuidado dos anjos do Senhor.",
      "O Senhor é o refúgio seguro onde encontramos abrigo em qualquer circunstância. Avance sem temor, pois o Deus de Israel vai à sua frente e é também a sua retaguarda.",
      "Coloque o seu dia sob a cobertura divina. Com Deus como seu defensor, você pode seguir em paz e com o coração absolutamente sereno.",
    ],
    evening: [
      "Aquele que guarda você não dorme nem tosqueneja. Enquanto você descansa, o Todo-Poderoso vigia o seu sono e o de toda a sua família.",
      "Não tema as inquietações da noite nem as incertezas que tentam assombrar o pensamento. O Senhor é a sua torre forte, e debaixo da Sua sombra você está completamente seguro.",
      "Feche a sua porta com a convicção de que o Senhor está ao redor do seu lar. Nada pode roubar a paz daqueles que confiam inteiramente no Pai Celestial.",
      "Entregue a sua noite ao Deus Protetor. Solte os temores e acolha a paz de saber que a mão d'Ele é o lugar mais seguro do universo.",
      "O Senhor é o seu refúgio permanente. Deite-se com a alma sossegada, abrigado na fidelidade inabalável do Criador.",
    ],
  },
  Descanso: {
    morning: [
      "Descanso não é apenas a ausência de trabalho físico, mas um estado de paz interior. Mesmo diante de uma rotina cheia, aprenda a caminhar descansando na providência e no amor do Senhor.",
      "Jesus nos ensinou a viver um dia de cada vez, sem permitir que a pressa roube a nossa comunhão com Deus. Respire a calmaria do Espírito Santo logo cedo.",
      "Comece a sua manhã a partir de um lugar de descanso em Cristo: não trabalhe sobrecarregado, mas viva a partir da graça que Ele derramou generosamente sobre você.",
      "Entregue os fardos desnecessários antes de começar a caminhar. O jugo de Jesus é suave e o Seu fardo é leve; receba essa leveza para o seu coração hoje.",
      "A presença de Deus é o melhor refúgio para quem busca serenidade no ritmo acelerado do dia a dia. Encontre nesta manhã o refrigério que só o Mestre pode dar.",
    ],
    evening: [
      "Venham a mim todos os que estão cansados e sobrecarregados, diz o Senhor. Acomode-se no aconchego do amor de Deus e permita que Ele tire o fardo pesado das suas costas agora.",
      "O descanso é uma ordem e um presente divino. Não gaste as horas da noite remoendo preocupações que você não pode resolver na cama. Descanse em obediência e fé.",
      "Aos Seus amados, o Senhor concede o sono reparador. Que o silêncio desta noite cure o cansaço do seu corpo e devolva a doçura e a clareza à sua alma.",
      "Pare as engrenagens da mente, desligue as cobranças e entregue-se ao abraço acolhedor de Deus. Amanhã Ele te dará forças renovadas; esta noite foi feita para repousar.",
      "Durma nos braços do Pai Celestial. Que o Seu Espírito Santo sopre uma brisa suave de serenidade sobre o seu quarto e traga sonhos pacíficos e revigorantes.",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────
// 🙏 BÊNÇÃOS E ORAÇÕES FINAIS (MANHÃ E NOITE)
// ─────────────────────────────────────────────────────────────────
const MORNING_BLESSINGS = [
  "Que o seu dia seja iluminado, produtivo e cheio de livramentos. Vá em paz e com muita fé! 🙏",
  "Que as bênçãos do Altíssimo acompanhem você em cada lugar onde seus pés pisarem hoje. Um dia vitorioso! ✨",
  "Que Deus guarde a sua saída e a sua chegada, abençoe suas mãos de trabalho e traga harmonia ao seu lar. Amém! 🕊️",
  "Que a graça do Senhor transborde no seu coração e faça deste um dia inesquecível de conquistas e paz. Tenha um excelente dia! 🌟",
  "Que nenhuma palavra de desânimo tenha poder sobre você hoje. Siga firme debaixo da cobertura de Deus! Um dia abençoado! 🛡️",
  "Que as portas certas se abram e que a sabedoria divina ilumine cada decisão que você tomar. Tenha um dia maravilhoso! 💡",
  "Que a presença de Deus seja o seu refúgio constante ao longo de todas as horas deste dia. Vá com confiança! 🌿",
  "Que o amor do Pai te cerque de bênçãos e que você seja um canal de paz para todos ao seu redor. Bom dia! 🌸",
  "Que o Senhor renove o seu ânimo e te conceda um dia produtivo, leve e ricamente abençoado. Siga em paz! ☀️",
  "Que a fidelidade de Deus seja a sua certeza e a alegria do Senhor seja a sua força hoje e sempre. Um dia de vitórias! 🦁",
  "Que o Espírito Santo sopre vida, saúde e paz sobre você e sobre toda a sua família nesta manhã. Amém! 🌾",
  "Que cada desafio de hoje se transforme em testemunho da fidelidade do Senhor em sua vida. Tenha um dia extraordinário! ✨",
  "Que a doce paz de Jesus guarde o seu coração e os seus pensamentos ao longo de todo o dia. Vá com Deus! 🕊️",
  "Que o Senhor faça resplandecer o Seu rosto sobre ti e te conceda graça em tudo o que você realizar hoje. Amém! 🌅",
  "Que você sinta o cuidado de Deus em cada pequeno detalhe do seu dia. Tenha um dia muito abençoado! 🙏",
  "Que a mão poderosa do Senhor afaste todo perigo e conduza seus passos rumo à vitória. Um dia de bênçãos! 🛡️",
  "Que a alegria do Evangelho seja a sua canção nesta manhã. Tenha um dia produtivo, protegido e alegre! 🎶",
  "Que você encontre favor e graça diante de Deus e dos homens em todas as suas tarefas de hoje. Fique na paz! 🌱",
  "Que a esperança em Cristo ilumine o seu olhar e renove a sua disposição para vencer mais um dia. Um dia abençoado! 🌼",
  "Que Deus abençoe a sua casa, o seu trabalho e todos os desejos justos do seu coração. Tenha um ótimo dia! 🏡",
];

const EVENING_BLESSINGS = [
  "Tenha uma noite de sono tranquilo, reparador e protegido. Que a paz de Deus reine em seu lar! 🌙",
  "Que o Senhor renove todas as suas forças durante esta noite e te prepare para um amanhã vitorioso. Durma em paz! 🙏",
  "Que os anjos de Deus acampem ao redor da sua casa e guardem o sono de toda a sua família. Uma noite abençoada! 🕊️",
  "Deite a cabeça no travesseiro com o coração leve e sereno. Deus já está cuidando de tudo para amanhã. Boa noite! ✨",
  "Que o refrigério do céu alcance sua mente e seu corpo nesta noite. Que seu descanso seja suave e abençoado! 🌠",
  "Que a doce paz de Cristo envolva o seu quarto e afaste qualquer inquietação. Tenha uma noite serena e revigorante! 🕯️",
  "Durma debaixo do abrigo seguro do Todo-Poderoso. Que a fidelidade de Deus seja o seu escudo nesta noite! 🛡️",
  "Que o Senhor derrame bálsamo sobre as suas canseiras e faça o seu sono ser doce e tranquilo. Fique com Deus! 🌿",
  "Que a presença consoladora do Espírito Santo guarde seus sonhos e renove a sua esperança para o novo dia. Boa noite! 🌌",
  "Descanse sabendo que você é profundamente amado pelo Pai. Uma noite abençoada e cheia de paz para você e sua família! 🌾",
  "Que o amor de Jesus dissipe todo o cansaço e traga restauração completa ao seu corpo e à sua mente. Durma em paz! 🛏️",
  "Que a graça e a misericórdia do Altíssimo cubram o seu lar durante todas as vigílias desta noite. Amém! 🏰",
  "Durma com o coração grato por tudo o que Deus fez hoje. O amanhã trará novas bênçãos! Uma santa e abençoada noite! 🌟",
  "Que o Senhor seja o seu repouso seguro e que a manhã te encontre cheio de renovo e gratidão. Boa noite! 💤",
  "Que nenhuma preocupação tire a sua serenidade nesta noite. Confie no Senhor e durma em perfeita paz! 🕊️",
  "Que os pensamentos de Deus encham a sua alma de calmaria e esperança. Uma noite de sono abençoado para você! 📖",
  "Que a bênção do Pai, do Filho e do Espírito Santo guarde a sua vida e a sua casa nesta noite. Amém! 🙏",
  "Que você acorde revigorado, pronto para viver um novo dia debaixo do favor divino. Durma no sossego do Senhor! 🌙",
  "Que o silêncio da noite traga descanso para o seu corpo e refrigério para a sua alma. Tenha uma noite abençoada! ☕",
  "Que a paz de Deus, que excede todo o entendimento, seja o guardião do seu sono até o raiar do sol. Boa noite! ✨",
];

// ─────────────────────────────────────────────────────────────────
// 🖼️ GALERIA DE FOTOS HD VERIFICADAS (NATUREZA SERENA, BÍBLIA, ALVORECER, ENTARDECER)
// ─────────────────────────────────────────────────────────────────
const MORNING_PHOTOS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&q=80",
  "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=1080&q=80",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1080&q=80",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1080&q=80",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1080&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1080&q=80",
  "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1080&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1080&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1080&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1080&q=80",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1080&q=80",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1080&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1080&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1080&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1080&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080&q=80",
];

const EVENING_PHOTOS = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&q=80",
  "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1080&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&q=80",
  "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1080&q=80",
  "https://images.unsplash.com/photo-1511497584788-87676104235f?w=1080&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1080&q=80",
  "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1080&q=80",
  "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?w=1080&q=80",
  "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1080&q=80",
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1080&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1080&q=80",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca45b?w=1080&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1080&q=80",
  "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1080&q=80",
  "https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=1080&q=80",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1080&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&q=80",
];

function pickRandom<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export class PastoralGenerator {
  /**
   * Constrói dinamicamente uma publicação devocional humanizada, acolhedora
   * e estritamente fiel às Escrituras Sagradas a partir de um versículo bíblico canônico.
   */
  static generatePost(verse: BibleVerse, period: "morning" | "evening"): DevotionalPost {
    const greeting =
      period === "morning"
        ? pickRandom(MORNING_GREETINGS)
        : pickRandom(EVENING_GREETINGS);

    const themeReflections = THEME_REFLECTIONS[verse.theme] || THEME_REFLECTIONS["Paz"];
    const reflectionPool =
      period === "morning" ? themeReflections.morning : themeReflections.evening;
    const reflection = pickRandom(reflectionPool);

    const blessing =
      period === "morning"
        ? pickRandom(MORNING_BLESSINGS)
        : pickRandom(EVENING_BLESSINGS);

    const imageUrl =
      period === "morning"
        ? pickRandom(MORNING_PHOTOS)
        : pickRandom(EVENING_PHOTOS);

    return {
      id: verse.id,
      period,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      scripture: verse.text,
      greeting,
      reflection,
      blessing,
      imageUrl,
    };
  }
}
