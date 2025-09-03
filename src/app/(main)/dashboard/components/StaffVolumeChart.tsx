// Caminho do arquivo: app/(app)/dashboard/components/StaffVolumeChart.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * @type ChartData
 * Define um tipo de dado mais seguro e flexível para o gráfico.
 * - `date`: Sempre uma string para o eixo X.
 * - `[key: string]: string | number`: Permite qualquer outra chave,
 * mas restringe seus valores a string ou número.
 */
type ChartData = {
  date: string;
  [key: string]: string | number;
};

/**
 * @interface StaffVolumeChartProps
 * Propriedades para o componente StaffVolumeChart.
 */
interface StaffVolumeChartProps {
  /** Os dados a serem exibidos no gráfico. */
  data: ChartData[];
  /** A chave do objeto de dados que contém o valor para as barras (ex: "agendamentos", "total"). */
  dataKey: string;
  /** O título principal do card. */
  title: string;
  /** A descrição que aparece abaixo do título. */
  description: string;
  /** O nome que será exibido no tooltip da barra. */
  barName: string;
}

// --- Componente CustomTooltip Refatorado ---

/**
 * @type TooltipPayload
 * Define a estrutura de cada item dentro do array `payload` do tooltip,
 * evitando o uso de `any` e garantindo a segurança de tipos.
 */
type TooltipPayload = {
    fill: string;
    value: number | string;
    // Adicione outras propriedades que você possa precisar do payload aqui.
};

/**
 * @type CustomTooltipContentProps
 * Define as propriedades para o tooltip customizado com tipos seguros.
 */
type CustomTooltipContentProps = {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    barName: string;
};

/**
 * Componente customizado para o conteúdo do Tooltip.
 * Agora é um componente nomeado e com tipos seguros, resolvendo os avisos do ESLint.
 * @param {CustomTooltipContentProps} props As propriedades recebidas do Recharts, mais a nossa `barName`.
 */
const CustomTooltipContent = ({ active, payload, label, barName }: CustomTooltipContentProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm bg-background border border-border rounded-lg shadow-sm">
        <p className="label font-bold">{`${label}`}</p>
        <p className="intro" style={{ color: payload[0].fill }}>
          {`${barName}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};
// Adicionando o displayName explicitamente para garantir conformidade com as regras do React.
CustomTooltipContent.displayName = 'CustomTooltipContent';


/**
 * Componente para renderizar um gráfico de barras de volume.
 *
 * Esta versão foi corrigida para eliminar erros de linting, utilizando tipos
 * explícitos para as props do Tooltip e definindo um `displayName` para o
 * componente de tooltip customizado.
 *
 * @param {StaffVolumeChartProps} props As propriedades do componente.
 * @returns {React.ReactElement} O componente do gráfico de barras.
 */
export function StaffVolumeChart({ data, dataKey, title, description, barName }: StaffVolumeChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {/* A verificação de dados existentes foi mantida por ser uma boa prática de UX. */}
          {data && data.length > 0 ? (
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                // Passamos nosso componente customizado e suas props para o `content`.
                content={<CustomTooltipContent barName={barName} />}
              />
              <Bar
                dataKey={dataKey}
                name={barName}
                fill="currentColor"
                className="fill-primary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhum dado disponível para exibir.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}