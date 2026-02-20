"use client";

import {
    createEdit,
    parseEditBody,
    useEdits,
    type LineBody,
} from "@/hooks/useEdits";
import { usePendingEdits } from "@/hooks/usePendingEdits";
import {
    normalizeCoordinate
} from "@/utils/canvasCoordinates";
import { getUrl } from 'aws-amplify/storage';
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from 'use-image';
import { DrawingLines } from "./DrawingLines";

export default function Canvas({ roomId, imagePath, stageRef }: { roomId: string, imagePath: string, stageRef: any }) {
    const { edits, isLoading, error } = useEdits(roomId);
    const { pendingEdits, addPendingEdit, removePendingEdit, markAsConfirmed } = usePendingEdits(edits);
    const [currentLine, setCurrentLine] = useState<LineBody | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1200 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawingRef = useRef(false);

    // 画像URLを取得
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const { url } = await getUrl({
                    path: imagePath,
                    options: {
                        validateObjectExistence: true,
                    }
                });
                setImageUrl(url.toString());
            } catch (err) {
                console.error("Failed to get image URL:", err);
            }
        };
        fetchImageUrl();
    }, [imagePath]);

    // キャンバスサイズを管理
    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const width = containerWidth;
                const height = width * 1.5;
                setCanvasSize({ width, height });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    const [image] = useImage(imageUrl, 'anonymous');

    const getPointerPosition = () => {
        if (!stageRef.current) return null;
        const pos = stageRef.current.getPointerPosition();
        if (!pos) return null;
        return normalizeCoordinate(pos.x, pos.y, canvasSize.width, canvasSize.height);
    }

    const handleStartDrawing = (e: KonvaEventObject<any, any>) => {
        isDrawingRef.current = true;
        const normalized = getPointerPosition();
        if (!normalized) return;
        setCurrentLine({
            points: [normalized.x, normalized.y],
            color: "black",
            strokeWidth: 2,
        });
    };

    const handleContinueDrawing = (e: KonvaEventObject<any, any>) => {
        if (!isDrawingRef.current || !currentLine || !stageRef.current) {
            return;
        }
        const normalized = getPointerPosition();
        if (!normalized) return;
        setCurrentLine({
            ...currentLine,
            points: [...currentLine.points, normalized.x, normalized.y],
        });
    };

    const handleEndDrawing = async () => {
        isDrawingRef.current = false;

        if (!currentLine) {
            return;
        }

        try {
            setErrorMessage(null);
            addPendingEdit(currentLine);
            setCurrentLine(null);

            const result = await createEdit(roomId, currentLine);
            if (result.timestamp) {
                markAsConfirmed(result.timestamp);
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to save drawing";
            setErrorMessage(message);
            console.error("Error creating edit:", error);
            removePendingEdit(`temp-${Date.now()}-*`);
        }
    };

    if (error) {
        return (
            <div className="border border-gray-300 p-5 text-red-600">
                Failed to load edits: {error.message}
            </div>
        );
    }

    const confirmedLines = edits
        .filter((edit) => !edit.isSkipped)
        .map(parseEditBody)
        .filter((line): line is LineBody => line !== null);

    return (
        <>
            <div className="w-full px-5">
                <div ref={containerRef} className="border border-gray-300 w-full">
                    {errorMessage && (
                        <div className="bg-red-50 text-red-800 p-2 mb-2">
                            {errorMessage}
                        </div>
                    )}
                    <Stage
                        ref={stageRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        onMouseDown={handleStartDrawing}
                        onMouseMove={handleContinueDrawing}
                        onMouseUp={handleEndDrawing}
                        onTouchStart={handleStartDrawing}
                        onTouchMove={handleContinueDrawing}
                        onTouchEnd={handleEndDrawing}
                    >
                        <Layer>
                            <Image image={image} width={canvasSize.width} height={canvasSize.height} />
                        </Layer>
                        <Layer>
                            <DrawingLines
                                confirmedLines={confirmedLines}
                                pendingLines={pendingEdits}
                                currentLine={currentLine}
                                canvasSize={canvasSize}
                            />
                        </Layer>
                    </Stage>
                </div>
            </div>
        </>
    );
}
