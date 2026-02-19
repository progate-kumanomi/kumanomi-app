"use client";

import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type AmplifyProviderProps = {
    children: ReactNode;
};

export default function AmplifyProvider({ children }: AmplifyProviderProps) {
    const configuredRef = useRef(false);

    useEffect(() => {
        if (configuredRef.current) {
            return;
        }

        Amplify.configure(outputs);
        configuredRef.current = true;
    }, []);

    return <>{children}</>;
}
