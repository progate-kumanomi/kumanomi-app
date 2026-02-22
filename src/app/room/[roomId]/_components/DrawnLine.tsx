import type { LineBody } from "@/hooks/useEdits";
import { scalePoints, scaleStrokeWidth } from "@/utils/canvasCoordinates";
import { Line } from "react-konva";

interface DrawnLineProps {
    line: LineBody;
    canvasSize: { width: number; height: number };
}

export function DrawnLine({ line, canvasSize }: DrawnLineProps) {
    return (
        <Line
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
            globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
        />
    );
}
