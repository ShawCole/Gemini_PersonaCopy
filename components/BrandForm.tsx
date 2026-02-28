import React, { useState } from 'react';
import { useStore } from '../store';
import { Save } from 'lucide-react';

const BrandForm: React.FC = () => {
  const { brand, setBrand } = useStore();
  const [formData, setFormData] = useState(brand);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleUspChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by new line for simple array handling
    setFormData(prev => ({
        ...prev,
        uniqueSellingPoints: e.target.value.split('\n').filter(s => s.trim() !== '')
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBrand(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-white">Brand Identity</h2>
            <p className="text-slate-400 mt-2">Define the core voice and mission of your business.</p>
        </div>
        {saved && <span className="text-green-400 text-sm font-medium px-4 py-2 bg-green-900/20 rounded-full border border-green-900">Saved Successfully</span>}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Brand Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="e.g. Apex Fitness"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="e.g. Health & Wellness"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Mission Statement</label>
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
              placeholder="What is your company's purpose?"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Tone of Voice</label>
            <input
              type="text"
              name="toneOfVoice"
              value={formData.toneOfVoice}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="e.g. Authoritative, Empathetic, Witty"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Product/Service Description</label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Describe your main offer."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Unique Selling Points (One per line)</label>
            <textarea
              name="uniqueSellingPoints"
              value={formData.uniqueSellingPoints.join('\n')}
              onChange={handleUspChange}
              rows={5}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition resize-none"
              placeholder="- 24/7 Support&#10;- 30 Day Guarantee"
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end pt-4">
            <button
                type="submit"
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-brand-900/50"
            >
                <Save size={18} />
                <span>Save Brand Profile</span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;