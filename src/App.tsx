import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Section = "Início" | "Explorar" | "Jogos" | "Aplicativos" | "Biblioteca";
type Category = "Estratégia" | "Corrida" | "Simulação" | "Ação" | "Aventura" | "Esportes" | "Áudio" | "Criação";

type CatalogItem = {
  id: string;
  title: string;
  category: Category;
  format: "Jogo" | "App";
  art: string;
  cover: string;
  tagline: string;
  description: string;
  progress?: number;
  externalUrl?: string;
};

const catalog: CatalogItem[] = [
  { id: "vale-empires", title: "Vale Empires", category: "Estratégia", format: "Jogo", art: "empires", cover: "/assets/covers/vale-empires.png", tagline: "Construa seu legado", description: "Erga cidades, forme alianças e defenda o seu reino em uma campanha de estratégia épica.", progress: 72, externalUrl: "https://vale-empires.vercel.app" },
  { id: "f1-vale-gold-edition", title: "F1 Vale Gold Edition", category: "Corrida", format: "Jogo", art: "velocity", cover: "/assets/covers/f1-vale-gold-edition.png", tagline: "Corra rumo à glória", description: "Controle a sua equipe, defina a estratégia e conquiste cada curva da temporada.", progress: 45, externalUrl: "https://jonatanoficial-bit.github.io/F1-VALE-EDITION/" },
  { id: "vale-futebol-manager-2026", title: "Vale Futebol Manager 2026", category: "Esportes", format: "Jogo", art: "club", cover: "/assets/covers/vale-futebol-manager-2026.png", tagline: "Da tática à taça", description: "Construa um elenco vencedor e guie o seu clube até as maiores conquistas.", progress: 60 },
  { id: "vale-chess-3d", title: "Vale Chess 3D", category: "Estratégia", format: "Jogo", art: "chess", cover: "/assets/covers/vale-chess-3d.png", tagline: "A mente no comando", description: "Evolua na carreira mundial de xadrez, dispute torneios e alcance o topo do ranking.", externalUrl: "https://vale-chess-3-d.vercel.app" },
  { id: "vale-gridiron-manager", title: "Vale Gridiron Manager", category: "Esportes", format: "Jogo", art: "gridiron", cover: "/assets/covers/vale-gridiron-manager.png", tagline: "Monte. Gerencie. Conquiste.", description: "Faça scouting, gerencie contratos e conduza o seu time até o campeonato.", externalUrl: "https://vale-gridiron-manager.vercel.app" },
  { id: "skyward-control", title: "Skyward Control", category: "Simulação", format: "Jogo", art: "skyward", cover: "/assets/covers/skyward-control.png", tagline: "Os céus em movimento", description: "Coordene rotas, tráfego aéreo e operações complexas em aeroportos movimentados.", externalUrl: "https://atc-simulador.vercel.app" },
  { id: "atc-skyflow", title: "ATC SkyFlow", category: "Simulação", format: "Jogo", art: "atc", cover: "/assets/covers/atc-skyflow.png", tagline: "Cada voo sob controle", description: "Gerencie decolagens, aterrissagens e o fluxo aéreo em um aeroporto global.", externalUrl: "https://atc-sky-flow-1-0.vercel.app" },
  { id: "vale-airline-manager", title: "Vale Airline Manager", category: "Simulação", format: "Jogo", art: "airline", cover: "/assets/covers/vale-airline-manager.png", tagline: "Conquiste os céus", description: "Planeje rotas, expanda a frota e transforme sua companhia em referência mundial.", externalUrl: "https://vale-airline-menager.vercel.app" },
  { id: "vale-metro-control", title: "Vale Metro Control", category: "Simulação", format: "Jogo", art: "metro", cover: "/assets/covers/vale-metro-control.png", tagline: "Cidades em movimento", description: "Projete redes, coordene linhas e mantenha uma metrópole sempre conectada.", externalUrl: "https://vale-metro-control.vercel.app" },
  { id: "simulador-medico-emergencia", title: "Medical Simulator", category: "Simulação", format: "Jogo", art: "medical", cover: "/assets/covers/simulador-medico-emergencia.png", tagline: "Decida. Atenda. Salve vidas.", description: "Assuma emergências críticas, organize a equipe e tome decisões que fazem a diferença.", externalUrl: "https://medical-simulator-vale-editon-v2-0.vercel.app" },
  { id: "vale-fight-manager", title: "Vale Fight Manager", category: "Esportes", format: "Jogo", art: "fight", cover: "/assets/covers/vale-fight-manager.png", tagline: "Arena e estratégia", description: "Descubra atletas, monte equipes de alto nível e conquiste os maiores eventos de luta.", externalUrl: "https://vale-fight-manager.vercel.app" },
  { id: "tenis-manager", title: "Tênis Manager", category: "Esportes", format: "Jogo", art: "tennis", cover: "/assets/covers/tenis-manager.png", tagline: "Ascensão ao topo", description: "Prepare atletas, escolha torneios e escreva uma trajetória vencedora no circuito mundial.", externalUrl: "https://tenis-academia-1-0.vercel.app" },
  { id: "last-horizon", title: "Last Horizon", category: "Aventura", format: "Jogo", art: "horizon", cover: "/assets/covers/last-horizon.png", tagline: "Além das estrelas", description: "Explore, construa e sobreviva em uma jornada espacial pela fronteira da humanidade.", externalUrl: "https://last-horizon.vercel.app" },
  { id: "band-legacy", title: "Band Legacy", category: "Áudio", format: "App", art: "band", cover: "/assets/covers/band-legacy.png", tagline: "Faça história no palco", description: "Monte sua banda, ensaie, grave e conduza apresentações inesquecíveis.", externalUrl: "https://band-legacy.vercel.app" }
];

