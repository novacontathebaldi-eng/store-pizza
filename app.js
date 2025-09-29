// Santa Sensação Pizzaria App
class PizzariaApp {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyCTMHlUCGOpU7VRIdbP2VADzUF9n1lI88A",
            authDomain: "site-pizza-a2930.firebaseapp.com",
            projectId: "site-pizza-a2930",
            storageBucket: "site-pizza-a2930.firebasestorage.app",
            messagingSenderId: "914255031241",
            appId: "1:914255031241:web:84ae273b22cb7d04499618"
        };

        this.cart = [];
        this.categories = [];
        this.products = [];
        this.isOpen = true;
        this.currentUser = null;
        this.currentPage = 'home';
        this.currentCategory = null;
        this.isFirebaseReady = false;

        this.init();
    }

    async init() {
        try {
            console.log('Initializing Santa Sensação App...');
            
            // Load saved data first
            this.loadCart();
            this.loadPizzariaStatus();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize Firebase
            await this.initFirebase();

            // Setup navigation
            this.setupNavigation();

            // Load initial data
            await this.loadInitialData();

            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            // Load fallback data if Firebase fails
            this.loadFallbackData();
        } finally {
            // Hide loading screen
            this.hideLoadingScreen();
        }
    }

    async initFirebase() {
        try {
            console.log('Initializing Firebase...');
            
            // Initialize Firebase
            firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.firestore();
            this.auth = firebase.auth();

            console.log('Firebase initialized successfully');
            this.isFirebaseReady = true;

            // Create admin user if needed
            this.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    console.log('User signed in:', user.email);
                    this.currentUser = user;
                    if (this.currentPage === 'admin') {
                        this.showAdminPanel();
                    }
                } else {
                    this.currentUser = null;
                    if (this.currentPage === 'admin') {
                        this.hideAdminPanel();
                    }
                }
            });

        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.isFirebaseReady = false;
            throw error;
        }
    }

    async loadInitialData() {
        if (this.isFirebaseReady) {
            try {
                await this.initializeData();
                await this.loadMenu();
            } catch (error) {
                console.error('Error loading Firebase data, using fallback:', error);
                this.loadFallbackData();
            }
        } else {
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        console.log('Loading fallback data...');
        
        // Fallback categories
        this.categories = [
            { id: 'pizzas-salgadas', name: 'Pizzas Salgadas', icon: '🍕', order: 1, active: true },
            { id: 'pizzas-doces', name: 'Pizzas Doces', icon: '🍰', order: 2, active: true },
            { id: 'bebidas', name: 'Bebidas', icon: '🥤', order: 3, active: true },
            { id: 'sobremesas', name: 'Sobremesas', icon: '🍮', order: 4, active: true },
            { id: 'aperitivos', name: 'Aperitivos', icon: '🍟', order: 5, active: true }
        ];

        // Fallback products
        this.products = [
            {
                id: 'pizza-margherita',
                name: 'Pizza Margherita',
                description: 'Molho de tomate, mozzarella, manjericão fresco e azeite extra virgem',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=1',
                prices: { P: 35.00, M: 42.00, G: 48.00 },
                active: true,
                displayOrder: 1
            },
            {
                id: 'pizza-calabresa',
                name: 'Pizza Calabresa',
                description: 'Calabresa artesanal, cebola roxa, azeitonas verdes e orégano',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=2',
                prices: { P: 38.00, M: 45.00, G: 52.00 },
                active: true,
                displayOrder: 2
            },
            {
                id: 'pizza-portuguesa',
                name: 'Pizza Portuguesa',
                description: 'Presunto, ovos, ervilha, cebola, pimentão e azeitonas',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=3',
                prices: { P: 42.00, M: 50.00, G: 58.00 },
                active: true,
                displayOrder: 3
            },
            {
                id: 'pizza-4queijos',
                name: 'Pizza 4 Queijos',
                description: 'Mozzarella, catupiry, parmesão e provolone',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=4',
                prices: { P: 45.00, M: 52.00, G: 60.00 },
                active: true,
                displayOrder: 4
            },
            {
                id: 'pizza-frango',
                name: 'Pizza Frango c/ Catupiry',
                description: 'Frango desfiado temperado com catupiry original',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=5',
                prices: { P: 40.00, M: 48.00, G: 55.00 },
                active: true,
                displayOrder: 5
            },
            {
                id: 'pizza-pepperoni',
                name: 'Pizza Pepperoni',
                description: 'Pepperoni importado com queijo mozzarella especial',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=6',
                prices: { P: 46.00, M: 54.00, G: 62.00 },
                active: true,
                displayOrder: 6
            },
            {
                id: 'pizza-vegetariana',
                name: 'Pizza Vegetariana',
                description: 'Tomate, pimentão, cebola, azeitona, palmito e champignon',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=7',
                prices: { P: 39.00, M: 47.00, G: 54.00 },
                active: true,
                displayOrder: 7
            },
            {
                id: 'pizza-bacon',
                name: 'Pizza Bacon',
                description: 'Bacon crocante, cebola caramelizada e queijo mozzarella',
                categoryId: 'pizzas-salgadas',
                imageUrl: 'https://picsum.photos/400/300?random=8',
                prices: { P: 43.00, M: 51.00, G: 59.00 },
                active: true,
                displayOrder: 8
            },
            {
                id: 'pizza-chocolate',
                name: 'Pizza Chocolate',
                description: 'Chocolate ao leite derretido com granulado',
                categoryId: 'pizzas-doces',
                imageUrl: 'https://picsum.photos/400/300?random=9',
                prices: { P: 32.00, M: 38.00, G: 45.00 },
                active: true,
                displayOrder: 1
            },
            {
                id: 'pizza-banana',
                name: 'Pizza Banana c/ Canela',
                description: 'Banana fatiada, canela em pó e açúcar cristal',
                categoryId: 'pizzas-doces',
                imageUrl: 'https://picsum.photos/400/300?random=10',
                prices: { P: 30.00, M: 36.00, G: 42.00 },
                active: true,
                displayOrder: 2
            },
            {
                id: 'pizza-romeu',
                name: 'Pizza Romeu e Julieta',
                description: 'Queijo branco cremoso com goiabada caseira',
                categoryId: 'pizzas-doces',
                imageUrl: 'https://picsum.photos/400/300?random=11',
                prices: { P: 34.00, M: 40.00, G: 47.00 },
                active: true,
                displayOrder: 3
            },
            {
                id: 'coca-cola',
                name: 'Coca-Cola 2L',
                description: 'Refrigerante Coca-Cola 2 litros gelado',
                categoryId: 'bebidas',
                imageUrl: 'https://picsum.photos/400/300?random=12',
                prices: { 'Única': 8.00 },
                active: true,
                displayOrder: 1
            },
            {
                id: 'guarana',
                name: 'Guaraná Antarctica 2L',
                description: 'Refrigerante Guaraná Antarctica 2 litros gelado',
                categoryId: 'bebidas',
                imageUrl: 'https://picsum.photos/400/300?random=13',
                prices: { 'Única': 8.00 },
                active: true,
                displayOrder: 2
            },
            {
                id: 'suco-natural',
                name: 'Suco Natural',
                description: 'Suco natural de frutas da estação (500ml)',
                categoryId: 'bebidas',
                imageUrl: 'https://picsum.photos/400/300?random=14',
                prices: { 'Única': 6.00 },
                active: true,
                displayOrder: 3
            },
            {
                id: 'agua',
                name: 'Água Mineral',
                description: 'Água mineral sem gás 500ml',
                categoryId: 'bebidas',
                imageUrl: 'https://picsum.photos/400/300?random=15',
                prices: { 'Única': 3.00 },
                active: true,
                displayOrder: 4
            },
            {
                id: 'pudim',
                name: 'Pudim Caseiro',
                description: 'Pudim de leite condensado com calda de caramelo',
                categoryId: 'sobremesas',
                imageUrl: 'https://picsum.photos/400/300?random=16',
                prices: { 'Única': 12.00 },
                active: true,
                displayOrder: 1
            },
            {
                id: 'brigadeiro',
                name: 'Brigadeiro Gourmet',
                description: 'Brigadeiro cremoso com granulado belga (6 unidades)',
                categoryId: 'sobremesas',
                imageUrl: 'https://picsum.photos/400/300?random=17',
                prices: { 'Única': 15.00 },
                active: true,
                displayOrder: 2
            },
            {
                id: 'sorvete',
                name: 'Sorvete',
                description: 'Sorvete artesanal (2 bolas) - sabores variados',
                categoryId: 'sobremesas',
                imageUrl: 'https://picsum.photos/400/300?random=18',
                prices: { 'Única': 10.00 },
                active: true,
                displayOrder: 3
            },
            {
                id: 'batata-frita',
                name: 'Batata Frita',
                description: 'Porção de batata frita crocante (serve 2 pessoas)',
                categoryId: 'aperitivos',
                imageUrl: 'https://picsum.photos/400/300?random=19',
                prices: { 'Única': 18.00 },
                active: true,
                displayOrder: 1
            },
            {
                id: 'pao-alho',
                name: 'Pão de Alho',
                description: 'Pão de alho gratinado com queijo (8 fatias)',
                categoryId: 'aperitivos',
                imageUrl: 'https://picsum.photos/400/300?random=20',
                prices: { 'Única': 16.00 },
                active: true,
                displayOrder: 2
            },
            {
                id: 'coxinha',
                name: 'Coxinha da Casa',
                description: 'Coxinha especial recheada com frango e catupiry (6 unidades)',
                categoryId: 'aperitivos',
                imageUrl: 'https://picsum.photos/400/300?random=21',
                prices: { 'Única': 22.00 },
                active: true,
                displayOrder: 3
            }
        ];

        console.log('Fallback data loaded successfully');
        
        // Update UI if currently on menu page
        if (this.currentPage === 'menu') {
            this.renderMenuPage();
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }

    async initializeData() {
        if (!this.isFirebaseReady) return;
        
        try {
            // Check if we need to initialize categories and products
            const categoriesSnapshot = await this.db.collection('menu_categories').get();
            if (categoriesSnapshot.empty) {
                await this.createInitialData();
            }
        } catch (error) {
            console.error('Error initializing data:', error);
            throw error;
        }
    }

    async createInitialData() {
        if (!this.isFirebaseReady) return;
        
        console.log('Creating initial Firebase data...');
        
        try {
            // Create categories
            const categories = [
                { id: 'pizzas-salgadas', name: 'Pizzas Salgadas', icon: '🍕', order: 1, active: true },
                { id: 'pizzas-doces', name: 'Pizzas Doces', icon: '🍰', order: 2, active: true },
                { id: 'bebidas', name: 'Bebidas', icon: '🥤', order: 3, active: true },
                { id: 'sobremesas', name: 'Sobremesas', icon: '🍮', order: 4, active: true },
                { id: 'aperitivos', name: 'Aperitivos', icon: '🍟', order: 5, active: true }
            ];

            for (const category of categories) {
                await this.db.collection('menu_categories').doc(category.id).set({
                    ...category,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // Create products using the same data as fallback
            const products = this.products; // Use fallback products as initial data

            for (const product of products) {
                await this.db.collection('menu_items').add({
                    ...product,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            console.log('Initial Firebase data created successfully');
        } catch (error) {
            console.error('Error creating initial data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
                e.preventDefault();
                const element = e.target.matches('[data-page]') ? e.target : e.target.closest('[data-page]');
                const page = element.getAttribute('data-page');
                this.navigateTo(page);
            }
        });

        // Cart button - ensure it only opens cart
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCart();
            });
        }

        // Cart close button
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Cart overlay
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Finish order button
        const finishOrderBtn = document.getElementById('finish-order-btn');
        if (finishOrderBtn) {
            finishOrderBtn.addEventListener('click', () => {
                this.showOrderModal();
            });
        }

        // Order modal
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideOrderModal();
            });
        }

        const orderModal = document.getElementById('order-modal');
        if (orderModal) {
            orderModal.addEventListener('click', (e) => {
                if (e.target.id === 'order-modal') {
                    this.hideOrderModal();
                }
            });
        }

        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.finishOrder();
            });
        }

        const deliveryType = document.getElementById('delivery-type');
        if (deliveryType) {
            deliveryType.addEventListener('change', (e) => {
                const addressGroup = document.getElementById('address-group');
                if (e.target.value === 'delivery') {
                    addressGroup.classList.remove('hidden');
                    document.getElementById('customer-address').required = true;
                } else {
                    addressGroup.classList.add('hidden');
                    document.getElementById('customer-address').required = false;
                }
            });
        }

        // Admin login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adminLogin();
            });
        }

        const adminLogout = document.getElementById('admin-logout');
        if (adminLogout) {
            adminLogout.addEventListener('click', () => {
                this.adminLogout();
            });
        }

        // Admin tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.admin-tab-btn')) {
                const tab = e.target.getAttribute('data-tab');
                this.switchAdminTab(tab);
            }
        });

        // Pizzaria status
        const pizzariaStatus = document.getElementById('pizzaria-status');
        if (pizzariaStatus) {
            pizzariaStatus.addEventListener('change', (e) => {
                this.updatePizzariaStatus(e.target.checked);
            });
        }

        // Admin modals
        this.setupAdminModals();

        // Hash navigation
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCart();
                this.hideOrderModal();
                this.hideCategoryModal();
                this.hideProductModal();
            }
        });
    }

    setupAdminModals() {
        // Category modal
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.showCategoryModal();
            });
        }

        document.querySelectorAll('.category-modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideCategoryModal();
            });
        });

        const categoryForm = document.getElementById('category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCategoryForm();
            });
        }

        // Product modal
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showProductModal();
            });
        }

        document.querySelectorAll('.product-modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideProductModal();
            });
        });

        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProductForm();
            });
        }

        // Modal background clicks
        const categoryModal = document.getElementById('category-modal');
        if (categoryModal) {
            categoryModal.addEventListener('click', (e) => {
                if (e.target.id === 'category-modal') {
                    this.hideCategoryModal();
                }
            });
        }

        const productModal = document.getElementById('product-modal');
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target.id === 'product-modal') {
                    this.hideProductModal();
                }
            });
        }
    }

    setupNavigation() {
        this.handleHashChange();
    }

    handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            if (hash === 'admin') {
                this.navigateTo('admin');
            } else {
                this.navigateTo(hash);
            }
        } else {
            this.navigateTo('home');
        }
    }

    navigateTo(page) {
        console.log('Navigating to page:', page);
        
        // Close any open modals/sidebars first
        this.closeCart();
        this.hideOrderModal();
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Show page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;

            // Load menu if navigating to menu page
            if (page === 'menu') {
                setTimeout(() => {
                    this.renderMenuPage();
                }, 50);
            }
        }

        // Update hash without triggering hashchange
        if (window.location.hash !== `#${page}`) {
            history.pushState(null, '', `#${page}`);
        }
    }

    async loadMenu() {
        if (!this.isFirebaseReady) return;
        
        try {
            console.log('Loading menu from Firebase...');
            
            // Listen to categories
            this.db.collection('menu_categories')
                .orderBy('order')
                .where('active', '==', true)
                .onSnapshot((snapshot) => {
                    this.categories = [];
                    snapshot.forEach((doc) => {
                        this.categories.push({ id: doc.id, ...doc.data() });
                    });
                    console.log('Categories loaded:', this.categories.length);
                    if (this.currentPage === 'menu') {
                        this.renderMenuPage();
                    }
                });

            // Listen to products
            this.db.collection('menu_items')
                .where('active', '==', true)
                .orderBy('displayOrder')
                .onSnapshot((snapshot) => {
                    this.products = [];
                    snapshot.forEach((doc) => {
                        this.products.push({ id: doc.id, ...doc.data() });
                    });
                    console.log('Products loaded:', this.products.length);
                    if (this.currentPage === 'menu') {
                        this.renderMenuItems();
                    }
                });

        } catch (error) {
            console.error('Error loading menu:', error);
            // Use fallback data if Firebase fails
            this.loadFallbackData();
        }
    }

    renderMenuPage() {
        console.log('Rendering menu page...');
        console.log('Categories available:', this.categories.length);
        console.log('Products available:', this.products.length);
        
        this.renderCategoryTabs();
        this.renderMenuItems();
    }

    renderCategoryTabs() {
        const tabsContainer = document.getElementById('category-tabs');
        if (!tabsContainer) {
            console.error('Category tabs container not found');
            return;
        }

        if (this.categories.length === 0) {
            console.log('No categories available, rendering empty state');
            tabsContainer.innerHTML = '<p>Carregando categorias...</p>';
            return;
        }

        console.log('Rendering category tabs:', this.categories.length);

        tabsContainer.innerHTML = this.categories.map(category => `
            <button class="category-tab ${this.currentCategory === category.id ? 'active' : ''}" 
                    data-category="${category.id}" type="button">
                <span>${category.icon}</span>
                ${category.name}
            </button>
        `).join('');

        // Set first category as active if none selected
        if (!this.currentCategory && this.categories.length > 0) {
            this.currentCategory = this.categories[0].id;
            console.log('Set current category to:', this.currentCategory);
        }

        // Add event listeners
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.category-tab')) {
                const categoryId = e.target.closest('.category-tab').getAttribute('data-category');
                console.log('Category clicked:', categoryId);
                this.selectCategory(categoryId);
            }
        });
    }

    selectCategory(categoryId) {
        console.log('Selecting category:', categoryId);
        this.currentCategory = categoryId;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-category') === categoryId) {
                tab.classList.add('active');
            }
        });

        this.renderMenuItems();
    }

    renderMenuItems() {
        const contentContainer = document.getElementById('menu-content');
        if (!contentContainer) {
            console.error('Menu content container not found');
            return;
        }

        if (!this.currentCategory) {
            console.log('No current category selected');
            if (this.categories.length > 0) {
                this.currentCategory = this.categories[0].id;
            } else {
                contentContainer.innerHTML = '<p>Carregando cardápio...</p>';
                return;
            }
        }

        const categoryProducts = this.products.filter(product => 
            product.categoryId === this.currentCategory
        );

        console.log(`Rendering ${categoryProducts.length} products for category ${this.currentCategory}`);

        if (categoryProducts.length === 0) {
            contentContainer.innerHTML = `
                <div class="menu-section active">
                    <div class="empty-category" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                        <p>Nenhum produto disponível nesta categoria no momento.</p>
                    </div>
                </div>
            `;
            return;
        }

        contentContainer.innerHTML = `
            <div class="menu-section active">
                <div class="menu-grid">
                    ${categoryProducts.map(product => this.renderMenuItem(product)).join('')}
                </div>
            </div>
        `;

        this.setupMenuItemEvents();
    }

    renderMenuItem(product) {
        const priceEntries = Object.entries(product.prices);
        const hasMultipleSizes = priceEntries.length > 1;

        return `
            <div class="menu-item" data-product-id="${product.id}">
                <div class="menu-item-image">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        `<span style="font-size: 3rem;">${this.categories.find(c => c.id === product.categoryId)?.icon || '🍕'}</span>`
                    }
                </div>
                <div class="menu-item-content">
                    <h3 class="menu-item-name">${product.name}</h3>
                    <p class="menu-item-description">${product.description}</p>
                    
                    ${hasMultipleSizes ? `
                        <div class="size-selector" data-product-id="${product.id}">
                            ${priceEntries.map(([size, price]) => `
                                <button class="size-option ${priceEntries[0][0] === size ? 'active' : ''}" 
                                        data-size="${size}" data-price="${price}" type="button">
                                    ${size} - ${this.formatPrice(price)}
                                </button>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="menu-item-prices">
                            <div class="price-option">
                                <span class="price-size">${priceEntries[0][0]}</span>
                                <span class="price-value">${this.formatPrice(priceEntries[0][1])}</span>
                            </div>
                        </div>
                    `}
                    
                    <div class="menu-item-actions">
                        <button class="add-to-cart-btn" data-product-id="${product.id}" 
                                ${!this.isOpen ? 'disabled' : ''} type="button">
                            <i class="fas fa-plus"></i>
                            Adicionar
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
                e.preventDefault();
                const productId = e.target.closest('.size-selector').getAttribute('data-product-id');
                const sizeOptions = document.querySelectorAll(`.size-selector[data-product-id="${productId}"] .size-option`);
                
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Add to cart
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.isOpen) return;
                
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const sizeSelector = document.querySelector(`.size-selector[data-product-id="${productId}"]`);
        let selectedSize, selectedPrice;

        if (sizeSelector) {
            const activeSize = sizeSelector.querySelector('.size-option.active');
            if (activeSize) {
                selectedSize = activeSize.getAttribute('data-size');
                selectedPrice = parseFloat(activeSize.getAttribute('data-price'));
            }
        } else {
            const priceEntries = Object.entries(product.prices);
            selectedSize = priceEntries[0][0];
            selectedPrice = priceEntries[0][1];
        }

        if (!selectedSize || !selectedPrice) return;

        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(item => 
            item.productId === productId && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
            this.cart[existingItemIndex].quantity += 1;
        } else {
            this.cart.push({
                productId,
                name: product.name,
                size: selectedSize,
                price: selectedPrice,
                quantity: 1,
                imageUrl: product.imageUrl
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showCartAdded();
    }

    showCartAdded() {
        // Simple feedback - could be enhanced with a toast notification
        const cartBtn = document.getElementById('cart-btn');
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }

    updateCartUI() {
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartTotal();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('hidden', totalItems === 0);
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartFooter = document.getElementById('cart-footer');

        if (!cartItemsContainer || !cartEmpty || !cartFooter) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartEmpty.classList.remove('hidden');
            cartFooter.style.display = 'none';
            return;
        }

        cartEmpty.classList.add('hidden');
        cartFooter.style.display = 'block';

        cartItemsContainer.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.imageUrl ? 
                        `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        `<span>🍕</span>`
                    }
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-size">${item.size}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="app.updateQuantity(${index}, -1)" type="button">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${index}, 1)" type="button">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item-btn" onclick="app.removeFromCart(${index})" type="button">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update finish button
        const finishBtn = document.getElementById('finish-order-btn');
        if (finishBtn) {
            finishBtn.disabled = !this.isOpen;
            if (!this.isOpen) {
                finishBtn.innerHTML = '<i class="fas fa-clock"></i> Fechado';
            } else {
                finishBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Finalizar Pedido';
            }
        }
    }

    updateQuantity(index, change) {
        if (index < 0 || index >= this.cart.length) return;

        this.cart[index].quantity += change;

        if (this.cart[index].quantity <= 0) {
            this.cart.splice(index, 1);
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeFromCart(index) {
        if (index < 0 || index >= this.cart.length) return;

        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    }

    updateCartTotal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(total);
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('open');
            
            if (cartSidebar.classList.contains('open')) {
                // Ensure cart items are rendered when opening
                this.updateCartUI();
            }
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
    }

    showOrderModal() {
        if (!this.isOpen) {
            alert('Desculpe, estamos fechados no momento.');
            return;
        }

        if (this.cart.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }

        const modal = document.getElementById('order-modal');
        if (modal) {
            this.renderOrderSummary();
            modal.classList.remove('hidden');

            // Clear form
            const orderForm = document.getElementById('order-form');
            if (orderForm) {
                orderForm.reset();
            }
            const addressGroup = document.getElementById('address-group');
            if (addressGroup) {
                addressGroup.classList.add('hidden');
            }
        }
    }

    hideOrderModal() {
        const modal = document.getElementById('order-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    renderOrderSummary() {
        const container = document.getElementById('modal-cart-items');
        const totalContainer = document.getElementById('modal-total');

        if (container) {
            container.innerHTML = this.cart.map(item => `
                <div class="modal-cart-item">
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

    finishOrder() {
        const customerName = document.getElementById('customer-name').value.trim();
        const deliveryType = document.getElementById('delivery-type').value;
        const customerAddress = document.getElementById('customer-address').value.trim();

        if (!customerName || !deliveryType) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (deliveryType === 'delivery' && !customerAddress) {
            alert('Por favor, informe o endereço para entrega.');
            return;
        }

        // Generate WhatsApp message
        const message = this.generateWhatsAppMessage(customerName, deliveryType, customerAddress);
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/5527996500341?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Close modal and clear cart
        this.hideOrderModal();
        this.clearCart();
        this.closeCart();
        
        // Show success message
        alert('Pedido enviado! Você será redirecionado para o WhatsApp.');
    }

    generateWhatsAppMessage(name, deliveryType, address) {
        let message = 'Olá, Santa Sensação! Gostaria de fazer o seguinte pedido:\n\n';
        message += '*MEU PEDIDO:*\n';

        this.cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name}`;
            if (item.size !== 'Única') {
                message += ` (${item.size})`;
            }
            message += '\n';
        });

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\n*Total: ${this.formatPrice(total)}*\n\n`;

        message += `*NOME:* ${name}\n`;

        switch (deliveryType) {
            case 'delivery':
                message += `*ENDEREÇO DE ENTREGA:* ${address}`;
                break;
            case 'pickup':
                message += '*RETIRADA NA LOJA*';
                break;
            case 'local':
                message += '*CONSUMIR NO LOCAL*';
                break;
        }

        return message;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('santasensacao_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('santasensacao_cart');
        if (saved) {
            try {
                this.cart = JSON.parse(saved);
                this.updateCartUI();
            } catch (error) {
                console.error('Error loading cart:', error);
                this.cart = [];
            }
        }
    }

    loadPizzariaStatus() {
        const saved = localStorage.getItem('santasensacao_status');
        if (saved) {
            this.isOpen = JSON.parse(saved);
        }
        this.updateStatusUI();
    }

    updatePizzariaStatus(isOpen) {
        this.isOpen = isOpen;
        localStorage.setItem('santasensacao_status', JSON.stringify(isOpen));
        this.updateStatusUI();
    }

    updateStatusUI() {
        const banner = document.getElementById('status-banner');
        const statusText = document.getElementById('status-text');
        const statusCheckbox = document.getElementById('pizzaria-status');

        if (statusCheckbox) {
            statusCheckbox.checked = this.isOpen;
        }

        if (statusText) {
            statusText.textContent = this.isOpen ? 'Aberto' : 'Fechado';
            statusText.style.color = this.isOpen ? 'var(--color-success)' : 'var(--color-error)';
        }

        if (banner) {
            banner.classList.toggle('hidden', this.isOpen);
        }

        // Update menu buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.disabled = !this.isOpen;
        });

        // Update cart finish button
        const finishBtn = document.getElementById('finish-order-btn');
        if (finishBtn) {
            finishBtn.disabled = !this.isOpen;
            if (!this.isOpen) {
                finishBtn.innerHTML = '<i class="fas fa-clock"></i> Fechado';
            } else {
                finishBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Finalizar Pedido';
            }
        }
    }

    // Admin functions
    async adminLogin() {
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');

        // Create admin user first if Firebase is available
        if (this.isFirebaseReady) {
            try {
                // First try to create the user
                try {
                    await this.auth.createUserWithEmailAndPassword(email, password);
                    console.log('Admin user created');
                } catch (createError) {
                    // User might already exist, try to sign in
                    if (createError.code !== 'auth/email-already-in-use') {
                        throw createError;
                    }
                }

                // Now sign in
                await this.auth.signInWithEmailAndPassword(email, password);
                
                // Create admin document
                const user = this.auth.currentUser;
                if (user) {
                    await this.db.collection('admins').doc(user.uid).set({
                        email: user.email,
                        isAdmin: true,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }

                this.currentUser = user;
                this.showAdminPanel();
                if (errorDiv) errorDiv.classList.add('hidden');
            } catch (error) {
                console.error('Login error:', error);
                if (errorDiv) {
                    errorDiv.textContent = 'Erro no login: ' + error.message;
                    errorDiv.classList.remove('hidden');
                }
            }
        } else {
            // Fallback admin login
            if (email === 'admin@santa.com' && password === 'admin123') {
                this.currentUser = { email: email, uid: 'admin' };
                this.showAdminPanel();
                if (errorDiv) errorDiv.classList.add('hidden');
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Email ou senha incorretos.';
                    errorDiv.classList.remove('hidden');
                }
            }
        }
    }

    adminLogout() {
        if (this.auth) {
            this.auth.signOut();
        }
        this.currentUser = null;
        this.hideAdminPanel();
    }

    showAdminPanel() {
        const adminLogin = document.getElementById('admin-login');
        const adminPanel = document.getElementById('admin-panel');
        
        if (adminLogin) adminLogin.classList.add('hidden');
        if (adminPanel) adminPanel.classList.remove('hidden');
        
        this.loadAdminData();
    }

    hideAdminPanel() {
        const adminLogin = document.getElementById('admin-login');
        const adminPanel = document.getElementById('admin-panel');
        
        if (adminLogin) adminLogin.classList.remove('hidden');
        if (adminPanel) adminPanel.classList.add('hidden');
    }

    switchAdminTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('active');
            }
        });

        // Show tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`admin-${tab}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Load specific data
        if (tab === 'categories') {
            this.loadAdminCategories();
        } else if (tab === 'products') {
            this.loadAdminProducts();
        }
    }

    async loadAdminData() {
        this.switchAdminTab('status');
    }

    async loadAdminCategories() {
        try {
            const categoriesContainer = document.getElementById('categories-list');
            if (!categoriesContainer) return;

            categoriesContainer.innerHTML = this.categories.map(category => `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h4>${category.icon} ${category.name}</h4>
                        <p>Ordem: ${category.order} | Status: ${category.active ? 'Ativo' : 'Inativo'}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn--sm btn-edit" onclick="app.editCategory('${category.id}')" type="button">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--sm btn-delete" onclick="app.deleteCategory('${category.id}')" type="button">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading admin categories:', error);
        }
    }

    async loadAdminProducts() {
        try {
            const productsContainer = document.getElementById('products-list');
            if (!productsContainer) return;

            productsContainer.innerHTML = this.products.map(product => {
                const category = this.categories.find(c => c.id === product.categoryId);
                const priceText = Object.entries(product.prices).map(([size, price]) => 
                    `${size}: ${this.formatPrice(price)}`
                ).join(', ');

                return `
                    <div class="admin-item">
                        <div class="admin-item-info">
                            <h4>${product.name}</h4>
                            <p>Categoria: ${category?.name || 'N/A'} | Preços: ${priceText}</p>
                            <p>Status: ${product.active ? 'Ativo' : 'Inativo'}</p>
                        </div>
                        <div class="admin-item-actions">
                            <button class="btn btn--sm btn-edit" onclick="app.editProduct('${product.id}')" type="button">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn--sm btn-delete" onclick="app.deleteProduct('${product.id}')" type="button">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading admin products:', error);
        }
    }

    showCategoryModal(categoryId = null) {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        const form = document.getElementById('category-form');

        if (!modal || !title || !form) return;

        if (categoryId) {
            title.textContent = 'Editar Categoria';
            this.loadCategoryForm(categoryId);
        } else {
            title.textContent = 'Nova Categoria';
            form.reset();
        }

        form.setAttribute('data-category-id', categoryId || '');
        modal.classList.remove('hidden');
    }

    hideCategoryModal() {
        const modal = document.getElementById('category-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async loadCategoryForm(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            const nameInput = document.getElementById('category-name');
            const iconInput = document.getElementById('category-icon');
            const orderInput = document.getElementById('category-order');
            
            if (nameInput) nameInput.value = category.name;
            if (iconInput) iconInput.value = category.icon;
            if (orderInput) orderInput.value = category.order;
        }
    }

    async saveCategoryForm() {
        const form = document.getElementById('category-form');
        if (!form) return;
        
        const categoryId = form.getAttribute('data-category-id');
        
        const data = {
            name: document.getElementById('category-name').value,
            icon: document.getElementById('category-icon').value,
            order: parseInt(document.getElementById('category-order').value) || 1,
            active: true
        };

        if (categoryId) {
            // Update existing category
            const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
            if (categoryIndex !== -1) {
                this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...data };
            }
        } else {
            // Add new category
            const newId = 'cat-' + Date.now();
            this.categories.push({ id: newId, ...data });
        }

        this.hideCategoryModal();
        this.loadAdminCategories();
        alert('Categoria salva com sucesso!');
        
        // Update menu if on menu page
        if (this.currentPage === 'menu') {
            this.renderMenuPage();
        }
    }

    async editCategory(categoryId) {
        this.showCategoryModal(categoryId);
    }

    async deleteCategory(categoryId) {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.loadAdminCategories();
            alert('Categoria excluída com sucesso!');
            
            // Update menu if on menu page
            if (this.currentPage === 'menu') {
                this.renderMenuPage();
            }
        }
    }

    showProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        if (!modal || !title || !form) return;

        // Load categories for select
        this.loadProductCategoryOptions();

        if (productId) {
            title.textContent = 'Editar Produto';
            this.loadProductForm(productId);
        } else {
            title.textContent = 'Novo Produto';
            form.reset();
        }

        form.setAttribute('data-product-id', productId || '');
        modal.classList.remove('hidden');
    }

    hideProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    loadProductCategoryOptions() {
        const select = document.getElementById('product-category');
        if (select) {
            select.innerHTML = '<option value="">Selecione...</option>' +
                this.categories.map(category => 
                    `<option value="${category.id}">${category.name}</option>`
                ).join('');
        }
    }

    async loadProductForm(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const nameInput = document.getElementById('product-name');
            const descInput = document.getElementById('product-description');
            const categoryInput = document.getElementById('product-category');
            const imageInput = document.getElementById('product-image');
            
            if (nameInput) nameInput.value = product.name;
            if (descInput) descInput.value = product.description;
            if (categoryInput) categoryInput.value = product.categoryId;
            if (imageInput) imageInput.value = product.imageUrl || '';
            
            const pricePInput = document.getElementById('price-p');
            const priceMInput = document.getElementById('price-m');
            const priceGInput = document.getElementById('price-g');
            const priceUInput = document.getElementById('price-u');
            
            if (pricePInput) pricePInput.value = product.prices.P || '';
            if (priceMInput) priceMInput.value = product.prices.M || '';
            if (priceGInput) priceGInput.value = product.prices.G || '';
            if (priceUInput) priceUInput.value = product.prices['Única'] || '';
        }
    }

    async saveProductForm() {
        const form = document.getElementById('product-form');
        if (!form) return;
        
        const productId = form.getAttribute('data-product-id');
        
        const prices = {};
        const priceP = parseFloat(document.getElementById('price-p').value);
        const priceM = parseFloat(document.getElementById('price-m').value);
        const priceG = parseFloat(document.getElementById('price-g').value);
        const priceU = parseFloat(document.getElementById('price-u').value);

        if (priceP > 0) prices.P = priceP;
        if (priceM > 0) prices.M = priceM;
        if (priceG > 0) prices.G = priceG;
        if (priceU > 0) prices['Única'] = priceU;

        if (Object.keys(prices).length === 0) {
            alert('Por favor, informe pelo menos um preço.');
            return;
        }

        const data = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            categoryId: document.getElementById('product-category').value,
            imageUrl: document.getElementById('product-image').value || '',
            prices: prices,
            active: true,
            displayOrder: Date.now()
        };

        if (productId) {
            // Update existing product
            const productIndex = this.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                this.products[productIndex] = { ...this.products[productIndex], ...data };
            }
        } else {
            // Add new product
            const newId = 'prod-' + Date.now();
            this.products.push({ id: newId, ...data });
        }

        this.hideProductModal();
        this.loadAdminProducts();
        alert('Produto salvo com sucesso!');
        
        // Update menu if on menu page
        if (this.currentPage === 'menu') {
            this.renderMenuItems();
        }
    }

    async editProduct(productId) {
        this.showProductModal(productId);
    }

    async deleteProduct(productId) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.loadAdminProducts();
            alert('Produto excluído com sucesso!');
            
            // Update menu if on menu page
            if (this.currentPage === 'menu') {
                this.renderMenuItems();
            }
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PizzariaApp();
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}