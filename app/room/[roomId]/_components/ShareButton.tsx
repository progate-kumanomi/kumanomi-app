"use client";

export default function ShareButton() {
    const handleClick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Kumanomi',
                text: 'Kumanomiのルームを共有しました',
                url: window.location.href,
            }).catch((error) => {
                console.error('共有に失敗しました:', error);
            });
        }
    };

    return (
        <button
            onClick={handleClick}
            className="h-10 px-4 bg-white shadow-[0px_1px_4px_#00000040] inline-flex items-center justify-center rounded-[10px] cursor-pointer transition-transform active:scale-95 hover:shadow-[0px_2px_6px_#00000040]"
            aria-label="招待URLを共有"
        >
            <span className="font-medium text-[#f84175] text-sm whitespace-nowrap">
                招待URLを共有
            </span>
        </button>
    );
}
