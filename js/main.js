(() => {
	const html = document.documentElement;
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

	/* ---------- Theme (shared with resume.html via localStorage "theme") ---------- */
	const themeToggle = document.getElementById('themeToggle');
	function setTheme(isLight) {
		html.classList.toggle('light-theme', isLight);
		try {
			localStorage.setItem('theme', isLight ? 'light' : 'dark');
		} catch (e) {}
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', isLight ? '#ffffff' : '#000000');
	}
	setTheme(html.classList.contains('light-theme'));
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			setTheme(!html.classList.contains('light-theme'));
		});
	}

	/* ---------- Accent palette (easter egg: terminal `accent` only) ---------- */
	const ACCENTS = ['cyan', 'blue', 'violet', 'green', 'amber'];
	function currentAccent() {
		return ACCENTS.find((n) => html.classList.contains('accent-' + n)) || 'cyan';
	}
	function setAccent(name) {
		if (!ACCENTS.includes(name)) return false;
		ACCENTS.forEach((n) => html.classList.toggle('accent-' + n, n === name));
		try {
			localStorage.setItem('accent', name);
		} catch (e) {}
		return true;
	}
	setAccent(currentAccent());

	/* ---------- Mobile menu ---------- */
	const mobileMenu = document.getElementById('mobileMenu');
	const hamburger = document.getElementById('hamburger');
	const mobileClose = document.getElementById('mobileClose');
	function openMobile() {
		mobileMenu.classList.add('open');
		hamburger.setAttribute('aria-expanded', 'true');
		document.body.style.overflow = 'hidden';
	}
	function closeMobile() {
		mobileMenu.classList.remove('open');
		hamburger.setAttribute('aria-expanded', 'false');
		document.body.style.overflow = '';
	}
	if (hamburger) hamburger.addEventListener('click', openMobile);
	if (mobileClose) mobileClose.addEventListener('click', closeMobile);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeMobile();
	});

	/* ---------- Smooth scroll for same-page anchors ---------- */
	document.querySelectorAll('a[href^="#"]').forEach((a) => {
		a.addEventListener('click', (e) => {
			const href = a.getAttribute('href');
			if (href === '#') return;
			const target = document.querySelector(href);
			if (target) {
				e.preventDefault();
				closeMobile();
				target.scrollIntoView({
					behavior: reduceMotion ? 'auto' : 'smooth',
					block: 'start',
				});
			}
		});
	});

	/* ---------- Reveal on scroll ---------- */
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('active');
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
	);
	document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

	/* ---------- Local nav: show once the hero is out of view ---------- */
	const localNav = document.getElementById('localNav');
	const hero = document.getElementById('hero');
	if (localNav && hero) {
		new IntersectionObserver(
			(entries) => {
				localNav.classList.toggle('visible', !entries[0].isIntersecting);
			},
			{ rootMargin: '-120px 0px 0px 0px', threshold: 0 },
		).observe(hero);
	}

	/* ---------- Terminal ---------- */
	const terminal = document.getElementById('terminal');
	if (terminal) {
		const tbody = terminal.querySelector('.terminal-body');
		const bootLines = Array.from(tbody.querySelectorAll('.t-line'));
		const statsLine = tbody.querySelector('.t-stats');
		const wait = (ms) => new Promise((r) => setTimeout(r, ms));
		const esc = (v) =>
			String(v).replace(
				/[&<>"']/g,
				(c) =>
					({
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					})[c],
			);
		const PROMPT =
			'<span class="t-prompt"><span class="t-user">sabari@dev</span> <span class="t-dir">~</span> %</span>';
		const link = (href, label) =>
			'<a class="t-link" href="' +
			href +
			'" target="_blank" rel="noopener">' +
			esc(label || href) +
			'</a>';
		const key = (t) => '<span class="t-key">' + esc(t) + '</span>';
		const sub = (t) => '<span class="t-sub">' + t + '</span>';

		/* ----- data ----- */
		const GH = 'https://github.com/Sabarinathan07';
		const OUTPUT = {
			whoami: () => [
				'Sabarinathan Ragunathan',
				sub('Software Development Engineer @ M2P Fintech — Chennai, India'),
			],
			about: () => [
				'I build the backend of lending products: loan origination,',
				'management and credit lines, the parts that have to be right',
				'every single time.',
				'',
				'Now: LOS, LMS, CMS and BNPL modules at M2P Fintech.',
				'Before: NestJS and React product work at EventHQ.',
				'B.Tech in Computer Science, SRM IST — 9.21 CGPA.',
			],
			skills: () => [
				key('languages'),
				sub('Java · TypeScript · JavaScript · Golang · Python · SQL · PHP'),
				key('backend & frameworks'),
				sub('Spring Boot · Node.js · NestJS · Express.js · REST APIs · Microservices · Gradle · Jest'),
				key('frontend'),
				sub('React · Next.js · HTML5 · CSS3 · Android'),
				key('databases & tools'),
				sub('PostgreSQL · Oracle DB · MySQL · MongoDB · Redis · Firebase · Docker · AWS · Git · Postman · JMeter · DSA'),
			],
			projects: () => [
				key('CodeBridge') + sub('full stack'),
				sub(
					'MERN community platform for real time peer collaboration. ' +
						link(GH + '/CodeBridge', 'source'),
				),
				key('KwizzChamp') + sub('web app'),
				sub(
					'Speech recognition quiz app built for visually impaired users. ' +
						link(GH + '/KwizzChamp', 'source'),
				),
				key('MyChat') + sub('mobile'),
				sub(
					'Android and Firebase real time messaging. ' +
						link(GH + '/myChatApp', 'source'),
				),
				key('AutoReply - Gmail API') + sub('backend'),
				sub(
					'Node.js mailbox automation on the Google APIs. ' +
						link(GH + '-Gmail', 'source'),
				),
				key('Infits') + sub('real time'),
				sub(
					'WebRTC and Socket.io chat and video in a React fitness tracker. ' +
						link('https://github.com/analysed12/Infits_Web_App', 'source'),
				),
				key('ShopManager') + sub('backend'),
				sub(
					'NestJS shop service: JWT auth, stock and orders in Postgres, Redis cache. ' +
						link(GH + '/ShopManager', 'source'),
				),
				key('Identity Reconciliation') + sub('api'),
				sub(
					'Folds changing emails and phone numbers into one primary contact. ' +
						link(GH + '/IdentityReconciliation', 'source'),
				),
				key('Banking API') + sub('go'),
				sub(
					'Go REST service split into handlers, service and repository layers. ' +
						link(GH + '/banking', 'source'),
				),
				key('Next.js Dashboard') + sub('full stack'),
				sub(
					'Server rendered dashboard on Next.js, Tailwind and PostgreSQL. ' +
						link(GH + '/next-dashboard', 'source'),
				),
			],
			experience: () => [
				key('Jul 2025 — Present'),
				sub('Software Development Engineer - I · M2P Fintech, Chennai'),
				key('Jul 2024 — Jul 2025'),
				sub('Software Development Engineer · EventHQ, Bengaluru'),
				key('Jan 2024 — Jun 2024'),
				sub('Engineering Intern · EventHQ, Bengaluru'),
				key('Dec 2022 — Mar 2023'),
				sub('Web Development Intern · Analysed.in'),
				key('Nov 2022 — Dec 2022'),
				sub('Web Development Intern · Suvidha Foundation'),
			],
			education: () => [
				key('2020 — 2024') + sub('9.21 CGPA'),
				sub('B.Tech, Computer Science &amp; Engineering · SRM IST, Ramapuram'),
				key('2018 — 2020'),
				sub('HSE, Computer Science · Kalashetra Matriculation HSS, Kattupakkam'),
			],
			contact: () => [
				'<dl class="t-grid">' +
					'<dt>email</dt><dd>' +
					link('mailto:r.sabarinathan02@gmail.com', 'r.sabarinathan02@gmail.com') +
					'</dd>' +
					'<dt>location</dt><dd>Chennai, Tamil Nadu, India</dd>' +
					'<dt>status</dt><dd>open to opportunities</dd>' +
					'</dl>',
				sub('or run ' + key('open contact') + ' to use the form.'),
			],
			socials: () => [
				'<dl class="t-grid">' +
					'<dt>github</dt><dd>' +
					link(GH + '/', 'github.com/Sabarinathan07') +
					'</dd>' +
					'<dt>linkedin</dt><dd>' +
					link(
						'https://www.linkedin.com/in/Sabarinathan07/',
						'linkedin.com/in/Sabarinathan07',
					) +
					'</dd>' +
					'<dt>x</dt><dd>' +
					link('https://twitter.com/sabari_nathan07', '@sabari_nathan07') +
					'</dd>' +
					'<dt>instagram</dt><dd>' +
					link('https://www.instagram.com/sabari_nathan07/', '@sabari_nathan07') +
					'</dd>' +
					'</dl>',
			],
		};

		const FILES = {
			'about.md': 'about',
			'skills.txt': 'skills',
			'projects.json': 'projects',
			'experience.log': 'experience',
			'education.txt': 'education',
			'contact.md': 'contact',
		};
		const SECTIONS = [
			'hero',
			'about',
			'experience',
			'skills',
			'projects',
			'education',
			'testimonials',
			'contact',
		];
		const COMMANDS = {
			help: 'show this list',
			whoami: 'who I am',
			'./stats': 'the summary from up top',
			about: 'the short version',
			skills: 'tech I work with',
			projects: "what I've built",
			experience: "where I've worked",
			education: 'academic background',
			contact: 'how to reach me',
			socials: 'github · linkedin · x · instagram',
			resume: 'open my resume',
			ls: 'list readable files',
			cat: 'print a file — cat about.md',
			open: 'jump to a section — open projects',
			theme: 'toggle light / dark',
			date: "today's date",
			echo: 'say something back',
			clear: 'clear the screen',
		};

		/* ----- rendering ----- */
		const inputLine = document.createElement('form');
		inputLine.className = 't-line t-input-line';
		inputLine.innerHTML =
			PROMPT +
			'<span class="t-typed"><span class="t-txt"></span><span class="t-cursor" aria-hidden="true"></span></span>' +
			'<input class="t-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Terminal input" />';
		const field = inputLine.querySelector('.t-input');
		const mirror = inputLine.querySelector('.t-txt');

		const scrollDown = () => {
			tbody.scrollTop = tbody.scrollHeight;
		};
		function print(htmlStr, cls) {
			const el = document.createElement('div');
			if (htmlStr === '') {
				el.className = 't-gap';
			} else {
				el.className = 't-line t-out' + (cls ? ' ' + cls : '');
				el.innerHTML = htmlStr;
			}
			if (inputLine.parentNode === tbody) tbody.insertBefore(el, inputLine);
			else tbody.appendChild(el);
			return el;
		}
		const printAll = (lines) => lines.forEach((l) => print(l));
		function printNode(node) {
			if (inputLine.parentNode === tbody) tbody.insertBefore(node, inputLine);
			else tbody.appendChild(node);
			return node;
		}

		function echoCommand(text) {
			const el = document.createElement('div');
			el.className = 't-line t-cmd';
			el.innerHTML = PROMPT + ' <span class="t-text">' + esc(text) + '</span>';
			if (inputLine.parentNode === tbody) tbody.insertBefore(el, inputLine);
			else tbody.appendChild(el);
		}

		/* ----- commands ----- */
		function run(raw) {
			const text = raw.trim();
			echoCommand(text);
			if (!text) return;
			const parts = text.split(/\s+/);
			const cmd = parts[0].toLowerCase();
			const args = parts.slice(1);

			if (OUTPUT[cmd]) {
				printAll(OUTPUT[cmd]());
				return;
			}
			switch (cmd) {
				case './stats':
				case 'stats':
					if (statsLine) {
						const copy = statsLine.cloneNode(true);
						copy.classList.add('shown');
						printNode(copy);
					}
					break;
				case 'help':
					print(
						'<dl class="t-grid">' +
							Object.keys(COMMANDS)
								.map(
									(c) => '<dt>' + c + '</dt><dd>' + COMMANDS[c] + '</dd>',
								)
								.join('') +
							'</dl>',
					);
					print(sub('Arrow keys walk history. Tab completes.'));
					break;
				case 'ls':
					print(Object.keys(FILES).join('   '));
					break;
				case 'cat': {
					const file = (args[0] || '').toLowerCase();
					if (!file) print('<span class="t-err">cat: missing file name</span>');
					else if (FILES[file]) printAll(OUTPUT[FILES[file]]());
					else
						print(
							'<span class="t-err">cat: ' +
								esc(file) +
								': no such file</span>',
						);
					break;
				}
				case 'open': {
					const name = (args[0] || '').toLowerCase();
					if (SECTIONS.includes(name)) {
						const target = document.getElementById(name);
						print('jumping to ' + key(name) + '…');
						if (target)
							target.scrollIntoView({
								behavior: reduceMotion ? 'auto' : 'smooth',
								block: 'start',
							});
					} else {
						print(
							'<span class="t-err">open: unknown section</span>',
						);
						print(sub('try: ' + SECTIONS.join(' · ')));
					}
					break;
				}
				case 'resume':
					print('opening ' + link('/resume', 'sabari.dev/resume') + '…');
					print(sub('or grab the ' + link('resume.pdf', 'PDF') + '.'));
					window.open('/resume', '_blank', 'noopener');
					break;
				case 'theme': {
					const want = (args[0] || '').toLowerCase();
					const light =
						want === 'light'
							? true
							: want === 'dark'
								? false
								: !html.classList.contains('light-theme');
					if (want && want !== 'light' && want !== 'dark') {
						print('<span class="t-err">theme: use light or dark</span>');
						break;
					}
					setTheme(light);
					print('theme → ' + key(light ? 'light' : 'dark'));
					break;
				}
				case 'accent': {
					const want = (args[0] || '').toLowerCase();
					if (!want) {
						print('current: ' + key(currentAccent()));
						print(sub('available: ' + ACCENTS.join(' · ')));
					} else if (setAccent(want)) {
						print('accent → ' + key(want));
					} else {
						print('<span class="t-err">accent: unknown color</span>');
						print(sub('available: ' + ACCENTS.join(' · ')));
					}
					break;
				}
				case 'date':
					print(
						new Date().toLocaleDateString(undefined, {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						}),
					);
					break;
				case 'echo':
					print(esc(args.join(' ')));
					break;
				case 'clear':
					Array.from(tbody.children).forEach((el) => {
						if (el !== inputLine) el.remove();
					});
					break;
				case 'sudo':
					print('<span class="t-err">sabari is not in the sudoers file.</span>');
					print(sub('This incident will be reported.'));
					break;
				case 'exit':
					print('nice try — this one stays open.');
					break;
				default:
					print(
						'<span class="t-err">zsh: command not found: ' +
							esc(cmd) +
							'</span>',
					);
					print(sub('type ' + key('help') + ' to see what works.'));
			}
		}

		/* ----- input handling ----- */
		const history = [];
		let hIndex = 0;
		function complete() {
			const value = field.value;
			const parts = value.split(/\s+/);
			let pool = Object.keys(COMMANDS);
			let frag = parts[0];
			if (parts.length > 1) {
				frag = parts[parts.length - 1];
				const first = parts[0].toLowerCase();
				if (first === 'cat') pool = Object.keys(FILES);
				else if (first === 'open') pool = SECTIONS;
				else if (first === 'accent') pool = ACCENTS;
				else if (first === 'theme') pool = ['light', 'dark'];
				else return;
			}
			const hits = pool.filter((c) => c.startsWith(frag.toLowerCase()));
			if (hits.length === 1) {
				parts[parts.length - 1] = hits[0];
				field.value = parts.join(' ');
				mirror.textContent = field.value;
			} else if (hits.length > 1) {
				print(hits.join('   '));
				scrollDown();
			}
		}

		field.addEventListener('input', () => {
			mirror.textContent = field.value;
		});
		field.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (!history.length) return;
				hIndex = Math.max(0, hIndex - 1);
				field.value = history[hIndex] || '';
				mirror.textContent = field.value;
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (!history.length) return;
				hIndex = Math.min(history.length, hIndex + 1);
				field.value = history[hIndex] || '';
				mirror.textContent = field.value;
			} else if (e.key === 'Tab') {
				e.preventDefault();
				complete();
			} else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				run('clear');
			}
		});
		inputLine.addEventListener('submit', (e) => {
			e.preventDefault();
			const value = field.value;
			field.value = '';
			mirror.textContent = '';
			if (value.trim()) {
				history.push(value.trim());
				hIndex = history.length;
			}
			run(value);
			// print() already inserts above the input line; re-appending it here
			// would detach and blur the focused field.
			scrollDown();
			field.focus({ preventScroll: true });
		});
		terminal.addEventListener('focusin', () => terminal.classList.add('active'));
		terminal.addEventListener('focusout', () =>
			terminal.classList.remove('active'),
		);
		tbody.addEventListener('click', (e) => {
			if (e.target.closest('a')) return;
			if (String(window.getSelection())) return;
			field.focus({ preventScroll: true });
		});

		/* ----- boot ----- */
		async function typeInto(el, text) {
			el.textContent = '';
			for (const ch of text) {
				el.textContent += ch;
				await wait(22 + Math.random() * 30);
			}
		}
		function mountPrompt() {
			terminal.classList.remove('typing');
			print(
				'Type ' +
					key('help') +
					' to see what this terminal can do.',
				't-hint',
			);
			tbody.appendChild(inputLine);
			scrollDown();
		}
		if (reduceMotion) {
			mountPrompt();
		} else {
			terminal.classList.add('typing');
			(async () => {
				await wait(500);
				for (const line of bootLines) {
					const isCmd = line.classList.contains('t-cmd');
					const textEl = line.querySelector('.t-text');
					const text = textEl ? textEl.textContent.trim() : '';
					line.classList.add('shown');
					scrollDown();
					if (isCmd && text) {
						await typeInto(textEl, text);
						await wait(220);
					} else if (!isCmd) {
						await wait(line.classList.contains('t-stats') ? 520 : 240);
					}
					scrollDown();
				}
				mountPrompt();
			})();
		}
	}

	/* ---------- Word-by-word statement reveal ---------- */
	const paragraphs = Array.from(document.querySelectorAll('.word-reveal'));
	function wrapWords(el) {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);
		let i = 0;
		nodes.forEach((node) => {
			const parts = node.nodeValue.split(/(\s+)/);
			const frag = document.createDocumentFragment();
			parts.forEach((part) => {
				if (!part) return;
				if (/^\s+$/.test(part)) {
					frag.appendChild(document.createTextNode(' '));
				} else {
					const span = document.createElement('span');
					span.className = 'w';
					span.style.setProperty('--i', i++);
					span.textContent = part;
					frag.appendChild(span);
				}
			});
			node.parentNode.replaceChild(frag, node);
		});
		el.style.setProperty('--n', i);
		el.classList.add('wrapped');
	}
	if (!reduceMotion) paragraphs.forEach(wrapWords);

	/* ---------- About: editor tabs ---------- */
	const tabList = document.querySelector('.editor-tabs');
	if (tabList) {
		const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
		function selectTab(tab, focus) {
			tabs.forEach((t) => {
				const on = t === tab;
				t.setAttribute('aria-selected', String(on));
				t.tabIndex = on ? 0 : -1;
				document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
			});
			if (focus) tab.focus();
			// The pane was display:none, so the word-reveal had no box to
			// measure. Recompute now that it is laid out.
			window.dispatchEvent(new Event('scroll'));
		}
		tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab)));
		tabList.addEventListener('keydown', (e) => {
			const i = tabs.indexOf(document.activeElement);
			if (i < 0) return;
			let next = null;
			if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
			else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
			else if (e.key === 'Home') next = tabs[0];
			else if (e.key === 'End') next = tabs[tabs.length - 1];
			if (!next) return;
			e.preventDefault();
			selectTab(next, true);
		});
	}

	/* ---------- Single rAF-throttled scroll handler ---------- */
	const navbar = document.getElementById('navbar');
	const expWrap = document.querySelector('.exp-wrap');
	const expRail = document.querySelector('.exp-rail');
	const expRows = Array.from(document.querySelectorAll('.exp-row'));
	const sections = document.querySelectorAll('section[id]');
	const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
	let ticking = false;

	function onScroll() {
		const y = window.scrollY;
		const vh = window.innerHeight;

		if (navbar) navbar.classList.toggle('scrolled', y > 8);

		// Hero fade / shrink as you scroll away
		if (hero && !reduceMotion) {
			hero.style.setProperty('--hero-p', clamp(y / (vh * 0.9), 0, 1).toFixed(3));
		}

		// Statement paragraphs light up word by word
		if (!reduceMotion) {
			paragraphs.forEach((p) => {
				const r = p.getBoundingClientRect();
				const start = vh * 0.88;
				const travel = r.height + vh * 0.32;
				p.style.setProperty('--p', clamp((start - r.top) / travel, 0, 1).toFixed(3));
			});
		}

		// Experience rail: fill tracks a line 45% down the viewport and is
		// complete once the bottom of the last entry reaches the fold.
		if (expWrap && expRail && !reduceMotion) {
			const r = expWrap.getBoundingClientRect();
			const focus = vh * 0.45;
			const travel = Math.max(r.height - vh * 0.55, 1);
			const p = clamp((focus - r.top) / travel, 0, 1);
			expWrap.style.setProperty('--rail-p', p.toFixed(3));

			// Light each dot exactly when the fill edge passes its centre,
			// measured off the rail itself so the two can never drift apart.
			const rail = expRail.getBoundingClientRect();
			const fillEdge = rail.top + rail.height * p;
			expRows.forEach((row, i) => {
				const dotCentre =
					row.getBoundingClientRect().top + (i === 0 ? 16 : 56) + 6;
				row.classList.toggle('passed', dotCentre <= fillEdge);
			});
		}

		// Active nav link
		let current = null;
		sections.forEach((s) => {
			if (y + 160 >= s.offsetTop) current = s.id;
		});
		navLinks.forEach((link) => {
			link.classList.toggle('active', link.getAttribute('href') === '#' + current);
		});

		ticking = false;
	}
	function requestScroll() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(onScroll);
		}
	}
	window.addEventListener('scroll', requestScroll, { passive: true });
	window.addEventListener('resize', requestScroll);
	window.addEventListener('load', requestScroll);
	onScroll();

	/* ---------- Project gallery paddles ---------- */
	const gallery = document.getElementById('projectGallery');
	const prev = document.getElementById('paddlePrev');
	const next = document.getElementById('paddleNext');
	if (gallery && prev && next) {
		// The cards sit in a horizontal scroller, so a card can be skipped past
		// without ever crossing the viewport — and would then stay at opacity 0
		// for good. Reveal the whole row once the gallery itself comes into view.
		new IntersectionObserver(
			(entries, obs) => {
				if (!entries[0].isIntersecting) return;
				gallery
					.querySelectorAll('.reveal')
					.forEach((el) => el.classList.add('active'));
				obs.disconnect();
			},
			{ threshold: 0.1 },
		).observe(gallery);

		const step = () => {
			const card = gallery.querySelector('.project-card');
			return card ? card.getBoundingClientRect().width + 20 : 400;
		};
		const updatePaddles = () => {
			const max = gallery.scrollWidth - gallery.clientWidth - 2;
			prev.disabled = gallery.scrollLeft <= 2;
			next.disabled = gallery.scrollLeft >= max;
		};
		prev.addEventListener('click', () => gallery.scrollBy({ left: -step(), behavior: 'smooth' }));
		next.addEventListener('click', () => gallery.scrollBy({ left: step(), behavior: 'smooth' }));
		gallery.addEventListener('scroll', updatePaddles, { passive: true });
		window.addEventListener('resize', updatePaddles);
		updatePaddles();
	}

	/* ---------- Console easter egg ---------- */
	console.log(
		'%c👋 Hey there, fellow developer!',
		'font-size:20px;font-weight:bold;color:#2997ff',
	);
	console.log("%cLike what you see? Let's connect!", 'font-size:14px;color:#a1a1a6');
	console.log('%chttps://github.com/Sabarinathan07', 'font-size:12px;color:#2997ff');
	console.log('%chttps://www.linkedin.com/in/Sabarinathan07/', 'font-size:12px;color:#2997ff');
})();
