import { cookiesClient } from "@/utils/amplifyServerUtils";
import Canvas from "./_components/Canvas";
import Header from "./_components/Header";

export default async function Page({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;

    const room = await (await cookiesClient.models.Room.get({ id: roomId })).data;
    if (!room) {
        return <div>ルームが見つかりませんでした</div>;
    }

    const imagePath = room.imagePath;

    return (
        <>
            <Header />
            <Canvas roomId={roomId} imagePath={imagePath} />
        </>
    );
}
