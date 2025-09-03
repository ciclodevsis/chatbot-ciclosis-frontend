"use client"

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { saveWorkSchedule } from "@/lib/actions/staff.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FormState } from "@/lib/actions/types";
import type { WorkSchedule } from "@/lib/types";

type StaffScheduleFormProps = {
  schedule: WorkSchedule[];
};

const daysOfWeek = [
  { id: 1, name: "Segunda-feira" }, { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" }, { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" }, { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

export function StaffScheduleForm({ schedule }: StaffScheduleFormProps) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(saveWorkSchedule, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
    } else if (state?.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state]);

  const scheduleMap = new Map(schedule.map(day => [day.day_of_week, day]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Horários</CardTitle>
        <CardDescription>Defina sua jornada de trabalho semanal padrão.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const daySchedule = scheduleMap.get(day.id);
              const isActive = daySchedule?.is_active ?? false;
              return (
                <div key={day.id} className="flex flex-col md:flex-row items-center gap-4 rounded-lg border p-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <Checkbox id={`day_${day.id}_active`} name={`day_${day.id}_active`} defaultChecked={isActive} />
                    <label htmlFor={`day_${day.id}_active`} className="font-medium min-w-[120px]">{day.name}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Das</span>
                    <Input type="time" name={`day_${day.id}_start`} defaultValue={daySchedule?.start_time || '09:00'} className="w-[120px]" />
                    <span className="text-sm">às</span>
                    <Input type="time" name={`day_${day.id}_end`} defaultValue={daySchedule?.end_time || '18:00'} className="w-[120px]" />
                  </div>
                </div>
              );
            })}
          </div>
          <Button type="submit">Salvar Horários</Button>
        </form>
      </CardContent>
    </Card>
  );
}