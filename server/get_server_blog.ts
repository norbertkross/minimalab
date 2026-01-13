import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase_server.js";
import type { Blog } from "./types.js";

function formatFirestoreDate(value: unknown): string | undefined {
  if (value && typeof value === "object" && "toDate" in value) {
    const maybeTs = value as { toDate: () => Date };
    const d = maybeTs.toDate();
    if (d instanceof Date && !Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  if (typeof value === "string") return value;
  return undefined;
}

const blogsCollection = collection(db, "blogs");

function toBlog(docId: string, data: Record<string, unknown>): Blog {
  // Never let the document body override the Firestore document id.
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

  const resolvedSlug =
    typeof slug === "string"
      ? slug
      : typeof legacyId === "string"
      ? legacyId
      : undefined;

  return {
    id: docId,
    slug: resolvedSlug,
    createdAt: formatFirestoreDate(createdAt),
    content,
    title,
    image_url,
    author,
    short_description,
    tags,
  };
}

export async function getBlogs(): Promise<Blog[]> {
  const snapshot = await getDocs(blogsCollection);
  return snapshot.docs.map((d) =>
    toBlog(d.id, (d.data() ?? {}) as Record<string, unknown>)
  );
}

/**
 * Resolve a blog by either Firestore document id (preferred) or by slug/legacy id.
 * This aligns with how routes are built: `/blogs/${blog.id}` where `blog.id` is doc id.
 */
export async function getBlogByIdentifier(
  identifier: string | undefined
): Promise<Blog | undefined> {
  const clean = (identifier ?? "").trim();
  if (!clean) return undefined;

  // 1) Try by Firestore document id (fast path)
  try {
    const ref = doc(db, "blogs", clean);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return toBlog(snap.id, (snap.data() ?? {}) as Record<string, unknown>);
    }
  } catch (e) {
    // Keep going; we'll try slug/legacy field fallback.
    console.warn(
      "getBlogByIdentifier: getDoc failed, falling back to query:",
      e
    );
  }

  // 2) Try by explicit slug
  try {
    const q = query(blogsCollection, where("slug", "==", clean), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const firstDoc = snapshot.docs[0];
      return toBlog(
        firstDoc.id,
        (firstDoc.data() ?? {}) as Record<string, unknown>
      );
    }
  } catch (e) {
    console.warn("getBlogByIdentifier: slug query failed:", e);
  }

  // 3) Legacy fallback: some docs used a body field `id` as slug
  try {
    const q = query(blogsCollection, where("id", "==", clean), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const firstDoc = snapshot.docs[0];
      return toBlog(
        firstDoc.id,
        (firstDoc.data() ?? {}) as Record<string, unknown>
      );
    }
  } catch (e) {
    console.warn("getBlogByIdentifier: legacy id query failed:", e);
  }

  return undefined;
}
