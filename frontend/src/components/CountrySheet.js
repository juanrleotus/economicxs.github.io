import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { matchCountryCode } from '@/utils/countryHelpers';

const CountrySheet = ({ isOpen, onClose, countryCode, countryName }) => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (isOpen && countryCode) {
      fetchNewspapers();
    }
  }, [isOpen, countryCode]);

  const fetchNewspapers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/newspapers`);
      const filtered = response.data.filter(newspaper => 
        matchCountryCode(countryCode, newspaper.country_code)
      );
      setNewspapers(filtered);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl bg-white border-l border-slate-200" data-testid="country-sheet">
        <SheetHeader>
          <SheetTitle className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-7 h-7" />
            {countryName}
          </SheetTitle>
          <SheetDescription className="text-sm font-mono uppercase tracking-wider text-slate-400">
            {countryCode}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <h3 className="text-xl font-serif font-semibold text-slate-900 mb-4">
            {t('country.newspapers')}
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : newspapers.length === 0 ? (
            <div className="text-center py-12 text-slate-500" data-testid="no-newspapers-message">
              <p>{t('country.noNewspapers')}</p>
            </div>
          ) : (
            <div className="space-y-3" data-testid="newspapers-list">
              {newspapers.map((newspaper, index) => (
                <motion.div
                  key={newspaper.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 border border-slate-200 p-4 hover:shadow-md transition-all group"
                  data-testid={`newspaper-item-${newspaper.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-serif font-medium text-slate-900 mb-1">
                        {newspaper.title}
                      </h4>
                      <p className="text-xs font-mono text-slate-400 break-all">
                        {newspaper.url}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 hover:bg-slate-200"
                      onClick={() => window.open(newspaper.url, '_blank')}
                      data-testid={`visit-button-${newspaper.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CountrySheet;