import { widget, form } from './app';

function closeModal(e) {
    e.preventDefault();
    widget.classList.add('hidden');
    form.classList.remove('add');
}