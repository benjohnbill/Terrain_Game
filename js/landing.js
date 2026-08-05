document.addEventListener("DOMContentLoaded", () => {
    // The four-step war-model tablist used to live here — roughly a hundred lines
    // of state objects, copy swapping, and arrow-key roving tabindex. The page now
    // states what the game is in static prose beside a single static map frame, so
    // the machinery has no job. It is deleted rather than left inert: a state
    // machine driving nothing is the kind of code a later reader keeps because they
    // cannot tell whether it is load-bearing.

    const navToggle = document.querySelector("[data-nav-toggle]");
    const siteNav = document.querySelector("[data-site-nav]");
    if (navToggle && siteNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            siteNav.dataset.open = String(!isOpen);
        });

        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.setAttribute("aria-expanded", "false");
                siteNav.dataset.open = "false";
            });
        });
    }

    const header = document.querySelector("[data-site-header]");
    const observedSections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));

    if ("IntersectionObserver" in window && header) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                    link.toggleAttribute("aria-current", isCurrent);
                });
            });
        }, { rootMargin: "-25% 0px -65% 0px" });

        observedSections.forEach((section) => sectionObserver.observe(section));

        const heroObserver = new IntersectionObserver(([entry]) => {
            header.dataset.scrolled = String(!entry.isIntersecting);
        }, { threshold: 0.15 });
        const hero = document.getElementById("top");
        if (hero) heroObserver.observe(hero);
    }

    // The build-section embed needs no JavaScript.
    //
    // It used to be rendered at a fixed 1280 width and scaled to the frame with a
    // transform, because the fog prototype it carried had no resize handler and
    // drew blank in a fluid iframe. The L3 build lays itself out from its own
    // viewport, so the transform is gone and `.build-stage` sizes it in CSS
    // alone. Removed rather than left inert, on the same reasoning as above.
});
