"use client";

import { memo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartDataPoint, StaffMember } from '@/lib/types';

type VolumeChartProps = {
  data: ChartDataPoint[];
  staffMembers: StaffMember[];
  userRole: 'admin' | 'staff';
};

export const VolumeChart = memo(function VolumeChart({ data, staffMembers, userRole }: VolumeChartProps) {
  const staffColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Volume de Agendamentos</CardTitle>
        <CardDescription>Total de agendamentos por membro da equipe.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
            />
            <Legend />
            {userRole === 'admin' && staffMembers ? (
                staffMembers.map((staff, index) => (
                  <Bar
                    key={staff.id}
                    dataKey={staff.id}
                    stackId="a"
                    name={staff.full_name || 'Desconhecido'}
                    fill={staffColors[index % staffColors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))
            ) : (
                <Bar dataKey="total" name="Meus Agendamentos" fill={staffColors[0]} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

VolumeChart.displayName = 'VolumeChart';