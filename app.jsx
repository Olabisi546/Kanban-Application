const { useState, useEffect } = React;

function App() {
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem("kanbanData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("kanbanData", JSON.stringify(boards));
  }, [boards]);
const statusCounts = getStatusCounts(boards);

  /* ---- BOARD FUNCTIONS ---- */
  function addBoard() {
    const title = prompt("Enter board name:");
    if (!title) return;

    const newBoard = {
      id: Date.now().toString(),
      title,
      tasks: []
    };

    setBoards([...boards, newBoard]);
  }

  function renameBoard(boardId) {
    const newTitle = prompt("New board name:");
    if (!newTitle) return;

    setBoards(boards.map(b =>
      b.id === boardId ? { ...b, title: newTitle } : b
    ));
  }

  function deleteBoard(id) {
    setBoards(boards.filter(b => b.id !== id));
  }
  const [showTaskModal, setShowTaskModal] = useState(false);
const [editingTask, setEditingTask] = useState(null);
const [currentBoardId, setCurrentBoardId] = useState(null);

const [taskForm, setTaskForm] = useState({
  title: "",
  description: "",
  dueDate: ""
});

  /* ---- TASK FUNCTIONS ---- */
  function addTask(boardId) {
  setEditingTask(null);
  setCurrentBoardId(boardId);

  setTaskForm({
    title: "",
    description: "",
    dueDate: ""
  });

  setShowTaskModal(true);
}

  function editTask(boardId, taskId) {
  const board = boards.find(b => b.id === boardId);
  const task = board.tasks.find(t => t.id === taskId);

  setEditingTask(task);
  setCurrentBoardId(boardId);

  setTaskForm({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || ""
  });

  setShowTaskModal(true);
}
function saveTask() {
  if (!taskForm.title.trim()) return;

  if (editingTask) {
    setBoards(boards.map(board => {
      if (board.id !== currentBoardId) return board;

      return {
        ...board,
        tasks: board.tasks.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                title: taskForm.title,
                description: taskForm.description,
                dueDate: taskForm.dueDate
              }
            : task
        )
      };
    }));
  } else {
    const newTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate,
      createdAt: new Date().toLocaleDateString()
    };

    setBoards(boards.map(board =>
      board.id === currentBoardId
        ? { ...board, tasks: [...board.tasks, newTask] }
        : board
    ));
  }

  setShowTaskModal(false);
}

  function deleteTask(boardId, taskId) {
    setBoards(boards.map(board =>
      board.id === boardId
        ? { ...board, tasks: board.tasks.filter(t => t.id !== taskId) }
        : board
    ));
  }

  /* ---- DRAG & DROP ---- */
  function handleDragStart(e, taskId, boardId) {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceBoardId", boardId);
  }

  function handleDrop(e, targetBoardId, targetIndex) {
  e.preventDefault();

  const taskId = e.dataTransfer.getData("taskId");
  const sourceBoardId = e.dataTransfer.getData("sourceBoardId");

  let movedTask = null;

  // Find the task
  boards.forEach(board => {
    if (board.id === sourceBoardId) {
      movedTask = board.tasks.find(t => t.id === taskId);
    }
  });

  if (!movedTask) return;

  const newBoards = boards.map(board => {
    // Remove from source board
    if (board.id === sourceBoardId) {
      return {
        ...board,
        tasks: board.tasks.filter(t => t.id !== taskId)
      };
    }

    return board;
  }).map(board => {
    // Insert into target board at specific index
    if (board.id === targetBoardId) {
      const newTasks = [...board.tasks];
      newTasks.splice(targetIndex, 0, movedTask);
      return { ...board, tasks: newTasks };
    }

    return board;
  });

  setBoards(newBoards);
}



  function allowDrop(e) {
    e.preventDefault();
  }

function getStatusCounts(boards) {
  const counts = {
    overdue: 0,
    dueSoon: 0,
    onTrack: 0,
    noDate: 0
  };

  boards.forEach(board => {
    board.tasks.forEach(task => {
      if (!task.dueDate) {
        counts.noDate++;
        return;
      }

      const now = new Date();
      const due = new Date(task.dueDate);
      const diff = (due - now) / (1000 * 60 * 60 * 24);

      if (diff < 0) counts.overdue++;
      else if (diff <= 2) counts.dueSoon++;
      else counts.onTrack++;
    });
  });

  return counts;
}

  /* ---- COUNTERS ---- */
  const totalTasks = boards.reduce((sum, b) => sum + b.tasks.length, 0);

  return (
    <div>
      <Header
        boardsCount={boards.length}
        tasksCount={totalTasks}
        onAddBoard={addBoard}
        statusCounts={statusCounts}
      />

      <div className="board-container">
        {boards.map(board => (
          <Board
            key={board.id}
            board={board}
            onAddTask={addTask}
            onDeleteBoard={deleteBoard}
            onRenameBoard={renameBoard}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragStart={handleDragStart}
          />
        ))}
        {showTaskModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>

      <input
        type="text"
        placeholder="Task Title"
        value={taskForm.title}
        onChange={(e) =>
          setTaskForm({ ...taskForm, title: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        value={taskForm.description}
        onChange={(e) =>
          setTaskForm({ ...taskForm, description: e.target.value })
        }
      />

      <input
        type="date"
        value={taskForm.dueDate}
        onChange={(e) =>
          setTaskForm({ ...taskForm, dueDate: e.target.value })
        }
      />

      <div className="modal-buttons">
        <button onClick={saveTask}>
          {editingTask ? "Save Changes" : "Add Task"}
        </button>

        <button onClick={() => setShowTaskModal(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