const categoryTiles: Array<{ title: Category; icon: string; tint: string; subtitle: string }> = [
  { title: "Corrida", icon: "◌", tint: "blue", subtitle: "Velocidade e gestão" },
  { title: "Estratégia", icon: "♜", tint: "gold", subtitle: "Impérios e tática" },
  { title: "Simulação", icon: "◈", tint: "red", subtitle: "Mundos para gerir" },
  { title: "Ação", icon: "✦", tint: "violet", subtitle: "Missões e desafios" },
  { title: "Aventura", icon: "⌁", tint: "green", subtitle: "Novas descobertas" },
  { title: "Esportes", icon: "◐", tint: "cyan", subtitle: "Clubes e carreiras" }
];

const menu: Section[] = ["Início", "Explorar", "Jogos", "Aplicativos", "Biblioteca"];
const progressItems = catalog.filter((item) => item.progress);

function App() {
  const [section, setSection] = useState<Section>("Início");
  const [query, setQuery] = useState("");
  const [activeHero, setActiveHero] = useState(0);
  const [detail, setDetail] = useState<CatalogItem | null>(null);
  const [toast, setToast] = useState<{ message: string; caption: string } | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("vale-games-favorites-v1") ?? "[]") as string[]; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("vale-games-favorites-v1", JSON.stringify(favorites)); }, [favorites]);
  const matching = useMemo(() => catalog.filter((item) => `${item.title} ${item.category} ${item.format}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const heroItems = catalog.slice(0, 3);
  const hero = heroItems[activeHero];
  const toggleFavorite = (item: CatalogItem) => {
    setFavorites((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]);
  };
  const play = (item: CatalogItem) => {
    setDetail(null);
    if (item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
      setToast({ message: `Abrindo ${item.title}`, caption: "URL oficial definitivo salvo para este jogo." });
    } else {
      setToast({ message: `${item.title} está aguardando o link oficial`, caption: "A capa já foi integrada; o URL será importado da planilha." });
    }
    window.setTimeout(() => setToast(null), 3400);
  };
  const selectMenu = (item: Section) => { setSection(item); setQuery(""); };
  const sectionItems = section === "Jogos" ? matching.filter((item) => item.format === "Jogo") : section === "Aplicativos" ? matching.filter((item) => item.format === "App") : matching;

  return <main className="app-shell">
    <header className="topnav">
      <button className="wordmark" onClick={() => selectMenu("Início")} aria-label="Vale Games Play, início"><span className="mark">V</span><span>VALE GAMES <b>PLAY</b></span></button>
      <nav>{menu.map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => selectMenu(item)}>{item}</button>)}</nav>
      <label className="search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("Explorar"); }} placeholder="Buscar jogos, aplicativos..." /></label>
      <button className="notification" aria-label="Notificações">♧<i /></button>
      <button className="profile" onClick={() => selectMenu("Biblioteca")}><span className="avatar">CS</span><span><b>Meu Perfil</b><small>Assinante</small></span><em>⌄</em></button>
    </header>

    {section === "Início" ? <Home hero={hero} heroItems={heroItems} activeHero={activeHero} setActiveHero={setActiveHero} onOpen={setDetail} onPlay={play} onNavigate={selectMenu} favorites={favorites} onFavorite={toggleFavorite} /> : <CatalogView section={section} items={section === "Biblioteca" ? catalog.filter((item) => favorites.includes(item.id)) : sectionItems} query={query} favorites={favorites} onFavorite={toggleFavorite} onOpen={setDetail} onPlay={play} onNavigate={selectMenu} />}

    <nav className="mobile-nav">{menu.map((item, index) => <button key={item} className={section === item ? "active" : ""} onClick={() => selectMenu(item)}><span>{["⌂", "⌕", "◌", "▦", "♡"][index]}</span>{item}</button>)}</nav>
    {detail && <DetailModal item={detail} favorite={favorites.includes(detail.id)} onClose={() => setDetail(null)} onPlay={play} onFavorite={() => toggleFavorite(detail)} />}
    {toast && <div className="toast"><span>✓</span>{toast.message}<small>{toast.caption}</small></div>}
  </main>;
}

function Home({ hero, heroItems, activeHero, setActiveHero, onOpen, onPlay, onNavigate, favorites, onFavorite }: { hero: CatalogItem; heroItems: CatalogItem[]; activeHero: number; setActiveHero: (index: number) => void; onOpen: (item: CatalogItem) => void; onPlay: (item: CatalogItem) => void; onNavigate: (section: Section) => void; favorites: string[]; onFavorite: (item: CatalogItem) => void }) {
  return <div className="home-page">
    <section className={`hero hero-${hero.art}`} style={{ "--hero-image": `url("${hero.cover}")` } as CSSProperties}>
      <div className="hero-noise" /><div className="hero-content"><span className="kicker">DESTAQUE DA SEMANA</span><h1>{hero.title}</h1><h2>{hero.tagline}</h2><p>{hero.description}</p><div className="hero-actions"><button className="primary-action" onClick={() => onPlay(hero)}>▶ Jogar agora</button><button className="outline-action" onClick={() => onOpen(hero)}>Detalhes</button></div><div className="hero-dots">{heroItems.map((item, index) => <button aria-label={`Mostrar ${item.title}`} key={item.id} className={activeHero === index ? "selected" : ""} onClick={() => setActiveHero(index)} />)}</div></div><div className="hero-badge"><span>⌘</span><div><small>VALE GAMES PLAY</small><b>Jogos e apps em um só lugar</b></div></div></section>
    <ContentRow title="Continue jogando" action="Ver biblioteca" onAction={() => onNavigate("Biblioteca")}><div className="continue-grid">{progressItems.slice(0, 5).map((item) => <GameCard key={item.id} item={item} compact onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div></ContentRow>
    <ContentRow title="Explore os jogos" action="Ver todos" onAction={() => onNavigate("Jogos")}><div className="category-grid">{categoryTiles.map((tile) => <button className={`category-tile ${tile.tint}`} onClick={() => onNavigate("Explorar")} key={tile.title}><span>{tile.icon}</span><b>{tile.title}</b><small>{tile.subtitle}</small></button>)}</div></ContentRow>
    <ContentRow title="Em destaque" action="Ver todos" onAction={() => onNavigate("Explorar")}><div className="game-grid">{catalog.slice(0, 4).map((item) => <GameCard key={item.id} item={item} onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div></ContentRow>
    <ContentRow title="Música e áudio" action="Abrir aplicativos" onAction={() => onNavigate("Aplicativos")}><div className="audio-row">{catalog.filter((item) => item.category === "Áudio").map((item) => <GameCard key={item.id} item={item} slim onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div></ContentRow>
  </div>;
}

function CatalogView({ section, items, query, favorites, onFavorite, onOpen, onPlay, onNavigate }: { section: Section; items: CatalogItem[]; query: string; favorites: string[]; onFavorite: (item: CatalogItem) => void; onOpen: (item: CatalogItem) => void; onPlay: (item: CatalogItem) => void; onNavigate: (section: Section) => void }) {
  const heading = section === "Biblioteca" ? "Minha Biblioteca" : section === "Aplicativos" ? "Aplicativos" : section === "Jogos" ? "Jogos" : "Explorar";
  const intro = section === "Biblioteca" ? "Seus favoritos ficam salvos neste dispositivo e estarão prontos quando você trouxer os links oficiais." : query ? `Resultados para “${query}”` : "Descubra uma seleção de jogos e aplicativos da Vale Games Play.";
  return <section className="catalog-page"><div className="catalog-banner"><div><span className="kicker">VALE GAMES PLAY</span><h1>{heading}</h1><p>{intro}</p></div>{section !== "Biblioteca" && <div className="catalog-tabs"><button className={section === "Explorar" ? "active" : ""} onClick={() => onNavigate("Explorar")}>Todos</button><button className={section === "Jogos" ? "active" : ""} onClick={() => onNavigate("Jogos")}>Jogos</button><button className={section === "Aplicativos" ? "active" : ""} onClick={() => onNavigate("Aplicativos")}>Apps</button></div>}</div>{items.length ? <div className="catalog-grid">{items.map((item) => <GameCard key={item.id} item={item} onOpen={onOpen} onPlay={onPlay} favorite={favorites.includes(item.id)} onFavorite={onFavorite} />)}</div> : <div className="empty-library"><span>♡</span><h2>{section === "Biblioteca" ? "Sua biblioteca está esperando" : "Nenhum resultado encontrado"}</h2><p>{section === "Biblioteca" ? "Abra um título e toque no coração para montarmos sua seleção pessoal." : "Tente buscar por outro título ou categoria."}</p><button className="primary-action" onClick={() => onNavigate("Explorar")}>Explorar catálogo</button></div>}</section>;
}

function GameCard({ item, compact = false, slim = false, favorite, onFavorite, onOpen, onPlay }: { item: CatalogItem; compact?: boolean; slim?: boolean; favorite: boolean; onFavorite: (item: CatalogItem) => void; onOpen: (item: CatalogItem) => void; onPlay: (item: CatalogItem) => void }) {
  return <article className={`game-card ${compact ? "compact" : ""} ${slim ? "slim" : ""}`}><button className={`cover cover-${item.art}`} style={{ backgroundImage: `url("${item.cover}")` }} onClick={() => onOpen(item)} aria-label={`Ver detalhes de ${item.title}`}><span className="cover-shine" /></button><div className="card-info"><div><h3>{item.title}</h3><span>{item.category}</span></div><button className={favorite ? "heart saved" : "heart"} aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} onClick={() => onFavorite(item)}>{favorite ? "♥" : "♡"}</button></div>{item.progress !== undefined ? <div className="progress"><span><i style={{ width: `${item.progress}%` }} /></span><b>{item.progress}%</b></div> : <button className="play-link" onClick={() => onPlay(item)}>Jogar <span>→</span></button>}</article>;
}

function DetailModal({ item, favorite, onClose, onPlay, onFavorite }: { item: CatalogItem; favorite: boolean; onClose: () => void; onPlay: (item: CatalogItem) => void; onFavorite: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="detail-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${item.title}`} onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={onClose}>×</button><div className={`detail-art cover-${item.art}`} style={{ backgroundImage: `url("${item.cover}")` }} /><div className="detail-copy"><span className="tag">{item.format} · {item.category}</span><h2>{item.title}</h2><p>{item.description}</p><div className="detail-metadata"><span><b>Compatibilidade</b>PC e celular</span><span><b>Disponibilidade</b>Em breve</span><span><b>Destino</b>{item.externalUrl ? "Link oficial salvo" : "Aguardando planilha"}</span></div><div className="modal-actions"><button className="primary-action" onClick={() => onPlay(item)}>▶ Jogar agora</button><button className={favorite ? "outline-action favorite" : "outline-action"} onClick={onFavorite}>{favorite ? "♥ Na biblioteca" : "♡ Favoritar"}</button></div><small className="placeholder-note">{item.externalUrl ? "URL oficial confirmado e priorizado para este jogo." : "Capa oficial integrada. Envie o inventário para associarmos o URL final."}</small></div></section></div>;
}

function ContentRow({ title, action, onAction, children }: { title: string; action: string; onAction: () => void; children: ReactNode }) { return <section className="content-row"><div className="row-heading"><h2>{title}<span>›</span></h2><button onClick={onAction}>{action} <span>›</span></button></div>{children}</section>; }
export default App;
