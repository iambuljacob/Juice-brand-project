/* =========================================================
   JUICE WEBSITE — SLIDER JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. WAIT FOR THE PAGE TO LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       2. ELEMENTS
       ===================================================== */

    const mainWrapper = document.getElementById("main-wrapper");

    const slider = document.getElementById("img-container");

    const slides = Array.from(
        document.querySelectorAll(".slide")
    );

    const sliderDots = Array.from(
        document.querySelectorAll(".slider-dot")
    );


    /* =====================================================
       3. SLIDE DATA
       ===================================================== */

    const gradients = [

        /*
         * Slide 1 — Green
         */
        "radial-gradient(at center center, #31D677 30%, #259B57 72%)",

        /*
         * Slide 2 — Pink / Red
         */
        "radial-gradient(at center center, #FF4F78 40%, #D92A54 72%)",

        /*
         * Slide 3 — Orange
         */
        "radial-gradient(at center center, #FFA94D 40%, #FF7E3D 72%)",

        /*
         * Slide 4 — Purple
         */
        "radial-gradient(at center center, #A259FF 0%, #6A0DAD 72%)"

    ];


    /* =====================================================
       4. SETTINGS
       ===================================================== */

    const SMALLEST_SCALE = 0.5;

    const TRANSITION_TIME = 600;

    const WHEEL_LOCK_TIME = 1000;


    /* =====================================================
       5. SLIDER STATE
       ===================================================== */

    let currentSlide = 0;

    let isAnimating = false;

    let wheelLocked = false;


    /* =====================================================
       6. INITIAL STATE
       ===================================================== */

    slides.forEach((slide, index) => {

        slide.classList.remove("active");

        slide.style.transform =
            `scale(${SMALLEST_SCALE})`;

        slide.setAttribute(
            "aria-hidden",
            index === 0 ? "false" : "true"
        );

    });


    /*
     * Activate the first slide.
     */

    slides[0].classList.add("active");

    slides[0].style.transform = "scale(1)";


    /*
     * Set initial background.
     */

    mainWrapper.style.backgroundImage =
        gradients[0];


    /*
     * Set first navigation indicator.
     */

    updateDots();


    /* =====================================================
       7. UPDATE DOTS
       ===================================================== */

    function updateDots() {

        sliderDots.forEach((dot, index) => {

            const isActive = index === currentSlide;

            dot.classList.toggle(
                "active",
                isActive
            );

            /*
             * Accessibility
             */

            if (isActive) {

                dot.setAttribute(
                    "aria-current",
                    "true"
                );

            } else {

                dot.removeAttribute(
                    "aria-current"
                );

            }

        });

    }


    /* =====================================================
       8. GO TO A PARTICULAR SLIDE
       ===================================================== */

    function goToSlide(targetIndex, direction = 1) {

        /*
         * Don't do anything if:
         *
         * - The requested slide doesn't exist
         * - We're already on that slide
         * - Another animation is running
         */

        if (
            targetIndex < 0 ||
            targetIndex >= slides.length ||
            targetIndex === currentSlide ||
            isAnimating
        ) {
            return;
        }


        isAnimating = true;


        const current = slides[currentSlide];

        const next = slides[targetIndex];


        /* =================================================
           CHANGE BACKGROUND
           ================================================= */

        mainWrapper.style.backgroundImage =
            gradients[targetIndex];


        /* =================================================
           PREPARE NEXT SLIDE
           ================================================= */

        /*
         * Remove active state first.
         */

        next.classList.remove("active");

        next.style.visibility = "visible";

        next.style.opacity = "1";

        /*
         * Start it at the original 0.5 scale.
         */

        next.style.transform =
            `scale(${SMALLEST_SCALE})`;


        /*
         * Make sure it sits above the old slide.
         */

        next.style.zIndex = "5";

        current.style.zIndex = "4";


        /* =================================================
           FORCE BROWSER TO REGISTER STARTING STATE
           ================================================= */

        next.offsetHeight;


        /* =================================================
           ANIMATE OUTGOING SLIDE
           ================================================= */

        current.style.transform =
            `scale(${SMALLEST_SCALE})`;

        current.style.opacity = "0";


        /* =================================================
           ANIMATE INCOMING SLIDE
           ================================================= */

        next.classList.add("active");

        next.style.transform = "scale(1)";

        next.style.opacity = "1";


        /* =================================================
           UPDATE CURRENT SLIDE
           ================================================= */

        currentSlide = targetIndex;


        updateDots();


        /* =================================================
           ACCESSIBILITY
           ================================================= */

        slides.forEach((slide, index) => {

            slide.setAttribute(
                "aria-hidden",
                index === currentSlide
                    ? "false"
                    : "true"
            );

        });


        /* =================================================
           WAIT FOR ANIMATION TO FINISH
           ================================================= */

        setTimeout(() => {

            /*
             * Completely hide the old slide.
             */

            current.classList.remove("active");

            current.style.visibility = "hidden";

            current.style.opacity = "0";

            current.style.zIndex = "1";


            /*
             * Keep the new slide at the top.
             */

            next.style.zIndex = "5";


            isAnimating = false;

        }, TRANSITION_TIME);

    }


    /* =====================================================
       9. NEXT SLIDE
       ===================================================== */

    function nextSlide() {

        let nextIndex =
            currentSlide + 1;


        /*
         * Loop back to first slide.
         */

        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }


        goToSlide(
            nextIndex,
            1
        );

    }


    /* =====================================================
       10. PREVIOUS SLIDE
       ===================================================== */

    function previousSlide() {

        let previousIndex =
            currentSlide - 1;


        /*
         * Loop to the last slide.
         */

        if (previousIndex < 0) {
            previousIndex =
                slides.length - 1;
        }


        goToSlide(
            previousIndex,
            -1
        );

    }


    /* =====================================================
       11. MOUSE WHEEL NAVIGATION
       ===================================================== */

    function handleWheel(event) {

        /*
         * Prevent the browser from scrolling the page.
         */

        event.preventDefault();


        /*
         * Don't allow rapid-fire scrolling.
         */

        if (
            wheelLocked ||
            isAnimating
        ) {
            return;
        }


        /*
         * Ignore very small trackpad movements.
         */

        if (
            Math.abs(event.deltaY) < 10
        ) {
            return;
        }


        wheelLocked = true;


        if (event.deltaY > 0) {

            /*
             * Scroll down
             * = next product
             */

            nextSlide();

        } else {

            /*
             * Scroll up
             * = previous product
             */

            previousSlide();

        }


        /*
         * Lock wheel briefly.
         *
         * This prevents one long mouse-wheel
         * gesture from skipping several slides.
         */

        setTimeout(() => {

            wheelLocked = false;

        }, WHEEL_LOCK_TIME);

    }


    /*
     * Listen to wheel events.
     *
     * passive:false is required because
     * we call preventDefault().
     */

    slider.addEventListener(
        "wheel",
        handleWheel,
        {
            passive: false
        }
    );


    /* =====================================================
       12. TOUCH / SWIPE NAVIGATION
       ===================================================== */

    let touchStartY = 0;

    let touchEndY = 0;

    let touchStartX = 0;

    let touchEndX = 0;


    /*
     * Finger touches screen.
     */

    slider.addEventListener(
        "touchstart",
        (event) => {

            const touch =
                event.changedTouches[0];

            touchStartY =
                touch.clientY;

            touchStartX =
                touch.clientX;

        },
        {
            passive: true
        }
    );


    /*
     * Finger leaves screen.
     */

    slider.addEventListener(
        "touchend",
        (event) => {

            const touch =
                event.changedTouches[0];

            touchEndY =
                touch.clientY;

            touchEndX =
                touch.clientX;


            handleSwipe();

        },
        {
            passive: true
        }
    );


    function handleSwipe() {

        const verticalDistance =
            touchStartY - touchEndY;

        const horizontalDistance =
            touchStartX - touchEndX;


        /*
         * We only want a primarily vertical swipe.
         */

        if (
            Math.abs(verticalDistance) <=
            Math.abs(horizontalDistance)
        ) {
            return;
        }


        /*
         * Ignore tiny movements.
         */

        if (
            Math.abs(verticalDistance) < 50
        ) {
            return;
        }


        /*
         * Finger moving upward:
         *
         * next slide
         */

        if (verticalDistance > 0) {

            nextSlide();

        }

        /*
         * Finger moving downward:
         *
         * previous slide
         */

        else {

            previousSlide();

        }

    }


    /* =====================================================
       13. KEYBOARD NAVIGATION
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Don't interfere with typing into
             * an input, textarea, etc.
             */

            const activeElement =
                document.activeElement;

            const isTyping =
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.tagName === "SELECT"
                );


            if (isTyping) {
                return;
            }


            switch (event.key) {

                case "ArrowDown":

                case "ArrowRight":

                case "PageDown":

                    event.preventDefault();

                    nextSlide();

                    break;


                case "ArrowUp":

                case "ArrowLeft":

                case "PageUp":

                    event.preventDefault();

                    previousSlide();

                    break;


                case "Home":

                    event.preventDefault();

                    goToSlide(0);

                    break;


                case "End":

                    event.preventDefault();

                    goToSlide(
                        slides.length - 1
                    );

                    break;

            }

        }
    );


    /* =====================================================
       14. SLIDER DOT BUTTONS
       ===================================================== */

    sliderDots.forEach((dot) => {

        dot.addEventListener(
            "click",
            () => {

                const target =
                    Number(
                        dot.dataset.slideTarget
                    );


                if (
                    Number.isNaN(target)
                ) {
                    return;
                }


                goToSlide(target);

            }
        );

    });


    /* =====================================================
       15. PREVENT DRAGGING OF IMAGES
       ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach((image) => {

        image.addEventListener(
            "dragstart",
            (event) => {

                event.preventDefault();

            }
        );

    });


    /* =====================================================
       16. RESIZE HANDLING
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            /*
             * Avoid unnecessary work during
             * continuous resizing.
             */

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    /*
                     * Make sure the current slide
                     * remains fully visible.
                     */

                    slides.forEach(
                        (slide, index) => {

                            if (
                                index === currentSlide
                            ) {

                                slide.style.transform =
                                    "scale(1)";

                                slide.style.opacity =
                                    "1";

                                slide.style.visibility =
                                    "visible";

                            }

                        }
                    );

                }, 150);

        }
    );


    /* =====================================================
       17. INITIAL CONSOLE MESSAGE
       ===================================================== */

    console.log(
        "Juice slider initialized."
    );

    console.log(
        `Current slide: ${currentSlide + 1}`
    );

});