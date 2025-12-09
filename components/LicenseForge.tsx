import React, { useState } from 'react';
import { Key, Copy, RefreshCw, ShieldCheck } from 'lucide-react';
import { generateLicenseKeys } from '../services/geminiService';
import { LicenseConfig } from '../types';

const LicenseForge: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const [config, setConfig] = useState<LicenseConfig>({
    productName: '',
    count: 5,
    format: 'alphanumeric',
    complexity: 'medium'
  });

  const handleGenerate = async () => {
    if (!config.productName) {
      alert("Please enter a product name");
      return;
    }
    setLoading(true);
    const result = await generateLicenseKeys(config);
    setKeys(result);
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">License Forge</h2>
        <p className="text-slate-400">Generate cryptographically inspired license keys for your software distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        
        {/* Input Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Product Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. SuperApp 2024 Pro"
                value={config.productName}
                onChange={(e) => setConfig({...config, productName: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Quantity</label>
                <select 
                  value={config.count}
                  onChange={(e) => setConfig({...config, count: Number(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white outline-none focus:border-brand-500"
                >
                  <option value={1}>1 Key</option>
                  <option value={5}>5 Keys</option>
                  <option value={10}>10 Keys</option>
                  <option value={50}>50 Keys</option>
                </select>
               </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Format</label>
                <select 
                  value={config.format}
                  onChange={(e) => setConfig({...config, format: e.target.value as any})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white outline-none focus:border-brand-500"
                >
                  <option value="uuid">UUID (Standard)</option>
                  <option value="alphanumeric">Alphanumeric (XXXX-XXXX)</option>
                  <option value="phonetic">Phonetic Words</option>
                  <option value="custom">Complex Mix</option>
                </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Complexity & Entropy</label>
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-600">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfig({...config, complexity: level as any})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${config.complexity === level ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white shadow-brand-900/40'}`}
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Key className="w-5 h-5" />}
              {loading ? 'Forging Keys...' : 'Generate Keys'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck size={120} />
           </div>
           
           <h3 className="text-lg font-semibold text-slate-200 mb-4 z-10 flex items-center gap-2">
             Generated Assets 
             {keys.length > 0 && <span className="bg-brand-900 text-brand-300 text-xs px-2 py-0.5 rounded-full">{keys.length}</span>}
           </h3>

           <div className="flex-1 overflow-y-auto space-y-3 z-10 pr-2 custom-scrollbar">
             {keys.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-600">
                 <p className="text-sm">No keys generated yet.</p>
               </div>
             ) : (
               keys.map((key, idx) => (
                 <div key={idx} className="group flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-brand-500/50 p-3 rounded-lg transition-all">
                    <code className="text-brand-100 font-mono text-sm tracking-wide break-all">{key}</code>
                    <button 
                      onClick={() => copyToClipboard(key)}
                      className="p-2 text-slate-500 hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseForge;
