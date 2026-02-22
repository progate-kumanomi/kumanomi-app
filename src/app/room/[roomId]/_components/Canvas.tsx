"use client";

import { useCanvasImage } from "@/hooks/useCanvasImage";
import {
    createEdit,
    parseEditBody,
    skipEdit,
    unskipEdit,
    useEdits,
    type LineBody
} from "@/hooks/useEdits";
import { usePendingEdits } from "@/hooks/usePendingEdits";
import {
    normalizeCoordinate
} from "@/utils/canvasCoordinates";
import { getCreatorId } from "@/utils/identity";
import { Icon } from "@iconify/react";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import { DrawingLines } from "./DrawingLines";
import ToolButton from "./ToolButton";
import ToolSettings from "./tools/ToolSettings";
import type { Tool } from "./type";

export default function Canvas({ roomId, imagePath, stageRef }: { roomId: string, imagePath: string, stageRef: any }) {
    const { edits, isLoading, error } = useEdits(roomId);
    const { pendingEdits, addPendingEdit, removePendingEdit, markAsConfirmed } = usePendingEdits(edits);

    const [currentLine, setCurrentLine] = useState<LineBody | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [color, setColor] = useState<string>("#000000");
    const [strokeWidth, setStrokeWidth] = useState<number>(11);
    const [selectedTool, setSelectedTool] = useState<Tool>("brush");
    const [creatorId, setCreatorId] = useState<string | null>(null);

    const { image, canvasSize, containerRef } = useCanvasImage(imagePath);
    const isDrawingRef = useRef(false);

    useEffect(() => {
        getCreatorId()
            .then(setCreatorId)
            .catch((err) => {
                console.error("Failed to get creator ID:", err);
                setErrorMessage("Failed to load your identity. Undo and redo are disabled.");
            });
    }, []);

    const canUndo = useMemo(() => {
        if (!creatorId) return false;
        return edits.some((edit) => !edit.skippedAt && edit.creatorId === creatorId);
    }, [edits, creatorId]);

    const canRedo = useMemo(() => {
        if (!creatorId) return false;
        const skippedEdit = [...edits]
            .sort((a, b) => (b.skippedAt ?? 0) - (a.skippedAt ?? 0))
            .find((edit) => edit.skippedAt && edit.creatorId === creatorId);

        if (!skippedEdit) return false;

        // nextEditより新しい自分の編集があるかチェック
        const hasNewerEdit = edits.some(
            (edit) => !edit.skippedAt &&
                edit.creatorId === creatorId &&
                edit.timestamp > skippedEdit.timestamp
        );

        return !hasNewerEdit;
    }, [edits, creatorId]);

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
            color: selectedTool === "eraser" ? "#FFFFFF" : color,
            strokeWidth: strokeWidth,
            tool: selectedTool,
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

    const handleUndo = async () => {
        // 現在のユーザーが行った変更のうちスキップされていない最後のものを見つける
        try {
            setErrorMessage(null);
            if (!creatorId) return;
            const lastEdit = [...edits]
                .reverse()
                .find((edit) => !edit.skippedAt && edit.creatorId === creatorId);

            if (!lastEdit) {
                return;
            }

            await skipEdit(roomId, lastEdit.timestamp);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to undo";
            setErrorMessage(message);
            console.error("Error undoing edit:", error);
        }
    };

    const handleRedo = async () => {
        // 現在のユーザーが行った変更のうち最後にスキップされたものを見つける
        try {
            setErrorMessage(null);
            if (!creatorId) return;
            const nextEdit = [...edits]
                .sort((a, b) => b.skippedAt! - a.skippedAt!)
                .find((edit) => edit.skippedAt && edit.creatorId === creatorId);
            if (!nextEdit) {
                return;
            }
            await unskipEdit(roomId, nextEdit.timestamp);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to redo";
            setErrorMessage(message);
            console.error("Error redoing edit:", error);
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
        .filter((edit) => !edit.skippedAt)
        .map(parseEditBody)
        .filter((line): line is LineBody => line !== null);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 px-5 flex flex-col overflow-y-auto">
                {/* Undo/Redo */}
                <div className="flex justify-center space-x-4 mb-4">
                    <button onClick={handleUndo} disabled={!canUndo} className="text-gray-800 font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon className="w-8 h-8" icon="material-symbols:arrow-circle-left-outline-rounded" />
                    </button>
                    <button onClick={handleRedo} disabled={!canRedo} className="text-gray-800 font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon className="w-8 h-8" icon="material-symbols:arrow-circle-right-outline-rounded" />
                    </button>
                </div>
                {/* キャンバス */}
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
                {/* カラーピッカー・太さスライダー */}
                <div className="mt-8 mb-8 px-10">
                    <ToolSettings
                        selectedTool={selectedTool}
                        color={color}
                        setColor={setColor}
                        strokeWidth={strokeWidth}
                        setStrokeWidth={setStrokeWidth}
                    />
                </div>
            </div>
            {/* ツール選択 */}
            <div className="shrink-0 w-full bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                <div className="flex justify-center space-x-4 py-5">
                    <ToolButton tool="brush" iconName="material-symbols:brush-outline" selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                    <ToolButton tool="eraser" iconName="material-symbols:ink-eraser-outline" selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
                </div>
            </div>
        </div>
    );
}
