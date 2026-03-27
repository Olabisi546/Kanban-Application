function TaskList({ tasks, boardId, onEdit, onDelete, onDragStart, onDrop, onDragOver }) {
  return (
    <div>
      {tasks.map((task, index) => (
        <div key={task.id}>
          {/* Drop zone BEFORE task */}
          <div
            className="drop-zone"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, boardId, index)}
          />

          <Task
            task={task}
            boardId={boardId}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        </div>
      ))}

      {/* Drop zone AFTER last task */}
      <div
        className="drop-zone"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, boardId, tasks.length)}
      />
    </div>
  );
}
