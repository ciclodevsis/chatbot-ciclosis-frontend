"use client"

import { useState, useEffect, useTransition, useCallback, Dispatch, SetStateAction } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createAppointment, getAvailableSlots, searchClients } from "@/lib/actions/appointment.actions";
import { getEnabledServicesByStaff } from "@/lib/data";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import type { Service, StaffMember, Client } from "@/lib/types";
import type { FormState } from "@/lib/actions/types";

// --- Tipos e Props ---
type UserRole = 'admin' | 'staff';
type NewAppointmentDialogProps = {
  staffList: StaffMember[];
  userRole: UserRole;
  currentUserId?: string;
  tenantId: string
  onAppointmentCreated?: () => void;
  // Props para o modo "controlado" (usado na Agenda)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialDate?: Date;
};
interface Step1Props { staffList: StaffMember[]; availableServices: Service[]; selectedStaff: string | null; setSelectedStaff: Dispatch<SetStateAction<string | null>>; selectedService: string | null; setSelectedService: Dispatch<SetStateAction<string | null>>; isFetchingServices: boolean; userRole: UserRole; }
interface Step2Props { selectedDate: Date | undefined; setSelectedDate: Dispatch<SetStateAction<Date | undefined>>; availableSlots: string[]; setAvailableSlots: Dispatch<SetStateAction<string[]>>; selectedSlot: string | null; setSelectedSlot: Dispatch<SetStateAction<string | null>>; selectedStaff: string | null; selectedService: string | null; }
interface Step3Props { serviceId: string; staffId: string; selectedDate: Date; selectedSlot: string; onSuccess: () => void; goToPrevStep: () => void; }

