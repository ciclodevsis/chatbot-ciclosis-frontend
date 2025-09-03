// Caminho: lib/actions/appointment.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "../session";
import { AppointmentSchema } from "../validators"; // Validador Zod para agendamentos
import type { FormState } from "./types";
import { Client } from "../types";

// A lógica de integração com Google Calendar será movida para google.actions.ts
// e chamada a partir daqui para manter a separação de responsabilidades.
import { updateGoogleCalendarEvent, deleteGoogleCalendarEvent, createGoogleCalendarEvent } from "./google.actions";


// ✅ ATUALIZADO: Ação createAppointment agora lida com cliente novo ou existente.
export async function createAppointment(prevState: FormState, formData: FormData): Promise<FormState> {
  const { details } = await getUserSession();
  if (!details?.profile?.tenant_id) {
    return { error: "Perfil do usuário ou tenant não encontrado." };
  }
  const { tenant_id: tenantId } = details.profile;

  const validatedFields = AppointmentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: "Dados do formulário inválidos." };
  }

  const {
    serviceId, staffId, selectedDate, selectedSlot,
    clientId, clientName, whatsapp_phone, clientCpf, email
  } = validatedFields.data;
  
  let finalClientId = clientId;
  let finalClientName = clientName;
  let finalClientPhone = whatsapp_phone;
  let finalClientEmail = email;

  const supabase = await createClient();

  try {
    // Se não recebemos um clientId, significa que é um novo cliente.
    if (!finalClientId) {
      if (!clientName || !clientCpf || !whatsapp_phone) {
        return { error: "Nome, CPF e Telefone são obrigatórios para novos clientes." };
      }
      
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .upsert({
          tenant_id: tenantId,
          name: clientName,
          cpf: clientCpf,
          whatsapp_phone: whatsapp_phone,
          email: email,
        }, { onConflict: 'tenant_id, cpf' })
        .select('id, name, whatsapp_phone, email')
        .single();

      if (clientError || !newClient) {
        throw clientError || new Error("Não foi possível criar o cliente.");
      }
      finalClientId = newClient.id;
      finalClientName = newClient.name;
      finalClientPhone = newClient.whatsapp_phone;
      finalClientEmail = newClient.email;
    }

    const { data: serviceData } = await supabase.from('services').select('name, duration_minutes').eq('id', serviceId).single();
    if (!serviceData) throw new Error("Serviço não encontrado.");

    const startTime = new Date(`${selectedDate.substring(0, 10)}T${selectedSlot}:00`);
    const endTime = new Date(startTime.getTime() + serviceData.duration_minutes * 60000);

    const { data: newAppointment, error: appointmentError } = await supabase.from('appointments').insert({
      tenant_id: tenantId,
      client_id: finalClientId,
      staff_id: staffId,
      service_id: serviceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      client_name: finalClientName!,
      client_phone: finalClientPhone,
      client_email: finalClientEmail,
    }).select('id').single();

    if (appointmentError) throw appointmentError;

    await createGoogleCalendarEvent({
      appointmentId: newAppointment.id, staffId, startTime, endTime,
      serviceName: serviceData.name, clientName: finalClientName!, clientPhone: finalClientPhone,
    });

    revalidatePath('/schedules');
    revalidatePath('/agenda');
    return { success: true, message: "Agendamento criado com sucesso!" };

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { error: error instanceof Error ? error.message : "Não foi possível criar o agendamento." };
  }
}

export async function deleteAppointment(appointmentId: string): Promise<FormState> {
    const supabase = createClient();
    const { details } = await getUserSession();
    if (!details?.profile) {
      return { error: "Perfil não encontrado." };
    }

    try {
        const { data: appointment, error: fetchError } = await supabase
            .from('appointments')
            .select('staff_id, google_calendar_event_id')
            .eq('id', appointmentId)
            .eq('tenant_id', details.profile.tenant_id) // Segurança
            .single();
            
        if (fetchError) throw new Error("Agendamento não encontrado ou acesso negado.");
        
        if (appointment.google_calendar_event_id && appointment.staff_id) {
            await deleteGoogleCalendarEvent(appointment.staff_id, appointment.google_calendar_event_id);
        }

        const { error: deleteError } = await supabase.from('appointments').delete().eq('id', appointmentId);
        if (deleteError) throw deleteError;

        revalidatePath('/schedules');
        revalidatePath('/agenda');
        return { success: true, message: "Agendamento cancelado com sucesso." };
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        return { error: error instanceof Error ? error.message : "Não foi possível cancelar o agendamento." };
    }
}

