import { Task } from '@/models/task';
import { apiService } from './fake-backend';

export const todoService = {
    async getAll(userId: string): Promise<Task[]> {
        return apiService.getTasks(userId);
    },

    async create(task: Omit<Task, 'id'>): Promise<Task> {
        return apiService.addTask(task);
    },

    async update(id: string, updates: Partial<Task>): Promise<Task> {
        return apiService.updateTask(id, updates);
    },

    async delete(id: string): Promise<void> {
        return apiService.deleteTask(id);
    },

    async move(taskId: string, newBoardId: string): Promise<Task> {
        return apiService.updateTask(taskId, { boardId: newBoardId });
    }
};
