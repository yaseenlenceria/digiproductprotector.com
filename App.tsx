import React, { useState } from 'react';
import { ToolType } from './types';
import Layout from './components/Layout';
import WatermarkTool from './components/WatermarkTool';
import LicenseForge from './components/LicenseForge';
import LegalGenius from './components/LegalGenius';
import CopyrightAdvisor from './components/CopyrightAdvisor';
import { ShieldCheck, Lock, Feather } from 'lucide-react';

const Dashboard: React.FC<{ onNavigate: (t: ToolType) => void }> = ({ onNavigate }) => (
  <div className="flex flex-col gap-8">
     <div className="bg-gradient-to-r from-brand-900 to-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">Protect Your Digital Realm</h2>
          <p className="text-slate-300 text-lg mb-6">
            DigiProductProtector provides enterprise-grade tools to safeguard your digital assets, generate licensing infrastructure, and draft legal frameworks instantly.
          </p>
          <button 
            onClick={() => onNavigate(ToolType.WATERMARK)}
            className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-brand-900/50"
          >
            Start Protecting Assets
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
           <ShieldCheck size={400} />
        </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate(ToolType.LICENSE)}
          className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 hover:border-brand-500/50 transition-all cursor-pointer group"
        >
           <div className="bg-brand-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-brand-400 group-hover:text-brand-300">
             <Lock size={24} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">License Forge</h3>
           <p className="text-slate-400 text-sm">Generate batch license keys with customizable entropy and formats.</p>
        </div>

        <div 
          onClick={() => onNavigate(ToolType.LEGAL)}
          className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 hover:border-brand-500/50 transition-all cursor-pointer group"
        >
           <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:text-purple-300">
             <Feather size={24} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Legal Genius</h3>
           <p className="text-slate-400 text-sm">Draft professional Terms of Service, DMCA notices, and EULAs in seconds.</p>
        </div>

        <div 
          onClick={() => onNavigate(ToolType.ADVISOR)}
          className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 hover:border-brand-500/50 transition-all cursor-pointer group"
        >
           <div className="bg-emerald-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-emerald-400 group-hover:text-emerald-300">
             <ShieldCheck size={24} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Protector Advisor</h3>
           <p className="text-slate-400 text-sm">Consult our AI expert regarding copyright laws and digital rights management.</p>
        </div>
     </div>
  </div>
);

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.WATERMARK:
        return <WatermarkTool />;
      case ToolType.LICENSE:
        return <LicenseForge />;
      case ToolType.LEGAL:
        return <LegalGenius />;
      case ToolType.ADVISOR:
        return <CopyrightAdvisor />;
      case ToolType.DASHBOARD:
      default:
        return <Dashboard onNavigate={setActiveTool} />;
    }
  };

  return (
    <Layout activeTool={activeTool} onNavigate={setActiveTool}>
      {renderTool()}
    </Layout>
  );
};

export default App;
