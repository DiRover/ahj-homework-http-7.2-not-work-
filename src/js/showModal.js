/* eslint-disable import/no-cycle */
import { widget } from './app';

export default function showModal() {
  widget.classList.remove('hidden');
}
