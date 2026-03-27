function Task({ task, boardId, onEdit, onDelete, onDragStart }) {
  function getStatus(dueDate) {
    if (!dueDate) return "No Due Date";

    const now = new Date();
    const due = new Date(dueDate);

    if (due < now) return "Overdue";

    const diff = (due - now) / (1000 * 60 * 60 * 24);
    if (diff < 2) return "Due Soon";

    return "On Track";
  }

  return (
    <div
      className="task"
      draggable
      onDragStart={(e) => onDragStart(e, task.id, boardId)}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p><b>Created:</b> {task.createdAt}</p>
      <p><b>Due:</b> {task.dueDate}</p>
      <p>Status: {getStatus(task.dueDate)}</p>

      <button onClick={() => onEdit(boardId, task.id)}>Edit</button>
      <button onClick={() => onDelete(boardId, task.id)}>Delete</button>
    </div>
  );
}