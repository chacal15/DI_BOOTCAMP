/* ============================================
   HopeAI Kids - Main Application
   ============================================ */

// Application State
const AppState = {
  currentUser: null,
  isAuthenticated: false,
  theme: 'light',
  sidebarOpen: false,
  children: [],
  users: [],
  activities: [],
  attendance: [],
  notifications: []
};

// Demo Data
const DemoData = {
  children: [
    {
      id: 'c1',
      name: 'Aminata Koné',
      age: 8,
      birthDate: '2018-03-15',
      class: 'CM1',
      avatar: null,
      favoriteActivities: ['lecture', 'dessin'],
      progress: { quizzes: 12, stories: 5, games: 8 },
      totalXP: 450,
      level: 3,
      createdAt: '2024-01-10'
    },
    {
      id: 'c2',
      name: 'Ibrahim Traoré',
      age: 10,
      birthDate: '2016-07-22',
      class: 'CM2',
      avatar: null,
      favoriteActivities: ['mathematiques', 'jeux'],
      progress: { quizzes: 24, stories: 3, games: 15 },
      totalXP: 780,
      level: 5,
      createdAt: '2024-01-05'
    },
    {
      id: 'c3',
      name: 'Fatou Diallo',
      age: 7,
      birthDate: '2019-11-08',
      class: 'CE2',
      avatar: null,
      favoriteActivities: ['lecture', 'histoires'],
      progress: { quizzes: 8, stories: 12, games: 6 },
      totalXP: 320,
      level: 2,
      createdAt: '2024-02-01'
    },
    {
      id: 'c4',
      name: 'Moussa Sangaré',
      age: 9,
      birthDate: '2017-05-30',
      class: 'CM1',
      avatar: null,
      favoriteActivities: ['science', 'jeux'],
      progress: { quizzes: 18, stories: 4, games: 20 },
      totalXP: 560,
      level: 4,
      createdAt: '2024-01-15'
    },
    {
      id: 'c5',
      name: 'Aïcha Ouattara',
      age: 6,
      birthDate: '2020-02-14',
      class: 'CP',
      avatar: null,
      favoriteActivities: ['lecture', 'dessin', 'jeux'],
      progress: { quizzes: 5, stories: 8, games: 10 },
      totalXP: 210,
      level: 1,
      createdAt: '2024-02-10'
    }
  ],
  
  users: [
    {
      id: 'u1',
      name: 'Marie Dupont',
      email: 'marie.dupont@hopeai.org',
      password: 'Admin123!',
      role: 'admin',
      avatar: null,
      createdAt: '2024-01-01'
    },
    {
      id: 'u2',
      name: 'Jean Kouassi',
      email: 'jean.kouassi@hopeai.org',
      password: 'Responsable123!',
      role: 'responsable',
      avatar: null,
      createdAt: '2024-01-05'
    },
    {
      id: 'u3',
      name: 'Sophie Martin',
      email: 'sophie.martin@hopeai.org',
      password: 'Educateur123!',
      role: 'educateur',
      avatar: null,
      createdAt: '2024-01-10'
    }
  ],
  
  attendance: [
    { id: 'a1', childId: 'c1', date: '2024-03-18', status: 'present', checkIn: '08:30', checkOut: '17:00' },
    { id: 'a2', childId: 'c2', date: '2024-03-18', status: 'present', checkIn: '08:25', checkOut: '17:15' },
    { id: 'a3', childId: 'c3', date: '2024-03-18', status: 'late', checkIn: '09:00', checkOut: '17:00' },
    { id: 'a4', childId: 'c4', date: '2024-03-18', status: 'present', checkIn: '08:15', checkOut: '17:30' },
    { id: 'a5', childId: 'c5', date: '2024-03-18', status: 'present', checkIn: '08:45', checkOut: '17:00' },
    { id: 'a6', childId: 'c1', date: '2024-03-17', status: 'present', checkIn: '08:30', checkOut: '17:00' },
    { id: 'a7', childId: 'c2', date: '2024-03-17', status: 'absent', checkIn: null, checkOut: null },
    { id: 'a8', childId: 'c3', date: '2024-03-17', status: 'present', checkIn: '08:30', checkOut: '17:00' },
    { id: 'a9', childId: 'c4', date: '2024-03-17', status: 'present', checkIn: '08:20', checkOut: '17:00' },
    { id: 'a10', childId: 'c5', date: '2024-03-17', status: 'present', checkIn: '08:40', checkOut: '17:00' }
  ],
  
  activities: [
    { id: 'act1', childId: 'c1', type: 'quiz', title: 'Quiz de Mathématiques', score: 85, xp: 85, date: '2024-03-18T10:30:00' },
    { id: 'act2', childId: 'c2', type: 'story', title: 'Histoire: Le Lion et la Souris', xp: 30, date: '2024-03-18T11:00:00' },
    { id: 'act3', childId: 'c3', type: 'game', title: 'Memory des Animaux', score: 100, xp: 50, date: '2024-03-18T14:00:00' },
    { id: 'act4', childId: 'c4', type: 'quiz', title: 'Quiz de Sciences', score: 92, xp: 92, date: '2024-03-18T15:30:00' },
    { id: 'act5', childId: 'c1', type: 'homework', title: 'Exercice de Lecture', xp: 40, date: '2024-03-18T09:00:00' },
    { id: 'act6', childId: 'c5', type: 'game', title: 'Puzzle des Couleurs', xp: 35, date: '2024-03-17T16:00:00' },
    { id: 'act7', childId: 'c3', type: 'story', title: 'Histoire: Les Trois Petits Cochons', xp: 25, date: '2024-03-17T10:00:00' }
  ],
  
  notifications: [
    { id: 'n1', type: 'success', title: 'Bienvenue!', message: 'Connexion réussie', time: new Date() },
    { id: 'n2', type: 'info', title: 'Nouvel enfant', message: 'Aïcha Ouattara a été ajoutée', time: new Date(Date.now() - 3600000) },
    { id: 'n3', type: 'warning', title: 'Absence', message: 'Ibrahim Traoré absent aujourd\'hui', time: new Date(Date.now() - 7200000) }
  ]
};

