import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDesignSystem } from './hooks/useDesignSystem';
import { Header } from './components/layout/Header';
import { ControlsPanel } from './components/controls/ControlsPanel';
import { ColorsTab } from './components/tabs/ColorsTab';
import { TypographyTab } from './components/tabs/TypographyTab';
import { ComponentsTab } from './components/tabs/ComponentsTab';
import { FoundationsTab } from './components/tabs/FoundationsTab';
import { DocsTab } from './components/tabs/DocsTab';
import { ExportTab } from './components/tabs/ExportTab';
import { TabBar } from './components/ui/TabBar';

const TABS = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Type', icon: '✦' },
  { id: 'components', label: 'Components', icon: '⬡' },
  { id: 'foundations', label: 'Foundations', icon: '◉' },
  { id: 'docs', label: 'Docs', icon: '📖' },
  { id: 'export', label: 'Export', icon: '⬇' },
];

export default function App() {
  const { config, tokens, updateConfig, randomize, getShareURL, reset } = useDesignSystem();
  const [activeTab, setActiveTab] = useState('colors');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Share handler
  const handleShare = useCallback(() => {
    const url = getShareURL();
    return url;
  }, [getShareURL]);

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Gradient background based on primary color
  const gradientBg = config.isDarkMode
    ? `radial-gradient(ellipse at 20% 20%, ${config.primaryColor}22 0%, transparent 60%),
       radial-gradient(ellipse at 80% 80%, ${config.secondaryColor}15 0%, transparent 60%),
       var(--color-background-default)`
    : `radial-gradient(ellipse at 20% 20%, ${config.primaryColor}12 0%, transparent 60%),
       radial-gradient(ellipse at 80% 80%, ${config.secondaryColor}10 0%, transparent 60%),
       var(--color-background-default)`;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: gradientBg }}
    >
      {/* Header */}
      <Header
        primaryColor={config.primaryColor}
        isDark={config.isDarkMode}
        onToggleDark={() => updateConfig({ isDarkMode: !config.isDarkMode })}
      />

      {/* Main layout — pt-14 to clear fixed header */}
      <div className="pt-14 h-screen flex overflow-hidden">

        {/* ===== DESKTOP: Left panel ===== */}
        <aside
          className="hidden lg:flex flex-col flex-shrink-0 border-r overflow-hidden"
          style={{
            width: '280px',
            borderColor: 'var(--color-border-subtle)',
          }}
        >
          <ControlsPanel
            config={config}
            onUpdate={updateConfig}
            onRandomize={randomize}
            onReset={reset}
            onShare={handleShare}
          />
        </aside>

        {/* ===== TABLET: Slide-out drawer ===== */}
        <div
          className={`lg:hidden fixed inset-0 z-30 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          ref={drawerRef}
          className={`lg:hidden fixed left-0 top-14 bottom-0 z-40 w-72 flex flex-col transition-transform duration-300 shadow-2xl ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ background: 'var(--color-surface-default)', borderRight: '1px solid var(--color-border-subtle)' }}
        >
          <ControlsPanel
            config={config}
            onUpdate={updateConfig}
            onRandomize={randomize}
            onReset={reset}
            onShare={handleShare}
          />
        </aside>

        {/* ===== Main Content ===== */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Tablet/Desktop tab bar with controls toggle */}
          <div
            className="flex items-center border-b flex-shrink-0"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            {/* Controls toggle for tablet */}
            <button
              className="lg:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium border-r flex-shrink-0 focus-ring hover:opacity-70 transition-opacity min-h-[44px]"
              style={{
                borderColor: 'var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
                background: drawerOpen ? 'var(--color-background-subtle)' : 'transparent',
              }}
              onClick={() => setDrawerOpen(o => !o)}
            >
              <span>⚙</span>
              <span className="hidden sm:inline">Controls</span>
            </button>

            {/* Tabs — scrollable on small */}
            <div className="flex-1 overflow-x-auto scrollbar-thin">
              <TabBar
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={(id) => { setActiveTab(id); setDrawerOpen(false); }}
              />
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-6">
            {activeTab === 'colors' && <ColorsTab tokens={tokens} isDark={config.isDarkMode} />}
            {activeTab === 'typography' && <TypographyTab tokens={tokens} config={config} />}
            {activeTab === 'components' && <ComponentsTab tokens={tokens} isDark={config.isDarkMode} />}
            {activeTab === 'foundations' && <FoundationsTab tokens={tokens} isDark={config.isDarkMode} />}
            {activeTab === 'docs' && <DocsTab />}
            {activeTab === 'export' && <ExportTab tokens={tokens} />}
          </div>
        </main>
      </div>

      {/* ===== MOBILE: Bottom sheet for controls ===== */}
      <div className="lg:hidden">
        {/* FAB to open bottom sheet */}
        <button
          onClick={() => setBottomSheetOpen(true)}
          className="md:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl focus-ring transition-all duration-200 active:scale-95"
          style={{
            background: config.primaryColor,
            color: '#fff',
            boxShadow: `0 8px 24px ${config.primaryColor}60`,
          }}
        >
          ⚙
        </button>

        {/* Bottom sheet overlay */}
        {bottomSheetOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setBottomSheetOpen(false)}
            />
            <div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
              style={{
                background: 'var(--color-surface-default)',
                maxHeight: '85vh',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'var(--color-border-default)' }} />
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <ControlsPanel
                  config={config}
                  onUpdate={updateConfig}
                  onRandomize={randomize}
                  onReset={reset}
                  onShare={handleShare}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="bottom"
        />
      </div>
    </div>
  );
}
