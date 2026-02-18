import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
      data-testid="language-switcher"
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs font-mono uppercase tracking-wider">
        {i18n.language === 'es' ? 'EN' : 'ES'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;