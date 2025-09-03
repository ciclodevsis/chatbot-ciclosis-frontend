// src/app/page.tsx

import LandingPageClient from "@/app/components/LandingPageClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Building2, Briefcase, GraduationCap, Store, Landmark, HelpCircle, BookOpen, Award, Users, MessageSquare, Code, ShieldCheck, BarChart2, Zap, Cog, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

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

export default function HomePage() {
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
      <LandingPageClient />
    </>
  );
}

function Header() {
  // Dados para o novo menu de Produto
  const productFeatures = [
    { title: "Metas e geração de relatórios", href: "/features/reporting", icon: BarChart2 },
    { title: "Integrações de aplicativos", href: "/features/integrations", icon: Zap },
    { title: "Mensagens e chat em tempo real", href: "/features/messaging", icon: MessageSquare },
    { title: "Gerenciamento da força de trabalho", href: "/features/workforce", icon: Users },
    { title: "Proteção de dados", href: "/features/security", icon: ShieldCheck },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-brand-text">
            Ciclo<span className="text-brand-accent">Sis</span>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              
              {/* === NOVO MENU PRODUTO === */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Produto</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[1fr_1.25fr] w-[650px] p-4">
                    {/* Coluna da Esquerda: Apresentação */}
                    <div className="flex flex-col justify-center bg-secondary rounded-l-md p-6">
                      <h3 className="text-lg font-semibold text-brand-text">Chatbot Ciclosis para atendimento ao cliente</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        A solução completa para gestão do seu negócio e atendimento ao cliente.
                      </p>
                      <img 
                        src="https://placehold.co/400x225/F5F5F7/1E1E1E?text=Visual+do+Chatbot" 
                        alt="Demonstração do Chatbot Ciclosis" 
                        className="mt-4 rounded-md aspect-video object-cover" 
                      />
                    </div>
                    {/* Coluna da Direita: Recursos */}
                    <div className="p-6">
                      <h4 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground mb-3">Recursos</h4>
                      <ul className="flex flex-col gap-1">
                        {productFeatures.map((feature) => (
                          <li key={feature.title}>
                            <Link href={feature.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                              <feature.icon className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="font-medium text-sm text-foreground">{feature.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Menu Soluções (Existente) */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Soluções</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[550px] grid-cols-2 gap-4 p-4">
                    <div>
                      <h3 className="font-semibold text-brand-text mb-2 px-3">Por Tipo de Empresa</h3>
                      <ul className="flex flex-col gap-1">
                        <ListItem href="/solutions/enterprise" title="Enterprise"><Building2 className="inline-block mr-2 h-4 w-4" /> Para grandes corporações.</ListItem>
                        <ListItem href="/solutions/smb" title="Pequenas Empresas"><Briefcase className="inline-block mr-2 h-4 w-4" /> Soluções ágeis e escaláveis.</ListItem>
                        <ListItem href="/solutions/startups" title="Startups"><Zap className="inline-block mr-2 h-4 w-4" /> Ferramentas para crescer rápido.</ListItem>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text mb-2 px-3">Por Setor</h3>
                      <ul className="flex flex-col gap-1">
                        <ListItem href="/industries/retail" title="Varejo"><Store className="inline-block mr-2 h-4 w-4" /> Otimize a experiência do cliente.</ListItem>
                        <ListItem href="/industries/finance" title="Serviços Financeiros"><Landmark className="inline-block mr-2 h-4 w-4" /> Segurança e conformidade.</ListItem>
                        <ListItem href="/industries/education" title="Educação"><GraduationCap className="inline-block mr-2 h-4 w-4" /> Modernize a gestão acadêmica.</ListItem>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Menu Recursos (Existente) */}
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
                <Link href="#pricing" legacyBehavior passHref>
                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>Preços</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Login</Link>
          <Button asChild className="rounded-full">
            <Link href="/sign-up">Experimente Gratuitamente</Link>
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
            CicloSis é a plataforma completa para gerenciamento de agendamentos, clientes e comunicação via Chatbot.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="rounded-full"><Link href="/sign-up">Comece Agora (Grátis)</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full"><Link href="#features">Ver Funcionalidades</Link></Button>
          </div>
        </div>
        <div className="mt-16">
          {/* Espaço para imagem ou vídeo do produto */}
          <Card className="max-w-5xl mx-auto shadow-subtle">
             <CardContent className="p-4">
                <img src="https://placehold.co/1200x600/F5F5F7/1E1E1E?text=Visual+do+Produto+Aqui" alt="Dashboard do CicloSis" className="rounded-md" />
             </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const featureList = [
    { icon: MessageSquare, title: "Chatbot Inteligente", description: "Agendamento e respostas automáticas 24/7 via WhatsApp." },
    { icon: BarChart2, title: "Metas e Relatórios", description: "Acompanhe o desempenho do seu negócio com indicadores chave." },
    { icon: Zap, title: "Integrações", description: "Conecte-se com Google Calendar, e outras ferramentas essenciais." },
    { icon: Users, title: "Gestão de Equipe", description: "Organize horários, serviços e permissões de forma simples." },
    { icon: ShieldCheck, title: "Proteção de Dados", description: "Segurança de ponta para garantir a privacidade dos seus dados." },
    { icon: Cog, title: "Personalização Avançada", description: "Adapte a plataforma à identidade e necessidades do seu negócio." },
  ];

  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Tudo que você precisa para crescer</h2>
          <p className="mt-4 text-lg text-muted-foreground">Uma plataforma robusta com ferramentas pensadas para otimizar sua operação e maximizar seus resultados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {featureList.map(feature => (
            <Card key={feature.title} className="bg-background">
              <CardHeader>
                <div className="bg-primary/10 text-primary h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Adicione esta função em src/app/page.tsx

function SolutionsSection() {
  const solutions = [
    {
      icon: Store,
      title: "Varejo e Comércio",
      description: "Aumente as vendas com agendamentos, notificações de promoções e atendimento pós-venda automatizado.",
      href: "/industries/retail"
    },
    {
      icon: Landmark,
      title: "Serviços Financeiros",
      description: "Qualifique leads e agende consultorias com segurança, garantindo conformidade e melhorando a experiência do cliente.",
      href: "/industries/finance"
    },
    {
      icon: GraduationCap,
      title: "Educação",
      description: "Gerencie matrículas, agende visitas e tire dúvidas de alunos e pais de forma automática e eficiente.",
      href: "/industries/education"
    },
    {
      icon: Briefcase,
      title: "Serviços Profissionais",
      description: "Otimize a agenda de advogados, contadores e consultores, permitindo que foquem no que fazem de melhor.",
      href: "/solutions/smb"
    }
  ];

  return (
    <section id="solutions" className="py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Soluções sob medida para o seu setor</h2>
          <p className="mt-4 text-lg text-muted-foreground">O CicloSis se adapta às necessidades únicas do seu negócio, gerando resultados reais.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {solutions.map((solution) => (
            <Link href={solution.href} key={solution.title} className="block group">
              <Card className="h-full group-hover:border-primary group-hover:shadow-subtle transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 text-primary h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <solution.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{solution.title}</CardTitle>
                  <CardDescription className="mt-2">{solution.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
        <div className="container">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight">Amado por empresas em todo o Brasil</h2>
                <p className="mt-4 text-lg text-muted-foreground">Veja como o CicloSis está transformando o atendimento ao cliente.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 mt-12">
                {/* Depoimento 1 */}
                <Card className="flex flex-col justify-between">
                    <CardContent className="pt-6">
                        <p className="italic">A CicloSis revolucionou nosso agendamento. Reduzimos o tempo gasto em 80% e nossos clientes adoram a praticidade do chatbot.</p>
                    </CardContent>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base">Joana Silva</CardTitle>
                                <CardDescription>CEO, Clínica Bem Estar</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                 {/* Depoimento 2 e 3 (similar) ... */}
            </div>
        </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Um plano para cada fase do seu negócio</h2>
          <p className="mt-4 text-lg text-muted-foreground">Escolha o plano que melhor se adapta às suas necessidades e comece a crescer hoje mesmo.</p>
        </div>
        
        {/* Toggle Mensal/Anual */}
        <div className="flex items-center justify-center gap-4 my-8">
            <span className="font-medium">Mensal</span>
            <label htmlFor="pricing-toggle" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="pricing-toggle" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="font-medium">Anual <span className="text-sm text-primary">(Economize 2 meses)</span></span>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Plano Padrão */}
            <Card className="border-primary shadow-subtle">
                <CardHeader>
                    <CardTitle className="text-2xl">Padrão</CardTitle>
                    <CardDescription>Ideal para pequenas empresas e autônomos que buscam automação e eficiência.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span id="standard-price" className="text-4xl font-bold">R$ 120,00</span>
                        <span id="standard-period" className="text-muted-foreground">/mês</span>
                    </div>
                    <ul className="space-y-3">
                        {[
                          "Chatbot para WhatsApp", "Agenda Online Integrada",
                          "Gestão de Clientes (CRM)", "Relatórios Básicos", "Suporte via Email"
                        ].map(item => (
                            <li key={item} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" /> {item}
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full"><Link href="/sign-up">Começar com Padrão</Link></Button>
                </div>
            </Card>
             {/* Plano Enterprise (similar) ... */}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
    return (
        <section id="faq" className="py-20">
            <div className="container max-w-4xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Perguntas Frequentes</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Tudo o que você precisa saber sobre o CicloSis.</p>
                </div>
                <Accordion type="single" collapsible className="w-full mt-12">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>O CicloSis oferece um período de teste gratuito?</AccordionTrigger>
                        <AccordionContent>
                            Sim! Oferecemos um teste gratuito de 14 dias em nosso plano Padrão, sem necessidade de cartão de crédito. Você pode explorar todas as funcionalidades e ver como o CicloSis pode ajudar seu negócio.
                        </AccordionContent>
                    </AccordionItem>
                    {/* Mais itens do Accordion aqui... */}
                </Accordion>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section id="cta" className="py-20 bg-primary/5">
            <div className="container text-center">
                <h2 className="text-3xl font-bold">Pronto para transformar seu atendimento?</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Junte-se a milhares de empresas que já estão economizando tempo e encantando clientes com o CicloSis.</p>
                <Button asChild size="lg" className="mt-8 rounded-full">
                    <Link href="/sign-up">Experimente Gratuitamente Agora</Link>
                </Button>
            </div>
        </section>
    );
}

function Footer() {
  const linkGroups = [
    {
      title: "Soluções",
      links: [
        { name: "Enterprise", href: "/solutions/enterprise" },
        { name: "Pequenas Empresas", href: "/solutions/smb" },
        { name: "Startups", href: "/solutions/startups" },
        { name: "Varejo", href: "/industries/retail" },
        { name: "Financeiro", href: "/industries/finance" },
        { name: "Educação", href: "/industries/education" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { name: "Centro de Ajuda", href: "/help-center" },
        { name: "Academy", href: "/academy" },
        { name: "Fóruns", href: "/forums" },
        { name: "Desenvolvedores", href: "/developers" },
        { name: "Depoimentos", href: "/customer-stories" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "/about" },
        { name: "Carreiras", href: "/careers" },
        { name: "Imprensa", href: "/press" },
        { name: "Contato", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-full lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="text-2xl font-bold text-brand-text">
              Ciclo<span className="text-brand-accent">Sis</span>
            </Link>
            <p className="mt-4 text-muted-foreground">Automatize. Gerencie. Cresça.</p>
          </div>
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CicloSis. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
             <Link href="#"><Twitter className="h-5 w-5 hover:text-primary" /></Link>
             <Link href="#"><Linkedin className="h-5 w-5 hover:text-primary" /></Link>
             <Link href="#"><Instagram className="h-5 w-5 hover:text-primary" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}