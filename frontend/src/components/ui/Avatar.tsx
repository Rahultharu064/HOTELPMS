import React from 'react';
import { getImageUrl } from '../../services/api';

interface AvatarProps {
  /** Image URL or path (relative paths go through getImageUrl) */
  src?: string | null;
  /** Full name used to generate initials fallback */
  name?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Shape */
  shape?: 'circle' | 'rounded';
  /** Extra className */
  className?: string;
  /** Show an online / status indicator dot */
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizeMap = {
  xs:  { wrapper: 'w-6  h-6  text-[9px]',  indicator: 'w-1.5 h-1.5' },
  sm:  { wrapper: 'w-8  h-8  text-[11px]', indicator: 'w-2   h-2'   },
  md:  { wrapper: 'w-10 h-10 text-[13px]', indicator: 'w-2.5 h-2.5' },
  lg:  { wrapper: 'w-14 h-14 text-[16px]', indicator: 'w-3   h-3'   },
  xl:  { wrapper: 'w-20 h-20 text-[22px]', indicator: 'w-3.5 h-3.5' },
};

const statusMap = {
  online:  'bg-green-400',
  offline: 'bg-gray-400',
  busy:    'bg-red-400',
  away:    'bg-yellow-400',
};

/** Returns up to 2 initials from a full name. */
function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Avatar — displays an image with a graceful initials fallback.
 *
 * ```tsx
 * <Avatar src={admin.avatar} name="Rahul Tharu" size="lg" status="online" />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  status,
}) => {
  const { wrapper, indicator } = sizeMap[size];
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  const resolvedSrc = src ? getImageUrl(src) : null;

  return (
    <div className={`relative inline-flex shrink-0 ${wrapper} ${className}`}>
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={name || 'Avatar'}
          className={`w-full h-full object-cover ${shapeClass}`}
          onError={(e) => {
            // On broken image, hide and let the initials fallback show
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`
            w-full h-full flex items-center justify-center font-black select-none
            bg-gradient-to-br from-[#1F7A3A] to-[#14532D] text-white
            ${shapeClass}
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 ${indicator} rounded-full ring-2 ring-white
            ${statusMap[status]}
          `}
        />
      )}
    </div>
  );
};

/** Group of overlapping avatars (e.g., assigned staff list). */
export const AvatarGroup: React.FC<{
  items: Array<{ src?: string | null; name?: string }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}> = ({ items, max = 4, size = 'sm', className = '' }) => {
  const visible = items.slice(0, max);
  const overflow = items.length - max;

  return (
    <div className={`flex items-center ${className}`}>
      {visible.map((item, i) => (
        <div
          key={i}
          className="ring-2 ring-white -ml-2 first:ml-0"
        >
          <Avatar src={item.src} name={item.name} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`
            ring-2 ring-white -ml-2 flex items-center justify-center
            ${sizeMap[size].wrapper} rounded-full
            bg-gray-100 text-[#111827] font-black text-[10px]
          `}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
