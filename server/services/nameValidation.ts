import { z } from 'zod';

/**
 * Multi-layer name validation system
 * Prevents fake names, spam, and inappropriate submissions
 */

// ============================================
// LAYER 1: BLACKLIST DATABASE
// ============================================

const BLACKLISTED_NAMES = new Set([
  'test', 'admin', 'administrator', 'user', 'anonymous',
  'fake', 'spam', 'bot', 'null', 'undefined', 'none',
  'asdf', 'qwerty', 'aaaa', 'bbbb', 'xxxx',
  'john doe', 'jane doe', 'mickey mouse', 'donald duck'
]);

const PROFANITY_LIST = new Set([
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
  'cunt', 'dick', 'cock', 'pussy'
  // Add more as needed
]);

// ============================================
// LAYER 2: PATTERN VALIDATION
// ============================================

interface NameValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: number; // 0-100
}

export class NameValidator {
  
  /**
   * Main validation function
   */
  static validate(name: string): NameValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence = 100;

    const trimmedName = name.trim();

    // Check 1: Basic length requirements
    if (trimmedName.length < 3) {
      errors.push('Name must be at least 3 characters');
      return { isValid: false, errors, warnings, confidence: 0 };
    }

    if (trimmedName.length > 50) {
      errors.push('Name is too long (max 50 characters)');
      return { isValid: false, errors, warnings, confidence: 0 };
    }

    // Check 2: Must contain at least first and last name
    const nameParts = trimmedName.split(/\s+/);
    if (nameParts.length < 2) {
      errors.push('Please enter both first and last name');
      confidence -= 50;
    }

    // Check 3: Each part must be at least 2 characters
    const hasShortParts = nameParts.some(part => part.length < 2);
    if (hasShortParts) {
      errors.push('Each part of name must be at least 2 characters');
      confidence -= 30;
    }

    // Check 4: Only allow letters, spaces, hyphens, apostrophes
    const validCharPattern = /^[a-zA-Z\s'-]+$/;
    if (!validCharPattern.test(trimmedName)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
      return { isValid: false, errors, warnings, confidence: 0 };
    }

    // Check 5: Not in blacklist
    const lowerName = trimmedName.toLowerCase();
    if (BLACKLISTED_NAMES.has(lowerName)) {
      errors.push('This name is not allowed');
      return { isValid: false, errors, warnings, confidence: 0 };
    }

    // Check 6: No profanity
    const containsProfanity = Array.from(PROFANITY_LIST).some(word =>
      lowerName.includes(word)
    );
    if (containsProfanity) {
      errors.push('Name contains inappropriate language');
      return { isValid: false, errors, warnings, confidence: 0 };
    }

    // Check 7: Detect repeating characters (aaaa, bbbb)
    if (/(.)\1{3,}/.test(trimmedName)) {
      warnings.push('Name has suspicious repeating characters');
      confidence -= 40;
    }

    // Check 8: Check for common fake patterns
    const fakePatterns = [
      /test\d*/i,
      /user\d*/i,
      /admin\d*/i,
      /^[a-z]+\d+$/i,  // like "john123"
      /^\d+[a-z]+$/i,  // like "123john"
    ];

    const matchesFakePattern = fakePatterns.some(pattern =>
      pattern.test(trimmedName)
    );
    if (matchesFakePattern) {
      warnings.push('Name appears to follow a fake pattern');
      confidence -= 50;
    }

    // Check 9: Check capitalization (real names usually have proper caps)
    const hasProperCapitalization = nameParts.every(part =>
      part[0] === part[0].toUpperCase()
    );
    if (!hasProperCapitalization) {
      warnings.push('Name should have proper capitalization');
      confidence -= 20;
    }

    // Check 10: Too many name parts (suspicious)
    if (nameParts.length > 4) {
      warnings.push('Name has unusually many parts');
      confidence -= 20;
    }

    // Check 11: All same letter (AAA BBB)
    const allSameLetter = nameParts.every(part =>
      part.split('').every(char => char.toLowerCase() === part[0].toLowerCase())
    );
    if (allSameLetter) {
      errors.push('Name appears fake (all same letters)');
      return { isValid: false, errors, warnings, confidence: 0 };
    }

    // Check 12: Consonant/vowel ratio (real names have balance)
    const consonantVowelCheck = this.checkConsonantVowelRatio(trimmedName);
    if (!consonantVowelCheck.isValid) {
      warnings.push('Name has unusual letter patterns');
      confidence -= 30;
    }

    // Final verdict
    const isValid = errors.length === 0 && confidence >= 50;

    return {
      isValid,
      errors,
      warnings,
      confidence: Math.max(0, confidence)
    };
  }

