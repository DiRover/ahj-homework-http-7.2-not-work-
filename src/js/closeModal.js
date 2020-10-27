/* eslint-disable import/no-cycle */
import { widget, form } from './app';

export default function closeModal(e) {
  e.preventDefault();
  widget.classList.add('hidden');
  form.classList.remove('add');
}
