document.addEventListener("DOMContentLoaded", () => {
    /* ─── NAVBAR HIDE/SHOW ON SCROLL ─── */
    const header = document.querySelector("header");

    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("nav-hidden");
            } else {
                header.classList.remove("nav-hidden");
            }
        }, { passive: true });
    }

    /* ─── MULTILINGUAL LOADER ─── */
    const loader = document.getElementById("loader");
    const loaderText = document.getElementById("loader-text");
    
    // Words to cycle through quickly
    const words = ["Hello", "Hi", "Namaste", "Salaam", "Ciao"];
    let currentIndex = 0;
    
    if (loader && loaderText) {
        const interval = setInterval(() => {
            loaderText.style.opacity = 0;
            
            setTimeout(() => {
                currentIndex++;
                if (currentIndex < words.length) {
                    loaderText.textContent = words[currentIndex];
                    loaderText.style.opacity = 1;
                } else {
                    clearInterval(interval);
                    // End loading screen
                    loader.classList.add("loader-hidden");
                    setTimeout(() => {
                        loader.style.display = "none";
                        initAnimations();
                    }, 800); // Wait for transition
                }
            }, 100);
        }, 300); // Fast change
    } else {
        initAnimations();
    }

    /* ─── GSAP ANIMATIONS ─── */
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Hero Reveal
        const tlHero = gsap.timeline({ defaults: { force3D: true } });
        tlHero.fromTo(".hero-bg", { opacity: 0 }, { opacity: 0.5, duration: 2, ease: "power2.out" }, 0)
              .fromTo(".hero h1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.2)
              .fromTo(".hero p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.4);

        // Subtle Parallax on Hero bg
        gsap.to(".hero-bg", {
            yPercent: 30,
            ease: "none",
            force3D: true,
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // 2. Work Section Horizontal Scroll
        const workWrapper = document.querySelector(".work-wrapper");
        if (workWrapper) {
            const cards = gsap.utils.toArray(".work-card");
            // The distance to scroll is total width of child cards minus the container width
            gsap.to(workWrapper, {
                x: () => -(workWrapper.scrollWidth - window.innerWidth + window.innerWidth * 0.04), // 4vw padding
                ease: "none",
                force3D: true,
                scrollTrigger: {
                    trigger: ".work-section",
                    pin: true,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    end: () => "+=" + workWrapper.scrollWidth,
                    onUpdate: () => {
                        if (window.matchMedia("(hover: none)").matches || window.innerWidth <= 768) {
                            const viewportCenter = window.innerWidth / 2;
                            let closestCard = null;
                            let minDistance = Infinity;
                            
                            cards.forEach(card => {
                                const rect = card.getBoundingClientRect();
                                const cardCenter = rect.left + rect.width / 2;
                                const distance = Math.abs(viewportCenter - cardCenter);
                                
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    closestCard = card;
                                }
                            });
                            
                            cards.forEach(card => {
                                if (card === closestCard) {
                                    card.classList.add("touch-active");
                                } else {
                                    card.classList.remove("touch-active");
                                }
                            });
                        }
                    }
                }
            });
        }

        const counters = document.querySelectorAll('.stat-num span:first-child');
        
        counters.forEach(counter => {
            let targetValue = parseFloat(counter.getAttribute('data-val'));
            let isFloat = targetValue % 1 !== 0;
            let formatMillion = counter.hasAttribute('data-format');
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    let proxy = { val: 0 };
                    gsap.to(proxy, { 
                        val: targetValue,
                        duration: 2, 
                        ease: "power2.out",
                        force3D: true,
                        onUpdate: function() {
                            if (formatMillion) {
                                counter.innerHTML = (proxy.val / 1000000).toFixed(1);
                            } else {
                                counter.innerHTML = isFloat ? proxy.val.toFixed(1) : Math.round(proxy.val);
                            }
                        }
                    });
                }
            });
        });

        // 4. Standard Scroll Reveals
        const revealElements = gsap.utils.toArray('.reveal');
        revealElements.forEach(elem => {
            gsap.fromTo(elem, 
                { y: 30, opacity: 0 },
                {
                    y: 0, 
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    force3D: true,
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 90%", // Trigger slightly earlier to prevent lag
                        once: true // Play ONLY once and don't reverse
                    }
                }
            );
        });

    }
});
