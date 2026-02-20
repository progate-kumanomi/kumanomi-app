import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { getUrl } from 'aws-amplify/storage';
import Canvas from "./_components/Canvas";
import Header from "./_components/Header";

const client = generateClient<Schema>()

export default async function Page({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;

    const room = await (await client.models.Room.get({ id: roomId })).data;
    if (!room) {
        return <div>ルームが見つかりませんでした</div>;
    }

    const imagePath = room.imagePath;
    const imageUrl = await getUrl({
        path: imagePath,
        options: {
            expiresIn: 60 * 60 * 1, // URLの有効期限（秒）
        },
    }).then(result => result.url.toString());


    return (
        <>
            <Header />
            <Canvas roomId={roomId} imageUrl={imageUrl} />
        </>
    );
}
