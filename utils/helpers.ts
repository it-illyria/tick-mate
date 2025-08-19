import {Board} from '@/models/board';
import {Task} from '@/models/task';
import {Label} from '@/models/label';
import React, {Ref, RefCallback} from "react";

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: number;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export const throttle = <T extends (...args: any[]) => void>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

export const sortBoardsByPosition = (boards: Board[]): Board[] => {
    return [...boards].sort((a, b) => a.position - b.position);
};

export const filterTasksByBoard = (tasks: Task[], boardId: string): Task[] => {
    return tasks.filter(task => task.boardId === boardId);
};

export const getLabelColor = (labels: Label[], labelId?: string): string => {
    if (!labelId) return '#ffffff';
    const label = labels.find(l => l.id === labelId);
    return label?.color || '#ffffff';
};

export const getContrastColor = (hexColor: string): string => {
    return isDark(hexColor) ? '#ffffff' : '#000000';
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
};


export const isDark = (hexColor: string): boolean => {
    if (!hexColor || hexColor === 'transparent') return false;

    const c = hexColor.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luma < 128;
};

export const combineRefs = <T extends HTMLElement>(
    ...refs: Array<Ref<T> | RefCallback<T> | undefined | null>
): RefCallback<T> => {
    return (node: T) => {
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                if ('current' in ref) {
                    (ref as React.MutableRefObject<T | null>).current = node;
                }
            }
        });
    };
};

