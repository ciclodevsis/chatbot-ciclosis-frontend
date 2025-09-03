// Caminho: lib/types.ts

// --- TIPOS DE ENTIDADES DO BANCO DE DADOS ---
export type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export type StaffMember = {
  id: string;
  full_name: string | null;
  role: string | null;
};

export type Client = {
  id: string;
  name: string;
  cpf: string;
  whatsapp_phone: string;
  email?: string | null;
};

export type WorkSchedule = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export type CompanySettings = {
  company_name: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip_code: string | null;
  whatsapp_phone_id: string | null
  welcome_message: string | null;
};

export type Goal = {
  goal_type: string;
  value: number;
};

// --- TIPOS PARA FORMATAÇÃO E LÓGICA DA UI ---

export type FormattedAppointment = {
  id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientCpf: string;
  clientPhone: string;
  serviceName: string;
  staffName: string;
  staffId: string;
  serviceId: string;
};

export type ServiceWithEnabledStatus = Service & { isEnabled: boolean };

// --- TIPOS PARA O DASHBOARD ---

export type DashboardStats = {
  weekly: { value: number; goal: number };
  monthly: { value: number; goal: number };
  yearly: { value: number; goal: number };
};

export type ChartDataPoint = {
  date: string;
  [key: string]: string | number;
};

export type PieDataPoint = {
  name: string;
  value: number;
};

export type ChartData = {
  volumeData: ChartDataPoint[];
  revenueData: { date: string; faturamento: number; }[];
  pieData: PieDataPoint[];
  staffMembers: StaffMember[];
};

// --- TIPOS INTERNOS PARA QUERIES ---

// Define um tipo para o retorno bruto do Supabase para melhorar a tipagem
export type RawAppointment = {
    id: string;
    start_time: string;
    end_time: string;
    service_id: string;
    staff_id: string;
    client: { name: string; cpf: string; whatsapp_phone: string; } | null;
    service: { name: string; } | null;
    staff: { full_name: string; } | null;
};

// Tipo para representar a estrutura exata do retorno da query do gráfico
export type ChartAppointment = {
  start_time: string | null;
  service: { price: number } | null;
  staff: { id: string; full_name: string | null } | null;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  extendedProps?: FormattedAppointment; // Para armazenar nossos dados internos
  backgroundColor?: string;
  borderColor?: string;
  editable?: boolean;
};

export type Subscription = {
  id: string;
  user_id: string;
  tenant_id: string;
  plan_id: string;
  status: 'trialing' | 'active' | 'canceled' | 'unpaid' | 'pending_payment';
  billing_cycle: 'monthly' | 'annual' | null;
  price: number | null;
  applied_coupon: string | null;
  current_period_start: string;
  current_period_end: string;
  trial_end: string | null;
  created_at: string;
  mercado_pago_customer_id: string | null;
  mercado_pago_subscription_id: string | null;
};