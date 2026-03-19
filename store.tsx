import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { BrandIdentity, Avatar, GeneratedAsset } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

interface StoreContextType {
  brand: BrandIdentity;
  setBrand: (brand: BrandIdentity) => void;
  avatars: Avatar[];
  addAvatar: (avatar: Avatar) => void;
  removeAvatar: (id: string) => void;
  assets: GeneratedAsset[];
  addAsset: (asset: GeneratedAsset) => void;
  deleteAsset: (id: string) => void;
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
  const [brand, setBrand] = useLocalStorage<BrandIdentity>('personacopy_brand', defaultBrand);
  const [avatars, setAvatars] = useLocalStorage<Avatar[]>('personacopy_avatars', []);
  const [assets, setAssets] = useLocalStorage<GeneratedAsset[]>('personacopy_assets', []);

  const addAvatar = useCallback((avatar: Avatar) => {
    setAvatars(prev => [...prev, avatar]);
  }, [setAvatars]);

  const removeAvatar = useCallback((id: string) => {
    setAvatars(prev => prev.filter(a => a.id !== id));
  }, [setAvatars]);

  const addAsset = useCallback((asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
  }, [setAssets]);

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, [setAssets]);

  return (
    <StoreContext.Provider value={{
      brand, setBrand, avatars, addAvatar, removeAvatar, assets, addAsset, deleteAsset
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
