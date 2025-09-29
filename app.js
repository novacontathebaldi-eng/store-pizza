/**
 * Pizzaria Santa Sensação - Complete Application (Fixed Version)
 * Features: Real-time Firebase sync, Device detection, Cart management, Admin panel
 * Author: AI Assistant
 * Date: 2024
 */

class PizzariaSantaSensacao {
    constructor() {
        // Firebase configuration
        this.firebaseConfig = {
            apiKey: "AIzaSyCTMHlUCGOpU7VRIdbP2VADzUF9n1lI88A",
            authDomain: "site-pizza-a2930.firebaseapp.com",
            projectId: "site-pizza-a2930",
            storageBucket: "site-pizza-a2930.firebasestorage.app",
            messagingSenderId: "914255031241",
            appId: "1:914255031241:web:84ae273b22cb7d04499618"
        };

        // Application state
        this.cart = [];
        this.isOnline = true;
        this.currentUser = null;
        this.currentCategory = 'pizzas-salgadas';
        this.categories = [];
        this.products = [];
        this.editingProductId = null;
        this.firebaseInitialized = false;
        
        // Device detection
        this.deviceType = this.detectDevice();
        
        // Sample data for fallback
        this.sampleCategories = [
            { id: 'pizzas-salgadas', name: 'Pizzas Salgadas', order: 1, active: true },
            { id: 'pizzas-doces', name: 'Pizzas Doces', order: 2, active: true },
            { id: 'bebidas', name: 'Bebidas', order: 3, active: true },
            { id: 'sobremesas', name: 'Sobremesas', order: 4, active: true },
            { id: 'aperitivos', name: 'Aperitivos', order: 5, active: true }
        ];

        this.sampleProducts = [
            {
                id: 'margherita',
                name: 'Pizza Margherita',
                description: 'Molho de tomate, mozzarella de búfala, manjericão fresco e azeite extravirgem',
                categoryId: 'pizzas-salgadas',
                prices: { P: 32.00, M: 42.00, G: 48.00 },
                badge: 'Popular',
                active: true
            },
            {
                id: 'calabresa',
                name: 'Calabresa Especial',
                description: 'Molho de tomate, calabresa artesanal, cebola roxa, azeitonas pretas e orégano',
                categoryId: 'pizzas-salgadas',
                prices: { P: 35.00, M: 45.00, G: 52.00 },
                active: true
            },
            {
                id: 'portuguesa',
                name: 'Portuguesa Premium',
                description: 'Presunto parma, ovos caipira, ervilhas fresquinhas e azeitonas portuguesas',
                categoryId: 'pizzas-salgadas',
                prices: { P: 42.00, M: 52.00, G: 58.00 },
                badge: 'Premium',
                active: true
            },
            {
                id: 'quatro-queijos',
                name: '4 Queijos Gourmet',
                description: 'Mozzarella, gorgonzola DOP, parmesão reggiano e catupiry premium',
                categoryId: 'pizzas-salgadas',
                prices: { P: 45.00, M: 55.00, G: 62.00 },
                badge: 'Gourmet',
                active: true
            },
            {
                id: 'frango-catupiry',
                name: 'Frango com Catupiry',
                description: 'Frango desfiado temperado, catupiry premium, milho e azeitonas',
                categoryId: 'pizzas-salgadas',
                prices: { P: 40.00, M: 50.00, G: 57.00 },
                active: true
            },
            {
                id: 'chocolate-morango',
                name: 'Chocolate com Morango',
                description: 'Massa doce, nutella, morangos frescos, banana e açúcar de confeiteiro',
                categoryId: 'pizzas-doces',
                prices: { P: 28.00, M: 35.00, G: 42.00 },
                badge: 'Popular',
                active: true
            },
            {
                id: 'banana-canela',
                name: 'Banana com Canela',
                description: 'Massa doce, banana, canela em pó, açúcar cristal e leite condensado',
                categoryId: 'pizzas-doces',
                prices: { P: 25.00, M: 32.00, G: 38.00 },
                active: true
            },
            {
                id: 'romeu-julieta',
                name: 'Romeu e Julieta',
                description: 'Queijo minas frescal, goiabada cremosa e açúcar de confeiteiro',
                categoryId: 'pizzas-doces',
                prices: { P: 30.00, M: 37.00, G: 44.00 },
                active: true
            },
            {
                id: 'coca-2l',
                name: 'Coca-Cola 2L',
                description: 'Refrigerante Coca-Cola 2 litros gelado',
                categoryId: 'bebidas',
                prices: { Única: 8.00 },
                active: true
            },
            {
                id: 'guarana-2l',
                name: 'Guaraná Antarctica 2L',
                description: 'Refrigerante Guaraná Antarctica 2 litros gelado',
                categoryId: 'bebidas',
                prices: { Única: 8.00 },
                active: true
            },
            {
                id: 'agua-500ml',
                name: 'Água Mineral 500ml',
                description: 'Água mineral sem gás Crystal',
                categoryId: 'bebidas',
                prices: { Única: 3.00 },
                active: true
            },
            {
                id: 'pudim',
                name: 'Pudim de Leite Condensado',
                description: 'Pudim cremoso feito com leite condensado e calda de açúcar',
                categoryId: 'sobremesas',
                prices: { Única: 12.00 },
                active: true
            },
            {
                id: 'brigadeiro',
                name: 'Brigadeiro Gourmet',
                description: 'Brigadeiro artesanal com chocolate belga',
                categoryId: 'sobremesas',
                prices: { Única: 15.00 },
                active: true
            },
            {
                id: 'batata-frita',
                name: 'Batata Frita Especial',
                description: 'Batata frita crocante temperada com ervas',
                categoryId: 'aperitivos',
                prices: { Única: 18.00 },
                active: true
            },
            {
                id: 'coxinha',
                name: 'Coxinha de Frango',
                description: 'Coxinha artesanal recheada com frango desfiado',
                categoryId: 'aperitivos',
                prices: { Única: 8.00 },
                active: true
            }
        ];
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🍕 Inicializando Pizzaria Santa Sensação...');
            
            // Apply device-specific styles
            this.applyDeviceStyles();
            
            // Load sample data immediately for better UX
            this.loadSampleData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load cart from localStorage
            this.loadCart();
            
            // Try to initialize Firebase (fallback to sample data if fails)
            try {
                await this.initFirebase();
                this.setupFirebaseListeners();
            } catch (error) {
                console.warn('⚠️ Firebase não disponível, usando dados de amostra:', error);
                this.firebaseInitialized = false;
            }
            
            // Handle hash changes for admin
            this.handleHashChange();
            
            console.log('✅ Aplicação inicializada com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.showError('Erro ao carregar a aplicação. Usando dados de amostra.');
        }
    }

