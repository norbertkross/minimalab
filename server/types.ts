export interface Blog {
  id: string;
  /**
   * Optional legacy/SEO identifier stored in the Firestore document body.
   * Note: this is different from the Firestore document id (`id` above).
   */
  slug?: string;
  title?: string;
  content: string;
  createdAt?: string;
  image_url?: string;
  tags?: string[];
  author?: string;
  short_description?: string;
}
