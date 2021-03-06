import Task from '../model/Task.js';

import { callApi } from '../api/api.js';

const addBtn = document.getElementById('addItem');
const newTaskEle = document.getElementById('newTask');

const inCompletedTaskEle = document.getElementById('todo');
const completedTaskEle = document.getElementById('completed');

//mode : true or false
const showLoader = (mode) => {
  let loader = document.getElementById('loader');
  let cardList = document.getElementById('card__todo');

  if (mode) {
    loader.style.display = 'block';
    cardList.style.display = 'none';
  } else {
    loader.style.display = 'none';
    cardList.style.display = 'block';
  }
};

const addTask = async () => {
  //get value from input
  const newTaskContent = newTaskEle.value;

  //generate unique id
  const id = Math.random().toString();

  //create task object
  const newTask = new Task(id, newTaskContent);

  showLoader(true);
  //post new task to api
  await callApi('task', 'POST', newTask);
  showLoader(false);

  fetchTaskList();

  //clear form
  newTaskEle.value = '';
};

const fetchTaskList = async () => {
  showLoader(true);
  const res = await callApi('task', 'GET');
  showLoader(false);

  renderTaskList(res.data);
};

//render both completed and incompleted tasks
const renderTaskList = (taskList) => {
  if (!taskList) return;

  const taskTemplate = (task) => {
    return `
      <li>
        ${task.content}
        <div class="buttons">
         <i onclick="removeTask('${task.id}')" class="fa fa-trash remove"></i>
          <i onclick="toggleCompleted('${task.id}')" class="fa fa-check-circle complete"></i>
          </div>
      </li>
    `;
  };

  //render incomplted tasks
  let tasksHTML = '';
  taskList
    .filter((task) => task.isCompleted === false)
    .forEach((task) => (tasksHTML += taskTemplate(task)));

  inCompletedTaskEle.innerHTML = tasksHTML;

  //render completed tasks
  tasksHTML = '';
  taskList
    .filter((task) => task.isCompleted === true)
    .forEach((task) => (tasksHTML += taskTemplate(task)));

  completedTaskEle.innerHTML = tasksHTML;
};

const removeTask = async (id) => {
  showLoader(true);
  await callApi(`task/${id}`, 'DELETE');
  showLoader(false);

  fetchTaskList();
};

const getTaskById = async (id) => {
  showLoader(true);
  return callApi(`task/${id}`, 'GET');
};

const toggleCompleted = async (id) => {
  //get task
  const res = await getTaskById(id);

  //check completed or incompleted
  const task = res.data;
  task.isCompleted = !task.isCompleted;

  //update task in serve
  await callApi(`task/${id}`, 'PUT', task);
  showLoader(false);

  //fetch list again
  fetchTaskList();
};

window.removeTask = removeTask;
window.toggleCompleted = toggleCompleted;

addBtn.addEventListener('click', addTask);

//---------call function when page load-----------------

fetchTaskList();
