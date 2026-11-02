import React from 'react';
import { ContractLogoPreset } from '../../../types/contract';
import { Logo } from '../../common/Logo';

interface ContractLogoEmblemProps {
  preset: ContractLogoPreset;
  customLogoUrl?: string;
  size?: number;
  className?: string;
}

export const ContractLogoEmblem: React.FC<ContractLogoEmblemProps> = ({
  preset,
  customLogoUrl,
  size = 54,
  className = '',
}) => {
  // If custom uploaded logo is selected and exists
  if (preset === 'custom' && customLogoUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-lg overflow-hidden flex items-center justify-center bg-white border border-border/80 p-0.5 ${className}`}
      >
        <img
          src={customLogoUrl}
          alt="شعار المكتب"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Baseera / Siyaq default logo
  if (preset === 'siyaq_default' || (preset as string) === 'baseera_default') {
    return <Logo iconSize={size} showText={false} className={className} />;
  }

  // Preset 1: Scales of Justice (Blue Royal)
  if (preset === 'scales_gold') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="50" cy="50" r="46" stroke="#2563eb" strokeWidth="2.5" fill="#f8fafc" />
        <circle cx="50" cy="50" r="41" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />
        {/* Balance central pillar */}
        <path d="M50 20 V80 M38 80 H62" stroke="#1a2b3c" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="20" r="4" fill="#2563eb" stroke="#1a2b3c" strokeWidth="1.5" />
        {/* Crossbeam */}
        <path d="M22 35 L50 28 L78 35" stroke="#1a2b3c" strokeWidth="3" strokeLinecap="round" />
        {/* Left Pan */}
        <path d="M22 35 L14 55 M22 35 L30 55" stroke="#707781" strokeWidth="1.5" />
        <path d="M12 55 Q22 62 32 55 Z" fill="#2563eb" stroke="#1a2b3c" strokeWidth="1.5" />
        {/* Right Pan */}
        <path d="M78 35 L70 55 M78 35 L86 55" stroke="#707781" strokeWidth="1.5" />
        <path d="M68 55 Q78 62 88 55 Z" fill="#2563eb" stroke="#1a2b3c" strokeWidth="1.5" />
      </svg>
    );
  }

  // Preset 2: Shield of Integrity (Navy & Blue)
  if (preset === 'shield_navy') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Shield outline */}
        <path
          d="M50 14 Q78 18 84 32 Q86 64 50 86 Q14 64 16 32 Q22 18 50 14 Z"
          fill="#1a2b3c"
          stroke="#2563eb"
          strokeWidth="3"
        />
        {/* Inner blue border */}
        <path
          d="M50 22 Q72 25 76 36 Q78 60 50 78 Q22 60 24 36 Q28 25 50 22 Z"
          stroke="#2563eb"
          strokeWidth="1.5"
          fill="#1e3a8a"
        />
        {/* Central Balance Icon */}
        <path d="M50 32 V62 M42 62 H58" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 40 L50 36 L68 40" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 40 L26 52 M32 40 L38 52" stroke="#ffffff" strokeWidth="1" />
        <path d="M25 52 Q32 57 39 52 Z" fill="#60a5fa" />
        <path d="M68 40 L62 52 M68 40 L74 52" stroke="#ffffff" strokeWidth="1" />
        <path d="M61 52 Q68 57 75 52 Z" fill="#60a5fa" />
      </svg>
    );
  }

  // Preset 3: Notary Circular Seal
  if (preset === 'notary_seal') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="50" cy="50" r="46" stroke="#1d4ed8" strokeWidth="3" fill="#ffffff" />
        <circle cx="50" cy="50" r="39" stroke="#2563eb" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="34" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
        {/* Stars */}
        <text x="50" y="26" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="bold">★ ★ ★</text>
        {/* Central Quill & Scales */}
        <path d="M38 46 L62 46 M50 36 V66" stroke="#1a2b3c" strokeWidth="2.5" />
        <circle cx="50" cy="35" r="3" fill="#1d4ed8" />
        <path d="M32 56 Q38 60 44 56 Z" fill="#2563eb" />
        <path d="M56 56 Q62 60 68 56 Z" fill="#2563eb" />
        <text x="50" y="78" textAnchor="middle" fill="#1a2b3c" fontSize="8" fontWeight="bold">NOTARY SEAL</text>
      </svg>
    );
  }

  // Preset 4: Court Columns / Pediment
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="45" stroke="#1a2b3c" strokeWidth="2.5" fill="#f8f9fa" />
      {/* Roof Pediment */}
      <path d="M22 36 L50 20 L78 36 Z" fill="#2563eb" stroke="#1a2b3c" strokeWidth="2" />
      {/* Base */}
      <path d="M20 72 H80 V78 H20 Z" fill="#1a2b3c" />
      <path d="M24 67 H76 V72 H24 Z" fill="#2563eb" />
      {/* 4 Columns */}
      <rect x="28" y="38" width="6" height="28" fill="#1a2b3c" rx="1" />
      <rect x="42" y="38" width="6" height="28" fill="#1a2b3c" rx="1" />
      <rect x="52" y="38" width="6" height="28" fill="#1a2b3c" rx="1" />
      <rect x="66" y="38" width="6" height="28" fill="#1a2b3c" rx="1" />
    </svg>
  );
};
