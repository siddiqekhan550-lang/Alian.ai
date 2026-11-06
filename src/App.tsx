import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { Footer } from './components/Footer.js';
import { AuthModal } from './components/AuthModal.js';
import { WelcomeCreditsModal } from './components/WelcomeCreditsModal.js';
import { CreditsLedgerModal } from './components/CreditsLedgerModal.js';
import { SettingsModal } from './components/SettingsModal.js';
import { AdminModal } from './components/AdminModal.js';
import { HomePage } from './pages/HomePage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ExplorePage } from './pages/ExplorePage.js';

function MainApp() {
  const {
    user,
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    isWelcomeModalOpen,
    welcomeCredits,
    closeWelcomeModal,
  } = useAuth();

  const [currentView, setCurrentView] = useState<'home' | 'history' | 'dashboard' | 'explore'>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  // Cross-page prompt transport
  const [stagedPrompt, setStagedPrompt] = useState<string | undefined>(undefined);
  const [stagedType, setStagedType] = useState<'image' | 'video'>('video');

  const handleUsePrompt = (prompt: string, type: 'image' | 'video') => {
    setStagedPrompt(prompt);
    setStagedType(type);
    setCurrentView('dashboard');
  };

  const handleProceedToHistory = () => {
    closeWelcomeModal();
    setCurrentView('history');
  };

  return (
    <div className="min-h-screen bg-[#07060D] text-[#F4F2FB] flex flex-col selection:bg-[#7C5CFF]/30 selection:text-[#22E6A8]">
      {/* Top Main Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
      />

      {/* Main Page Area */}
      {currentView === 'dashboard' ? (
        /* Google Flow Creator Studio: Sidebar + Main Workspace */
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLedger={() => setIsLedgerOpen(true)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <DashboardPage
            onNavigate={setCurrentView}
            onOpenLedger={() => setIsLedgerOpen(true)}
            initialPrompt={stagedPrompt}
            initialType={stagedType}
          />
        </div>
      ) : (
        /* Standard Pages: Home, History, Explore */
        <main className="flex-1">
          {currentView === 'home' && (
            <>
              <HomePage
                onNavigate={setCurrentView}
                onOpenLedger={() => setIsLedgerOpen(true)}
              />
              <Footer onNavigate={setCurrentView} />
            </>
          )}

          {currentView === 'history' && (
            <>
              <HistoryPage
                onNavigate={setCurrentView}
                onRegenerate={(p, t) => handleUsePrompt(p, t)}
              />
              <Footer onNavigate={setCurrentView} />
            </>
          )}

          {currentView === 'explore' && (
            <>
              <ExplorePage
                onNavigate={setCurrentView}
                onUsePrompt={handleUsePrompt}
              />
              <Footer onNavigate={setCurrentView} />
            </>
          )}
        </main>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultMode={authModalMode}
        onSuccess={() => {
          // If logged in or signed up, redirect to history page as required by blueprint
          setCurrentView('history');
        }}
      />

      {/* First-Time Signup 50 Free Credits Modal */}
      <WelcomeCreditsModal
        isOpen={isWelcomeModalOpen}
        credits={welcomeCredits}
        onClose={closeWelcomeModal}
        onProceedToHistory={handleProceedToHistory}
      />

      {/* Credits Ledger Modal */}
      <CreditsLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />

      {/* Settings & API Key Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
