import { PhotoType } from '@/lib/types';

export interface OverlayConfig {
  /** Overlay size based on shot distance requirements */
  size: 'large' | 'medium' | 'small';
  /** Whether to show the overlay bounding box */
  show: boolean;
  /** Helper text to display above the overlay */
  label?: string;
}

/**
 * Configuration for camera overlay guidance per photo type.
 * Each PhotoType should have a corresponding entry to ensure
 * appropriate visual guidance for users.
 * 
 * Overlay sizes are distance-based:
 * - Large: Close-up shots (~90% viewport) - tight subject framing
 * - Medium: Medium shots (~70% viewport) - moderate framing  
 * - Small: Wide shots (~50% viewport) - contextual framing
 */
export const OVERLAY_CONFIG: Record<PhotoType, OverlayConfig> = {
  // Close-up shots - large overlay for precise subject framing
  meter_closeup: {
    size: 'large',
    show: true,
    label: 'Frame the meter display clearly'
  },
  
  ac_unit_label: {
    size: 'large',
    show: true,
    label: 'Get close enough to read label text clearly'
  },
  
  second_ac_unit_label: {
    size: 'large',
    show: true,
    label: 'Get close enough to read label text clearly'
  },
  
  main_disconnect_switch: {
    size: 'large',
    show: true,
    label: 'Center main switch - make rating visible'
  },
  
  // Medium shots - moderate overlay for panel areas and side views
  meter_area_right: {
    size: 'medium',
    show: true,
    label: 'Area right of meter'
  },
  
  meter_area_left: {
    size: 'medium',
    show: true,
    label: 'Area left of meter'
  },
  
  breaker_box_interior: {
    size: 'medium',
    show: true,
    label: 'Capture all breakers in panel'
  },
  
  // Wide shots - small overlay for contextual area shots
  meter_area_wide: {
    size: 'small',
    show: true,
    label: 'Show entire meter area'
  },
  
  adjacent_wall: {
    size: 'small',
    show: true,
    label: 'Corner to corner wall view'
  },
  
  area_behind_fence: {
    size: 'small',
    show: true,
    label: 'Show fence and area behind it'
  },
  
  breaker_box_area: {
    size: 'small',
    show: true,
    label: 'Show area around breaker box'
  }
};

/**
 * Get overlay configuration for a specific photo type
 */
export function getOverlayConfig(photoType: PhotoType): OverlayConfig {
  const config = OVERLAY_CONFIG[photoType];
  
  if (!config) {
    // This should never happen with proper TypeScript usage, but adding runtime safety
    throw new Error(`No overlay config found for photo type: ${photoType}. All PhotoTypes must have corresponding overlay configuration.`);
  }
  
  return config;
}

/**
 * Type-safe validation that ensures all PhotoTypes have overlay configuration.
 * This will cause a TypeScript compilation error if any PhotoType is missing from OVERLAY_CONFIG.
 */
type ValidateOverlayConfig = {
  [K in PhotoType]: K extends keyof typeof OVERLAY_CONFIG ? true : never;
};

// This will cause a TS error if any PhotoType is missing from OVERLAY_CONFIG
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _validateOverlayConfig: ValidateOverlayConfig = {} as ValidateOverlayConfig;

/**
 * Generate CSS classes for overlay styling based on config
 */
export function getOverlayStyles(config: OverlayConfig): {
  containerClass: string;
  borderClass: string;
  labelClass: string;
} {
  const { size, show } = config;
  
  if (!show) {
    return {
      containerClass: 'absolute inset-0 pointer-events-none',
      borderClass: '',
      labelClass: ''
    };
  }
  
  // Map overlay sizes to inset classes
  let insetClass = '';
  switch (size) {
    case 'large':
      insetClass = 'inset-4'; // ~90% viewport (16px inset)
      break;
    case 'medium':
      insetClass = 'inset-8'; // ~70% viewport (32px inset)
      break;
    case 'small':
      insetClass = 'inset-16'; // ~50% viewport (64px inset)
      break;
    default:
      insetClass = 'inset-8'; // fallback to medium
  }
  
  // All overlays are dashed with consistent styling
  const borderStyleClass = 'border-dashed';
  const borderColorClass = 'border-grounded';
  
  return {
    containerClass: 'absolute inset-0 pointer-events-none',
    borderClass: `absolute ${insetClass} border-2 ${borderStyleClass} ${borderColorClass} rounded-base`,
    labelClass: 'absolute top-4 left-1/2 transform -translate-x-1/2 bg-grounded text-white px-3 py-2 rounded-base text-body-small font-primary text-center whitespace-nowrap'
  };
}