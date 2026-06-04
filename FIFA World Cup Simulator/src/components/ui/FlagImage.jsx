import React from 'react';

// Maps country codes to flagcdn.com 2-letter ISO codes
const CODE_MAP = {
  'GB-ENG': 'gb-eng',
  'GB-SCT': 'gb-sct',
  'GB-WLS': 'gb-wls',
};

export default function FlagImage({ code, name, size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'w-4 h-3',
    sm: 'w-6 h-4',
    md: 'w-8 h-6',
    lg: 'w-10 h-7',
    xl: 'w-14 h-10',
  };

  const isoCode = (CODE_MAP[code] || code || 'un').toLowerCase();
  const src = `https://flagcdn.com/${isoCode}.svg`;

  return (
    <img
      src={src}
      alt={name || code}
      className={`${sizeClasses[size] || sizeClasses.sm} object-cover rounded-sm shrink-0 ${className}`}
      onError={(e) => {
        // fallback to a neutral grey box if flag not found
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}