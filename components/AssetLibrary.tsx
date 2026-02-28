import React from 'react';
import { useStore } from '../store';
import { FileText, Trash2, Calendar, User } from 'lucide-react';

const AssetLibrary: React.FC = () => {
  const { assets, deleteAsset, avatars } = useStore();

  const getAvatarName = (id: string) => {
    return avatars.find(a => a.id === id)?.name || 'Unknown Avatar';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white">Asset Library</h2>
        <p className="text-slate-400 mt-2">Your history of generated copy.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assets.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
                <FileText className="mx-auto mb-4 opacity-50" size={48} />
                <p>No assets generated yet.</p>
            </div>
        ) : (
            assets.map((asset) => (
                <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all flex flex-col md:flex-row justify-between gap-6 group">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                             <span className={`text-xs font-bold px-2 py-1 rounded bg-brand-900/50 text-brand-300 border border-brand-800`}>
                                {asset.assetType}
                            </span>
                            <h3 className="text-lg font-semibold text-white">{asset.title}</h3>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-3 font-mono bg-slate-950 p-3 rounded border border-slate-800/50">
                            {asset.content.slice(0, 300)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
                            <span className="flex items-center">
                                <User size={12} className="mr-1" />
                                {getAvatarName(asset.avatarId)}
                            </span>
                            <span className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {new Date(asset.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(asset.content);
                                alert("Copied to clipboard!");
                            }}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition text-sm font-medium"
                        >
                            Copy
                        </button>
                        <button 
                            onClick={() => deleteAsset(asset.id)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AssetLibrary;