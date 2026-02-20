import CompleteButton from "./CompleteButton";
import ShareButton from "./ShareButton";

export default function Header() {

    return (
        <header className="w-full h-18 flex items-center justify-between px-5 bg-[#0000001a]">
            <ShareButton />
            <CompleteButton />
        </header>
    );
}
