"use client"

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getGoogleAuthUrl, disconnectGoogleCalendar } from "@/lib/actions/google.actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { FormState } from "@/lib/actions/types";
import { Loader2, CheckCircle } from "lucide-react";

// Ícone do Google Calendar para consistência visual
const GoogleCalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
    </svg>
);


type ConnectGoogleButtonProps = {
  isConnected: boolean;
};

export function ConnectGoogleButton({ isConnected }: ConnectGoogleButtonProps) {
  const [isPending, startTransition] = useTransition();
  
  const handleConnect = async () => {
    const { url } = await getGoogleAuthUrl();
    if (url) {
      window.location.href = url;
    } else {
      toast.error("Erro", { description: "Não foi possível gerar a URL de autorização." });
    }
  };

  const handleDisconnect = () => {
    startTransition(async () => {
      const result: FormState = await disconnectGoogleCalendar();
      if (result?.success) {
        toast.success("Sucesso!", { description: result.message });
        // A página será recarregada pelo `revalidatePath` na action
      } else {
        toast.error("Erro!", { description: result?.error || result?.message });
      }
    });
  };

  if (isConnected) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {/* ✅ BOTÃO DE ESTADO "CONECTADO" */}
          <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800">
            <CheckCircle className="mr-2 h-4 w-4" />
            Agenda Conectada
          </Button>
        </AlertDialogTrigger>
        {/* ✅ DIÁLOGO COM O TEMA APLICADO */}
        <AlertDialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar Agenda do Google?</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-text-secondary">
              Isso irá desconectar sua Agenda do Google. Os eventos não serão mais sincronizados. Você pode reconectar a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisconnect} disabled={isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Desconexão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  // ✅ BOTÃO DE ESTADO "DESCONECTADO"
  return (
    <Button onClick={handleConnect} className="bg-brand-accent hover:bg-brand-accent-hover text-white">
        <GoogleCalendarIcon className="mr-2 h-4 w-4" />
        Conectar Agenda do Google
    </Button>
  );
}