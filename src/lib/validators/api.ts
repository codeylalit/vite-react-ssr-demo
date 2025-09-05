import { z } from 'zod';

// API key creation schema
export const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, 'API key name is required')
    .max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  expiresAt: z.date().optional(),
});

// User settings schema
export const userSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  timezone: z.string(),
  language: z.string(),
});

// Billing settings schema
export const billingSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  billingAddress: z.object({
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

// Support ticket schema
export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum(['technical', 'billing', 'feature-request', 'bug-report', 'other']),
  attachments: z.array(z.instanceof(File)).optional(),
});

// Usage limit schema
export const usageLimitSchema = z.object({
  monthly: z.number().min(0, 'Monthly limit must be positive'),
  daily: z.number().min(0, 'Daily limit must be positive'),
  enabled: z.boolean(),
});

export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
export type BillingFormData = z.infer<typeof billingSchema>;
export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
export type UsageLimitFormData = z.infer<typeof usageLimitSchema>;
