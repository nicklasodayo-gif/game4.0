import { z } from 'zod';

/** Lead capture form validation schema. */
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  phone: z
    .string()
    .min(9, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(/^(\+?254|0)[17][0-9]{8}$/, 'Please enter a valid Kenyan phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, 'You must accept the terms to continue'),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export function isValidKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  const patterns = [/^(\+254|0)[17][0-9]{8}$/, /^(\+254|0)[1-9][0-9]{7}$/];
  return patterns.some((pattern) => pattern.test(cleaned));
}

export function formatKenyanPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+254')) return cleaned;
  if (cleaned.startsWith('0')) return '+254' + cleaned.slice(1);
  return cleaned;
}

export function isValidEmail(email?: string): boolean {
  if (!email || email.trim() === '') return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidName(name?: string): boolean {
  if (!name || name.trim().length < 2) return false;
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name.trim());
}

export function sanitizeInput(input?: string): string {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '').slice(0, 500);
}
