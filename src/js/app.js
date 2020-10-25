/* eslint-disable import/no-cycle */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/prefer-default-export */
/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
import buildList from './buildList';
import msgs from './msgs';
import showModal from './showModal';
import item from './item';

//получаем нужные эл-ты
const button = document.querySelector('[data-id="add-btn"]');
const ticketsBox = document.querySelector('[data-id="items-container"]');
export const widget = document.querySelector('[data-widget="widget"]');
const cancel = document.querySelector('[data-btn="cancel-btn"]');
export const form = document.querySelector('[data-menu="add-menu"]');
const msg = document.querySelector('[data-msg="msg-err"]');
export const formElements = [...form.elements];
const msgDel = document.querySelector('[data-msgDel="delete"]');

document.addEventListener('DOMContentLoaded', getPage);
const xhr = new XMLHttpRequest();
let data;
let ticketId;
let parent;

document.addEventListener('click', closeDescription);

function closeDescription(e) {
  //закрываем описание
  const target = e.target;
  //смотрим что не попали на открытое опсание тикета
  if (!target.hasAttribute('data-ticket')) {
    //получаем список открытых описаний тикетов
    const ticketActive = document.querySelectorAll('.active-ticket');
    //если длина списка 0 => выходим из функции
    if (ticketActive.length === 0) return;
    //обрабатываем список эл-ов с открытым описанием
    ticketActive.forEach((elem) => {
      const ticketDescip = elem.querySelector('.ticket-description');
      //убираем описания
      elem.classList.remove('active-ticket');
      //удаляем узел с описанием
      ticketDescip.remove();
    });
  };
}

function getPage() {
  console.log('ok');
  xhr.open('GET', 'http://localhost:7070/');
  xhr.send();
  xhr.onloadend = function () {
    data = JSON.parse(this.responseText);
    console.log(data);
    buildList(data, ticketsBox);
  };
  const taskList = document.createElement('div');
  taskList.setAttribute('class', 'task-list');
  taskList.setAttribute('data-id', 'task-list');
  //button.insertAdjacentElement('afterend', taskList);
}


ticketsBox.addEventListener('click', getDescription);

function getDescription(e) {
  const target = e.target;
  //смотрим что попали на имя тикета
  if (target.hasAttribute('data-ticket')) {
    //получаем id тикета
    ticketId = target.dataset.ticket;
    data.forEach(element => {
      if (element.id === ticketId) {
        //находим описание и вставляем в разметку
        parent = target.closest('.ticket-content');
        //проверям наличие уже включённого описания тикета
        const elemDesc = parent.querySelector('.ticket-description');
        if (elemDesc) return; //если описание есть, то выходим из функции
        parent.classList.add('active-ticket');
        const elem = document.createElement('div');
        elem.innerHTML = `${element.description}`;
        elem.setAttribute('class', 'ticket-description');
        parent.appendChild(elem);
      };
    });
  };
};


ticketsBox.addEventListener('click', deleteTicket);

function deleteTicket(e) {
  const target = e.target;
  if (target.hasAttribute('data-bin')) {
    parent = target.closest('.cell');
    const siblEl = parent.previousElementSibling.previousElementSibling;
    ticketId = siblEl.querySelector('.ticket-text').dataset.ticket;
    msgDel.classList.remove('hidden');
    console.log(ticketId);
  }
}



button.addEventListener('click', showModal);


cancel.addEventListener('click', (e) => {
  e.preventDefault();
  widget.classList.add('hidden');
  form.classList.remove('add');
});

form.addEventListener('submit', addTicket);

function addTicket(e) {
  e.preventDefault();
  // проверяем валидность формы
  const target = e.currentTarget.checkValidity();
  // если форма валидна, отправляем данные на сервер
  if (target) {
    const formData = new FormData(e.currentTarget);
    xhr.open('POST', 'http://localhost:7070');
    xhr.send(formData);
    xhr.onloadend = function () {
      console.log(this.responseText); // получаем сообщение в консоль о добавлении тикета
      data = JSON.parse(this.responseText);
      buildList(data, ticketsBox);
      // закрываем и очищаем форму
      widget.classList.add('hidden');
      form.classList.remove('add');
      form.reset();
    };
  } else {
    console.log('not valid');
    // находим невалидное поле инпут
    const invalidElem = formElements.find((elem) => !elem.validity.valid);
    // устанавливаем фокус на невалидном поле
    invalidElem.focus();
    // в ValidityState.prototype хранятся все поля со значенями валидации/невалидации
    const errType = Object.keys(ValidityState.prototype).find((type) => {
      // есле поле не валидно, то у него значение true
      if (invalidElem.validity[type]);
      return invalidElem.validity[type];
    });
    console.log(errType);
    // берём объект msgs с наши сообщениями
    // invalidElem.dataset.field - это ключ объекта msgs
    // errType - это ключ вложенного объекта у объекта msgs
    const errMsg = msgs[invalidElem.dataset.field][errType];
    // показываем тултип
    msg.classList.add('active');
    // прописываем подсказку
    msg.innerHTML = `<p class="err-msg">${errMsg}</p>`;
    // позиционируем подсказку
    msg.style.left = `${invalidElem.offsetWidth}px`;
    msg.style.top = `${invalidElem.offsetTop}px`;
  }
}
