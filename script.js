// 1. Filter Widgets Logic
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const selectedCategory = button.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (selectedCategory === 'all' || cardCategory === selectedCategory) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// 2. Interactive Case Study Gallery Modal Logic
const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalStatus = document.getElementById('modalStatus');
const modalProblem = document.getElementById('modalProblem');
const modalProcess = document.getElementById('modalProcess');
const modalImage = document.getElementById('modalImage');
const placeholder = document.getElementById('imgPlaceholder');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const slideCounter = document.getElementById('slideCounter');
const thumbnailBar = document.getElementById('thumbnailBar');

let currentImages = [];
let currentIndex = 0;

function updateSlide() {
  if (currentImages.length === 0) return;

  // Reset image visibility before loading
  modalImage.style.display = 'block';
  placeholder.style.display = 'none';
  modalImage.src = currentImages[currentIndex];

  // Show helpful fallback if file hasn't been exported to assets/ yet
  modalImage.onerror = () => {
    modalImage.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholder.textContent = `Missing file: ${currentImages[currentIndex]} — export this screen from Figma into your assets/ folder!`;
  };

  slideCounter.textContent = `Screen ${currentIndex + 1} of ${currentImages.length}`;

  // Update active screen pill button
  const pills = thumbnailBar.querySelectorAll('.thumb-dot');
  pills.forEach((pill, idx) => {
    pill.classList.toggle('active', idx === currentIndex);
  });
}

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.getAttribute('data-title');
    modalStatus.textContent = card.getAttribute('data-status');
    modalProblem.textContent = card.getAttribute('data-problem');
    modalProcess.textContent = card.getAttribute('data-process');

    // Parse comma-separated image list
    const rawImages = card.getAttribute('data-images') || '';
    currentImages = rawImages.split(',').map(item => item.trim()).filter(Boolean);
    currentIndex = 0;

    // Build clickable "Screen 1", "Screen 2", "Screen 3" buttons
    thumbnailBar.innerHTML = '';
    currentImages.forEach((_, index) => {
      const btn = document.createElement('button');
      btn.className = 'thumb-dot';
      btn.textContent = `Screen ${index + 1}`;
      btn.addEventListener('click', () => {
        currentIndex = index;
        updateSlide();
      });
      thumbnailBar.appendChild(btn);
    });

    updateSlide();
    modal.classList.add('open');
  });
});

// Arrow navigation & Keyboard Left/Right support
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateSlide();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateSlide();
});

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'Escape') modal.classList.remove('open');
});

closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});