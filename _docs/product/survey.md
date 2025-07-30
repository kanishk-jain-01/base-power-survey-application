# AR Home Energy Survey - Photo Validation Criteria

## Part 1: Exterior Meter & Space Assessment

### 1. Electricity Meter (Close-up)

**Instruction:** "Let's start with your electricity meter. Please get close enough so the numbers on it are clear and legible."

**AI Validation Checks:**

- Does the image contain an object that is identifiable as an electricity meter (circular or rectangular, with a glass/plastic cover and visible dials or digital display)?
- Is there visible text or numbers on the face of the meter? Is the image sharp and not blurry?
- Is the meter the primary subject, filling a significant portion of the frame?

### 2. Area Around Meter (Wide Shot)

**Instruction:** "Now, please take about 10 steps back from the wall and take a wide photo showing the entire area around the meter."

**AI Validation Checks:**

- Is the previously identified meter visible within a wider shot of a building's exterior wall?
- Does the image show the ground, the wall, and any potential obstructions like windows, doors, or other utility boxes near the meter?

### 3. Area to the RIGHT of Meter

**Instruction:** "Staying where you are, please pan your camera to the right and capture the wall and any open space next to the meter."

**AI Validation Checks:**

- Does the image show an exterior wall and adjacent ground space?
- Is it different from the previous wide shot?

### 4. Area to the LEFT of Meter

**Instruction:** "Great. Now, please pan to the left and capture the wall and space on the other side of the meter."

**AI Validation Checks:**

- Does the image show an exterior wall and adjacent ground space?
- Is it different from the two previous shots?

### 5. Adjacent Wall / Side Yard

**Instruction:** "Let's see the whole side of the house. Please take a photo from corner to corner to show the entire wall."

**AI Validation Checks:**

- Does the image show a long expanse of an exterior wall, likely including a corner of the house?

### 6. Area Behind Fence (Conditional)

**Instruction:** "If there is a fence on this side of the house, please take a photo of the area behind it."

**AI Validation Checks:**

- Does the image contain a fence?
- Does the image show the space between the fence and the house wall?

## Part 2: A/C Unit(s)

### 7. A/C Unit Label

**Instruction:** "Please find the label on your A/C unit. We need a clear, close-up photo where the 'LRA' number is readable."

**AI Validation Checks:**

- Does the image contain a metallic or paper label with printed technical specifications?
- Can the AI detect and read text on the label? Specifically, can it identify the acronym "LRA" or "RLA"?
- Is the label the primary subject of the photo?

### 8. Second A/C Unit Label (Conditional)

**Instruction:** "If you have a second A/C unit, please take a photo of its label as well. If not, you can skip this."

**AI Validation Checks:**

- Same as step 7

## Part 3: Main Electrical Panel

### 9. Main Breaker Box (Panel Interior)

**Instruction:** "Now, please find your main breaker box. Open the metal door and take a photo of all the switches inside."

**AI Validation Checks:**

- Does the image show the inside of an electrical panel with multiple rows of breaker switches?
- Is the entire set of breakers visible?

### 10. Main Disconnect Switch (Close-up)

**Instruction:** "Find the main switch, which is usually the largest one at the top. We need a clear, close-up photo of it to see the number on the switch (e.g., 100, 150, or 200)."

**AI Validation Checks:**

- Does the image focus on a single, larger breaker switch, often labeled "Main"?
- Is there a number (e.g., 100, 125, 150, 200) visible and readable on or near the switch?

### 11. AI-First Data Entry: Main Disconnect Amperage

The AI will attempt to read the amperage number (e.g., 100, 150, 200) from the photo of the main disconnect switch.

**If successful:** The application will pre-fill the value and ask the user for confirmation (e.g., "We see your main switch is 200A. Is this correct?").

**If unsuccessful or low confidence:** The application will prompt the user to enter the number manually.

### 12. Area Around Main Breaker Box

**Instruction:** "Finally, please take a wide photo showing the area around the breaker box so we can see its location and any nearby obstructions."

**AI Validation Checks:**

- Is the breaker box visible within a larger context (e.g., on a garage wall, in a closet)?

## General Validation Framework

### Real-Time Validation Requirements:

1. **Object Correctness:** The photo contains the correct subject (e.g., a meter, not a mailbox)
2. **Image Quality:** The image is in focus and the labels are legible enough for human review

### Feedback Loop:

- **Success:** Positive confirmation and automatic advancement to the next step
- **Failure:** Specific, actionable feedback (e.g., "Image is too blurry. Please hold steady and try again.")
- **Manual Override:** In case of repeated failure, the user must have an option to bypass the validation ("Use photo anyway")
