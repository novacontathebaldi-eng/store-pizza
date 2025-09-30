import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// CORREÇÃO: Credenciais atualizadas para corresponder exatamente à sua captura de tela do Firebase.
// Isso é crucial para resolver o erro de conexão '[code=unavailable]'.
const firebaseConfig = {
  apiKey: "AIzaSyCjyMWI1UCGOpU7VPIcbP2VADzfn9lI88A", // Corrigido
  authDomain: "site-pizza-a2930.firebaseapp.com",
  projectId: "site-pizza-a2930",
  storageBucket: "site-pizza-a2930.firebasestorage.app",
  messagingSenderId: "914255031241",
  appId: "1:914255031241:web:84ae273b22cb7d04499618" // Corrigido
};

let db: Firestore | null = null;

try {
  const app: FirebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase inicializado com sucesso. Conectando ao Firestore...");
} catch (error) {
  console.error('Falha ao inicializar o Firebase. Verifique seu objeto firebaseConfig em `services/firebase.ts`.', error);
}

export { db };
