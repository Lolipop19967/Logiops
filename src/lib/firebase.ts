import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAqE54WPgOTgRib_2m3RQ8JF8NeN4eQKU8",
  authDomain: "logistics-53406.firebaseapp.com",
  projectId: "logistics-53406",
  storageBucket: "logistics-53406.firebasestorage.app",
  messagingSenderId: "21642162278",
  appId: "1:21642162278:web:dfb3c9d3fb738394a5fda7",
  measurementId: "G-FDBY88LBW4"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
export default app
