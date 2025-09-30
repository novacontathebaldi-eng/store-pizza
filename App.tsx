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
import { db } from './services/firebase';
import * as firebaseService from './services/firebaseService';
import { seedDatabase } from './services/seed'; // Importar a função de seed
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';


const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isStoreOnline, setIsStoreOnline] = useState<boolean>(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const savedCart = localStorage.getItem('santaSensacaoCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        if (!db) {
            setError("Falha ao inicializar o Firebase. Verifique as credenciais em services/firebase.ts");
            setIsLoading(false);
            return;
        }

        const handleConnectionError = (err: Error, context: string) => {
            console.error(`Error fetching ${context}:`, err);
            setError("Não foi possível conectar ao banco de dados. Verifique sua configuração e as regras de segurança.");
            setIsLoading(false);
        };

        // Listener for store status
        const statusDocRef = doc(db, 'store_config', 'status');
        const unsubStatus = onSnapshot(statusDocRef, doc => {
            const data = doc.data();
            if (data) {
                setIsStoreOnline(data.isOpen);
            }
        }, err => handleConnectionError(err, "store status"));

        // Listener for categories
        const categoriesQuery = query(collection(db, 'categories'), orderBy('order'));
        const unsubCategories = onSnapshot(categoriesQuery, snapshot => {
            const fetchedCategories: Category[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            setCategories(fetchedCategories);
        }, err => handleConnectionError(err, "categories"));

        // Listener for products
        const productsQuery = query(collection(db, 'products'), orderBy('orderIndex'));
        const unsubProducts = onSnapshot(productsQuery, snapshot => {
            const fetchedProducts: Product[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(fetchedProducts);
            setIsLoading(false);
            setError(null);
        }, err => handleConnectionError(err, "products"));

        return () => {
            unsubStatus();
            unsubCategories();
            unsubProducts();
        };
    }, []);
    
    useEffect(() => {
        localStorage.setItem('santaSensacaoCart', JSON.stringify(cart));
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
        try {
            if (product.id) {
                await firebaseService.updateProduct(product);
            } else {
                await firebaseService.addProduct({ ...product, orderIndex: products.length });
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Erro ao salvar produto. Tente novamente.");
        }
    }, [products.length]);
    
    const handleDeleteProduct = useCallback(async (productId: string) => {
        try {
            await firebaseService.deleteProduct(productId);
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Erro ao deletar produto. Tente novamente.");
        }
    }, []);

    const handleStoreStatusChange = useCallback(async (isOnline: boolean) => {
        try {
            await firebaseService.updateStoreStatus(isOnline);
        } catch (error) {
            console.error("Failed to update store status:", error);
            alert("Erro ao atualizar status da loja. Tente novamente.");
        }
    }, []);

    const handleReorderProducts = useCallback(async (reorderedProducts: Product[]) => {
        try {
            await firebaseService.reorderProducts(reorderedProducts);
        } catch (error) {
            console.error("Failed to reorder products:", error);
            alert("Erro ao reordenar produtos. Tente novamente.");
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
                
                {error && (
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md" role="alert">
                            <p className="font-bold text-lg mb-2">Erro de Conexão com o Firebase</p>
                            <p className="mb-4">{error}</p>
                            <h3 className="font-semibold text-md mb-2">Possíveis Soluções:</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Verifique se as credenciais no arquivo <strong>services/firebase.ts</strong> estão 100% corretas.</li>
                                <li>No Console do Firebase, certifique-se de que o <strong>Cloud Firestore</strong> foi criado e ativado para este projeto.</li>
                                <li>Confira as <strong>Regras de Segurança</strong> do Firestore. Para teste, use <code>allow read: if true;</code> para as coleções.</li>
                                <li>Verifique sua conexão com a internet e se não há um firewall bloqueando o acesso ao Google Cloud.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-20">
                        <i className="fas fa-spinner fa-spin text-5xl text-accent"></i>
                        <p className="mt-4 text-xl font-semibold text-gray-600">Carregando cardápio...</p>
                    </div>
                ) : !error && (
                    <MenuSection 
                        categories={categories} 
                        products={products} 
                        onAddToCart={handleAddToCart}
                        isStoreOnline={isStoreOnline}
                    />
                )}

                <AboutSection />
                <ContactSection />
                <AdminSection 
                    allProducts={products}
                    allCategories={categories}
                    isStoreOnline={isStoreOnline}
                    onSaveProduct={handleSaveProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onStoreStatusChange={handleStoreStatusChange}
                    onReorderProducts={handleReorderProducts}
                    onSeedDatabase={seedDatabase}
                />
            </main>

            <Footer />

            <CartSidebar 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onCheckout={() => {
                    if (!isStoreOnline) {
                        alert("A loja está fechada. Não é possível finalizar o pedido.");
                        return;
                    }
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                }}
                isStoreOnline={isStoreOnline}
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
