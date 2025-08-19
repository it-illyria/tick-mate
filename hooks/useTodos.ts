import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/models/task';
import { todoService } from '@/services/todoService';
import {useAuth} from "@/app/context/auth";

export function useTodos() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const todosData = await todoService.getAll(user.id);
            setTodos(todosData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load todos');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addTodo = useCallback(async (boardId: string, text: string) => {
        if (!user) return;

        try {
            await todoService.create({
                text,
                boardId,
                userId: user.id,
                completed: false
            });
            await fetchTodos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add todo');
        }
    }, [user, fetchTodos]);

    const updateTodo = useCallback(async (id: string, updates: Partial<Task>) => {
        try {
            await todoService.update(id, updates);
            await fetchTodos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update todo');
        }
    }, [fetchTodos]);

    const deleteTodo = useCallback(async (id: string) => {
        try {
            await todoService.delete(id);
            await fetchTodos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete todo');
        }
    }, [fetchTodos]);

    const moveTodo = useCallback(async (todoId: string, newBoardId: string) => {
        try {
            await todoService.move(todoId, newBoardId);
            await fetchTodos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to move todo');
        }
    }, [fetchTodos]);

    useEffect(() => {
        fetchTodos().then();
    }, [fetchTodos]);

    return {
        todos,
        loading,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        moveTodo,
        refresh: fetchTodos
    };
}
