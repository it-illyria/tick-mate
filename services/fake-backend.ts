import {Label} from "@/models/label";
import {Task} from "react-native";
import {Board} from "@/models/board";

const API_BASE_URL = 'http://localhost:3001';

export const apiService = {
    // Users
    signUp: async (user: { username: string; password: string }) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    signIn: async (credentials: { username: string; password: string }) => {
        const response = await fetch(`${API_BASE_URL}/users?username=${credentials.username}&password=${credentials.password}`);
        const users = await response.json();
        return users[0];
    },

    // Boards
    getBoards: async (userId?: string) => {
        const url = userId ? `${API_BASE_URL}/boards?userId=${userId}` : `${API_BASE_URL}/boards`;
        const response = await fetch(url);
        return response.json();
    },

    addBoard: async (board: Omit<Board, 'id'>) => {
        const response = await fetch(`${API_BASE_URL}/boards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(board),
        });
        return response.json();
    },

    updateBoard: async (id: string, updates: Partial<Board>) => {
        const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        return response.json();
    },

    deleteBoard: async (id: string) => {
        await fetch(`${API_BASE_URL}/boards/${id}`, { method: 'DELETE' });
    },

    // Tasks
    getTasks: async (userId?: string) => {
        const url = userId ? `${API_BASE_URL}/tasks?userId=${userId}` : `${API_BASE_URL}/tasks`;
        const response = await fetch(url);
        return response.json();
    },

    addTask: async (task: Omit<Task, 'id'>) => {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        return response.json();
    },

    updateTask: async (id: string, updates: Partial<Task>) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        return response.json();
    },

    deleteTask: async (id: string) => {
        await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' });
    },

    // Labels
    getLabels: async (userId?: string) => {
        const url = userId ? `${API_BASE_URL}/labels?userId=${userId}` : `${API_BASE_URL}/labels`;
        const response = await fetch(url);
        return response.json();
    },

    addLabel: async (label: Omit<Label, 'id'>) => {
        const response = await fetch(`${API_BASE_URL}/labels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(label),
        });
        return response.json();
    },

    deleteLabel: async (id: string) => {
        await fetch(`${API_BASE_URL}/labels/${id}`, { method: 'DELETE' });
    },
};
