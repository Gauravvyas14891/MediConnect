import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DifferenceCursor } from './components/common/DifferenceCursor';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { LoginView } from './components/auth/LoginView';
import { EditorialLandingView } from './components/editorial/EditorialLandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { DiscoverView } from './components/discover/DiscoverView';
import { CommunityView } from './components/community/CommunityView';
import { CreatePostModal } from './components/community/CreatePostModal';
import { PostDetailModal } from './components/community/PostDetailModal';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ChallengesView } from './components/challenges/ChallengesView';
import { ProfileView } from './components/profile/ProfileView';
import { AddProjectModal } from './components/profile/ProfileModals';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    canAccessAdmin,
    activeTab, 
    activePostDetail, 
    setActivePostDetail 
  } = useApp();

  const [isCommunityCreateOpen, setIsCommunityCreateOpen] = useState(false);
  const [isDashboardAddProjectOpen, setIsDashboardAddProjectOpen] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');

  // Strictly require student authentication before accessing any portal or admin tools
  if (!currentUser) {
    return (
      <>
        <DifferenceCursor />
        {authView === 'landing' ? (
          <EditorialLandingView
            onEnterAuth={mode => {
              setAuthView(mode);
              window.scrollTo({ top: 0 });
            }}
          />
        ) : (
          <LoginView
            key={authView}
            initialMode={authView}
            onBackToHome={() => {
              setAuthView('landing');
              window.scrollTo({ top: 0 });
            }}
          />
        )}
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="editorial-portal min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col antialiased">
      <DifferenceCursor />

      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex w-full">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Center Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onOpenCreatePost={() => setIsCommunityCreateOpen(true)}
              onOpenAddProject={() => setIsDashboardAddProjectOpen(true)}
            />
          )}

          {activeTab === 'discover' && <DiscoverView />}

          {activeTab === 'community' && (
            <CommunityView 
              isCreateOpen={isCommunityCreateOpen}
              setIsCreateOpen={setIsCommunityCreateOpen}
            />
          )}

          {activeTab === 'leaderboard' && <LeaderboardView />}

          {activeTab === 'challenges' && <ChallengesView />}

          {activeTab === 'profile' && <ProfileView />}

          {activeTab === 'notifications' && <NotificationsView />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'admin' && (isAdmin && canAccessAdmin ? <AdminDashboard /> : <DashboardView onOpenCreatePost={() => setIsCommunityCreateOpen(true)} onOpenAddProject={() => setIsDashboardAddProjectOpen(true)} />)}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Portals */}
      <GlobalSearchModal />
      <OnboardingModal />
      <PostDetailModal 
        post={activePostDetail} 
        onClose={() => setActivePostDetail(null)} 
      />
      <AddProjectModal 
        isOpen={isDashboardAddProjectOpen} 
        onClose={() => setIsDashboardAddProjectOpen(false)} 
      />
      <CreatePostModal
        isOpen={isCommunityCreateOpen}
        onClose={() => setIsCommunityCreateOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
