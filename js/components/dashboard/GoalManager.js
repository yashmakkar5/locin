/**
 * Goal Management Component (3-Tier Hierarchy: Goal -> Task -> Subtask)
 */

const { useState } = React;

window.GoalManager = function() {
  const { goals, addGoal, deleteGoal, addTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask } = window.useGoals();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Technology');

  const [taskModalGoalId, setTaskModalGoalId] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');

  const [subtaskModalInfo, setSubtaskModalInfo] = useState(null); // { goalId, taskId }
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal(goalTitle, goalCategory);
    setGoalTitle('');
    setIsGoalModalOpen(false);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskModalGoalId) return;
    addTask(taskModalGoalId, taskTitle);
    setTaskTitle('');
    setTaskModalGoalId(null);
  };

  const handleCreateSubtask = (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || !subtaskModalInfo) return;
    addSubtask(subtaskModalInfo.goalId, subtaskModalInfo.taskId, subtaskTitle);
    setSubtaskTitle('');
    setSubtaskModalInfo(null);
  };

  return (
    <div>
      <div className="goals-header">
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Goal Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Structure your ambitions into 3-tier actionable trees: 🎯 Goal → 📌 Task → 🔹 Subtasks
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsGoalModalOpen(true)}
        >
          <i data-lucide="plus" style={{ width: 18, height: 18 }}></i>
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No goals created yet. Click "Create New Goal" to start tracking!</p>
        </div>
      ) : (
        goals.map(goal => {
          // Calculate goal completion %
          let subtaskCount = 0;
          let doneSubtasks = 0;
          goal.tasks.forEach(t => {
            t.subtasks.forEach(st => {
              subtaskCount++;
              if (st.completed) doneSubtasks++;
            });
          });
          const goalPct = subtaskCount > 0 ? Math.round((doneSubtasks / subtaskCount) * 100) : 0;

          return (
            <div key={goal.id} className="glass-card goal-card">
              {/* Level 1: Goal Header */}
              <div className="goal-top">
                <div className="goal-title-group">
                  <span className="badge badge-primary">{goal.category}</span>
                  <h2 style={{ fontSize: '1.4rem' }}>🎯 {goal.title}</h2>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setTaskModalGoalId(goal.id)}
                  >
                    + Add Task
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteGoal(goal.id)}
                    title="Delete Goal"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Goal Progress</span>
                <span>{goalPct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${goalPct}%` }}></div>
              </div>

              {/* Level 2: Tasks Tree */}
              <div className="task-tree">
                {goal.tasks.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                    No tasks added yet under this goal. Click "+ Add Task" above.
                  </div>
                ) : (
                  goal.tasks.map(task => (
                    <div key={task.id} className="task-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                          📌 {task.title}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => setSubtaskModalInfo({ goalId: goal.id, taskId: task.id })}
                          >
                            + Subtask
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => deleteTask(goal.id, task.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Level 3: Subtasks Tree */}
                      <div className="subtask-tree">
                        {task.subtasks.length === 0 ? (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                            No subtasks. Add subtasks to track daily completion.
                          </div>
                        ) : (
                          task.subtasks.map(subtask => (
                            <div key={subtask.id} className="subtask-item">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div 
                                  className={`custom-checkbox ${subtask.completed ? 'checked' : ''}`}
                                  onClick={() => toggleSubtask(goal.id, task.id, subtask.id)}
                                >
                                  {subtask.completed && '✓'}
                                </div>
                                <span style={{ 
                                  textDecoration: subtask.completed ? 'line-through' : 'none',
                                  color: subtask.completed ? 'var(--text-subtle)' : 'var(--text-main)'
                                }}>
                                  🔹 {subtask.title}
                                </span>
                              </div>

                              <button 
                                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', fontSize: '0.8rem' }}
                                onClick={() => deleteSubtask(goal.id, task.id, subtask.id)}
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Modal 1: Create Goal */}
      <window.Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Create New Overarching Goal"
      >
        <form onSubmit={handleCreateGoal}>
          <div className="form-group">
            <label>Goal Title</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Learn AI & Machine Learning"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              className="form-input"
              value={goalCategory}
              onChange={(e) => setGoalCategory(e.target.value)}
            >
              <option value="Technology">Technology & Coding</option>
              <option value="Academics">Academics & CSE</option>
              <option value="Health">Health & Fitness</option>
              <option value="Personal">Personal Growth</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
            Save Goal
          </button>
        </form>
      </window.Modal>

      {/* Modal 2: Add Task */}
      <window.Modal
        isOpen={!!taskModalGoalId}
        onClose={() => setTaskModalGoalId(null)}
        title="Add Task under Goal"
      >
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Python Basics"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
            Add Task
          </button>
        </form>
      </window.Modal>

      {/* Modal 3: Add Subtask */}
      <window.Modal
        isOpen={!!subtaskModalInfo}
        onClose={() => setSubtaskModalInfo(null)}
        title="Add Subtask under Task"
      >
        <form onSubmit={handleCreateSubtask}>
          <div className="form-group">
            <label>Subtask Title</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Variables & Data Types"
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
            Add Subtask
          </button>
        </form>
      </window.Modal>
    </div>
  );
};
