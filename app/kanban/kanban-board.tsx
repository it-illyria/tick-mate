import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import BoardCard from './board-card';
import { LabelManager } from './label-manager';
import { useBoards } from '@/hooks/useBoards';
import { useTodos } from '@/hooks/useTodos';
import { useLabels } from '@/hooks/useLabels';
import { Board } from '@/models/board';

export function KanbanBoard() {
    const { boards, moveBoard, addBoard, loading, error } = useBoards();
    const { todos, moveTodo, addTodo, updateTodo, deleteTodo } = useTodos();
    const { labels, addLabel } = useLabels();

    const [showAddBoardModal, setShowAddBoardModal] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const handleBoardReorder = async ({ data }: { data: Board[] }) => {
        const userBoards = data.filter(b => b.type === 'user');

        for (let i = 0; i < userBoards.length; i++) {
            const board = userBoards[i];
            const newPosition = i * 1000;
            if (board.position !== newPosition) {
                await moveBoard(board.id, board.id);
            }
        }
    };

    const handleAddNewBoard = async () => {
        if (newBoardName.trim()) {
            await addBoard(newBoardName.trim());
            setNewBoardName('');
            setShowAddBoardModal(false);
        }
    };

    const userBoards = boards.filter(b => b.type === 'user');
    const defaultBoards = boards.filter(b => b.type === 'default');

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading boards...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LabelManager onAddLabel={addLabel} />

            <TouchableOpacity
                style={styles.addBoardButton}
                onPress={() => setShowAddBoardModal(true)}
            >
                <Text style={styles.addBoardButtonText}>+ Add New Board</Text>
            </TouchableOpacity>

            <ScrollView
                horizontal
                style={styles.boardsContainer}
                showsHorizontalScrollIndicator={false}
            >
                {/* Default boards (non-draggable) */}
                {defaultBoards.map(board => (
                    <BoardCard
                        key={board.id}
                        board={board}
                        todos={todos.filter(t => t.boardId === board.id)}
                        onDropTodo={moveTodo}
                        onAddTodo={addTodo}
                        onUpdateTodo={updateTodo}
                        onDeleteTodo={deleteTodo}
                        labels={labels}
                        isDraggable={false}
                        onMoveBoard={async () => {
                        }} // noop
                        handleDropTodo={function (item: any, newBoardId: string): Promise<void> {
                            throw new Error("Function not implemented.");
                        }} onBoardDrop={function (draggedId: string, droppedId: string): Promise<void> {
                        throw new Error("Function not implemented.");
                    }}                    />
                ))}

                {/* User boards (draggable) */}
                <DraggableFlatList
                    horizontal
                    data={userBoards}
                    keyExtractor={(item) => item.id}
                    onDragEnd={handleBoardReorder}
                    renderItem={({ item: board, drag, isActive }) => (
                        <BoardCard
                            board={board}
                            todos={todos.filter(t => t.boardId === board.id)}
                            onDropTodo={moveTodo}
                            onAddTodo={addTodo}
                            onUpdateTodo={updateTodo}
                            onDeleteTodo={deleteTodo}
                            labels={labels}
                            isDraggable={true}
                            onDrag={drag}
                            isActive={isActive}
                            onMoveBoard={moveBoard}
                            handleDropTodo={function (item: any, newBoardId: string): Promise<void> {
                                throw new Error("Function not implemented.");
                            }} onBoardDrop={function (draggedId: string, droppedId: string): Promise<void> {
                            throw new Error("Function not implemented.");
                        }}                        />
                    )}
                    contentContainerStyle={styles.boardsContent}
                />
            </ScrollView>

            <Modal
                visible={showAddBoardModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddBoardModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Board</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newBoardName}
                            onChangeText={setNewBoardName}
                            placeholder="Board name"
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setShowAddBoardModal(false)} />
                            <Button title="Add Board" onPress={handleAddNewBoard} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: 'red', textAlign: 'center' },
    boardsContainer: { flex: 1, marginTop: 16 },
    boardsContent: { paddingHorizontal: 8 },
    addBoardButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
    addBoardButtonText: { color: 'white', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 16 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
});
