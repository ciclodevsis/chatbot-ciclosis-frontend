"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGoalAction } from "@/lib/actions/dashboard.actions";
import type { FormState } from "@/lib/actions/types";

type StatCardProps = {
  title: string;
  value: number;
  goal: number;
  goalType: string;
};

export function StatCard({ title, value, goal, goalType }: StatCardProps) {
  const [open, setOpen] = useState(false);
  const initialState: FormState = null;
  const [state, formAction] = useFormState(updateGoalAction, initialState);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Sucesso!", { description: state.message });
      setOpen(false);
    } else if (state.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state]);

  const isGoalAchieved = value >= goal;
  const colorClass = isGoalAchieved ? "text-status-success" : "text-status-error";

  return (
    <Card className="rounded-xl shadow-subtle">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-brand-text-secondary">{title}</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-brand-text-secondary hover:bg-black/5 hover:text-brand-text"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            {/* ✅ CORREÇÃO: Aplica o tema ao DialogContent */}
            <DialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
              <DialogHeader>
                <DialogTitle>Definir Meta: {title}</DialogTitle>
                <DialogDescription className="text-brand-text-secondary">Digite o novo valor para a sua meta.</DialogDescription>
              </DialogHeader>
              <form action={formAction}>
                <input type="hidden" name="goalType" value={goalType} />
                <div className="py-4">
                  <Label htmlFor="goalValue">Nova Meta</Label>
                  <Input id="goalValue" name="goalValue" type="number" defaultValue={goal} />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-brand-accent hover:bg-brand-accent-hover text-white">Salvar Meta</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-brand-text">{value}</div>
        <p className={`text-xs ${colorClass}`}>
          Meta: {goal}
        </p>
      </CardContent>
    </Card>
  );
}