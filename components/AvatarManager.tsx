import React, { useState } from 'react';
import { useStore } from '../store';
import { enhanceAvatarProfile } from '../services/gemini';
import { Avatar } from '../types';
import { Sparkles, Trash2, UserPlus, BrainCircuit, Target, HeartPulse, AlertOctagon, Activity, Users } from 'lucide-react';

const AvatarManager: React.FC = () => {
  const { brand, avatars, addAvatar, removeAvatar } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Creation State
  const [avatarName, setAvatarName] = useState('');
  const [rawDescription, setRawDescription] = useState('');

  const handleGenerateAvatar = async () => {
    if (!avatarName || !rawDescription) return;
    if (!brand.name) {
        alert("Please set up your Brand Identity first.");
        return;
    }

    setLoading(true);
    try {
      const profile = await enhanceAvatarProfile(rawDescription, brand);
      const newAvatar: Avatar = {
        id: crypto.randomUUID(),
        name: avatarName,
        ...profile
      };
      addAvatar(newAvatar);
      setIsCreating(false);
      setAvatarName('');
      setRawDescription('');
    } catch (e) {
      alert("Error generating avatar. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-white">Avatar Engine</h2>
            <p className="text-slate-400 mt-2">Create deep psychographic profiles of your ideal customers.</p>
        </div>
        <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-brand-900/50"
        >
            <UserPlus size={18} />
            <span>{isCreating ? 'Cancel' : 'New Avatar'}</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-brand-800/50 rounded-xl p-6 shadow-2xl space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Sparkles className="text-brand-400" size={20} />
                <span>AI Persona Generator</span>
            </h3>
            <p className="text-slate-400 text-sm">
                Describe your audience in plain English (e.g., "Middle-aged dads who want to get back in shape but are busy with work"). 
                Our AI will expand this into a full psychological profile.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-slate-300">Avatar Name</label>
                    <input 
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        placeholder="e.g. Busy Dad Dave"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm text-slate-300">Audience Description</label>
                    <textarea 
                        value={rawDescription}
                        onChange={(e) => setRawDescription(e.target.value)}
                        placeholder="Describe them here..."
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={handleGenerateAvatar}
                    disabled={loading || !avatarName || !rawDescription}
                    className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all ${
                        loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-brand-500 to-violet-600 hover:from-brand-400 hover:to-violet-500 text-white shadow-lg shadow-brand-900/50'
                    }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Analyzing Psychographics...</span>
                        </>
                    ) : (
                        <>
                            <BrainCircuit size={18} />
                            <span>Generate Profile</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      )}

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {avatars.map(avatar => (
            <div key={avatar.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white">{avatar.name}</h3>
                            <p className="text-sm text-slate-400">{avatar.demographics.ageRange} • {avatar.demographics.gender} • {avatar.demographics.location}</p>
                        </div>
                        <button onClick={() => removeAvatar(avatar.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                        <div className="flex items-start space-x-2">
                            <Target className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dream Outcome</span>
                                <p className="text-sm text-slate-300 line-clamp-2">{avatar.deepAnalysis.dreamOutcome}</p>
                            </div>
                        </div>

                         <div className="flex items-start space-x-2">
                            <AlertOctagon className="text-red-400 mt-1 flex-shrink-0" size={16} />
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Fear</span>
                                <p className="text-sm text-slate-300 line-clamp-2">{avatar.deepAnalysis.fears[0]}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                             <HeartPulse className="text-rose-400 mt-1 flex-shrink-0" size={16} />
                             <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Motivation</span>
                                <p className="text-sm text-slate-300 line-clamp-2">{avatar.deepAnalysis.motivations[0]}</p>
                             </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-950 px-6 py-3 flex justify-between items-center text-xs text-slate-500">
                    <span>{avatar.demographics.occupation}</span>
                    <span className="group-hover:text-brand-400 transition-colors">View Details →</span>
                </div>
            </div>
        ))}

        {avatars.length === 0 && !isCreating && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                <Users className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400">No avatars created yet. Click "New Avatar" to begin.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AvatarManager;