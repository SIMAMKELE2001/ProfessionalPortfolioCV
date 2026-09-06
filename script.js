// CURSOR&GRADIENT
const cursor = document.querySelector(".cursor");
if (cursor) {
  const cursorP = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pageP = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const lerp = (start, end, amount = 0.06) => (1 - amount) * start + amount * end;

  document.addEventListener("mousemove", (e) => {
    cursor.style.opacity = 1;
    pageP.x = e.clientX;
    pageP.y = e.clientY;
  });
  document.addEventListener("mouseout", () => { cursor.style.opacity = 0; });

  function loop() {
    cursorP.x = lerp(cursorP.x, pageP.x);
    cursorP.y = lerp(cursorP.y, pageP.y);
    cursor.style.transform = `translateX(calc(${cursorP.x}px - 50%)) translateY(calc(${cursorP.y}px - 50%))`;
    requestAnimationFrame(loop);
  }
  loop();
}

//LIGHT/DARK
(function themeInit() {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("sima-theme");
  if (saved) root.setAttribute("data-theme", saved);
  function updateIcon() {
    if (btn) btn.textContent = root.getAttribute("data-theme") === "dark" ? "\u263E" : "\u2600";
  }
  updateIcon();
  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("sima-theme", next);
      updateIcon();
    });
  }
})();

//BURGER MENU
const burgerBtn = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");
if (burgerBtn && navLinks) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    burgerBtn.classList.toggle("open", isOpen);
    burgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  // close the menu once a link is tapped
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burgerBtn.classList.remove("open");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
  // reset state if the viewport grows back past the mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      navLinks.classList.remove("open");
      burgerBtn.classList.remove("open");
      burgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// SCROLLSPY FOR THE HOME PAGE
(function scrollSpy() {
  const story = document.querySelector(".scroll-story");
  if (!story) return;
  const sections = story.querySelectorAll("section[id]");
  const navLinkMap = {
    "s-about": "about.html", "s-skills": "skills.html",
    "s-projects": "projects.html",
    "s-education": "education.html", "s-awards": "awards.html",
    "s-hobbies": "hobbies.html", "s-gallery": "gallery.html", "s-family": "family.html",
    "s-documents": "documents.html", "s-contact": "contact.html"
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targetHref = navLinkMap[entry.target.id];
        document.querySelectorAll(".topnav .nav-links a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === targetHref);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
})();

// SKILLS BAR ANIMATION
(function skillBars() {
  const bars = document.querySelectorAll(".skillbar-fill[data-width]");
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + "%";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((bar) => observer.observe(bar));
})();

// ACTIVE LINK HIGHLIGHT
(function highlightNav() {
  const current = window.location.pathname.split("/").pop() || "home.html";
  document.querySelectorAll(".topnav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "home.html")) {
      link.classList.add("active");
    }
  });
})();

// DOWNLOAD RESUME
function triggerDownload(e) {
  e.preventDefault();
  window.print();
}
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) downloadBtn.addEventListener("click", triggerDownload);
const resumeDocLink = document.getElementById("resumeDocLink");
if (resumeDocLink) resumeDocLink.addEventListener("click", triggerDownload);


//CONTACT FORM
const CONTACT_EMAIL = "yawasimamkel@gmail.com";      
const WHATSAPP_NUMBER = "27838615468";       

document.querySelectorAll(".contact-form").forEach((form) => {
  const wrapper = form.closest("section, div");
  const formMsg = form.querySelector(".form-msg");
  const submitBtn = form.querySelector("button[type='submit']");
  const methodBtns = wrapper ? wrapper.querySelectorAll(".method-btn") : [];
  const nameInput = form.querySelector("[id^='cf-name']");
  const emailInput = form.querySelector("[id^='cf-email']");
  const msgInput = form.querySelector("[id^='cf-msg']");
  let method = "email";

  methodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      methodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      method = btn.dataset.method;
      if (submitBtn) submitBtn.textContent = method === "email" ? "Send Email" : "Send via WhatsApp";
      if (formMsg) formMsg.textContent = "";
      [nameInput, emailInput, msgInput].forEach((el) => el.classList.remove("input-error"));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const msg = msgInput.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);

    [nameInput, emailInput, msgInput].forEach((el) => el.classList.remove("input-error"));

    const errors = [];
    if (name.length < 2) { errors.push("Please add your name."); nameInput.classList.add("input-error"); }
    if (method === "email" && !emailOk) { errors.push("Please enter a valid email."); emailInput.classList.add("input-error"); }
    if (msg.length < 5) { errors.push("Please add a message (at least 5 characters)."); msgInput.classList.add("input-error"); }

    if (errors.length) {
      formMsg.textContent = errors[0];
      formMsg.className = "form-msg err";
      return;
    }

    if (method === "email") {
      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(`${msg}\n\nReply to: ${email || "not provided"}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    } else {
      const text = encodeURIComponent(`Hi Sima, this is ${name}. ${msg}`);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    }

    formMsg.textContent = method === "email" ? "Opening your email app…" : "Opening WhatsApp…";
    formMsg.className = "form-msg ok";
    form.reset();
  });
});

// COVER
(function bookCoverIntro() {
  const stage = document.getElementById("bookCoverStage");
  const cover = document.getElementById("bookCover");
  const openBtn = document.getElementById("coverOpenBtn");
  if (!stage || !cover || !openBtn) return;
  document.body.classList.add("cover-active");

  openBtn.addEventListener("click", () => {
    cover.classList.add("open");
    setTimeout(() => {
      stage.style.display = "none";
      document.body.classList.remove("cover-active");
    }, 1300);
  });
})();
