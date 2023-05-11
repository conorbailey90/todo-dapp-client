import Task from "./Task";
import './TaskContainer.css'
const TaskContainer = ({tasks, deleteTask}) => {
    return (
        <div className="task__container">
            <h2 style={{marginBottom: '1rem'}}>Tasks</h2>
            {tasks.length > 0 ? 
            tasks.map(task => (
                <Task key={task.id} taskId={task.id} taskText={task.taskText} deleteTask={deleteTask} />
            ))
            : 
            (
                <div style={{padding: '1rem 0'}}>
                    <h3 >No live tasks found. Add a new task using the above form.</h3>
                </div>
            )}
        </div>
    )
}


export default TaskContainer;