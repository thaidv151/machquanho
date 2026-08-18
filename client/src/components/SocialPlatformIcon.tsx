import React from 'react';
import { Facebook, Youtube, Mail, Globe, Phone, Instagram, Music, MessageCircle, Link as LinkIcon } from 'lucide-react';

interface SocialPlatformIconProps {
  iconType?: string;
  iconUrl?: string;
  name?: string;
  className?: string;
}

export const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({
  iconType,
  iconUrl,
  name,
  className = "w-4 h-4"
}) => {
  if (iconUrl) {
    return <img src={iconUrl} alt={name || 'Social'} className={`${className} object-contain transition-all`} />;
  }

  switch (iconType) {
    case 'facebook':
      return <Facebook className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'tiktok':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.82V7.6a6.34 6.34 0 0 0-4.5 1.15 6.34 6.34 0 1 0 10.84 4.47V9.05a8.27 8.27 0 0 0 4.77 1.48V7.08a4.86 4.86 0 0 1-1-.39z"/>
        </svg>
      );
    case 'zalo':
      return <MessageCircle className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'spotify':
    case 'music':
      return <Music className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'globe':
    case 'website':
      return <Globe className={className} />;
    case 'phone':
      return <Phone className={className} />;
    default:
      return <span className="font-bold text-xs">{(name || 'S').charAt(0).toUpperCase()}</span>;
  }
};
