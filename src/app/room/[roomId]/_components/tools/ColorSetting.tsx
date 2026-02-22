"use client";

import { useEffect, useRef, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { createPortal } from "react-dom";

export default function ColorSetting({
    color,
    setColor,
    className,
}: {
    color: string;
    setColor: (color: string) => void;
    className?: string;
}) {
    const [showPicker, setShowPicker] = useState(false);
    const [pickerColor, setPickerColor] = useColor(color);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPicker]);

    const handleColorChange = (newColor: any) => {
        setPickerColor(newColor);
        setColor(newColor.hex);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 border-gray-800 transition-transform duration-200 hover:scale-110 p-1 bg-white flex items-center justify-center ${className || ''}`}
                aria-label="Open color picker"
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </button>
            {showPicker &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-40 w-screen h-screen bg-[rgba(0,0,0,0.5)]"
                            onClick={() => setShowPicker(false)}
                        />
                        <div
                            ref={pickerRef}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                        >
                            <ColorPicker
                                color={pickerColor}
                                onChange={handleColorChange}
                            />
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
}
