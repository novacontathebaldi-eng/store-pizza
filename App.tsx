
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Category, CartItem, OrderDetails } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AdminSection } from './components/AdminSection';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { getMockData, updateMockProduct, addMockProduct, deleteMockProduct, updateMockStoreStatus } from './services/mockService';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isStoreOnline, setIsStoreOnline] = useState<boolean>(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
    
    useEffect(() => {
        const loadCartFromStorage = () => {
            try {
                const savedCart = localStorage.getItem('santaSensacaoCart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error("Failed to load cart from localStorage:", error);
            }
        };
        loadCartFromStorage();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { products: fetchedProducts, categories: fetchedCategories, isOnline } = await getMockData();
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
            setIsStoreOnline(isOnline);
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('santaSensacaoCart', JSON.stringify(cart));
        } catch (error) {
            console.error("Failed to save cart to localStorage:", error);
        }
    }, [cart]);

    const handleAddToCart = useCallback((product: Product, size: string, price: number) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.productId === product.id && item.size === size);
            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += 1;
                return updatedCart;
            } else {
                const newItem: CartItem = {
                    id: `${product.id}-${size}`,
                    productId: product.id,
                    name: product.name,
                    size,
                    price,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                };
                return [...prevCart, newItem];
            }
        });
        setIsCartOpen(true);
    }, []);

    const handleUpdateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }
            return prevCart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item);
        });
    }, []);

    const handleCheckout = (details: OrderDetails) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

        let message = `*🍕 NOVO PEDIDO - PIZZARIA SANTA SENSAÇÃO 🍕*\n\n`;
        message += `*👤 DADOS DO CLIENTE:*\n`;
        message += `*Nome:* ${details.name}\n`;
        message += `*Telefone:* ${details.phone}\n`;
        message += `*Tipo de Pedido:* ${details.orderType}\n`;
        if (details.orderType === 'delivery') {
            message += `*Endereço:* ${details.address}\n\n`;
        }

        message += `*🛒 ITENS DO PEDIDO:*\n`;
        cart.forEach(item => {
            message += `• ${item.quantity}x ${item.name} (${item.size}) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\n*💰 TOTAL: R$ ${total}*\n\n`;
        
        message += `*💳 PAGAMENTO:*\n`;
        message += `*Forma:* ${details.paymentMethod}\n`;
        if (details.paymentMethod === 'cash') {
            if (details.changeNeeded) {
                message += `*Precisa de troco para:* R$ ${details.changeAmount}\n`;
            } else {
                message += `*Não precisa de troco.*\n`;
            }
        }
        if (details.notes) {
            message += `\n*📝 OBSERVAÇÕES:*\n${details.notes}\n`;
        }

        message += `\n_Pedido gerado pelo nosso site._`;
        
        const whatsappUrl = `https://wa.me/5527996500341?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        setCart([]);
        setIsCheckoutModalOpen(false);
        setIsCartOpen(false);
    };

    const handleSaveProduct = useCallback(async (product: Product) => {
        if (product.id && products.some(p => p.id === product.id)) {
            const updated = await updateMockProduct(product);
            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } else {
            const newProduct = await addMockProduct(product);
            setProducts(prev => [...prev, newProduct]);
        }
    }, [products]);
    
    const handleDeleteProduct = useCallback(async (productId: string) => {
        await deleteMockProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
    }, []);

    const handleStoreStatusChange = useCallback(async (isOnline: boolean) => {
        const success = await updateMockStoreStatus(isOnline);
        if (success) {
            setIsStoreOnline(isOnline);
        }
    }, []);
    
    const cartTotalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header cartItemCount={cartTotalItems} onCartClick={() => setIsCartOpen(true)} />
            
            <div id="status-banner" className={`bg-red-600 text-white text-center p-2 font-semibold ${isStoreOnline ? 'hidden' : ''}`}>
                <i className="fas fa-times-circle mr-2"></i>
                Desculpe, estamos fechados no momento.
            </div>

            <main className="flex-grow">
                <HeroSection />
                <MenuSection 
                    categories={categories} 
                    products={products} 
                    onAddToCart={handleAddToCart}
                    isStoreOnline={isStoreOnline}
                />
                <AboutSection />
                <ContactSection />
                <AdminSection 
                    allProducts={products}
                    allCategories={categories}
                    isStoreOnline={isStoreOnline}
                    onSaveProduct={handleSaveProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onStoreStatusChange={handleStoreStatusChange}
                />
            </main>

            <Footer />

            <CartSidebar 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                }}
            />

            <CheckoutModal 
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                cartItems={cart}
                onConfirmCheckout={handleCheckout}
            />
        </div>
    );
};

export default App;
