"use client";

import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Image, Layer, Line, Stage } from "react-konva";
import useImage from 'use-image';
import {
    createEdit,
    parseEditBody,
    useEdits,
    type LineBody,
} from "@/hooks/useEdits";

export default function Canvas({ roomId, imageUrl }: { roomId: string, imageUrl: string }) {
    const { edits, isLoading, error } = useEdits(roomId);
    const [currentLine, setCurrentLine] = useState<LineBody | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const isDrawingRef = useRef(false);
    const stageRef = useRef<any>(null);

    const [image] = useImage(imageUrl);

    const handleMouseDown = (e: KonvaEventObject<any, any>) => {
        isDrawingRef.current = true;
        const pos = stageRef.current?.getPointerPosition();
        if (!pos) return;
        setCurrentLine({
            points: [pos.x, pos.y],
            color: "black",
            strokeWidth: 2,
        });
    };

    const handleMouseMove = (e: KonvaEventObject<any, any>) => {
        if (!isDrawingRef.current || !currentLine || !stageRef.current) {
            return;
        }
        const pos = stageRef.current.getPointerPosition();
        if (!pos) return;
        setCurrentLine({
            ...currentLine,
            points: [...currentLine.points, pos.x, pos.y],
        });
    };

    const handleMouseUp = async () => {
        isDrawingRef.current = false;

        if (!currentLine) {
            return;
        }

        try {
            setErrorMessage(null);
            await createEdit(roomId, currentLine);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to save drawing";
            setErrorMessage(message);
            console.error("Error creating edit:", error);
        }

        setCurrentLine(null);
    };

    if (error) {
        return (
            <div style={{ border: "1px solid #ccc", padding: "20px", color: "red" }}>
                Failed to load edits: {error.message}
            </div>
        );
    }

    return (
        <>
            <div style={{ border: "1px solid #ccc" }}>
                {errorMessage && (
                    <div
                        style={{
                            backgroundColor: "#ffebee",
                            color: "#c62828",
                            padding: "8px",
                            marginBottom: "8px",
                        }}
                    >
                        {errorMessage}
                    </div>
                )}
                <Stage
                    ref={stageRef}
                    width={800}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <Layer>
                        <Image image={image} width={800} height={600} />
                    </Layer>
                    <Layer>
                        {edits
                            .filter((edit) => !edit.isSkipped)
                            .map((edit) => {
                                const bodyData = parseEditBody(edit);
                                if (!bodyData) {
                                    return null;
                                }
                                switch (edit.type) {
                                    case "line":
                                        return (
                                            <Line
                                                key={edit.timestamp}
                                                points={bodyData.points}
                                                stroke={bodyData.color}
                                                strokeWidth={bodyData.strokeWidth}
                                                tension={0.5}
                                                lineCap="round"
                                                lineJoin="round"
                                            />
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        {currentLine && (
                            <Line
                                points={currentLine.points}
                                stroke={currentLine.color}
                                strokeWidth={currentLine.strokeWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </>
    );
}
