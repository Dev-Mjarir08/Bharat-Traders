// Products Page JavaScript
class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentSort = 'featured';
        this.visibleCount = 6;
        this.totalCount = 48;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFilters();
        this.setupSorting();
        this.setupWishlist();
        this.setupCart();
        this.setupScrollAnimations();
        this.setupBackToTop();
        this.setupNumberCounting();
        
        this.bindEvents();
        
        console.log('Products page initialized successfully');
    }

    // Navigation with sticky behavior
    setupNavigation() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navLinks = document.getElementById('navLinks');
        this.scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset > this.scrollThreshold;
            
            if (scrolled) {
                this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.header.style.backdropFilter = 'blur(10px)';
            } else {
                this.header.style.background = '#ffffff';
                this.header.style.backdropFilter = 'none';
            }
        });
    }

    // Filter functionality
    setupFilters() {
        this.setupCategoryFilters();
        this.setupPriceFilter();
        this.setupRatingFilter();
        this.setupMaterialFilter();
        this.setupColorFilter();
        this.setupClearFilters();
    }

    setupCategoryFilters() {
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    setupPriceFilter() {
        const priceSlider = document.getElementById('priceSlider');
        const priceValue = document.getElementById('priceValue');
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');

        priceSlider.addEventListener('input', () => {
            const value = priceSlider.value;
            priceValue.textContent = value;
            maxPriceInput.value = value;
            this.applyFilters();
        });

        minPriceInput.addEventListener('input', () => {
            this.applyFilters();
        });

        maxPriceInput.addEventListener('input', () => {
            priceSlider.value = maxPriceInput.value;
            priceValue.textContent = maxPriceInput.value;
            this.applyFilters();
        });
    }

    setupRatingFilter() {
        const ratingRadios = document.querySelectorAll('input[name="rating"]');
        ratingRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    setupMaterialFilter() {
        const materialCheckboxes = document.querySelectorAll('input[name="material"]');
        materialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    setupColorFilter() {
        const colorCheckboxes = document.querySelectorAll('input[name="color"]');
        colorCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    setupClearFilters() {
        const clearBtn = document.getElementById('clearFilters');
        clearBtn.addEventListener('click', () => {
            this.clearAllFilters();
        });
    }

    applyFilters() {
        const selectedCategories = this.getSelectedValues('category');
        const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseInt(document.getElementById('maxPrice').value) || 5000;
        const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
        const selectedMaterials = this.getSelectedValues('material');
        const selectedColors = this.getSelectedValues('color');

        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        productCards.forEach(card => {
            const price = parseInt(card.dataset.price);
            const rating = parseFloat(card.dataset.rating);
            const category = card.dataset.category;
            const material = card.dataset.material;
            const color = card.dataset.color;

            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const priceMatch = price >= minPrice && price <= maxPrice;
            const ratingMatch = !selectedRating || rating >= parseFloat(selectedRating);
            const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(material);
            const colorMatch = selectedColors.length === 0 || selectedColors.includes(color);

            if (categoryMatch && priceMatch && ratingMatch && materialMatch && colorMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        this.updateResultsCount(visibleCount);
    }

    getSelectedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    clearAllFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Uncheck all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(rb => {
            rb.checked = false;
        });

        // Reset price range
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 5000;
        document.getElementById('priceSlider').value = 5000;
        document.getElementById('priceValue').textContent = '5000';

        // Reapply filters to show all products
        this.applyFilters();
    }

    updateResultsCount(visibleCount) {
        const showingCount = document.getElementById('showingCount');
        showingCount.textContent = visibleCount;
    }

    // Sorting functionality
    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortProducts();
        });
    }

    sortProducts() {
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        const productsGrid = document.getElementById('productsGrid');

        productCards.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const ratingA = parseFloat(a.dataset.rating);
            const ratingB = parseFloat(b.dataset.rating);

            switch (this.currentSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'rating':
                    return ratingB - ratingA;
                case 'newest':
                case 'featured':
                default:
                    return 0; // Keep original order
            }
        });

        // Reappend sorted products
        productCards.forEach(card => {
            productsGrid.appendChild(card);
        });
    }

    // Wishlist functionality
    setupWishlist() {
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const icon = btn.querySelector('i');
                btn.classList.toggle('active');
                
                if (btn.classList.contains('active')) {
                    icon.className = 'fas fa-heart';
                    this.showNotification('Added to wishlist!');
                } else {
                    icon.className = 'far fa-heart';
                    this.showNotification('Removed from wishlist!');
                }
            });
        });
    }

    // Cart functionality
    setupCart() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = btn.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                const productPrice = productCard.querySelector('.current-price').textContent;
                
                this.addToCart(productTitle, productPrice);
            });
        });
    }

    addToCart(productTitle, productPrice) {
        // In a real application, this would update a cart state or send to backend
        this.showNotification(`${productTitle} added to cart!`, 'success');
        
        // You could also update cart count in header here
        this.updateCartCount();
    }

    updateCartCount() {
        // Update cart count in header (if you have a cart icon with count)
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
        }
    }

    // Load more functionality
    setupLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    loadMoreProducts() {
        // Simulate loading more products
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            this.visibleCount += 6;
            this.updateResultsCount(this.visibleCount);
            
            loadMoreBtn.innerHTML = 'Load More Products <i class="fas fa-chevron-down"></i>';
            loadMoreBtn.disabled = false;

            // If all products are loaded, hide the button
            if (this.visibleCount >= this.totalCount) {
                loadMoreBtn.style.display = 'none';
            }
        }, 1000);
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animate;
                    const delay = parseInt(element.dataset.delay) || 0;

                    setTimeout(() => {
                        element.classList.add(`animate-${animationType}`);
                    }, delay);

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Number counting animation
    setupNumberCounting() {
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumbers(entry.target);
                    numberObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number[data-count]').forEach(el => {
            numberObserver.observe(el);
        });
    }

    animateNumbers(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // Back to top functionality
    setupBackToTop() {
        this.backToTopBtn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        });

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Event binding
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenuBtn.classList.toggle('active');
                this.navLinks.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.mobile-menu-btn')) {
                this.mobileMenuBtn.classList.remove('active');
                this.navLinks.classList.remove('active');
            }
        });

        // Handle resize events
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navLinks.classList.contains('active')) {
                this.mobileMenuBtn.classList.remove('active');
                this.navLinks.classList.remove('active');
            }
        });

        // Initialize load more
        this.setupLoadMore();
    }
}

// Initialize the products page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsPage();
});