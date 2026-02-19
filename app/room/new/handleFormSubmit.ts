"use server";

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { redirect } from "next/navigation";


const client = generateClient<Schema>()

export async function handleFormSubmit(formData: FormData) {
    const roomName = formData.get("roomName") as string;
    const imagePath = formData.get("imagePath") as string;

    if (!roomName) {
        throw new Error("ルーム名は必須です");
    }
    if (!imagePath) {
        throw new Error("画像パスは必須です");
    }

    const result = await client.models.Room.create({
        name: roomName,
        imagePath: imagePath,
    });

    if (!result || !result.data) {
        throw new Error("ルームの作成に失敗しました");
    }

    redirect(`/room/${result.data.id}`);
}
