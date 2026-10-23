import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Section = "Início" | "Explorar" | "Jogos" | "Aplicativos" | "Biblioteca";
type ProductType = "Jogo" | "Aplicativo";
type Direction = "left" | "right" | "up" | "down";

type CatalogItem = {
  id: string;
  title: string;
  productType: ProductType;
  category: string;
  subcategory: string;
  categoryId: string;
  art: string;
  cover: string;
  tagline: string;
  description: string;
  progress?: number;
  externalUrl?: string;
};

type CategoryMeta = {
  id: string;
  title: string;
  icon: string;
  tint: string;
  subtitle: string;
};

type PlayerSettings = {
  controllerNavigation: boolean;
  reducedMotion: boolean;
  openLinksInNewTab: boolean;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const coverUrl = (fileName: string) => import.meta.env.BASE_URL + "assets/covers/" + fileName;

const categoryMeta: CategoryMeta[] = [
  { id: "game-esportes", title: "Esportes", icon: "◐", tint: "cyan", subtitle: "Futebol, tênis e carreiras" },
  { id: "game-lutas", title: "Lutas", icon: "✦", tint: "red", subtitle: "MMA e boxe" },
  { id: "game-corridas", title: "Corridas", icon: "◌", tint: "blue", subtitle: "Velocidade e gestão" },
  { id: "game-estrategia", title: "Estratégia", icon: "♜", tint: "gold", subtitle: "Impérios, governo e tática" },
  { id: "game-simuladores", title: "Simuladores", icon: "◈", tint: "violet", subtitle: "Operações e gestão" },
  { id: "game-investigacao", title: "Investigação", icon: "⌕", tint: "indigo", subtitle: "Casos, dossiês e crimes" },
  { id: "game-aventura", title: "Aventura e Sobrevivência", icon: "⌁", tint: "green", subtitle: "Escolhas e desafios" },
  { id: "game-ficcao", title: "Ficção Científica", icon: "✧", tint: "sky", subtitle: "Exploração espacial" },
  { id: "game-musica", title: "Música", icon: "♫", tint: "magenta", subtitle: "Carreira e palco" },
  { id: "game-raciocinio", title: "Raciocínio", icon: "♞", tint: "slate", subtitle: "Xadrez e estratégia mental" }
];

const catalog: CatalogItem[] = [
  { id: "vale-empires", title: "Vale Empires", productType: "Jogo", category: "Estratégia", subcategory: "Impérios e construção RTS", categoryId: "game-estrategia", art: "empires", cover: coverUrl("vale-empires.png"), tagline: "Construa seu legado", description: "Erga cidades, forme alianças e defenda o seu reino em uma campanha de estratégia épica.", progress: 72, externalUrl: "https://vale-empires.vercel.app" },
  { id: "f1-vale-gold-edition", title: "F1 Vale Gold Edition", productType: "Jogo", category: "Corridas", subcategory: "Fórmula 1 — edição Gold", categoryId: "game-corridas", art: "velocity", cover: coverUrl("f1-vale-gold-edition.png"), tagline: "Corra rumo à glória", description: "Controle a sua equipe, defina a estratégia e conquiste cada curva da temporada.", progress: 45, externalUrl: "https://jonatanoficial-bit.github.io/F1-VALE-EDITION/" },
  { id: "vale-futebol-manager", title: "Vale Futebol Manager", productType: "Jogo", category: "Esportes", subcategory: "Futebol", categoryId: "game-esportes", art: "club", cover: coverUrl("vale-futebol-manager-2026.png"), tagline: "Da tática à taça", description: "Construa um elenco vencedor e guie o seu clube até as maiores conquistas.", progress: 60 },
  { id: "vale-chess-3d", title: "Vale Chess 3D", productType: "Jogo", category: "Raciocínio", subcategory: "Xadrez 3D", categoryId: "game-raciocinio", art: "chess", cover: coverUrl("vale-chess-3d.png"), tagline: "A mente no comando", description: "Evolua na carreira mundial de xadrez, dispute torneios e alcance o topo do ranking.", externalUrl: "https://vale-chess-3-d.vercel.app" },
  { id: "vale-gridiron-manager", title: "Vale Gridiron Manager", productType: "Jogo", category: "Esportes", subcategory: "Futebol americano", categoryId: "game-esportes", art: "gridiron", cover: coverUrl("vale-gridiron-manager.png"), tagline: "Monte. Gerencie. Conquiste.", description: "Faça scouting, gerencie contratos e conduza o seu time até o campeonato.", externalUrl: "https://vale-gridiron-manager.vercel.app" },
  { id: "skyward-control", title: "Skyward Control", productType: "Jogo", category: "Simuladores", subcategory: "Controle de tráfego aéreo", categoryId: "game-simuladores", art: "skyward", cover: coverUrl("skyward-control.png"), tagline: "Os céus em movimento", description: "Coordene rotas, tráfego aéreo e operações complexas em aeroportos movimentados.", externalUrl: "https://atc-simulador.vercel.app" },
  { id: "atc-sky-flow", title: "ATC Sky Flow", productType: "Jogo", category: "Simuladores", subcategory: "Controle de tráfego aéreo", categoryId: "game-simuladores", art: "atc", cover: coverUrl("atc-skyflow.png"), tagline: "Cada voo sob controle", description: "Gerencie decolagens, aterrissagens e o fluxo aéreo em um aeroporto global.", externalUrl: "https://atc-sky-flow-1-0.vercel.app" },
  { id: "vale-airline-manager", title: "Vale Airline Manager", productType: "Jogo", category: "Simuladores", subcategory: "Companhias aéreas e rotas", categoryId: "game-simuladores", art: "airline", cover: coverUrl("vale-airline-manager.png"), tagline: "Conquiste os céus", description: "Planeje rotas, expanda a frota e transforme sua companhia em referência mundial.", externalUrl: "https://vale-airline-menager.vercel.app" },
  { id: "vale-metro-control", title: "Vale Metro Control", productType: "Jogo", category: "Simuladores", subcategory: "Metrô e transporte urbano", categoryId: "game-simuladores", art: "metro", cover: coverUrl("vale-metro-control.png"), tagline: "Cidades em movimento", description: "Projete redes, coordene linhas e mantenha uma metrópole sempre conectada.", externalUrl: "https://vale-metro-control.vercel.app" },
  { id: "medical-simulator", title: "Medical Simulator", productType: "Jogo", category: "Simuladores", subcategory: "Medicina e urgência hospitalar", categoryId: "game-simuladores", art: "medical", cover: coverUrl("simulador-medico-emergencia.png"), tagline: "Decida. Atenda. Salve vidas.", description: "Assuma emergências críticas, organize a equipe e tome decisões que fazem a diferença.", externalUrl: "https://medical-simulator-vale-editon-v2-0.vercel.app" },
  { id: "vale-fight-manager", title: "Vale Fight Manager", productType: "Jogo", category: "Lutas", subcategory: "MMA e boxe", categoryId: "game-lutas", art: "fight", cover: coverUrl("vale-fight-manager.png"), tagline: "Arena e estratégia", description: "Descubra atletas, monte equipes de alto nível e conquiste os maiores eventos de luta.", externalUrl: "https://vale-fight-manager.vercel.app" },
  { id: "tenis-manager", title: "Tênis Manager", productType: "Jogo", category: "Esportes", subcategory: "Tênis", categoryId: "game-esportes", art: "tennis", cover: coverUrl("tenis-manager.png"), tagline: "Ascensão ao topo", description: "Prepare atletas, escolha torneios e escreva uma trajetória vencedora no circuito mundial.", externalUrl: "https://tenis-academia-1-0.vercel.app" },
  { id: "last-horizon", title: "Last Horizon", productType: "Jogo", category: "Ficção Científica", subcategory: "Agência espacial e exploração", categoryId: "game-ficcao", art: "horizon", cover: coverUrl("last-horizon.png"), tagline: "Além das estrelas", description: "Explore, construa e sobreviva em uma jornada espacial pela fronteira da humanidade.", externalUrl: "https://last-horizon.vercel.app" },
  { id: "band-legacy", title: "Band Legacy", productType: "Jogo", category: "Música", subcategory: "Gestão de banda e carreira musical", categoryId: "game-musica", art: "band", cover: coverUrl("band-legacy.png"), tagline: "Faça história no palco", description: "Monte sua banda, ensaie, grave e conduza apresentações inesquecíveis.", externalUrl: "https://band-legacy.vercel.app" },
  { id: "190-operador", title: "190 Operador / Central 190", productType: "Jogo", category: "Simuladores", subcategory: "Emergências e despacho", categoryId: "game-simuladores", art: "operador", cover: coverUrl("190-operador.png"), tagline: "Cada chamada importa", description: "Coordene ocorrências, equipes e operações em uma São Paulo viva e dinâmica.", externalUrl: "https://190-xi.vercel.app" },
  { id: "2030-ultimo-comando", title: "2030 — O Último Comando", productType: "Jogo", category: "Aventura e Sobrevivência", subcategory: "Thriller narrativo interativo", categoryId: "game-aventura", art: "comando", cover: coverUrl("2030-ultimo-comando.png"), tagline: "O futuro está em suas mãos", description: "Assuma o comando global em uma crise que decide o destino do planeta." },
  { id: "a-ultima-palavra", title: "A Última Palavra", productType: "Jogo", category: "Estratégia", subcategory: "Estratégia por turnos e decisões", categoryId: "game-estrategia", art: "palavra", cover: coverUrl("a-ultima-palavra.png"), tagline: "Justiça além do limite", description: "Investigue escolhas decisivas e atravesse um mundo em que a verdade redefine o destino." },
  { id: "airport-manager", title: "Airport Manager", productType: "Jogo", category: "Simuladores", subcategory: "Gestão de aeroportos", categoryId: "game-simuladores", art: "airport", cover: coverUrl("airport-manager.jpg"), tagline: "O aeroporto sob seu comando", description: "Planeje operações, administre rotas e faça seu aeroporto crescer com precisão." },
  { id: "diplocraft", title: "Diplocraft", productType: "Jogo", category: "Estratégia", subcategory: "Diplomacia e governo", categoryId: "game-estrategia", art: "diplocraft", cover: coverUrl("diplocraft.png"), tagline: "O mundo em negociação", description: "Conduza cúpulas, negocie acordos e transforme decisões diplomáticas em influência global.", externalUrl: "https://diplografik.vercel.app" },
  { id: "crown-of-state", title: "Crown of State", productType: "Jogo", category: "Estratégia", subcategory: "Governo e decisões políticas", categoryId: "game-estrategia", art: "crown", cover: coverUrl("crown-of-state.png"), tagline: "O peso da coroa", description: "Lidere o Estado, organize seu conselho e defina o futuro de uma nação." },
  { id: "valley-city-crime-unit", title: "Valley City — Crime Unit (Detetive 2026)", productType: "Jogo", category: "Investigação", subcategory: "Detetive e crimes", categoryId: "game-investigacao", art: "crime", cover: coverUrl("valley-city-crime-unit.png"), tagline: "Todo caso deixa pistas", description: "Analise dossiês, conecte evidências e resolva casos que movimentam Valley City." },
  { id: "modern-war-dominion", title: "Modern War Dominion", productType: "Jogo", category: "Estratégia", subcategory: "Guerra moderna e bases militares", categoryId: "game-estrategia", art: "dominion", cover: coverUrl("modern-war-dominion.png"), tagline: "Comando em escala global", description: "Coordene bases, tecnologia e forças aliadas em um cenário de guerra moderna.", externalUrl: "https://modern-war-dominion.vercel.app" },
  { id: "moto-racing-manager", title: "Moto Racing Manager", productType: "Jogo", category: "Corridas", subcategory: "Motovelocidade e gestão", categoryId: "game-corridas", art: "moto", cover: coverUrl("moto-racing-manager.png"), tagline: "Velocidade com estratégia", description: "Gerencie pilotos, equipe e cada decisão da temporada nas pistas de motovelocidade.", externalUrl: "https://moto-gp-one.vercel.app" }
];

const menu: Section[] = ["Início", "Explorar", "Jogos", "Aplicativos", "Biblioteca"];
const progressItems = catalog.filter((item) => item.progress !== undefined);
const newCoverIds = ["modern-war-dominion", "moto-racing-manager", "diplocraft", "crown-of-state", "valley-city-crime-unit", "190-operador"];
const defaultSettings: PlayerSettings = { controllerNavigation: true, reducedMotion: false, openLinksInNewTab: true };

function readSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("vale-games-settings-v1") || "{}") as Partial<PlayerSettings>;
    return { ...defaultSettings, ...saved };
  } catch {
    return defaultSettings;
  }
}

