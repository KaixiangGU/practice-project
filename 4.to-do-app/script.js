const todoContainer = document.querySelector(".todo-container");
const headerTime = document.querySelector(".header-time");
const headerDate = document.querySelector(".header-date");
const listsBtn = document.querySelector("[data-lists-btn]");
const closeBtn = document.querySelector("[data-close-btn]");
const listsWindow = document.querySelector("[data-lists-window]");
const listsWrapper = document.querySelector("[data-lists-wrapper]");
const listInput = document.querySelector("[data-list-input]");
const addListBtn = document.querySelector("[data-add-list-btn]");
const deleteBtn = document.querySelector(".material-symbols-rounded");
const listTitle = document.querySelector("[data-list-title]");
const addNewTaskBtn = document.querySelector("[data-add-new-task-btn]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const newTaskWindow = document.querySelector("[data-new-task-window]");
const submitNewTaskBtn = document.querySelector("[data-submit-new-task]");
const cancelNewTaskBtn = document.querySelector("[data-cancel-new-task]");
const taskTemplate = document.querySelector("#task-template");
const taskContentWrapper = document.querySelector("[data-task-content-wrapper]");
const statusBtnWrapper = document.querySelector("[data-status-btn-wrapper]");
const statusBtn = document.querySelectorAll(".status-button");
const allTaskBtn = document.querySelector("[data-all-btn]");

const LOCAL_STORAGE_LIST_KEY = "todo.lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "todo.selected.list";
let localLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let localListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

setInterval(updatingDate, 1000);
renderAll();
//open & close lists window
listsBtn.addEventListener("click", () => {
  listsWindow.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  listsWindow.classList.remove("show");
});

//create new list
addListBtn.addEventListener("click", (e) => {
  const listName = listInput.value;
  if (listName == null || listName == "") return;
  const newList = createList(listName);
  localLists.push(newList);
  listInput.value = null;
  saveRender();
});

//create new task
submitNewTaskBtn.addEventListener("click", (e) => {
  const selectedList = localLists.find((list) => list.id === localListId);
  if (selectedList == undefined) {
    alert("please select a list or create a new one!");
    return;
  }
  const taskName = newTaskInput.value;
  const newTask = createTask(taskName);
  selectedList.tasks.push(newTask);
  newTaskInput.value = null;
  todoContainer.classList.remove("show");
  saveRender();
});

//task content event <complete tast> / <delete task>
taskContentWrapper.addEventListener("click", (e) => {
  const selectedList = localLists.find((list) => list.id === localListId);
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedTast = selectedList.tasks.find((task) => task.id === e.target.id);
    selectedTast.complete = e.target.checked;
    save();
  }
  //delete task
  if (e.target.tagName.toLowerCase() === "span") {
    const parentElement = e.target.parentNode;
    const index = parentElement.dataset.index;
    selectedList.tasks.splice(index, 1);
    saveRender();
  }
});

//sort tasks as comlete status <all> <complete> <incomplete>
statusBtnWrapper.addEventListener("click", (e) => {
  const newLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));
  let selectedList = newLists.find((list) => list.id === localListId);
  statusBtn.forEach((btn) => btn.classList.remove("active"));
  if (e.target.classList.contains("completed")) {
    selectedList.tasks = selectedList.tasks.filter((task) => task.complete === true);
    clearElement(taskContentWrapper);
    renderTask(selectedList);
  }
  if (e.target.classList.contains("incompleted")) {
    selectedList.tasks = selectedList.tasks.filter((task) => task.complete === false);
    clearElement(taskContentWrapper);
    renderTask(selectedList);
  }
  if (e.target.classList.contains("all")) {
    saveRender();
  }
  e.target.classList.add("active");
});

//save selected listId
listsWrapper.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    localListId = e.target.dataset.listId;
    listsWindow.classList.remove("show");
    saveRender();
  }
});

//delete list
listsWrapper.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "span") {
    const deleteListId = e.target.parentNode.dataset.listId;
    if (localListId == deleteListId) {
      localListId = "null";
    }
    localLists = localLists.filter((list) => list.id !== deleteListId);
    saveRender();
  }
});

//new task window pop up
addNewTaskBtn.addEventListener("click", () => todoContainer.classList.add("show"));
//cancel new task
cancelNewTaskBtn.addEventListener("click", () => todoContainer.classList.remove("show"));

//create list and task object
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}
function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

//save local lists and local list id
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(localLists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, localListId);
}

function renderAll() {
  clearElement(listsWrapper);
  renderList();

  const selectedList = localLists.find((list) => list.id === localListId);
  if (localListId == "null" || selectedList == undefined) {
    taskContentWrapper.style.display = "none";
    listTitle.innerText = "";
  } else {
    taskContentWrapper.style.display = "block";
    listTitle.innerText = selectedList.name;
    statusBtn.forEach((btn) => btn.classList.remove("active"));
    allTaskBtn.classList.add("active");
    clearElement(taskContentWrapper);
    renderTask(selectedList);
  }
}

function renderTask(selectedList) {
  selectedList.tasks.forEach((task, index) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkBox = taskElement.querySelector("input");
    checkBox.id = task.id;
    checkBox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    const taskWrapper = taskElement.querySelector(".task-content");
    taskWrapper.dataset.index = index;
    taskContentWrapper.appendChild(taskElement);
  });
}

function renderList() {
  localLists.forEach((list) => {
    //create li element
    const newLiElement = document.createElement("li");
    const iconHtml = '<span class="material-symbols-rounded"> delete </span>';
    newLiElement.innerText = list.name;
    newLiElement.dataset.listId = list.id;
    newLiElement.classList.add("list-element");
    newLiElement.insertAdjacentHTML("beforeend", iconHtml);
    listsWrapper.appendChild(newLiElement);

    //show selected list
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function saveRender() {
  save();
  renderAll();
}

//date update
function updatingDate() {
  const myDate = dayjs().format("D MMM, YYYY");
  const myTime = dayjs().format("H:mm");
  headerDate.innerText = myDate;
  headerTime.innerText = myTime;
}
