"use client";

import Download from "@/components/Download";
import { useEffect, useMemo, useState } from "react";

function downloadURI(uri: string, name: string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function CompleteViewer({ roomId }: { roomId: string }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const storageKey = useMemo(() => `room-complete:${roomId}`, [roomId]);

    useEffect(() => {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
            setImageUrl(stored);
        }
    }, [storageKey]);

    const handleDownload = () => {
        if (!imageUrl) return;
        downloadURI(imageUrl, `${Date.now()}.png`);
    };

    return (
        <>

            <div className="px-10 pt-10">
                <div className="bg-white rounded-lg px-4 pt-4 pb-6">
                    <h1 className="text-2xl font-bold text-center text-[#AD3F58]">完成しました！</h1>
                    <div className="p-6">
                        <img src={imageUrl ?? undefined} alt="完成画像" className="w-full h-auto border border-gray-200  " />
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleDownload}
                            className="h-10 w-[70%] bg-[#FF789E] rounded-md flex flex-row items-center gap-2.5 justify-center"
                        >
                            <Download className="w-4 h-4" />
                            <span className="font-semibold text-white ">保存する</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="flex justify-center gap-4">
                    <a href={`/room/${roomId}`} className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors bg-[#FEFEFE]">
                        編集に戻る
                    </a>
                    <a href={`/room/new`} className="border border-[#FF789E] px-4 py-2 rounded-md text-sm text-[#FF789E] hover:bg-gray-100 transition-colors bg-[#FEFEFE]">
                        新しいルームを作成
                    </a>
                </div>
            </div>
        </>
    );
}
