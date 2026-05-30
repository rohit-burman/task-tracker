// ==========================================
// TASK TRACKER APPLICATION
// Neo Brutalist Task Management System
// ==========================================

// ==========================================
// CONFIGURATION
// ==========================================
//const API_BASE_URL = 'http://localhost:8080/api/v1/tasks';
const API_BASE_URL = 'https://task-tracker-production-b534.up.railway.app/api/v1/tasks';

// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
    tasks: [],
    loading: false,
    error: null,
    editingTaskId: null,
    deleteTaskId: null
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const elements = {
    // Main containers
    taskGrid: document.getElementById('taskGrid'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    emptyState: document.getElementById('emptyState'),
    taskCount: document.getElementById('taskCount'),

    // Buttons
    createTaskBtn: document.getElementById('createTaskBtn'),
    emptyCreateBtn: document.getElementById('emptyCreateBtn'),
    retryBtn: document.getElementById('retryBtn'),

    // Task Modal
    taskModal: document.getElementById('taskModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    taskForm: document.getElementById('taskForm'),
    submitBtn: document.getElementById('submitBtn'),
    statusGroup: document.getElementById('statusGroup'),

    // Form fields
    taskId: document.getElementById('taskId'),
    title: document.getElementById('title'),
    titleError: document.getElementById('titleError'),
    description: document.getElementById('description'),
    dueDate: document.getElementById('dueDate'),
    priority: document.getElementById('priority'),
    status: document.getElementById('status'),

    // Delete Modal
    deleteModal: document.getElementById('deleteModal'),
    deleteCancelBtn: document.getElementById('deleteCancelBtn'),
    deleteConfirmBtn: document.getElementById('deleteConfirmBtn'),
    taskToDelete: document.getElementById('taskToDelete'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// API LAYER
// ==========================================
const api = {
    async fetchAllTasks() {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    },

    async createTask(taskData) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async updateTask(id, taskData) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async deleteTask(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        return response.status !== 204 ? await response.json() : null;
    }
};

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(type, title, message) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            ${message ? `<div class="toast-message">${escapeHtml(message)}</div>` : ''}
        </div>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// UI RENDERING
// ==========================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function renderTaskCount() {
    const count = state.tasks.length;
    elements.taskCount.textContent = count === 1 ? '1 task' : `${count} tasks`;
}

function renderTask(task) {
    const isCompleted = task.status === 'COMPLETE';
    const priorityClass = `badge-priority-${task.priority.toLowerCase()}`;
    const statusClass = `badge-status-${task.status.toLowerCase()}`;

    return `
        <article class="task-card ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}" role="listitem">
            <div class="task-header">
                <div class="task-checkbox">
                    <input
                        type="checkbox"
                        id="task-${task.id}"
                        ${isCompleted ? 'checked' : ''}
                        aria-label="Mark task as ${isCompleted ? 'open' : 'complete'}"
                        onchange="handleToggleComplete('${task.id}')"
                    >
                </div>
                <div class="task-title-group">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                </div>
            </div>
            <div class="task-meta">
                ${task.dueDate ? `
                    <div class="task-due-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${formatDate(task.dueDate)}
                    </div>
                ` : ''}
                <div class="task-badges">
                    <span class="badge ${priorityClass}">${task.priority}</span>
                    <span class="badge ${statusClass}">${task.status}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-icon btn-edit" onclick="handleEdit('${task.id}')" aria-label="Edit task">
                    Edit
                </button>
                <button class="btn btn-icon btn-delete" onclick="handleDelete('${task.id}')" aria-label="Delete task">
                    Delete
                </button>
            </div>
        </article>
    `;
}

function renderTasks() {
    if (state.tasks.length === 0) {
        elements.taskGrid.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
    } else {
        elements.emptyState.classList.add('hidden');
        elements.taskGrid.classList.remove('hidden');
        elements.taskGrid.innerHTML = state.tasks.map(renderTask).join('');
    }
}

function showLoading() {
    elements.loadingState.classList.remove('hidden');
    elements.errorState.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
    elements.taskGrid.classList.add('hidden');
}

function hideLoading() {
    elements.loadingState.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    elements.errorState.classList.remove('hidden');
    elements.emptyState.classList.add('hidden');
    elements.taskGrid.classList.add('hidden');
    elements.errorMessage.textContent = message;
}

function hideError() {
    elements.errorState.classList.add('hidden');
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================
function openTaskModal(editMode = false) {
    elements.modalTitle.textContent = editMode ? 'Edit Task' : 'Create Task';
    elements.submitBtn.querySelector('.btn-text').textContent = editMode ? 'Save Changes' : 'Create Task';

    if (editMode) {
        elements.statusGroup.classList.remove('hidden');
    } else {
        elements.statusGroup.classList.add('hidden');
    }

    elements.taskModal.classList.remove('hidden');
    elements.title.focus();

    // Trap focus in modal
    document.addEventListener('keydown', handleModalKeydown);
}

function closeTaskModal() {
    elements.taskModal.classList.add('hidden');
    clearFormErrors();
    elements.taskForm.reset();
    state.editingTaskId = null;

    document.removeEventListener('keydown', handleModalKeydown);
}

function openDeleteModal(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    state.deleteTaskId = taskId;
    elements.taskToDelete.textContent = `"${task.title}"`;
    elements.deleteModal.classList.remove('hidden');
    elements.deleteCancelBtn.focus();

    document.addEventListener('keydown', handleDeleteModalKeydown);
}

function closeDeleteModal() {
    elements.deleteModal.classList.add('hidden');
    state.deleteTaskId = null;

    document.removeEventListener('keydown', handleDeleteModalKeydown);
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeTaskModal();
    }
}

function handleDeleteModalKeydown(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
}

// ==========================================
// FORM HANDLING
// ==========================================
function clearFormErrors() {
    elements.titleError.textContent = '';
    elements.title.classList.remove('error');
}

function validateForm() {
    let isValid = true;
    clearFormErrors();

    if (!elements.title.value.trim()) {
        elements.titleError.textContent = 'Title is required';
        isValid = false;
    }

    return isValid;
}

function populateEditForm(task) {
    elements.taskId.value = task.id;
    elements.title.value = task.title || '';
    elements.description.value = task.description || '';
    elements.dueDate.value = task.dueDate || '';
    elements.priority.value = task.priority || 'MEDIUM';
    elements.status.value = task.status || 'OPEN';
}

function setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnSpinner = button.querySelector('.btn-spinner');

    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        btnText.style.visibility = 'hidden';
        btnSpinner.classList.remove('hidden');
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        btnText.style.visibility = 'visible';
        btnSpinner.classList.add('hidden');
    }
}

// ==========================================
// EVENT HANDLERS
// ==========================================
async function loadTasks() {
    showLoading();
    state.loading = true;
    state.error = null;

    try {
        state.tasks = await api.fetchAllTasks();
        hideLoading();
        hideError();
        renderTasks();
        renderTaskCount();
    } catch (error) {
        console.error('Failed to load tasks:', error);
        state.error = error.message;
        showError(error.message);
    } finally {
        state.loading = false;
    }
}

function handleCreateTask() {
    state.editingTaskId = null;
    elements.taskForm.reset();
    elements.priority.value = 'MEDIUM';
    openTaskModal(false);
}

function handleEdit(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    state.editingTaskId = taskId;
    populateEditForm(task);
    openTaskModal(true);
}

function handleDelete(taskId) {
    openDeleteModal(taskId);
}

async function handleToggleComplete(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'COMPLETE' ? 'OPEN' : 'COMPLETE';
    const originalStatus = task.status;

    // Optimistic update
    task.status = newStatus;
    renderTasks();

    try {
        await api.updateTask(taskId, {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: newStatus
        });

        showToast('success', 'Task Updated', `Task marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
        // Revert on error
        task.status = originalStatus;
        renderTasks();
        showToast('error', 'Update Failed', error.message);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const taskData = {
        title: elements.title.value.trim(),
        description: elements.description.value.trim(),
        dueDate: elements.dueDate.value || null,
        priority: elements.priority.value
    };

    if (state.editingTaskId) {
        taskData.status = elements.status.value;
    }

    setButtonLoading(elements.submitBtn, true);

    try {
        if (state.editingTaskId) {
            await api.updateTask(state.editingTaskId, taskData);
            showToast('success', 'Task Updated', 'Your changes have been saved');
        } else {
            await api.createTask(taskData);
            showToast('success', 'Task Created', 'New task has been added');
        }

        closeTaskModal();
        await loadTasks();
    } catch (error) {
        console.error('Failed to save task:', error);

        // Check if it's a validation error
        if (error.message.includes('title') || error.message.includes('Title')) {
            elements.titleError.textContent = error.message;
        } else {
            showToast('error', 'Save Failed', error.message);
        }
    } finally {
        setButtonLoading(elements.submitBtn, false);
    }
}

async function handleConfirmDelete() {
    if (!state.deleteTaskId) return;

    setButtonLoading(elements.deleteConfirmBtn, true);

    try {
        await api.deleteTask(state.deleteTaskId);
        showToast('success', 'Task Deleted', 'Task has been removed');
        closeDeleteModal();
        await loadTasks();
    } catch (error) {
        console.error('Failed to delete task:', error);
        showToast('error', 'Delete Failed', error.message);
    } finally {
        setButtonLoading(elements.deleteConfirmBtn, false);
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
elements.createTaskBtn.addEventListener('click', handleCreateTask);
elements.emptyCreateBtn.addEventListener('click', handleCreateTask);
elements.retryBtn.addEventListener('click', loadTasks);

elements.modalCloseBtn.addEventListener('click', closeTaskModal);
elements.cancelBtn.addEventListener('click', closeTaskModal);
elements.taskForm.addEventListener('submit', handleFormSubmit);

elements.deleteCancelBtn.addEventListener('click', closeDeleteModal);
elements.deleteConfirmBtn.addEventListener('click', handleConfirmDelete);

// Close modal when clicking overlay
elements.taskModal.addEventListener('click', (e) => {
    if (e.target === elements.taskModal) {
        closeTaskModal();
    }
});

elements.deleteModal.addEventListener('click', (e) => {
    if (e.target === elements.deleteModal) {
        closeDeleteModal();
    }
});

// ==========================================
// MAKE FUNCTIONS GLOBAL
// ==========================================
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;
window.handleToggleComplete = handleToggleComplete;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});
