import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proteção de Dados e Diretrizes | Chatbot Ciclosis",
};

export default function ProtecaoDeDadosPage() {
  return (
    <Card className="p-8 shadow-subtle">
      <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-text">
        <h1>POLÍTICA DE PROTEÇÃO DE DADOS E DIRETRIZES DO SISTEMA [Nome do seu SaaS]</h1>
        
        <h2>1. Introdução</h2>
        <p>Esta política estabelece as diretrizes e procedimentos de proteção de dados pessoais aplicáveis a todas as operações de tratamento de dados realizadas pela [Nome da sua Empresa] no contexto do sistema de gestão de agendamentos [Nome do seu SaaS].</p>
        
        <h2>2. Princípios de Proteção de Dados</h2>
        <p>Seguimos os princípios da LGPD:</p>
        <ul>
          <li><strong>Finalidade:</strong> Os dados são coletados para propósitos legítimos e específicos.</li>
          <li><strong>Adequação:</strong> A coleta de dados é compatível com as finalidades informadas.</li>
          <li><strong>Necessidade:</strong> A coleta é limitada ao mínimo necessário para a realização das finalidades.</li>
          <li><strong>Transparência:</strong> O titular dos dados é informado de forma clara sobre o tratamento de seus dados.</li>
          <li><strong>Segurança:</strong> Utilização de medidas técnicas e administrativas para proteger os dados.</li>
        </ul>

        <h2>3. Funções e Responsabilidades</h2>
        <ul>
          <li>
            <strong>Controlador de Dados:</strong> O Contratante é o controlador dos dados de seus clientes, sendo responsável por coletar o consentimento e garantir a conformidade com a LGPD.
          </li>
          <li>
            <strong>Operador de Dados:</strong> A [Nome da sua Empresa] atua como operadora dos dados, tratando-os em nome do Contratante e de acordo com as suas instruções, conforme estes Termos.
          </li>
        </ul>

        <h2>4. Coleta de Dados</h2>
        <p>Os dados são coletados diretamente do Contratante no momento do cadastro e uso da plataforma, bem como dos clientes do Contratante via bot de WhatsApp ou outras funcionalidades de agendamento.</p>

        <h2>5. Armazenamento e Retenção</h2>
        <ul>
            <li>Os dados são armazenados em servidores seguros fornecidos pelo Supabase.</li>
            <li>Os dados serão retidos pelo tempo necessário para cumprir as finalidades para as quais foram coletados, a menos que a lei exija um período de retenção maior.</li>
        </ul>

        <h2>6. Segurança da Informação</h2>
        <ul>
            <li><strong>Proteção de Dados:</strong> Uso de criptografia, controle de acesso e firewalls.</li>
            <li><strong>Monitoramento:</strong> Monitoramento contínuo dos sistemas para identificar e prevenir falhas de segurança.</li>
            <li><strong>Respostas a Incidentes:</strong> Em caso de violação de dados, ativaremos nosso plano de resposta a incidentes, notificando as autoridades competentes e os titulares de dados, conforme a LGPD.</li>
        </ul>

        <h2>7. Direitos dos Titulares</h2>
        <p>Os Contratantes e seus clientes podem exercer seus direitos de privacidade entrando em contato com a [Nome da sua Empresa]. As solicitações serão processadas em até [Prazo em dias, ex: 15 dias] dias.</p>
      </article>
    </Card>
  );
}