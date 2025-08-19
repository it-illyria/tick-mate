import { Ref } from 'react';
import {ItemType} from "@/utils/cons";

export interface DragItem {
    id: string;
    type: ItemType;
    boardId?: string;
    index?: number;
}

export const getDragLayerStyle = (isDragging: boolean, isOver: boolean) => {
    return {
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? [{ scale: 0.95 }] : [{ scale: 1 }],
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
        border: isOver ? '2px dashed #2196F3' : 'none',
    };
};

export const canDropBoard = (draggedBoardId: string, targetBoardId: string): boolean => {
    const fixedBoards = ['open', 'closed'];
    return !fixedBoards.includes(draggedBoardId) && !fixedBoards.includes(targetBoardId);
};

export const canDropTodo = (sourceBoardId: string, targetBoardId: string): boolean => {
    return sourceBoardId !== targetBoardId;
};

export const calculateDropPosition = (
    items: Array<{ position: number }>,
    draggedIndex: number,
    droppedIndex: number
): number => {
    if (items.length === 0) return 1000;

    if (droppedIndex === 0) {
        return items[0].position - 1000;
    }

    if (droppedIndex >= items.length) {
        return items[items.length - 1].position + 1000;
    }

    const prevItem = items[droppedIndex - 1];
    const nextItem = items[droppedIndex];

    return (prevItem.position + nextItem.position) / 2;
};
