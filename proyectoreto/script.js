// Initialize independent carousels for any element with class "carousel"
document.querySelectorAll('.carousel').forEach((carouselEl) => {
	const slides = [...carouselEl.querySelectorAll('.slide')];
		slides.forEach((slide) => {
			const img = slide.querySelector('img');
			if (!img) return;
			try { img.loading = 'lazy'; } catch (e) {}
			img.classList.add('loading');
			img.addEventListener('load', () => img.classList.add('loaded'));
			if (img.complete) img.classList.add('loaded');
		});
	const dots = [...carouselEl.querySelectorAll('.dot')];
	const prevBtn = carouselEl.querySelector('.arrow[data-direction="prev"]');
	const nextBtn = carouselEl.querySelector('.arrow[data-direction="next"]');
	let current = 0;
	let autoplay;
	const isLona = carouselEl.classList.contains('lona-carousel');
	const visibleDotCount = isLona ? 7 : Infinity;

	function show(index) {
		current = (index + slides.length) % slides.length;
		slides.forEach((slide, i) => {
			const isActive = i === current;
			slide.classList.toggle('is-active', isActive);
			slide.setAttribute('aria-hidden', String(!isActive));
		});
		dots.forEach((dot, i) => {
			const isActive = i === current;
			dot.classList.toggle('is-active', isActive);
			dot.setAttribute('aria-selected', String(isActive));
			if (dots.length > visibleDotCount) {
				// center the window around the current index
				const half = Math.floor(visibleDotCount / 2);
				let start = current - half;
				let end = start + visibleDotCount;
				if (start < 0) { start = 0; end = visibleDotCount; }
				if (end > dots.length) { end = dots.length; start = Math.max(0, end - visibleDotCount); }
				if (i >= start && i < end) dot.classList.remove('hidden'); else dot.classList.add('hidden');
			} else {
				dot.classList.remove('hidden');
			}
		});
	}

	function start() {
		clearInterval(autoplay);
		autoplay = setInterval(() => show(current + 1), 5000);
	}

	if (prevBtn) prevBtn.addEventListener('click', () => { show(current - 1); start(); });
	if (nextBtn) nextBtn.addEventListener('click', () => { show(current + 1); start(); });

	dots.forEach((dot) => {
		dot.addEventListener('click', () => { show(Number(dot.dataset.slideTo)); start(); });
	});

	carouselEl.addEventListener('mouseenter', () => clearInterval(autoplay));
	carouselEl.addEventListener('mouseleave', start);
	carouselEl.addEventListener('focusin', () => clearInterval(autoplay));
	carouselEl.addEventListener('focusout', start);

	show(0);
	start();
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

if (menuToggle && navigation) {
	const mobileMenu = window.matchMedia('(max-width: 760px)');

	function setMenuOpen(isOpen) {
		menuToggle.setAttribute('aria-expanded', String(isOpen));
		menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
		navigation.hidden = mobileMenu.matches && !isOpen;
	}

	setMenuOpen(false);
	mobileMenu.addEventListener('change', () => setMenuOpen(false));
	menuToggle.addEventListener('click', () => {
		setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
	});
	navigation.addEventListener('click', (event) => {
		if (event.target.closest('a')) setMenuOpen(false);
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && mobileMenu.matches && menuToggle.getAttribute('aria-expanded') === 'true') {
			setMenuOpen(false);
			menuToggle.focus();
		}
	});
}

const drugQuiz = document.querySelector('#drug-quiz');

if (drugQuiz) {
	const correctAnswers = ['b', 'a', 'b', 'a', 'a', 'b', 'b', 'a', 'a'];
	const quizResult = document.querySelector('#quiz-result');

	drugQuiz.addEventListener('submit', (event) => {
		event.preventDefault();
		const answers = new FormData(drugQuiz);
		const correctCount = correctAnswers.reduce((total, answer, index) => {
			return total + (answers.get(`q${index + 1}`) === answer ? 1 : 0);
		}, 0);
		const percentage = Math.round((correctCount / correctAnswers.length) * 100);

		quizResult.hidden = false;
		quizResult.classList.toggle('is-ready', percentage >= 70);
		quizResult.classList.toggle('needs-learning', percentage < 70);
		quizResult.innerHTML = `<strong>Obtuviste ${percentage}%</strong><span>${percentage >= 70 ? '¡Buen trabajo! Demuestras conocer los riesgos de estas sustancias.' : 'Te conviene informarte un poco más sobre los efectos y riesgos de estas sustancias.'}</span>`;
		quizResult.focus();
	});
}
