const nodemailer = require("nodemailer");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, company, contact, mode, message, website } = body;

  // Honeypot: bots fill hidden "website" field, humans leave it empty.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !contact || !message) {
    return res.status(400).json({ ok: false, error: "Bitte Name, Kontakt und Nachricht ausfuellen." });
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    MAIL_TO,
    MAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
    console.error("Contact form: missing SMTP env vars");
    return res.status(500).json({ ok: false, error: "Mailversand ist aktuell nicht konfiguriert." });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `Neue Anfrage von ${name}${company ? " (" + company + ")" : ""}`;
  const text = [
    `Name: ${name}`,
    `Unternehmen: ${company || "-"}`,
    `Kontakt: ${contact}`,
    `Einsatzart: ${mode || "-"}`,
    "",
    "Nachricht:",
    message,
  ].join("\n");

  const html = `
    <h2>Neue Kontaktanfrage - Powertech Performance</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Unternehmen:</strong> ${escapeHtml(company || "-")}</p>
    <p><strong>Kontakt:</strong> ${escapeHtml(contact)}</p>
    <p><strong>Einsatzart:</strong> ${escapeHtml(mode || "-")}</p>
    <p><strong>Nachricht:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: MAIL_TO,
      replyTo: contact,
      subject,
      text,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form send error", err);
    return res.status(500).json({ ok: false, error: "Anfrage konnte nicht gesendet werden." });
  }
};
