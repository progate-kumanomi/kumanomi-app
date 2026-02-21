import { cookiesClient } from "@/utils/amplifyServerUtils";
import { notFound } from 'next/navigation';
import Room from "./_components/Room";

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
        title: `ルーム: ${room.name}`,
        description: `${room.name}の編集ルームです。みんなで一緒に編集しましょう！`,
    };
}

export default async function Page({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;

    const room = await (await cookiesClient.models.Room.get({ id: roomId })).data;
    if (!room) {
        notFound();
    }

    const imagePath = room.imagePath;

    return (
        <>
            <Room roomId={roomId} imagePath={imagePath} />
        </>
    );
}
