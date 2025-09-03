// CAMINHO: lib/actions/agenda.actions.ts
"use server"

import { getAppointments } from "@/lib/data"
import { getGoogleCalendarEvents } from "./google.actions"
import type { CalendarEvent } from "@/lib/types"

export async function getCalendarEventsAction() {
  try {
    const [internalAppointments, googleCalendarResult] = await Promise.all([
      getAppointments(),
      getGoogleCalendarEvents()
    ]);

    const formattedInternal: CalendarEvent[] = internalAppointments.map(app => ({
      title: `${app.serviceName} - ${app.clientName}`,
      start: app.startTime,
      end: app.endTime,
      id: app.id || '',
      extendedProps: app,
      backgroundColor: '#3788d8', // Cor para eventos internos
      borderColor: '#3788d8',
    }));

    let googleEvents: CalendarEvent[] = [];
    if (googleCalendarResult.events) {
      googleEvents = googleCalendarResult.events
        .filter(e => e.id && e.title && e.start)
        .map(e => ({
          id: e.id!,
          title: e.title!,
          start: e.start!,
          end: e.end ?? undefined,
          backgroundColor: '#34a853', // Cor para eventos do Google
          borderColor: '#34a853',
          editable: false, // Eventos do Google não são editáveis por arrastar
        }));
    }
    
    return { events: [...formattedInternal, ...googleEvents] };
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return { error: "Não foi possível carregar os eventos da agenda." };
  }
}