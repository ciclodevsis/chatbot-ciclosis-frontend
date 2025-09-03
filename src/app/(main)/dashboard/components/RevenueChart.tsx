"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Define os props que o componente espera
type RevenueChartProps = {
  data: { date: string; faturamento: number }[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Faturamento</CardTitle>
        <CardDescription>Faturamento total nos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {/* Usa os dados recebidos via props */}
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
            <Tooltip
              formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            <Line type="monotone" dataKey="faturamento" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}