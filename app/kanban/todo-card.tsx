import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag } from 'react-dnd/dist/index';
import { ItemTypes } from '@/utils/cons';
import { isDark, combineRefs } from '@/utils/helpers';
import { Label } from "@/models/label";
import { Task } from "@/models/task";

interface TodoCardProps {
    todo: Task;
    onUpdate: (id: string, newFields: Partial<Task>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onDrop: (todoId: string, newBoardId: string) => void;
    labels: Label[];
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onUpdate, onDelete, labels }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(todo.text);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: ItemTypes.TODO,
        item: { id: todo.id, boardId: todo.boardId, ownerId: todo.userId },
        collect: (monitor: { isDragging: () => any; }) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    // Create a callback ref for the drag connector
    const setDragRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            dragRef(node);
        }
    }, [dragRef]);

    // Combine the refs
    const combinedRef = combineRefs(cardRef, setDragRef);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSave = () => {
        if (editedText.trim() === '') {
            onDelete(todo.id);
        } else {
            onUpdate(todo.id, { text: editedText.trim() });
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(todo.id);
        setShowMenu(false);
    };

    const currentLabel = labels.find(l => l.id === todo.labelId);
    const cardBgColor = currentLabel ? currentLabel.color : 'white';
    const cardTextColor = isDark(cardBgColor) ? 'white' : 'black';

    return (
        <div
            ref={combinedRef}
            className={`relative p-3 mb-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                backgroundColor: cardBgColor,
                color: cardTextColor
            }}
        >
            <div className="flex justify-between items-center">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                        autoFocus
                        className="flex-grow p-1 text-sm border-b border-gray-400 focus:outline-none"
                        style={{ backgroundColor: 'transparent', color: cardTextColor }}
                    />
                ) : (
                    <p className="text-sm font-medium">{todo.text}</p>
                )}
                <div ref={menuRef} className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                                <button
                                    onClick={handleEdit}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-xs mt-1" style={{ color: cardTextColor }}>Owner: {todo.userId.slice(0, 8)}...</p>
        </div>
    );
};

export default TodoCard;
