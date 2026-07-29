/* ============================================
   HopeAI Kids - Utility Functions
   ============================================ */

// Format date to locale string
function formatDate(date, locale = 'fr-FR') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format time to locale string
function formatTime(date, locale = 'fr-FR') {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format date for display
function formatDateTime(date) {
  return `${formatDate(date)} à ${formatTime(date)}`;
}

// Get relative time (e.g., "il y a 5 minutes")
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  return formatDate(date);
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Local storage helpers
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }
};

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('8 caractères minimum');
  if (!/[A-Z]/.test(password)) errors.push('une majuscule');
  if (!/[a-z]/.test(password)) errors.push('une minuscule');
  if (!/[0-9]/.test(password)) errors.push('un chiffre');
  return errors;
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text
function truncate(str, length = 100) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Calculate age from birth date
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random item from array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Format percentage
function formatPercentage(value, total) {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
}

// Get days of week in French
const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Get months in French
const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juliet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Export utilities
window.utils = {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  generateId,
  debounce,
  throttle,
  storage,
  isValidEmail,
  validatePassword,
  sanitizeHTML,
  escapeRegex,
  capitalize,
  truncate,
  getInitials,
  calculateAge,
  deepClone,
  isEmpty,
  randomInt,
  randomItem,
  shuffleArray,
  formatNumber,
  formatPercentage,
  daysOfWeek,
  months
};
