"use client";

import { useState } from "react";
import { handleFormSubmit } from "../handleFormSubmit";
import { ImageUploader } from "./ImageUploader";

export function NewRoomForm() {
    const [imagePath, setImagePath] = useState("");

    return (
        <>
            <form action={handleFormSubmit}>
                <input type="text" name="roomName" placeholder="ルーム名" required />
                <ImageUploader onImageUploaded={setImagePath} />
                <input type="hidden" name="imagePath" value={imagePath} />
                <button type="submit">ルームを作成</button>
            </form>
        </>
    );
}
