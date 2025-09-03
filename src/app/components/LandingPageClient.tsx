"use client";

import { useEffect } from 'react';

export default function LandingPageClient() {
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
    const standardPeriod = document.getElementById('standard-period');
    
    const handleToggleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            if (standardPrice) standardPrice.textContent = 'R$ 1000,00';
            if (standardPeriod) standardPeriod.textContent = '/ano';
        } else {
            if (standardPrice) standardPrice.textContent = 'R$ 120,00';
            if (standardPeriod) standardPeriod.textContent = '/mês';
        }
    };
    pricingToggle?.addEventListener('change', handleToggleChange);

    return () => {
        scrollRevealElements.forEach(el => observer.unobserve(el));
        pricingToggle?.removeEventListener('change', handleToggleChange);
    };
  }, []);

  return null;
}