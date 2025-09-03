// CAMINHO: app/(auth)/sign-up/[[...step]]/layout.tsx
import { SignUpProvider } from "./SignUpContext";
import type { ReactNode } from "react";

export default function SignUpLayout({ children }: { children: ReactNode }) {
    return (
        <SignUpProvider>
            {children}
        </SignUpProvider>
    );
}