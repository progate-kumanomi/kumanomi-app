import ColorSetting from "./ColorSetting";
import StrokeWidthSetting from "./StrokeWidthSetting";

export default function BrushSettings({ color, setColor, strokeWidth, setStrokeWidth }: { color: string, setColor: (color: string) => void, strokeWidth: number, setStrokeWidth: (width: number) => void }) {
    return (
        <div className="flex justify-center items-center gap-6 w-full h-10">
            <ColorSetting className="shrink-0" color={color} setColor={setColor} />
            <StrokeWidthSetting className="flex-1" strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
        </div>
    );
}
