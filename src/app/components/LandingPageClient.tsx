// src/app/components/LandingPageClient.tsx

"use client";

import { useEffect } from 'react';

export default function LandingPageClient() {
  useEffect(() => {
    // Scroll reveal animation setup
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

    // ✅ NOVO: Lógica atualizada para o toggle de preços
    const pricingToggle = document.getElementById('pricing-toggle') as HTMLInputElement;
    const standardPrice = document.getElementById('standard-price');
    
    const handleToggleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        // Se o toggle estiver checado (Anual)
        if (target.checked) {
            if (standardPrice) standardPrice.textContent = 'R$ 40,00';
        // Se não estiver checado (Mensal)
        } else {
            if (standardPrice) standardPrice.textContent = 'R$ 50,00';
        }
    };
    pricingToggle?.addEventListener('change', handleToggleChange);

    // Cleanup function
    return () => {
        scrollRevealElements.forEach(el => observer.unobserve(el));
        pricingToggle?.removeEventListener('change', handleToggleChange);
    };
  }, []);

  return null;
}