function focusInDirection(direction: Direction) {
  const items = Array.from(document.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])")).filter((item) => item.offsetParent !== null);
  if (!items.length) return;
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const current = active && items.includes(active) ? active : items[0];
  if (!active || !items.includes(active)) {
    current.focus();
    return;
  }
  const source = current.getBoundingClientRect();
  const sourceX = source.left + source.width / 2;
  const sourceY = source.top + source.height / 2;
  const candidates = items.filter((item) => item !== current).map((item) => {
    const rect = item.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const dx = x - sourceX;
    const dy = y - sourceY;
    const valid = direction === "left" ? dx < -4 : direction === "right" ? dx > 4 : direction === "up" ? dy < -4 : dy > 4;
    const primary = direction === "left" || direction === "right" ? Math.abs(dx) : Math.abs(dy);
    const secondary = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
    return { item, valid, score: primary + secondary * 1.6 };
  }).filter((candidate) => candidate.valid).sort((a, b) => a.score - b.score);
  (candidates[0] ? candidates[0].item : current).focus();
}

function activateFocused() {
  const active = document.activeElement;
  if (active instanceof HTMLButtonElement) active.click();
}

function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("todos");
  const [activeSubcategory, setActiveSubcategory] = useState("todos");
  const [activeHero, setActiveHero] = useState(0);
  const [detail, setDetail] = useState<CatalogItem | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<PlayerSettings>(readSettings);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [toast, setToast] = useState<{ message: string; caption: string } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("vale-games-favorites-v1") || "[]") as string[]; } catch { return []; }
  });

  const showToast = useCallback((message: string, caption: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ message, caption });
    toastTimer.current = window.setTimeout(() => setToast(null), 4400);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);
  useEffect(() => { localStorage.setItem("vale-games-favorites-v1", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("vale-games-settings-v1", JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const clearPrompt = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", clearPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", clearPrompt);
    };
  }, []);

  const selectMenu = useCallback((item: Section) => {
    setSection(item);
    setQuery("");
    setActiveCategoryId("todos");
    setActiveSubcategory("todos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const exploreCategory = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    setActiveSubcategory("todos");
    setQuery("");
    setSection("Jogos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const returnToPlatform = useCallback(() => {
    if (detail) {
      setDetail(null);
      return;
    }
    if (settingsOpen) {
      setSettingsOpen(false);
      return;
    }
    selectMenu("Início");
  }, [detail, selectMenu, settingsOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        returnToPlatform();
        return;
      }
      if (event.target instanceof HTMLInputElement) return;
      const directions: Record<string, Direction> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (directions[event.key]) {
        event.preventDefault();
        focusInDirection(directions[event.key]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [returnToPlatform]);

  useEffect(() => {
    if (!settings.controllerNavigation) return;
    const held = new Set<number>();
    let frame = 0;
    const map: Record<number, () => void> = {
      0: activateFocused,
      1: returnToPlatform,
      12: () => focusInDirection("up"),
      13: () => focusInDirection("down"),
      14: () => focusInDirection("left"),
      15: () => focusInDirection("right"),
      100: () => focusInDirection("left"),
      101: () => focusInDirection("right"),
      102: () => focusInDirection("up"),
      103: () => focusInDirection("down")
    };
    const poll = () => {
      const pressed = new Set<number>();
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      Array.from(gamepads).filter((gamepad): gamepad is Gamepad => Boolean(gamepad)).forEach((gamepad) => {
        gamepad.buttons.forEach((button, index) => { if (button.pressed) pressed.add(index); });
        if (gamepad.axes[0] < -0.65) pressed.add(100);
        if (gamepad.axes[0] > 0.65) pressed.add(101);
        if (gamepad.axes[1] < -0.65) pressed.add(102);
        if (gamepad.axes[1] > 0.65) pressed.add(103);
      });
      pressed.forEach((button) => {
        if (!held.has(button)) map[button]?.();
      });
      held.clear();
      pressed.forEach((button) => held.add(button));
      frame = window.requestAnimationFrame(poll);
    };
    frame = window.requestAnimationFrame(poll);
    return () => window.cancelAnimationFrame(frame);
  }, [returnToPlatform, settings.controllerNavigation]);

  const filteredItems = useMemo(() => catalog.filter((item) => {
    const text = [item.title, item.category, item.subcategory, item.productType].join(" ").toLocaleLowerCase();
    return text.includes(query.toLocaleLowerCase()) && (activeCategoryId === "todos" || item.categoryId === activeCategoryId) && (activeSubcategory === "todos" || item.subcategory === activeSubcategory);
  }), [activeCategoryId, activeSubcategory, query]);

  const sectionItems = useMemo(() => {
    if (section === "Biblioteca") return catalog.filter((item) => favorites.includes(item.id));
    if (section === "Jogos") return filteredItems.filter((item) => item.productType === "Jogo");
    if (section === "Aplicativos") return filteredItems.filter((item) => item.productType === "Aplicativo");
    return filteredItems;
  }, [favorites, filteredItems, section]);

  const activeCategory = categoryMeta.find((category) => category.id === activeCategoryId);
  const visibleSubcategories = useMemo(() => Array.from(new Set(catalog.filter((item) => item.categoryId === activeCategoryId).map((item) => item.subcategory))), [activeCategoryId]);
  const heroItems = catalog.slice(0, 3);
  const hero = heroItems[activeHero];

  const toggleFavorite = (item: CatalogItem) => {
    setFavorites((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]);
  };

  const play = (item: CatalogItem) => {
    setDetail(null);
    if (!item.externalUrl) {
      showToast(item.title + " ainda aguarda o link oficial", "A capa e a classificação já estão no Vale Games Play; o inventário ainda não traz um endereço jogável direto.");
      return;
    }
    if (settings.openLinksInNewTab) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
      showToast("Abrindo " + item.title, "O jogo abriu em outra aba. Esta aba do Vale Games Play permanece pronta para você escolher outro título.");
      return;
    }
    window.location.assign(item.externalUrl);
  };

  const updateSetting = (key: keyof PlayerSettings) => setSettings((current) => ({ ...current, [key]: !current[key] }));
  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    setInstallPrompt(null);
    showToast(result.outcome === "accepted" ? "Vale Games Play instalado" : "Instalação cancelada", result.outcome === "accepted" ? "O aplicativo agora pode ser aberto pela tela inicial do seu celular." : "Você pode instalar depois pelo menu do Chrome.");
  };

  return <main className={["app-shell", settings.reducedMotion ? "reduced-motion" : ""].join(" ")}>
    <header className="topnav">
      <button className="wordmark" onClick={() => selectMenu("Início")} aria-label="Vale Games Play, início"><span className="mark">V</span><span>VALE GAMES <b>PLAY</b></span></button>
      <nav aria-label="Navegação principal">{menu.map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => selectMenu(item)}>{item}</button>)}</nav>
      <label className="search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("Explorar"); }} placeholder="Buscar jogos, categorias..." /></label>
      {installPrompt && <button className="install-trigger" onClick={installApp}><span>⇩</span><b>Instalar</b></button>}
      <button className="settings-trigger" aria-label="Configurações" onClick={() => setSettingsOpen(true)}>⚙</button>
      <button className="notification" aria-label="Notificações">♧<i /></button>
      <button className="profile" onClick={() => selectMenu("Biblioteca")}><span className="avatar">CS</span><span><b>Meu Perfil</b><small>Assinante</small></span><em>⌄</em></button>
    </header>

    {section === "Início"
      ? <Home hero={hero} heroItems={heroItems} activeHero={activeHero} setActiveHero={setActiveHero} onOpen={setDetail} onPlay={play} onNavigate={selectMenu} onExploreCategory={exploreCategory} favorites={favorites} onFavorite={toggleFavorite} />
      : <CatalogView section={section} items={sectionItems} query={query} activeCategoryId={activeCategoryId} activeCategory={activeCategory} subcategories={visibleSubcategories} activeSubcategory={activeSubcategory} onSelectCategory={exploreCategory} onSelectSubcategory={setActiveSubcategory} favorites={favorites} onFavorite={toggleFavorite} onOpen={setDetail} onPlay={play} onNavigate={selectMenu} />}

    <nav className="mobile-nav" aria-label="Navegação móvel">{menu.map((item, index) => <button key={item} className={section === item ? "active" : ""} onClick={() => selectMenu(item)}><span>{["⌂", "⌕", "◌", "▦", "♡"][index]}</span>{item}</button>)}</nav>
    {detail && <DetailModal item={detail} favorite={favorites.includes(detail.id)} onClose={() => setDetail(null)} onPlay={play} onFavorite={() => toggleFavorite(detail)} />}
    {settingsOpen && <SettingsModal settings={settings} onToggle={updateSetting} onClose={() => setSettingsOpen(false)} />}
    {toast && <div className="toast" role="status"><span>✓</span>{toast.message}<small>{toast.caption}</small></div>}
  </main>;
}

