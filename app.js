// Pizzaria Santa Sensação - App v2.0
class PizzariaApp {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyCTMHlUCGOpU7VRIdbP2VADzUF9n1lI88A",
            authDomain: "site-pizza-a2930.firebaseapp.com",
            projectId: "site-pizza-a2930",
            storageBucket: "site-pizza-a2930.appspot.com",
            messagingSenderId: "914255031241",
            appId: "1:914255031241:web:84ae273b22cb7d04499618"
        };

        // Estado da Aplicação
        this.isOpen = true;
        this.cart = [];
        this.currentUser = null;
        this.categories = [];
        this.products = [];
        this.currentCategory = null;
        this.currentEditingId = null; // Para saber se estamos editando ou criando

        this.init();
    }

    async init() {
        console.log("Iniciando Santa Sensação App v2.0...");
        this.initFirebase();
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.listenToData(); // Ouvir em tempo real categorias, produtos e status
    }

    // 1. SETUP E EVENTOS
    // =======================================

    initFirebase() {
        try {
            firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            console.log("Firebase inicializado com sucesso!");
        } catch (error) {
            console.error("Erro ao inicializar o Firebase:", error);
            alert("Não foi possível conectar ao servidor. O site pode não funcionar corretamente.");
        }
    }

    setupEventListeners() {
        // Navegação principal e rolagem suave
        document.querySelectorAll('.nav-link, .logo, .btn[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    document.getElementById('main-nav').classList.remove('open');
                    document.getElementById('mobile-toggle').classList.remove('open');
                }
            });
        });

        // Menu mobile (hamburger)
        const mobileToggle = document.getElementById('mobile-toggle');
        const mainNav = document.getElementById('main-nav');
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
        });

        // Carrinho
        document.getElementById('cart-btn').addEventListener('click', () => this.toggleCart(true));
        document.getElementById('cart-close').addEventListener('click', () => this.toggleCart(false));
        document.getElementById('cart-overlay').addEventListener('click', () => this.toggleCart(false));
        document.getElementById('finish-order-btn').addEventListener('click', () => this.showOrderModal());

        // Modal de Pedido
        document.querySelector('#order-modal .close-modal').addEventListener('click', () => this.toggleModal('order-modal', false));
        document.getElementById('order-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendWhatsAppOrder();
        });
        document.getElementById('payment-method').addEventListener('change', (e) => {
            document.getElementById('change-group').classList.toggle('hidden', e.target.value !== 'Dinheiro');
        });
        document.getElementById('delivery-type').addEventListener('change', (e) => {
            document.getElementById('address-group').classList.toggle('hidden', e.target.value !== 'delivery');
        });


        // Admin
        document.getElementById('login-form').addEventListener('submit', (e) => { e.preventDefault(); this.adminLogin(); });
        document.getElementById('admin-logout').addEventListener('click', () => this.adminLogout());
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchAdminTab(btn.dataset.tab));
        });
        document.getElementById('pizzaria-status').addEventListener('change', (e) => this.updatePizzariaStatus(e.target.checked));

        // Modais do Admin
        this.setupAdminModals();
    }
    
    // 2. CARREGAMENTO DE DADOS (REAL-TIME)
    // =======================================

    listenToData() {
        // Ocultar loading screen quando os dados essenciais carregarem
        const promises = [
            this.listenToCategories(),
            this.listenToProducts(),
            this.listenToPizzariaStatus()
        ];
        Promise.all(promises).then(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => document.getElementById('loading-screen').classList.add('hidden'), 500);
        }).catch(err => {
            console.error("Erro ao carregar dados iniciais:", err);
            // Mesmo com erro, esconde o loading para não travar o usuário
             document.getElementById('loading-screen').style.opacity = '0';
             setTimeout(() => document.getElementById('loading-screen').classList.add('hidden'), 500);
        });
    }

    listenToCategories() {
        return new Promise((resolve) => {
            this.db.collection('menu_categories').orderBy('order').onSnapshot(snapshot => {
                this.categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.renderCategoryTabs();
                console.log("Categorias carregadas:", this.categories.length);
                resolve();
            });
        });
    }

    listenToProducts() {
        return new Promise((resolve) => {
            this.db.collection('menu_items').orderBy('name').onSnapshot(snapshot => {
                this.products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.renderMenuItems();
                console.log("Produtos carregados:", this.products.length);
                resolve();
            });
        });
    }
    
    listenToPizzariaStatus() {
        return new Promise((resolve) => {
            this.db.doc('settings/pizzariaStatus').onSnapshot(doc => {
                const status = doc.exists ? doc.data().online : true;
                this.isOpen = status;
                
                const banner = document.getElementById('status-banner');
                banner.classList.toggle('hidden', this.isOpen);

                document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.disabled = !this.isOpen);
                document.getElementById('finish-order-btn').disabled = !this.isOpen || this.cart.length === 0;

                // Admin
                const statusCheckbox = document.getElementById('pizzaria-status');
                const statusTextAdmin = document.getElementById('status-text-admin');
                if (statusCheckbox) statusCheckbox.checked = this.isOpen;
                if(statusTextAdmin) statusTextAdmin.textContent = this.isOpen ? 'Aberto' : 'Fechado';

                console.log("Status da pizzaria:", this.isOpen ? "Aberta" : "Fechada");
                resolve();
            });
        });
    }

    // 3. RENDERIZAÇÃO DO CARDÁPIO
    // =======================================

    renderCategoryTabs() {
        const tabsContainer = document.getElementById('category-tabs');
        if (!tabsContainer) return;
        
        tabsContainer.innerHTML = this.categories.map(cat => `
            <button class="category-tab" data-category-id="${cat.id}">
                ${cat.icon} ${cat.name}
            </button>
        `).join('');

        // Define a primeira categoria como ativa se nenhuma estiver selecionada
        if (!this.currentCategory && this.categories.length > 0) {
            this.currentCategory = this.categories[0].id;
        }

        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.categoryId === this.currentCategory);
            tab.addEventListener('click', () => {
                this.currentCategory = tab.dataset.categoryId;
                this.renderCategoryTabs(); // Re-render para atualizar a classe 'active'
                this.renderMenuItems();
            });
        });
    }

    renderMenuItems() {
        const menuContainer = document.getElementById('menu-content');
        if (!menuContainer) return;

        const filteredProducts = this.products.filter(p => p.categoryId === this.currentCategory);

        if (filteredProducts.length === 0) {
            menuContainer.innerHTML = `<p>Nenhum produto nesta categoria.</p>`;
            return;
        }

        menuContainer.innerHTML = filteredProducts.map(product => {
            const priceEntries = Object.entries(product.prices);
            const hasMultipleSizes = priceEntries.length > 1;
            const firstPrice = this.formatPrice(priceEntries[0][1]);

            return `
                <div class="menu-item">
                    <img src="${product.imageUrl || 'assets/pizza-placeholder.webp'}" alt="${product.name}" class="menu-item-image">
                    <div class="menu-item-content">
                        <h3 class="menu-item-name">${product.name}</h3>
                        <p class="menu-item-description">${product.description}</p>
                        
                        ${hasMultipleSizes ? `
                            <div class="size-selector" data-product-id="${product.id}">
                                ${priceEntries.map(([size, price], index) => `
                                    <button class="size-option ${index === 0 ? 'active' : ''}" data-size="${size}" data-price="${price}">
                                        ${size}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}

                        <div class="menu-item-footer">
                            <span class="menu-item-price">${hasMultipleSizes ? `a partir de ${firstPrice}` : firstPrice}</span>
                            <button class="btn btn--primary add-to-cart-btn" data-product-id="${product.id}" ${!this.isOpen ? 'disabled' : ''}>
                                ${this.isOpen ? 'Adicionar' : 'Fechado'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Adicionar eventos após renderizar
        this.setupMenuItemEvents();
    }

    setupMenuItemEvents() {
        document.querySelectorAll('.size-selector .size-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selector = e.target.closest('.size-selector');
                selector.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => this.addToCart(btn.dataset.productId));
        });
    }

    // 4. FUNCIONALIDADES DO CARRINHO
    // =======================================

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !this.isOpen) return;
        
        let selectedSize, selectedPrice;
        const sizeSelector = document.querySelector(`.size-selector[data-product-id="${productId}"]`);

        if (sizeSelector) {
            const activeOption = sizeSelector.querySelector('.size-option.active');
            selectedSize = activeOption.dataset.size;
            selectedPrice = parseFloat(activeOption.dataset.price);
        } else {
            const priceEntry = Object.entries(product.prices)[0];
            selectedSize = priceEntry[0];
            selectedPrice = parseFloat(priceEntry[1]);
        }

        const cartItem = {
            id: `${productId}_${selectedSize}`,
            productId,
            name: product.name,
            size: selectedSize,
            price: selectedPrice,
            quantity: 1,
            imageUrl: product.imageUrl,
        };
        
        const existingItem = this.cart.find(item => item.id === cartItem.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push(cartItem);
        }
        
        this.updateCart();
        this.toggleCart(true);
    }
    
    updateCartQuantity(itemId, change) {
        const item = this.cart.find(i => i.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(i => i.id !== itemId);
            }
        }
        this.updateCart();
    }
    
    updateCart() {
        this.saveCartToStorage();
        this.renderCartItems();
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('hidden', totalItems === 0);

        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-total-price').textContent = this.formatPrice(totalPrice);
        
        document.getElementById('finish-order-btn').disabled = this.cart.length === 0 || !this.isOpen;
    }

    renderCartItems() {
        const cartBody = document.getElementById('cart-items');
        if (this.cart.length === 0) {
            cartBody.innerHTML = `<p class="cart-empty">Seu carrinho está vazio.</p>`;
            return;
        }

        cartBody.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.imageUrl || 'assets/pizza-placeholder.webp'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name} <small>(${item.size})</small></h4>
                    <p class="cart-item-price">${this.formatPrice(item.price)}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="app.updateCartQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartQuantity('${item.id}', 1)">+</button>
                        <button class="icon-btn remove-item-btn" onclick="app.updateCartQuantity('${item.id}', -Infinity)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleCart(open) {
        const sidebar = document.getElementById('cart-sidebar');
        if (open) {
            sidebar.classList.add('open');
            this.updateCart(); // Garante que o carrinho está atualizado ao abrir
        } else {
            sidebar.classList.remove('open');
        }
    }
    
    saveCartToStorage() {
        localStorage.setItem('santaSensacaoCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('santaSensacaoCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCart();
        }
    }
    
    // 5. FINALIZAÇÃO DO PEDIDO
    // =======================================

    showOrderModal() {
        if (this.cart.length === 0) return;
        this.toggleModal('order-modal', true);

        const summaryContainer = document.getElementById('modal-order-summary');
        const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        summaryContainer.innerHTML = `
            ${this.cart.map(item => `
                <div class="summary-item">
                    <span>${item.quantity}x ${item.name} (${item.size})</span>
                    <strong>${this.formatPrice(item.price * item.quantity)}</strong>
                </div>
            `).join('')}
            <hr>
            <div class="summary-item">
                <strong>Total</strong>
                <strong>${this.formatPrice(totalPrice)}</strong>
            </div>
        `;
    }

    sendWhatsAppOrder() {
        const name = document.getElementById('customer-name').value;
        const deliveryType = document.getElementById('delivery-type').value;
        const address = document.getElementById('customer-address').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const changeFor = document.getElementById('change-for').value;

        let orderText = `*Olá, Santa Sensação! Gostaria de fazer um pedido.*\n\n`;
        orderText += `*Cliente:* ${name}\n`;
        orderText += `*Entrega:* ${deliveryType === 'delivery' ? 'Delivery' : 'Retirar no balcão'}\n`;
        if (deliveryType === 'delivery') {
            orderText += `*Endereço:* ${address}\n`;
        }
        orderText += '\n*--- MEU PEDIDO ---*\n';

        this.cart.forEach(item => {
            orderText += `▪️ ${item.quantity}x ${item.name} (${item.size})\n`;
        });
        
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderText += `\n*Total:* ${this.formatPrice(totalPrice)}\n`;
        orderText += `*Pagamento:* ${paymentMethod}\n`;

        if (paymentMethod === 'Dinheiro' && changeFor) {
            const troco = parseFloat(changeFor) - totalPrice;
            orderText += `*Troco para:* ${this.formatPrice(changeFor)} (Levar ${this.formatPrice(troco)} de troco)\n`;
        }

        const whatsappUrl = `https://wa.me/5527996500341?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappUrl, '_blank');

        this.cart = [];
        this.updateCart();
        this.toggleModal('order-modal', false);
        this.toggleCart(false);
    }

    // 6. PAINEL DE ADMINISTRADOR
    // =======================================
    setupAdminModals() {
        // Fechar modais
        document.querySelectorAll('.modal-wrapper .close-modal, .modal-wrapper .btn--outline').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-wrapper').classList.add('hidden');
            });
        });

        // Categoria
        document.getElementById('add-category-btn').addEventListener('click', () => this.showCategoryModal());
        document.getElementById('category-form').addEventListener('submit', (e) => { e.preventDefault(); this.saveCategory(); });
        
        // Produto
        document.getElementById('add-product-btn').addEventListener('click', () => this.showProductModal());
        document.getElementById('product-form').addEventListener('submit', (e) => { e.preventDefault(); this.saveProduct(); });
    }

    // ... (restante das funções do admin: login, logout, tabs, etc.)
    async adminLogin() {
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');
        try {
            errorDiv.classList.add('hidden');
            await this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            errorDiv.textContent = "Email ou senha inválidos.";
            errorDiv.classList.remove('hidden');
            console.error("Erro de login:", error);
        }
    }

    adminLogout() {
        this.auth.signOut();
    }
    
    switchAdminTab(tab) {
        document.querySelectorAll('.admin-tab-btn, .admin-tab-content').forEach(el => el.classList.remove('active'));
        document.querySelector(`.admin-tab-btn[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
        
        if (tab === 'categories') this.renderAdminCategories();
        if (tab === 'products') this.renderAdminProducts();
    }
    
    // ... (Funções de CRUD para Categorias e Produtos)
    showCategoryModal(category = null) {
        this.currentEditingId = category ? category.id : null;
        const form = document.getElementById('category-form');
        form.reset();
        
        document.getElementById('category-modal-title').textContent = category ? 'Editar Categoria' : 'Nova Categoria';
        if (category) {
            document.getElementById('category-id').value = category.id;
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-icon').value = category.icon;
            document.getElementById('category-order').value = category.order;
        }
        this.toggleModal('category-modal', true);
    }
    
    async saveCategory() {
        const id = this.currentEditingId;
        const categoryData = {
            name: document.getElementById('category-name').value,
            icon: document.getElementById('category-icon').value,
            order: parseInt(document.getElementById('category-order').value)
        };
        
        if (id) {
            await this.db.collection('menu_categories').doc(id).update(categoryData);
        } else {
            await this.db.collection('menu_categories').add(categoryData);
        }
        this.toggleModal('category-modal', false);
    }
    
    async deleteCategory(id) {
        if (confirm("Tem certeza que deseja excluir esta categoria?")) {
            await this.db.collection('menu_categories').doc(id).delete();
        }
    }
    
    showProductModal(product = null) {
        this.currentEditingId = product ? product.id : null;
        const form = document.getElementById('product-form');
        form.reset();

        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = this.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        
        document.getElementById('product-modal-title').textContent = product ? 'Editar Produto' : 'Novo Produto';
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            categorySelect.value = product.categoryId;
            document.getElementById('product-image').value = product.imageUrl || '';
            Object.entries(product.prices).forEach(([size, price]) => {
                const inputId = `price-${size.toLowerCase().charAt(0)}`;
                if(document.getElementById(inputId)) document.getElementById(inputId).value = price;
            });
        }
        this.toggleModal('product-modal', true);
    }
    
    async saveProduct() {
        const id = this.currentEditingId;
        const prices = {};
        if (document.getElementById('price-p').value) prices.P = parseFloat(document.getElementById('price-p').value);
        if (document.getElementById('price-m').value) prices.M = parseFloat(document.getElementById('price-m').value);
        if (document.getElementById('price-g').value) prices.G = parseFloat(document.getElementById('price-g').value);
        if (document.getElementById('price-u').value) prices['Única'] = parseFloat(document.getElementById('price-u').value);

        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            categoryId: document.getElementById('product-category').value,
            imageUrl: document.getElementById('product-image').value,
            prices: prices
        };

        if (id) {
            await this.db.collection('menu_items').doc(id).update(productData);
        } else {
            await this.db.collection('menu_items').add(productData);
        }
        this.toggleModal('product-modal', false);
    }

    async deleteProduct(id) {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            await this.db.collection('menu_items').doc(id).delete();
        }
    }

    renderAdminCategories() {
        const container = document.getElementById('categories-list');
        container.innerHTML = this.categories.map(cat => `
            <div class="admin-item">
                <span>${cat.icon} ${cat.name} (Ordem: ${cat.order})</span>
                <div class="admin-item-actions">
                    <button class="icon-btn" onclick="app.showCategoryModal(${JSON.stringify(cat).replace(/"/g, "'")})"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn" onclick="app.deleteCategory('${cat.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
    
    renderAdminProducts() {
        const container = document.getElementById('products-list');
        container.innerHTML = this.products.map(prod => `
             <div class="admin-item">
                <span>${prod.name}</span>
                <div class="admin-item-actions">
                    <button class="icon-btn" onclick="app.showProductModal(${JSON.stringify(prod).replace(/"/g, "'")})"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn" onclick="app.deleteProduct('${prod.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    // 7. FUNÇÕES UTILITÁRIAS
    // =======================================
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    }

    toggleModal(modalId, show) {
        document.getElementById(modalId).classList.toggle('hidden', !show);
    }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PizzariaApp();
});