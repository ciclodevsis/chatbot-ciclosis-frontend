// Caminho: lib/actions/types.ts
"use server";

// Define um estado reutilizável para as actions de formulário.
export type FormState = {
  success?: boolean;
  message?: string | null;
  error?: string | null;
  errors?: {
    [key: string]: string[] | undefined;
  };
} | null;