// Build fresh demo data with dates relative to the day the app is first opened.
// This keeps the dashboard and attendance screen useful instead of displaying 2024 data.
function dateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function createFreshDemoData() {
  const data = JSON.parse(JSON.stringify(DemoData));
  const now = new Date();
  const today = dateKey(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = dateKey(yesterdayDate);

  data.attendance = data.attendance.map((record, index) => ({
    ...record,
    date: index < 5 ? today : yesterday
  }));

  const activityHoursAgo = [1, 2, 3, 4, 5, 25, 29];
  data.activities = data.activities.map((activity, index) => ({
    ...activity,
    date: new Date(now.getTime() - activityHoursAgo[index] * 60 * 60 * 1000).toISOString()
  }));
  data.notifications = data.notifications.map((notification, index) => ({
    ...notification,
    time: new Date(now.getTime() - index * 60 * 60 * 1000).toISOString()
  }));

  return data;
}

// Initialize demo data if not exists
function initializeDemoData() {
  if (!utils.storage.get('hopeai_initialized')) {
    const demoData = createFreshDemoData();
    utils.storage.set('hopeai_children', demoData.children);
    utils.storage.set('hopeai_users', demoData.users);
    utils.storage.set('hopeai_attendance', demoData.attendance);
    utils.storage.set('hopeai_activities', demoData.activities);
    utils.storage.set('hopeai_notifications', demoData.notifications);
    utils.storage.set('hopeai_initialized', true);
  }
  
  // Load data into state
  AppState.children = utils.storage.get('hopeai_children', []);
  AppState.users = utils.storage.get('hopeai_users', []);
  AppState.attendance = utils.storage.get('hopeai_attendance', []);
  AppState.activities = utils.storage.get('hopeai_activities', []);
  AppState.notifications = utils.storage.get('hopeai_notifications', []);
}

// Theme Management
function initTheme() {
  const savedTheme = utils.storage.get('theme', 'light');
  setTheme(savedTheme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!utils.storage.get('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

function setTheme(theme) {
  AppState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  utils.storage.set('theme', theme);
  
  // Update theme toggle buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.innerHTML = theme === 'dark' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  });
}

function toggleTheme() {
  setTheme(AppState.theme === 'light' ? 'dark' : 'light');
}

// Authentication
function initAuth() {
  const savedUser = utils.storage.get('currentUser');
  if (savedUser) {
    AppState.currentUser = savedUser;
    AppState.isAuthenticated = true;
  }
}

function login(email, password) {
  const user = AppState.users.find(u => u.email === email && u.password === password);
  if (user) {
    AppState.currentUser = user;
    AppState.isAuthenticated = true;
    utils.storage.set('currentUser', user);
    return { success: true, user };
  }
  return { success: false, error: 'Email ou mot de passe incorrect' };
}

function logout() {
  AppState.currentUser = null;
  AppState.isAuthenticated = false;
  utils.storage.remove('currentUser');
  window.location.href = 'login.html';
}

function checkAuth() {
  if (!AppState.isAuthenticated && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Toast Notifications
function showToast(type, title, message, duration = 5000) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${getToastIcon(type)}
    </svg>
    <div class="toast-content">
      <div class="toast-title">${utils.sanitizeHTML(title)}</div>
      <div class="toast-message">${utils.sanitizeHTML(message)}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function getToastIcon(type) {
  const icons = {
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
    error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
    info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
  };
  return icons[type] || icons.info;
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Modal Management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal) {
    modal.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal) {
    modal.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize modals
function initModals() {
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.classList.remove('active');
      document.querySelector('.modal-backdrop')?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      backdrop.classList.remove('active');
      document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    });
  });
}

// Sidebar Toggle (Mobile)
function toggleSidebar() {
  AppState.sidebarOpen = !AppState.sidebarOpen;
  document.querySelector('.sidebar')?.classList.toggle('open', AppState.sidebarOpen);
}

// Dropdown Toggle
function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown.active').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });
    }
  });
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
  });
}

