document.addEventListener("DOMContentLoaded", () => {
    // 1. Header scroll effect
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Simple scrollspy to highlight active nav link
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-link");
        let currentSection = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(currentSection)) {
                link.classList.add("active");
            }
        });
    });

    // 2. Interactive SVG Map and Territory Database
    const territories = {
        guanzhong: {
            name: "관중 요새 (Guanzhong Pass)",
            archetype: "산악 관문 및 분지",
            terrain: "험준한 산악, 협곡, 요새망",
            control: "아군 장악 (Own Territory)",
            garrison: "12,500 (최정예 관군)",
            defense: 88,
            threat: "매우 높음 (동부 평원 방면 침공로 노출)",
            fog: "맑음 (정보 확실도 100%)",
            description: "북부 평원과 중원 전체를 통제하는 전략적 핵심 요충지입니다. 험난한 관문과 강한 방벽 레이어가 기본 탑재되어 있어, 방어 렌즈 가동 시 최우선 차단선으로 강조됩니다."
        },
        central_plains: {
            name: "중원 평원 (Central Plains)",
            archetype: "중앙 교통 및 경제 중심",
            terrain: "대평원, 주요 강 교차점",
            control: "적군 점거 (Enemy Held)",
            garrison: "24,000 (적 주력 야전군)",
            defense: 35,
            threat: "보통 (사방이 열려 있어 기습에 취약)",
            fog: "맑음 (정보 확실도 95%)",
            description: "가장 풍요로운 인구와 경제 생산을 지원하지만 사방이 열려 있는 분쟁의 한가운데입니다. 공세 렌즈 가동 시, 관중 분지에서 진격할 수 있는 최적의 타겟 경로로 활성화됩니다."
        },
        jiangnan: {
            name: "강남 곡창 (Jiangnan Belt)",
            archetype: "농업 경제 및 하천망",
            terrain: "충적 평야, 벼농사 지대, 하천/늪지",
            control: "적군 점거 (Enemy Held)",
            garrison: "9,000 (치안 수비대)",
            defense: 45,
            threat: "낮음 (강과 늪지의 자연적 차단 효과)",
            fog: "흐림 (정보 확실도 60%)",
            description: "막대한 식량과 보급을 제공하는 남부 심장부입니다. 하천 장애물로 인해 기동력이 저하되는 페널티가 부여되며, 정찰이 완벽히 되지 않아 안개가 일부 껴 있습니다."
        },
        sichuan: {
            name: "사천 분지 (Sichuan Basin)",
            archetype: "독립 차단 분지",
            terrain: "고립 고원 분지, 험한 산길",
            control: "중립 / 미개척",
            garrison: "5,000 (로컬 부족)",
            defense: 75,
            threat: "매우 낮음 (천혜의 절벽)",
            fog: "짙은 안개 (정보 확실도 20%)",
            description: "입구를 지키는 소수의 병력만으로 대군을 저지할 수 있는 차단 지형입니다. 정찰 렌즈를 켜지 않으면 내부 전술 정보를 전혀 파악할 수 없습니다."
        },
        liaodong: {
            name: "요동 변경 (Liaodong Frontier)",
            archetype: "동북부 완충지대",
            terrain: "구릉성 숲, 냉대 침엽수림",
            control: "중립 / 미개척",
            garrison: "??? (미확인 세력)",
            defense: 50,
            threat: "보통",
            fog: "완전 차단 (정보 확실도 5%)",
            description: "극한의 기후와 숲으로 덮인 북동부 국경선입니다. 현재 완전한 안개(Fog of War)에 잠겨 있어 지도를 통해 어떠한 세부 Sector 정보도 파악할 수 없습니다."
        }
    };

    const mapElement = document.getElementById("tactical-svg-map");
    const briefTitle = document.getElementById("brief-title");
    const briefArchetype = document.getElementById("brief-archetype");
    const briefTerrain = document.getElementById("brief-terrain");
    const briefGarrison = document.getElementById("brief-garrison");
    const briefDesc = document.getElementById("brief-desc");
    const detailPanels = document.querySelectorAll(".brief-detail-panel");

    // Click handler for SVG territories
    if (mapElement) {
        mapElement.addEventListener("click", (e) => {
            const province = e.target.closest(".province");
            if (!province) return;

            // Highlight chosen province
            document.querySelectorAll(".province").forEach(p => p.setAttribute("stroke-width", "1.5"));
            province.setAttribute("stroke-width", "3");
            province.setAttribute("stroke", "var(--color-gold)");

            const provId = province.id;
            const data = territories[provId];
            if (data) {
                // Update Sidebar HUD with animations
                briefTitle.textContent = data.name;
                briefTitle.classList.add("glow-text-gold");
                briefArchetype.textContent = data.archetype;
                briefTerrain.textContent = data.terrain;
                briefGarrison.textContent = data.garrison;
                briefDesc.textContent = data.description;
                
                // Show values
                document.getElementById("stat-def").textContent = data.defense + "%";
                document.getElementById("stat-threat").textContent = data.threat;
                document.getElementById("stat-fog").textContent = data.fog;

                // Visual flash on update
                const briefingCard = document.querySelector(".card-briefing");
                briefingCard.style.borderColor = "var(--color-gold)";
                setTimeout(() => {
                    briefingCard.style.borderColor = "rgba(0, 255, 204, 0.15)";
                }, 400);

                // Run simulation math once to adjust target values
                updateSimulationMath();
            }
        });
    }

    // 3. Lens Toggle Overlays
    const lensButtons = document.querySelectorAll(".lens-btn");
    lensButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            lensButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const activeLens = btn.getAttribute("data-lens");
            document.body.setAttribute("data-active-lens", activeLens);

            // Handle map visualization updates based on active lens
            updateMapVisuals(activeLens);
        });
    });

    function updateMapVisuals(lens) {
        const paths = document.querySelectorAll(".province");
        const lines = document.querySelectorAll(".hud-path-line");
        const markers = document.querySelectorAll(".hud-marker");

        // Reset custom colors
        paths.forEach(p => {
            p.removeAttribute("style");
            p.classList.remove("threatened", "targetable", "foggy");
        });
        lines.forEach(l => l.style.opacity = "0");
        markers.forEach(m => m.style.opacity = "0");

        if (lens === "offense") {
            // Offense Lens: Highlight paths from Guanzhong to Central Plains
            const pathLine = document.getElementById("attack-path-line");
            const targetMarker = document.getElementById("target-attack-marker");
            if (pathLine) pathLine.style.opacity = "1";
            if (targetMarker) targetMarker.style.opacity = "1";

            document.getElementById("central_plains").classList.add("targetable");
        } else if (lens === "defense") {
            // Defense Lens: Highlight bottleneck pass Guanzhong and threat routes
            const pathLine = document.getElementById("defense-breach-line");
            const warningMarker = document.getElementById("warning-defense-marker");
            if (pathLine) pathLine.style.opacity = "1";
            if (warningMarker) warningMarker.style.opacity = "1";

            document.getElementById("guanzhong").classList.add("threatened");
        } else if (lens === "intel") {
            // Intel Lens: Highlight Foggy/Uncertain Areas
            document.getElementById("sichuan").classList.add("foggy");
            document.getElementById("liaodong").classList.add("foggy");
            
            const scoutMarker = document.getElementById("scout-marker-sichuan");
            if (scoutMarker) scoutMarker.style.opacity = "1";
        }
    }

    // 4. Interactive Command Card Slider Simulations
    const capSlider = document.getElementById("slider-capacity");
    const riskSlider = document.getElementById("slider-risk");
    
    const capValDisplay = document.getElementById("val-capacity");
    const riskValDisplay = document.getElementById("val-risk");
    
    const successVal = document.getElementById("val-pred-success");
    const casualtiesVal = document.getElementById("val-pred-casualties");

    if (capSlider && riskSlider) {
        capSlider.addEventListener("input", () => {
            capValDisplay.textContent = capSlider.value + " AP";
            updateSimulationMath();
        });

        riskSlider.addEventListener("input", () => {
            let riskLabel = "평균 (Balanced)";
            if (riskSlider.value == 1) riskLabel = "안전 우선 (Cautious)";
            if (riskSlider.value == 3) riskLabel = "공세적 (Aggressive)";
            riskValDisplay.textContent = riskLabel;
            updateSimulationMath();
        });
    }

    function updateSimulationMath() {
        if (!capSlider || !riskSlider) return;

        const ap = parseInt(capSlider.value);
        const risk = parseInt(riskSlider.value);
        
        // Find currently selected province to calculate custom logic
        const selectedProv = document.querySelector(".province[stroke-width='3']");
        let baseWinProb = 50;
        let baseCasualties = 3000;

        if (selectedProv) {
            const data = territories[selectedProv.id];
            if (selectedProv.id === "central_plains") {
                baseWinProb = 40;
                baseCasualties = 4500;
            } else if (selectedProv.id === "guanzhong") {
                baseWinProb = 75; // Strong fortress
                baseCasualties = 1200;
            } else if (selectedProv.id === "jiangnan") {
                baseWinProb = 45;
                baseCasualties = 2500;
            } else {
                baseWinProb = 35;
                baseCasualties = 2000;
            }
        }

        // Win probability formula: increases with AP, risk adjustments
        let finalWinProb = baseWinProb + (ap - 10) * 2;
        if (risk === 1) finalWinProb -= 8;  // Safe bet lowers direct success cap
        if (risk === 3) finalWinProb += 12; // Aggressive commitment peaks odds but spikes casualties

        // Cap win probability between 5% and 95% (simulating Uncertainty fog of war)
        finalWinProb = Math.max(5, Math.min(95, finalWinProb));

        // Casualties formula: decreases with AP (overwhelming force), increases/decreases with risk
        let finalCasualties = baseCasualties * (20 / (ap + 5));
        if (risk === 1) finalCasualties *= 0.6;  // Cautious retreat saves troops
        if (risk === 3) finalCasualties *= 1.8;  // Assault cost spikes blood permanently

        // Round figures for display
        successVal.textContent = Math.round(finalWinProb) + "%";
        casualtiesVal.textContent = Math.round(finalCasualties).toLocaleString() + " 명";

        // Color coding prediction output based on winrate
        if (finalWinProb >= 65) {
            successVal.style.color = "var(--color-neon-jade)";
            successVal.style.textShadow = "0 0 8px var(--color-neon-jade-glow)";
        } else if (finalWinProb <= 40) {
            successVal.style.color = "var(--color-alert-red)";
            successVal.style.textShadow = "0 0 8px var(--color-alert-red-glow)";
        } else {
            successVal.style.color = "var(--color-gold)";
            successVal.style.textShadow = "0 0 8px var(--color-gold-glow)";
        }
    }

    // Initialize with default state
    updateMapVisuals("balanced");
    updateSimulationMath();
});
