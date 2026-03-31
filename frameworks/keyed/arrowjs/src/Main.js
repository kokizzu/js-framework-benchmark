import { reactive, html } from '@arrow-js/core';
let data = reactive({
  version: 0,
});
let ids = [];
let labels = [];
let views = [];

let rowId = 1;
let selectedIndex = -1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
const labelPool = [];
for (let i = 0; i < adjectives.length; i++) {
  const prefix = adjectives[i] + " ";
  for (let j = 0; j < colours.length; j++) {
    const stem = prefix + colours[j] + " ";
    for (let k = 0; k < nouns.length; k++) {
      labelPool.push(stem + nouns[k]);
    }
  }
}
const labelPoolSize = labelPool.length;
const add = () => {
    appendData(1000);
    data.version++;
  },
  clear = () => {
    selectedIndex = -1;
    ids = [];
    labels = [];
    views = [];
    data.version++;
  },
  partialUpdate = () => {
    for (let i = 0; i < ids.length; i += 10) {
      labels[i] += ' !!!';
      views[i] = createRowView(ids[i], labels[i]);
    }
    data.version++;
  },
  run = () => {
    replaceData(1000);
  },
  runLots = () => {
    replaceData(10000);
  },
  swapRows = () => {
    if (ids.length > 998) {
      const id = ids[1];
      ids[1] = ids[998];
      ids[998] = id;
      const label = labels[1];
      labels[1] = labels[998];
      labels[998] = label;
      const view = views[1];
      views[1] = views[998];
      views[998] = view;
      if (selectedIndex === 1) selectedIndex = 998;
      else if (selectedIndex === 998) selectedIndex = 1;
      data.version++;
    }
  };

function createRowView(id, label, selected) {
  return html`<tr class="${selected ? 'danger' : false}"><td class="col-md-1">${id}</td><td class="col-md-4"><a>${label}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`.key(id);
}

async function replaceData(count) {
  selectedIndex = -1;
  if (ids.length) {
    ids = [];
    labels = [];
    views = [];
    data.version++;
    await Promise.resolve();
  }
  [ids, labels, views] = buildData(count);
  data.version++;
}

function handleRowClick(event) {
  const cell = event.target instanceof Element
    ? event.target.closest('td')
    : null;
  if (!cell) return;
  const index = cell.cellIndex;
  if (index !== 1 && index !== 2) return;
  const row = cell.parentElement;
  if (!(row instanceof HTMLTableRowElement)) return;
  const idx = row.sectionRowIndex;
  if (idx < 0 || idx >= ids.length) return;
  if (index === 1) {
    if (selectedIndex === idx) return;
    const previousIndex = selectedIndex;
    selectedIndex = idx;
    if (previousIndex > -1) {
      views[previousIndex] = createRowView(ids[previousIndex], labels[previousIndex], false);
    }
    views[idx] = createRowView(ids[idx], labels[idx], true);
    data.version++;
    return;
  }
  if (index === 2) {
    if (idx === selectedIndex) {
      selectedIndex = -1;
    } else if (selectedIndex > idx) selectedIndex--;
    ids.splice(idx, 1);
    labels.splice(idx, 1);
    views.splice(idx, 1);
    data.version++;
  }
}

function buildData(count, ids = [], labels = [], views = [], start = 0) {
  const pool = labelPool;
  const size = labelPoolSize;
  const createView = createRowView;
  const end = start + count;
  let nextId = rowId;
  ids.length = end;
  labels.length = end;
  views.length = end;
  for (var i = start; i < end; i++) {
    const id = nextId++;
    const label = pool[(Math.random() * size) | 0];
    ids[i] = id;
    labels[i] = label;
    views[i] = createView(id, label, false);
  }
  rowId = nextId;
  return [ids, labels, views];
}

function appendData(count) {
  const pool = labelPool;
  const size = labelPoolSize;
  const createView = createRowView;
  let nextId = rowId;
  for (let i = 0; i < count; i++) {
    const id = nextId++;
    const label = pool[(Math.random() * size) | 0];
    ids.push(id);
    labels.push(label);
    views.push(createView(id, label, false));
  }
  rowId = nextId;
}
html`<div class="container">
  <div class="jumbotron">
  <div class="row">
    <div class="col-md-6">
      <h1>ArrowJS (keyed)</h1>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="run" @click="${run}">Create 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="runlots" @click="${runLots}">Create 10,000
            rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="add" @click="${add}">Append 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="update" @click="${partialUpdate}">Update every
            10th row</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="clear" @click="${clear}">Clear</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="swaprows" @click="${swapRows}">Swap Rows</button>
        </div>
      </div>
    </div>
  </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody @click="${handleRowClick}">
      ${() => (data.version, views)}
    </tbody>
  </table>
  <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>
`(document.getElementById('main'))
