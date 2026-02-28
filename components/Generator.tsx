import React, { useState } from 'react';
import { useStore } from '../store';
import { generateAsset } from '../services/gemini';
import { AssetType, GeneratedAsset, PlatformMode } from '../types';
import { Wand2, AlertCircle, Copy, ShieldCheck, Share2, Anchor, Lock } from 'lucide-react';

const assetTypes: AssetType[] = [
  'Facebook Ad', 
  'Video Script', 
  'Landing Page', 
  'Email Sequence', 
  'PDF Lead Magnet',
  'Anti-Gravity Landing Page (2026 Compliance)',
  'Anti-Gravity VSL Script (2026 Compliance)'
];

const platformModes: { mode: PlatformMode; icon: any; description: string }[] = [
  { 
    mode: 'Social Guardian (Meta/TikTok)', 
    icon: ShieldCheck, 
    description: 'Disruption Management. Strict Compliance. No "You" language. Organic feel.' 
  },
  { 
    mode: 'Commercial Pipeline (DSP/Native)', 
    icon: Share2, 
    description: 'Intent Capture. High Agitation. "Unique Mechanism" focus. Direct POV.' 
  },
  { 
    mode: 'Safe-Haven (VSL/Owned)', 
    icon: Lock, 
    description: 'Conversion & Trust. Starts compliant, pivots to offer. The "Assassin Pivot".' 
  }
];

const Generator: React.FC = () => {
  const { brand, avatars, addAsset } = useStore();
  
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('Facebook Ad');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformMode>('Social Guardian (Meta/TikTok)');
  const [instructions, setInstructions] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  const isAntiGravity = selectedAssetType.includes('Anti-Gravity');

  const handleGenerate = async () => {
    if (!selectedAvatarId) {
        setError("Please select an avatar.");
        return;
    }
    setError('');
    setIsGenerating(true);
    setGeneratedContent('');

    const avatar = avatars.find(a => a.id === selectedAvatarId);
    if (!avatar) return;

    try {
      const content = await generateAsset(selectedAssetType, selectedPlatform, avatar, brand, instructions);
      setGeneratedContent(content);
      
      const newAsset: GeneratedAsset = {
        id: crypto.randomUUID(),
        title: `${selectedAssetType} for ${avatar.name}`,
        avatarId: avatar.id,
        assetType: selectedAssetType,
        platformMode: selectedPlatform,
        content: content,
        createdAt: Date.now()
      };
      addAsset(newAsset);

    } catch (e) {
      setError("Failed to generate content. Please try again or check API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  if (avatars.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <AlertCircle className="text-amber-500" size={48} />
              <h3 className="text-xl font-bold text-white">No Avatars Found</h3>
              <p className="text-slate-400">Please create an avatar profile before generating copy.</p>
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div>
            <h2 className="text-3xl font-bold text-white">Generator</h2>
            <p className="text-slate-400 mt-2">Craft high-converting assets.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Target Avatar</label>
                <select 
                    value={selectedAvatarId}
                    onChange={(e) => setSelectedAvatarId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                >
                    <option value="">Select an Avatar</option>
                    {avatars.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Platform Context (Tri-Modal)</label>
                <div className="grid grid-cols-1 gap-2">
                    {platformModes.map((p) => (
                        <button
                            key={p.mode}
                            onClick={() => setSelectedPlatform(p.mode)}
                            className={`p-3 rounded-lg text-left transition-all border ${
                                selectedPlatform === p.mode 
                                ? 'bg-brand-900/40 border-brand-500 text-white shadow-md' 
                                : 'bg-slate-950 border-transparent text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center space-x-2 mb-1">
                                <p.icon size={16} className={selectedPlatform === p.mode ? 'text-brand-400' : 'text-slate-500'} />
                                <span className="font-medium text-sm">{p.mode.split('(')[0]}</span>
                            </div>
                            <p className="text-xs opacity-70 leading-tight">{p.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Asset Type</label>
                <div className="grid grid-cols-1 gap-2">
                    {assetTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedAssetType(type)}
                            className={`px-4 py-3 rounded-lg text-left text-sm transition-all flex items-center justify-between ${
                                selectedAssetType === type 
                                ? 'bg-brand-600 text-white shadow-md' 
                                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                            <span>{type.replace(' (2026 Compliance)', '')}</span>
                            {type.includes('Anti-Gravity') && <ShieldCheck size={14} className={selectedAssetType === type ? 'text-white' : 'text-emerald-500'} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Specific Context / Instructions</label>
                <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder={isAntiGravity ? "Add context about the offer, but do NOT ask for specific language. The framework will handle strict compliance." : "e.g. Focus on the 50% discount ending tomorrow..."}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                />
            </div>

            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !selectedAvatarId}
                className={`w-full flex justify-center items-center space-x-2 py-4 rounded-lg font-bold text-lg transition-all ${
                    isGenerating 
                    ? 'bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white shadow-xl shadow-brand-900/40'
                }`}
            >
                 {isGenerating ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <Wand2 size={20} />
                        <span>{isAntiGravity ? 'Generate Compliant Asset' : 'Generate Copy'}</span>
                    </>
                )}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            {isAntiGravity && (
                <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-lg p-4 text-xs text-emerald-400">
                    <p className="font-bold mb-1">2026 Compliance Active</p>
                    <p>Meta AI "Semantic Signal" analysis enabled. Platform Logic: {selectedPlatform.split('(')[0]}.</p>
                </div>
            )}
        </div>
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-8 flex flex-col h-[calc(100vh-8rem)]">
         <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <h3 className="font-medium text-slate-300">Output Preview</h3>
                {generatedContent && (
                    <div className="flex space-x-2">
                         <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition" title="Copy">
                            <Copy size={18} />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-auto p-8 bg-slate-950/50">
                {generatedContent ? (
                    <div className="prose prose-invert prose-slate max-w-none">
                        {/* Simple markdown rendering for the demo */}
                        {generatedContent.split('\n').map((line, i) => (
                             <p key={i} className={line.startsWith('#') ? 'font-bold text-white text-xl mt-4 mb-2' : 'text-slate-300 mb-2'}>
                                {line.replace(/^#+\s/, '')}
                             </p>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                        <Wand2 size={48} className="opacity-20" />
                        <p>Select settings and click generate to see magic happen.</p>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Generator;