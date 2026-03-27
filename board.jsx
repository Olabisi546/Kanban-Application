function Board({
  board,
  onAddTask,
  onDeleteBoard,
  onRenameBoard,
  onEditTask,
  onDeleteTask,
  onDrop,
  onDragOver,
  onDragStart
}) {
  return (
    <div
      className="board"
      onDrop={(e) => onDrop(e, board.id)}
      onDragOver={onDragOver}
    >
      <h2>{board.title}</h2>

      <button onClick={() => onAddTask(board.id)}>Add Task</button>
      <button onClick={() => onRenameBoard(board.id)}>Rename</button>
      <button onClick={() => onDeleteBoard(board.id)}>Delete</button>

      <TaskList
        tasks={board.tasks}
        boardId={board.id}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onDragStart={onDragStart}
      />
    </div>
  );
}