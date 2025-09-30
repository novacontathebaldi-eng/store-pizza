import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';

export const updateStoreStatus = async (isOnline: boolean): Promise<void> => {
    const statusRef = doc(db, 'store_config', 'status');
    await setDoc(statusRef, { isOpen: isOnline }, { merge: true });
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<void> => {
    await addDoc(collection(db, 'products'), productData);
};

export const updateProduct = async (product: Product): Promise<void> => {
    const { id, ...productData } = product;
    if (!id) throw new Error("Product ID is missing for update.");
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, productData as { [key: string]: any });
};

export const deleteProduct = async (productId: string): Promise<void> => {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
};

export const reorderProducts = async (products: Product[]): Promise<void> => {
    const batch = writeBatch(db);
    products.forEach((product, index) => {
        const productRef = doc(db, 'products', product.id);
        batch.update(productRef, { orderIndex: index });
    });
    await batch.commit();
};
