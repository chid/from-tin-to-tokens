// Theme management
(function() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button
  const themeBtn = document.querySelector('.theme-toggle-btn');
  if (themeBtn) {
    const updateIcon = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeBtn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
    };
    updateIcon();
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const target = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('theme', target);
      updateIcon();
    });
  }

  // Mobile Sidebar Toggle
  const sidebar = document.querySelector('.book-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  const backdrop = document.querySelector('.sidebar-backdrop');
  if (toggleBtn && sidebar && backdrop) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('active');
    });
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  // Sidebar Search Filter
  const searchInput = document.querySelector('#sidebar-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const links = document.querySelectorAll('.nav-link');
      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          link.style.display = 'flex';
        } else {
          link.style.display = 'none';
        }
      });
      // Show/hide part headers
      document.querySelectorAll('.nav-part-header').forEach(header => {
        let next = header.nextElementSibling;
        let anyVisible = false;
        while (next && next.classList.contains('nav-link')) {
          if (next.style.display !== 'none') {
            anyVisible = true;
            break;
          }
          next = next.nextElementSibling;
        }
        header.style.display = anyVisible ? 'block' : 'none';
      });
    });
  }

  // Copy buttons on code blocks
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      } catch (err) {
        btn.textContent = 'Failed';
      }
    });
    pre.appendChild(btn);
  });

  // Keyboard navigation (ArrowLeft: Prev, ArrowRight: Next)
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft') {
      const prevLink = document.querySelector('.pager-card.prev');
      if (prevLink) prevLink.click();
    } else if (e.key === 'ArrowRight') {
      const nextLink = document.querySelector('.pager-card.next');
      if (nextLink) nextLink.click();
    }
  });
});
