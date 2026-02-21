"use client";

import { useCanvasImage } from "@/hooks/useCanvasImage";
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
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import { DrawingLines } from "./DrawingLines";
import ToolButton from "./ToolButton";
import { Tool } from "./type";

export default function Canvas({ roomId, imagePath, stageRef }: { roomId: string, imagePath: string, stageRef: any }) {
    const { edits, isLoading, error } = useEdits(roomId);
    const { pendingEdits, addPendingEdit, removePendingEdit, markAsConfirmed } = usePendingEdits(edits);

    const [currentLine, setCurrentLine] = useState<LineBody | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [color, setColor] = useState<string>("#000000");
    const [strokeWidth, setStrokeWidth] = useState<number>(2);
    const [selectedTool, setSelectedTool] = useState<Tool>("brush");

    const { image, canvasSize, containerRef } = useCanvasImage(imagePath);
    const isDrawingRef = useRef(false);

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
            color: color,
            strokeWidth: strokeWidth,
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
            {/* キャンバス */}
            <div className="px-5">
                <div className="w-full @container flex justify-center">
                    <div
                        ref={containerRef}
                        className="border border-gray-300 w-[100cqw] h-[calc(100cqw*4/3)] md:h-[calc(100cqh-12rem)] md:w-[calc((100cqh-12rem)*3/4)]"
                    >
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
            </div>
            {/* カラーピッカー・太さスライダー */}
            <div className="px-5 mt-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="color" className="text-sm">Color:</label>
                        <input type="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="strokeWidth" className="text-sm">Stroke Width:</label>
                        <input
                            type="range"
                            id="strokeWidth"
                            min="1"
                            max="20"
                            value={strokeWidth}
                            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            {/* ツール選択 */}
            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                <div className="flex justify-center space-x-4 py-5">
                    <ToolButton tool="brush" iconName="material-symbols:brush-outline" selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                    <ToolButton tool="eraser" iconName="material-symbols:ink-eraser-outline" selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                </div>
            </div>
        </>
    );
}
