import { NewRoomForm } from "./_components/NewRoomForm";

export default async function Page() {
    return (
        <div className="min-h-screen w-full bg-linear-to-bl from-[#F7BB97] to-[#DD5E89]">
            <div className="p-5">
                <h1 className="text-3xl text-white font-bold">新しいルームを作成</h1>
                <p className="text-white mt-2">共同で編集可能なルームを作ろう！</p>
                <NewRoomForm />
            </div>
        </div>
    );
}
