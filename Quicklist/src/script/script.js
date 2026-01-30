const DEFAULT_ITEMS = ['Leite', 'Pão', 'Ovos', 'Café'];
let items = [];

const itemInput = document.getElementById('itemInput');
const btnAdd = document.getElementById('btnAdd');
const btnBack = document.getElementById('btnBack');
const itemsList = document.getElementById('itemsList');
const alertContainer = document.getElementById('alertContainer');

document.addEventListener('DOMContentLoaded', () => {
  loadItems();
  renderList();
  setupEventListeners();
});

function setupEventListeners() {
  btnAdd.addEventListener('click', handleAddItem);
  itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  });
  btnBack.addEventListener('click', handleBack);
}

function handleAddItem() {
  const itemText = itemInput.value.trim();

  if (!itemText) {
    showAlert('Por favor, digite um item antes de adicionar.', 'error');
    return;
  }

  items.push({
    id: Date.now(),
    text: itemText,
    completed: false,
  });

  saveItems();
  renderList();
  itemInput.value = '';
  itemInput.focus();
}

function handleDeleteItem(id) {
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex > -1) {
    const deletedItemText = items[itemIndex].text;
    items.splice(itemIndex, 1);
    saveItems();
    renderList();
    showAlert(`"${deletedItemText}" foi removido da lista.`, 'success');
  }
}

function handleToggleCompleted(id) {
  const item = items.find((item) => item.id === id);
  if (item) {
    item.completed = !item.completed;
    saveItems();
    renderList();
  }
}

function handleBack() {
  if (window.history.length > 1) {
    window.history.back();
  }
}

function renderList() {
  itemsList.innerHTML = '';

  if (items.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'Nenhum item na lista. Adicione um para começar!';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '32px 16px';
    emptyMessage.style.color = 'var(--content-tertiary)';
    emptyMessage.style.fontSize = '14px';
    itemsList.appendChild(emptyMessage);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = `item ${item.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="checkbox-wrapper">
        <input
          type="checkbox"
          class="item-checkbox"
          ${item.completed ? 'checked' : ''}
          data-id="${item.id}"
          aria-label="Marcar como concluído: ${escapeHtml(item.text)}"
        >
      </div>
      <label class="item-label">${escapeHtml(item.text)}</label>
      <button
        class="btn-delete"
        data-id="${item.id}"
        aria-label="Remover item: ${escapeHtml(item.text)}"
        title="Remover"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;

    const checkbox = li.querySelector('.item-checkbox');
    const deleteBtn = li.querySelector('.btn-delete');

    checkbox.addEventListener('change', () => handleToggleCompleted(item.id));
    deleteBtn.addEventListener('click', () => handleDeleteItem(item.id));

    itemsList.appendChild(li);
  });
}

function loadItems() {
  const stored = localStorage.getItem('quicklist-items');
  items = stored ? JSON.parse(stored) : DEFAULT_ITEMS.map((text, index) => ({
    id: index,
    text,
    completed: false,
  }));
}

function saveItems() {
  localStorage.setItem('quicklist-items', JSON.stringify(items));
}

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;

  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'alert-close';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Fechar notificação');

  alert.appendChild(messageSpan);
  alert.appendChild(closeBtn);

  alertContainer.appendChild(alert);

  const closeAlert = () => {
    alert.style.animation = 'slideUp 300ms ease reverse forwards';
    setTimeout(() => alert.remove(), 300);
  };

  closeBtn.addEventListener('click', closeAlert);

  setTimeout(closeAlert, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
