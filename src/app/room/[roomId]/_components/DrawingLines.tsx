import type { LineBody } from "@/hooks/useEdits";
import { scalePoints, scaleStrokeWidth } from "@/utils/canvasCoordinates";
import { Line } from "react-konva";

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
                <Line
                    key={`confirmed-${index}`}
                    points={scalePoints(
                        line.points,
                        canvasSize.width,
                        canvasSize.height
                    )}
                    stroke={line.color}
                    strokeWidth={scaleStrokeWidth(
                        line.strokeWidth,
                        canvasSize.width
                    )}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                />
            ))}
            {pendingLines.map((line, index) => (
                <Line
                    key={`pending-${index}`}
                    points={scalePoints(
                        line.points,
                        canvasSize.width,
                        canvasSize.height
                    )}
                    stroke={line.color}
                    strokeWidth={scaleStrokeWidth(
                        line.strokeWidth,
                        canvasSize.width
                    )}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                />
            ))}
            {currentLine && (
                <Line
                    points={scalePoints(
                        currentLine.points,
                        canvasSize.width,
                        canvasSize.height
                    )}
                    stroke={currentLine.color}
                    strokeWidth={scaleStrokeWidth(
                        currentLine.strokeWidth,
                        canvasSize.width
                    )}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                />
            )}
        </>
    );
}
