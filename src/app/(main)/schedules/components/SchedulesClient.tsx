// CAMINHO: app/(main)/schedules/components/SchedulesClient.tsx

"use client"

import { AppointmentsTable } from "./AppointmentsTable";
import { NewAppointmentDialog } from "./NewAppointmentDialog";
// ✅ CORREÇÃO: Tipos importados do local centralizado
import type { FormattedAppointment, Service, StaffMember } from "@/lib/types";

type SchedulesClientProps = {
  appointments: FormattedAppointment[];
  staffList: StaffMember[];
  services: Service[];
  userRole: 'admin' | 'staff';
  currentUserId: string;
  tenantId: string;
};

export function SchedulesClient({
  appointments,
  staffList,
  userRole,
  currentUserId,
  tenantId
}: SchedulesClientProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Agendamentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus agendamentos.
          </p>
        </div>
        <NewAppointmentDialog 
          staffList={staffList}
          userRole={userRole} 
          currentUserId={currentUserId}
          tenantId={tenantId}
          // Adicionando um callback para recarregar os dados no futuro, se necessário
          // onAppointmentCreated={() => router.refresh()}
        />
      </div>
      <AppointmentsTable data={appointments} />
    </div>
  );
}