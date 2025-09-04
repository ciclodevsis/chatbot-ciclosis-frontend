// src/app/page.tsx

"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Building2, Briefcase, GraduationCap, Store, Landmark, HelpCircle, BookOpen, Award, Users, MessageSquare, Code, ShieldCheck, BarChart2, Zap, Cog, Twitter, Linkedin, Instagram, Lock as LockIcon } from "lucide-react";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a ref={ref} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const productFeaturesList = [
    { title: "Chatbot Inteligente", description: "Mensagens e chat em tempo real para automação 24/7.", href: "/features/messaging", icon: MessageSquare },
    { title: "Metas e Relatórios", description: "Acompanhe o desempenho do seu negócio com indicadores chave.", href: "/features/reporting", icon: BarChart2 },
    { title: "Integrações", description: "Conecte-se com Google Calendar, e outras ferramentas.", href: "/features/integrations", icon: Zap },
    { title: "Gestão de Equipe", description: "Organize horários, serviços e permissões de forma simples.", href: "/features/workforce", icon: Users },
    { title: "Proteção de Dados", description: "Segurança de ponta para garantir a privacidade dos seus dados.", href: "/features/security", icon: ShieldCheck },
    { title: "Personalização Avançada", description: "Adapte a plataforma à identidade do seu negócio.", href: "/features/customization", icon: Cog },
];


