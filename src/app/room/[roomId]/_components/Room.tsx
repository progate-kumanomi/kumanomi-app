"use client";

import Canvas from "./Canvas";
import Header from "./Header";
import { useRef } from "react";

export default function Room({ roomId, imagePath }: { roomId: string; imagePath: string }) {
    const stageRef = useRef<any>(null);
    
    return (
        <>
            <Header stageRef={stageRef} />
            <Canvas roomId={roomId} imagePath={imagePath} stageRef={stageRef} />
        </>
    );
}
