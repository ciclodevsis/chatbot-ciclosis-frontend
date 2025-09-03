"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Define os props que o componente espera
type RevenuePieProps = {
  data: { name: string; value: number }[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export function RevenuePie({ data }: RevenuePieProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Faturamento por Funcionário</CardTitle>
        <CardDescription>Proporção no período selecionado.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
            <Legend />
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ percent }) => `${(percent ?? 0) * 100}%`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}