export default function HomePage() {
  useEffect(() => {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    scrollRevealElements.forEach(el => observer.observe(el));

    const pricingToggle = document.getElementById('pricing-toggle') as HTMLInputElement;
    const standardPrice = document.getElementById('standard-price');
    
    const handleToggleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            if (standardPrice) standardPrice.textContent = 'R$ 40,00';
        } else {
            if (standardPrice) standardPrice.textContent = 'R$ 50,00';
        }
    };
    pricingToggle?.addEventListener('change', handleToggleChange);

    return () => {
        scrollRevealElements.forEach(el => observer.unobserve(el));
        pricingToggle?.removeEventListener('change', handleToggleChange);
    };
  }, []);


  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <SolutionsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <a href="/" className="text-2xl font-bold text-brand-text">
            Chatbot<span className="text-brand-accent"> Ciclosis</span>
          </a>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Produto</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[1fr_1.25fr] w-[650px] p-4 items-start">
                    <div className="flex flex-col justify-start bg-secondary rounded-l-md p-6 h-full gap-4">
                      <h3 className="text-lg font-semibold text-brand-text">Chatbot Ciclosis para atendimento ao cliente</h3>
                      <p className="text-sm text-muted-foreground">
                        A solução completa para gestão do seu negócio e atendimento ao cliente.
                      </p>
                      <img 
                        src="https://placehold.co/400x225/F5F5F7/1E1E1E?text=Visual+do+Chatbot" 
                        alt="Demonstração do Chatbot Ciclosis" 
                        className="mt-auto rounded-md aspect-video object-cover" 
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">Recursos</h4>
                      <Separator className="my-3" />
                      <ul className="flex flex-col gap-1">
                        {productFeaturesList.map((feature) => (
                          <li key={feature.title}>
                            <a href={feature.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                              <feature.icon className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="font-medium text-sm text-foreground">{feature.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Soluções</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[550px] grid-cols-2 gap-x-6 p-4">
                    <div>
                      <h3 className="font-semibold text-brand-text px-3">Por Tipo de Empresa</h3>
                      <Separator className="my-2" />
                      <ul className="flex flex-col gap-1">
                        <ListItem href="/solutions/enterprise" title="Enterprise"><Building2 className="inline-block mr-2 h-4 w-4" /> Para grandes corporações.</ListItem>
                        <ListItem href="/solutions/smb" title="Pequenas Empresas"><Briefcase className="inline-block mr-2 h-4 w-4" /> Soluções ágeis e escaláveis.</ListItem>
                        <ListItem href="/solutions/startups" title="Startups"><Zap className="inline-block mr-2 h-4 w-4" /> Ferramentas para crescer rápido.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text px-3">Por Setor</h3>
                      <Separator className="my-2" />
                      <ul className="flex flex-col gap-1">
                        <ListItem href="/industries/retail" title="Varejo"><Store className="inline-block mr-2 h-4 w-4" /> Otimize a experiência do cliente.</ListItem>
                        <ListItem href="/industries/finance" title="Serviços Financeiros"><Landmark className="inline-block mr-2 h-4 w-4" /> Segurança e conformidade.</ListItem>
                        <ListItem href="/industries/education" title="Educação"><GraduationCap className="inline-block mr-2 h-4 w-4" /> Modernize a gestão acadêmica.</ListItem>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
                <NavigationMenuContent>
                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/help-center" title="Centro de Ajuda"><HelpCircle className="inline-block mr-2 h-4 w-4" /> Encontre respostas e tutoriais.</ListItem>
                      <ListItem href="/academy" title="Ciclosis Academy"><BookOpen className="inline-block mr-2 h-4 w-4" /> Cursos para dominar a plataforma.</ListItem>
                      <ListItem href="/certifications" title="Certificações"><Award className="inline-block mr-2 h-4 w-4" /> Torne-se um especialista certificado.</ListItem>
                      <ListItem href="/forums" title="Fóruns da Comunidade"><Users className="inline-block mr-2 h-4 w-4" /> Conecte-se com outros usuários.</ListItem>
                      <ListItem href="/customer-stories" title="Depoimentos de Clientes"><MessageSquare className="inline-block mr-2 h-4 w-4" /> Veja nossas histórias de sucesso.</ListItem>
                      <ListItem href="/developers" title="Suporte para Desenvolvedores"><Code className="inline-block mr-2 h-4 w-4" /> APIs e documentação técnica.</ListItem>
                   </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a href="#pricing" className={navigationMenuTriggerStyle()}>Preços</a>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Login</a>
          <Button asChild className="rounded-full">
            <a href="/sign-up">Experimente Gratuitamente</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() { 
  return ( 
    <section id="hero" className="py-20 md:py-32"> 
      <div className="container text-center"> 
        <div className="max-w-4xl mx-auto"> 
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-brand-text leading-tight mb-6"> 
            Automatize sua Agenda. <br /> 
            <span className="text-brand-accent">Encante seus Clientes.</span> 
          </h1> 
          <p className="text-lg md:text-xl text-brand-text-secondary mb-10"> 
            O chatbot Ciclo é a plataforma completa para gerenciamento de agendamentos, clientes e comunicação via Chatbot. 
          </p> 
          <div className="flex justify-center gap-4"> 
            <Button asChild size="lg" className="rounded-full"><a href="/sign-up">Comece Agora (Grátis)</a></Button> 
            <Button asChild size="lg" variant="outline" className="rounded-full"><a href="#features">Ver Funcionalidades</a></Button> 
          </div> 
        </div> 
        <div className="mt-16"> 
          <Card className="max-w-5xl mx-auto shadow-subtle"> 
            <CardContent className="p-4"> 
              <img src="https://placehold.co/1200x600/F5F5F7/1E1E1E?text=Visual+do+Produto+Aqui" alt="Dashboard do Ciclo" className="rounded-md" /> 
            </CardContent> 
          </Card> 
        </div> 
      </div> 
    </section> 
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Tudo que você precisa para crescer</h2>
          <p className="mt-4 text-lg text-muted-foreground">Uma plataforma robusta com ferramentas pensadas para otimizar sua operação e maximizar seus resultados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {productFeaturesList.map(feature => (
            <a href={feature.href} key={feature.title} className="block group">
              <Card className="h-full group-hover:border-primary group-hover:shadow-subtle transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 text-primary h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() { 
  const solutions=[
    {icon:Store,title:"Varejo e Comércio",description:"Aumente as vendas com agendamentos, notificações de promoções e atendimento pós-venda automatizado.",href:"/industries/retail"},
    {icon:Landmark,title:"Serviços Financeiros",description:"Qualifique leads e agende consultorias com segurança, garantindo conformidade e melhorando a experiência do cliente.",href:"/industries/finance"},
    {icon:GraduationCap,title:"Educação",description:"Gerencie matrículas, agende visitas e tire dúvidas de alunos e pais de forma automática e eficiente.",href:"/industries/education"},
    {icon:Briefcase,title:"Serviços Profissionais",description:"Otimize a agenda de advogados, contadores e consultores, permitindo que foquem no que fazem de melhor.",href:"/solutions/smb"}
  ];
  return(
    <section id="solutions" className="py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Soluções sob medida para o seu setor</h2>
          <p className="mt-4 text-lg text-muted-foreground">O chatbot Ciclo se adapta às necessidades únicas do seu negócio, gerando resultados reais.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {solutions.map((solution)=>(
            <a href={solution.href} key={solution.title} className="block group">
              <Card className="h-full group-hover:border-primary group-hover:shadow-subtle transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 text-primary h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <solution.icon className="h-6 w-6"/>
                  </div>
                  <CardTitle>{solution.title}</CardTitle>
                  <CardDescription className="mt-2">{solution.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
    const testimonials = [
        { quote: "O chatbot Ciclo revolucionou nosso agendamento. Reduzimos o tempo gasto em 80% e nossos clientes adoram a praticidade do chatbot.", name: "Joana Silva", title: "CEO, Clínica Bem Estar", imgSrc: "https://i.pravatar.cc/150?img=1" },
        { quote: "A integração com o Google Agenda é fantástica! Mantém toda a equipe sincronizada sem nenhum esforço manual. Recomendo.", name: "Carlos Pereira", title: "Diretor, Consultoria", imgSrc: "https://i.pravatar.cc/150?img=2" },
        { quote: "O suporte é ágil e os relatórios nos dão uma visão clara do crescimento. Uma ferramenta indispensável para o nosso salão.", name: "Mariana Costa", title: "Gerente, Salão de Beleza", imgSrc: "https://i.pravatar.cc/150?img=3" },
        { quote: "Finalmente uma plataforma que entende as necessidades de um escritório. A gestão de clientes ficou muito mais simples.", name: "Ricardo Mendes", title: "Sócio, Mendes Advocacia", imgSrc: "https://i.pravatar.cc/150?img=4" },
        { quote: "Aumentamos a taxa de comparecimento em 30% com os lembretes automáticos via WhatsApp. O retorno foi imediato.", name: "Fernanda Lima", title: "Coordenadora, Espaço Terapêutico", imgSrc: "https://i.pravatar.cc/150?img=5" },
        { quote: "Plataforma intuitiva e poderosa. Nossos agendamentos online triplicaram no primeiro mês de uso.", name: "Lucas Andrade", title: "Fundador, Barbearia Premium", imgSrc: "https://i.pravatar.cc/150?img=6" }
    ];

  return (
    <section id="testimonials" className="py-20 bg-secondary">
        <div className="container">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight">Amado por empresas em todo o Brasil</h2>
                <p className="mt-4 text-lg text-muted-foreground">Veja como o Ciclo está transformando o atendimento ao cliente.</p>
            </div>
            <div data-animated="true" className="marquee mt-16">
                <div className="marquee-track">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <Card key={index} className="flex flex-col justify-between flex-shrink-0 w-[350px] marquee-card">
                             <CardContent className="pt-6">
                                 <p className="italic">"{testimonial.quote}"</p>
                             </CardContent>
                             <CardHeader>
                                 <div className="flex items-center gap-4">
                                     <Avatar>
                                         <AvatarImage src={testimonial.imgSrc} alt={testimonial.name} />
                                         <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                     </Avatar>
                                     <div>
                                         <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                         <CardDescription>{testimonial.title}</CardDescription>
                                     </div>
                                 </div>
                             </CardHeader>
                         </Card>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}

function PricingSection() {
    const plans = [
        { id: "free", name: "Free", description: "Para começar a explorar a plataforma.", price: "R$ 0,00", period: "Válido por 30 dias", features: ["1 Administrador", "1 Profissional (staff)"], badge: "Comece aqui", locked: false, buttonText: "Começar agora" },
        { id: "standard", name: "Standard", description: "Ideal para profissionais autônomos e pequenas equipes.", monthlyPrice: "R$ 50,00", annualPrice: "R$ 40,00", period: "por mês, por usuário", features: [ "1 Administrador", "2 Profissionais (staff)", "Integração com Google Agenda", "Integração com WhatsApp", "Limite de 2.000 conversas/mês" ], badge: "Mais Popular", locked: false, buttonText: "Selecionar Plano" },
        { id: "pro", name: "Pro", description: "Para negócios em crescimento com mais volume.", price: "Em breve", period: "", features: ["Tudo do Standard, e mais...", "Limite de 5.000 conversas/mês"], locked: true, buttonText: "Em breve" },
        { id: "business", name: "Business+", description: "Recursos avançados de automação e IA.", price: "Em breve", period: "", features: ["Tudo do Pro, e mais...", "Recursos de IA com DialogFlow"], locked: true, buttonText: "Em breve" },
    ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Um plano para cada fase do seu negócio</h2>
          <p className="mt-4 text-lg text-muted-foreground">Escolha o plano que melhor se adapta às suas necessidades e comece a crescer hoje mesmo.</p>
        </div>
        
        <div className="flex items-center justify-center gap-4 my-10">
            <span className="font-medium">Mensal</span>
            <label htmlFor="pricing-toggle" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="pricing-toggle" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="font-medium">Anual <span className="text-xs font-semibold text-green-600 bg-green-100 rounded-full px-2 py-0.5">Economize 20%</span></span>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {plans.map((plan) => (
                <Card key={plan.id} className={cn("flex flex-col h-full", plan.id === 'standard' && 'border-primary shadow-subtle', plan.locked && 'bg-secondary')}>
                    <CardHeader>
                        {plan.badge && <div className="text-sm font-bold text-primary mb-2">{plan.badge}</div>}
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription className="h-12">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="mb-6 h-20">
                            {plan.id === 'standard' ? (
                                <>
                                    <span id="standard-price" className="text-4xl font-bold">{plan.monthlyPrice}</span>
                                    <p className="text-sm text-muted-foreground -mt-1">{plan.period}</p>
                                </>
                            ) : (
                                <div className={cn("flex items-baseline", plan.locked && "pt-4")}>
                                     <span className={cn("text-4xl font-bold", plan.locked && "text-2xl text-muted-foreground")}>{plan.price}</span>
                                     {plan.period && <p className="text-sm text-muted-foreground ml-2">{plan.period}</p>}
                                </div>
                            )}
                        </div>
                        <ul className="space-y-3">
                            {plan.features.map(item => (
                                <li key={item} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full" variant={plan.id === 'standard' ? 'default' : 'outline'} disabled={plan.locked}>
                            <a href="/sign-up">
                                {plan.locked && <LockIcon className="mr-2 h-4 w-4" />}
                                {plan.buttonText}
                            </a>
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() { 
  return(
    <section id="faq" className="py-20 bg-secondary">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Perguntas Frequentes</h2>
          <p className="mt-4 text-lg text-muted-foreground">Tudo o que você precisa saber sobre o chatbot Ciclo.</p>
        </div>
        <Accordion type="single" collapsible className="w-full mt-12">
          <AccordionItem value="item-1">
            <AccordionTrigger>O chatbot Ciclo oferece um período de teste gratuito?</AccordionTrigger>
            <AccordionContent>Sim! Oferecemos um teste gratuito de 30 dias em nosso plano Padrão, sem necessidade de cartão de crédito. Você pode explorar todas as funcionalidades e ver como o chatbot Ciclo pode ajudar seu negócio.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() { 
  return(
    <section id="cta" className="py-20 bg-primary/5">
      <div className="container text-center">
        <h2 className="text-3xl font-bold">Pronto para transformar seu atendimento?</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Junte-se a milhares de empresas que já estão economizando tempo e encantando clientes com o chatbot Ciclo.</p>
        <Button asChild size="lg" className="mt-8 rounded-full">
          <a href="/sign-up">Experimente Gratuitamente Agora</a>
        </Button>
      </div>
    </section>
  );
}

function Footer() { 
  // ✅ FIX: Links do rodapé atualizados para corresponder às seções da página
  const linkGroups = [
    {
      title: "Produto",
      links: [
        { name: "Chatbot Inteligente", href: "/features/messaging" },
        { name: "Metas e Relatórios", href: "/features/reporting" },
        { name: "Integrações", href: "/features/integrations" },
        { name: "Gestão de Equipe", href: "/features/workforce" },
        { name: "Proteção de Dados", href: "/features/security" },
        { name: "Personalização Avançada", href: "/features/customization" },
      ],
    },
    {
      title: "Soluções",
      links: [
        { name: "Enterprise", href: "/solutions/enterprise" },
        { name: "Pequenas Empresas", href: "/solutions/smb" },
        { name: "Startups", href: "/solutions/startups" },
        { name: "Varejo", href: "/industries/retail" },
        { name: "Serviços Financeiros", href: "/industries/finance" },
        { name: "Educação", href: "/industries/education" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { name: "Centro de Ajuda", href: "/help-center" },
        { name: "Ciclo Academy", href: "/academy" },
        { name: "Certificações", href: "/certifications" },
        { name: "Fóruns da Comunidade", href: "/forums" },
        { name: "Depoimentos", href: "/customer-stories" },
        { name: "Desenvolvedores", href: "/developers" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "https://ciclosis.com.br" },
        { name: "Contato", href: "https://ciclosis.com.br" },
      ],
    },
  ];

  return(
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-full lg:col-span-1 mb-8 lg:mb-0">
            <a href="https://ciclosis.com.br" className="text-2xl font-bold text-brand-text">Ciclo</a>
            <p className="mt-4 text-muted-foreground">Desenvolva. Automatize. Cresça.</p>
          </div>
          {linkGroups.map((group)=>(
            <div key={group.title}>
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link)=>(
                  <li key={link.name}>
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ciclo. Todos os direitos reservados.</p>
          {/* ✅ FIX: Links de redes sociais atualizados */}
          <div className="flex gap-4 mt-4 sm:mt-0">
             <a href="https://www.instagram.com/ciclo.sis/" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5 hover:text-primary" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}