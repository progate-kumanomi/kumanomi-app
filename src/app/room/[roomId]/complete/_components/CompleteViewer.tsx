"use client";

import { DrawingLines } from "@/app/room/[roomId]/_components/DrawingLines";
import DownloadIcon from "@/components/DownloadIcon";
import { useCanvasImage } from "@/hooks/useCanvasImage";
import { parseEditBody, useEdits, type LineBody } from "@/hooks/useEdits";
import { useRef } from "react";
import { Image, Layer, Stage } from "react-konva";

function downloadURI(uri: string, name: string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function CompleteViewer({ roomId, imagePath }: { roomId: string; imagePath: string }) {
    const { edits, isLoading, error } = useEdits(roomId);
    const stageRef = useRef<any>(null);
    const { image, canvasSize, containerRef } = useCanvasImage(imagePath);

    const handleDownload = () => {
        if (!stageRef.current || !image) return;

        // 元の画像サイズに合わせてpixelRatioを計算
        const pixelRatio = image.naturalWidth / canvasSize.width;

        const uri = stageRef.current.toDataURL({
            pixelRatio: pixelRatio // 元の画像サイズで出力
        });
        downloadURI(uri, `${Date.now()}.png`);
    };

    if (error) {
        return (
            <div className="px-10 pt-10">
                <div className="bg-white rounded-lg px-4 pt-4 pb-6">
                    <p className="text-red-600">エラーが発生しました: {error.message}</p>
                </div>
            </div>
        );
    }

    const confirmedLines = edits
        .filter((edit) => !edit.isSkipped)
        .map(parseEditBody)
        .filter((line): line is LineBody => line !== null);

    return (
        <>
            <div className="px-10 pt-10">
                <div className="bg-white rounded-lg px-4 pt-4 pb-6">
                    <h1 className="text-2xl font-bold text-center text-[#AD3F58]">完成しました！</h1>
                    <div className="p-6">
                        <div className="w-full @container flex justify-center">
                            <div
                                ref={containerRef}
                                className="border border-gray-200 w-[100cqw] h-[calc(100cqw*3/2)] md:h-[calc(100cqh-20rem)] md:w-[calc((100cqh-20rem)*2/3)]"
                            >
                                <Stage
                                    ref={stageRef}
                                    width={canvasSize.width}
                                    height={canvasSize.height}
                                >
                                    <Layer>
                                        <Image image={image} width={canvasSize.width} height={canvasSize.height} />
                                    </Layer>
                                    <Layer>
                                        <DrawingLines
                                            confirmedLines={confirmedLines}
                                            pendingLines={[]}
                                            currentLine={null}
                                            canvasSize={canvasSize}
                                        />
                                    </Layer>
                                </Stage>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={isLoading || !image}
                            className="h-10 w-[70%] bg-[#FF789E] rounded-md flex flex-row items-center gap-2.5 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            <span className="font-semibold text-white">保存する</span>
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