export function NewAppointmentDialog({ staffList, userRole, currentUserId, open: controlledOpen, onOpenChange, initialDate, onAppointmentCreated }: NewAppointmentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const [step, setStep] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(userRole === 'staff' ? currentUserId || null : null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate || new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isFetchingServices, startFetchingServices] = useTransition();

  const resetState = useCallback(() => {
    setStep(1);
    if (userRole === 'admin') { setSelectedStaff(null); }
    setSelectedService(null);
    setSelectedDate(initialDate || new Date());
    setSelectedSlot(null);
    setAvailableServices([]);
    setAvailableSlots([]);
  }, [userRole, initialDate]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
      onAppointmentCreated?.();
    }
  };

  useEffect(() => {
    if (selectedStaff) {
      startFetchingServices(async () => {
        const servicesData = await getEnabledServicesByStaff(selectedStaff);
        setAvailableServices(servicesData);
      });
    } else { setAvailableServices([]); }
    setSelectedService(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
  }, [selectedStaff]);
  
  useEffect(() => {
    if (availableServices.length === 1) { setSelectedService(availableServices[0].id); }
  }, [availableServices]);

  useEffect(() => {
    setSelectedSlot(null);
    setAvailableSlots([]);
  }, [selectedService, selectedDate]);

  const totalSteps = 3;
  const goToNextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const goToPrevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1: return <Step1 {...{ staffList, availableServices, selectedStaff, setSelectedStaff, selectedService, setSelectedService, isFetchingServices, userRole }} />;
      // ✅ CORREÇÃO: Passando 'availableSlots' e 'setAvailableSlots' para o Step2
      case 2: return <Step2 {...{ selectedDate, setSelectedDate, availableSlots, setAvailableSlots, selectedSlot, setSelectedSlot, selectedStaff, selectedService }} />;
      case 3: return <Step3 serviceId={selectedService!} staffId={selectedStaff!} selectedDate={selectedDate!} selectedSlot={selectedSlot!} onSuccess={() => handleOpenChange(false)} goToPrevStep={goToPrevStep} />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
            <Button className="bg-brand-accent hover:bg-brand-accent-hover text-white">+ Novo Agendamento</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-3xl bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription className="text-brand-text-secondary">Passo {step} de {totalSteps}</DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[400px]">{renderStepContent()}</div>
        {step < 3 && (
          <DialogFooter className="flex justify-between w-full">
            {step > 1 ? ( <Button type="button" variant="outline" onClick={goToPrevStep}>Voltar</Button> ) : ( <div/> )}
            <Button 
              type="button" onClick={goToNextStep} 
              disabled={ isFetchingServices || (step === 1 && (!selectedStaff || !selectedService)) || (step === 2 && !selectedSlot) }
              className="bg-brand-accent hover:bg-brand-accent-hover text-white"
            >
              {isFetchingServices && step === 1 ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : "Próximo"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Sub-componente Passo 1: Serviço e Staff ---
function Step1({ staffList, availableServices, selectedStaff, setSelectedStaff, selectedService, setSelectedService, isFetchingServices, userRole }: Step1Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="staff">Funcionário</Label>
        <Select onValueChange={setSelectedStaff} value={selectedStaff || ''} disabled={userRole === 'staff'}>
          <SelectTrigger id="staff" className="glass-input"><SelectValue placeholder="Selecione um funcionário" /></SelectTrigger>
          <SelectContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
            {staffList.map((member) => (<SelectItem key={member.id} value={member.id}>{member.full_name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="service">Serviço</Label>
        <Select onValueChange={setSelectedService} value={selectedService || ''} disabled={!selectedStaff || isFetchingServices}>
          <SelectTrigger id="service" className="glass-input"><SelectValue placeholder={isFetchingServices ? "Buscando serviços..." : "Selecione um serviço"} /></SelectTrigger>
          <SelectContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
            {availableServices.map((service) => (<SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// --- Sub-componente Passo 2: Data e Hora ---
function Step2({ selectedDate, setSelectedDate, availableSlots, setAvailableSlots, selectedSlot, setSelectedSlot, selectedStaff, selectedService }: Step2Props) {
  const [isFetchingSlots, startFetchingSlots] = useTransition();
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date || !selectedStaff || !selectedService) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    startFetchingSlots(async () => {
      try {
        const slots = await getAvailableSlots(selectedStaff, selectedService, date);
        setAvailableSlots(slots);
      } catch { toast.error("Erro ao buscar horários."); setAvailableSlots([]); }
    });
  }, [selectedStaff, selectedService, setSelectedDate, setSelectedSlot, setAvailableSlots]);
  
  useEffect(() => { if (selectedDate) { handleDateSelect(selectedDate); } }, [selectedDate, handleDateSelect]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
      <div>
        <h3 className="text-sm font-medium mb-2 text-center">Selecione uma data</h3>
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} className="rounded-md border"/>
      </div>
      <div className="flex flex-col h-full w-full">
        <h3 className="text-sm font-medium">Selecione um horário</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-1 border rounded-md min-h-[280px]">
          {isFetchingSlots && <div className="col-span-full flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /><span className="ml-2">Buscando...</span></div>}
          {!isFetchingSlots && availableSlots.length === 0 && <p className="col-span-full text-sm text-muted-foreground pt-4 text-center">Nenhum horário disponível.</p>}
          {availableSlots.map((slot) => <Button key={slot} type="button" variant={selectedSlot === slot ? "default" : "outline"} onClick={() => setSelectedSlot(slot)} className={selectedSlot === slot ? "bg-brand-accent hover:bg-brand-accent-hover" : ""}>{slot}</Button>)}
        </div>
      </div>
    </div>
  );
}

// --- Sub-componente Passo 3: Cliente ---
function Step3({ serviceId, staffId, selectedDate, selectedSlot, onSuccess, goToPrevStep }: Step3Props) {
  const [isNewClient, setIsNewClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSearching, startSearching] = useTransition();
  const initialState: FormState = null;
  const [state, formAction] = useFormState(createAppointment, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
      onSuccess();
    } else if (state?.error) {
      toast.error("Erro", { description: state.error });
    }
  }, [state, onSuccess]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      startSearching(async () => {
        const results = await searchClients(searchTerm);
        setSearchResults(results);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="staffId" value={staffId} />
      <input type="hidden" name="selectedDate" value={selectedDate.toISOString()} />
      <input type="hidden" name="selectedSlot" value={selectedSlot} />
      {selectedClient && <input type="hidden" name="clientId" value={selectedClient.id} />}
      {selectedClient && <input type="hidden" name="clientName" value={selectedClient.name} />}
      {selectedClient && <input type="hidden" name="clientPhone" value={selectedClient.whatsapp_phone} />}

      <div className="flex items-center space-x-2">
        <Label htmlFor="client-mode">Selecionar Cliente</Label>
        <Switch id="client-mode" checked={isNewClient} onCheckedChange={setIsNewClient} />
        <Label htmlFor="client-mode">Cadastrar Novo Cliente</Label>
      </div>

      {isNewClient ? (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Dados do Novo Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="clientName">Nome Completo*</Label><Input id="clientName" name="clientName" required className="glass-input" /></div>
            <div className="space-y-2"><Label htmlFor="clientPhone">Telefone (WhatsApp)*</Label><Input id="clientPhone" name="clientPhone" required className="glass-input" /></div>
            <div className="space-y-2"><Label htmlFor="clientCpf">CPF*</Label><Input id="clientCpf" name="clientCpf" required className="glass-input" /></div>
            <div className="space-y-2"><Label htmlFor="clientEmail">E-mail</Label><Input id="clientEmail" name="clientEmail" type="email" className="glass-input" /></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Buscar Cliente Existente</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-secondary" />
            <Input placeholder="Buscar por nome, CPF ou telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="glass-input pl-10" />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {isSearching && <p className="text-sm text-center text-brand-text-secondary">Buscando...</p>}
            {searchResults.map(client => (
              <div key={client.id} onClick={() => { setSelectedClient(client); setSearchTerm(client.name); setSearchResults([]); }}
                   className="p-3 border rounded-md cursor-pointer hover:bg-black/5">
                <p className="font-semibold">{client.name}</p>
                <p className="text-sm text-brand-text-secondary">{client.whatsapp_phone} - CPF: {client.cpf}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={goToPrevStep}>Voltar</Button>
        <Button type="submit" disabled={!isNewClient && !selectedClient} className="bg-brand-accent hover:bg-brand-accent-hover text-white">
          Confirmar Agendamento
        </Button>
      </DialogFooter>
    </form>
  );
}