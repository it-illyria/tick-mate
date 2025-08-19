import { getThemeColor } from '@/hooks/useThemeColor';

export const ItemTypes = {
    TODO: 'todo',
    BOARD: 'board',
} as const;


export type ItemType = typeof ItemTypes[keyof typeof ItemTypes];

export const API_BASE_URL = 'http://localhost:3001';

export const getColors = () => ({
    primary: getThemeColor('primary'),
    secondary: getThemeColor('secondary'),
    accent: getThemeColor('accent'),
    danger: getThemeColor('danger'),
    warning: getThemeColor('warning'),
    success: getThemeColor('success'),
    background: getThemeColor('background'),
    surface: getThemeColor('surface'),
    text: getThemeColor('text'),
    textSecondary: getThemeColor('textSecondary'),
    border: getThemeColor('border'),
});

export const BOARD_COLORS = {
    open: getThemeColor('primary') + '20', // with opacity
    closed: getThemeColor('success') + '20',
    user: getThemeColor('surface'),
};

export const DEFAULT_BOARD_POSITIONS = {
    OPEN: 0,
    CLOSED: 1000000,
    USER_START: 1000,
};

export const STORAGE_KEYS = {
    USER: 'kanban_user',
    THEME: 'kanban_theme',
    SETTINGS: 'kanban_settings',
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    AUTH_FAILED: 'Authentication failed. Please check your credentials.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
    TASK_ADDED: 'Task added successfully.',
    TASK_UPDATED: 'Task updated successfully.',
    TASK_DELETED: 'Task deleted successfully.',
    BOARD_ADDED: 'Board added successfully.',
    BOARD_UPDATED: 'Board updated successfully.',
    BOARD_DELETED: 'Board deleted successfully.',
    LABEL_ADDED: 'Label added successfully.',
    LABEL_DELETED: 'Label deleted successfully.',
};