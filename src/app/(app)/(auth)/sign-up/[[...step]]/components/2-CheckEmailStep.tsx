// CAMINHO: app/(auth)/sign-up/[[...step]]/components/2-CheckEmailStep.tsx
"use client";

import { useState, useEffect } from "react";
import { useSignUpContext } from "../SignUpContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function CheckEmailStep() {
    const { formData } = useSignUpContext();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    
    return (
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold tracking-tight">Confirme seu e-mail</CardTitle>
                <CardDescription>
                    Enviamos um link de confirmação para <br />
                    <span className="font-medium text-primary">
                        {isClient ? formData.email : '...'}
                    </span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Por favor, clique no link para continuar o processo de cadastro. Se não encontrar o e-mail, verifique sua caixa de spam.
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-xs text-muted-foreground">Esta janela pode ser fechada.</p>
            </CardFooter>
        </Card>
    );
};