"use client";

export default function StrokeWidthSetting({
    strokeWidth,
    setStrokeWidth,
    className,
}: {
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
    className?: string;
}) {
    return (
        <div className={`relative h-5 ${className || ''}`}>
            <div className="w-full h-5 bg-[#D9D9D9] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
            <input
                className="absolute inset-0 w-full h-5 rounded-lg appearance-none cursor-pointer slider"
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                aria-label="Stroke width"
            />
        </div>
    );
}
