// Six semester papers: OOPS is included within the Java paper.
const papers = ['Maths', 'DLD', 'AE', 'SS', 'DE', 'Java (including OOPS)'];
// These are regular practice skills, separate from your twice-weekly papers.
const skills = ['Coding', 'Web Development', 'Problem Solving', 'Communication'];
const STORAGE_KEY = 'my-study-todo-v1';
const $ = (selector) => document.querySelector(selector);
let activeFilter = 'all';

// Sample tasks make the list useful immediately. Tasks are saved in this browser.
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [
  { id: 1, title: 'Revise matrices and determinants', paper: 'Maths', skill: '', mode: 'paper', done: false },
  { id: 2, title: 'Study logic gates and truth tables', paper: 'DLD', skill: '', mode: 'paper', done: false },
  { id: 3, title: 'Practise Java classes and objects', paper: 'Java (including OOPS)', skill: '', mode: 'paper', done: true },
  { id: 4, title: 'Build a small HTML and CSS page', paper: '', skill: 'Web Development', mode: 'skill', done: false }
];
// Convert tasks saved by the earlier version of this page to the new three-mode format.
tasks = tasks.map((task) => task.mode ? task : { id: task.id, title: task.title, paper: skills.includes(task.subject) ? '' : task.subject, skill: skills.includes(task.subject) ? task.subject : '', mode: skills.includes(task.subject) ? 'skill' : 'paper', done: task.done });

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

function setupSubjects() {
  $('#paperSelect').innerHTML = papers.map((paper) => `<option>${paper}</option>`).join('');
  $('#skillSelect').innerHTML = skills.map((skill) => `<option>${skill}</option>`).join('');
  $('#subjectChips').innerHTML = `<div class="chip-group"><strong>Semester papers · twice weekly</strong><div>${papers.map((paper) => `<span class="subject-chip">${paper}</span>`).join('')}</div></div><div class="chip-group"><strong>Skills · regular practice</strong><div>${skills.map((skill) => `<span class="subject-chip skill-chip">${skill}</span>`).join('')}</div></div>`;
}

function visibleTasks() {
  return tasks.filter((task) => {
    if (activeFilter === 'done') return task.done;
    if (activeFilter === 'pending') return !task.done;
    if (activeFilter === 'paper' || activeFilter === 'skill' || activeFilter === 'double') return task.mode === activeFilter;
    return true;
  });
}

function render() {
  const shown = visibleTasks();
  $('#taskCount').textContent = `${tasks.filter((task) => !task.done).length} to do · ${tasks.filter((task) => task.done).length} completed`;
  $('#taskList').innerHTML = shown.map((task) => `<article class="task-item ${task.done ? 'done' : ''}">
    <button class="check" data-toggle="${task.id}" aria-label="Mark task complete"></button>
    <div><div class="task-title">${task.title}</div><div class="task-subject">${task.mode === 'double' ? `Double mode: ${task.paper} + ${task.skill}` : task.mode === 'skill' ? `Skill: ${task.skill}` : `${task.paper} paper · twice weekly`}</div></div>
    <span class="time-badge">${task.mode === 'double' ? '✦ Double' : task.mode === 'skill' ? 'Skill' : 'Paper'}</span><button class="delete" data-delete="${task.id}" aria-label="Delete task">×</button>
  </article>`).join('');
  $('#emptyState').hidden = shown.length !== 0;
}

function updateModeControls() {
  const mode = $('#modeSelect').value;
  $('#paperSelect').disabled = mode === 'skill';
  $('#skillSelect').disabled = mode === 'paper';
}

$('#taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const mode = $('#modeSelect').value;
  tasks.unshift({ id: Date.now(), title: $('#taskName').value.trim(), paper: mode === 'skill' ? '' : $('#paperSelect').value, skill: mode === 'paper' ? '' : $('#skillSelect').value, mode, done: false });
  $('#taskName').value = '';
  save(); render();
});

$('#modeSelect').addEventListener('change', updateModeControls);

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-toggle]');
  const remove = event.target.closest('[data-delete]');
  if (toggle) { const task = tasks.find((item) => item.id === Number(toggle.dataset.toggle)); task.done = !task.done; save(); render(); }
  if (remove) { tasks = tasks.filter((item) => item.id !== Number(remove.dataset.delete)); save(); render(); }
});

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
  render();
}));

$('#dateSelector').valueAsDate = new Date();
setupSubjects(); updateModeControls(); render();
