import RightLine from "@/components/RightLineIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kumanomi",
    description: "みんなと一緒に編集できる落書きアプリ",
};

export default async function Page() {
    return (
        <>
            <div className="min-h-screen w-full bg-linear-to-bl from-[#FF9F05] via-[#FF789E] to-[#F62D66]">
                <div className="fixed left-0 w-[393px] h-[113px] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,244,247,0.3)_50%,rgba(255,244,247,0.8)_100%)]" />
                <div className="text-white pt-6">

                    <div className="relative flex items-end">
                        <img src="/photosample.png" alt="Sample" className="w-3/5" />

                        {/* main headline slightly above the photo */}
                        <div className="absolute right-0 top-0 mt-4 w-7/9 p-4 text-white">
                            <p className="text-3xl font-bold leading-tight" style={{ lineHeight: '1.2', textShadow: "8px 8px 8px rgba(0,0,0,0.25)" }}>
                                リアルタイムで、<br />
                                みんなと一緒に編集
                            </p>
                        </div>
                        {/* description bottom-aligned beside photo, avoiding overlap */}
                        <div className="right-0 bottom-0 mb-4 w-2/3 text-white">
                            <p className="text-md leading-relaxed">
                                ◀ペン、スタンプ、<br />
                                <span className="pl-4">テキストツールで</span><br />
                                <span className="pl-4">自由に描ける</span>
                            </p>
                        </div>

                    </div>
                    <p className="text-lg font-bold leading-tight w-full flex justify-center">
                        URLだけで同時に編集できるWebアプリ
                    </p>
                    <div className="flex items-center mt-3 justify-center ">
                        <img src="/logo.png" alt="Logo" className="w-25 h-25 m-3" />
                        <img src="/logotype.png" alt="Logotype" className="w-32 h-16 m-3" />
                    </div>
                    <div className="px-5">
                        <a href="/room/new" className="block mt-5 text-center text-2xl font-bold bg-white text-[#DD5E89] py-3 rounded-full w-full mx-auto" style={{ boxShadow: "8px 8px 8px rgba(0,0,0,0.25)" }}>
                            <div className="relative flex items-center justify-center">
                                <span className="text-center">使ってみる</span>
                                <RightLine className="absolute right-8" />
                            </div>
                        </a>

                    </div>
                </div>
            </div>
        </>
    )
}
