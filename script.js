/* ============================================================
   Tafsir.dev — interactions & Code Rush game
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Sticky nav state ---------- */
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");

  const handleScroll = () => {
    const scrolled = window.scrollY > 30;
    nav.classList.toggle("scrolled", scrolled);
    toTop.classList.toggle("visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Hero typing effect ---------- */
  const typed = document.getElementById("typed");
  const phrases = [
    "REST APIs that scale.",
    "clean, tested Python.",
    "backend systems.",
    "things that just work.",
  ];

  if (reduceMotion) {
    typed.textContent = phrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = phrase.slice(0, charIndex);

      let delay = deleting ? 45 : 95;
      if (!deleting && charIndex === phrase.length) {
        delay = 1700;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 700);
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 3, 2) * 80}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Skill bars ---------- */
  const skillsSection = document.getElementById("skills");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".skill").forEach((skill, i) => {
          setTimeout(() => {
            skill.querySelector(".bar i").style.width = `${skill.dataset.level}%`;
          }, i * 110);
        });
        skillObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );
  skillObserver.observe(skillsSection);

  /* ---------- Stat counters ---------- */
  const stats = document.querySelectorAll(".stat strong");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const suffix = el.dataset.suffix || "";
        const duration = reduceMotion ? 0 : 1200;
        const start = performance.now();

        const animate = (now) => {
          const progress = duration ? Math.min((now - start) / duration, 1) : 1;
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((s) => statObserver.observe(s));

  /* =========================================================
     CODE RUSH — typing game
     ========================================================= */
  const snippets = {
    easy: [
      "def get_user(user_id):",
      "return Response(data, status=200)",
      "queryset = Employee.objects.all()",
      "const client = new APIClient();",
      "pip install django restframework",
    ],
    medium: [
      "from rest_framework import viewsets, status",
      "queryset = Employee.objects.select_related('user').all()",
      "user.set_password(validated_data.pop('password'))",
      "return Response(serializer.data, status=status.HTTP_201_CREATED)",
      "with transaction.atomic(): payroll.save()",
    ],
    hard: [
      "items.append((component.name, -money(component.amount)))",
      "raise serializers.ValidationError({'month': 'Invalid date.'})",
      "LeaveRequest.objects.filter(status='approved', start_date__lte=last)",
      "permission_classes = [IsAuthenticated, IsAdminOrManager]",
      "PayrollRun.objects.prefetch_related('items__employee__user').all()",
    ],
  };

  const DURATION = 30;
  const els = {
    idle: document.getElementById("gameIdle"),
    play: document.getElementById("gamePlay"),
    result: document.getElementById("gameResult"),
    text: document.getElementById("gText"),
    time: document.getElementById("gTime"),
    wpm: document.getElementById("gWpm"),
    acc: document.getElementById("gAcc"),
    best: document.getElementById("gBest"),
    start: document.getElementById("gStart"),
    again: document.getElementById("gAgain"),
    rWpm: document.getElementById("gRWpm"),
    rAcc: document.getElementById("gRAcc"),
    rChars: document.getElementById("gRChars"),
    badge: document.getElementById("gBadge"),
    title: document.getElementById("gResultTitle"),
  };

  let difficulty = "easy";
  let running = false;
  let snippet = "";
  let spans = [];
  let index = 0;
  let correct = 0;
  let errors = 0;
  let startedAt = 0;
  let timer = null;

  const bestKey = (d) => `coderush-best-${d}`;

  const refreshBest = () => {
    const best = localStorage.getItem(bestKey(difficulty));
    els.best.textContent = best ? `${best} wpm` : "—";
  };
  refreshBest();

  document.querySelectorAll(".diff").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".diff").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      difficulty = btn.dataset.diff;
      refreshBest();
    });
  });

  const setView = (view) => {
    els.idle.classList.add("hidden");
    els.play.classList.add("hidden");
    els.result.classList.add("hidden");
    view.classList.remove("hidden");
  };

  const clearCurrent = () => spans.forEach((s) => s.classList.remove("current"));
  const markCurrent = () => {
    clearCurrent();
    if (spans[index]) spans[index].classList.add("current");
  };

  const updateLive = () => {
    const elapsed = Math.max((Date.now() - startedAt) / 1000, 0.01);
    const minutes = elapsed / 60;
    els.wpm.textContent = Math.round(correct / 5 / minutes);
    const total = correct + errors;
    els.acc.textContent = `${total ? Math.round((correct / total) * 100) : 100}%`;
  };

  const startGame = () => {
    const pool = snippets[difficulty];
    snippet = pool[Math.floor(Math.random() * pool.length)];
    index = 0;
    correct = 0;
    errors = 0;
    running = true;

    els.text.innerHTML = "";
    spans = [...snippet].map((character) => {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = character === " " ? "\u00a0" : character;
      els.text.appendChild(span);
      return span;
    });
    markCurrent();

    els.time.textContent = `${DURATION.toFixed(1)}s`;
    els.wpm.textContent = "0";
    els.acc.textContent = "100%";
    setView(els.play);

    startedAt = Date.now();
    timer = setInterval(() => {
      const remaining = DURATION - (Date.now() - startedAt) / 1000;
      els.time.textContent = `${Math.max(remaining, 0).toFixed(1)}s`;
      updateLive();
      if (remaining <= 0) finishGame();
    }, 100);
  };

  const finishGame = () => {
    if (!running) return;
    running = false;
    clearInterval(timer);
    clearCurrent();

    const elapsedMinutes = Math.max((Date.now() - startedAt) / 1000, 0.5) / 60;
    const wpm = Math.round(correct / 5 / elapsedMinutes);
    const total = correct + errors;
    const accuracy = total ? Math.round((correct / total) * 100) : 100;

    els.rWpm.textContent = wpm;
    els.rAcc.textContent = `${accuracy}%`;
    els.rChars.textContent = correct;
    els.badge.textContent = wpm >= 70 ? "SPEED DEMON" : wpm >= 45 ? "NICE" : wpm >= 25 ? "KEEP GOING" : "WARM UP";
    els.title.textContent = index === snippet.length ? "Snippet complete!" : "Time's up!";

    const previous = parseInt(localStorage.getItem(bestKey(difficulty)) || "0", 10);
    if (wpm > previous) {
      localStorage.setItem(bestKey(difficulty), String(wpm));
      els.title.textContent += " New best!";
    }
    refreshBest();
    setView(els.result);
  };

  document.addEventListener("keydown", (event) => {
    if (!running) return;

    // Ignore control keys, but stop space/arrows from scrolling the page mid-game.
    if ([" ", "ArrowUp", "ArrowDown", "Tab"].includes(event.key)) event.preventDefault();
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

    const expected = snippet[index];
    if (event.key === expected) {
      spans[index].classList.remove("bad");
      spans[index].classList.add("done");
      index += 1;
      correct += 1;
      if (index >= snippet.length) {
        finishGame();
        return;
      }
      markCurrent();
    } else {
      errors += 1;
      const target = spans[index];
      target.classList.add("bad");
      setTimeout(() => target.classList.remove("bad"), 300);
    }
    updateLive();
  });

  els.start.addEventListener("click", startGame);
  els.again.addEventListener("click", startGame);
});
