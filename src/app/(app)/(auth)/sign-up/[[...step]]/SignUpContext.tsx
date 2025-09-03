// CAMINHO: app/(auth)/sign-up/[[...step]]/SignUpContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// --- TIPAGENS ---
export interface SignUpFormData {
  email: string;
  phone: string | undefined;
  selectedPlan: string;
  billingCycle: 'monthly' | 'annual';
}

type SignUpContextType = {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
};

// --- CONTEXTO ---
const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

// --- HOOK ---
export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUpContext deve ser usado dentro de um SignUpProvider");
  }
  return context;
};

// --- PROVIDER ---
export const SignUpProvider = ({ children }: { children: ReactNode }) => {
    const initialData: SignUpFormData = {
        email: "",
        phone: undefined,
        selectedPlan: "free",
        billingCycle: "annual",
    };

    const [formData, setFormData] = useState<SignUpFormData>(() => {
        if (typeof window !== 'undefined') {
            try {
                const item = window.sessionStorage.getItem('signUpFormData');
                return item ? JSON.parse(item) : initialData;
            } catch (error) {
                console.error("Erro ao ler o sessionStorage:", error);
                return initialData;
            }
        }
        return initialData;
    });
 
    useEffect(() => {
        try {
            window.sessionStorage.setItem('signUpFormData', JSON.stringify(formData));
        } catch (error) {
            console.error("Erro ao salvar no sessionStorage:", error);
        }
    }, [formData]);

    return (
      <SignUpContext.Provider value={{ formData, setFormData }}>
        {children}
      </SignUpContext.Provider>
    );
};