import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {router} from 'expo-router';

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.message}>The page you are looking for does not exist.</Text>
            <Button title="Go to Sign In" onPress={() => router.replace('./signing')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
    title: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
    message: {fontSize: 16, marginBottom: 20},
});
