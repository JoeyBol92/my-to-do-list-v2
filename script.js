// Gather data from form
const todoForm = document.getElementById("todo-form");
const taskTitle = document.getElementById("todo-input");
const taskLabel = document.getElementById("label-input");
const labelColor = document.getElementById("color-input");
const toDoList = document.querySelector(".todo-list");
const deleteList = document.getElementById("clearAll");

// Array to store tasks in
const taskData = JSON.parse(localStorage.getItem("data")) || [];
console.log(taskData);

// Function to add task
const addTask = () => {
  if (taskTitle.value === "") {
    alert("Please enter a task");
    return;
  }
  if (taskLabel.value === "") {
    alert("Please enter a label");
    return;
  }

  // Create task object
  const taskObj = {
    id: `${taskTitle.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: taskTitle.value,
    label: taskLabel.value,
    labelColor: labelColor.value,
    done: false,
  };

  console.log(taskObj);

  taskData.unshift(taskObj);
  localStorage.setItem("data", JSON.stringify(taskData));
  renderToDoList();
  reset();
};

// Function to render tasks
const renderToDoList = () => {
  toDoList.innerHTML = "";

  taskData.forEach(({ id, title, label, labelColor, done }) => {
    toDoList.innerHTML += `
        <li class="${done ? "done" : ""}">
            <input type="checkbox" class="checkTodoItem" ${
              done ? "checked" : ""
            }/> <span class="task">${title}</span><span class="label" style="background-color:${labelColor}">${label}</span> <button class="deleteTodoItem" onclick="deleteTask(this)">X</button>
        </li>    
            `;
  });
  markDone();
};

// Function to reset inputs after submitting task
const reset = () => {
  taskTitle.value = "";
  taskLabel.value = "";
  labelColor.value = "#19d28b";
};

// Function to mark task done
// const markDone = () => {
//   const todoItems = document.querySelectorAll("li");
//   console.log(todoItems);
//   todoItems.forEach((item, index) => {
//     const checkbox = item.querySelector("input[type=checkbox]");
//     checkbox.addEventListener("change", (e) => {
//       taskData[index].done = e.target.checked;
//       localStorage.setItem("data", JSON.stringify(taskData));
//       if (e.target.checked) {
//         item.classList.add("done");
//       } else {
//         item.classList.remove("done");
//       }
//     });
//   });
// };

const markDone = () => {
  const todoItems = document.querySelectorAll("li");
  console.log(todoItems);
  todoItems.forEach((item, index) => {
    const checkbox = item.querySelector("input[type=checkbox]");
    checkbox.addEventListener("change", (e) => {
      const task = taskData[index];
      task.done = e.target.checked;
      localStorage.setItem("data", JSON.stringify(taskData));
      if (e.target.checked) {
        item.classList.add("done");
        // Move the task to the end of the array
        taskData.splice(index, 1);
        taskData.push(task);
      } else {
        item.classList.remove("done");
        // Move the task to the beginning of the array
        taskData.splice(index, 1);
        taskData.unshift(task);
      }
      localStorage.setItem("data", JSON.stringify(taskData));
      renderToDoList(); // Re-render the list to reflect changes
    });
  });
};

// Function to delete task
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (task) => task.id === buttonEl.parentElement.id
  );
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

// Function to delete entire list
const deleteToDoList = () => {
  toDoList.innerHTML = "";
  localStorage.clear();
};

// Click event to trigger addTask function
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

// Click event to delete entire list
deleteList.addEventListener("reset", (e) => {
  deleteToDoList();
});

// Use local storage to render todo list on page load
renderToDoList();
