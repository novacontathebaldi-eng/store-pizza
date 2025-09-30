import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Cole aqui a configuração do seu projeto Firebase.
// Você pode encontrar esses dados no console do Firebase em:
// Configurações do projeto > Geral > Seus apps > App da Web > Configuração e instalação do SDK > Config
const firebaseConfig = {
  apiKey: "AIzaSyCTMHlUCGOpU7VRIdbP2VADzUF9n1lI88A",
  authDomain: "site-pizza-a2930.firebaseapp.com",
  projectId: "site-pizza-a2930",
  storageBucket: "site-pizza-a2930.appspot.com",
  messagingSenderId: "914255031241",
  appId: "1:914255031241:web:84ae273b22cb7d04499618"
};

let db: Firestore | null = null;

try {
  // Inicializa o Firebase
  const app: FirebaseApp = initializeApp(firebaseConfig);
  // Pega uma instância do Firestore
  db = getFirestore(app);
} catch (error) {
  console.error('Falha ao inicializar o Firebase. Verifique seu objeto firebaseConfig em `services/firebase.ts`.', error);
  // db permanece nulo, e o aplicativo exibirá uma mensagem de erro de conexão.
}

export { db };
