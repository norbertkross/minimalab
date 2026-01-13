import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { Blog } from "./pages/blogs/types";

function formatFirestoreDate(value: unknown): {
  formatted: string | undefined;
  timestamp: number | undefined;
} {
  // Firestore Timestamp has a toDate() method. Some data may already be a string.
  if (value && typeof value === "object" && "toDate" in value) {
    const maybeTs = value as { toDate: () => Date };
    const d = maybeTs.toDate();
    if (d instanceof Date && !Number.isNaN(d.getTime())) {
      return {
        formatted: d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        timestamp: d.getTime(),
      };
    }
  }
  if (typeof value === "string") {
    // Try to parse the string as a date
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        formatted: value,
        timestamp: parsed.getTime(),
      };
    }
    return { formatted: value, timestamp: undefined };
  }
  return { formatted: undefined, timestamp: undefined };
}

interface Quote {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  phone: string;
  service: string;
}

const messageCollection = collection(db, "customer-quotes");

export const UserService = {
  async getQuoteMessages(): Promise<Quote[]> {
    const snapshot = await getDocs(messageCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      message: doc.data().message,
      phone: doc.data().phone,
      service: doc.data().service || "",
    }));
  },

  async addQuote(quote: Omit<Quote, "id">): Promise<string> {
    const docRef = await addDoc(messageCollection, quote);
    return docRef.id;
  },
};

const blogsCollection = collection(db, "blogs");

function toBlog(docId: string, data: Record<string, unknown>): Blog {
  // Never let the document body override the Firestore document id.
  // Some docs may contain an `id` field used as a slug, which would break routing.
  const {
    id: legacyId,
    slug,
    createdAt,
    ...rest
  } = (data ?? {}) as Record<string, unknown>;

  const content = typeof rest.content === "string" ? rest.content : "";
  const title = typeof rest.title === "string" ? rest.title : undefined;
  const image_url =
    typeof rest.image_url === "string" ? rest.image_url : undefined;
  const author = typeof rest.author === "string" ? rest.author : undefined;
  const short_description =
    typeof rest.short_description === "string"
      ? rest.short_description
      : undefined;
  const tags = Array.isArray(rest.tags)
    ? (rest.tags.filter((t) => typeof t === "string") as string[])
    : undefined;

  // Parse view_count and clap_count
  const view_count =
    typeof rest.view_count === "number"
      ? rest.view_count
      : typeof rest.view_count === "string"
      ? parseInt(rest.view_count, 10) || 0
      : undefined;
  const clap_count =
    typeof rest.clap_count === "number"
      ? rest.clap_count
      : typeof rest.clap_count === "string"
      ? parseInt(rest.clap_count, 10) || 0
      : undefined;

  // Prefer explicit `slug` field, otherwise keep legacy `id` field as slug.
  const resolvedSlug =
    typeof slug === "string"
      ? slug
      : typeof legacyId === "string"
      ? legacyId
      : undefined;

  const { formatted: createdAtFormatted, timestamp: createdAtTimestamp } =
    formatFirestoreDate(createdAt);

  return {
    id: docId,
    slug: resolvedSlug,
    createdAt: createdAtFormatted,
    createdAtTimestamp,
    content,
    title,
    image_url,
    author,
    short_description,
    tags,
    view_count,
    clap_count,
  };
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  tags?: string[];
}

export const NewsletterService = {
  async subscribe(
    subscription: NewsletterSubscription
  ): Promise<{ success: boolean; id: string; message: string }> {
    try {
      const response = await fetch(`/api/newsletters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: subscription.email,
          name: subscription.name,
          tags: subscription.tags || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        console.error(
          "Newsletter subscription error:",
          errorMessage,
          errorData
        );
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // If it's a network error (like connection refused), provide a helpful message
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("Network error - is the backend server running?", error);
        throw new Error(
          "Unable to connect to server. Please make sure the backend server is running."
        );
      }
      throw error;
    }
  },
};

export const BlogService = {
  async getBlogs(): Promise<Blog[]> {
    const snapshot = await getDocs(blogsCollection);
    return snapshot.docs.map((doc) => {
      const data = (doc.data() ?? {}) as Record<string, unknown>;
      return toBlog(doc.id, data);
    });
  },

  // Fix: Accept id parameter and use it in doc()
  async getBlogById(id: string): Promise<Blog | undefined> {
    if (!id || typeof id !== "string") {
      return undefined;
    }

    try {
      // Query for blogs where the "id" field matches the provided id and take the first
      const q = query(blogsCollection, where("id", "==", id), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.warn(`getBlogById: No document found with ID field: ${id}`);
        return undefined;
      }
      const firstDoc = snapshot.docs[0];
      const data = (firstDoc.data() ?? {}) as Record<string, unknown>;
      return toBlog(firstDoc.id, data);
    } catch (error) {
      console.error(
        `getBlogById: Error fetching blog by ID field (${id}):`,
        error
      );
      return undefined;
    }
  },

  /**
   * Resolve a blog by either Firestore document id (preferred) or by slug.
   * This makes direct `/blogs/{id}` loads work even if `{id}` is actually a slug.
   */
  async getBlogByIdentifier(identifier: string): Promise<Blog | undefined> {
    const cleanId = identifier;

    // 1. Try by Firestore Document ID (fast path)
    try {
      const ref = doc(db, "blogs", cleanId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return toBlog(snap.id, (snap.data() ?? {}) as Record<string, unknown>);
      }
    } catch (e) {
      // Keep going; we'll try query fallback.
      console.warn(
        "getBlogByIdentifier: getDoc failed, falling back to query:",
        e
      );
    }

    // 2. Try by Document ID field (legacy)
    const byDocId = await this.getBlogById(cleanId);
    if (byDocId) {
      return byDocId;
    }

    console.error(
      `getBlogByIdentifier: Failed to resolve blog for "${cleanId}"`
    );
    return undefined;
  },
};
