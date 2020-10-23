/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
//получаем нужные эл-ты
const button = document.querySelector('.container');
document.addEventListener('DOMContentLoaded', getPage);
let xhr = new XMLHttpRequest();
let data;

function getPage() {
  console.log('ok');
  xhr.open('GET', 'http://localhost:7070/');
  xhr.send();
  xhr.onloadend = function() {
    data = JSON.parse(this.responseText);
    console.log(data);
    data.forEach((element) => {
      taskList.innerHTML += `<div><div>${element.id}</div><div>${element.description}</div></div>`
    });
  };
  const taskList = document.createElement('div');
  taskList.setAttribute('class', 'task-list');
  taskList.setAttribute('data-id', 'task-list');
  button.insertAdjacentElement('afterend', taskList);
}


function fn() {
  console.log('ok');
  xhr.open('GET', 'http://localhost:7070/');
  xhr.send();
  xhr.onloadend = function() {
    const data = JSON.parse(this.responseText);
    console.log(data);
  };
}

button.addEventListener('click', fn);
