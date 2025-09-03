// CAMINHO: app/page.tsx

import LandingPageClient from "@/app/components/LandingPageClient"; // Importa o componente cliente

export default function HomePage() {
  return (
    <>
      <div className="liquid-bg"></div>

      {/* Header */}
      <header id="header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            Chatbot<span className="text-blue-400"> Ciclosis</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm">
            <a href="#overview" className="hover:text-blue-400 transition-colors">Visão Geral</a>
            <a href="#solutions" className="hover:text-blue-400 transition-colors">Soluções</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Preços</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-sm hover:text-blue-400 transition-colors">Login</a>
            <a href="/sign-up" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
              Experimente Gratuitamente
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section id="hero" className="py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Automatize sua Agenda. <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Encante seus Clientes.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10">
                CicloSis é a plataforma completa para gerenciamento de agendamentos, clientes e comunicação, projetada para otimizar seu tempo e impulsionar seu negócio.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/sign-up" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-transform transform hover:scale-105">
                  Comece Agora (Grátis)
                </a>
                <a href="#solutions" className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold px-8 py-3 rounded-full transition-colors">
                  Ver Soluções
                </a>
              </div>
            </div>

            {/* Interactive Mockup */}
            <div className="mt-20 scroll-reveal">
              <div className="relative mx-auto border-slate-700 bg-slate-800 border-[8px] rounded-t-xl w-full max-w-4xl h-auto shadow-2xl shadow-blue-500/10">
                <div className="rounded-lg overflow-hidden">
                  <div className="w-full h-11 bg-slate-700 flex justify-start items-center space-x-1.5 px-4">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                  <img src="https://placehold.co/1200x675/0f172a/e2e8f0?text=Visão+da+Agenda+Inteligente" alt="Interface da Agenda do CicloSis" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section id="overview" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 scroll-reveal">Tudo que você precisa em um só lugar</h2>
              <p className="text-slate-300 scroll-reveal" style={{ transitionDelay: '100ms' }}>
                Simplifique sua rotina com ferramentas inteligentes projetadas para o seu crescimento.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="glass-card p-8 rounded-2xl text-center scroll-reveal" style={{ transitionDelay: '200ms' }}>
                <div className="mx-auto mb-6 bg-blue-500/10 text-blue-400 w-16 h-16 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Agenda Inteligente</h3>
                <p className="text-slate-300 text-sm">Visualize e gerencie todos os seus compromissos com uma interface intuitiva. Evite conflitos e otimize seu dia.</p>
              </div>
              {/* Card 2 */}
              <div className="glass-card p-8 rounded-2xl text-center scroll-reveal" style={{ transitionDelay: '300ms' }}>
                <div className="mx-auto mb-6 bg-purple-500/10 text-purple-400 w-16 h-16 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gestão de Clientes</h3>
                <p className="text-slate-300 text-sm">Mantenha um histórico completo de seus clientes, com informações de contato, preferências e agendamentos passados.</p>
              </div>
              {/* Card 3 */}
              <div className="glass-card p-8 rounded-2xl text-center scroll-reveal" style={{ transitionDelay: '400ms' }}>
                <div className="mx-auto mb-6 bg-cyan-500/10 text-cyan-400 w-16 h-16 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Automação com IA</h3>
                <p className="text-slate-300 text-sm">Integre com WhatsApp e use nosso assistente de IA para responder clientes e agendar horários, 24 horas por dia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 scroll-reveal">Soluções que transformam seu negócio</h2>
              <p className="text-slate-300 scroll-reveal" style={{ transitionDelay: '100ms' }}>
                Desde a marcação do horário até o pós-atendimento, cobrimos todas as etapas para garantir a melhor experiência.
              </p>
            </div>
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
              <div className="md:w-1/2 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                <h3 className="text-2xl font-bold text-white mb-4">Agendamento Online Simplificado</h3>
                <p className="text-slate-300 mb-6">Permita que seus clientes agendem horários diretamente pelo seu site ou link exclusivo, a qualquer hora e de qualquer lugar. Reduza o tempo gasto no telefone e evite erros de marcação.</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Disponibilidade em tempo real.</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Personalizável com seus serviços e horários.</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Integração com Google Agenda.</li>
                </ul>
              </div>
              <div className="md:w-1/2 scroll-reveal" style={{ transitionDelay: '300ms' }}>
                <div className="glass-card rounded-2xl p-4">
                  <img src="https://placehold.co/800x600/1e293b/e2e8f0?text=Página+de+Agendamento+do+Cliente" alt="Página de agendamento online" className="rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                <h3 className="text-2xl font-bold text-white mb-4">Comunicação Automatizada</h3>
                <p className="text-slate-300 mb-6">Reduza as faltas em até 90% com lembretes automáticos via WhatsApp. Envie confirmações, lembretes e mensagens de pós-atendimento sem esforço manual.</p>
                 <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Lembretes de agendamento personalizáveis.</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Confirmação e cancelamento via WhatsApp.</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Assistente de IA para respostas automáticas.</li>
                </ul>
              </div>
              <div className="md:w-1/2 scroll-reveal" style={{ transitionDelay: '300ms' }}>
                <div className="glass-card rounded-2xl p-4">
                  <img src="https://placehold.co/800x600/1e293b/e2e8f0?text=Exemplo+de+Mensagem+no+WhatsApp" alt="Automação de mensagens via WhatsApp" className="rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 scroll-reveal">Planos transparentes para o seu sucesso</h2>
              <p className="text-slate-300 scroll-reveal" style={{ transitionDelay: '100ms' }}>
                Comece gratuitamente e evolua conforme seu negócio cresce. Sem contratos ou taxas escondidas.
              </p>
            </div>
            
            {/* Toggle Mensal/Anual */}
            <div className="flex justify-center mb-10 scroll-reveal" style={{ transitionDelay: '200ms' }}>
              <label htmlFor="pricing-toggle" className="relative inline-flex items-center cursor-pointer p-1 bg-slate-800 rounded-full">
                <input type="checkbox" id="pricing-toggle" className="sr-only peer" />
                <span className="pricing-toggle-bg"></span>
                <span className="relative z-10 px-6 py-2 text-sm font-semibold transition-colors peer-checked:text-white text-slate-300">Mensal</span>
                <span className="relative z-10 px-6 py-2 text-sm font-semibold transition-colors peer-checked:text-slate-900 text-slate-300">Anual (Economize!)</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="glass-card p-8 rounded-2xl flex flex-col scroll-reveal" style={{ transitionDelay: '300ms' }}>
                <h3 className="text-xl font-bold text-blue-400">Free</h3>
                <p className="text-sm text-slate-300 mt-1 mb-6">Para começar a explorar</p>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">R$0</span>
                  <span className="text-slate-300">/para sempre</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 flex-grow">
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>1 Administrador</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>1 Profissional (staff)</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Validade de 30 dias para teste</li>
                </ul>
                <a href="/sign-up" className="mt-8 w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-full transition-colors">Começar Agora</a>
              </div>
              {/* Standard Plan */}
              <div className="relative glass-card p-8 rounded-2xl flex flex-col border-2 border-blue-500 scroll-reveal" style={{ transitionDelay: '400ms' }}>
                 <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">MAIS POPULAR</div>
                <h3 className="text-xl font-bold text-cyan-400">Standard</h3>
                <p className="text-sm text-slate-300 mt-1 mb-6">Para profissionais e pequenas equipes</p>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white" id="standard-price">R$99,90</span>
                  <span className="text-slate-300" id="standard-period">/mês</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 flex-grow">
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>1 Administrador</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>2 Profissionais (staff)</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Integração com Google Agenda</li>
                   <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Integração com WhatsApp</li>
                  <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Limite de 2.000 mensagens/mês</li>
                </ul>
                <a href="/sign-up" className="mt-8 w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full transition-colors">Escolher Plano</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-slate-400 text-sm">
          <p>&copy; 2025 Ciclo. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Componente Cliente para a lógica interativa */}
      <LandingPageClient />
    </>
  );
}