"use client";

import { Icon } from "@iconify/react";
import type { Tool } from "./type";

export default function ToolButton({ tool, iconName, selectedTool, setSelectedTool }: { tool: Tool; iconName: string; selectedTool: Tool; setSelectedTool: (tool: Tool) => void }) {
    const isActive = tool === selectedTool;

    const handleClick = () => {
        setSelectedTool(tool);
    };

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-2 rounded ${isActive ? "bg-[#FD4477] text-white" : " text-gray-700 hover:bg-gray-300"}`}
        >
            <Icon icon={iconName} className="w-7 h-7" />
        </button>
    );
}
