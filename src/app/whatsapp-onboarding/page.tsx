import WhatsAppOnboarding from '@/app/(main)/settings/components/WhatsAppOnboarding';

export default function WhatsAppOnboardingPage() {
  // Esta página serve como o contêiner para o seu componente de onboarding no popup.
  return (
      <div className="bg-gray-50 min-h-screen">
          <WhatsAppOnboarding />
      </div>
  );
}