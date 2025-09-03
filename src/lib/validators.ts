import { z } from "zod";

// ✅ NOVO: Schema de validação para o formulário de login.
export const AuthSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export const ServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  price: z.coerce.number().min(0, { message: "O preço deve ser um número positivo." }),
  duration_minutes: z.coerce.number().int().min(1, { message: "A duração deve ser de pelo menos 1 minuto." }),
});

export const CompanySettingsSchema = z.object({
  companyName: z.string().min(2, "O nome da empresa é obrigatório."),
  phone: z.string().optional(),
  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressZipCode: z.string().optional(),
  welcomeMessage: z.string().optional(),
});

export const InviteStaffSchema = z.object({
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    tenantId: z.string().uuid({ message: "ID do Tenant inválido." })
});

export const UpdateStaffRoleSchema = z.object({
  userId: z.string().uuid(),
  newRole: z.enum(['admin', 'staff'], { message: "Função inválida." }),
});

export const ChangePasswordSchema = z.object({
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"]
});

export const GoalSchema = z.object({
  goalType: z.string().min(1),
  goalValue: z.coerce.number().min(0, "A meta deve ser um número positivo."),
});

export const AppointmentSchema = z.object({
  serviceId: z.string().uuid({ message: "ID do serviço inválido." }),
  staffId: z.string().uuid({ message: "ID do funcionário inválido." }),
  selectedDate: z.string().min(1, { message: "A data é obrigatória." }),
  selectedSlot: z.string().regex(/^\d{2}:\d{2}$/, { message: "O horário selecionado é inválido." }),
  
  clientId: z.string().uuid().optional().nullable(),

  clientName: z.string().optional(),
  whatsapp_phone: z.string().optional(),
  clientCpf: z.string().optional(),
  email: z.string().email({ message: "O e-mail do novo cliente é inválido." }).optional().nullable(),
});

export const CreateAccountSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  confirmEmail: z.string().email(),
  phone: z.string().min(10, { message: "O número de celular é inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  
  agreed: z.literal(true, {
    message: "Você deve concordar com os termos para continuar.",
  }),

}).refine(data => data.email === data.confirmEmail, {
  message: "Os e-mails não coincidem.",
  path: ["confirmEmail"],
});

export const UserProfileSchema = z.object({
  fullName: z.string().min(2, "O nome completo é obrigatório e deve ter pelo menos 2 caracteres."),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, forneça um e-mail válido." }),
});