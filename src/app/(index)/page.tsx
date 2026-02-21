import RightLine from "@/components/RightLineIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kumanomi",
    description: "みんなと一緒に編集できる落書きアプリ",
};

export default async function Page() {
    return (
        <>
            <div className="min-h-screen w-full bg-linear-to-bl from-[#F7BB97] to-[#DD5E89]">
                <div className="text-white">
                    <div className="flex">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 m-3" />
                        <h1 className="text-xl font-bold mt-4">ロゴタイプ</h1>
                    </div>
                    <p
                        className="text-center text-4xl font-bold pt-5 mb-10"
                        style={{ textShadow: "8px 8px 8px rgba(0,0,0,0.25)" }}
                    >
                        リアルタイムで、<br />
                        みんなと一緒に編集
                    </p>
                    <div className="flex mt-4 items-end">
                        <img src="/photosample.png" alt="Sample" className="w-3/5" />
                        <div>
                            <p className="ml-4 text-2xl pb-4">説明</p>
                        </div>
                    </div>
                    <div className="px-5">
                        <a href="/room/new" className="block mt-25 text-center text-2xl font-bold bg-white text-[#DD5E89] py-3 rounded-full w-full mx-auto" style={{ boxShadow: "8px 8px 8px rgba(0,0,0,0.25)" }}>
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
