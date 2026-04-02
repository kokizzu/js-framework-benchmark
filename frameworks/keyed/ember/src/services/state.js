import Service from '@ember/service';
import { cell } from '#soon/cell.js';
import { trackedArray } from '@ember/reactive/collections';

import { run, runLots, add, update, swapRows, deleteRow } from '#utils';

export default class State extends Service {
  data = trackedArray();
  id = 1;
  selected = cell(undefined);

  create = () => {
    let id = this.id;
    const result = run(id);

    this.id = result.id;
    this.data.length = 0;

    this.data.push(...result.data);
    this.selected.set(undefined);
  };

  add = () => {
    let result = add(this.id);
    this.data.push(...result.data);
    this.id = result.id;
  };

  update = () => {
    update(this.data);
  };

  runLots = () => {
    const result = runLots(this.id);

    this.data.length = 0;
    this.data.push(...result.data);
    this.id = result.id;
    this.selected.set(undefined);
  };

  clear = () => {
    this.data.length = 0;
    this.selected.set(undefined);
  };

  swapRows = () => {
    swapRows(this.data);
  };

  remove = ({ id }) => {
    let idx = this.data.findIndex((d) => d.id === id);
    this.data.splice(idx, 1);
    // this.selected.set(undefined);
  };

  select = ({ id }) => {
    this.selected.set(id);
  };

  isSelected = ({ id }) => {
    return this.selected.read() === id;
  };
}
