const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');
const progressBar = document.querySelector('#scrollProgress');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${Math.min(100, progress)}%`;

  if (!reduceMotion) {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = Number(el.dataset.parallax || 0);
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }
};
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.counter || 0);
    if (reduceMotion) {
      entry.target.textContent = target;
    } else {
      const start = performance.now();
      const duration = 650;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        entry.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.7 });
document.querySelectorAll('[data-counter]').forEach((el) => counterObserver.observe(el));

const form = document.querySelector('#diagnosisForm');
const statusEl = document.querySelector('#formStatus');
const resultPanel = document.querySelector('#diagnosisResult');
const resultBody = document.querySelector('#resultBody');
const resetButton = document.querySelector('#resetDiagnosis');
const submitButton = form?.querySelector('button[type="submit"]');

function setStatus(message = '') {
  statusEl.textContent = message;
}

function validatePayload(payload) {
  if (!payload.companySize || !payload.role || !payload.goal || !payload.aiLevel || !payload.challenge.trim()) {
    return '모든 항목을 입력해주세요.';
  }
  if (payload.challenge.trim().length < 10) {
    return '현재 고민을 10자 이상 구체적으로 입력해주세요.';
  }
  return '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function renderResult(data) {
  const items = [
    ['01 · 현재 상태', data.summary],
    ['02 · 최우선 과제', data.priority],
    ['03 · 2주 액션', data.action],
    ['04 · 추천 상담 영역', data.recommendation]
  ];
  resultBody.innerHTML = items.map(([label, value]) => `
    <article class="result-item">
      <span>${label}</span>
      <p>${escapeHtml(value || '결과를 불러오지 못했습니다.')}</p>
    </article>
  `).join('');
  form.hidden = true;
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('');
  const values = Object.fromEntries(new FormData(form).entries());
  const error = validatePayload(values);
  if (error) {
    setStatus(error);
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  submitButton.disabled = true;
  form.classList.add('is-loading');
  setStatus('AI가 입력 내용을 분석하고 있습니다…');

  try {
    const response = await fetch('/api/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'AI 진단 요청을 처리하지 못했습니다.');
    renderResult(data);
    setStatus('');
  } catch (error) {
    if (error.name === 'AbortError') {
      setStatus('응답이 예상보다 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요.');
    } else {
      setStatus(error.message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  } finally {
    clearTimeout(timeoutId);
    submitButton.disabled = false;
    form.classList.remove('is-loading');
  }
});

resetButton?.addEventListener('click', () => {
  resultPanel.hidden = true;
  form.hidden = false;
  setStatus('');
  form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
});
