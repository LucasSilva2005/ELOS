const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  mainContent.classList.toggle('shift');
});
