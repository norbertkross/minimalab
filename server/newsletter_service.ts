import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase_server.js";

export interface NewsletterSubscription {
  id?: string;
  name?: string;
  email: string;
  tags: string[];
  createdAt?: Date;
}

const newslettersCollection = collection(db, "newsletters");

export async function addNewsletterSubscription(
  subscription: Omit<NewsletterSubscription, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(newslettersCollection, {
    ...subscription,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getNewslettersByTag(
  tag: string
): Promise<NewsletterSubscription[]> {
  const q = query(newslettersCollection, where("tags", "array-contains", tag));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsletterSubscription[];
}

export async function getAllNewsletters(): Promise<NewsletterSubscription[]> {
  const snapshot = await getDocs(newslettersCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as NewsletterSubscription[];
}
