// Create  //imprimir naming
async function createTask(task) {
  const taskList = document.querySelector(".task-list");
  const taskElement = document.createElement("li");
  taskElement.classList.add("list");

  const taskDetailsDiv = document.createElement("div");
  taskDetailsDiv.classList.add("task-details");

  const titleElement = document.createElement("h3");
  titleElement.classList.add("task-title");
  titleElement.textContent = task.title;

  const descriptionElement = document.createElement("h3");
  descriptionElement.classList.add("task-description");
  descriptionElement.textContent = task.description;

  // DELETE BUTTON
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
  });

  //EDIT BUTTON
  const editForm = document.createElement("form");
  editForm.classList.add("edit-form");
  editForm.style.display = "none";

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = task.description;
  inputElement.classList.add("edit-imput");

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "+";
  submitButton.classList.add("edit-submit");

  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const newDescription = inputElement.value;
    if (newDescription !== task.description) {
      await editTask({
        id: task.id,
        description: newDescription,
        element: taskElement,
      });

      task.description = newDescription;
      descriptionElement.textContent = newDescription;
      editForm.style.display = "none"; // Hide the edit form again
    }
  });

  const editButton = document.createElement("button");
  editButton.textContent = "✎";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", function () {
    editForm.style.display = "block"; // Show the edit form when Edit is clicked
  });

  //CHECKMARK
  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.classList.add("task-checkbox");
  checkboxElement.checked = task.completed;

  //UPDATE  CHECKMARCK
  const updateTaskCompletion = async (taskId, completed) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        console.error("Error updating task completion.");
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  checkboxElement.addEventListener("change", async function () {
    task.completed = this.checked;
    await updateTaskCompletion(task.id, task.completed);
  });

  taskDetailsDiv.appendChild(checkboxElement);
  taskDetailsDiv.appendChild(titleElement);
  taskDetailsDiv.appendChild(descriptionElement);

  editForm.appendChild(inputElement);
  editForm.appendChild(submitButton);

  taskElement.appendChild(taskDetailsDiv);
  taskDetailsDiv.appendChild(deleteButton);
  taskDetailsDiv.appendChild(editButton);
  taskDetailsDiv.appendChild(editForm);

  taskList.appendChild(taskElement);
}

// Get data from server
async function getData() {
  try {
    const response = await fetch("http://127.0.0.1:5500/data.json");
    const data = await response.json();

    if (data.tasks) {
      console.log("All Tasks:", data.tasks);
      data.tasks.forEach((task) => {
        createTask(task);
      });
    }
  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
}

// Add event listener to form
const taskForm = document.querySelector(".task-form");
taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const inputTitle = this.querySelector("#new-task-title").value;
  const inputDescription = this.querySelector("#new-task-description").value;

  const newTask = {
    title: inputTitle,
    completed: false,
    description: inputDescription,
  };

  createTask(newTask);
  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      console.log("Tarea creada exitosamente en el servidor.");
    } else {
      console.error("Error al crear la tarea en el servidor.");
    }
  } catch (error) {
    console.error("Error en la solicitud fetch:", error);
  }
});
getData();

// DELETE
async function deleteTask(taskId) {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Task deleted successfully.");
      // Optionally, you can remove the task element from the DOM
      const taskElement = document.querySelector(".list");
      taskElement.remove();
    } else {
      console.error("Error deleting task.");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

// PATCH
async function editTask(task) {
  const updatedTaskData = {
    description: task.description,
  };

  try {
    const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    if (response.ok) {
      console.log("Task updated successfully.");
      // Optionally, you can update the task element's content
      const taskDescriptionElement =
        task.element.querySelector(".task-description");
      taskDescriptionElement.textContent = updatedTaskData.description;
    } else {
      console.error("Error updating task.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
