import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {useAuth} from "@/app/context/auth";

export function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        try {
            await signUp(username, password);
            router.replace('./todos');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button
                title="Already have an account? Sign In"
                onPress={() => router.push('./signing')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, marginBottom: 10, padding: 10 },
    error: { color: 'red', marginBottom: 10 },
});
