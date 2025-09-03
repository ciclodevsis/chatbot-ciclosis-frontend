"use client"

import { useState, useTransition, useEffect, useCallback } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAvailableSlots, updateAppointment, deleteAppointment } from "@/lib/actions/appointment.actions";
import { getServices, getStaffMembers } from "@/lib/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { FormattedAppointment, Service, StaffMember } from "@/lib/types";
import type { FormState } from "@/lib/actions/types";

type EditAppointmentDialogProps = {
  appointment: FormattedAppointment;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAppointmentUpdate?: () => void;
};

export function EditAppointmentDialog({ appointment, open: controlledOpen, onOpenChange, onAppointmentUpdate }: EditAppointmentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  const initialState: FormState = null;
  const [state, formAction] = useFormState(updateAppointment, initialState);
  const [isSaving, startFormTransition] = useTransition();

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  
  const [newServiceId, setNewServiceId] = useState(appointment.serviceId);
  const [newStaffId, setNewStaffId] = useState(appointment.staffId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(appointment.startTime));
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isFetchingSlots, startFetchingSlots] = useTransition();

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const [servicesData, staffData] = await Promise.all([getServices(), getStaffMembers()]);
        setAllServices(servicesData);
        setAllStaff(staffData);
      };
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
      onAppointmentUpdate?.();
      setOpen(false);
    } else if (state?.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state, onAppointmentUpdate, setOpen]);

  const fetchAvailableSlots = useCallback(() => {
    if (!selectedDate || !newStaffId || !newServiceId) return;
    startFetchingSlots(async () => {
      try {
        const slots = await getAvailableSlots(newStaffId, newServiceId, selectedDate);
        setAvailableSlots(slots);
      } catch {
        toast.error("Erro ao buscar horários disponíveis.");
        setAvailableSlots([]);
      }
    });
  }, [selectedDate, newStaffId, newServiceId]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleDelete = async () => {
    toast.promise(deleteAppointment(appointment.id), {
        loading: 'Cancelando agendamento...',
        success: (result) => {
            // ✅ CORREÇÃO: Verifica se o resultado não é nulo e se teve sucesso
            if (result?.success) {
                onAppointmentUpdate?.();
                setOpen(false);
                return result.message || "Agendamento cancelado.";
            }
            // Se não teve sucesso, lança um erro para acionar o callback de 'error'
            throw new Error(result?.error || "Ocorreu uma falha.");
        },
        error: (err: Error) => err.message || "Ocorreu um erro."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            Altere o serviço, funcionário ou horário para o agendamento de {appointment.clientName}.
          </DialogDescription>
        </DialogHeader>
        
        <form action={(formData) => startFormTransition(() => formAction(formData))}>
          <input type="hidden" name="appointmentId" value={appointment.id} />
          <input type="hidden" name="newServiceId" value={newServiceId} />
          <input type="hidden" name="newStaffId" value={newStaffId} />
          {selectedDate && <input type="hidden" name="newDate" value={selectedDate.toISOString()} />}
          <input type="hidden" name="newSlot" value={selectedSlot || ''} />
          
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alterar Serviço</Label>
                <Select value={newServiceId} onValueChange={setNewServiceId}>
                  <SelectTrigger className="glass-input"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
                    {allServices.map(service => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Alterar Funcionário</Label>
                <Select value={newStaffId} onValueChange={setNewStaffId}>
                  <SelectTrigger className="glass-input"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
                    {allStaff.map(staff => <SelectItem key={staff.id} value={staff.id}>{staff.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start border-t border-card-border pt-6">
              <div className="w-full md:w-auto">
                <h3 className="text-sm font-medium mb-2 text-center">Reagendar Data</h3>
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} className="rounded-md border"/>
              </div>
              <div className="flex-1 w-full space-y-2">
                <h3 className="text-sm font-medium">Horários disponíveis</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-1 border rounded-md min-h-[280px]">
                  {isFetchingSlots ? (
                    <div className="col-span-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-text-secondary" /><span className="ml-2">Buscando...</span></div>
                  ) : availableSlots.length > 0 ? (
                    availableSlots.map(slot => <Button key={slot} type="button" variant={selectedSlot === slot ? "default" : "outline"} onClick={() => setSelectedSlot(slot)} className={selectedSlot === slot ? "bg-brand-accent hover:bg-brand-accent-hover" : ""}>{slot}</Button>)
                  ) : (
                    <p className="col-span-full text-sm text-center text-brand-text-secondary pt-8">Nenhum horário disponível.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center w-full pt-4 border-t border-card-border">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">Cancelar Agendamento</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription className="text-brand-text-secondary">Esta ação não pode ser desfeita. O agendamento será permanentemente cancelado.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Confirmar Cancelamento</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Fechar</Button>
                <Button type="submit" disabled={isSaving || !selectedSlot} className="bg-brand-accent hover:bg-brand-accent-hover text-white">
                  {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>) : "Salvar Alterações"}
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
