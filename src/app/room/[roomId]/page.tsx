import { cookiesClient } from "@/utils/amplifyServerUtils";
import { notFound } from 'next/navigation';
import Room from "./_components/Room";

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
