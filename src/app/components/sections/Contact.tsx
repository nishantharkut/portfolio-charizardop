"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const links = [
  {
    label: "nhnishantharkut@gmail.com",
    href: "mailto:nhnishantharkut@gmail.com",
    type: "Email",
  },
  {
    label: "linkedin.com/in/nishant-harkut",
    href: "https://linkedin.com/in/nishant-harkut",
    type: "LinkedIn",
  },
  {
    label: "github.com/nishantharkut",
    href: "https://github.com/nishantharkut",
    type: "GitHub",
  },
  {
    label: "@HarkutNishant",
    href: "https://x.com/HarkutNishant",
    type: "X / Twitter",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="section-container">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4"
          style={{ color: "var(--color-text)", fontWeight: 500 }}
        >
          Get in <span style={{ color: "var(--color-accent)" }}>touch</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm sm:text-base md:text-lg mb-12 sm:mb-16 max-w-xl"
          style={{ color: "var(--color-text-muted)" }}
        >
          Have a project in mind, or just want to say hello? I&apos;d love to
          hear from you.
        </motion.p>

        {/* Two columns: form left, links right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <ContactForm />
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col justify-between"
          >
            <div>
              <p
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] mb-6"
                style={{ color: "var(--color-text-muted)" }}
              >
                Find me on
              </p>

              <ul className="flex flex-col gap-5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      className="group flex items-baseline gap-3 transition-colors duration-200"
                    >
                      <span
                        className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] w-20 sm:w-24 flex-shrink-0"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {link.type}
                      </span>
                      <span
                        className="text-sm sm:text-base font-medium group-hover:text-[var(--color-accent)] transition-colors duration-200"
                        style={{ color: "var(--color-text)" }}
                      >
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Small note */}
            <p
              className="text-xs mt-10 lg:mt-0"
              style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
            >
              I typically reply within a day or two.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !message) {
      setErrorMsg("Email and message are required.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Message from ${name || email}`,
          message,
          from: email,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data?.error || "Failed to send");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error");
    }
    setTimeout(() => setStatus("idle"), 3500);
  }

  const inputClass =
    "neubrutalism-input w-full px-3 py-2.5 text-sm sm:text-base focus:outline-none";

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <label
          className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] block mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className={inputClass}
          placeholder="Your name"
          style={{ color: "var(--color-text)" }}
        />
      </div>

      <div>
        <label
          className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] block mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          style={{ color: "var(--color-text)" }}
          required
        />
      </div>

      <div>
        <label
          className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] block mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="What's on your mind?"
          style={{ color: "var(--color-text)" }}
          required
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="neubrutalism-button px-6 py-2.5 text-sm font-medium disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-button-text)",
            borderColor: "var(--color-text)",
          }}
        >
          {status === "loading" ? "Sending..." : "Send message"}
        </button>
        {status === "success" && (
          <span className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
            Sent
          </span>
        )}
        {status === "error" && (
          <span className="text-sm font-medium" style={{ color: "var(--color-error)" }}>
            {errorMsg}
          </span>
        )}
      </div>
    </form>
  );
}
