import React from 'react';
import { cn } from './utils';

export function DfineLogo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative h-[28px] w-[115px] select-none transition-all duration-300',
        className
      )}
    >
      {/* Dark charcoal logo for light backgrounds */}
      <img
        src="/images/dfine-logo-dark.png"
        alt="D'fine Apparel Store"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          inverted ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
      {/* Light/White logo for dark backgrounds */}
      <img
        src="/images/dfine-logo-white.png"
        alt="D'fine Apparel Store"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          inverted ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </div>
  );
}

export function MenuIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="7" y1="16" x2="57" y2="16" />
      <line x1="7" y1="32" x2="57" y2="32" />
      <line x1="7" y1="48" x2="57" y2="48" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="28.58" cy="28.58" r="18.58" />
      <line x1="54" y1="54" x2="41.94" y2="42" />
    </svg>
  );
}

export function AccountIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor">
      <path d="M35 39.84v-2.53c3.3-1.91 6-6.66 6-11.41 0-7.63 0-13.82-9-13.82s-9 6.19-9 13.82c0 4.75 2.7 9.51 6 11.41v2.53c-10.18.85-18 6-18 12.16h42c0-6.19-7.82-11.31-18-12.16Z" />
    </svg>
  );
}

export function BagIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <rect x="11.375" y="17.863" width="41.25" height="36.75" />
      <path d="M22.25 18c0-7.105 4.35-9 9.75-9s9.75 1.895 9.75 9" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function ChevronRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 4l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m1.57 1.59 12.76 12.77L27.1 1.59" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 10l5 5 7-8" />
    </svg>
  );
}

export function PlusIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="10" y1="4" x2="10" y2="16" />
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  );
}

export function MinusIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  );
}

export function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <polygon points="10 1.5 12.8 7.2 19 8.1 14.5 12.5 15.6 18.7 10 15.7 4.4 18.7 5.5 12.5 1 8.1 7.2 7.2 10 1.5" />
    </svg>
  );
}

export function FeatherIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 11.5V21h9.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

export function TextureIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
    </svg>
  );
}

export function RepeatIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 3.094c4.206 0 4.7.019 6.363.094 1.538.069 2.369.325 2.925.544.738.287 1.262.625 1.813 1.175s.894 1.075 1.175 1.813c.212.556.475 1.387.544 2.925.075 1.662.094 2.156.094 6.363s-.019 4.7-.094 6.363c-.069 1.538-.325 2.369-.544 2.925-.288.738-.625 1.262-1.175 1.813s-1.075.894-1.813 1.175c-.556.212-1.387.475-2.925.544-1.663.075-2.156.094-6.363.094s-4.7-.019-6.363-.094c-1.537-.069-2.369-.325-2.925-.544-.737-.288-1.263-.625-1.813-1.175s-.894-1.075-1.175-1.813c-.212-.556-.475-1.387-.544-2.925-.075-1.663-.094-2.156-.094-6.363s.019-4.7.094-6.363c.069-1.537.325-2.369.544-2.925.287-.737.625-1.263 1.175-1.813s1.075-.894 1.813-1.175c.556-.212 1.388-.475 2.925-.544 1.662-.081 2.156-.094 6.363-.094zm0-2.838c-4.275 0-4.813.019-6.494.094-1.675.075-2.819.344-3.819.731-1.037.4-1.913.944-2.788 1.819S1.486 4.656 1.08 5.688c-.387 1-.656 2.144-.731 3.825-.075 1.675-.094 2.213-.094 6.488s.019 4.813.094 6.494c.075 1.675.344 2.819.731 3.825.4 1.038.944 1.913 1.819 2.788s1.756 1.413 2.788 1.819c1 .387 2.144.656 3.825.731s2.213.094 6.494.094 4.813-.019 6.494-.094c1.675-.075 2.819-.344 3.825-.731 1.038-.4 1.913-.944 2.788-1.819s1.413-1.756 1.819-2.788c.387-1 .656-2.144.731-3.825s.094-2.212.094-6.494-.019-4.813-.094-6.494c-.075-1.675-.344-2.819-.731-3.825-.4-1.038-.944-1.913-1.819-2.788s-1.756-1.413-2.788-1.819c-1-.387-2.144-.656-3.825-.731C20.812.275 20.275.256 16 .256z" />
      <path d="M16 7.912a8.088 8.088 0 0 0 0 16.175c4.463 0 8.087-3.625 8.087-8.088s-3.625-8.088-8.088-8.088zm0 13.338a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 1 1 0 10.5zM26.294 7.594a1.887 1.887 0 1 1-3.774.002 1.887 1.887 0 0 1 3.774-.003z" />
    </svg>
  );
}

export function ThreadsIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M14.743 9.27a6.873 6.873 0 0 0-.262-.12c-.154-2.844-1.708-4.472-4.318-4.49h-.036c-1.56 0-2.859.667-3.658 1.88l1.435.984c.597-.905 1.534-1.098 2.224-1.098h.024c.86.005 1.508.255 1.927.742.306.355.51.845.611 1.464a10.98 10.98 0 0 0-2.467-.12c-2.48.144-4.076 1.59-3.969 3.602.054 1.02.563 1.897 1.43 2.47.735.485 1.68.722 2.663.668 1.298-.07 2.316-.566 3.026-1.471.54-.688.88-1.579 1.031-2.701.619.373 1.077.864 1.33 1.455.43 1.003.456 2.652-.89 3.997-1.18 1.178-2.596 1.688-4.738 1.703-2.376-.017-4.173-.78-5.342-2.264C3.67 14.58 3.105 12.57 3.084 10c.021-2.571.586-4.58 1.68-5.97 1.169-1.486 2.966-2.248 5.341-2.265 2.394.017 4.222.783 5.435 2.275.595.732 1.043 1.653 1.339 2.726l1.682-.45c-.358-1.32-.922-2.458-1.69-3.402C15.316 1.001 13.041.02 10.111 0H10.1C7.175.02 4.926 1.004 3.415 2.925c-1.344 1.709-2.037 4.087-2.06 7.068v.014c.023 2.98.716 5.359 2.06 7.068C4.926 18.995 7.175 19.98 10.1 20h.011c2.6-.018 4.433-.699 5.943-2.207 1.975-1.974 1.916-4.447 1.265-5.966-.467-1.089-1.358-1.973-2.576-2.557Zm-4.489 4.22c-1.087.062-2.217-.427-2.273-1.472-.041-.775.552-1.64 2.34-1.743.205-.012.406-.018.603-.018.65 0 1.257.063 1.81.184-.207 2.573-1.415 2.99-2.48 3.05Z" />
    </svg>
  );
}

export function FacebookIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function YouTubeIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function PinterestIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.494 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 .981.377 2.033.849 2.605.093.113.107.212.079.327-.087.361-.281 1.144-.319 1.303-.051.21-.168.255-.387.154-1.444-.672-2.345-2.78-2.345-4.472 0-3.642 2.646-6.988 7.63-6.988 4.007 0 7.121 2.856 7.121 6.671 0 3.982-2.511 7.187-5996 7.187-1.171 0-2.272-.609-2.648-1.328l-.721 2.747c-.261.996-.968 2.245-1.441 3.012A11.968 11.968 0 0 0 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

export function TikTokIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}
