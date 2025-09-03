import { AuthProvider } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

/**
 * Este layout é o PONTO CENTRAL da nossa lógica de autenticação.
 * A sua única função é "envolver" todas as rotas dentro do grupo (app)
 * - que são as rotas de autenticação e as rotas principais - com o AuthProvider.
 * Desta forma, tanto o AuthLayout como o AppLayout podem consumir o contexto.
 */
export default function AppWrapperLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}