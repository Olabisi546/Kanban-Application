function Header({ boardsCount, tasksCount, onAddBoard, statusCounts }) {
  return (
    <div className="header">
      <button onClick={onAddBoard}>Add Board</button>
      <p>Boards: {boardsCount} | Tasks: {tasksCount}</p>
      <p>
        Overdue: {statusCounts.overdue} | 
        Due Soon: {statusCounts.dueSoon} | 
        On Track: {statusCounts.onTrack} | 
        No Due Date: {statusCounts.noDate}
      </p>
    </div>
  );
}