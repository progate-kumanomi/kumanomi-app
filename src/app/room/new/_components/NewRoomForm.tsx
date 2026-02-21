"use client";

import TextField from "@/components/TextField";
import { useState } from "react";
import { handleFormSubmit } from "../handleFormSubmit";
import { ImageUploader } from "./ImageUploader";

export function NewRoomForm() {
    const [roomName, setRoomName] = useState("");
    const [imagePath, setImagePath] = useState("");

    return (
        <>
            <form action={handleFormSubmit}>
                <section className="bg-white p-5 rounded-lg shadow-md mt-10">
                    <h2 className="text-2xl font-bold mb-5 text-[#ad3f58]">ルーム情報</h2>

                    <div className="mb-4">
                        <TextField
                            id="roomName"
                            name="roomName"
                            label="ルーム名"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </div>
                    <ImageUploader onImageUploaded={setImagePath} />
                    <input type="hidden" name="imagePath" value={imagePath} />
                </section>
                <button
                    type="submit"
                    className="flex items-center justify-center mt-10 w-full p-5 rounded-xl bg-[linear-gradient(179deg,rgba(236,11,87,1)_49%,rgba(184,4,65,1)_100%)] hover:opacity-90 transition-opacity"
                    aria-label="ルームを作成"
                >
                    <span className="text-white font-bold">ルームを作成</span>
                </button>
            </form>
        </>
    );
}
