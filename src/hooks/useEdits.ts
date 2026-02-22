import type { Schema } from "@/amplify/data/resource";
import { getCreatorId } from "@/utils/identity";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

const client = generateClient<Schema>();

export type Tool = "brush" | "eraser";

export type LineBody = {
    points: number[];
    color: string;
    strokeWidth: number;
    tool?: Tool;
};

export function useEdits(roomId: string | null) {
    const [edits, setEdits] = useState<Schema["Edit"]["type"][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!roomId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        const sub = client.models.Edit.observeQuery({
            filter: { roomId: { eq: roomId } },
        }).subscribe({
            next: ({ items }) => {
                const sortedItems = [...items].sort((a, b) => a.timestamp - b.timestamp);
                setEdits(sortedItems);
                setIsLoading(false);
            },
            error: (err) => {
                console.error("Error observing edits:", err);
                setError(err instanceof Error ? err : new Error(String(err)));
                setIsLoading(false);
            },
        });

        return () => {
            sub.unsubscribe();
        };
    }, [roomId]);

    return { edits, isLoading, error };
}

export async function createEdit(
    roomId: string,
    body: LineBody
): Promise<Schema["Edit"]["type"]> {
    const timestamp = Date.now();
    const creatorId = await getCreatorId();

    try {
        const result = await client.models.Edit.create({
            roomId,
            timestamp,
            type: "line",
            body: JSON.stringify(body),
            creatorId,
        });

        if (result.errors && result.errors.length > 0) {
            throw new Error(`Failed to create edit: ${result.errors[0]}`);
        }

        if (!result.data) {
            throw new Error("No data returned from create operation");
        }

        return result.data;
    } catch (error) {
        console.error("Failed to create edit:", error);
        throw error;
    }
}

export function parseEditBody(edit: Schema["Edit"]["type"]): LineBody | null {
    try {
        if (typeof edit.body !== "string") {
            console.error("Edit body is not a string:", edit.body);
            return null;
        }
        return JSON.parse(edit.body) as LineBody;
    } catch (error) {
        console.error("Failed to parse edit body:", error);
        return null;
    }
}
