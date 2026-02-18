import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import axios from 'axios';
import { matchCountryCode } from '@/utils/countryHelpers';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = ({ onCountryClick, refreshTrigger }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [countriesWithNews, setCountriesWithNews] = useState(new Set());
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCountries();
  }, [refreshTrigger]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/countries`);
      const codes = new Set(response.data.map(c => c.country_code));
      setCountriesWithNews(codes);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const hasNews = Array.from(countriesWithNews).some(code => 
                matchCountryCode(countryName, code)
              );
              const isHovered = hoveredCountry === geo.id;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry(geo.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => onCountryClick(countryName, geo.properties.name)}
                  style={{
                    default: {
                      fill: hasNews ? '#0f172a' : '#e2e8f0',
                      stroke: '#ffffff',
                      strokeWidth: 0.5,
                      outline: 'none',
                      transition: 'all 0.2s ease-in-out'
                    },
                    hover: {
                      fill: hasNews ? '#1e293b' : '#94a3b8',
                      stroke: '#ffffff',
                      strokeWidth: 0.75,
                      outline: 'none',
                      cursor: 'pointer'
                    },
                    pressed: {
                      fill: '#0f172a',
                      stroke: '#0f172a',
                      outline: 'none'
                    }
                  }}
                  data-testid={`country-${geo.id}`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-4 py-2 text-sm font-mono uppercase tracking-wider"
          data-testid="country-tooltip"
        >
          {hoveredCountry}
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorldMap;