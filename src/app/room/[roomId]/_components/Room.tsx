"use client";

import { useRef } from "react";
import Canvas from "./Canvas";
import Header from "./Header";

export default function Room({ roomId, imagePath }: { roomId: string; imagePath: string }) {
    const stageRef = useRef<any>(null);

    return (
        <>
            <Header stageRef={stageRef} roomId={roomId} />
            <Canvas roomId={roomId} imagePath={imagePath} stageRef={stageRef} />
        </>
    );
}
