import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandIdentity, Avatar, GeneratedAsset } from './types';

interface StoreContextType {
  brand: BrandIdentity;
  setBrand: (brand: BrandIdentity) => void;
  avatars: Avatar[];
  addAvatar: (avatar: Avatar) => void;
  removeAvatar: (id: string) => void;
  assets: GeneratedAsset[];
  addAsset: (asset: GeneratedAsset) => void;
  deleteAsset: (id: string) => void;
  isHydrated: boolean;
}

const defaultBrand: BrandIdentity = {
  name: '',
  industry: '',
  mission: '',
  toneOfVoice: '',
  productDescription: '',
  uniqueSellingPoints: []
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brand, setBrandState] = useState<BrandIdentity>(defaultBrand);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedBrand = localStorage.getItem('pc_brand');
    const savedAvatars = localStorage.getItem('pc_avatars');
    const savedAssets = localStorage.getItem('pc_assets');

    if (savedBrand) setBrandState(JSON.parse(savedBrand));
    if (savedAvatars) setAvatars(JSON.parse(savedAvatars));
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    setIsHydrated(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('pc_brand', JSON.stringify(brand));
      localStorage.setItem('pc_avatars', JSON.stringify(avatars));
      localStorage.setItem('pc_assets', JSON.stringify(assets));
    }
  }, [brand, avatars, assets, isHydrated]);

  const setBrand = (newBrand: BrandIdentity) => setBrandState(newBrand);
  
  const addAvatar = (avatar: Avatar) => {
    setAvatars(prev => [...prev, avatar]);
  };

  const removeAvatar = (id: string) => {
    setAvatars(prev => prev.filter(a => a.id !== id));
  };

  const addAsset = (asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      brand, setBrand, avatars, addAvatar, removeAvatar, assets, addAsset, deleteAsset, isHydrated
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};