import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface LabelManagerProps {
    onAddLabel: (name: string, color: string) => Promise<void>;
}

export function LabelManager({ onAddLabel }: LabelManagerProps) {
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#4CAF50');

    const handleAddLabel = async () => {
        if (newLabelName.trim()) {
            await onAddLabel(newLabelName.trim(), newLabelColor);
            setNewLabelName('');
            setNewLabelColor('#4CAF50');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Labels Management</Text>

            <View style={styles.addLabelContainer}>
                <TextInput
                    style={styles.input}
                    value={newLabelName}
                    onChangeText={setNewLabelName}
                    placeholder="New label name"
                />
                <TouchableOpacity
                    style={[styles.colorPicker, { backgroundColor: newLabelColor }]}
                    onPress={() => {
                        // You would implement a color picker here
                    }}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddLabel}
                >
                    <Text style={styles.addButtonText}>Add Label</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    addLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
    },
    colorPicker: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 4,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});
