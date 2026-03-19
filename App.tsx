import React from 'react';
import { StoreProvider } from './store';
import { ViewState } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Layout from './components/Layout';
import BrandForm from './components/BrandForm';
import AvatarManager from './components/AvatarManager';
import Generator from './components/Generator';
import AssetLibrary from './components/AssetLibrary';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useLocalStorage<ViewState>('personacopy_view', 'BRAND');

  const renderView = () => {
    switch (currentView) {
      case 'BRAND':
        return <BrandForm />;
      case 'AVATARS':
        return <AvatarManager />;
      case 'GENERATE':
        return <Generator />;
      case 'LIBRARY':
        return <AssetLibrary />;
      default:
        return <BrandForm />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;