// Tab Navigation
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('[data-tab]');
    const contents = document.querySelectorAll(`[data-tabs-content="${tabGroup.dataset.tabs}"]`);
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.querySelector(`[data-tabs-content="${tabGroup.dataset.tabs}"] [data-tab-content="${target}"]`)?.classList.add('active');
      });
    });
  });
}

// Search functionality
function initSearch(inputSelector, listSelector, itemSelector, searchFields) {
  const searchInput = document.querySelector(inputSelector);
  const list = document.querySelector(listSelector);
  
  if (!searchInput || !list) return;
  
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase().trim();
    
    document.querySelectorAll(itemSelector).forEach(item => {
      const text = searchFields.map(field => (item.dataset[field] || '').toLowerCase()).join(' ');
      item.style.display = text.includes(query) || query === '' ? '' : 'none';
    });
  }, 200));
}

// Chart Initialization
function initCharts() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }
  
  // Attendance Chart
  const attendanceCtx = document.getElementById('attendanceChart');
  if (attendanceCtx) {
    new Chart(attendanceCtx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
        datasets: [{
          label: 'Présences',
          data: [12, 11, 12, 10, 12],
          borderColor: '#6C63FF',
          backgroundColor: 'rgba(108, 99, 255, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  // Activities Chart
  const activitiesCtx = document.getElementById('activitiesChart');
  if (activitiesCtx) {
    new Chart(activitiesCtx, {
      type: 'doughnut',
      data: {
        labels: ['Quiz', 'Histoires', 'Jeux', 'Devoirs'],
        datasets: [{
          data: [35, 25, 30, 10],
          backgroundColor: ['#6C63FF', '#FF6B9D', '#00D9A5', '#FFB547']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

// Render functions
function renderChildrenList() {
  const container = document.getElementById('childrenList');
  if (!container) return;
  
  container.innerHTML = AppState.children.map(child => `
    <div class="child-card animate-fade-in-up" data-child-id="${child.id}">
      <div class="child-card-header">
        <div class="avatar avatar-lg" style="background: linear-gradient(135deg, ${getAvatarGradient(child.name)})">
          ${utils.getInitials(child.name)}
        </div>
        <div class="child-card-info">
          <h4>${utils.sanitizeHTML(child.name)}</h4>
          <p>${child.class} • ${child.age} ans</p>
        </div>
      </div>
      <div class="child-card-stats">
        <div class="child-stat">
          <div class="child-stat-value">${child.progress.quizzes}</div>
          <div class="child-stat-label">Quiz</div>
        </div>
        <div class="child-stat">
          <div class="child-stat-value">${child.progress.stories}</div>
          <div class="child-stat-label">Histoires</div>
        </div>
        <div class="child-stat">
          <div class="child-stat-value">${child.progress.games}</div>
          <div class="child-stat-label">Jeux</div>
        </div>
        <div class="child-stat">
          <div class="child-stat-value">${child.totalXP}</div>
          <div class="child-stat-label">XP</div>
        </div>
      </div>
      <div class="child-card-actions">
        <button class="btn btn-sm btn-ghost" onclick="viewChildDetail('${child.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Voir
        </button>
        <button class="btn btn-sm btn-primary" onclick="editChild('${child.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Modifier
        </button>
      </div>
    </div>
  `).join('');
}

function getAvatarGradient(name) {
  const colors = [
    ['#6C63FF', '#8B85FF'],
    ['#FF6B9D', '#FF8FB6'],
    ['#00D9A5', '#33E3B8'],
    ['#FFB547', '#FFC570']
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index].join(', ');
}

// Render attendance table
function renderAttendanceTable(date = null) {
  const container = document.getElementById('attendanceTable');
  if (!container) return;
  
  const targetDate = date || dateKey(new Date());
  const dayAttendance = AppState.attendance.filter(a => a.date === targetDate);
  
  container.innerHTML = AppState.children.map(child => {
    const attendance = dayAttendance.find(a => a.childId === child.id) || { status: 'absent', checkIn: null, checkOut: null };
    return `
      <tr data-child-id="${child.id}">
        <td>
          <div class="attendance-student">
            <div class="avatar" style="background: linear-gradient(135deg, ${getAvatarGradient(child.name)})">
              ${utils.getInitials(child.name)}
            </div>
            <div>
              <div style="font-weight: 600">${utils.sanitizeHTML(child.name)}</div>
              <div style="font-size: 12px; color: var(--text-secondary)">${child.class}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="attendance-status ${attendance.status}">
            ${attendance.status === 'present' ? '✓ Présent' : attendance.status === 'late' ? '⚠ Retard' : '✗ Absent'}
          </span>
        </td>
        <td>${attendance.checkIn || '-'}</td>
        <td>${attendance.checkOut || '-'}</td>
        <td>
          <div class="table-actions">
            ${attendance.status === 'absent' ? `
              <button class="btn btn-sm btn-success" onclick="markPresent('${child.id}')">Arrivée</button>
            ` : attendance.status !== 'absent' && !attendance.checkOut ? `
              <button class="btn btn-sm btn-secondary" onclick="markDeparture('${child.id}')">Départ</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Update summary
  updateAttendanceSummary(targetDate);
}

function updateAttendanceSummary(date) {
  const dayAttendance = AppState.attendance.filter(a => a.date === date);
  const present = dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const absent = AppState.children.length - present;
  const late = dayAttendance.filter(a => a.status === 'late').length;
  
  const presentEl = document.querySelector('.summary-stat.present .summary-stat-value');
  const absentEl = document.querySelector('.summary-stat.absent .summary-stat-value');
  const lateEl = document.querySelector('.summary-stat.late .summary-stat-value');
  
  if (presentEl) presentEl.textContent = present;
  if (absentEl) absentEl.textContent = absent;
  if (lateEl) lateEl.textContent = late;
}

// Activity functions
function markPresent(childId) {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);
  
  const attendance = {
    id: utils.generateId(),
    childId,
    date: dateKey(now),
    status: parseInt(timeStr.split(':')[0]) >= 9 ? 'late' : 'present',
    checkIn: timeStr,
    checkOut: null
  };
  
  AppState.attendance.push(attendance);
  utils.storage.set('hopeai_attendance', AppState.attendance);
  renderAttendanceTable();
  showToast('success', 'Enregistré', 'Arrivée enregistrée avec succès');
}

function markDeparture(childId) {
  const today = dateKey(new Date());
  const attendance = AppState.attendance.find(a => a.childId === childId && a.date === today);
  
  if (attendance) {
    attendance.checkOut = new Date().toTimeString().slice(0, 5);
    utils.storage.set('hopeai_attendance', AppState.attendance);
    renderAttendanceTable();
    showToast('success', 'Départ', 'Départ enregistré avec succès');
  }
}

// Child CRUD operations
function addChild(childData) {
  const newChild = {
    id: utils.generateId(),
    ...childData,
    progress: { quizzes: 0, stories: 0, games: 0 },
    totalXP: 0,
    level: 1,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  AppState.children.push(newChild);
  utils.storage.set('hopeai_children', AppState.children);
  renderChildrenList();
  showToast('success', 'Enfant ajouté', `${newChild.name} a été ajouté avec succès`);
}

function updateChild(childId, childData) {
  const index = AppState.children.findIndex(c => c.id === childId);
  if (index !== -1) {
    AppState.children[index] = { ...AppState.children[index], ...childData };
    utils.storage.set('hopeai_children', AppState.children);
    renderChildrenList();
    showToast('success', 'Modifié', 'Les informations ont été mises à jour');
  }
}

function deleteChild(childId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
    AppState.children = AppState.children.filter(c => c.id !== childId);
    utils.storage.set('hopeai_children', AppState.children);
    renderChildrenList();
    showToast('success', 'Supprimé', 'L\'enfant a été supprimé');
  }
}

function viewChildDetail(childId) {
  const child = AppState.children.find(c => c.id === childId);
  if (!child) return;
  
  const modal = document.getElementById('childDetailModal');
  if (modal) {
    modal.querySelector('.child-detail-info h3').textContent = child.name;
    modal.querySelector('.child-detail-info p').textContent = `${child.class} • ${child.age} ans`;
    
    // Update other details
    modal.querySelector('[data-field="birthDate"]').textContent = utils.formatDate(child.birthDate);
    modal.querySelector('[data-field="progress"]').textContent = `${child.progress.quizzes + child.progress.stories + child.progress.games} activités`;
    modal.querySelector('[data-field="xp"]').textContent = `${child.totalXP} XP`;
    modal.querySelector('[data-field="level"]').textContent = `Niveau ${child.level}`;
    
    openModal('childDetailModal');
  }
}

function editChild(childId) {
  const child = AppState.children.find(c => c.id === childId);
  if (!child) return;
  
  // Populate form
  const form = document.getElementById('childForm');
  if (form) {
    form.querySelector('[name="name"]').value = child.name;
    form.querySelector('[name="age"]').value = child.age;
    form.querySelector('[name="class"]').value = child.class;
    form.querySelector('[name="birthDate"]').value = child.birthDate;
    form.dataset.editingId = child.id;
  }
  
  closeModal('childDetailModal');
  openModal('childModal');
}

// Form handling
function initForms() {
  const childForm = document.getElementById('childForm');
  if (childForm) {
    childForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(childForm);
      const data = Object.fromEntries(formData);
      data.age = parseInt(data.age);
      
      if (childForm.dataset.editingId) {
        updateChild(childForm.dataset.editingId, data);
        delete childForm.dataset.editingId;
      } else {
        addChild(data);
      }
      
      childForm.reset();
      closeModal('childModal');
    });
  }
  
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('[name="email"]').value;
      const password = loginForm.querySelector('[name="password"]').value;
      
      const result = login(email, password);
      if (result.success) {
        showToast('success', 'Bienvenue!', `Connexion réussie en tant que ${result.user.role}`);
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        showToast('error', 'Erreur', result.error);
      }
    });
  }
}

// Dashboard statistics
function updateDashboardStats() {
  // Update children count
  const childrenCount = document.querySelector('[data-stat="children"]');
  if (childrenCount) childrenCount.textContent = AppState.children.length;
  
  // Update educators count
  const educatorsCount = document.querySelector('[data-stat="educators"]');
  if (educatorsCount) educatorsCount.textContent = AppState.users.filter(u => u.role === 'educateur').length;
  
  // Update today's activity count
  const today = dateKey(new Date());
  const activitiesCount = document.querySelector('[data-stat="activities"]');
  const activitiesToday = AppState.activities.filter(activity => dateKey(new Date(activity.date)) === today).length;
  if (activitiesCount) activitiesCount.textContent = activitiesToday;
  
  // Update today's attendance
  const todayAttendance = AppState.attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status !== 'absent').length;
  const attendanceRate = document.querySelector('[data-stat="attendance"]');
  if (attendanceRate) attendanceRate.textContent = `${Math.round((presentToday / AppState.children.length) * 100)}%`;
}

// Render activities list
function renderActivitiesList() {
  const container = document.getElementById('activitiesList');
  if (!container) return;
  
  const activityIcons = {
    quiz: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    story: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    game: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>',
    homework: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
  };
  
  const activityColors = {
    quiz: 'var(--color-primary)',
    story: 'var(--color-secondary)',
    game: 'var(--color-accent-1)',
    homework: 'var(--color-accent-2)'
  };
  
  container.innerHTML = AppState.activities.slice(0, 10).map(activity => {
    const child = AppState.children.find(c => c.id === activity.childId);
    return `
      <div class="activity-item">
        <div class="activity-icon" style="color: ${activityColors[activity.type]}">
          ${activityIcons[activity.type]}
        </div>
        <div class="activity-content">
          <div class="activity-title">${utils.sanitizeHTML(activity.title)}</div>
          <div class="activity-meta">${child ? child.name : 'Unknown'} • ${activity.xp} XP</div>
        </div>
        <div class="activity-time">${utils.getRelativeTime(activity.date)}</div>
      </div>
    `;
  }).join('');
}

// Render notifications
function renderNotifications() {
  const container = document.getElementById('notificationsList');
  if (!container) return;
  
  container.innerHTML = AppState.notifications.map(notif => `
    <div class="notification-item" data-notif-id="${notif.id}">
      <div class="notification-icon ${notif.type}">
        ${getNotificationIcon(notif.type)}
      </div>
      <div class="notification-content">
        <div class="notification-title">${utils.sanitizeHTML(notif.title)}</div>
        <div class="notification-message">${utils.sanitizeHTML(notif.message)}</div>
        <div class="notification-time">${utils.getRelativeTime(notif.time)}</div>
      </div>
    </div>
  `).join('');
}

function getNotificationIcon(type) {
  const icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };
  return icons[type] || icons.info;
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initializeDemoData();
  initTheme();
  initAuth();
  initModals();
  initDropdowns();
  initTabs();
  initForms();
  
  // Load Chart.js if on dashboard
  if (document.getElementById('attendanceChart') || document.getElementById('activitiesChart')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = initCharts;
    document.head.appendChild(script);
  }
  
  // Update page-specific content
  if (document.getElementById('childrenList')) renderChildrenList();
  if (document.getElementById('attendanceTable')) renderAttendanceTable();
  if (document.getElementById('activitiesList')) {
    renderActivitiesList();
    updateDashboardStats();
  }
  if (document.getElementById('notificationsList')) renderNotifications();
  
  // Check authentication
  checkAuth();
});

// Export for global use
window.App = {
  state: AppState,
  utils,
  showToast,
  openModal,
  closeModal,
  toggleTheme,
  toggleSidebar,
  logout,
  login,
  renderChildrenList,
  renderAttendanceTable,
  renderActivitiesList,
  addChild,
  updateChild,
  deleteChild,
  viewChildDetail,
  editChild,
  markPresent,
  markDeparture,
  updateDashboardStats
};
