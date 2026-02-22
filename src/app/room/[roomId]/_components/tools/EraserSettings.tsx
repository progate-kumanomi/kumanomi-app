import StrokeWidthSetting from "./StrokeWidthSetting";

export default function EraserSettings({ strokeWidth, setStrokeWidth }: { strokeWidth: number, setStrokeWidth: (width: number) => void }) {
    return (
        <div className="flex justify-center items-center gap-6 w-full h-10">
            <StrokeWidthSetting className="flex-1" strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
        </div>
    );
}
