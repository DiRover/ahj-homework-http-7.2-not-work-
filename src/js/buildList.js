/* eslint-disable no-param-reassign */
export default function buildList(arr, boxItems) {
  boxItems.innerHTML = '';
  arr.forEach((item) => {
    const elem1 = document.createElement('p');
    const elem2 = document.createElement('p');
    const elem3 = document.createElement('p');
    // проверяем статус тикета, ответ приходит в формате string
    // если true, то ставим галочку
    if (item.status === 'true') {
      elem1.innerHTML = `<div class="circle pin" data-circle="circle"></div><div class="ticket-content"><p class="ticket-text" data-ticket=${item.id}>${item.name}</p></div>`;
    } else {
      elem1.innerHTML = `<div class="circle" data-circle="circle"></div><div class="ticket-content"><p class="ticket-text" data-ticket=${item.id}>${item.name}</p></div>`;
    }
    elem2.innerHTML = `${item.created}`;
    elem3.innerHTML = `<span class="edit-pencil" data-pencil="edit">&#128393</span>
                        <span class="delete-bin" data-bin="delete">&#128465</span>`;
    elem1.setAttribute('data-grid', 'cell');
    elem2.setAttribute('data-grid', 'cell');
    elem3.setAttribute('data-grid', 'cell');
    elem1.setAttribute('class', 'cell');
    elem2.setAttribute('class', 'cell');
    elem3.setAttribute('class', 'cell');
    boxItems.appendChild(elem1);
    boxItems.appendChild(elem2);
    boxItems.appendChild(elem3);
  });
}
