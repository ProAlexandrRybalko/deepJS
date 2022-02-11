let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = "";
let input = null;

////////////////

window.onload = async function () {
  input = document.getElementById("input");
  input.addEventListener('change', updateValue);
  const response = await fetch("http://localhost:8000/allTasks", {
    method: "GET"
  });
  let result = await response.json();
  allTasks = result.data;
  render();
}

const onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false,
    isVisibleEditInput: false,
    textInput: ""
  });
  const response = await fetch("http://localhost:8000/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
      isVisibleEditInput: false,
      textInput: ""
    })
  });
  let result = await response.json();
  allTasks = result.data;

  localStorage.setItem("tasks", JSON.stringify(allTasks));
  input.value = "";
  render();
}

const onClickDeleteContainer = () => {
  const content = document.getElementById('content-page');

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks = [];
}

const updateValue = (event) => {
  valueInput = event.target.value;
}

const render = () => {
  const content = document.getElementById('content-page');

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    const checkbox = document.createElement('input');
    const text = document.createElement('p');
    const imageEdit = document.createElement('img');
    const imageDelete = document.createElement('img');
    const acceptEdit = document.createElement('img');
    const input = document.createElement('input');

    input.size = 20;
    input.id = `input-task-${index}`;

    imageEdit.src = "pencil.jpg";
    imageEdit.style.width = "10px";
    imageEdit.style.height = "20px";

    imageDelete.src = "delete.png";
    imageDelete.style.width = "40px";
    imageDelete.style.height = "40px";

    acceptEdit.src = "greenCheck.png";
    acceptEdit.style.width = "40px";
    acceptEdit.style.height = "40px";

    acceptEdit.onclick = async function () {
      await onClickAcceptEdit(item, input.id);
    }

    imageEdit.onclick = async function () {
      await onEditTask(item, index);
    }

    imageDelete.onclick = async function () {
      await onDeleteTask(item)
    }

    checkbox.onchange = async function () {
      await onChangeCheckbox(item);
    };

    container.id = `task-${index}`;
    container.className = "task";

    text.innerText = item.text;
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    text.className = item.isCheck ? "text-task done-text" : "text-task";

    if (!item.isVisibleEditInput) {
      input.className = 'invisibleInput';
      acceptEdit.className = 'invisibleInput';
    } else {
      input.value = allTasks.length ? item.textInput : "";
    }

    container.appendChild(text);
    container.appendChild(checkbox);
    container.appendChild(imageEdit);
    container.appendChild(imageDelete);
    container.appendChild(input);
    container.appendChild(acceptEdit);

    item.isCheck ? content.appendChild(container) : content.prepend(container);
  });
}

const onClickAcceptEdit = async (item, inputId) => {
  item.text = document.getElementById(inputId).value;
  item.textInput = "";
  const response = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(item)
  });
  let result = await response.json();
  allTasks = result.data;

  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
}

const onChangeCheckbox = async (item) => {
  item.isCheck = !item.isCheck;
  if (item.isVisibleEditInput) {
    item.isVisibleEditInput = !item.isVisibleEditInput;
  }
  const response = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(item)
  });
  let result = await response.json();
  allTasks = result.data;

  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
}

const onDeleteTask = async (item) => {
  const response = await fetch(`http://localhost:8000/deleteTask?id=${item.id}`, {
    method: "DELETE"
  });
  let result = await response.json();
  allTasks = result.data;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
}

const onEditTask = async (item, index) => {
  if(!item.isCheck) {
    item.isVisibleEditInput = !item.isVisibleEditInput;
    if (!item.isVisibleEditInput) {
      item.textInput = document.getElementById(`input-task-${index}`).value;
    }
  }
  const response = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(item)
  });
  let result = await response.json();
  allTasks = result.data;

  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render()
}
