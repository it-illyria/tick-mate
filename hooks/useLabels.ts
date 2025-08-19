import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/models/label';
import { labelService } from '@/services/labelService';
import {useAuth} from "@/app/context/auth";

export function useLabels() {
    const { user } = useAuth();
    const [labels, setLabels] = useState<Label[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLabels = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const labelsData = await labelService.getAll(user.id);
            setLabels(labelsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load labels');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addLabel = useCallback(async (name: string, color: string) => {
        if (!user) return;

        try {
            await labelService.create({
                name,
                color,
                userId: user.id
            });
            await fetchLabels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add label');
        }
    }, [user, fetchLabels]);

    const deleteLabel = useCallback(async (id: string) => {
        try {
            await labelService.delete(id);
            await fetchLabels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete label');
        }
    }, [fetchLabels]);

    useEffect(() => {
        fetchLabels();
    }, [fetchLabels]);

    return {
        labels,
        loading,
        error,
        addLabel,
        deleteLabel,
        refresh: fetchLabels
    };
}
