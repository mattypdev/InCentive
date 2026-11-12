export interface ScoreResult {
  credit: 0 | 0.5 | 1
  misconception?: string
}

// Multiple choice: exact match only
export function scoreMc(correct: string, response: string): ScoreResult {
  return response === correct ? { credit: 1 } : { credit: 0, misconception: `selected ${response}` }
}

// True/false (same as mc for 2 options)
export function scoreTrueFalse(correct: string, response: string): ScoreResult {
  return response === correct ? { credit: 1 } : { credit: 0, misconception: `said ${response}` }
}

// Sort: all items must be in correct bucket
export function scoreSort(
  correct: Record<string, string>,
  response: Record<string, string>,
): ScoreResult {
  const keys = Object.keys(correct)
  const allRight = keys.every(k => response[k] === correct[k])
  if (allRight) return { credit: 1 }
  const numRight = keys.filter(k => response[k] === correct[k]).length
  return numRight / keys.length >= 0.5
    ? { credit: 0.5, misconception: `${keys.length - numRight} item(s) misplaced` }
    : { credit: 0, misconception: `${keys.length - numRight} item(s) misplaced` }
}

// Order: exact sequence required
export function scoreOrder(correct: string[], response: string[]): ScoreResult {
  const allRight = correct.every((id, i) => response[i] === id)
  if (allRight) return { credit: 1 }
  const numRight = correct.filter((id, i) => response[i] === id).length
  return numRight / correct.length >= 0.5
    ? { credit: 0.5, misconception: `${correct.length - numRight} step(s) out of order` }
    : { credit: 0, misconception: `${correct.length - numRight} step(s) out of order` }
}

// Word bank: all blanks must be filled correctly
export function scoreWordbank(
  correct: Record<string, string>,
  response: Record<string, string>,
): ScoreResult {
  const keys = Object.keys(correct)
  const allRight = keys.every(k => response[k] === correct[k])
  if (allRight) return { credit: 1 }
  const numRight = keys.filter(k => response[k] === correct[k]).length
  return numRight / keys.length >= 0.5
    ? { credit: 0.5, misconception: `${keys.length - numRight} blank(s) wrong` }
    : { credit: 0, misconception: `${keys.length - numRight} blank(s) wrong` }
}

// Number line: tolerance-based
export function scoreNumberline(correct: number, tolerance: number, response: number): ScoreResult {
  const diff = Math.abs(response - correct)
  if (diff === 0) return { credit: 1 }
  if (diff <= tolerance) return { credit: 1 }
  // partial credit if within 2× tolerance
  if (diff <= tolerance * 2) return { credit: 0.5, misconception: `off by ${diff.toFixed(0)}` }
  return { credit: 0, misconception: `off by ${diff.toFixed(0)}` }
}

// Slider: tolerance is a fraction of the correct value (e.g., 0.25 = ±25%)
export function scoreSlider(correct: number, tolerance: number, response: number): ScoreResult {
  const diff = Math.abs(response - correct)
  const thresh = correct * tolerance
  if (diff <= thresh * 0.5) return { credit: 1 }
  if (diff <= thresh) return { credit: 0.5, misconception: `answered ${response}` }
  return { credit: 0, misconception: `answered ${response}` }
}

// Fill number: same tolerance logic as slider
export function scoreFillNumber(correct: number, tolerance: number, response: number): ScoreResult {
  return scoreSlider(correct, tolerance, response)
}

// Spot the mistake: tap the right hotspot
export function scoreSpotMistake(correct: string, response: string): ScoreResult {
  return response === correct ? { credit: 1 } : { credit: 0, misconception: `tapped ${response}` }
}

// Scenario: exact match (like mc)
export function scoreScenario(correct: string, response: string): ScoreResult {
  return response === correct ? { credit: 1 } : { credit: 0, misconception: `chose ${response}` }
}

// Dispatcher — called by LessonPlayer
export function score(
  type: string,
  config: Record<string, unknown>,
  response: unknown,
): ScoreResult {
  switch (type) {
    case 'mc':
      return scoreMc(config.correct as string, response as string)
    case 'true_false':
      return scoreTrueFalse(config.correct as string, response as string)
    case 'sort':
      return scoreSort(config.correct as Record<string, string>, response as Record<string, string>)
    case 'order':
      return scoreOrder(config.correct as string[], response as string[])
    case 'wordbank':
      return scoreWordbank(config.correct as Record<string, string>, response as Record<string, string>)
    case 'numberline':
      return scoreNumberline(
        config.correct as number,
        config.tolerance as number,
        response as number,
      )
    case 'slider':
      return scoreSlider(config.correct as number, config.tolerance as number, response as number)
    case 'fill_number':
      return scoreFillNumber(config.correct as number, config.tolerance as number, response as number)
    case 'spot_mistake':
      return scoreSpotMistake(config.correct as string, response as string)
    case 'scenario':
      return scoreScenario(config.correct as string, response as string)
    default:
      return { credit: 0, misconception: 'unknown question type' }
  }
}
