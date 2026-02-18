import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import WorldMap from '@/components/WorldMap';
import CountrySheet from '@/components/CountrySheet';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Home = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshMap, setRefreshMap] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCountryClick = (countryCode, countryName) => {
    setSelectedCountry({ code: countryCode, name: countryName });
    setSheetOpen(true);
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    setRefreshMap(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_news-by-nation/artifacts/e3iapp74_logo.jpg" 
              alt="EconomiX Logo" 
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-900" data-testid="app-title">
                {t('home.title')}
              </h1>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                {t('home.subtitle')}
              </p>
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              data-testid="admin-button"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">{t('nav.admin')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 h-screen" data-testid="home-page">
        <div className="h-[calc(100vh-5rem)] relative">
          <WorldMap onCountryClick={handleCountryClick} refreshTrigger={refreshMap} />
        </div>
      </main>

      {selectedCountry && (
        <CountrySheet
          isOpen={sheetOpen}
          onClose={handleSheetClose}
          countryCode={selectedCountry.code}
          countryName={selectedCountry.name}
        />
      )}
    </div>
  );
};

export default Home;