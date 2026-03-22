document.addEventListener("DOMContentLoaded", () => {
  // DOM Cache
  const header = document.getElementById("main-header");
  const logo = document.getElementById("logo-text");
  const login = document.getElementById("login-text");
  const navItems = document.querySelectorAll(".nav-item");
  const track = document.getElementById("product-track");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const testimonialTrack = document.getElementById("testimonial-track");

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMenuBtn = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  // --- 1. Performance: Throttled Scroll Logic ---
  let isHeaderScrolled = false;

  const updateHeaderStyles = () => {
    const shouldScroll = window.scrollY > 50;

    // Only update DOM if the state actually changed
    if (shouldScroll === isHeaderScrolled) return;
    isHeaderScrolled = shouldScroll;

    header.classList.toggle("bg-white", isHeaderScrolled);
    header.classList.toggle("shadow-sm", isHeaderScrolled);
    header.classList.toggle("py-4", isHeaderScrolled);
    header.classList.toggle("bg-transparent", !isHeaderScrolled);
    header.classList.toggle("py-6", !isHeaderScrolled);

    logo.classList.toggle("text-slate-900", isHeaderScrolled);
    logo.classList.toggle("text-white", !isHeaderScrolled);

    if (login) {
      login.classList.toggle("text-slate-600", isHeaderScrolled);
      login.classList.toggle("text-white", !isHeaderScrolled);
    }

    if (menuIcon) {
      menuIcon.classList.toggle("text-slate-900", isHeaderScrolled);
      menuIcon.classList.toggle("text-white", !isHeaderScrolled);
    }

    navItems.forEach((item) => {
      item.classList.toggle("text-slate-600", isHeaderScrolled);
      item.classList.toggle("text-white/90", !isHeaderScrolled);
    });
  };

  // Passive scroll listener for better mobile performance
  window.addEventListener("scroll", updateHeaderStyles, { passive: true });

  // --- 2. Smooth Navigation (Event Delegation) ---
  // More efficient than adding a listener to every single 'a' tag
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
      if (mobileMenu && !mobileMenu.classList.contains("translate-x-full"))
        toggleMenu(false);
    }
  });

  // --- 3. Carousel Logic (Optimized) ---
  if (track) {
    const card = track.querySelector(".product-card");
    const getScrollAmount = () => (card ? card.offsetWidth + 24 : 0);

    const scrollNext = () => {
      const isAtEnd =
        track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10;
      track.scrollTo({
        left: isAtEnd ? 0 : track.scrollLeft + getScrollAmount(),
        behavior: "smooth",
      });
    };

    const scrollPrev = () => {
      const isAtStart = track.scrollLeft <= 0;
      track.scrollTo({
        left: isAtStart
          ? track.scrollWidth
          : track.scrollLeft - getScrollAmount(),
        behavior: "smooth",
      });
    };

    let autoScroll = setInterval(scrollNext, 4000);

    // Efficiently pause auto-scroll only when visible using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries[0].isIntersecting
          ? (autoScroll = setInterval(scrollNext, 4000))
          : clearInterval(autoScroll);
      },
      { threshold: 0.1 },
    );

    observer.observe(track);

    track.addEventListener("mouseenter", () => clearInterval(autoScroll));
    track.addEventListener(
      "mouseleave",
      () => (autoScroll = setInterval(scrollNext, 4000)),
    );

    if (nextBtn) nextBtn.addEventListener("click", scrollNext);
    if (prevBtn) prevBtn.addEventListener("click", scrollPrev);
  }

  // --- 4. Mobile Menu ---
  const toggleMenu = (show) => {
    mobileMenu.classList.toggle("translate-x-full", !show);
    document.body.style.overflow = show ? "hidden" : "";
  };

  if (mobileMenuBtn) mobileMenuBtn.onclick = () => toggleMenu(true);
  if (closeMenuBtn) closeMenuBtn.onclick = () => toggleMenu(false);

  // --- 5. Infinite Testimonial Loop ---
  if (testimonialTrack) {
    testimonialTrack.innerHTML += testimonialTrack.innerHTML;
  }

  // Set initial state
  updateHeaderStyles();
});
