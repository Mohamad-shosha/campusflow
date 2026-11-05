import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(3, { message: 'الرقم الجامعي أو البريد يجب ألا يقل عن 3 أحرف' }),
  password: z.string().min(8, { message: 'كلمة المرور يجب ألا تقل عن 8 خانات' }),
  universityCode: z.string(),
});

export type LoginFormData = {
  identifier: string;
  password: string;
  universityCode: string;
};

export const registerSchema = z.object({
  universityNumber: z
    .string()
    .min(3, { message: 'الرقم الجامعي مطلوب (3 أحرف على الأقل)' })
    .max(50),
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z.string().min(8, { message: 'كلمة المرور يجب ألا تقل عن 8 خانات' }),
  fullNameAr: z.string().min(3, { message: 'الاسم بالعربية مطلوب' }),
  fullNameEn: z.string().min(3, { message: 'Full name in English is required' }),
  userType: z.enum(['STUDENT', 'FACULTY', 'STAFF']),
  phone: z.string().optional(),
  plateLettersAr: z.string().optional(),
  plateDigits: z.string().optional(),
  makeModel: z.string().optional(),
  color: z.string().optional(),
  universityCode: z.string(),
});

export type RegisterFormData = {
  universityNumber: string;
  email: string;
  password: string;
  fullNameAr: string;
  fullNameEn: string;
  userType: 'STUDENT' | 'FACULTY' | 'STAFF';
  phone?: string | undefined;
  plateLettersAr?: string | undefined;
  plateDigits?: string | undefined;
  makeModel?: string | undefined;
  color?: string | undefined;
  universityCode: string;
};
