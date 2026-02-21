import { cookiesClient } from "@/utils/amplifyServerUtils";
import { notFound } from 'next/navigation';
import CompleteViewer from "./_components/CompleteViewer";

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
