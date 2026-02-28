import React from 'react';
import { ViewState } from '../types';
import { 
  Briefcase, 
  Users, 
  Wand2, 
  Library, 
  LayoutDashboard
} from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        currentView === view 
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} className={currentView === view ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-800">
          <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-white">
            PersonaCopy
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem view="BRAND" icon={Briefcase} label="Brand Identity" />
          <NavItem view="AVATARS" icon={Users} label="Avatar Engine" />
          <NavItem view="GENERATE" icon={Wand2} label="Generate Copy" />
          <NavItem view="LIBRARY" icon={Library} label="Asset Library" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            Powered by Gemini 3.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;