/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
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
import closeModal from './closeModal';

//получаем нужные эл-ты
const button = document.querySelector('[data-id="add-btn"]');
const ticketsBox = document.querySelector('[data-id="items-container"]');
export const widget = document.querySelector('[data-widget="widget"]');
const cancel = document.querySelector('[data-btn="cancel-btn"]');
export const form = document.querySelector('[data-widget="form"]');
const msg = document.querySelector('[data-msg="msg-err"]');
export const formElements = [...form.elements];
const msgDel = document.querySelector('[data-msgDel="delete"]');
const btnsSection = document.querySelector('[data-btn="section"]');
const nameInput = document.querySelector('[data-field="name"]');
const descriptionInput = document.querySelector('[data-field="description"]');
const url = 'https://http-herocu.herokuapp.com/';
//const url = 'http://localhost:7070/';

document.addEventListener('DOMContentLoaded', getPage);
const xhr = new XMLHttpRequest();
let data;
let ticketId;
let parent;
let target;

//отрисовываем страницу со списком
function getPage() {
  console.log('ok');
  xhr.open('GET', url);
  xhr.send();
  xhr.onloadend = function () {
    console.log(this.responseText); // получаем сообщение в консоль о добавлении тикета
    data = JSON.parse(this.responseText);
    buildList(data, ticketsBox);
  };
}

//добавление тикета
//показываем модальное окно с формой добавления тикета
button.addEventListener('click', showModal);

//функция, которая закрывает модальное окно с формой добавления тикета
cancel.addEventListener('click', closeModal);

//добавляем тикет
form.addEventListener('submit', addTicket);

function addTicket(e) {
  e.preventDefault();
  // проверяем валидность формы
  target = e.currentTarget.checkValidity();
  // если форма валидна, отправляем данные на сервер
  if (target) {
    const formData = new FormData(e.currentTarget);
    //ставим режим добавления тикета форме
    form.classList.add('add');
    xhr.open('POST', url);
    xhr.send(formData);
    xhr.onloadend = function () {
      console.log(this.responseText); // получаем сообщение в консоль о добавлении тикета
      data = JSON.parse(this.responseText);
      buildList(data, ticketsBox);
      // закрываем и очищаем форму и возможные сообщения с ошибками
      widget.classList.add('hidden');
      form.classList.remove('add');
      msg.classList.add('hidden');
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
    msg.classList.remove('hidden');
    // прописываем подсказку
    msg.innerHTML = `<p class="err-msg">${errMsg}</p>`;
    // позиционируем подсказку
    msg.style.left = `${invalidElem.offsetWidth}px`;
    msg.style.top = `${invalidElem.offsetTop}px`;
  }
}

//показываем описание тикета
ticketsBox.addEventListener('click', getDescription);

function getDescription(e) {
  target = e.target;
  //смотрим что попали на имя тикета
  if (target.hasAttribute('data-ticket')) {
    //получаем id тикета
    ticketId = target.dataset.ticket;
    data.forEach((element) => {
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
      }
    });
  }
}

//скрываем описание тикета
document.addEventListener('click', closeDescription);

function closeDescription(e) {
  //закрываем описание
  target = e.target;
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
  }
}

//редактируем тикет
ticketsBox.addEventListener('click', getPencil);

function getPencil(e) {
  target = e.target;
  if (target.hasAttribute('data-pencil')) {
    parent = target.closest('.cell');
    const siblEl = parent.previousElementSibling.previousElementSibling;
    ticketId = siblEl.querySelector('.ticket-text').dataset.ticket;
    widget.classList.remove('hidden');
    form.classList.add('edit');
    data.forEach((el) => {
      if (el.id === ticketId) {
        nameInput.value = el.name;
        descriptionInput.value = el.description;
        //получаем новые значения для полей формы
        nameInput.addEventListener('input', () => {
          el.name = nameInput.value;
        });
        descriptionInput.addEventListener('input', () => {
          el.description = descriptionInput.value;
        });
        form.addEventListener('submit', editTicket);
      }
    });
  } else {
    //если попали не на карандаш, то просто выходим из функции
  }
}
//отправляем отредактированный тикет
function editTicket(e) {
  e.preventDefault();
  const edit = document.querySelector('.edit');
  if (!edit) return;
  const params = new URLSearchParams();
  params.append('method', 'editTicket');
  params.append('id', ticketId);
  params.append('name', nameInput.value);
  params.append('description', descriptionInput.value);
  xhr.open('PATCH', url);
  xhr.send(params);
  form.classList.remove('edit');
  widget.classList.add('hidden');
  form.reset();
}

//меняем статус тикета
ticketsBox.addEventListener('click', changeStatus);

function changeStatus(e) {
  target = e.target;
  if (target.hasAttribute('data-circle')) {
    //target.classList.toggle('pin');
    parent = target.closest('.cell');
    //находим тикет с галочкой
    const pin = parent.querySelector('.pin');
    ticketId = parent.querySelector('.ticket-text').dataset.ticket;
    const params = new URLSearchParams();
    params.append('method', 'checkTicket');
    params.append('id', ticketId);
    //если тикет с галочкой не существует отправляем статус true
    if (!pin) {
      params.append('status', true);
      //если тике с галочкой существует отправляем статус false
    } else if (pin) {
      params.append('status', false);
    }
    xhr.open('PATCH', url);
    xhr.send(params);
  }
}

//удаление тикета
//клик на ведро для удаления
ticketsBox.addEventListener('click', getBin);

function getBin(e) {
  target = e.target;
  if (target.hasAttribute('data-bin')) {
    parent = target.closest('.cell');
    const siblEl = parent.previousElementSibling.previousElementSibling;
    ticketId = siblEl.querySelector('.ticket-text').dataset.ticket;
    msgDel.classList.remove('hidden');
  }
}

//само удаление тикета
btnsSection.addEventListener('click', deleteTicket);

function deleteTicket(e) {
  target = e.target;
  if (target.hasAttribute('data-del')) {
    const params = new URLSearchParams();
    params.append('method', 'deleteTicket');
    params.append('id', ticketId);
    xhr.open('PATCH', url);
    xhr.send(params);
    msgDel.classList.add('hidden'); //buildList ненужен т.к. срабатывает getPage
  } else if (target.hasAttribute('data-btn')) {
    msgDel.classList.add('hidden');
  }
}
