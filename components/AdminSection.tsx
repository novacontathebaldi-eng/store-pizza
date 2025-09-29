
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { ProductModal } from './ProductModal';

interface AdminSectionProps {
    allProducts: Product[];
    allCategories: Category[];
    isStoreOnline: boolean;
    onSaveProduct: (product: Product) => Promise<void>;
    onDeleteProduct: (productId: string) => Promise<void>;
    onStoreStatusChange: (isOnline: boolean) => Promise<void>;
}

export const AdminSection: React.FC<AdminSectionProps> = ({ allProducts, allCategories, isStoreOnline, onSaveProduct, onDeleteProduct, onStoreStatusChange }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('status');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const checkHash = () => {
            if (window.location.hash !== '#admin' && isLoggedIn) {
                // optional: auto-logout if hash changes
            }
        };
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, [isLoggedIn]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock authentication
        if (email === 'admin@santa.com' && password === 'admin123') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Email ou senha incorretos.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
        window.location.hash = '';
    };

    const handleAddNewProduct = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    if (window.location.hash !== '#admin') {
        return null;
    }

    if (!isLoggedIn) {
        return (
            <section id="admin" className="py-20 bg-brand-ivory-50">
                <div className="container mx-auto px-4 max-w-md">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                        <h2 className="text-3xl font-bold text-center mb-6 text-text-on-light"><i className="fas fa-shield-alt mr-2"></i>Painel Administrativo</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="admin-email">Email</label>
                                <input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="admin-password">Senha</label>
                                <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" required />
                            </div>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                            <button type="submit" className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all">Entrar</button>
                        </form>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="admin" className="py-20 bg-brand-ivory-50">
            <div className="container mx-auto px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-text-on-light">Painel Administrativo</h2>
                        <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-all"><i className="fas fa-sign-out-alt mr-2"></i>Sair</button>
                    </div>

                    <div className="flex border-b border-gray-200 mb-6">
                        <button onClick={() => setActiveTab('status')} className={`py-2 px-6 font-semibold ${activeTab === 'status' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Status</button>
                        <button onClick={() => setActiveTab('products')} className={`py-2 px-6 font-semibold ${activeTab === 'products' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Produtos</button>
                        <button onClick={() => setActiveTab('categories')} className={`py-2 px-6 font-semibold ${activeTab === 'categories' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}>Categorias</button>
                    </div>

                    {/* Status Tab */}
                    {activeTab === 'status' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Status da Pizzaria</h3>
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                <label htmlFor="store-status-toggle" className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="store-status-toggle" className="sr-only peer" checked={isStoreOnline} onChange={e => onStoreStatusChange(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                                <span className={`font-semibold text-lg ${isStoreOnline ? 'text-green-600' : 'text-red-600'}`}>
                                    {isStoreOnline ? 'Aberta para pedidos' : 'Fechada'}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Gerenciar Produtos</h3>
                                <button onClick={handleAddNewProduct} className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all"><i className="fas fa-plus mr-2"></i>Novo Produto</button>
                            </div>
                            <div className="space-y-3">
                                {allProducts.map(product => (
                                    <div key={product.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">{product.name}</p>
                                            <p className="text-sm text-gray-500">{allCategories.find(c => c.id === product.categoryId)?.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditProduct(product)} className="bg-blue-500 text-white w-8 h-8 rounded-md hover:bg-blue-600"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => window.confirm('Tem certeza?') && onDeleteProduct(product.id)} className="bg-red-500 text-white w-8 h-8 rounded-md hover:bg-red-600"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categories Tab */}
                    {activeTab === 'categories' && (
                        <div>
                             <h3 className="text-xl font-bold mb-4">Gerenciar Categorias</h3>
                             <p className="text-gray-500 mb-4">A edição de categorias será implementada em breve. Por enquanto, as categorias são gerenciadas via código.</p>
                             <div className="space-y-3">
                                {allCategories.map(cat => (
                                    <div key={cat.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                        <p className="font-bold">{cat.name}</p>
                                        <p className="text-sm text-gray-500">Ordem: {cat.order}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <ProductModal 
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={onSaveProduct}
                product={editingProduct}
                categories={allCategories}
            />
        </section>
    );
};
