import { Label } from '@/models/label';
import { apiService } from './fake-backend';

export const labelService = {
    async getAll(userId: string): Promise<Label[]> {
        return apiService.getLabels(userId);
    },

    async create(label: Omit<Label, 'id'>): Promise<Label> {
        return apiService.addLabel(label);
    },

    async delete(id: string): Promise<void> {
        return apiService.deleteLabel(id);
    }
};
