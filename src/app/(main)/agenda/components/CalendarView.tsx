"use client"

import { useState, useEffect, useCallback, useTransition } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import { type EventClickArg, type EventDropArg } from '@fullcalendar/core/index.js';
import { type DateClickArg } from '@fullcalendar/interaction/index.js';
import ptBrLocale from '@fullcalendar/core/locales/pt-br.js';
import { toast } from 'sonner';

import { getCalendarEventsAction } from '@/lib/actions/agenda.actions';
import { updateAppointmentDateTime } from '@/lib/actions/appointment.actions';

import { EditAppointmentDialog } from '../../schedules/components/EditAppointmentDialog';
import { NewAppointmentDialog } from '../../schedules/components/NewAppointmentDialog';
import { ConnectGoogleButton } from "./ConnectGoogleButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import type { FormattedAppointment, StaffMember, CalendarEvent } from "@/lib/types";

type CalendarViewProps = {
  isConnected: boolean;
  staffList: StaffMember[];
  userRole: 'admin' | 'staff';
  currentUserId: string;
  tenantId: string;
};

export function CalendarView({ isConnected, staffList, userRole, currentUserId, tenantId }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, startLoadingTransition] = useTransition();
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<FormattedAppointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newAppointmentDialogOpen, setNewAppointmentDialogOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | null>(null);
  const [isDropConfirmOpen, setIsDropConfirmOpen] = useState(false);
  const [droppedEvent, setDroppedEvent] = useState<EventDropArg | null>(null);

  const fetchEvents = useCallback(() => {
    startLoadingTransition(async () => {
      const result = await getCalendarEventsAction();
      if (result.error) {
        toast.error("Erro ao carregar a agenda", { description: result.error });
      } else {
        setEvents(result.events || []);
      }
    });
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [isConnected, fetchEvents]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps?.clientName) {
      setSelectedEventForEdit(clickInfo.event.extendedProps as FormattedAppointment);
      setIsEditDialogOpen(true);
    } else {
      toast.info("Evento do Google Calendar", { description: `Você tem um compromisso: "${clickInfo.event.title}"` });
    }
  };

  const handleDateClick = (arg: DateClickArg) => {
    setNewAppointmentDate(arg.date);
    setNewAppointmentDialogOpen(true);
  };

  const handleEventDrop = (arg: EventDropArg) => {
    setDroppedEvent(arg);
    setIsDropConfirmOpen(true);
  };

  const confirmEventDrop = () => {
    if (!droppedEvent) return;
    const { event, revert } = droppedEvent;
    
    if (!event.start) {
      toast.error("Erro", { description: "Data de início inválida." });
      return revert();
    }

    toast.promise(updateAppointmentDateTime(event.id, event.start), {
      loading: 'Reagendando...',
      success: (result) => {
        if (!result) {
          revert();
          throw new Error("Falha ao reagendar. Resposta inválida do servidor.");
        }
                // A partir daqui, o TypeScript sabe que 'result' não é nulo
        if (result.success) {
          fetchEvents();
          return result.message || "Agendamento reagendado.";
        } else {
          revert();
          throw new Error(result.error || "Ocorreu uma falha.");
        }
      },
      error: (err: Error) => {
        revert();
        return err.message || "Ocorreu um erro.";
      },
    });
    
    setIsDropConfirmOpen(false);
    setDroppedEvent(null);
  };

  return (
    // ✅ CORREÇÃO: O contêiner principal agora envolve tudo
    <div className="space-y-8">
      {/* O cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-text">Agenda</h1>
          <p className="text-brand-text-secondary">Visualize e gerencie seus agendamentos.</p>
        </div>
        <div>
          <ConnectGoogleButton isConnected={isConnected} />
        </div>
      </div>
      
      {/* O card do calendário */}
      <Card className="rounded-xl shadow-subtle">
        <CardContent className="p-4">
            {loading && <p className="text-center text-sm text-brand-text-secondary p-4">Atualizando agenda...</p>}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
              events={events}
              locale={ptBrLocale}
              editable={true}
              droppable={true}
              selectable={true}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventDrop={handleEventDrop}
              height="auto"
              allDaySlot={false}
            />
        </CardContent>
      </Card>

      {/* Os diálogos (modais) ficam fora do fluxo principal do layout */}
      {selectedEventForEdit && (
        <EditAppointmentDialog
          appointment={selectedEventForEdit}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onAppointmentUpdate={fetchEvents}
        />
      )}
      
      <NewAppointmentDialog
        staffList={staffList}
        userRole={userRole}
        currentUserId={currentUserId}
        tenantId={tenantId}
        open={newAppointmentDialogOpen}
        onOpenChange={setNewAppointmentDialogOpen}
        initialDate={newAppointmentDate || new Date()}
        onAppointmentCreated={fetchEvents}
      />

      <AlertDialog open={isDropConfirmOpen} onOpenChange={setIsDropConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reagendamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja mover este agendamento para a nova data e hora?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => droppedEvent?.revert()}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEventDrop} className="bg-brand-accent hover:bg-brand-accent-hover text-white">Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}