import { Board } from '@/models/board';
import { apiService } from './fake-backend';

export const boardService = {
    async getAll(userId: string): Promise<Board[]> {
        return apiService.getBoards(userId);
    },

    async create(board: Omit<Board, 'id'>): Promise<Board> {
        return apiService.addBoard(board);
    },

    async updatePosition(id: string, position: number): Promise<Board> {
        return apiService.updateBoard(id, { position });
    },

    async delete(id: string): Promise<void> {
        return apiService.deleteBoard(id);
    },

    calculateNewPosition(
        boards: Board[],
        draggedId: string,
        droppedId: string
    ): number {
        const allBoards = [...boards].sort((a, b) => a.position - b.position);
        const draggedBoard = allBoards.find(b => b.id === draggedId);
        const droppedBoard = allBoards.find(b => b.id === droppedId);

        if (!draggedBoard || !droppedBoard) return draggedBoard?.position || 0;

        const draggedIndex = allBoards.indexOf(draggedBoard);
        const droppedIndex = allBoards.indexOf(droppedBoard);

        if (draggedIndex < droppedIndex) {
            const nextBoard = allBoards[droppedIndex + 1];
            return nextBoard
                ? (droppedBoard.position + nextBoard.position) / 2
                : droppedBoard.position + 1000;
        } else {
            const prevBoard = allBoards[droppedIndex - 1];
            return prevBoard
                ? (prevBoard.position + droppedBoard.position) / 2
                : droppedBoard.position - 1000;
        }
    }
};
