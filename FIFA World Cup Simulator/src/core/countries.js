// All FIFA member nations grouped by confederation with approximate rankings
export const CONFEDERATIONS = {
  UEFA: {
    name: 'UEFA',
    fullName: 'Europe',
    color: '#1e40af',
    countries: [
      { name: 'France', code: 'FR', flag: '🇫🇷', ranking: 2 },
      { name: 'England', code: 'GB-ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ranking: 4 },
      { name: 'Belgium', code: 'BE', flag: '🇧🇪', ranking: 3 },
      { name: 'Netherlands', code: 'NL', flag: '🇳🇱', ranking: 7 },
      { name: 'Portugal', code: 'PT', flag: '🇵🇹', ranking: 8 },
      { name: 'Spain', code: 'ES', flag: '🇪🇸', ranking: 6 },
      { name: 'Italy', code: 'IT', flag: '🇮🇹', ranking: 9 },
      { name: 'Germany', code: 'DE', flag: '🇩🇪', ranking: 11 },
      { name: 'Croatia', code: 'HR', flag: '🇭🇷', ranking: 10 },
      { name: 'Denmark', code: 'DK', flag: '🇩🇰', ranking: 18 },
      { name: 'Switzerland', code: 'CH', flag: '🇨🇭', ranking: 15 },
      { name: 'Austria', code: 'AT', flag: '🇦🇹', ranking: 22 },
      { name: 'Ukraine', code: 'UA', flag: '🇺🇦', ranking: 25 },
      { name: 'Serbia', code: 'RS', flag: '🇷🇸', ranking: 26 },
      { name: 'Poland', code: 'PL', flag: '🇵🇱', ranking: 28 },
      { name: 'Turkey', code: 'TR', flag: '🇹🇷', ranking: 30 },
      { name: 'Scotland', code: 'GB-SCT', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', ranking: 35 },
      { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', ranking: 36 },
      { name: 'Hungary', code: 'HU', flag: '🇭🇺', ranking: 37 },
      { name: 'Wales', code: 'GB-WLS', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', ranking: 40 },
      { name: 'Sweden', code: 'SE', flag: '🇸🇪', ranking: 20 },
      { name: 'Norway', code: 'NO', flag: '🇳🇴', ranking: 42 },
      { name: 'Romania', code: 'RO', flag: '🇷🇴', ranking: 38 },
      { name: 'Slovakia', code: 'SK', flag: '🇸🇰', ranking: 45 },
      { name: 'Greece', code: 'GR', flag: '🇬🇷', ranking: 48 },
      { name: 'Slovenia', code: 'SI', flag: '🇸🇮', ranking: 50 },
      { name: 'Republic of Ireland', code: 'IE', flag: '🇮🇪', ranking: 55 },
      { name: 'Finland', code: 'FI', flag: '🇫🇮', ranking: 57 },
      { name: 'Iceland', code: 'IS', flag: '🇮🇸', ranking: 58 },
      { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦', ranking: 60 },
      { name: 'North Macedonia', code: 'MK', flag: '🇲🇰', ranking: 62 },
      { name: 'Albania', code: 'AL', flag: '🇦🇱', ranking: 63 },
      { name: 'Montenegro', code: 'ME', flag: '🇲🇪', ranking: 65 },
      { name: 'Georgia', code: 'GE', flag: '🇬🇪', ranking: 68 },
      { name: 'Bulgaria', code: 'BG', flag: '🇧🇬', ranking: 70 },
      { name: 'Israel', code: 'IL', flag: '🇮🇱', ranking: 72 },
      { name: 'Kosovo', code: 'XK', flag: '🇽🇰', ranking: 75 },
      { name: 'Belarus', code: 'BY', flag: '🇧🇾', ranking: 78 },
      { name: 'Luxembourg', code: 'LU', flag: '🇱🇺', ranking: 80 },
      { name: 'Armenia', code: 'AM', flag: '🇦🇲', ranking: 82 },
      { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿', ranking: 85 },
      { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿', ranking: 88 },
      { name: 'Cyprus', code: 'CY', flag: '🇨🇾', ranking: 90 },
      { name: 'Faroe Islands', code: 'FO', flag: '🇫🇴', ranking: 100 },
      { name: 'Estonia', code: 'EE', flag: '🇪🇪', ranking: 102 },
      { name: 'Latvia', code: 'LV', flag: '🇱🇻', ranking: 105 },
      { name: 'Lithuania', code: 'LT', flag: '🇱🇹', ranking: 108 },
      { name: 'Moldova', code: 'MD', flag: '🇲🇩', ranking: 110 },
      { name: 'Malta', code: 'MT', flag: '🇲🇹', ranking: 115 },
      { name: 'Andorra', code: 'AD', flag: '🇦🇩', ranking: 140 },
      { name: 'Gibraltar', code: 'GI', flag: '🇬🇮', ranking: 190 },
      { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮', ranking: 185 },
      { name: 'San Marino', code: 'SM', flag: '🇸🇲', ranking: 200 },
    ]
  },
  CONMEBOL: {
    name: 'CONMEBOL',
    fullName: 'South America',
    color: '#15803d',
    countries: [
      { name: 'Argentina', code: 'AR', flag: '🇦🇷', ranking: 1 },
      { name: 'Brazil', code: 'BR', flag: '🇧🇷', ranking: 5 },
      { name: 'Uruguay', code: 'UY', flag: '🇺🇾', ranking: 12 },
      { name: 'Colombia', code: 'CO', flag: '🇨🇴', ranking: 13 },
      { name: 'Ecuador', code: 'EC', flag: '🇪🇨', ranking: 32 },
      { name: 'Chile', code: 'CL', flag: '🇨🇱', ranking: 34 },
      { name: 'Paraguay', code: 'PY', flag: '🇵🇾', ranking: 44 },
      { name: 'Peru', code: 'PE', flag: '🇵🇪', ranking: 27 },
      { name: 'Venezuela', code: 'VE', flag: '🇻🇪', ranking: 46 },
      { name: 'Bolivia', code: 'BO', flag: '🇧🇴', ranking: 83 },
    ]
  },
  CONCACAF: {
    name: 'CONCACAF',
    fullName: 'North/Central America & Caribbean',
    color: '#dc2626',
    countries: [
      { name: 'Mexico', code: 'MX', flag: '🇲🇽', ranking: 14 },
      { name: 'United States', code: 'US', flag: '🇺🇸', ranking: 16 },
      { name: 'Canada', code: 'CA', flag: '🇨🇦', ranking: 33 },
      { name: 'Costa Rica', code: 'CR', flag: '🇨🇷', ranking: 39 },
      { name: 'Jamaica', code: 'JM', flag: '🇯🇲', ranking: 52 },
      { name: 'Panama', code: 'PA', flag: '🇵🇦', ranking: 47 },
      { name: 'Honduras', code: 'HN', flag: '🇭🇳', ranking: 74 },
      { name: 'El Salvador', code: 'SV', flag: '🇸🇻', ranking: 76 },
      { name: 'Curaçao', code: 'CW', flag: '🇨🇼', ranking: 81 },
      { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹', ranking: 95 },
      { name: 'Guatemala', code: 'GT', flag: '🇬🇹', ranking: 97 },
      { name: 'Haiti', code: 'HT', flag: '🇭🇹', ranking: 84 },
      { name: 'Suriname', code: 'SR', flag: '🇸🇷', ranking: 120 },
      { name: 'Nicaragua', code: 'NI', flag: '🇳🇮', ranking: 125 },
      { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴', ranking: 130 },
      { name: 'Cuba', code: 'CU', flag: '🇨🇺', ranking: 150 },
    ]
  },
  CAF: {
    name: 'CAF',
    fullName: 'Africa',
    color: '#ca8a04',
    countries: [
      { name: 'Morocco', code: 'MA', flag: '🇲🇦', ranking: 12 },
      { name: 'Senegal', code: 'SN', flag: '🇸🇳', ranking: 17 },
      { name: 'Nigeria', code: 'NG', flag: '🇳🇬', ranking: 29 },
      { name: 'Cameroon', code: 'CM', flag: '🇨🇲', ranking: 31 },
      { name: 'Egypt', code: 'EG', flag: '🇪🇬', ranking: 33 },
      { name: 'Tunisia', code: 'TN', flag: '🇹🇳', ranking: 41 },
      { name: 'Algeria', code: 'DZ', flag: '🇩🇿', ranking: 43 },
      { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', ranking: 38 },
      { name: 'Ghana', code: 'GH', flag: '🇬🇭', ranking: 54 },
      { name: 'Mali', code: 'ML', flag: '🇲🇱', ranking: 49 },
      { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫', ranking: 53 },
      { name: 'DR Congo', code: 'CD', flag: '🇨🇩', ranking: 56 },
      { name: 'South Africa', code: 'ZA', flag: '🇿🇦', ranking: 59 },
      { name: 'Cape Verde', code: 'CV', flag: '🇨🇻', ranking: 61 },
      { name: 'Guinea', code: 'GN', flag: '🇬🇳', ranking: 64 },
      { name: 'Zambia', code: 'ZM', flag: '🇿🇲', ranking: 66 },
      { name: 'Uganda', code: 'UG', flag: '🇺🇬', ranking: 69 },
      { name: 'Gabon', code: 'GA', flag: '🇬🇦', ranking: 71 },
      { name: 'Benin', code: 'BJ', flag: '🇧🇯', ranking: 73 },
      { name: 'Tanzania', code: 'TZ', flag: '🇹🇿', ranking: 77 },
      { name: 'Mozambique', code: 'MZ', flag: '🇲🇿', ranking: 79 },
      { name: 'Madagascar', code: 'MG', flag: '🇲🇬', ranking: 86 },
      { name: 'Kenya', code: 'KE', flag: '🇰🇪', ranking: 91 },
      { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼', ranking: 93 },
      { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶', ranking: 96 },
      { name: 'Namibia', code: 'NA', flag: '🇳🇦', ranking: 98 },
      { name: 'Angola', code: 'AO', flag: '🇦🇴', ranking: 99 },
      { name: 'Libya', code: 'LY', flag: '🇱🇾', ranking: 101 },
      { name: 'Congo', code: 'CG', flag: '🇨🇬', ranking: 103 },
      { name: 'Comoros', code: 'KM', flag: '🇰🇲', ranking: 106 },
      { name: 'Sudan', code: 'SD', flag: '🇸🇩', ranking: 109 },
      { name: 'Rwanda', code: 'RW', flag: '🇷🇼', ranking: 111 },
      { name: 'Togo', code: 'TG', flag: '🇹🇬', ranking: 113 },
      { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱', ranking: 116 },
      { name: 'Central African Republic', code: 'CF', flag: '🇨🇫', ranking: 118 },
      { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', ranking: 121 },
      { name: 'Niger', code: 'NE', flag: '🇳🇪', ranking: 123 },
      { name: 'Mauritania', code: 'MR', flag: '🇲🇷', ranking: 87 },
      { name: 'Botswana', code: 'BW', flag: '🇧🇼', ranking: 126 },
      { name: 'Malawi', code: 'MW', flag: '🇲🇼', ranking: 128 },
    ]
  },
  AFC: {
    name: 'AFC',
    fullName: 'Asia',
    color: '#7c3aed',
    countries: [
      { name: 'Japan', code: 'JP', flag: '🇯🇵', ranking: 19 },
      { name: 'Iran', code: 'IR', flag: '🇮🇷', ranking: 21 },
      { name: 'South Korea', code: 'KR', flag: '🇰🇷', ranking: 23 },
      { name: 'Australia', code: 'AU', flag: '🇦🇺', ranking: 24 },
      { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', ranking: 51 },
      { name: 'Qatar', code: 'QA', flag: '🇶🇦', ranking: 46 },
      { name: 'Iraq', code: 'IQ', flag: '🇮🇶', ranking: 55 },
      { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', ranking: 59 },
      { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', ranking: 62 },
      { name: 'Oman', code: 'OM', flag: '🇴🇲', ranking: 67 },
      { name: 'China', code: 'CN', flag: '🇨🇳', ranking: 79 },
      { name: 'Bahrain', code: 'BH', flag: '🇧🇭', ranking: 85 },
      { name: 'Jordan', code: 'JO', flag: '🇯🇴', ranking: 70 },
      { name: 'Palestine', code: 'PS', flag: '🇵🇸', ranking: 89 },
      { name: 'Syria', code: 'SY', flag: '🇸🇾', ranking: 92 },
      { name: 'India', code: 'IN', flag: '🇮🇳', ranking: 101 },
      { name: 'Vietnam', code: 'VN', flag: '🇻🇳', ranking: 94 },
      { name: 'Thailand', code: 'TH', flag: '🇹🇭', ranking: 97 },
      { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬', ranking: 100 },
      { name: 'Tajikistan', code: 'TJ', flag: '🇹🇯', ranking: 104 },
      { name: 'Lebanon', code: 'LB', flag: '🇱🇧', ranking: 107 },
      { name: 'Turkmenistan', code: 'TM', flag: '🇹🇲', ranking: 112 },
      { name: 'North Korea', code: 'KP', flag: '🇰🇵', ranking: 114 },
      { name: 'Malaysia', code: 'MY', flag: '🇲🇾', ranking: 117 },
      { name: 'Indonesia', code: 'ID', flag: '🇮🇩', ranking: 119 },
      { name: 'Philippines', code: 'PH', flag: '🇵🇭', ranking: 122 },
      { name: 'Hong Kong', code: 'HK', flag: '🇭🇰', ranking: 138 },
      { name: 'Singapore', code: 'SG', flag: '🇸🇬', ranking: 142 },
      { name: 'Myanmar', code: 'MM', flag: '🇲🇲', ranking: 148 },
      { name: 'Kuwait', code: 'KW', flag: '🇰🇼', ranking: 131 },
    ]
  },
  OFC: {
    name: 'OFC',
    fullName: 'Oceania',
    color: '#0891b2',
    countries: [
      { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', ranking: 93 },
      { name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬', ranking: 160 },
      { name: 'Fiji', code: 'FJ', flag: '🇫🇯', ranking: 155 },
      { name: 'New Caledonia', code: 'NC', flag: '🇳🇨', ranking: 158 },
      { name: 'Solomon Islands', code: 'SB', flag: '🇸🇧', ranking: 162 },
      { name: 'Tahiti', code: 'PF', flag: '🇵🇫', ranking: 165 },
      { name: 'Vanuatu', code: 'VU', flag: '🇻🇺', ranking: 168 },
      { name: 'Samoa', code: 'WS', flag: '🇼🇸', ranking: 175 },
      { name: 'Tonga', code: 'TO', flag: '🇹🇴', ranking: 180 },
      { name: 'Cook Islands', code: 'CK', flag: '🇨🇰', ranking: 195 },
      { name: 'American Samoa', code: 'AS', flag: '🇦🇸', ranking: 198 },
    ]
  }
};

// FIFA slot allocation by format
// Playoff teams play intercontinental matches in pairs → each pair produces 1 winner
// So playoff slots = number of PAIRS, meaning double that many teams enter the playoff
export const FIFA_SLOTS = {
  32: {
    // 28 direct + 4 playoff matches (8 playoff teams → 4 winners) = 32
    UEFA: { direct: 12, playoff: 0 },
    CONMEBOL: { direct: 4, playoff: 2 },
    CONCACAF: { direct: 3, playoff: 2 },
    CAF: { direct: 5, playoff: 0 },
    AFC: { direct: 4, playoff: 2 },
    OFC: { direct: 0, playoff: 2 },
  },
  48: {
    // 42 direct + 6 playoff matches (12 playoff teams → 6 winners) = 48
    UEFA: { direct: 16, playoff: 0 },
    CONMEBOL: { direct: 6, playoff: 2 },
    CONCACAF: { direct: 6, playoff: 2 },
    CAF: { direct: 9, playoff: 2 },
    AFC: { direct: 8, playoff: 2 },
    OFC: { direct: 1, playoff: 2 },
  }
};

export function getAllCountries() {
  const all = [];
  for (const [confKey, conf] of Object.entries(CONFEDERATIONS)) {
    for (const country of conf.countries) {
      all.push({ ...country, confederation: confKey });
    }
  }
  return all;
}

export function getCountriesByConfederation(confKey) {
  return (CONFEDERATIONS[confKey]?.countries || []).map(c => ({
    ...c,
    confederation: confKey
  }));
}