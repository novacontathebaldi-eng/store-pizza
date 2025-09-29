// Pizzaria Santa Sensação - Complete Application
class PizzariaApp {
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

        // App state
        this.cart = [];
        this.isOnline = true;
        this.currentUser = null;
        this.currentCategory = 'pizzas-salgadas';
        
        // Data
        this.produtos = {
            "pizzas_salgadas": [
                {
                    "id": "margherita",
                    "nome": "Pizza Margherita",
                    "descricao": "Molho de tomate, mozzarella de búfala, manjericão fresco e azeite extravirgem",
                    "precos": {"P": 32.00, "M": 42.00, "G": 48.00},
                    "badge": "Vegetariana",
                    "popular": true
                },
                {
                    "id": "calabresa",
                    "nome": "Calabresa Especial",
                    "descricao": "Molho de tomate, calabresa artesanal, cebola roxa, azeitonas pretas e orégano",
                    "precos": {"P": 35.00, "M": 45.00, "G": 52.00},
                    "badge": "Popular"
                },
                {
                    "id": "portuguesa",
                    "nome": "Portuguesa Premium",
                    "descricao": "Presunto parma, ovos caipira, ervilhas e azeitonas portuguesas",
                    "precos": {"P": 42.00, "M": 52.00, "G": 58.00},
                    "badge": "Premium"
                },
                {
                    "id": "quatro-queijos",
                    "nome": "4 Queijos Gourmet",
                    "descricao": "Mozzarella, gorgonzola, parmesão reggiano e catupiry premium",
                    "precos": {"P": 45.00, "M": 55.00, "G": 62.00},
                    "badge": "Gourmet"
                },
                {
                    "id": "napolitana",
                    "nome": "Napolitana",
                    "descricao": "Molho de tomate, mozzarella, tomate fresco, manjericão e orégano",
                    "precos": {"P": 38.00, "M": 48.00, "G": 55.00}
                },
                {
                    "id": "frango-catupiry",
                    "nome": "Frango c/ Catupiry",
                    "descricao": "Frango desfiado, catupiry, milho, azeitonas e orégano",
                    "precos": {"P": 40.00, "M": 50.00, "G": 57.00}
                }
            ],
            "pizzas_doces": [
                {
                    "id": "chocolate-morango",
                    "nome": "Chocolate com Morango",
                    "descricao": "Massa doce, nutella, morangos frescos, banana e açúcar de confeiteiro",
                    "precos": {"P": 28.00, "M": 35.00, "G": 42.00},
                    "badge": "Popular"
                },
                {
                    "id": "banana-canela",
                    "nome": "Banana c/ Canela",
                    "descricao": "Massa doce, banana, canela, açúcar cristal e leite condensado",
                    "precos": {"P": 25.00, "M": 32.00, "G": 38.00}
                },
                {
                    "id": "romeu-julieta",
                    "nome": "Romeu e Julieta",
                    "descricao": "Queijo, goiabada, massa doce e açúcar de confeiteiro",
                    "precos": {"P": 30.00, "M": 37.00, "G": 44.00}
                }
            ],
            "bebidas": [
                {
                    "id": "coca-2l",
                    "nome": "Coca-Cola 2L",
                    "descricao": "Refrigerante Coca-Cola 2 litros gelado",
                    "precos": {"Única": 8.00}
                },
                {
                    "id": "guarana-2l",
                    "nome": "Guaraná Antarctica 2L",
                    "descricao": "Refrigerante Guaraná Antarctica 2 litros gelado",
                    "precos": {"Única": 8.00}
                },
                {
                    "id": "suco-natural",
                    "nome": "Suco Natural 500ml",
                    "descricao": "Suco natural de frutas da estação",
                    "precos": {"Única": 6.00}
                },
                {
                    "id": "agua",
                    "nome": "Água 500ml",
                    "descricao": "Água mineral sem gás",
                    "precos": {"Única": 3.00}
                }
            ]
        };

