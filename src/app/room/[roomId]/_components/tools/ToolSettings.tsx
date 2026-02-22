import type { Tool } from "../type";
import BrushSettings from "./BrushSettings";
import EraserSettings from "./EraserSettings";

export default function ToolSettings({ selectedTool, color, setColor, strokeWidth, setStrokeWidth }: { selectedTool: Tool, color: string, setColor: (color: string) => void, strokeWidth: number, setStrokeWidth: (width: number) => void }) {
    switch (selectedTool) {
        case "brush":
            return (
                <BrushSettings color={color} setColor={setColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
            );
        case "eraser":
            return (
                <EraserSettings strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
            );
        default:
            return <p>エラーが発生しました。ツールを選択しなおしてください。</p>
    }
}
