import React, { useState } from 'react';
import { ScrollText, Gavel, CheckCircle2 } from 'lucide-react';
import { generateLegalDocument } from '../services/geminiService';
import { LegalConfig } from '../types';
import ReactMarkdown from 'react-markdown';

const LegalGenius: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [config, setConfig] = useState<LegalConfig>({
    documentType: 'tos',
    entityName: '',
    productType: 'Digital Art Pack',
    jurisdiction: 'United States (Delaware)',
    strictness: 'standard'
  });

  const handleGenerate = async () => {
    if (!config.entityName) {
      alert("Please enter a company or entity name.");
      return;
    }
    setLoading(true);
    const result = await generateLegalDocument(config);
    setDocumentContent(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Legal Genius</h2>
          <p className="text-slate-400">AI-Drafted legal frameworks for your digital storefront.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Config */}
        <div className="w-full lg:w-1/3 bg-slate-800 border border-slate-700 rounded-2xl p-6 overflow-y-auto">
           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Document Type</label>
                <div className="grid grid-cols-2 gap-2">
                   {['tos', 'dmca', 'eula', 'privacy'].map(type => (
                     <button
                        key={type}
                        onClick={() => setConfig({...config, documentType: type as any})}
                        className={`py-2 px-3 text-sm rounded-lg border transition-all ${config.documentType === type ? 'bg-brand-900/50 border-brand-500 text-brand-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                     >
                        {type.toUpperCase()}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase">Entity / Company Name</label>
                    <input 
                      type="text" 
                      value={config.entityName}
                      onChange={(e) => setConfig({...config, entityName: e.target.value})}
                      placeholder="Acme Digital Ltd."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none"
                    />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase">Product Type</label>
                    <input 
                      type="text" 
                      value={config.productType}
                      onChange={(e) => setConfig({...config, productType: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none"
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase">Jurisdiction</label>
                    <input 
                      type="text" 
                      value={config.jurisdiction}
                      onChange={(e) => setConfig({...config, jurisdiction: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none"
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase">Strictness Tone</label>
                    <select
                      value={config.strictness}
                      onChange={(e) => setConfig({...config, strictness: e.target.value as any})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                    >
                      <option value="friendly">Friendly & Simple</option>
                      <option value="standard">Standard Professional</option>
                      <option value="strict">Strict & Protective</option>
                    </select>
                 </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-4 ${loading ? 'bg-slate-700' : 'bg-brand-600 hover:bg-brand-500'} text-white transition-colors`}
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Gavel size={18} />}
                Draft Document
              </button>
           </div>
        </div>

        {/* Right Preview */}
        <div className="w-full lg:w-2/3 bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
               <div className="flex items-center gap-2 text-slate-600">
                  <ScrollText size={20} />
                  <span className="font-semibold text-sm">Document Preview</span>
               </div>
               {documentContent && (
                 <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Generated
                 </span>
               )}
            </div>
            <div className="flex-1 p-8 overflow-y-auto font-serif leading-relaxed text-sm">
               {documentContent ? (
                 <ReactMarkdown 
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 border-b pb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    }}
                 >
                    {documentContent}
                 </ReactMarkdown>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                    <Gavel size={64} className="mb-4" />
                    <p>Ready to draft your document...</p>
                 </div>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default LegalGenius;
