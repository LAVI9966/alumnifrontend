"use client";

// Apply smooth scrolling to the entire document
export const enableSmoothScroll = () => {
    if (typeof document !== 'undefined') {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
};

// Scroll to a specific element by ID with smooth scrolling
export const scrollToElement = (elementId, offset = 0, delay = 0) => {
    if (typeof document !== 'undefined') {
        const element = document.getElementById(elementId);
        if (element) {
            if (delay > 0) {
                // First scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Then scroll to element after delay
                setTimeout(() => {
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, delay);
            } else {
                // Immediate scroll
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            return true;
        }
    }
    return false;
};

// Handle anchor links with smooth scrolling
export const setupSmoothHashScroll = () => {
    if (typeof document !== 'undefined') {
        // Apply smooth scrolling for all internal hash links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');

            if (!target) return;

            // Only intercept hash links to the current page
            const href = target.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const id = href.substring(1);
                scrollToElement(id, 80); // 80px offset for header height
            }
        });

        // Handle initial load with hash in URL
        if (window.location.hash) {
            // First scroll to the top
            window.scrollTo(0, 0);

            // Then scroll to the hash section after a delay
            setTimeout(() => {
                const id = window.location.hash.substring(1);
                scrollToElement(id, 80);
            }, 800); // Longer delay to allow user to see the top of the page first
        }
    }
};

// Apply scroll to hash after navigation with smooth behavior
export const handleHashNavigation = (hash, fromDifferentPage = true) => {
    if (typeof window !== 'undefined' && hash) {
        if (fromDifferentPage) {
            // First scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Then scroll to the section after a delay
            setTimeout(() => {
                const id = hash.replace('#', '');
                scrollToElement(id, 80);
            }, 800); // Longer delay to allow user to see the top of the page first
        } else {
            // If on the same page, just scroll directly
            const id = hash.replace('#', '');
            scrollToElement(id, 80);
        }
    }
};