        this.init();
    }

    async init() {
        try {
            console.log('Inicializando Santa Sensação...');
            
            // Initialize Firebase
            await this.initFirebase();
            
            // Load saved data
            this.loadCart();
            this.loadPizzariaStatus();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load featured items on homepage
            this.loadFeaturedItems();
            
            console.log('Aplicação inicializada com sucesso!');
            
        } catch (error) {
            console.error('Erro ao inicializar:', error);
        }
    }

    async initFirebase() {
        try {
            // Initialize Firebase
            firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.firestore();
            
            console.log('Firebase inicializado com sucesso');
            
        } catch (error) {
            console.error('Erro ao inicializar Firebase:', error);
        }
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                if (anchor.getAttribute('onclick')) return; // Skip if has onclick
                
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const nav = document.getElementById('mainNav');
                nav.classList.toggle('mobile-open');
            });
        }

        // Admin login form
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }

        // Finalization form
        const finalizationForm = document.getElementById('finalizationForm');
        if (finalizationForm) {
            finalizationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOrderFinalization();
            });
        }

        // Category tabs in menu modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-tab')) {
                this.switchCategory(e.target.dataset.category);
            }
        });

        // Admin tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.admin-tab')) {
                this.switchAdminTab(e.target.dataset.tab);
            }
        });
    }

    loadFeaturedItems() {
        const showcase = document.getElementById('menuShowcase');
        if (!showcase) return;

        // Get featured items (first 4 pizzas salgadas)
        const featuredItems = this.produtos.pizzas_salgadas.slice(0, 4);

        showcase.innerHTML = featuredItems.map(item => `
            <div class="menu-card" data-pizza="${item.id}">
                <div class="menu-card-image">
                    <div class="image-placeholder">
                        <i class="fas fa-pizza-slice"></i>
                    </div>
                    ${item.badge ? `<div class="menu-card-badge">${item.badge}</div>` : ''}
                </div>
                <div class="menu-card-content">
                    <h3 class="menu-card-title">${item.nome}</h3>
                    <p class="menu-card-description">${item.descricao}</p>
                    <div class="menu-card-footer">
                        <span class="menu-card-price">A partir de ${this.formatPrice(Math.min(...Object.values(item.precos)))}</span>
                        <button class="menu-card-button" onclick="app.openMenuModal('${item.id}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Modal Management
    openMenuModal(productId = null) {
        const modal = document.getElementById('menuModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        this.loadMenuItems();
        
        // If specific product, scroll to it after loading
        if (productId) {
            setTimeout(() => {
                const productElement = document.querySelector(`[data-product-id="${productId}"]`);
                if (productElement) {
                    productElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    closeMenuModal() {
        const modal = document.getElementById('menuModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openAdminModal() {
        const modal = document.getElementById('adminModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeAdminModal() {
        const modal = document.getElementById('adminModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset admin panel
        this.showAdminLogin();
    }

    showFinalizationModal() {
        if (this.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        if (!this.isOnline) {
            alert('Desculpe, estamos fechados no momento.');
            return;
        }

        const modal = document.getElementById('finalizationModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        this.updateOrderSummary();
    }

    closeFinalizationModal() {
        const modal = document.getElementById('finalizationModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Category Management
    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        this.loadMenuItems();
    }

    loadMenuItems() {
        const container = document.getElementById('menuItems');
        if (!container) return;

        const categoryKey = this.currentCategory.replace('-', '_');
        const items = this.produtos[categoryKey] || [];

        if (items.length === 0) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <p>Nenhum item encontrado nesta categoria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="menu-items-grid">
                ${items.map(item => this.renderMenuItem(item)).join('')}
            </div>
        `;

        this.setupMenuItemEvents();
    }

    renderMenuItem(item) {
        const sizes = Object.keys(item.precos);
        const hasMultipleSizes = sizes.length > 1;

        return `
            <div class="menu-item-modal" data-product-id="${item.id}">
                <h4 class="menu-item-name">${item.nome}</h4>
                <p class="menu-item-description">${item.descricao}</p>
                
                ${hasMultipleSizes ? `
                    <div class="size-selector">
                        ${sizes.map((size, index) => `
                            <button class="size-option ${index === 0 ? 'active' : ''}" 
                                    data-size="${size}" 
                                    data-price="${item.precos[size]}">
                                ${size} - ${this.formatPrice(item.precos[size])}
                            </button>
                        `).join('')}
                    </div>
                ` : `
                    <div class="single-price" data-size="${sizes[0]}" data-price="${item.precos[sizes[0]]}">
                        <strong>${this.formatPrice(item.precos[sizes[0]])}</strong>
                    </div>
                `}
                
                <button class="add-to-cart" data-product-id="${item.id}" ${!this.isOnline ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i>
                    ${!this.isOnline ? 'Fechado' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        `;
    }

    setupMenuItemEvents() {
        // Size selection
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const container = e.target.closest('.menu-item-modal');
                container.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Add to cart
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isOnline) return;
                
                const productId = e.target.dataset.productId;
                this.addToCart(productId);
            });
        });
    }

    // Cart Management
    addToCart(productId) {
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (!productElement) return;

        // Find the product data
        let product = null;
        let categoryKey = null;
        
        for (const [key, items] of Object.entries(this.produtos)) {
            const found = items.find(item => item.id === productId);
            if (found) {
                product = found;
                categoryKey = key;
                break;
            }
        }

        if (!product) return;

        // Get selected size and price
        let selectedSize, selectedPrice;
        const activeSize = productElement.querySelector('.size-option.active');
        
        if (activeSize) {
            selectedSize = activeSize.dataset.size;
            selectedPrice = parseFloat(activeSize.dataset.price);
        } else {
            const singlePrice = productElement.querySelector('.single-price');
            if (singlePrice) {
                selectedSize = singlePrice.dataset.size;
                selectedPrice = parseFloat(singlePrice.dataset.price);
            }
        }

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
                name: product.nome,
                size: selectedSize,
                price: selectedPrice,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        
        // Show feedback
        this.showAddToCartFeedback();
    }

    showAddToCartFeedback() {
        const cartBtn = document.getElementById('cartBtn');
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
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
            emptyCart.style.display = 'block';
            cartItems.style.display = 'none';
            cartFooter.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartItems.style.display = 'block';
            cartFooter.style.display = 'block';

            cartItems.innerHTML = this.cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="fas fa-pizza-slice"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-size">${item.size}</div>
                        <div class="cart-item-controls">
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
            `).join('');
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
        this.updateOrderSummary();
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
        sidebar.classList.toggle('hidden');
        
        if (!sidebar.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
            this.updateCartUI();
        } else {
            document.body.style.overflow = '';
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        sidebar.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // WhatsApp Integration
    sendToWhatsApp() {
        if (this.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const message = this.generateSimpleWhatsAppMessage();
        const whatsappUrl = `https://wa.me/5527996500341?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        alert('Redirecionando para o WhatsApp...');
    }

    generateSimpleWhatsAppMessage() {
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
        message += 'Por favor, me informe sobre entrega!';

        return message;
    }

    // Order Management
    updateOrderSummary() {
        const itemsContainer = document.getElementById('orderSummaryItems');
        const totalContainer = document.getElementById('orderSummaryTotal');

        if (itemsContainer) {
            itemsContainer.innerHTML = this.cart.map(item => `
                <div class="order-summary-item">
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

    handleOrderFinalization() {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        const notes = document.getElementById('orderNotes').value.trim();

        if (!name || !phone || !address) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Generate WhatsApp message
        const message = this.generateWhatsAppMessage(name, phone, address, notes);
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/5527996500341?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Clear cart and close modals
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.closeFinalizationModal();
        this.closeCart();

        alert('Pedido enviado! Você será redirecionado para o WhatsApp.');
    }

    generateWhatsAppMessage(name, phone, address, notes) {
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
        message += `*TELEFONE:* ${phone}\n`;
        message += `*ENDEREÇO DE ENTREGA:* ${address}`;

        if (notes) {
            message += `\n*OBSERVAÇÕES:* ${notes}`;
        }

        return message;
    }

    // Admin Functions
    handleAdminLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('adminError');
        const loadingDiv = document.getElementById('adminLoading');

        // Show loading
        loadingDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        // Simple validation for demo
        setTimeout(() => {
            if (email === 'admin@santa.com' && password === 'admin123') {
                this.currentUser = { email, role: 'admin' };
                this.showAdminPanel();
                loadingDiv.classList.add('hidden');
            } else {
                errorDiv.textContent = 'Email ou senha incorretos.';
                errorDiv.classList.remove('hidden');
                loadingDiv.classList.add('hidden');
            }
        }, 1000);
    }

    showAdminPanel() {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        this.switchAdminTab('status');
    }

    showAdminLogin() {
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
        this.currentUser = null;
        
        // Clear form
        const form = document.getElementById('adminLoginForm');
        if (form) {
            form.reset();
            // Set default values
            document.getElementById('adminEmail').value = 'admin@santa.com';
            document.getElementById('adminPassword').value = 'admin123';
        }
        
        // Hide error/loading messages
        document.getElementById('adminError').classList.add('hidden');
        document.getElementById('adminLoading').classList.add('hidden');
    }

    logoutAdmin() {
        this.showAdminLogin();
        this.closeAdminModal();
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

    togglePizzariaStatus(isOpen) {
        this.isOnline = isOpen;
        this.savePizzariaStatus();
        this.updateStatusUI();
    }

    updateStatusUI() {
        const statusText = document.getElementById('statusText');
        const statusBanner = document.getElementById('statusBanner');
        const statusCheckbox = document.getElementById('pizzariaStatus');

        if (statusText) {
            statusText.textContent = this.isOnline ? 'Aberto' : 'Fechado';
            statusText.style.color = this.isOnline ? '#25D366' : '#C0152F';
        }

        if (statusBanner) {
            statusBanner.classList.toggle('hidden', this.isOnline);
        }

        if (statusCheckbox) {
            statusCheckbox.checked = this.isOnline;
        }

        // Update cart finish button
        const finishBtn = document.getElementById('finishOrder');
        if (finishBtn) {
            finishBtn.disabled = !this.isOnline;
            if (!this.isOnline) {
                finishBtn.innerHTML = '<i class="fas fa-clock"></i> Fechado';
            } else {
                finishBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Finalizar no WhatsApp';
            }
        }

        // Update add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.disabled = !this.isOnline;
            if (!this.isOnline) {
                btn.innerHTML = '<i class="fas fa-clock"></i> Fechado';
            } else {
                btn.innerHTML = '<i class="fas fa-plus"></i> Adicionar ao Carrinho';
            }
        });
    }

    loadAdminProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;

        let allProducts = [];
        Object.entries(this.produtos).forEach(([category, products]) => {
            products.forEach(product => {
                allProducts.push({
                    ...product,
                    category: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                });
            });
        });

        container.innerHTML = allProducts.map(product => {
            const priceText = Object.entries(product.precos)
                .map(([size, price]) => `${size}: ${this.formatPrice(price)}`)
                .join(', ');

            return `
                <div class="admin-item">
                    <div class="admin-item-info">
                        <h5>${product.nome}</h5>
                        <p>Categoria: ${product.category}</p>
                        <p>Preços: ${priceText}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn--sm btn-edit" onclick="app.editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--sm btn-delete" onclick="app.deleteProduct('${product.id}')">
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

        const categories = [
            { id: 'pizzas-salgadas', name: 'Pizzas Salgadas', icon: '🍕', products: this.produtos.pizzas_salgadas.length },
            { id: 'pizzas-doces', name: 'Pizzas Doces', icon: '🍰', products: this.produtos.pizzas_doces.length },
            { id: 'bebidas', name: 'Bebidas', icon: '🥤', products: this.produtos.bebidas.length }
        ];

        container.innerHTML = categories.map(category => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h5>${category.icon} ${category.name}</h5>
                    <p>${category.products} produtos</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn--sm btn-edit" onclick="app.editCategory('${category.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Placeholder functions for admin actions
    showProductForm() {
        alert('Funcionalidade de adicionar produto será implementada em breve.');
    }

    showCategoryForm() {
        alert('Funcionalidade de adicionar categoria será implementada em breve.');
    }

    editProduct(productId) {
        alert(`Editar produto: ${productId}`);
    }

    deleteProduct(productId) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            alert(`Produto ${productId} excluído.`);
        }
    }

    editCategory(categoryId) {
        alert(`Editar categoria: ${categoryId}`);
    }

    // Utility Functions
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    // Storage Functions
    saveCart() {
        localStorage.setItem('santa_sensacao_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('santa_sensacao_cart');
        if (saved) {
            try {
                this.cart = JSON.parse(saved);
                this.updateCartUI();
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
                this.cart = [];
            }
        }
    }

    savePizzariaStatus() {
        localStorage.setItem('santa_sensacao_status', JSON.stringify(this.isOnline));
    }

    loadPizzariaStatus() {
        const saved = localStorage.getItem('santa_sensacao_status');
        if (saved !== null) {
            try {
                this.isOnline = JSON.parse(saved);
            } catch (error) {
                console.error('Erro ao carregar status:', error);
                this.isOnline = true;
            }
        }
        this.updateStatusUI();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PizzariaApp();
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.getElementById('cartBtn');
    
    if (cartSidebar && !cartSidebar.classList.contains('hidden')) {
        if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            window.app.closeCart();
        }
    }
});

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        // Close cart
        if (window.app) {
            window.app.closeCart();
        }
        
        document.body.style.overflow = '';
    }
});