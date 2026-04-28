// Register function
async function register(formData) {
  const API_URL = 'http://localhost:8080/register';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('✓ Registration successful! Redirecting to login page...');
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return data;
    } else {
      alert(`✗ Registration failed: ${data.message || 'An error occurred'}`);
      console.error('Registration error:', data);
      return null;
    }
  } catch (error) {
    alert(`✗ Network error: ${error.message}`);
    console.error('Network error:', error);
    return null;
  }
}

// Login function
async function login(credentials) {
  const API_URL = 'http://localhost:8080/login';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Store JWT token in localStorage
      localStorage.setItem('jwtToken', data.token);

      // Store user info if available
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      alert('✓ Login successful! Redirecting to dashboard...');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);

      return data;
    } else {
      alert(`✗ Login failed: ${data.message || 'Invalid credentials'}`);
      console.error('Login error:', data);
      return null;
    }
  } catch (error) {
    alert(`✗ Network error: ${error.message}`);
    console.error('Network error:', error);
    return null;
  }
}

// Logout function
function logout() {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Get JWT token
function getJWTToken() {
  return localStorage.getItem('jwtToken');
}

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('jwtToken');
}

// Get logged-in user info
function getUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

// Reusable API fetch function
async function apiFetch(endpoint, options = {}) {
  const API_BASE_URL = 'http://localhost:8080';
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getJWTToken();

  // Set default method to GET
  const method = options.method || 'GET';

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach JWT token if user is logged in
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Build request options
  const fetchOptions = {
    method,
    headers,
    ...options,
  };

  // Add body for POST/PUT/PATCH requests
  if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data: data,
      error: !response.ok ? (data?.message || `Error: ${response.status}`) : null,
    };
  } catch (error) {
    console.error('API Fetch Error:', error);
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message,
    };
  }
}

// Booking function
async function bookService(bookingData) {
  const API_URL = 'http://localhost:8080/book';
  const token = getJWTToken();

  // Check if user is logged in
  if (!token) {
    alert('✗ You must be logged in to book a service');
    window.location.href = 'login.html';
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('✓ Booking confirmed! Redirecting to your bookings...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'my-bookings.html';
      }, 2000);

      return data;
    } else {
      alert(`✗ Booking failed: ${data.message || 'An error occurred'}`);
      console.error('Booking error:', data);
      return null;
    }
  } catch (error) {
    alert(`✗ Network error: ${error.message}`);
    console.error('Network error:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  // Update navigation based on login status
  const dashboardLinks = document.querySelectorAll('#dashboardLink');
  const loginLinks = document.querySelectorAll('a[href="login.html"]');
  const registerLinks = document.querySelectorAll('a[href="register.html"]');
  
  if (isLoggedIn()) {
    dashboardLinks.forEach(link => link.style.display = 'block');
    loginLinks.forEach(link => {
      if (link.id !== 'loginLink' && !link.textContent.includes('Login')) {
        link.style.display = 'none';
      }
    });
    registerLinks.forEach(link => {
      if (link.id !== 'registerLink') {
        link.style.display = 'none';
      }
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link, .nav-chip').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const searchBox = document.querySelector('[data-customer-search]');
  const cards = document.querySelectorAll('[data-service-card]');

  if (searchBox && cards.length) {
    searchBox.addEventListener('input', (event) => {
      const term = event.target.value.trim().toLowerCase();
      cards.forEach((card) => {
        const key = card.getAttribute('data-key') || '';
        card.style.display = key.includes(term) ? '' : 'none';
      });
    });

    document.querySelectorAll('.search-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const value = chip.textContent.trim();
        searchBox.value = value;
        searchBox.dispatchEvent(new Event('input', { bubbles: true }));
        searchBox.focus();
      });
    });
  }

  const bookingForm = document.querySelector('[data-booking-form]');
  const bookingAlert = document.querySelector('[data-booking-alert]');

  if (bookingForm && bookingAlert) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      bookingAlert.classList.remove('d-none');
      bookingAlert.textContent = 'Your booking request has been submitted. The selected provider will be notified shortly.';
      bookingForm.reset();
    });
  }

  // Register form submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Collect form data
      const formData = {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        location: document.getElementById('location').value,
      };

      // Send registration request
      await register(formData);
    });
  }
});
