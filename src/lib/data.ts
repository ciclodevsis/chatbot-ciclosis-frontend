"use server";

import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "./session";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Importa todos os tipos necessários do arquivo centralizado
import type {
  FormattedAppointment,
  Service,
  ServiceWithEnabledStatus,
  WorkSchedule,
  StaffMember,
  CompanySettings,
  Subscription,
  DashboardStats,
  Goal,
  ChartData,
  RawAppointment,
  ChartAppointment
} from "./types";

// --- FUNÇÕES DE BUSCA DE DADOS ---

/**
 * Busca e formata os agendamentos para o tenant do usuário logado.
 * A segurança é garantida pela RLS.
 */
export async function getAppointments(): Promise<FormattedAppointment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id, start_time, end_time, service_id, staff_id,
      client:clients!inner ( name, cpf, whatsapp_phone ),
      service:services!inner ( name ),
      staff:profiles!inner ( full_name )
    `)
    .order('start_time', { ascending: false })
    .returns<RawAppointment[]>();

  if (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
  if (!data) return [];

  return data.map((app) => ({
    id: app.id,
    startTime: app.start_time,
    endTime: app.end_time,
    clientName: app.client?.name ?? 'N/A',
    clientCpf: app.client?.cpf ?? 'N/A',
    clientPhone: app.client?.whatsapp_phone ?? 'N/A',
    serviceName: app.service?.name ?? 'N/A',
    staffName: app.staff?.full_name ?? 'N/A',
    serviceId: app.service_id,
    staffId: app.staff_id,
  }));
}

/**
 * Busca todos os serviços pertencentes ao tenant do usuário logado.
 */
export async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, name, price, duration_minutes')
    .order('name', { ascending: true });

  if (error) {
    console.error("Erro ao buscar serviços:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Busca todos os serviços do tenant e marca quais estão habilitados para um funcionário específico.
 */
export async function getServicesForStaff(staffId: string): Promise<ServiceWithEnabledStatus[]> {
  const supabase = createClient();
  const allServices = await getServices(); 
  if (!allServices) return [];

  const { data: enabledServices, error: enabledError } = await supabase
    .from('staff_services')
    .select('service_id')
    .eq('staff_id', staffId);

  if (enabledError) {
    console.error("Erro ao buscar serviços do staff:", enabledError);
    return allServices.map((s: Service) => ({ ...s, isEnabled: false }));
  }

  const enabledServiceIds = new Set(enabledServices?.map(s => s.service_id) ?? []);
  return allServices.map(service => ({
    ...service,
    isEnabled: enabledServiceIds.has(service.id),
  }));
}

/**
 * Busca o horário de trabalho semanal de um funcionário específico.
 */
export async function getStaffWorkSchedule(staffId: string): Promise<WorkSchedule[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('work_schedules')
    .select('day_of_week, start_time, end_time, is_active')
    .eq('staff_id', staffId)
    .order('day_of_week', { ascending: true });

  if (error) {
    console.error("Erro ao buscar horário de trabalho:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Busca todos os membros da equipe (perfis com role 'admin' ou 'staff') do tenant do usuário logado.
 */
export async function getStaffMembers(): Promise<StaffMember[]> {
  const { details } = await getUserSession();
  if (!details?.profile?.tenant_id) return [];
  
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('tenant_id', details.profile.tenant_id)
    .in('role', ['admin', 'staff']);

  if (error) {
    console.error("Erro ao buscar funcionários:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Busca apenas os serviços que estão habilitados para um funcionário específico.
 */
export async function getEnabledServicesByStaff(staffId: string): Promise<Service[]> {
  const supabase = createClient();

  // ✅ CORREÇÃO: Define um tipo explícito para o retorno da query
  type StaffServiceWithService = {
    service: Service
  }

  const { data, error } = await supabase
    .from('staff_services')
    .select(`service:services!inner(id, name, price, duration_minutes)`)
    .eq('staff_id', staffId)
    .returns<StaffServiceWithService[]>(); // Usa .returns() para garantir a tipagem

  if (error) {
    console.error("Erro ao buscar serviços habilitados do staff:", error);
    return [];
  }

  // ✅ CORREÇÃO: O mapeamento agora é mais simples e seguro, sem a necessidade de 'as'
  return data?.map(item => item.service) ?? [];
}

/**
 * Busca as configurações da empresa para o tenant do usuário logado.
 */
export async function getCompanySettings(): Promise<CompanySettings | null> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão.
  const { details } = await getUserSession();
  if (!details?.profile?.tenant_id) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('tenants_settings')
    .select(`company_name, phone, address_street, address_city, address_state, address_zip_code, whatsapp_phone_id, welcome_message`)
    .eq('tenant_id', details.profile.tenant_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar configurações da empresa:", error);
  }
  return data;
}

/**
 * Busca as estatísticas principais do dashboard para o usuário logado.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { user, details } = await getUserSession();
  const emptyStats = { weekly: { value: 0, goal: 0 }, monthly: { value: 0, goal: 0 }, yearly: { value: 0, goal: 0 } };
  
  // A verificação principal continua aqui. Se não houver perfil, retornamos cedo.
  if (!user || !details?.profile) return emptyStats;

  // ✅ CORREÇÃO: Extraímos a 'role' aqui, onde o TypeScript sabe que 'details.profile' não é nulo.
  const userRole = details.profile.role;

  const supabase = createClient();
  const now = new Date();
  const periods = {
    weekly: { start: startOfWeek(now), end: endOfWeek(now) },
    monthly: { start: startOfMonth(now), end: endOfMonth(now) },
    yearly: { start: startOfYear(now), end: endOfYear(now) },
  };

  const countPromises = Object.values(periods).map(period => {
    let query = supabase.from('appointments').select('id', { count: 'exact', head: true })
      .gte('start_time', period.start.toISOString()).lte('start_time', period.end.toISOString());
    
    // ✅ CORREÇÃO: Usamos a variável 'userRole' dentro do callback.
    if (userRole === 'staff') {
      query = query.eq('staff_id', user.id);
    }
    return query;
  });

  const goalsPromise = supabase.from('dashboard_goals').select('goal_type, value').eq('user_id', user.id);
  const [ weeklyResult, monthlyResult, yearlyResult, goalsResult ] = await Promise.all([...countPromises, goalsPromise]);
  const goalsData = goalsResult.data as Goal[] | null;
  const goals = new Map(goalsData?.map(g => [g.goal_type, g.value]));
  
  return {
    weekly: { value: weeklyResult.count ?? 0, goal: goals.get('weekly_appointments') ?? 100 },
    monthly: { value: monthlyResult.count ?? 0, goal: goals.get('monthly_appointments') ?? 500 },
    yearly: { value: yearlyResult.count ?? 0, goal: goals.get('yearly_appointments') ?? 5000 },
  };
}

/**
 * Busca e agrega os dados para os gráficos do dashboard.
 */
export async function getDashboardChartData(period: 'week' | 'month' | 'year', staffId?: string | null): Promise<ChartData> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão.
  const { user, details } = await getUserSession();
  const emptyReturn = { volumeData: [], revenueData: [], pieData: [], staffMembers: [] };
  if (!user || !details?.profile) return emptyReturn;
  
  const supabase = createClient();
  const now = new Date();
  let startDate: Date, endDate: Date, dateFormat: string;

  if (period === 'week') { [startDate, endDate] = [startOfWeek(now), endOfWeek(now)]; dateFormat = "eee"; } 
  else if (period === 'month') { [startDate, endDate] = [startOfMonth(now), endOfMonth(now)]; dateFormat = "dd/MM"; } 
  else { [startDate, endDate] = [startOfYear(now), endOfYear(now)]; dateFormat = "MMM"; }

  let query = supabase.from('appointments').select('start_time, service:services(price), staff:profiles(id, full_name)')
    .gte('start_time', startDate.toISOString()).lte('start_time', endDate.toISOString());

  // ✅ CORREÇÃO: Usa 'details.profile.role' e 'details.profile.tenant_id'.
  if (details.profile.role === 'staff') {
    query = query.eq('staff_id', user.id);
  } else if (details.profile.role === 'admin') {
    // Admin vê dados do tenant... (RLS já garante isso, mas podemos ser explícitos)
    query = query.eq('tenant_id', details.profile.tenant_id);
    // ... e pode filtrar por um funcionário específico.
    if (staffId && staffId !== 'all') {
      query = query.eq('staff_id', staffId);
    }
  }

  const { data, error } = await query.returns<ChartAppointment[]>();
  if (error) { console.error("Erro ao buscar dados dos gráficos:", error); throw error; }
  if (!data) return emptyReturn;
  
  const volumeAggregation: { [key: string]: { [staffId: string]: number, total: number } } = {};
  const revenueAggregation: { [key: string]: number } = {};
  const pieAggregation: { [key: string]: { name: string, value: number } } = {};
  const staffMembersMap = new Map<string, StaffMember>();
  
  eachDayOfInterval({ start: startDate, end: endDate }).forEach(day => {
    const key = format(day, dateFormat, { locale: ptBR });
    volumeAggregation[key] = { total: 0 };
    revenueAggregation[key] = 0;
  });

  for (const app of data) {
    if (!app.start_time || !app.service || !app.staff) continue;
    const key = format(new Date(app.start_time), dateFormat, { locale: ptBR });
    const price = app.service.price ?? 0;
    const currentStaffId = app.staff.id;
    const staffName = app.staff.full_name ?? 'Desconhecido';

    if (volumeAggregation[key]) {
      volumeAggregation[key].total = (volumeAggregation[key].total || 0) + 1;
      volumeAggregation[key][currentStaffId] = (volumeAggregation[key][currentStaffId] || 0) + 1;
    }
    if (revenueAggregation[key] !== undefined) {
      revenueAggregation[key] += price;
    }
    if (!pieAggregation[currentStaffId]) {
      pieAggregation[currentStaffId] = { name: staffName, value: 0 };
    }
    pieAggregation[currentStaffId].value += price;
    
    if (!staffMembersMap.has(currentStaffId)) {
      staffMembersMap.set(currentStaffId, { id: currentStaffId, full_name: staffName, role: null });
    }
  }

  const volumeData = Object.keys(volumeAggregation).map(key => ({ date: key, ...volumeAggregation[key] }));
  const revenueData = Object.keys(revenueAggregation).map(key => ({ date: key, faturamento: revenueAggregation[key] }));
  const pieData = Object.values(pieAggregation);
  const staffMembers = Array.from(staffMembersMap.values());

  return { volumeData, revenueData, pieData, staffMembers };
}

/**
 * Busca os detalhes da assinatura para o tenant do usuário logado.
 */
export async function getSubscription(): Promise<Subscription | null> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão.
  const { details } = await getUserSession();
  if (!details?.profile?.tenant_id) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('tenant_id', details.profile.tenant_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar assinatura:", error);
    return null;
  }
  return data;
}