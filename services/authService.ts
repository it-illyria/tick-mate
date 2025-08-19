import { User } from '@/models/user';
import { apiService } from './fake-backend';

export const authService = {
    async signUp(username: string, password: string): Promise<User> {
        return apiService.signUp({ username, password });
    },

    async signIn(username: string, password: string): Promise<User | undefined> {
        return apiService.signIn({ username, password });
    }
};
