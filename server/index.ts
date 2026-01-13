import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Blog } from "./types.js";
import { getBlogByIdentifier } from "./get_server_blog.js";
import {
  addNewsletterSubscription,
  getNewslettersByTag,
} from "./newsletter_service.js";

// Load environment variables for the server.
// - First try the current working directory (default dotenv behavior)
// - Then fall back to the repo root relative to this compiled file (works when starting from `server-dist/`)
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Parse JSON bodies for API routes
app.use(express.json());

// 1. READ THE TEMPLATE ONCE (Cache it in memory)
const indexPath = path.resolve(__dirname, "../dist/index.html");
const baseHtml = fs.readFileSync(indexPath, "utf8");

// 2. SERVE STATIC ASSETS FIRST
// This ensures /assets/main.js is sent normally without hitting your logic below
app.use(express.static(path.resolve(__dirname, "../dist"), { index: false }));

// API Routes
app.post("/api/newsletters", async (req, res) => {
  try {
    const { email, name, tags } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const subscriptionId = await addNewsletterSubscription({
      email,
      name: name || undefined,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      id: subscriptionId,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("Error adding newsletter subscription:", error);
    res.status(500).json({
      message: "Failed to subscribe to newsletter",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/newsletters/send", async (req, res) => {
  try {
    const { tag, subject, body } = req.body;

    if (!tag || typeof tag !== "string") {
      return res.status(400).json({ message: "Tag is required" });
    }

    if (!subject || typeof subject !== "string") {
      return res.status(400).json({ message: "Subject is required" });
    }

    if (!body || typeof body !== "string") {
      return res.status(400).json({ message: "Body is required" });
    }

    const subscribers = await getNewslettersByTag(tag);

    if (subscribers.length === 0) {
      return res.status(404).json({
        message: `No subscribers found with tag: ${tag}`,
        count: 0,
      });
    }

    // TODO: Integrate with email service (e.g., SendGrid, AWS SES, Nodemailer)
    // For now, we'll return the list of emails that would receive the email
    const emails = subscribers.map((sub) => sub.email);

    res.status(200).json({
      success: true,
      message: `Email would be sent to ${subscribers.length} subscriber(s)`,
      tag,
      subject,
      recipientCount: subscribers.length,
      recipients: emails,
      // In production, you would send the emails here
      // await sendEmails(emails, subject, body);
    });
  } catch (error) {
    console.error("Error sending newsletter emails:", error);
    res.status(500).json({
      message: "Failed to send newsletter emails",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    // 3. LOGIC CHECK: Only inject for page requests, ignore files with extensions
    if (req.path.includes(".")) return res.sendFile(indexPath);

    const postId = req.params.id;

    const getBlog: Blog | undefined = await getBlogByIdentifier(postId);

    // If blog can't be resolved, send base HTML and let React Router handle it.
    if (!getBlog) return res.send(baseHtml);

    // 4. USE THE CACHED BASE HTML
    const html = baseHtml
      .replace(/__TITLE__/g, getBlog.title || "")
      .replace(/__OG_TITLE__/g, getBlog.title || "")
      .replace(/__OG_DESCRIPTION__/g, getBlog.short_description || "")
      .replace(/__OG_IMAGE__/g, getBlog.image_url || "");

    res.send(html);
  } catch (err) {
    console.error("Blog meta injection failed:", err);
    // Fallback to original HTML (React will handle error states on client)
    res.send(baseHtml);
  }
});

// If we don't recognize the URL, send index.html and let React Router handle it.
// Note: Some Express/router versions don't accept the string route "*", so we use middleware.
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  // If it looks like a real file request and static middleware didn't serve it, 404 it.
  // (We only want SPA fallback for "clean" URLs without extensions.)
  if (req.path.includes(".")) {
    const html = baseHtml.replace(/__TITLE__/g, "Sailnex");
    // Remove all lines with the replacement tag programmatically
    const cleanHtml = html
      .split("\n")
      .filter(
        (line) =>
          !line.includes("__OG_TITLE__") &&
          !line.includes("__OG_DESCRIPTION__") &&
          !line.includes("__OG_IMAGE__")
      )
      .join("\n");
    return res.send(cleanHtml);
  }

  const html = baseHtml.replace(/__TITLE__/g, "Sailnex");
  // Remove all lines with the replacement tag programmatically
  const cleanHtml = html
    .split("\n")
    .filter(
      (line) =>
        !line.includes("__OG_TITLE__") &&
        !line.includes("__OG_DESCRIPTION__") &&
        !line.includes("__OG_IMAGE__")
    )
    .join("\n");
  return res.send(cleanHtml);
});
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server running on port [${port}]`));