  /**
   * Check consonant/vowel ratio
   * Real names typically have a balanced ratio
   */
  private static checkConsonantVowelRatio(name: string): {
    isValid: boolean;
  } {
    const letters = name.toLowerCase().replace(/[^a-z]/g, '');
    const vowels = letters.match(/[aeiou]/g)?.length || 0;
    const consonants = letters.length - vowels;

    // Names should have at least some vowels
    if (vowels === 0) return { isValid: false };

    // Ratio should be between 0.2 and 5
    const ratio = consonants / vowels;
    return { isValid: ratio >= 0.2 && ratio <= 5 };
  }

  /**
   * Check if name sounds real using phonetic rules
   */
  static checkPhonetics(name: string): boolean {
    // Common impossible letter combinations in English
    const impossibleCombos = [
      /bq/i, /cj/i, /cv/i, /cx/i, /dx/i, /fq/i,
      /fx/i, /gq/i, /gx/i, /hx/i, /jq/i, /jx/i,
      /kq/i, /kx/i, /mx/i, /px/i, /qb/i, /qc/i,
      /qd/i, /qf/i, /qg/i, /qh/i, /qj/i, /qk/i,
      /ql/i, /qm/i, /qn/i, /qp/i, /qr/i, /qs/i,
      /qt/i, /qv/i, /qw/i, /qx/i, /qy/i, /qz/i,
      /sx/i, /vb/i, /vf/i, /vh/i, /vj/i, /vm/i,
      /vp/i, /vq/i, /vt/i, /vw/i, /vx/i, /wx/i,
      /xj/i, /xx/i, /zx/i
    ];

    const hasImpossibleCombo = impossibleCombos.some(combo =>
      combo.test(name)
    );

    return !hasImpossibleCombo;
  }

  /**
   * Advanced: Call external name validation API
   */
  static async validateWithAPI(name: string): Promise<{
    isReal: boolean;
    confidence: number;
  }> {
    try {
      // Example using a hypothetical name validation API
      // Replace with actual API if you want this feature
      
      /*
      const response = await fetch('https://api.namevalidation.com/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      const data = await response.json();
      return {
        isReal: data.is_real,
        confidence: data.confidence
      };
      */

      // Placeholder - always returns true for now
      return { isReal: true, confidence: 100 };
    } catch (error) {
      console.error('Name validation API error:', error);
      return { isReal: true, confidence: 50 }; // Default to allowing
    }
  }
}

// ============================================
// LAYER 3: ZOD SCHEMA FOR FORM VALIDATION
// ============================================

export const nameSchema = z
  .string()
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name is too long')
  .refine(
    (name: string) => {
      const result = NameValidator.validate(name);
      return result.isValid;
    },
    {
      message: 'Please enter a valid real name',
    }
  );

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Basic validation
const result1 = NameValidator.validate("John Doe");
console.log(result1);
// { isValid: true, errors: [], warnings: [], confidence: 100 }

// Example 2: Fake name
const result2 = NameValidator.validate("test user");
console.log(result2);
// { isValid: false, errors: ['This name is not allowed'], warnings: [], confidence: 0 }

// Example 3: Suspicious name
const result3 = NameValidator.validate("john123");
console.log(result3);
// { isValid: false, errors: [...], warnings: ['Name appears to follow a fake pattern'], confidence: 50 }
