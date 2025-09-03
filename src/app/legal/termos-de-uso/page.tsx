import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Chatbot Ciclosis",
};

export default function TermosDeUsoPage() {
  return (
    <Card className="p-8 shadow-subtle">
      {/* A classe 'prose' do Tailwind aplica uma formatação bonita e legível ao texto */}
      <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-text">
        <h1>TERMOS DE USO DO SISTEMA DE GESTÃO DE AGENDAMENTOS [Nome do seu SaaS]</h1>
        <p className="text-sm text-brand-text-secondary">Última atualização: [Inserir Data]</p>
        <p>
          Bem-vindo ao [Nome do seu SaaS]! Estes Termos de Uso ("Termos") regem o seu acesso e uso da plataforma de gestão de agendamentos oferecida pela [Nome da sua Empresa], inscrita no CNPJ sob o nº [Seu CNPJ], com sede em [Seu Endereço] ("nós", "nosso", "nossa").
        </p>
        <p>
          Ao se cadastrar e utilizar a Plataforma, você ("Contratante") concorda em cumprir e estar vinculado a estes Termos. Se você não concordar com estes Termos, não utilize a Plataforma.
        </p>

        <h2>1. Objeto</h2>
        <p>O objeto destes Termos é a prestação de serviços de software como serviço (SaaS) por meio de uma plataforma de gestão de agendamentos, que inclui (i) uma agenda automatizada conectada com o Google Calendar; (ii) um bot para WhatsApp para agendamentos e gestão de clientes; (iii) gestão de serviços e equipe; e (iv) indicadores de negócio.</p>
        
        <h2>2. Acesso e Conta de Usuário</h2>
        <ol>
            <li>Para acessar a Plataforma, você deverá criar uma conta de usuário, fornecendo informações precisas e completas, como nome social da empresa, CNPJ, telefone, e-mail, nomes e e-mails dos funcionários.</li>
            <li>O Contratante é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.</li>
        </ol>
        
        <h2>3. Licença de Uso</h2>
        <ol>
            <li>Concedemos a você uma licença limitada, não exclusiva, intransferível e revogável para utilizar a Plataforma e seus recursos, de acordo com estes Termos.</li>
            <li>A licença é concedida apenas para a sua utilização interna e para a gestão do seu negócio. Não é permitido sublicenciar, vender, alugar ou transferir o acesso à Plataforma a terceiros.</li>
        </ol>
        
        <h2>4. Propriedade Intelectual</h2>
        <ol>
            <li>Todos os direitos de propriedade intelectual da Plataforma, incluindo, mas não se limitando a software, designs, logos, códigos-fonte e funcionalidades, pertencem exclusivamente a [Nome da sua Empresa].</li>
            <li>Você reconhece que estes Termos não lhe transferem qualquer direito de propriedade sobre a Plataforma ou suas funcionalidades.</li>
        </ol>

        <h2>5. Dados do Contratante e dos Clientes</h2>
        <ol>
            <li>Você é o único responsável pelos dados que insere na Plataforma, incluindo dados dos seus clientes (nome, e-mail, CPF, telefone).</li>
            <li>Ao inserir os dados dos seus clientes na Plataforma, você declara que obteve o consentimento necessário para o tratamento desses dados, conforme a Lei Geral de Proteção de Dados (LGPD) e outras legislações aplicáveis.</li>
            <li>A utilização de tokens de acesso ao Google Calendar e à Meta é de sua responsabilidade, e você garante que tem a devida autorização para utilizá-los.</li>
        </ol>

        <h2>6. Obrigações do Contratante</h2>
        <ol>
            <li>Não utilizar a Plataforma para fins ilegais ou que violem os direitos de terceiros.</li>
            <li>Não realizar engenharia reversa, descompilar ou tentar obter o código-fonte da Plataforma.</li>
            <li>Garantir que os dados fornecidos à Plataforma são verdadeiros, precisos e não violam a lei.</li>
        </ol>

        <h2>7. Pagamento</h2>
        <ol>
            <li>O acesso à Plataforma pode ser cobrado de acordo com o plano de assinatura escolhido.</li>
            <li>Os pagamentos são processados pelo Mercado Pago através da modalidade PIX. Você concorda com os termos e condições do Mercado Pago e se responsabiliza por todas as transações de pagamento.</li>
        </ol>

        <h2>8. Isenção de Garantias e Limitação de Responsabilidade</h2>
        <ol>
            <li>A Plataforma é fornecida "como está", sem garantias de qualquer tipo.</li>
            <li>Em nenhuma hipótese [Nome da sua Empresa] será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da incapacidade de usar a Plataforma.</li>
        </ol>
        
        <h2>9. Rescisão</h2>
        <ol>
            <li>Estes Termos permanecem em vigor enquanto você utilizar a Plataforma.</li>
            <li>Podemos rescindir ou suspender seu acesso à Plataforma a qualquer momento, por qualquer motivo, com ou sem aviso prévio.</li>
        </ol>

        <h2>10. Disposições Gerais</h2>
        <ol>
            <li>Estes Termos constituem o acordo integral entre você e [Nome da sua Empresa].</li>
            <li>A nossa falha em exigir o cumprimento de qualquer disposição destes Termos não constituirá uma renúncia de tal disposição.</li>
        </ol>
      </article>
    </Card>
  );
}