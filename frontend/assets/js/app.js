document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

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
});
