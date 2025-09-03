"use client"

import { useState, useTransition, useEffect, useCallback, useRef } from 'react';
import { StatCard } from './StatCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChartDataAction } from "@/lib/actions/dashboard.actions";
import { toast } from 'sonner';
import { VolumeChart } from './VolumeChart';
import { RevenueChart } from './RevenueChart';
import { RevenuePie } from './RevenuePie';
import type { DashboardStats, ChartData, StaffMember } from '@/lib/types';
import { cn } from '@/lib/utils';

type DashboardClientProps = {
  initialStats: DashboardStats;
  staffMembers: StaffMember[];
  userRole: 'admin' | 'staff';
};

export function DashboardClient({ initialStats, staffMembers, userRole }: DashboardClientProps) {
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  // Refs para o novo toggle deslizante
  const toggleRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const handleFilterChange = useCallback((newPeriod: 'week' | 'month' | 'year', newStaffId: string) => {
    setPeriod(newPeriod);
    setSelectedStaffId(newStaffId);
    
    startTransition(async () => {
      const result = await getChartDataAction(newPeriod, newStaffId);
      if (result && 'error' in result) {
        toast.error("Erro ao buscar dados", { description: result.error as string });
      } else if (result) {
        setCharts(result as ChartData);
      }
    });
  }, []);

  useEffect(() => {
    handleFilterChange('week', 'all');
  }, [handleFilterChange]);

  // Efeito para mover o indicador do toggle
  useEffect(() => {
    const periodMap = { week: 0, month: 1, year: 2 };
    const activeIndex = periodMap[period];
    const toggleNode = toggleRef.current;

    if (toggleNode) {
      const activeButton = toggleNode.children[activeIndex + 1] as HTMLElement; // +1 para pular o indicador
      if (activeButton) {
        setIndicatorStyle({
          left: `${activeButton.offsetLeft}px`,
          width: `${activeButton.offsetWidth}px`,
        });
      }
    }
  }, [period]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Agendamentos da Semana" value={initialStats.weekly.value} goal={initialStats.weekly.goal} goalType="weekly_appointments" />
        <StatCard title="Agendamentos do Mês" value={initialStats.monthly.value} goal={initialStats.monthly.goal} goalType="monthly_appointments" />
        <StatCard title="Agendamentos do Ano" value={initialStats.yearly.value} goal={initialStats.yearly.goal} goalType="yearly_appointments" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
            {/* Toggle de período com indicador deslizante */}
            <div ref={toggleRef} className="relative flex items-center p-1 bg-white rounded-full shadow-sm border border-card-border">
              <div 
                className="absolute h-[calc(100%-8px)] bg-brand-accent rounded-md transition-all duration-300 ease-in-out"
                style={indicatorStyle}
              />
              {['week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => handleFilterChange(p as 'week' | 'month' | 'year', selectedStaffId)}
                  className={cn(
                    "relative z-10 px-4 py-1.5 text-sm font-medium transition-colors rounded-md",
                    period === p ? 'text-white' : 'text-brand-text-secondary hover:text-brand-text'
                  )}
                >
                  {p === 'week' ? 'Semanal' : p === 'month' ? 'Mensal' : 'Anual'}
                </button>
              ))}
            </div>
            
            {userRole === 'admin' && (
                <Select value={selectedStaffId} onValueChange={(staffId) => handleFilterChange(period, staffId)}>
                    <SelectTrigger className="w-[200px] bg-white border-card-border shadow-sm">
                        <SelectValue placeholder="Filtrar por funcionário" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
                        <SelectItem value="all">Todos os funcionários</SelectItem>
                        {staffMembers.map(staff => (
                            <SelectItem key={staff.id} value={staff.id}>{staff.full_name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
        
        {isPending || !charts ? (
          <div className="flex justify-center items-center h-96 text-brand-text/70">Carregando dados...</div>
        ) : (
            <div className="grid gap-6 lg:grid-cols-4">
                <VolumeChart data={charts.volumeData} staffMembers={staffMembers} userRole={userRole} />
                <RevenueChart data={charts.revenueData} />
                {userRole === 'admin' && charts.pieData.length > 0 && (
                  <RevenuePie data={charts.pieData} />
                )}
            </div>
        )}
      </div>
    </div>
  );
}