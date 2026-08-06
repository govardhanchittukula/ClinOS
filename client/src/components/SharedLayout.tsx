import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import { Footer } from './Footer';
import PageTransition from './PageTransition';
import { ClinFloatingAssistant } from './chat/ClinFloatingAssistant';

interface SharedLayoutProps {
  children?: React.ReactNode;
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* 260px Navigation Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Navbar onOpenSidebar={() => setMobileSidebarOpen(true)} />

        {/* Global Compact Medical Disclaimer */}
        <MedicalDisclaimerBanner />

        {/* Page Main Content */}
        <main className="flex-1 w-full">
          <PageTransition>{children || <Outlet />}</PageTransition>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Interactive Clin AI Assistant */}
      <ClinFloatingAssistant />
    </div>
  );
};

