
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-primary"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">FocusAI Tab Insights</h1>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">
              Tracking your browsing habits
            </span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      
      <footer className="border-t bg-muted/20 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FocusAI Tab Insights - Manage your digital well-being</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
