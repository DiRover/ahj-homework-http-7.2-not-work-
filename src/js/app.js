/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
//получаем нужные эл-ты
const button = document.querySelector('.container');

function fn() {
  console.log('ok');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:7070/');
  xhr.send();
  xhr.onloadend = function() {
    const data = JSON.parse(this.responseText);
    console.log(data);
  };
}

button.addEventListener('click', fn);