export async function updateAppointment(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  await getUserSession();

  // Extrai todos os dados do formulário
  const appointmentId = formData.get('appointmentId') as string;
  const newServiceId = formData.get('newServiceId') as string;
  const newStaffId = formData.get('newStaffId') as string;
  const newDate = formData.get('newDate') as string;
  const newSlot = formData.get('newSlot') as string;

  if (!appointmentId || !newServiceId || !newStaffId || !newDate || !newSlot) {
    return { error: "Faltam informações para reagendar." };
  }
  
  try {
    // 1. Busca os dados do serviço para obter a duração
    const { data: serviceData } = await supabase
      .from('services')
      .select('name, duration_minutes')
      .eq('id', newServiceId)
      .single();

    if (!serviceData) throw new Error("Serviço selecionado não encontrado.");

    // 2. Calcula os novos horários de início e fim
    const [hour, minute] = newSlot.split(':');
    const newStartTime = new Date(newDate);
    newStartTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
    const newEndTime = new Date(newStartTime.getTime() + serviceData.duration_minutes * 60000);

    // 3. Monta o objeto de atualização
    const updatePayload = {
      service_id: newServiceId,
      staff_id: newStaffId,
      start_time: newStartTime.toISOString(),
      end_time: newEndTime.toISOString(),
    };

    // 4. Atualiza o agendamento no banco de dados
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', appointmentId)
      .select('google_calendar_event_id, client_name') // Pega dados para o Google Calendar
      .single();

    if (updateError) throw updateError;
    if (!updatedAppointment) throw new Error("Falha ao obter dados do agendamento atualizado.");

    // 5. Tenta atualizar o evento no Google Calendar, se existir
    if (updatedAppointment.google_calendar_event_id) {
        await updateGoogleCalendarEvent(
            newStaffId,
            updatedAppointment.google_calendar_event_id,
            newStartTime,
            newEndTime,
            `${serviceData.name} - ${updatedAppointment.client_name}`
        );
    }

    revalidatePath('/schedules');
    revalidatePath('/agenda');
    return { success: true, message: "Agendamento atualizado com sucesso!" };

  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return { error: error instanceof Error ? error.message : "Não foi possível reagendar." };
  }
}

export async function getAvailableSlots(staffId: string, serviceId: string, selectedDate: Date) {
    // Esta é uma operação de leitura, RLS já garante o escopo do tenant.
    const supabase = createClient();
    try {
      // A lógica original está correta e pode ser mantida.
      // Apenas garantindo que a implementação está aqui.
      const { data: service } = await supabase.from('services').select('duration_minutes').eq('id', serviceId).single();
      if (!service) throw new Error("Serviço não encontrado.");
  
      const dayOfWeek = selectedDate.getDay();
      const { data: workSchedule } = await supabase.from('work_schedules').select('start_time, end_time, is_active').eq('staff_id', staffId).eq('day_of_week', dayOfWeek).single();
      if (!workSchedule || !workSchedule.is_active) return [];
  
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
  
      const { data: existingAppointments } = await supabase.from('appointments').select('start_time, end_time').eq('staff_id', staffId).gte('start_time', startDate.toISOString()).lte('start_time', endDate.toISOString());
  
      const availableSlots = [];
      const [startHour, startMinute] = workSchedule.start_time.split(':').map(Number);
      const [endHour, endMinute] = workSchedule.end_time.split(':').map(Number);
      
      const slot = new Date(selectedDate);
      slot.setHours(startHour, startMinute, 0, 0);
      const endTime = new Date(selectedDate);
      endTime.setHours(endHour, endMinute, 0, 0);
  
      while (slot < endTime) {
        const slotEndTime = new Date(slot.getTime() + service.duration_minutes * 60000);
        if (slotEndTime > endTime) break;
  
        const isBooked = existingAppointments?.some(booking => {
          const bookingStartTime = new Date(booking.start_time);
          const bookingEndTime = new Date(booking.end_time);
          return slot < bookingEndTime && slotEndTime > bookingStartTime;
        });
  
        if (!isBooked) {
          availableSlots.push(slot.toTimeString().substring(0, 5));
        }
        
        slot.setMinutes(slot.getMinutes() + 15); // Intervalo de verificação de 15 min
      }
      return availableSlots;
    } catch (error) {
      console.error("Erro em getAvailableSlots:", error);
      return [];
    }
}

export async function searchClients(searchTerm: string): Promise<Client[]> {
  const { details } = await getUserSession();
  if (!details?.profile?.tenant_id) return [];

  const supabase = createClient();
  const { data, error } = await supabase.rpc('search_clients', {
    p_tenant_id: details.profile.tenant_id,
    p_search_term: searchTerm
  });
  if (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
  return data || [];
}

export async function updateAppointmentDateTime(appointmentId: string, newStartTime: Date): Promise<FormState> {
  const supabase = createClient();
  
  try {
    // PASSO 1: Busca o agendamento primeiro
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('service_id, staff_id, client_name, google_calendar_event_id')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      throw new Error("Agendamento não encontrado.");
    }

    // PASSO 2: Com o service_id, busca os detalhes do serviço
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('name, duration_minutes')
        .eq('id', appointment.service_id)
        .single();
    
    if (serviceError || !service) {
        throw new Error("Detalhes do serviço associado não foram encontrados.");
    }
    
    // PASSO 3: Calcula o novo horário de fim
    const newEndTime = new Date(newStartTime.getTime() + service.duration_minutes * 60000);

    // PASSO 4: Atualiza o banco de dados
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        start_time: newStartTime.toISOString(),
        end_time: newEndTime.toISOString(),
      })
      .eq('id', appointmentId);

    if (updateError) throw updateError;

    // PASSO 5: Tenta atualizar o Google Calendar
    if (appointment.google_calendar_event_id && appointment.staff_id) {
      await updateGoogleCalendarEvent(
        appointment.staff_id,
        appointment.google_calendar_event_id,
        newStartTime,
        newEndTime,
        `${service.name} - ${appointment.client_name}`
      );
    }
    
    revalidatePath('/agenda');
    return { success: true, message: "Agendamento reagendado com sucesso." };
  } catch (error) {
    console.error("Erro ao reagendar (arrastar e soltar):", error);
    return { error: error instanceof Error ? error.message : "Ocorreu uma falha." };
  }
}