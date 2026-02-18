export const countryCodeToName = {
  'USA': 'United States',
  'CAN': 'Canada',
  'MEX': 'Mexico',
  'BRA': 'Brazil',
  'ARG': 'Argentina',
  'CHI': 'Chile',
  'COL': 'Colombia',
  'PER': 'Peru',
  'ESP': 'Spain',
  'FRA': 'France',
  'DEU': 'Germany',
  'ITA': 'Italy',
  'GBR': 'United Kingdom',
  'PRT': 'Portugal',
  'NLD': 'Netherlands',
  'BEL': 'Belgium',
  'SWE': 'Sweden',
  'NOR': 'Norway',
  'DNK': 'Denmark',
  'FIN': 'Finland',
  'POL': 'Poland',
  'RUS': 'Russia',
  'CHN': 'China',
  'JPN': 'Japan',
  'IND': 'India',
  'KOR': 'South Korea',
  'AUS': 'Australia',
  'NZL': 'New Zealand',
  'ZAF': 'South Africa',
  'EGY': 'Egypt',
  'NGA': 'Nigeria',
  'KEN': 'Kenya',
  'SAU': 'Saudi Arabia',
  'ARE': 'United Arab Emirates',
  'ISR': 'Israel',
  'TUR': 'Turkey',
  'GRC': 'Greece',
  'UKR': 'Ukraine',
  'CHE': 'Switzerland',
  'AUT': 'Austria',
  'CZE': 'Czech Republic',
  'HUN': 'Hungary',
  'ROU': 'Romania',
  'BGR': 'Bulgaria',
  'HRV': 'Croatia',
  'SRB': 'Serbia',
  'SVN': 'Slovenia',
  'SVK': 'Slovakia',
  'IRL': 'Ireland',
  'ISL': 'Iceland',
  'EST': 'Estonia',
  'LVA': 'Latvia',
  'LTU': 'Lithuania',
  'THA': 'Thailand',
  'VNM': 'Vietnam',
  'MYS': 'Malaysia',
  'SGP': 'Singapore',
  'PHL': 'Philippines',
  'IDN': 'Indonesia',
  'PAK': 'Pakistan',
  'BGD': 'Bangladesh',
  'IRN': 'Iran',
  'IRQ': 'Iraq',
  'AFG': 'Afghanistan'
};

export const nameToCountryCode = Object.entries(countryCodeToName).reduce((acc, [code, name]) => {
  acc[name.toLowerCase()] = code;
  return acc;
}, {});

export const matchCountryCode = (countryName, countryCode) => {
  const nameLower = countryName.toLowerCase();
  const codeLower = countryCode.toLowerCase();
  
  if (nameToCountryCode[nameLower] === codeLower.toUpperCase()) {
    return true;
  }
  
  if (nameLower.includes(codeLower) || codeLower.includes(nameLower.substring(0, 3))) {
    return true;
  }
  
  return false;
};

export const getSuggestedCode = (countryName) => {
  const nameLower = countryName.toLowerCase();
  if (nameToCountryCode[nameLower]) {
    return nameToCountryCode[nameLower];
  }
  return countryName.substring(0, 3).toUpperCase();
};
