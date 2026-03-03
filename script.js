document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. STICKY HEADER FUNCTIONALITY
    // -----------------------------------------------------------------
    const header = document.querySelector('.topbar');
    let lastScrollY = window.scrollY;

    // We want it to become sticky after scrolling past the initial top bar height (e.g. 100px)
    const stickyThreshold = 100;

    // Optional: clone the header to act as the sticky one so the page doesn't jump
    const stickyHeader = header.cloneNode(true);
    stickyHeader.classList.add('sticky-version');
    document.body.appendChild(stickyHeader);

    // Style the cloned header in JS to keep CSS clean, or rely on CSS classes
    // We will rely on CSS classes added dynamically

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Determine scroll direction
        if (currentScroll > lastScrollY && currentScroll > stickyThreshold) {
            // Scrolling DOWN: Sticky header appears
            stickyHeader.classList.add('visible');
        } else {
            // Scrolling UP: Sticky header hides
            stickyHeader.classList.remove('visible');
        }

        lastScrollY = currentScroll;
    });

    // -----------------------------------------------------------------
    // 2. IMAGE CAROUSEL FUNCTIONALITY
    // -----------------------------------------------------------------
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const nextBtn = document.querySelector('.next-arrow');
    const prevBtn = document.querySelector('.prev-arrow');

    let currentIndex = 0;
    const mainImageWrapper = document.getElementById('mainImageWrapper');
    const zoomResult = document.getElementById('zoomResult');

    // Extract image sources from thumbnails to use for main display
    // Using getAttribute('src') ensures we get the exact relative path
    const images = Array.from(thumbnails).map(thumb => thumb.querySelector('img').getAttribute('src'));

    function updateMainImage(index) {
        // Remove active class from all
        thumbnails.forEach(thumb => thumb.classList.remove('active'));

        // Add active class to current
        thumbnails[index].classList.add('active');

        // Update main image source
        const newSrc = images[index];
        mainImage.src = newSrc;

        // CRITICAL: Update zoom background source only when the image changes
        // Use quotes around the URL to handle special characters or spaces
        if (zoomResult) {
            zoomResult.style.backgroundImage = `url("${newSrc}")`;
        }
    }

    // Initial sync to ensure main image and zoom background match the first thumbnail
    if (images.length > 0) {
        updateMainImage(0);
    }

    // Thumbnail Click Event
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateMainImage(currentIndex);
        });
    });

    // Next Arrow Click
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent trigger zoom on click
        currentIndex = (currentIndex + 1) % images.length;
        updateMainImage(currentIndex);
    });

    // Prev Arrow Click
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent trigger zoom on click
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateMainImage(currentIndex);
    });

    // Click on Main Image to cycle
    mainImage.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateMainImage(currentIndex);
    });

    mainImageWrapper.addEventListener('mousemove', (e) => {
        // Only run zoom if we have a valid image source
        if (!mainImage.src) return;

        // Get the bounding rectangle of the wrapper
        const rect = mainImageWrapper.getBoundingClientRect();

        // Calculate the mouse position relative to the wrapper (0 to 1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Position the background so the part under the mouse is magnified
        // We set backgroundSize once in CSS or when updating image to avoid jitter
        zoomResult.style.backgroundSize = '250%';

        const bgX = x * 100;
        const bgY = y * 100;

        zoomResult.style.backgroundPosition = `${bgX}% ${bgY}%`;
    });

    // -----------------------------------------------------------------
    // 4. FAQ ACCORDION FUNCTIONALITY
    // -----------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('polyline');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.display = 'none';

                // Reset icon to point downward
                const otherIcon = otherItem.querySelector('polyline');
                if (otherIcon) {
                    otherIcon.setAttribute('points', '6 9 12 15 18 9');
                }
            });

            // Open the clicked one if it was closed
            if (!isActive) {
                item.classList.add('active');
                answer.style.display = 'block';
                // Set icon to point upward
                if (icon) {
                    icon.setAttribute('points', '18 15 12 9 6 15');
                }
            } else {
                // If it was open, it's now closed as part of the loop above. Re-set icon explicitly just in case.
                if (icon) {
                    icon.setAttribute('points', '6 9 12 15 18 9');
                }
            }
        });
    });
    // -----------------------------------------------------------------
    // 5. APPLICATIONS SLIDER FUNCTIONALITY
    // -----------------------------------------------------------------
    const appsSlider = document.getElementById('appsSlider');
    const prevAppBtn = document.querySelector('.prev-app');
    const nextAppBtn = document.querySelector('.next-app');

    if (appsSlider && prevAppBtn && nextAppBtn) {
        const scrollAmount = 344; // Card width (320) + gap (24)

        nextAppBtn.addEventListener('click', () => {
            appsSlider.parentElement.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevAppBtn.addEventListener('click', () => {
            appsSlider.parentElement.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }
    // -----------------------------------------------------------------
    // 6. MANUFACTURING PROCESS TABS
    // -----------------------------------------------------------------
    const processTabs = document.querySelectorAll('.process-tab');
    const processStepTitle = document.querySelector('.process-step-title');
    const processVisualImg = document.querySelector('.process-visual img');

    const stepsData = {
        1: { title: "High-Grade Raw Material Selection", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" },
        2: { title: "Precision Extrusion Control", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800" },
        3: { title: "Optimized Cooling Process", img: "https://images.unsplash.com/photo-1565152865715-412e86488730?auto=format&fit=crop&q=80&w=800" },
        4: { title: "Automated Vacuum Sizing", img: "https://images.unsplash.com/photo-1454165833767-02a698d1316a?auto=format&fit=crop&q=80&w=800" },
        5: { title: "Rigorous Quality Control", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" },
        6: { title: "Inkjet Marking & Identification", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800" },
        7: { title: "Precision Length Cutting", img: "https://images.unsplash.com/photo-1565152865715-412e86488730?auto=format&fit=crop&q=80&w=800" },
        8: { title: "Final Packaging & Dispatch", img: "https://images.unsplash.com/photo-1454165833767-02a698d1316a?auto=format&fit=crop&q=80&w=800" }
    };

    processTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const step = tab.getAttribute('data-step');

            // Update active tab
            processTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content with a quick fade animation (optional feel)
            if (stepsData[step]) {
                processStepTitle.textContent = stepsData[step].title;
                processVisualImg.src = stepsData[step].img;
            }
        });
    });

    // -----------------------------------------------------------------
    // 7. MOBILE NAVIGATION TOGGLE
    // -----------------------------------------------------------------
    const body = document.body;
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const closeBtn = document.querySelector('.mobile-menu-close');

    // Function to open menu
    function openMobileMenu() {
        mobileNavOverlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent scroll
    }

    // Function to close menu
    function closeMobileMenu() {
        mobileNavOverlay.classList.remove('active');
        body.style.overflow = ''; // Restore scroll
    }

    // Since the header might be cloned for sticky effect, we use event delegation for toggles
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-menu-toggle')) {
            openMobileMenu();
        }

        if (e.target.closest('.mobile-menu-close') || e.target === mobileNavOverlay) {
            closeMobileMenu();
        }

        // Close when clicking a link
        if (e.target.closest('.mobile-nav-link')) {
            closeMobileMenu();
        }
    });

    // -----------------------------------------------------------------
    // 8. CATALOGUE REQUEST MODAL
    // -----------------------------------------------------------------
    const catalogueModal = document.getElementById('catalogueModal');
    const catalogueBtns = document.querySelectorAll('.catalogue-btn');
    const closeModalBtn = document.getElementById('closeModal');

    function openCatalogueModal() {
        catalogueModal.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeCatalogueModal() {
        catalogueModal.classList.remove('active');
        body.style.overflow = ''; // Restore scroll
    }

    catalogueBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCatalogueModal();
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCatalogueModal);
    }

    // Close on overlay click
    if (catalogueModal) {
        catalogueModal.addEventListener('click', (e) => {
            if (e.target === catalogueModal) {
                closeCatalogueModal();
            }
        });
    }

    // -----------------------------------------------------------------
    // 9. EXPERT CALL BACK MODAL
    // -----------------------------------------------------------------
    const expertModal = document.getElementById('expertModal');
    const expertBtns = document.querySelectorAll('.expert-trigger');
    const closeExpertModalBtn = document.getElementById('closeExpertModal');

    function openExpertModal() {
        expertModal.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeExpertModal() {
        expertModal.classList.remove('active');
        body.style.overflow = '';
    }

    expertBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openExpertModal();
        });
    });

    if (closeExpertModalBtn) {
        closeExpertModalBtn.addEventListener('click', closeExpertModal);
    }

    // Close on overlay click
    if (expertModal) {
        expertModal.addEventListener('click', (e) => {
            if (e.target === expertModal) {
                closeExpertModal();
            }
        });
    }

});
