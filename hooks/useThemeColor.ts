import { useColorScheme } from './useColorScheme';

export interface ThemeColors {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    success: string;
    warning: string;
    border: string;
    shadow: string;
}

const lightColors: ThemeColors = {
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#FF9800',
    danger: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    border: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors: ThemeColors = {
    background: '#121212',
    surface: '#1e1e1e',
    text: '#e9ecef',
    textSecondary: '#adb5bd',
    primary: '#66BB6A',
    secondary: '#42A5F5',
    accent: '#FFA726',
    danger: '#EF5350',
    success: '#66BB6A',
    warning: '#FFCA28',
    border: '#343a40',
    shadow: 'rgba(0, 0, 0, 0.3)',
};

export function useThemeColor() {
    const { colorScheme } = useColorScheme();

    const colors = colorScheme === 'dark' ? darkColors : lightColors;

    return {
        colors,
        colorScheme,
        isDark: colorScheme === 'dark',
        isLight: colorScheme === 'light',
    };
}

// Helper function to get specific color
export function getThemeColor(colorKey: keyof ThemeColors, colorScheme?: 'light' | 'dark') {
    const scheme = colorScheme || (useColorScheme().colorScheme ?? 'light');
    return scheme === 'dark' ? darkColors[colorKey] : lightColors[colorKey];
}
