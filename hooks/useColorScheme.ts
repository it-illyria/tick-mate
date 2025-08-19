import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
    const colorScheme = useRNColorScheme();

    return {
        colorScheme,
        isDark: colorScheme === 'dark',
        isLight: colorScheme === 'light',
    };
}
