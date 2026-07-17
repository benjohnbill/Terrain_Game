document.addEventListener("DOMContentLoaded", () => {
    const operationStates = {
        read: {
            kicker: "Terrain judgment",
            title: "Read the ground.",
            body: "강을 건너는 길은 넓지만, 병력이 전개될 수 있는 관문은 하나뿐입니다. 적의 숫자보다 먼저 싸움이 벌어질 조건을 읽습니다.",
            decision: "관문을 지킬 것인가, 적을 통과시킬 것인가",
            consequence: "다음 턴의 배치 가능 지역이 달라집니다.",
            turn: "11",
            phase: "Situation read"
        },
        position: {
            kicker: "Force judgment",
            title: "Place strength where it can matter.",
            body: "주력은 능선 뒤에 숨기고, 예비대는 두 전선을 모두 지원할 수 있는 위치에 둡니다. 병력의 총량보다 투사할 수 있는 힘을 설계합니다.",
            decision: "주력을 감출 것인가, 먼저 전선을 안정시킬 것인가",
            consequence: "적은 아군의 실제 집중 지점을 확신할 수 없습니다.",
            turn: "12",
            phase: "Force position"
        },
        commit: {
            kicker: "Timing judgment",
            title: "Commit when retreat still has a cost.",
            body: "적의 선두가 관문을 지나고 후속 부대와 간격이 벌어졌습니다. 주공을 투입하는 순간부터 계획은 되돌릴 수 없는 비용을 갖습니다.",
            decision: "지금 결전을 열 것인가, 한 턴 더 위험을 감수할 것인가",
            consequence: "퇴로와 보급로가 이번 전쟁의 결정적 축이 됩니다.",
            turn: "14",
            phase: "Main effort committed"
        },
        consequence: {
            kicker: "Outcome judgment",
            title: "Let the plan become history.",
            body: "주력은 적의 전면이 아니라 끊어진 연결부를 공격합니다. 앞선 세 번의 판단이 하나의 결과로 수렴하고, 다음 전쟁의 국력까지 바꿉니다.",
            decision: "고립된 야전군을 파괴할 것인가, 유리한 정산을 요구할 것인가",
            consequence: "승리는 영토 한 칸이 아니라 전쟁 이후의 판세를 바꿉니다.",
            turn: "16",
            phase: "Field army isolated"
        }
    };

    const stepOrder = Object.keys(operationStates);
    const stepButtons = Array.from(document.querySelectorAll("[data-operation-step]"));
    const operationMap = document.querySelector("[data-operation-map]");
    const copyPanel = document.getElementById("operation-copy");
    const announcement = document.getElementById("operation-announcement");
    const progress = document.querySelector("[data-operation-progress]");

    const copyTargets = {
        kicker: document.querySelector("[data-operation-kicker]"),
        title: document.querySelector("[data-operation-title]"),
        body: document.querySelector("[data-operation-body]"),
        decision: document.querySelector("[data-operation-decision]"),
        consequence: document.querySelector("[data-operation-consequence]"),
        turn: document.querySelector("[data-turn-number]"),
        phase: document.querySelector("[data-turn-phase]")
    };

    function setOperationStep(step, announce = true) {
        const state = operationStates[step];
        if (!state || !operationMap) return;

        operationMap.dataset.activeState = step;
        Object.entries(copyTargets).forEach(([key, element]) => {
            if (element) element.textContent = state[key];
        });

        const activeIndex = stepOrder.indexOf(step);
        if (progress) progress.style.setProperty("--operation-scale", String((activeIndex + 1) / 4));

        stepButtons.forEach((button) => {
            const isActive = button.dataset.operationStep === step;
            button.setAttribute("aria-selected", String(isActive));
            button.tabIndex = isActive ? 0 : -1;
        });

        if (copyPanel) {
            const activeButton = stepButtons.find((button) => button.dataset.operationStep === step);
            if (activeButton) copyPanel.setAttribute("aria-labelledby", activeButton.id);
        }

        if (announce && announcement) {
            announcement.textContent = `${state.title} ${state.body}`;
        }
    }

    stepButtons.forEach((button, index) => {
        button.addEventListener("click", () => setOperationStep(button.dataset.operationStep));
        button.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();

            let nextIndex = index;
            if (event.key === "ArrowRight") nextIndex = (index + 1) % stepButtons.length;
            if (event.key === "ArrowLeft") nextIndex = (index - 1 + stepButtons.length) % stepButtons.length;
            if (event.key === "Home") nextIndex = 0;
            if (event.key === "End") nextIndex = stepButtons.length - 1;

            const nextButton = stepButtons[nextIndex];
            setOperationStep(nextButton.dataset.operationStep);
            nextButton.focus();
        });
    });

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

    setOperationStep("read", false);
});