    /**
     * Load sample data for immediate display
     */
    loadSampleData() {
        this.categories = [...this.sampleCategories];
        this.products = [...this.sampleProducts];
        this.updateCategoriesUI();
        this.updateMenuItems();
        console.log('🎯 Dados de amostra carregados');
    }

    /**
     * Device Detection
     */
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIOS) return 'ios';
        if (isAndroid) return 'android';
        return 'desktop';
    }

    applyDeviceStyles() {
        document.body.className = `device-${this.deviceType}`;
        
        // iOS specific adjustments
        if (this.deviceType === 'ios') {
            document.addEventListener('touchstart', () => {}, { passive: true });
        }
        
        console.log(`🔧 Device detected: ${this.deviceType}`);
    }

    /**
     * Firebase Setup
     */
    async initFirebase() {
        firebase.initializeApp(this.firebaseConfig);
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.firebaseInitialized = true;
        console.log('🔥 Firebase inicializado');
    }

    /**
     * Firebase Listeners
     */
    setupFirebaseListeners() {
        if (!this.firebaseInitialized) return;

        // Listen to pizzaria status
        this.db.doc('settings/pizzariaStatus').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                this.isOnline = Boolean(data.online);
                this.updateStatusUI();
                console.log(`📊 Status atualizado: ${this.isOnline ? 'Aberto' : 'Fechado'}`);
            }
        }, error => {
            console.warn('⚠️ Erro ao ouvir status (usando fallback):', error);
        });

        // Listen to categories
        this.db.collection('menu_categories')
            .orderBy('order')
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    this.categories = [];
                    snapshot.forEach(doc => {
                        this.categories.push({ id: doc.id, ...doc.data() });
                    });
                    this.updateCategoriesUI();
                    console.log(`📁 ${this.categories.length} categorias carregadas do Firebase`);
                }
            }, error => {
                console.warn('⚠️ Erro ao carregar categorias (usando dados de amostra):', error);
            });

        // Listen to products
        this.db.collection('menu_items')
            .where('active', '==', true)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    this.products = [];
                    snapshot.forEach(doc => {
                        this.products.push({ id: doc.id, ...doc.data() });
                    });
                    this.updateMenuItems();
                    console.log(`🍕 ${this.products.length} produtos carregados do Firebase`);
                }
            }, error => {
                console.warn('⚠️ Erro ao carregar produtos (usando dados de amostra):', error);
            });

        // Seed initial data if needed
        this.seedInitialData();
    }

    /**
     * Event Listeners Setup
     */
    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const mainNav = document.getElementById('mainNav');
        
        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', () => {
                mainNav.classList.toggle('open');
                console.log('📱 Mobile menu toggled');
            });

            // Close mobile menu when clicking nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('open');
                });
            });
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const onclick = anchor.getAttribute('onclick');
                if (onclick) return; // Skip if has onclick handler
                
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Category buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-btn')) {
                this.switchCategory(e.target.dataset.category);
            }
        });

        // Admin form submission
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }

        // Checkout form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout();
            });
        }

        // Product form submission
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Payment method change
        const paymentMethod = document.getElementById('paymentMethod');
        if (paymentMethod) {
            paymentMethod.addEventListener('change', (e) => {
                this.toggleChangeOptions(e.target.value === 'cash');
            });
        }

        // Order type change
        const orderType = document.getElementById('orderType');
        if (orderType) {
            orderType.addEventListener('change', (e) => {
                this.toggleAddressField(e.target.value === 'delivery');
            });
        }

        // Need change toggle
        const needChange = document.getElementById('needChange');
        if (needChange) {
            needChange.addEventListener('change', (e) => {
                const changeAmount = document.getElementById('changeAmount');
                if (changeAmount) {
                    changeAmount.classList.toggle('hidden', e.target.value === 'no');
                }
            });
        }

        // Admin tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.admin-tab')) {
                this.switchAdminTab(e.target.dataset.tab);
            }
        });

        // Hash change for admin access
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeCart();
                if (mainNav) mainNav.classList.remove('open');
            }
        });

        // Pizzaria status toggle (admin)
        const pizzariaStatus = document.getElementById('pizzariaStatus');
        if (pizzariaStatus) {
            pizzariaStatus.addEventListener('change', (e) => {
                this.togglePizzariaStatus(e.target.checked);
            });
        }
    }

    /**
     * Navigation and Scrolling
     */
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Account for sticky header
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update active nav link
            this.updateActiveNavLink(sectionId);
        }
    }

    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Hash Change Handler for Admin
     */
    handleHashChange() {
        const hash = window.location.hash;
        
        if (hash === '#admin') {
            this.showAdminSection();
        } else {
            this.hideAdminSection();
            if (hash && hash.startsWith('#')) {
                this.scrollToSection(hash.substring(1));
            }
        }
    }

    showAdminSection() {
        const adminSection = document.getElementById('admin');
        if (adminSection) {
            adminSection.classList.remove('hidden');
            this.scrollToSection('admin');
        }
    }

    hideAdminSection() {
        const adminSection = document.getElementById('admin');
        if (adminSection) {
            adminSection.classList.add('hidden');
        }
    }

    /**
     * Menu Management
     */
    switchCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === categoryId) {
                btn.classList.add('active');
            }
        });

        this.updateMenuItems();
        console.log(`📂 Categoria alterada para: ${categoryId}`);
    }

    updateCategoriesUI() {
        const categoriesContainer = document.querySelector('.menu-categories');
        if (!categoriesContainer || this.categories.length === 0) return;

        categoriesContainer.innerHTML = this.categories.map((category, index) => `
            <button class="category-btn ${index === 0 ? 'active' : ''}" data-category="${category.id}">
                <i class="${this.getCategoryIcon(category.id)}"></i>
                <span>${category.name}</span>
            </button>
        `).join('');

        // Set first category as active if none is set
        if (this.categories.length > 0 && !this.currentCategory) {
            this.currentCategory = this.categories[0].id;
        }
    }

    getCategoryIcon(categoryId) {
        const iconMap = {
            'pizzas-salgadas': 'fas fa-pizza-slice',
            'pizzas-doces': 'fas fa-birthday-cake',
            'bebidas': 'fas fa-glass-water',
            'sobremesas': 'fas fa-ice-cream',
            'aperitivos': 'fas fa-drumstick-bite'
        };
        return iconMap[categoryId] || 'fas fa-utensils';
    }

    updateMenuItems() {
        const menuContainer = document.getElementById('menuItems');
        if (!menuContainer) return;

        const categoryProducts = this.products.filter(product => 
            product.categoryId === this.currentCategory
        );

        if (categoryProducts.length === 0) {
            menuContainer.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-utensils"></i>
                    <p>Nenhum item encontrado nesta categoria.</p>
                    <small>Tente selecionar outra categoria ou recarregar a página.</small>
                </div>
            `;
            return;
        }

        menuContainer.innerHTML = `
            <div class="menu-items-grid">
                ${categoryProducts.map(product => this.renderMenuItem(product)).join('')}
            </div>
        `;

        this.setupMenuItemEvents();
        console.log(`🍕 ${categoryProducts.length} itens exibidos para categoria: ${this.currentCategory}`);
    }

    renderMenuItem(product) {
        const imageUrl = product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300.webp`;
        const sizes = Object.keys(product.prices || {});
        const hasMultipleSizes = sizes.length > 1;
        const minPrice = Math.min(...Object.values(product.prices || {}));

        return `
            <div class="menu-item" data-product-id="${product.id}">
                <div class="menu-item-image">
                    <img src="${imageUrl}" alt="${product.name}" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; position: absolute; inset: 0; align-items: center; justify-content: center; background: var(--brand-green-300);">
                        <i class="fas fa-pizza-slice" style="font-size: 3rem; color: var(--brand-green-700);"></i>
                    </div>
                    ${product.badge ? `<div class="menu-item-badge">${product.badge}</div>` : ''}
                </div>
                <div class="menu-item-content">
                    <h4 class="menu-item-name">${product.name}</h4>
                    <p class="menu-item-description">${product.description || ''}</p>
                    
                    ${hasMultipleSizes ? `
                        <div class="menu-item-sizes">
                            ${sizes.map((size, index) => `
                                <button class="size-option ${index === 0 ? 'active' : ''}" 
                                        data-size="${size}" 
                                        data-price="${product.prices[size]}">
                                    ${size} - ${this.formatPrice(product.prices[size])}
                                </button>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="menu-item-sizes">
                            <div class="size-option active" 
                                 data-size="${sizes[0]}" 
                                 data-price="${product.prices[sizes[0]]}">
                                ${this.formatPrice(product.prices[sizes[0]])}
                            </div>
                        </div>
                    `}
                    
                    <div class="menu-item-footer">
                        <div class="menu-item-price">
                            A partir de ${this.formatPrice(minPrice)}
                        </div>
                        <button class="add-to-cart-btn" 
                                data-product-id="${product.id}" 
                                ${!this.isOnline ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                            ${!this.isOnline ? 'Fechado' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupMenuItemEvents() {
        // Size selection
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!e.target.dataset.price) return; // Skip non-interactive size displays
                
                const container = e.target.closest('.menu-item');
                container.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Add to cart
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isOnline) return;
                
                const productId = e.target.dataset.productId;
                this.addToCart(productId);
            });
        });
    }

    /**
     * Cart Management
     */
    addToCart(productId) {
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (!productElement) return;

        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Get selected size and price
        const activeSize = productElement.querySelector('.size-option.active');
        if (!activeSize) return;

        const selectedSize = activeSize.dataset.size;
        const selectedPrice = parseFloat(activeSize.dataset.price);

        if (!selectedSize || !selectedPrice) return;

        // Check if item already exists in cart
        const existingItem = this.cart.find(item => 
            item.productId === productId && item.size === selectedSize
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                productId,
                name: product.name,
                size: selectedSize,
                price: selectedPrice,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showCartFeedback();

        console.log(`🛒 Adicionado ao carrinho: ${product.name} (${selectedSize})`);
    }

    showCartFeedback() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
    }

    updateCartCount() {
        const countElement = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (countElement) {
            countElement.textContent = totalItems;
            countElement.classList.toggle('hidden', totalItems === 0);
        }
    }

    updateCartItems() {
        const emptyCart = document.getElementById('emptyCart');
        const cartItems = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartItems) cartItems.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartItems) cartItems.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'block';

            if (cartItems) {
                cartItems.innerHTML = this.cart.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <i class="fas fa-pizza-slice"></i>
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-size">${item.size}</div>
                            <div class="cart-item-controls">
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="app.updateCartQuantity(${index}, -1)">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="quantity-display">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="app.updateCartQuantity(${index}, 1)">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    updateCartQuantity(index, change) {
        if (index < 0 || index >= this.cart.length) return;

        this.cart[index].quantity += change;

        if (this.cart[index].quantity <= 0) {
            this.cart.splice(index, 1);
        }

        this.saveCart();
        this.updateCartUI();
        this.updateCheckoutSummary();
    }

    updateCartTotal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(total);
        }
    }

    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) {
            sidebar.classList.toggle('hidden');
            
            if (!sidebar.classList.contains('hidden')) {
                document.body.style.overflow = 'hidden';
                this.updateCartUI();
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) {
            sidebar.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    /**
     * Checkout Process
     */
    showCheckoutModal() {
        if (this.cart.length === 0) {
            this.showError('Seu carrinho está vazio!');
            return;
        }

        if (!this.isOnline) {
            this.showError('Desculpe, estamos fechados no momento.');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.updateCheckoutSummary();
        }
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    toggleAddressField(show) {
        const addressGroup = document.getElementById('addressGroup');
        if (addressGroup) {
            addressGroup.classList.toggle('hidden', !show);
            
            const addressField = document.getElementById('customerAddress');
            if (addressField) {
                addressField.required = show;
            }
        }
    }

    toggleChangeOptions(show) {
        const changeGroup = document.getElementById('changeGroup');
        if (changeGroup) {
            changeGroup.classList.toggle('hidden', !show);
        }
    }

    updateCheckoutSummary() {
        const itemsContainer = document.getElementById('checkoutItems');
        const totalContainer = document.getElementById('checkoutTotal');

        if (itemsContainer) {
            itemsContainer.innerHTML = this.cart.map(item => `
                <div class="checkout-item">
                    <div>
                        <strong>${item.quantity}x ${item.name}</strong>
                        <br><small>${item.size}</small>
                    </div>
                    <div>${this.formatPrice(item.price * item.quantity)}</div>
                </div>
            `).join('');
        }

        if (totalContainer) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalContainer.textContent = this.formatPrice(total);
        }
    }

    handleCheckout() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        const data = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            orderType: document.getElementById('orderType').value,
            address: document.getElementById('customerAddress').value.trim(),
            paymentMethod: document.getElementById('paymentMethod').value,
            needChange: document.getElementById('needChange').value,
            paymentAmount: document.getElementById('paymentAmount').value,
            notes: document.getElementById('orderNotes').value.trim()
        };

        // Validation
        if (!data.name || !data.phone || !data.orderType || !data.paymentMethod) {
            this.showError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (data.orderType === 'delivery' && !data.address) {
            this.showError('Por favor, informe o endereço de entrega.');
            return;
        }

        if (data.paymentMethod === 'cash' && data.needChange === 'yes' && !data.paymentAmount) {
            this.showError('Por favor, informe o valor que você tem para pagamento.');
            return;
        }

        // Generate WhatsApp message
        const message = this.generateWhatsAppMessage(data);
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/5527996500341?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart and close modals
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.closeCheckoutModal();
        this.closeCart();

        this.showSuccess('Pedido enviado! Você será redirecionado para o WhatsApp.');
    }

    generateWhatsAppMessage(data) {
        let message = '*🍕 PEDIDO - PIZZARIA SANTA SENSAÇÃO*\n\n';
        
        message += '*📋 DADOS DO CLIENTE:*\n';
        message += `Nome: ${data.name}\n`;
        message += `Telefone: ${data.phone}\n`;
        message += `Tipo: ${this.getOrderTypeLabel(data.orderType)}\n`;
        
        if (data.orderType === 'delivery') {
            message += `Endereço: ${data.address}\n`;
        }
        
        message += '\n*🛒 ITENS DO PEDIDO:*\n';
        this.cart.forEach(item => {
            message += `• ${item.quantity}x ${item.name}`;
            if (item.size !== 'Única') {
                message += ` (${item.size})`;
            }
            message += ` - ${this.formatPrice(item.price * item.quantity)}\n`;
        });

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\n*💰 TOTAL: ${this.formatPrice(total)}*\n\n`;
        
        message += '*💳 PAGAMENTO:*\n';
        message += `Forma: ${this.getPaymentMethodLabel(data.paymentMethod)}\n`;
        
        if (data.paymentMethod === 'cash') {
            if (data.needChange === 'yes') {
                message += `Troco para: ${this.formatPrice(parseFloat(data.paymentAmount))}\n`;
                const change = parseFloat(data.paymentAmount) - total;
                message += `Troco: ${this.formatPrice(change)}\n`;
            } else {
                message += 'Valor exato ✓\n';
            }
        }
        
        if (data.notes) {
            message += `\n*📝 OBSERVAÇÕES:*\n${data.notes}\n`;
        }
        
        message += '\n_Pedido gerado pelo site da Pizzaria Santa Sensação_';
        
        return message;
    }

    getOrderTypeLabel(type) {
        const labels = {
            'delivery': '🚚 Entrega',
            'pickup': '🏪 Retirada',
            'local': '🍽️ Consumir no local'
        };
        return labels[type] || type;
    }

    getPaymentMethodLabel(method) {
        const labels = {
            'credit': '💳 Cartão de Crédito',
            'debit': '💳 Cartão de Débito',
            'pix': '📱 PIX',
            'cash': '💵 Dinheiro'
        };
        return labels[method] || method;
    }

    /**
     * Admin Functions
     */
    handleAdminLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('adminError');
        const loadingDiv = document.getElementById('adminLoading');

        // Show loading
        if (loadingDiv) loadingDiv.classList.remove('hidden');
        if (errorDiv) errorDiv.classList.add('hidden');

        // Simple validation (in production, use Firebase Auth)
        setTimeout(() => {
            if (email === 'admin@santa.com' && password === 'admin123') {
                this.currentUser = { email, role: 'admin' };
                this.showAdminPanel();
                if (loadingDiv) loadingDiv.classList.add('hidden');
                console.log('👤 Admin logado com sucesso');
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Email ou senha incorretos.';
                    errorDiv.classList.remove('hidden');
                }
                if (loadingDiv) loadingDiv.classList.add('hidden');
            }
        }, 1000);
    }

    showAdminPanel() {
        const loginDiv = document.getElementById('adminLogin');
        const panelDiv = document.getElementById('adminPanel');
        
        if (loginDiv) loginDiv.classList.add('hidden');
        if (panelDiv) panelDiv.classList.remove('hidden');
        
        this.switchAdminTab('status');
        this.updateAdminStatusUI();
    }

    showAdminLogin() {
        const loginDiv = document.getElementById('adminLogin');
        const panelDiv = document.getElementById('adminPanel');
        
        if (loginDiv) loginDiv.classList.remove('hidden');
        if (panelDiv) panelDiv.classList.add('hidden');
        
        this.currentUser = null;
        
        // Clear error messages
        const errorDiv = document.getElementById('adminError');
        const loadingDiv = document.getElementById('adminLoading');
        if (errorDiv) errorDiv.classList.add('hidden');
        if (loadingDiv) loadingDiv.classList.add('hidden');
    }

    logoutAdmin() {
        this.showAdminLogin();
        console.log('👤 Admin deslogado');
    }

    switchAdminTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            }
        });

        // Show tab content
        document.querySelectorAll('.admin-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Load tab-specific data
        if (tab === 'products') {
            this.loadAdminProducts();
        } else if (tab === 'categories') {
            this.loadAdminCategories();
        }
    }

    async togglePizzariaStatus(isOpen) {
        try {
            if (this.firebaseInitialized) {
                await this.db.doc('settings/pizzariaStatus').set({
                    online: isOpen,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                // Fallback for when Firebase is not available
                this.isOnline = isOpen;
                this.updateStatusUI();
            }
            console.log(`📊 Status alterado para: ${isOpen ? 'Aberto' : 'Fechado'}`);
        } catch (error) {
            console.error('❌ Erro ao alterar status:', error);
            this.showError('Erro ao alterar status da pizzaria.');
        }
    }

    updateStatusUI() {
        const statusText = document.getElementById('statusText');
        const statusBanner = document.getElementById('statusBanner');

        if (statusText) {
            statusText.textContent = this.isOnline ? 'Aberto' : 'Fechado';
            statusText.style.color = this.isOnline ? 'var(--brand-green-500)' : 'var(--color-error)';
        }

        if (statusBanner) {
            statusBanner.classList.toggle('hidden', this.isOnline);
        }

        this.updateAdminStatusUI();

        // Update add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.disabled = !this.isOnline;
            if (!this.isOnline) {
                btn.innerHTML = '<i class="fas fa-clock"></i> Fechado';
            } else {
                btn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
            }
        });

        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = !this.isOnline;
            if (!this.isOnline) {
                checkoutBtn.innerHTML = '<i class="fas fa-clock"></i> Fechado';
            } else {
                checkoutBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Finalizar Pedido';
            }
        }
    }

    updateAdminStatusUI() {
        const statusCheckbox = document.getElementById('pizzariaStatus');
        if (statusCheckbox && this.currentUser) {
            statusCheckbox.checked = this.isOnline;
        }
    }

    showProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        
        if (!modal) return;

        this.editingProductId = productId;
        
        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                if (title) title.textContent = 'Editar Produto';
                this.fillProductForm(product);
            }
        } else {
            if (title) title.textContent = 'Novo Produto';
            this.clearProductForm();
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.editingProductId = null;
        }
    }

    fillProductForm(product) {
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productCategory').value = product.categoryId || '';
        document.getElementById('productImage').value = product.imageUrl || '';
        
        // Fill prices
        const prices = product.prices || {};
        document.getElementById('priceP').value = prices.P || '';
        document.getElementById('priceM').value = prices.M || '';
        document.getElementById('priceG').value = prices.G || '';
        document.getElementById('priceU').value = prices.Única || '';
    }

    clearProductForm() {
        const form = document.getElementById('productForm');
        if (form) form.reset();
    }

    async saveProduct() {
        if (!this.firebaseInitialized) {
            this.showError('Firebase não está disponível. Não é possível salvar o produto.');
            return;
        }

        const data = {
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            categoryId: document.getElementById('productCategory').value,
            imageUrl: document.getElementById('productImage').value.trim(),
            prices: {},
            active: true
        };

        // Collect prices
        const priceP = document.getElementById('priceP').value;
        const priceM = document.getElementById('priceM').value;
        const priceG = document.getElementById('priceG').value;
        const priceU = document.getElementById('priceU').value;

        if (priceP) data.prices.P = parseFloat(priceP);
        if (priceM) data.prices.M = parseFloat(priceM);
        if (priceG) data.prices.G = parseFloat(priceG);
        if (priceU) data.prices.Única = parseFloat(priceU);

        // Validation
        if (!data.name || !data.description || !data.categoryId) {
            this.showError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (Object.keys(data.prices).length === 0) {
            this.showError('Por favor, informe pelo menos um preço.');
            return;
        }

        try {
            if (this.editingProductId) {
                await this.db.collection('menu_items').doc(this.editingProductId).update({
                    ...data,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Produto atualizado');
            } else {
                await this.db.collection('menu_items').add({
                    ...data,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Produto criado');
            }

            this.closeProductModal();
            this.showSuccess('Produto salvo com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar produto:', error);
            this.showError('Erro ao salvar produto.');
        }
    }

    async deleteProduct(productId) {
        if (!this.firebaseInitialized) {
            this.showError('Firebase não está disponível. Não é possível excluir o produto.');
            return;
        }

        if (!confirm('Tem certeza que deseja excluir este produto?')) {
            return;
        }

        try {
            await this.db.collection('menu_items').doc(productId).update({
                active: false,
                deletedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Produto excluído');
            this.showSuccess('Produto excluído com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao excluir produto:', error);
            this.showError('Erro ao excluir produto.');
        }
    }

    loadAdminProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;

        const allProducts = [...this.products];
        
        container.innerHTML = allProducts.map(product => {
            const category = this.categories.find(c => c.id === product.categoryId);
            const categoryName = category ? category.name : 'Categoria não encontrada';
            
            const priceText = Object.entries(product.prices || {})
                .map(([size, price]) => `${size}: ${this.formatPrice(price)}`)
                .join(', ');

            return `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h5>${product.name}</h5>
                        <p><strong>Categoria:</strong> ${categoryName}</p>
                        <p><strong>Preços:</strong> ${priceText}</p>
                        ${product.imageUrl ? `<p><strong>Imagem:</strong> ${product.imageUrl}</p>` : ''}
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn--small btn-edit" onclick="app.showProductModal('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--small btn-delete" onclick="app.deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAdminCategories() {
        const container = document.getElementById('categoriesList');
        if (!container) return;

        container.innerHTML = this.categories.map(category => {
            const productCount = this.products.filter(p => p.categoryId === category.id).length;
            
            return `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h5>${category.name}</h5>
                        <p><strong>ID:</strong> ${category.id}</p>
                        <p><strong>Produtos:</strong> ${productCount}</p>
                        <p><strong>Ordem:</strong> ${category.order || 'Não definida'}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn--small btn-edit" onclick="app.showInfo('Edição de categorias será implementada em breve')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Data Management
     */
    async seedInitialData() {
        if (!this.firebaseInitialized) return;

        try {
            // Check if we have categories
            const categoriesSnapshot = await this.db.collection('menu_categories').limit(1).get();
            
            if (categoriesSnapshot.empty) {
                console.log('🌱 Criando dados iniciais no Firebase...');
                
                // Create categories
                for (const category of this.sampleCategories) {
                    await this.db.collection('menu_categories').doc(category.id).set(category);
                }

                // Create sample products
                for (const product of this.sampleProducts) {
                    await this.db.collection('menu_items').doc(product.id).set({
                        ...product,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                // Set initial pizzaria status
                await this.db.doc('settings/pizzariaStatus').set({
                    online: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                console.log('✅ Dados iniciais criados no Firebase!');
            }
        } catch (error) {
            console.error('❌ Erro ao criar dados iniciais:', error);
        }
    }

    /**
     * Storage Functions
     */
    saveCart() {
        localStorage.setItem('santa_sensacao_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('santa_sensacao_cart');
        if (saved) {
            try {
                this.cart = JSON.parse(saved);
                this.updateCartUI();
                console.log(`🛒 Carrinho carregado: ${this.cart.length} itens`);
            } catch (error) {
                console.error('❌ Erro ao carregar carrinho:', error);
                this.cart = [];
            }
        }
    }

    /**
     * Utility Functions
     */
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    showError(message) {
        console.error('❌', message);
        alert(message); // In production, use a proper toast notification
    }

    showSuccess(message) {
        console.log('✅', message);
        alert(message); // In production, use a proper toast notification
    }

    showInfo(message) {
        console.log('ℹ️', message);
        alert(message);
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new PizzariaSantaSensacao();
    window.app = app; // Make it globally accessible for onclick handlers
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && app) {
        // Refresh cart when page becomes visible again
        app.updateCartUI();
    }
});

/*
FIREBASE FIRESTORE RULES:
Copy and paste these rules in your Firebase Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow public read access to menu items and categories
    match /menu_categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /menu_items/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Allow public read access to pizzaria status
    match /settings/pizzariaStatus {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admin access control
    match /admins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Deny all other reads/writes
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

ASSET ORGANIZATION:
Place all product images in the assets/ folder with these naming conventions:

/assets/
  margherita.webp
  calabresa.webp
  portuguesa.webp
  quatro-queijos.webp
  frango-catupiry.webp
  chocolate-morango.webp
  banana-canela.webp
  romeu-julieta.webp
  coca-2l.webp
  guarana-2l.webp
  agua-500ml.webp
  pudim.webp
  brigadeiro.webp
  batata-frita.webp
  coxinha.webp

/logo.png

All product images should be in WebP format for better performance.
The logo should remain as PNG for maximum compatibility.

ADMIN USAGE:
1. Access /#admin or click admin button to open the admin panel
2. Login with: admin@santa.com / admin123
3. Use the Status tab to open/close the pizzaria
4. Use the Products tab to add/edit/delete products
5. Use the Categories tab to manage menu categories

All changes are synchronized in real-time across all connected clients when Firebase is available!

The app works both online (with Firebase sync) and offline (with sample data) for maximum reliability.
*/