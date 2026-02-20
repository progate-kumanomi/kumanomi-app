import type { Schema } from "@/amplify/data/resource";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LineBody } from "./useEdits";

/**
 * ペンディング編集を管理するカスタムフック
 */
export function usePendingEdits(edits: Schema["Edit"]["type"][]) {
    const [pendingEdits, setPendingEdits] = useState<
        (LineBody & { tempId: string })[]
    >([]);
    const pendingEditsRef = useRef<Set<string>>(new Set());

    // AppSyncから同期されたアイテムが表示されたら、対応する保留中の編集を削除
    useEffect(() => {
        const confirmedTimestamps = new Set<string>();
        edits.forEach(edit => {
            if (pendingEditsRef.current.has(String(edit.timestamp))) {
                confirmedTimestamps.add(String(edit.timestamp));
            }
        });

        if (confirmedTimestamps.size > 0) {
            confirmedTimestamps.forEach(timestamp => {
                pendingEditsRef.current.delete(timestamp);
            });
            if (pendingEditsRef.current.size === 0) {
                setPendingEdits([]);
            }
        }
    }, [edits]);

    const addPendingEdit = useCallback((line: LineBody): string => {
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        setPendingEdits(prev => [...prev, { ...line, tempId }]);
        return tempId;
    }, []);

    const removePendingEdit = useCallback((tempId: string) => {
        setPendingEdits(prev => prev.filter(edit => edit.tempId !== tempId));
    }, []);

    const markAsConfirmed = useCallback((timestamp: number) => {
        pendingEditsRef.current.add(String(timestamp));
    }, []);

    return {
        pendingEdits,
        addPendingEdit,
        removePendingEdit,
        markAsConfirmed,
    };
}
