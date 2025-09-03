"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card" // ✅ Importa o Card
import { columns } from "./services-columns"
import { ServicesTable } from "./ServicesTable"
import { CompanySettingsForm } from "./CompanySettingsForm"
import { StaffServicesForm } from "./StaffServicesForm";
import { StaffScheduleForm } from "./StaffScheduleForm";
import { ProfileForm } from "./ProfileForm";
import type { Service, ServiceWithEnabledStatus, WorkSchedule, CompanySettings } from "@/lib/types"

type SettingsTabsProps = {
  userRole: 'admin' | 'staff';
  user: { email: string; fullName: string; };
  services: Service[];
  staffServices: ServiceWithEnabledStatus[];
  staffSchedule: WorkSchedule[];
  companySettings: CompanySettings | null; 
};

export function SettingsTabs({ userRole, user, services, staffServices, staffSchedule, companySettings }: SettingsTabsProps) {
  return (
    // ✅ O contêiner principal agora é um Card com o estilo do tema
    <Card className="rounded-xl shadow-subtle p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass-tabs-list grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="profile" className="glass-tabs-trigger">Meu Perfil</TabsTrigger>
          {userRole === 'admin' && (
            <>
              <TabsTrigger value="company" className="glass-tabs-trigger">Minha Empresa</TabsTrigger>
              <TabsTrigger value="services" className="glass-tabs-trigger">Serviços</TabsTrigger>
            </>
          )}
          {userRole === 'staff' && (
            <>
              <TabsTrigger value="my-services" className="glass-tabs-trigger">Meus Serviços</TabsTrigger>
              <TabsTrigger value="my-schedule" className="glass-tabs-trigger">Meus Horários</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm email={user.email} fullName={user.fullName} />
        </TabsContent>
        {userRole === 'admin' && (
          <>
            <TabsContent value="company" className="mt-6">
              <CompanySettingsForm settings={companySettings} />
            </TabsContent>
            <TabsContent value="services" className="mt-6">
              <ServicesTable columns={columns} data={services} />
            </TabsContent>
          </>
        )}
        {userRole === 'staff' && (
          <>
            <TabsContent value="my-services" className="mt-6">
              <StaffServicesForm services={staffServices} />
            </TabsContent>
            <TabsContent value="my-schedule" className="mt-6">
              <StaffScheduleForm schedule={staffSchedule} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  );
}