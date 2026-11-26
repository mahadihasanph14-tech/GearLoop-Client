"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      e.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImgBB API key is missing.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "Image upload failed.",
        );
      }

      setImage(result.data.url);
      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!image.trim()) {
      toast.error("Please provide a profile photo.");
      return;
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      password.length < 6
    ) {
      toast.error(
        "Password needs uppercase, lowercase and at least 6 characters.",
      );
      return;
    }

    setBusy(true);

    try {
      const r = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (r.error) {
        toast.error(r.error.message || "Registration failed");
        return;
      }

      toast.success("Account created!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">JOIN THE MARKETPLACE</span>

        <h1>Create account</h1>

        <div className="form-row">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-row">
          <label htmlFor="image-url">Profile Photo URL</label>
          <input
            id="image-url"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste direct image URL"
          />
        </div>

        <div className="form-row">
          <label htmlFor="image-upload">
            Or Upload Photo (ImgBB)
          </label>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading || busy}
          />

          {uploading && (
            <p className="muted">Uploading image...</p>
          )}
        </div>

        {image && (
          <div
            className="panel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <img
              src={image}
              alt="Profile preview"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div>
              <b>Profile Photo Preview</b>
              <p className="muted">Your selected profile picture</p>
            </div>
          </div>
        )}

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button
          className="button"
          disabled={busy || uploading}
        >
          {uploading
            ? "Uploading photo..."
            : busy
              ? "Creating..."
              : "Create account"}
        </button>

        <p className="muted">
          Already registered? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}