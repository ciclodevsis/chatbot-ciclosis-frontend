// Caminho: app/components/LandingPageClient.tsx
"use client";

import { useEffect } from 'react';

// Este componente irá conter toda a lógica que precisa do navegador.
export default function LandingPageClient() {
  
  useEffect(() => {
    // Lógica para a animação de revelação ao rolar a página
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

    // Lógica para o fundo do cabeçalho ao rolar
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 10) {
            header?.classList.add('glass-card');
        } else {
            header?.classList.remove('glass-card');
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Lógica para o botão de alternar preços
    const pricingToggle = document.getElementById('pricing-toggle') as HTMLInputElement;
    const standardPrice = document.getElementById('standard-price');
    const standardPeriod = document.getElementById('standard-period');
    
    const handleToggleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            if (standardPrice) standardPrice.textContent = 'R$83,33';
            if (standardPeriod) standardPeriod.textContent = '/mês (cobrado anualmente)';
        } else {
            if (standardPrice) standardPrice.textContent = 'R$99,90';
            if (standardPeriod) standardPeriod.textContent = '/mês';
        }
    };
    pricingToggle?.addEventListener('change', handleToggleChange);

    // Função de limpeza para remover os event listeners quando o componente for desmontado
    return () => {
        scrollRevealElements.forEach(el => observer.unobserve(el));
        window.removeEventListener('scroll', handleScroll);
        pricingToggle?.removeEventListener('change', handleToggleChange);
    };
  }, []); // O array vazio garante que este efeito rode apenas uma vez, quando o componente é montado.

  // Este componente não renderiza nada visualmente, apenas injeta a lógica no cliente.
  return null;
}