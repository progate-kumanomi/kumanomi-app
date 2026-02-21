import CompleteViewer from "./_components/CompleteViewer";

export default async function CompletePage({ params }: { params: { roomId: string } }) {
    const { roomId } = await params;
    return (
        <div className="min-h-screen w-full bg-[#E9E9E9]">
            <CompleteViewer roomId={roomId} />
        </div>
    );
}
