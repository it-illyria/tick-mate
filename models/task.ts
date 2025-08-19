export interface Task {
    id: string;
    text: string;
    boardId: string;
    completed: boolean;
    userId: string;
    labelId?: string;
    createdAt?: string;
    updatedAt?: string;
}