function Home({ hero, heroItems, activeHero, setActiveHero, onOpen, onPlay, onNavigate, onExploreCategory, favorites, onFavorite }: { hero: CatalogItem; heroItems: CatalogItem[]; activeHero: number; setActiveHero: (index: number) => void; onOpen: (item: CatalogItem) => void; onPlay: (item: CatalogItem) => void; onNavigate: (section: Section) => void; onExploreCategory: (categoryId: string) => void; favorites: string[]; onFavorite: (item: CatalogItem) => void }) {
  const newCovers = newCoverIds.map((id) => catalog.find((item) => item.id === id)).filter((item): item is CatalogItem => Boolean(item));
  const featured = [catalog[0], catalog[1], catalog[10], catalog[18]];
  return <div className="home-page">
    <section className={"hero hero-" + hero.art} style={{ "--hero-image": "url(\"" + hero.cover + "\")" } as CSSProperties}>
      <div className="hero-noise" />
      <div className="hero-content"><span className="kicker">DESTAQUE DA SEMANA</span><h1>{hero.title}</h1><h2>{hero.tagline}</h2><p>{hero.description}</p><div className="hero-actions"><button className="primary-action" onClick={() => onPlay(hero)}>▶ Jogar agora</button><button className="outline-action" onClick={() => onOpen(hero)}>Detalhes</button></div><div className="hero-dots">{heroItems.map((item, index) => <button aria-label={"Mostrar " + item.title} key={item.id} className={activeHero === index ? "selected" : ""} onClick={() => setActiveHero(index)} />)}</div></div>
      <div className="hero-badge"><span>⌘</span><div><small>VALE GAMES PLAY</small><b>Jogos e apps em um só lugar</b></div></div>
    </section>
    <ContentRow title="Continue jogando" action="Ver biblioteca" onAction={() => onNavigate("Biblioteca")}><div className="continue-grid">{progressItems.slice(0, 5).map((item) => <GameCard key={item.id} item={item} compact onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div></ContentRow>
    <ContentRow title="Explore por categoria" action="Todos os jogos" onAction={() => onNavigate("Jogos")}><div className="category-grid">{categoryMeta.map((category) => <button className={"category-tile " + category.tint} onClick={() => onExploreCategory(category.id)} key={category.id}><span>{category.icon}</span><b>{category.title}</b><small>{category.subtitle}</small></button>)}</div></ContentRow>
    <ContentRow title="Em destaque" action="Ver catálogo" onAction={() => onNavigate("Explorar")}><div className="game-grid">{featured.map((item) => <GameCard key={item.id} item={item} onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div></ContentRow>
    <ContentRow title="Capas recém-aprovadas" action="Ver jogos" onAction={() => onNavigate("Jogos")}><div className="game-grid">{newCovers.map((item) => <GameCard key={item.id} item={item} onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div></ContentRow>
  </div>;
}

function CatalogView({ section, items, query, activeCategoryId, activeCategory, subcategories, activeSubcategory, onSelectCategory, onSelectSubcategory, favorites, onFavorite, onOpen, onPlay, onNavigate }: { section: Section; items: CatalogItem[]; query: string; activeCategoryId: string; activeCategory?: CategoryMeta; subcategories: string[]; activeSubcategory: string; onSelectCategory: (categoryId: string) => void; onSelectSubcategory: (subcategory: string) => void; favorites: string[]; onFavorite: (item: CatalogItem) => void; onOpen: (item: CatalogItem) => void; onPlay: (item: CatalogItem) => void; onNavigate: (section: Section) => void }) {
  const heading = section === "Biblioteca" ? "Minha Biblioteca" : section === "Aplicativos" ? "Aplicativos" : section === "Jogos" ? activeCategory ? activeCategory.title : "Jogos" : activeCategory ? activeCategory.title : "Explorar";
  const intro = section === "Biblioteca"
    ? "Seus favoritos ficam salvos neste dispositivo."
    : section === "Aplicativos"
      ? "Os aplicativos recebem destaque assim que suas capas oficiais forem aprovadas."
      : query
        ? "Resultados para “" + query + "”"
        : activeCategory
          ? activeCategory.title + " · escolha uma subcategoria ou descubra todos os títulos desta divisão."
          : "Catálogo organizado por categoria e subcategoria oficiais.";
  const showFilters = section !== "Biblioteca" && section !== "Aplicativos";
  return <section className="catalog-page">
    <div className="catalog-banner"><div><span className="kicker">VALE GAMES PLAY</span><h1>{heading}</h1><p>{intro}</p></div>{section !== "Biblioteca" && <div className="catalog-tabs"><button className={section === "Explorar" ? "active" : ""} onClick={() => onNavigate("Explorar")}>Todos</button><button className={section === "Jogos" ? "active" : ""} onClick={() => onNavigate("Jogos")}>Jogos</button><button className={section === "Aplicativos" ? "active" : ""} onClick={() => onNavigate("Aplicativos")}>Apps</button></div>}</div>
    {showFilters && <><div className="catalog-filters" aria-label="Categorias"><button className={activeCategoryId === "todos" ? "active" : ""} onClick={() => onSelectCategory("todos")}>Todos</button>{categoryMeta.map((category) => <button className={activeCategoryId === category.id ? "active" : ""} key={category.id} onClick={() => onSelectCategory(category.id)}>{category.icon} {category.title}</button>)}</div>{activeCategory && subcategories.length > 1 && <div className="subcategory-filters" aria-label="Subcategorias"><span>Subcategoria</span><button className={activeSubcategory === "todos" ? "active" : ""} onClick={() => onSelectSubcategory("todos")}>Todas</button>{subcategories.map((subcategory) => <button className={activeSubcategory === subcategory ? "active" : ""} key={subcategory} onClick={() => onSelectSubcategory(subcategory)}>{subcategory}</button>)}</div>}</>}
    {items.length ? <div className="catalog-grid">{items.map((item) => <GameCard key={item.id} item={item} onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div> : <EmptyState section={section} onNavigate={onNavigate} />}
  </section>;
}

function EmptyState({ section, onNavigate }: { section: Section; onNavigate: (section: Section) => void }) {
  const library = section === "Biblioteca";
  const apps = section === "Aplicativos";
  return <div className="empty-library"><span>{library ? "♡" : apps ? "▦" : "⌕"}</span><h2>{library ? "Sua biblioteca está esperando" : apps ? "Aplicativos em preparação" : "Nenhum resultado encontrado"}</h2><p>{library ? "Abra um título e toque no coração para montar sua seleção pessoal." : apps ? "O inventário está organizado; os cards entram na vitrine quando as capas oficiais forem aprovadas." : "Tente buscar por outro título, categoria ou subcategoria."}</p><button className="primary-action" onClick={() => onNavigate(library ? "Jogos" : "Explorar")}>{library ? "Explorar jogos" : "Explorar catálogo"}</button></div>;
}

function GameCard({ item, compact = false, favorite, onFavorite, onOpen, onPlay }: { item: CatalogItem; compact?: boolean; favorite: boolean; onFavorite: (item: CatalogItem) => void; onOpen: (item: CatalogItem) => void; onPlay: (item: CatalogItem) => void }) {
  return <article className={["game-card", compact ? "compact" : ""].filter(Boolean).join(" ")}><button className={"cover cover-" + item.art} style={{ backgroundImage: "url(\"" + item.cover + "\")" }} onClick={() => onOpen(item)} aria-label={"Ver detalhes de " + item.title}><span className="cover-shine" /></button><div className="card-info"><div><h3>{item.title}</h3><span>{item.category}</span><small className="subcategory-label">{item.subcategory}</small></div><button className={favorite ? "heart saved" : "heart"} aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} onClick={() => onFavorite(item)}>{favorite ? "♥" : "♡"}</button></div>{item.progress !== undefined ? <div className="progress"><span><i style={{ width: item.progress + "%" }} /></span><b>{item.progress}%</b></div> : <button className="play-link" onClick={() => onPlay(item)}>{item.externalUrl ? "Jogar" : "Link pendente"} <span>→</span></button>}</article>;
}

function DetailModal({ item, favorite, onClose, onPlay, onFavorite }: { item: CatalogItem; favorite: boolean; onClose: () => void; onPlay: (item: CatalogItem) => void; onFavorite: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="detail-modal" role="dialog" aria-modal="true" aria-label={"Detalhes de " + item.title} onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={onClose} aria-label="Voltar à vitrine">×</button><div className={"detail-art cover-" + item.art} style={{ backgroundImage: "url(\"" + item.cover + "\")" }} /><div className="detail-copy"><span className="tag">{item.productType} · {item.category}</span><h2>{item.title}</h2><p>{item.description}</p><div className="detail-metadata"><span><b>CATEGORIA</b>{item.category}</span><span><b>SUBCATEGORIA</b>{item.subcategory}</span><span><b>ACESSO</b>{item.externalUrl ? "Link oficial salvo" : "Link aguardando envio"}</span></div><div className="modal-actions"><button className="primary-action" onClick={() => onPlay(item)}>▶ {item.externalUrl ? "Jogar agora" : "Ver status"}</button><button className={favorite ? "outline-action favorite" : "outline-action"} onClick={onFavorite}>{favorite ? "♥ Na biblioteca" : "♡ Favoritar"}</button><button className="text-action" onClick={onClose}>← Voltar à vitrine</button></div><small className="placeholder-note">{item.externalUrl ? "Ao jogar, o título abre em outra aba por padrão; o Vale Games Play continua aberto para a próxima escolha." : "Capa oficial integrada. O inventário mestre ainda não informa um endereço direto para este título."}</small></div></section></div>;
}

function SettingsModal({ settings, onToggle, onClose }: { settings: PlayerSettings; onToggle: (key: keyof PlayerSettings) => void; onClose: () => void }) {
  const rows: Array<{ key: keyof PlayerSettings; title: string; description: string }> = [
    { key: "controllerNavigation", title: "Navegação por controle", description: "Direcional/analógico move o foco, A abre ou confirma e B volta para o Vale Play." },
    { key: "openLinksInNewTab", title: "Abrir jogos em nova aba", description: "Mantém a plataforma aberta para você voltar e escolher outro jogo, como em um hub de jogos." },
    { key: "reducedMotion", title: "Reduzir animações", description: "Diminui transições e efeitos visuais nesta plataforma." }
  ];
  return <div className="modal-backdrop settings-backdrop" role="presentation" onMouseDown={onClose}><section className="settings-modal" role="dialog" aria-modal="true" aria-label="Configurações" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={onClose} aria-label="Fechar configurações">×</button><span className="kicker">SUA EXPERIÊNCIA</span><h2>Configurações</h2><p>Preferências salvas somente neste dispositivo.</p><div className="settings-list">{rows.map((row) => <div className="settings-row" key={row.key}><div><b>{row.title}</b><small>{row.description}</small></div><button className={settings[row.key] ? "switch active" : "switch"} onClick={() => onToggle(row.key)} aria-label={row.title + (settings[row.key] ? " ativado" : " desativado")} aria-pressed={settings[row.key]}><i /></button></div>)}</div><button className="primary-action settings-done" onClick={onClose}>Concluir</button></section></div>;
}

function ContentRow({ title, action, onAction, children }: { title: string; action: string; onAction: () => void; children: ReactNode }) { return <section className="content-row"><div className="row-heading"><h2>{title}<span>›</span></h2><button onClick={onAction}>{action} <span>›</span></button></div>{children}</section>; }

export default App;
