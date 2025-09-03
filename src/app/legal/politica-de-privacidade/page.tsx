import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Chatbot Ciclosis",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <Card className="p-8 shadow-subtle">
      <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-text">
        <h1>POLÍTICA DE PRIVACIDADE DO SISTEMA DE GESTÃO DE AGENDAMENTOS [Nome do seu SaaS]</h1>
        <p className="text-sm text-brand-text-secondary">Última atualização: [Inserir Data]</p>
        <p>
          A sua privacidade e a privacidade dos seus clientes são de extrema importância para nós. Esta Política de Privacidade descreve como [Nome da sua Empresa] (nós, nosso, nossa) coleta, usa, compartilha e protege os dados pessoais no contexto da sua utilização do nosso sistema de gestão de agendamentos (Plataforma).
        </p>

        <h2>1. Dados Coletados</h2>
        <p>Coletamos dois tipos de dados por meio da Plataforma:</p>
        <ul>
          <li>
            <strong>Dados dos Contratantes (sua empresa):</strong> Nome social da empresa, CNPJ, telefone, e-mail, nome e e-mail dos funcionários. Além disso, coletamos tokens de acesso ao Google Calendar e à Meta para habilitar as funcionalidades do sistema.
          </li>
          <li>
            <strong>Dados dos Clientes dos Contratantes (seus clientes):</strong> Nome, e-mail, CPF e número de telefone. Esses dados são inseridos na Plataforma por você, Contratante, e são de sua responsabilidade.
          </li>
        </ul>

        <h2>2. Finalidade da Coleta de Dados</h2>
        <p>Coletamos os dados para as seguintes finalidades:</p>
        <ul>
          <li>
            <strong>Fornecer o Serviço:</strong> Para operar, manter e fornecer todas as funcionalidades da Plataforma, incluindo a agenda automatizada, o bot de WhatsApp e a gestão da equipe.
          </li>
          <li>
            <strong>Melhoria do Produto:</strong> Para analisar o uso da Plataforma e realizar melhorias, desenvolver novas funcionalidades e personalizar a experiência do usuário.
          </li>
          <li>
            <strong>Comunicação:</strong> Para enviar comunicações sobre a sua conta, atualizações do serviço e informações relevantes.
          </li>
        </ul>

        <h2>3. Compartilhamento de Dados com Terceiros</h2>
        <p>Compartilhamos seus dados com terceiros e subcontratados estritamente para a finalidade de operação do serviço, incluindo:</p>
        <ul>
          <li><strong>Supabase:</strong> Utilizado como banco de dados.</li>
          <li><strong>Vercel e Render:</strong> Utilizados para hospedagem do frontend e backend, respectivamente.</li>
          <li><strong>Meta:</strong> Para a conectividade com Facebook para empresas e o bot de WhatsApp.</li>
          <li><strong>Google:</strong> Para a integração com o Google Calendar e login via Supabase.</li>
          <li><strong>Mercado Pago:</strong> Para o processamento seguro de pagamentos via PIX.</li>
        </ul>

        <h2>4. Medidas de Segurança</h2>
        <p>Implementamos medidas de segurança técnicas e organizacionais para proteger os dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. As medidas incluem:</p>
        <ul>
          <li>
            <strong>Criptografia:</strong> Os dados são criptografados tanto em trânsito quanto em repouso.
          </li>
          <li>
            <strong>Controle de Acesso:</strong> Acesso aos dados restrito apenas a funcionários autorizados, com base na necessidade de conhecimento.
          </li>
        </ul>

        <h2>5. Direitos dos Titulares de Dados</h2>
        <p>Conforme a LGPD, os titulares de dados (você e seus clientes) têm direitos, como o acesso, correção, anonimização, bloqueio ou eliminação de dados, revogação do consentimento, entre outros. Para exercer esses direitos, entre em contato conosco através do [Seu e-mail de contato].</p>

        <h2>6. Armazenamento de Dados</h2>
        <p>Os dados são armazenados nos servidores do Supabase localizados em East US (Ohio), garantindo a conformidade com as leis de proteção de dados aplicáveis.</p>

        <h2>7. Alterações nesta Política</h2>
        <p>Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova política na Plataforma.</p>
      </article>
    </Card>
  );
}