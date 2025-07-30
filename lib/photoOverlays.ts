import { PhotoType } from '@/lib/types';

export interface OverlayConfig {
  /** Inset from edges in pixels, or [vertical, horizontal] for asymmetric */
  inset: number | [number, number];
  /** Border style for the overlay */
  style: 'solid' | 'dashed' | 'none';
  /** Whether to show the overlay bounding box */
  show: boolean;
  /** Helper text to display above the overlay */
  label?: string;
  /** Special overlay variants for specific composition guides */
  variant?: 'vertical-third' | 'horizontal-third' | 'corners-only';
}

/**
 * Configuration for camera overlay guidance per photo type.
 * Each PhotoType should have a corresponding entry to ensure
 * appropriate visual guidance for users.
 */
export const OVERLAY_CONFIG: Record<PhotoType, OverlayConfig> = {
  // Meter photos - need precise framing
  meter_closeup: {
    inset: 16,
    style: 'solid',
    show: true,
    label: 'Frame the meter display clearly'
  },
  
  meter_area_wide: {
    inset: 32,
    style: 'dashed',
    show: true,
    label: 'Show entire meter area'
  },
  
  // Side areas - vertical rectangles to guide panning
  meter_area_right: {
    inset: [16, 64],
    style: 'dashed',
    show: true,
    label: 'Area right of meter'
  },
  
  meter_area_left: {
    inset: [16, 64],
    style: 'dashed',
    show: true,
    label: 'Area left of meter'
  },
  
  // Wall shots - rule of thirds guidance only
  adjacent_wall: {
    inset: 0,
    style: 'none',
    show: false,
    variant: 'horizontal-third',
    label: 'Corner to corner wall view'
  },
  
  area_behind_fence: {
    inset: 32,
    style: 'dashed',
    show: true,
    label: 'Show fence and area behind it'
  },
  
  // Label shots - need tight, readable framing
  ac_unit_label: {
    inset: 16,
    style: 'solid',
    show: true,
    label: 'Zoom until label text is readable'
  },
  
  second_ac_unit_label: {
    inset: 16,
    style: 'solid',
    show: true,
    label: 'Zoom until label text is readable'
  },
  
  // Electrical panel shots
  breaker_box_interior: {
    inset: 24,
    style: 'solid',
    show: true,
    label: 'Capture all breakers in panel'
  },
  
  main_disconnect_switch: {
    inset: 16,
    style: 'solid',
    show: true,
    label: 'Center main switch - make rating visible'
  },
  
  breaker_box_area: {
    inset: 32,
    style: 'dashed',
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
  const { inset, style, show } = config;
  
  if (!show) {
    return {
      containerClass: 'absolute inset-0 pointer-events-none',
      borderClass: '',
      labelClass: ''
    };
  }
  
  // Map inset values to predefined Tailwind classes
  let insetClass = '';
  if (typeof inset === 'number') {
    switch (inset) {
      case 16: insetClass = 'inset-4'; break;
      case 24: insetClass = 'inset-6'; break;
      case 32: insetClass = 'inset-8'; break;
      case 48: insetClass = 'inset-12'; break;
      case 64: insetClass = 'inset-16'; break;
      default: insetClass = 'inset-6'; // fallback
    }
  } else {
    const [vertical, horizontal] = inset;
    // Handle asymmetric insets for side areas
    if (vertical === 16 && horizontal === 64) {
      insetClass = 'top-4 bottom-4 left-16 right-16';
    } else {
      insetClass = 'inset-6'; // fallback
    }
  }
  
  // Border style classes
  const borderStyleClass = style === 'dashed' ? 'border-dashed' : 'border-solid';
  const borderColorClass = 'border-grounded';
  
  return {
    containerClass: 'absolute inset-0 pointer-events-none',
    borderClass: `absolute ${insetClass} border-2 ${borderStyleClass} ${borderColorClass} rounded-base`,
    labelClass: 'absolute top-4 left-1/2 transform -translate-x-1/2 bg-grounded text-white px-3 py-2 rounded-base text-body-small font-primary text-center whitespace-nowrap'
  };
}