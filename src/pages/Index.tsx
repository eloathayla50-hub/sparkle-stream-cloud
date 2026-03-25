import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { fetchPlaylist, getNotices, getLatestAccess, saveAccess } from "@/lib/api";
import type { AccessData, PlaylistCategories, PlaylistItem, Notice, TabType } from "@/types/iptv";
import { AccessPopup } from "@/components/AccessPopup";
import { TabBar } from "@/components/TabBar";
import { ContentGrid } from "@/components/ContentGrid";
import { AccountTab } from "@/components/AccountTab";
import { NoticesTab } from "@/components/NoticesTab";
import { ContentDetail } from "@/components/ContentDetail";
import { CategorySelector } from "@/components/CategorySelector";
import { VideoPlayer } from "@/components/VideoPlayer";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<AccessData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('canais');
  const [categories, setCategories] = useState<PlaylistCategories>({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedItem, setSelectedItem] = useState<PlaylistItem | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [playingTitle, setPlayingTitle] = useState('');
  const [error, setError] = useState('');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const loadPlaylist = useCallback(async (acc: AccessData) => {
    try {
      setLoadingPlaylist(true);
      const cats = await fetchPlaylist(acc.username, acc.password);
      setCategories(cats);
      const firstKey = Object.keys(cats)[0];
      if (firstKey) setSelectedCategory(firstKey);
    } catch (err) {
      console.error('Playlist error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const existing = await getLatestAccess();
        if (existing) {
          const expires = new Date(existing.expires_at).getTime();
          if (expires > Date.now()) {
            setAccess(existing);
            setShowPopup(true);
            await loadPlaylist(existing);
            setLoading(false);
            return;
          }
        }
        setShowLogin(true);
      } catch {
        setShowLogin(true);
      }
      setLoading(false);
    };
    init();
    getNotices().then(setNotices);
  }, [loadPlaylist]);

  const handleLogin = async () => {
    if (!loginUser || !loginPass) return;
    setLoading(true);
    setError('');
    try {
      const accessData: AccessData = {
        username: loginUser,
        password: loginPass,
        host: 'cdnflash.top',
        port: 80,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      };
      await saveAccess(accessData);
      setAccess(accessData);
      setShowLogin(false);
      setShowPopup(true);
      await loadPlaylist(accessData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContent = (item: PlaylistItem) => {
    if (activeTab === 'canais') {
      setPlayingUrl(item.url);
      setPlayingTitle(item.name);
    } else {
      setSelectedItem(item);
    }
  };

  const handlePlay = (url: string) => {
    setPlayingUrl(url);
    setPlayingTitle(selectedItem?.name || '');
  };

  if (playingUrl) {
    return (
      <VideoPlayer
        url={playingUrl}
        title={playingTitle}
        onBack={() => setPlayingUrl(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <img src={logo} alt="Seven TV" width={120} height={120} className="animate-pulse-glow rounded-2xl" />
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-display text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="popup-card w-full max-w-sm">
          <div className="text-center mb-6">
            <img src={logo} alt="Seven TV" width={80} height={80} className="mx-auto mb-4 rounded-xl" />
            <h1 className="font-display text-2xl font-bold glow-text">SEVEN TV</h1>
            <p className="text-sm text-muted-foreground mt-1">Insira suas credenciais IPTV</p>
          </div>
          
          {error && <p className="text-destructive text-sm text-center mb-4">{error}</p>}

          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Usuário"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-display text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            ENTRAR
          </button>

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            Use as credenciais geradas pelo bot Python
          </p>
        </div>
      </div>
    );
  }

  const currentItems = categories[selectedCategory] || [];

  return (
    <div className="min-h-screen pb-6">
      {showPopup && access && (
        <AccessPopup access={access} onClose={() => setShowPopup(false)} />
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <img src={logo} alt="Seven TV" width={40} height={40} className="rounded-lg" />
          <div>
            <h1 className="font-display text-base font-bold glow-text">SEVEN TV</h1>
            <p className="text-[10px] text-muted-foreground font-body">Premium Streaming</p>
          </div>
        </div>
        <TabBar active={activeTab} onChange={(tab) => { setActiveTab(tab); setSelectedItem(null); }} />
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        {loadingPlaylist ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-display text-sm text-muted-foreground">Carregando playlist...</p>
          </div>
        ) : selectedItem && (activeTab === 'filmes' || activeTab === 'series') ? (
          <ContentDetail
            item={selectedItem}
            type={activeTab}
            onBack={() => setSelectedItem(null)}
            onPlay={handlePlay}
          />
        ) : activeTab === 'conta' && access ? (
          <AccountTab access={access} />
        ) : activeTab === 'avisos' ? (
          <NoticesTab notices={notices} />
        ) : (
          <>
            <CategorySelector
              categories={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
              filterType={activeTab as 'filmes' | 'series' | 'canais'}
            />
            <ContentGrid
              items={currentItems}
              type={activeTab as 'filmes' | 'series' | 'canais'}
              onSelect={handleSelectContent}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;