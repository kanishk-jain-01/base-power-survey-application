import { SurveyStep } from '@/lib/types';

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: 'meter-closeup',
    title: 'Electricity Meter (Close-up)',
    instruction:
      'Get close enough so the numbers on the meter are clear and legible.',
    photoType: 'meter_closeup',
    validationChecks: [
      'Image contains an electricity meter',
      'Numbers/text are visible and legible',
      'Image is sharp and not blurry',
      'Meter fills significant portion of frame',
    ],
  },
  {
    id: 'meter-area',
    title: 'Area Around Meter (Wide Shot)',
    instruction:
      'Take about 10 steps back and capture a wide photo showing the entire area around the meter.',
    photoType: 'meter_area_wide',
    validationChecks: [
      'Meter is visible in wider context',
      'Shows building exterior wall',
      'Includes ground and surrounding area',
      'Shows potential obstructions',
    ],
  },
  {
    id: 'meter-right',
    title: 'Area to the RIGHT of Meter',
    instruction:
      'Staying where you are, please pan your camera to the right and capture the wall and any open space next to the meter.',
    photoType: 'meter_area_right',
    validationChecks: [
      'Shows exterior wall and ground space',
      'Different from previous wide shot',
      'Captures area to the right of meter',
    ],
  },
  {
    id: 'meter-left',
    title: 'Area to the LEFT of Meter',
    instruction:
      'Now, please pan to the left and capture the wall and space on the other side of the meter.',
    photoType: 'meter_area_left',
    validationChecks: [
      'Shows exterior wall and ground space',
      'Different from previous shots',
      'Captures area to the left of meter',
    ],
  },
  {
    id: 'adjacent-wall',
    title: 'Adjacent Wall / Side Yard',
    instruction: 'Take a photo from corner to corner to show the entire wall.',
    photoType: 'adjacent_wall',
    validationChecks: [
      'Shows long expanse of exterior wall',
      'Includes corner of house if visible',
    ],
  },
  {
    id: 'area-behind-fence',
    title: 'Area Behind Fence (If Applicable)',
    instruction:
      'If there is a fence on this side of the house, please take a photo of the area behind it. Otherwise, tap "Skip".',
    photoType: 'area_behind_fence',
    validationChecks: [
      'Fence is visible',
      'Shows space between fence and wall',
      'Image is sharp and not blurry',
    ],
    isConditional: true,
  },
  {
    id: 'ac-unit-label',
    title: 'A/C Unit Label',
    instruction:
      "Find the label on your A/C unit. We need a clear, close-up photo where the 'LRA' number is readable.",
    photoType: 'ac_unit_label',
    validationChecks: [
      'Contains metallic or paper label with specifications',
      'Text is readable, especially LRA/RLA numbers',
      'Label is primary subject of photo',
    ],
  },
  {
    id: 'second-ac-unit',
    title: 'Second A/C Unit Label (If Applicable)',
    instruction:
      'If you have a second A/C unit, please take a photo of its label as well. If not, you can skip this.',
    photoType: 'second_ac_unit_label',
    validationChecks: [
      'Contains metallic or paper label with specifications',
      'Text is readable, especially LRA/RLA numbers',
      'Label is primary subject of photo',
    ],
    isConditional: true,
  },
  {
    id: 'breaker-box-interior',
    title: 'Main Breaker Box (Panel Interior)',
    instruction:
      'Find your main breaker box. Open the metal door and take a photo of all the switches inside.',
    photoType: 'breaker_box_interior',
    validationChecks: [
      'Shows inside of electrical panel',
      'Multiple rows of breaker switches visible',
      'Entire set of breakers is visible',
    ],
  },
  {
    id: 'main-disconnect',
    title: 'Main Disconnect Switch (Close-up)',
    instruction:
      'Find the main switch, usually the largest one at the top. We need a clear, close-up photo to see the number on the switch (e.g., 100, 150, or 200).',
    photoType: 'main_disconnect_switch',
    validationChecks: [
      'Focuses on single, larger breaker switch',
      'Number (100, 125, 150, 200) is visible and readable',
      'Switch is labeled as "Main" if applicable',
    ],
  },
  {
    id: 'breaker-box-area',
    title: 'Area Around Main Breaker Box',
    instruction:
      'Take a wide photo showing the area around the breaker box so we can see its location and any nearby obstructions.',
    photoType: 'breaker_box_area',
    validationChecks: [
      'Breaker box visible in larger context',
      'Shows location (garage wall, closet, etc.)',
      'Includes surrounding area and obstructions',
    ],
  },
];

export const getStepById = (stepId: string): SurveyStep | undefined => {
  return SURVEY_STEPS.find((step) => step.id === stepId);
};

export const getNextStepId = (currentStepId: string): string | null => {
  const currentIndex = SURVEY_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  if (currentIndex === -1 || currentIndex === SURVEY_STEPS.length - 1) {
    return null;
  }
  return SURVEY_STEPS[currentIndex + 1].id;
};

export const getPreviousStepId = (currentStepId: string): string | null => {
  const currentIndex = SURVEY_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  if (currentIndex <= 0) {
    return null;
  }
  return SURVEY_STEPS[currentIndex - 1].id;
};

export const getStepProgress = (
  stepId: string
): { current: number; total: number } => {
  const currentIndex = SURVEY_STEPS.findIndex((step) => step.id === stepId);
  return {
    current: currentIndex === -1 ? 0 : currentIndex,
    total: SURVEY_STEPS.length,
  };
};
