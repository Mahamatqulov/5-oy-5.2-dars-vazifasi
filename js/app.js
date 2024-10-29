const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const listGroupTodo = document.getElementById("list-group-todo");

const time = document.getElementById("time");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");

const fullDay = document.getElementById("full-day");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const secondEl = document.getElementById("second");

const closeEl = document.getElementById("close");

let editItemId;
let todos = JSON.parse(localStorage.getItem("list")) || [];

if (todos.length) showTodos();

function setTodos() {
  localStorage.setItem("list", JSON.stringify(todos));
}

function getTime() {
  const now = new Date();
  const date = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthTitle = months[now.getMonth()];

  fullDay.textContent = `${date} ${monthTitle}, ${year}`;
  hourEl.textContent = hours;
  minuteEl.textContent = minutes;
  secondEl.textContent = seconds;

  return `${hours}:${minutes}, ${date}.${month}.${year}`;
}

setInterval(getTime, 1000);

function showTodos() {
  listGroupTodo.innerHTML = "";
  todos.forEach((item, i) => {
    listGroupTodo.innerHTML += `
      <li ondblclick="setCompleted(${i})" class="list-group-item d-flex justify-content-between ${
      item.completed ? "completed" : ""
    }">
        ${item.text}
        <div class="todo-icons">
          <span class="opacity-50 me-2">${item.time}</span>
          <img src="img/edit.svg" alt="edit icon" width="25" height="25" onclick="editTodo(${i})"/>
          <img src="img/delete.svg" alt="delete icon" width="25" height="25" onclick="deleteTodo(${i})"/>
        </div>
      </li>`;
  });
}

function showMessage(where, message) {
  document.getElementById(where).textContent = message;
  setTimeout(() => {
    document.getElementById(where).textContent = "";
  }, 2500);
}

formCreate.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoText = formCreate["input-create"].value.trim();
  formCreate.reset();
  if (todoText.length) {
    const currentTime = getTime();
    todos.push({ text: todoText, time: currentTime, completed: false });
    setTodos();
    showTodos();
  } else {
    showMessage("message-create", "Please, enter some todo...");
  }
});

function deleteTodo(id) {
  todos = todos.filter((_, i) => i !== id);
  setTodos();
  showTodos();
}

function setCompleted(id) {
  todos = todos.map((item, i) => ({
    ...item,
    completed: i === id ? !item.completed : item.completed,
  }));
  setTodos();
  showTodos();
}

formEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoText = formEdit["input-edit"].value.trim();
  formEdit.reset();
  if (todoText.length) {
    const currentTime = getTime();
    todos.splice(editItemId, 1, {
      text: todoText,
      time: currentTime,
      completed: false,
    });
    setTodos();
    showTodos();
    close();
  } else {
    showMessage("message-edit", "Please, enter some todo...");
  }
});

function editTodo(id) {
  open();
  editItemId = id;
}

overlay.addEventListener("click", close);
closeEl.addEventListener("click", close);

document.addEventListener("keydown", (e) => {
  if (e.which == 27) close();
});

function open() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

getTime();
