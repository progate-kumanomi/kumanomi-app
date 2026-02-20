"use client";

export default function CompleteButton() {
    const handleClick = () => {
        alert("完成");
    };

    return (
        <button
            onClick={handleClick}
            className="h-10 px-5 shadow-[0px_4px_4px_#00000040] bg-[linear-gradient(73deg,rgba(220,94,136,1)_0%,rgba(232,135,143,1)_50%,rgba(242,171,148,1)_100%)] inline-flex items-center justify-center rounded-[10px] cursor-pointer transition-transform active:scale-95 hover:shadow-[0px_6px_8px_#00000050]"
            aria-label="完成"
        >
            <span className="font-semibold text-white text-base whitespace-nowrap">
                完成！
            </span>
        </button>
    );
}
