"use client";

import outputs from "@/outputs";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide() {
    return null;
}
