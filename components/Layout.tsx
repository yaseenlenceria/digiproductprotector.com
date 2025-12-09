import React from 'react';
import { Shield, Lock, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { NavItem, ToolType } from '../types';

interface LayoutProps {
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: ToolType.DASHBOARD, label: 'Overview', icon: <Shield size={20} /> },
  { id: ToolType.WATERMARK, label: 'Watermarker', icon: <ImageIcon size={20} /> },
  { id: ToolType.LICENSE, label: 'License Forge', icon: <Lock size={20} /> },
  { id: ToolType.LEGAL, label: 'Legal Genius', icon: <FileText size={20} /> },
  { id: ToolType.ADVISOR, label: 'Advisor Chat', icon: <MessageSquare size={20} /> },
];

const Layout: React.FC<LayoutProps> = ({ activeTool, onNavigate, children }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
           <div className="bg-brand-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
             <Shield className="text-white w-6 h-6" />
           </div>
           <span className="ml-3 font-bold text-lg hidden lg:block tracking-wide">DigiProtector</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ToolType)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                activeTool === item.id 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-900' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className={`${activeTool === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              <span className="font-medium hidden lg:block">{item.label}</span>
              {activeTool === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-500 text-center lg:text-left">
              <span className="hidden lg:inline">v1.0.0 Stable</span>
              <span className="lg:hidden">v1</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
           <h1 className="text-xl font-semibold text-slate-200 capitalize">
              {activeTool.replace('-', ' ')} Console
           </h1>
           <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-mono text-slate-400">SYSTEM SECURE</span>
           </div>
        </header>
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full w-full max-w-7xl mx-auto animate-fade-in">
             {children}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Layout;
