import { useState, useEffect, useCallback } from 'react';
import { Board, DEFAULT_BOARDS } from '@/models/board';
import { boardService } from '@/services/boardService';
import { useAuth } from "@/app/context/auth";

export function useBoards() {
    const { user } = useAuth();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBoards = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const userBoards = await boardService.getAll(user.id);
            setBoards([...DEFAULT_BOARDS, ...userBoards]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load boards');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const moveBoard = useCallback(async (draggedId: string, droppedId: string) => {
        if (draggedId === 'open' || draggedId === 'closed' ||
            droppedId === 'open' || droppedId === 'closed') {
            return;
        }

        try {
            const newPosition = boardService.calculateNewPosition(boards, draggedId, droppedId);
            await boardService.updatePosition(draggedId, newPosition);
            await fetchBoards();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to move board');
        }
    }, [boards, fetchBoards]);

    const addBoard = useCallback(async (labelId: string) => {
        if (!user) return;

        try {
            const lastUserBoard = boards
                .filter(b => b.type === 'user')
                .sort((a, b) => b.position - a.position)[0];

            const newPosition = lastUserBoard
                ? lastUserBoard.position + 1000
                : 1000;

            await boardService.create({
                labelId,
                position: newPosition,
                userId: user.id,
                type: 'user'
            });
            await fetchBoards();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add board');
        }
    }, [user, boards, fetchBoards]);

    const deleteBoard = useCallback(async (id: string) => {
        try {
            await boardService.delete(id);
            await fetchBoards();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete board');
        }
    }, [fetchBoards]);

    useEffect(() => {
        fetchBoards().then();
    }, [fetchBoards]);

    return {
        boards,
        loading,
        error,
        moveBoard,
        addBoard,
        deleteBoard,
        refresh: fetchBoards
    };
}
