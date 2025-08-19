import React, {useState, useEffect, useRef} from 'react';
import {useDrag, useDrop} from 'react-dnd/dist/index';
import TodoCard from './todo-card';
import {ItemTypes} from '@/utils/cons';
import {isDark, combineRefs} from '@/utils/helpers';
import {Board} from "@/models/board";
import {Label} from "@/models/label";
import {Task} from "@/models/task";

interface BoardCardProps {
    board: Board,
    todos: Task[],
    handleDropTodo: (item: any, newBoardId: string) => Promise<void>,
    labels: Label[],
    onBoardDrop: (draggedId: string, droppedId: string) => Promise<void>,
    isDraggable: boolean,
    onAddTodo: (boardId: string, text: string) => Promise<void>,
    onUpdateTodo: (id: string, newFields: Partial<Task>) => Promise<void>,
    onDeleteTodo: (id: string) => Promise<void>,
    onDropTodo?: (todoId: string, newBoardId: string) => Promise<void>,
    onDrag?: () => void,
    isActive?: boolean,
    onMoveBoard?: (draggedId: string, droppedId: string) => Promise<void>
}

const BoardCard: React.FC<BoardCardProps> = ({
                                                 board,
                                                 todos,
                                                 handleDropTodo,
                                                 labels,
                                                 onBoardDrop,
                                                 isDraggable,
                                                 onAddTodo,
                                                 onUpdateTodo,
                                                 onDeleteTodo,
                                                 onDropTodo,
                                                 onDrag,
                                                 isActive,
                                                 onMoveBoard
                                             }) => {
    const currentLabel = labels.find(l => l.id === board.labelId);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isAddingTodo, setIsAddingTodo] = useState(false);
    const [isSavingTask, setIsSavingTask] = useState(false);
    const [newTodoText, setNewTodoText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const [{isDragging}, dragRef] = useDrag(() => ({
        type: ItemTypes.BOARD,
        item: {id: board.id, position: board.position},
        canDrag: isDraggable,
        collect: (monitor: { isDragging: () => any; }) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{isBoardOver}, dropBoardRef] = useDrop(() => ({
        accept: ItemTypes.BOARD,
        drop: (draggedItem: any) => onBoardDrop(draggedItem.id, board.id),
        collect: (monitor: { isOver: () => any; }) => ({
            isBoardOver: !!monitor.isOver(),
        }),
    }), [board, onBoardDrop]);

    const [{isTodoOver, canDropTodo}, dropTodoRef] = useDrop(() => ({
        accept: ItemTypes.TODO,
        drop: (item: any) => handleDropTodo(item, board.id),
        collect: (monitor: { isOver: () => any; canDrop: () => any; }) => ({
            isTodoOver: !!monitor.isOver(),
            canDropTodo: !!monitor.canDrop(),
        }),
    }), [board, handleDropTodo]);

    const combinedRef = combineRefs(cardRef, isDraggable ? dragRef : null, dropBoardRef, dropTodoRef);

    let todoBorderColor = 'border-transparent';
    if (isTodoOver && canDropTodo) {
        todoBorderColor = 'border-blue-400';
    } else if (canDropTodo) {
        todoBorderColor = 'border-gray-300';
    }

    useEffect(() => {
        if (isAddingTodo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddingTodo]);

    const handleSaveNewTodo = async () => {
        const textToAdd = newTodoText.trim();
        if (textToAdd === '') {
            setIsAddingTodo(false);
            return;
        }

        setIsSavingTask(true);

        try {
            await onAddTodo(board.id, textToAdd);
        } catch (e) {
            console.error("Error saving new todo: ", e);
        } finally {
            setNewTodoText('');
            setIsAddingTodo(false);
            setIsSavingTask(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveNewTodo().then();
        }
    };

    return (
        <div
            ref={combinedRef}
            className={`min-h-[250px] w-full md:w-1/3 flex-shrink-0 bg-gray-100 rounded-xl p-4 shadow-inner transition-all duration-200 border-2 ${todoBorderColor} ${isBoardOver ? 'bg-gray-200' : ''}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: isDraggable ? 'grab' : 'default',
            }}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 flex-grow justify-center">
                    {board.type !== 'default' ? (
                        <span
                            className="text-sm font-semibold px-3 py-1 rounded-full"
                            style={{
                                backgroundColor: currentLabel ? currentLabel.color : 'transparent',
                                color: isDark(currentLabel ? currentLabel.color : 'transparent') ? 'white' : 'black'
                            }}
                        >
              {currentLabel ? currentLabel.name : 'Unknown Label'}
            </span>
                    ) : (
                        <h3 className="font-bold text-gray-700 text-lg">{board.name}</h3>
                    )}
                </div>
                {board.id !== 'closed' && (
                    <button
                        onClick={() => setIsAddingTodo(true)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                )}
            </div>
            {isAddingTodo && (
                <div className="mb-4 flex items-center space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="New task..."
                        className="flex-grow p-2 rounded-lg border-2 border-blue-400 focus:outline-none"
                    />
                    <button
                        onClick={handleSaveNewTodo}
                        className="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                    >
                        Add
                    </button>
                </div>
            )}
            {isSavingTask && (
                <p className="text-center text-sm text-gray-500">Saving...</p>
            )}
            <div className="space-y-3">
                {todos.filter(todo => todo.boardId === board.id).map(todo => (
                    <TodoCard
                        key={todo.id}
                        todo={todo}
                        labels={labels}
                        onUpdate={onUpdateTodo}
                        onDelete={onDeleteTodo} onDrop={function (todoId: string, newBoardId: string): void {
                        throw new Error("Function not implemented.");
                    }}/>
                ))}
            </div>
        </div>
    );
};

export default BoardCard;
