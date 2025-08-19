export interface Board {
    id: string;
    name?: string;
    position: number;
    userId: string;
    type: 'default' | 'user';
    labelId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const DEFAULT_BOARDS: Board[] = [
    {
        id: 'open',
        name: 'Open',
        position: 0,
        userId: 'system',
        type: 'default'
    },
    {
        id: 'closed',
        name: 'Closed',
        position: 1000000,
        userId: 'system',
        type: 'default'
    }
];
