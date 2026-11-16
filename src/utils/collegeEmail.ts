import { StudentBranch } from '../types';

/**
 * Validates Medi-Caps institutional mail IDs:
 * Format: en<2 digits><2 branch letters><6 or 7 digits>@medicaps.ac.in
 * Example: en22cs301045@medicaps.ac.in or en22ce3010045@medicaps.ac.in
 * - Position 1-2: "en"
 * - 1st & 2nd x: 2 numeric digits (admission batch year, e.g. 22, 23, 24)
 * - 3rd & 4th x: 2 alphabetic letters denoting branch (cs, ce, me, it, ec, ai, ds, ee, etc.)
 * - Rest x: 6 to 7 numeric digits
 * - Domain: @medicaps.ac.in
 */
export const COLLEGE_EMAIL_REGEX = /^en\d{2}[a-z]{2}\d{6,7}@medicaps\.ac\.in$/i;

export const BRANCH_CODE_MAP: Record<string, StudentBranch> = {
  cs: 'Computer Science (CSE)',
  ai: 'CSE - AI & ML',
  it: 'Information Technology (IT)',
  ec: 'Electronics & Comm (ECE)',
  ds: 'Data Science',
  me: 'Mechanical',
  ce: 'Civil Engineering (CE)',
  ee: 'Electrical Engineering (EE)',
};

export const VALID_BRANCH_CODES = Object.keys(BRANCH_CODE_MAP);

export interface ParsedCollegeEmail {
  isValid: boolean;
  email: string;
  enrollmentNumber: string;
  yearCode: string;
  branchCode: string;
  detectedBranch?: StudentBranch;
  rollDigits: string;
  errorReason?: string;
}

export function parseCollegeEmail(rawEmail: string): ParsedCollegeEmail {
  const email = rawEmail.trim().toLowerCase();
  const [localPart = '', domain = ''] = email.split('@');

  if (!email) {
    return {
      isValid: false,
      email,
      enrollmentNumber: '',
      yearCode: '',
      branchCode: '',
      rollDigits: '',
      errorReason: 'College mail ID is required.',
    };
  }

  if (domain !== 'medicaps.ac.in') {
    return {
      isValid: false,
      email,
      enrollmentNumber: localPart.toUpperCase(),
      yearCode: '',
      branchCode: '',
      rollDigits: '',
      errorReason: 'Email must end with @medicaps.ac.in.',
    };
  }

  if (!localPart.startsWith('en')) {
    return {
      isValid: false,
      email,
      enrollmentNumber: localPart.toUpperCase(),
      yearCode: '',
      branchCode: '',
      rollDigits: '',
      errorReason: 'Mail ID must start with "en" (format: enxxxxxxxxxxx@medicaps.ac.in).',
    };
  }

  const match = localPart.match(/^en(\d{2})([a-z]{2})(\d{6,7})$/i);
  if (!match) {
    return {
      isValid: false,
      email,
      enrollmentNumber: localPart.toUpperCase(),
      yearCode: localPart.slice(2, 4),
      branchCode: localPart.slice(4, 6),
      rollDigits: localPart.slice(6),
      errorReason:
        'Use format en<2 digits><branch code e.g. cs, ce, me><6-7 digits>@medicaps.ac.in (e.g. en22cs301045@medicaps.ac.in).',
    };
  }

  const [, yearCode, branchCodeRaw, rollDigits] = match;
  const branchCode = branchCodeRaw.toLowerCase();
  const detectedBranch = BRANCH_CODE_MAP[branchCode];

  return {
    isValid: true,
    email,
    enrollmentNumber: localPart.toUpperCase(),
    yearCode,
    branchCode,
    detectedBranch,
    rollDigits,
  };
}
