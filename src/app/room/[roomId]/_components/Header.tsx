"use client";

import { useRouter } from "next/navigation";

export default function Header({ stageRef, roomId }: { stageRef: any; roomId: string }) {
    const router = useRouter();
    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Kumanomi',
                text: 'Kumanomiのルームを共有しました',
                url: window.location.href,
            }).catch((error) => {
                console.error('共有に失敗しました:', error);
            });
        }
    };

    const handleCompleteClick = () => {
        let uri: string;
        try {
            uri = stageRef.current.toDataURL();
        } catch (error) {
            console.error('キャンバスのデータURLの取得に失敗しました:', error);
            return;
        }

        try {
            sessionStorage.setItem(`room-complete:${roomId}`, uri);
        } catch (error) {
            console.error('画像の保存に失敗しました:', error);
            return;
        }

        router.push(`/room/${roomId}/complete`);
    };



    return (
        <header className="w-full h-18 flex items-center justify-between px-5 mb-5 bg-[#0000001a]">
            <button
                onClick={handleShareClick}
                className="h-10 px-4 bg-white shadow-[0px_1px_4px_#00000040] inline-flex items-center justify-center rounded-[10px] cursor-pointer transition-transform active:scale-95 hover:shadow-[0px_2px_6px_#00000040]"
                aria-label="招待URLを共有"
            >
                <span className="font-medium text-[#f84175] text-sm whitespace-nowrap">
                    招待URLを共有
                </span>
            </button>
            <button
                onClick={handleCompleteClick}
                className="h-10 px-5 shadow-[0px_4px_4px_#00000040] bg-[linear-gradient(73deg,rgba(220,94,136,1)_0%,rgba(232,135,143,1)_50%,rgba(242,171,148,1)_100%)] inline-flex items-center justify-center rounded-[10px] cursor-pointer transition-transform active:scale-95 hover:shadow-[0px_6px_8px_#00000050]"
                aria-label="完成"
            >
                <span className="font-semibold text-white text-base whitespace-nowrap">
                    完成！
                </span>
            </button>
        </header>
    );
}
