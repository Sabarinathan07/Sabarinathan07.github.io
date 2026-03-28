// Custom Cursor
const cursor=document.getElementById('cursor'),cursorDot=document.getElementById('cursorDot');
let mouseX=0,mouseY=0,cursorX=0,cursorY=0;
document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;cursorDot.style.left=mouseX-3+'px';cursorDot.style.top=mouseY-3+'px'});
function animateCursor(){cursorX+=(mouseX-cursorX)*0.15;cursorY+=(mouseY-cursorY)*0.15;cursor.style.left=cursorX-10+'px';cursor.style.top=cursorY-10+'px';requestAnimationFrame(animateCursor)}
animateCursor();
document.querySelectorAll('a,button,.project-card,.skill-item,.nav-cta,.submit-btn').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))});
// Hide cursor on touch devices
if('ontouchstart' in window){cursor.style.display='none';cursorDot.style.display='none';document.body.style.cursor='auto'}

// Sticky Nav
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>50)});

// Mobile Menu
function openMobile(){document.getElementById('mobileMenu').classList.add('open')}
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open')}
document.getElementById('mobileClose').addEventListener('click',closeMobile);

// Scroll Reveal with Intersection Observer
const revealObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('active');revealObserver.unobserve(entry.target)}})},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Active nav link on scroll (only for same-page anchors)
const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{const scrollY=window.scrollY+100;sections.forEach(s=>{const top=s.offsetTop-120,h=s.offsetHeight,id=s.getAttribute('id');const link=document.querySelector(`.nav-links a[href="#${id}"]`);if(link){scrollY>=top&&scrollY<top+h?link.classList.add('active'):link.classList.remove('active')}})});

// Parallax effect on hero (only if hero elements exist)
const heroGrid=document.querySelector('.hero-grid'),heroGlow=document.querySelector('.hero-glow');
if(heroGrid&&heroGlow){
  window.addEventListener('scroll',()=>{const s=window.scrollY;if(s<window.innerHeight){heroGrid.style.transform=`translate(${s*0.03}px,${s*0.15}px)`;heroGlow.style.transform=`translate(-50%,-50%) scale(${1+s*0.0005})`}});
}

// Smooth scroll for same-page anchor links only
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const href=a.getAttribute('href');if(href==='#')return;const target=document.querySelector(href);if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});closeMobile()}})});

// Counter animation for stat chips
function animateCounters(){document.querySelectorAll('.stat-chip .number').forEach(el=>{const text=el.textContent;const match=text.match(/(\d+)/);if(!match)return;const target=parseInt(match[1]);const suffix=text.replace(match[1],'');let current=0;const increment=Math.ceil(target/40);const timer=setInterval(()=>{current+=increment;if(current>=target){current=target;clearInterval(timer)}el.textContent=current+suffix},30)})}
const statsObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){animateCounters();statsObserver.unobserve(entry.target)}})},{threshold:0.5});
const statsSection=document.querySelector('.hero-stats');
if(statsSection)statsObserver.observe(statsSection);

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function setTheme(isLight) {
  if (isLight) {
    document.body.classList.add('light-theme');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
    localStorage.setItem('theme', 'dark');
  }
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  setTheme(true);
} else {
  // Default is dark theme
  setTheme(false);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = !document.body.classList.contains('light-theme');
    setTheme(isLight);
  });
}

// Console Easter Egg
console.log('%c👋 Hey there, fellow developer!','font-size:20px;font-weight:bold;color:#00F5A0');
console.log('%cLike what you see? Let\'s connect!','font-size:14px;color:#8888A0');
console.log('%chttps://github.com/Sabarinathan07','font-size:12px;color:#00F5A0');
console.log('%chttps://www.linkedin.com/in/Sabarinathan07/','font-size:12px;color:#00F5A0');
