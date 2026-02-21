import type { LineBody } from "@/hooks/useEdits";
import { DrawnLine } from "./DrawnLine";

interface DrawingLinesProps {
    confirmedLines: LineBody[];
    pendingLines: LineBody[];
    currentLine: LineBody | null;
    canvasSize: { width: number; height: number };
}

export function DrawingLines({
    confirmedLines,
    pendingLines,
    currentLine,
    canvasSize,
}: DrawingLinesProps) {
    return (
        <>
            {confirmedLines.map((line, index) => (
                <DrawnLine
                    key={`confirmed-${index}`}
                    line={line}
                    canvasSize={canvasSize}
                />
            ))}
            {pendingLines.map((line, index) => (
                <DrawnLine
                    key={`pending-${index}`}
                    line={line}
                    canvasSize={canvasSize}
                />
            ))}
            {currentLine && (
                <DrawnLine
                    line={currentLine}
                    canvasSize={canvasSize}
                />
            )}
        </>
    );
}
