"use server";

import { revalidatePath } from "next/cache";
import { google, calendar_v3 } from "googleapis";
import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "../session";
import type { FormState } from "./types";

// Centraliza a configuração do cliente OAuth2
const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/google/callback`,
});

export async function getGoogleAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
  return { url };
}

export async function saveGoogleRefreshToken(code: string) {
  const { user } = await getUserSession();
  // ✅ CORREÇÃO: Adicionada verificação para garantir que o usuário existe.
  if (!user) {
    return { error: "Usuário não autenticado." };
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token) {
      return { success: true, message: "Conta já conectada, nenhuma ação necessária." };
    }
    const supabase = createClient();
    const { error } = await supabase.from('staff').update({ google_refresh_token: tokens.refresh_token }).eq('id', user.id);
    if (error) throw error;
    
    revalidatePath('/agenda');
    return { success: true, message: "Agenda do Google conectada com sucesso!" };
  } catch (error) {
    console.error("Erro ao obter token do Google:", error);
    return { error: "Não foi possível conectar a agenda do Google." };
  }
}

export async function disconnectGoogleCalendar(): Promise<FormState> {
  const { user } = await getUserSession();
  // ✅ CORREÇÃO: Adicionada verificação para garantir que o usuário existe.
  if (!user) {
    return { error: "Usuário não autenticado." };
  }
  
  const supabase = createClient();
  const { error } = await supabase
    .from('staff')
    .update({ google_refresh_token: null })
    .eq('id', user.id);

  if (error) {
    console.error("Erro ao desconectar a agenda do Google:", error);
    return { error: "Não foi possível desconectar a agenda." };
  }

  revalidatePath('/agenda');
  return { success: true, message: "Agenda do Google desconectada com sucesso." };
}

// Funções de HELPER para serem chamadas por outras actions
interface CalendarEventDetails {
    appointmentId: string;
    staffId: string;
    startTime: Date;
    endTime: Date;
    serviceName: string;
    clientName: string;
    clientPhone?: string | null;
}

export async function createGoogleCalendarEvent(details: CalendarEventDetails) {
    const supabase = createClient();
    const { data: staffProfile } = await supabase.from('staff').select('google_refresh_token').eq('id', details.staffId).single();
    if (!staffProfile?.google_refresh_token) return;

    oauth2Client.setCredentials({ refresh_token: staffProfile.google_refresh_token });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: `${details.serviceName} - ${details.clientName}`,
        description: `Agendamento com ${details.clientName} (Telefone: ${details.clientPhone || 'Não informado'}).`,
        start: { dateTime: details.startTime.toISOString(), timeZone: 'America/Sao_Paulo' },
        end: { dateTime: details.endTime.toISOString(), timeZone: 'America/Sao_Paulo' },
    };

    const createdEvent = await calendar.events.insert({ calendarId: 'primary', requestBody: event });
    if (createdEvent.data.id) {
        await supabase.from('appointments').update({ google_calendar_event_id: createdEvent.data.id }).eq('id', details.appointmentId);
    }
}

export async function deleteGoogleCalendarEvent(staffId: string, eventId: string) {
    const supabase = createClient();
    const { data: staffProfile } = await supabase.from('staff').select('google_refresh_token').eq('id', staffId).single();
    if (!staffProfile?.google_refresh_token) return;

    oauth2Client.setCredentials({ refresh_token: staffProfile.google_refresh_token });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    try {
        await calendar.events.delete({ calendarId: 'primary', eventId: eventId });
    } catch (error) {
        console.error(`Falha ao deletar evento ${eventId} do Google Calendar (pode já ter sido removido):`, error);
    }
}

// ✅ NOVO: Define um tipo para o patch do evento, usando o tipo da própria biblioteca do Google
type GoogleCalendarEventPatch = calendar_v3.Schema$Event;


export async function updateGoogleCalendarEvent(
  staffId: string,
  eventId: string,
  newStartTime: Date,
  newEndTime: Date,
  newSummary?: string,
  newDescription?: string
) {
  const supabase = createClient();
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('google_refresh_token')
    .eq('id', staffId)
    .single();

  if (!staffProfile?.google_refresh_token) {
    console.warn(`Nenhum refresh_token do Google encontrado para o staff ${staffId}. Ignorando atualização.`);
    return;
  }

  try {
    oauth2Client.setCredentials({ refresh_token: staffProfile.google_refresh_token });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // ✅ CORREÇÃO: Usa o tipo definido e constrói o objeto de forma segura
    const eventPatch: GoogleCalendarEventPatch = {
      start: { dateTime: newStartTime.toISOString(), timeZone: 'America/Sao_Paulo' },
      end: { dateTime: newEndTime.toISOString(), timeZone: 'America/Sao_Paulo' },
    };

    if (newSummary) {
      eventPatch.summary = newSummary;
    }
    if (newDescription) {
      eventPatch.description = newDescription;
    }

    await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: eventPatch,
    });

    console.log(`Evento ${eventId} do Google Calendar atualizado com sucesso.`);
  } catch (error) {
    console.error(`Falha ao atualizar o evento ${eventId} no Google Calendar:`, error);
  }
}

export async function getGoogleCalendarEvents() {
  try {
    const { user } = await getUserSession();
    // ✅ CORREÇÃO: Adicionada verificação para garantir que o usuário existe.
    if (!user) {
      return { error: "Usuário não autenticado." };
    }
    
    const supabase = createClient();
    const { data: staffProfile } = await supabase
      .from('staff')
      .select('google_refresh_token')
      .eq('id', user.id)
      .single();

    if (!staffProfile?.google_refresh_token) {
      return { events: [] };
    }
  
    oauth2Client.setCredentials({
      refresh_token: staffProfile.google_refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date(new Date().setDate(new Date().getDate() - 30))).toISOString(),
      timeMax: (new Date(new Date().setDate(new Date().getDate() + 90))).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      return { events: [] };
    }

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    }));

    return { events: formattedEvents };
  } catch (error) {
    console.error('Erro ao buscar eventos do Google Calendar:', error);
    return { error: 'Não foi possível buscar os eventos da sua agenda do Google.' };
  }
}