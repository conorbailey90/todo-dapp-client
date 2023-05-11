import { useRef } from "react";
import './TaskForm.css'
const TaskForm = ({addTask}) => {

    const taskInput = useRef()

    const submitHandler = (e) => {
        e.preventDefault();
        const taskText = taskInput.current.value;
        if(taskText.trim() === ''){
            alert('Please enter task text.');
            return
        }
        addTask(taskText, false);
        taskInput.current.value = '';
    }
    return (
        <div className="task__form">
            <form>
                <label>Enter task: </label><br/>
                <input className="text__input" ref={taskInput} type="text" placeholder="Enter Task"/>
                <input className="submit__btn" type="submit" onClick={submitHandler} name="" id="" />

            </form>
        </div>
    )
}

export default TaskForm;