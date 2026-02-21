import { cookiesClient } from "@/utils/amplifyServerUtils";
import { notFound } from 'next/navigation';
import CompleteViewer from "./_components/CompleteViewer";

export async function generateMetadata({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;

    const room = await (await cookiesClient.models.Room.get({ id: roomId })).data;
    if (!room) {
        return {
            title: "ルームが見つかりません",
            description: "指定されたルームは存在しません。",
        };
    }

    return {
        title: `ルーム: ${room.name} - 完成画面`,
        description: `${room.name}の完成画面です。みんなで一緒に編集した結果を見ましょう！`,
    };
}

export default async function CompletePage({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;

    const room = await (await cookiesClient.models.Room.get({ id: roomId })).data;
    if (!room) {
        notFound();
    }

    const imagePath = room.imagePath;

    return (
        <div className="min-h-screen w-full bg-[#E9E9E9]">
            <CompleteViewer roomId={roomId} imagePath={imagePath} />
        </div>
    );
}
