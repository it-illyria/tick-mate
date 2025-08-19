import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {useAuth} from "@/app/context/auth";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kanban Board</Text>
                {user && (
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{user.username}</Text>
                        <TouchableOpacity onPress={signOut}>
                            <Text style={styles.signOut}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        marginRight: 16,
    },
    signOut: {
        color: 'blue',
    },
    content: {
        flex: 1,
    },
});
