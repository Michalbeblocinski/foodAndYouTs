import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  DocumentReference,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzAnEh6C_Ah80VilDQGGCO2pEPMqxpevM",
  authDomain: "foodandyou-24a2f.firebaseapp.com",
  projectId: "foodandyou-24a2f",
  storageBucket: "foodandyou-24a2f.appspot.com",
  messagingSenderId: "159539304920",
  appId: "1:159539304920:web:cd8e0573ac9e86fe477aad",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage();

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

// Login + Auth
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createUserDocumentFromAuth = async (
  userAuth: any,
  role: string,
  addictionalInformation = {}
): Promise<DocumentReference | undefined> => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { username, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        username,
        email,
        createdAt,
        role,
        ...addictionalInformation,
      });
    } catch (error) {
      console.log("Error from creating user: ", error);
    }
    return userDocRef;
  }
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};
