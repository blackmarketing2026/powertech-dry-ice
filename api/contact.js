const nodemailer = require("nodemailer");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toWhatsappDigits(phone) {
  return String(phone).replace(/[^\d+]/g, "").replace(/^00/, "+").replace(/^(?!\+)/, "+49");
}

const LOGO_URL = "https://powertech-dry-ice.vercel.app/assets/powertech-logo.png";

function buildEmailHtml({ name, company, email, phone, mode, message }) {
  const waNumber = toWhatsappDigits(phone).replace("+", "");
  const telHref = `tel:${toWhatsappDigits(phone)}`;
  const waHref = `https://wa.me/${waNumber}`;
  const mailHref = `mailto:${email}`;

  return `
  <!doctype html>
  <html>
  <body style="margin:0;padding:0;background:#02050a;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#02050a;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#07111e;border:1px solid #143247;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#0a1b2c,#06101c);padding:26px 32px;text-align:center;border-bottom:1px solid #143247;">
                <img src="${LOGO_URL}" alt="Powertech Performance" width="120" style="display:block;margin:0 auto 8px;">
                <div style="color:#eaf9ff;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:bold;">Powertech Performance</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <h1 style="margin:0 0 6px;color:#ffffff;font-size:22px;letter-spacing:.02em;">Neue Anfrage: Dry-Ice Powertech</h1>
                <p style="margin:0 0 22px;color:#a9bfd0;font-size:14px;line-height:1.6;">Ueber das Kontaktformular auf der Website ist eine neue Anfrage eingegangen.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a1b2c;border:1px solid #143247;border-radius:8px;">
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #143247;">
                      <div style="color:#20c8ff;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">Name</div>
                      <div style="color:#eaf9ff;font-size:15px;margin-top:4px;">${escapeHtml(name)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #143247;">
                      <div style="color:#20c8ff;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">Unternehmen</div>
                      <div style="color:#eaf9ff;font-size:15px;margin-top:4px;">${escapeHtml(company || "-")}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #143247;">
                      <div style="color:#20c8ff;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">E-Mail</div>
                      <div style="color:#eaf9ff;font-size:15px;margin-top:4px;">${escapeHtml(email)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #143247;">
                      <div style="color:#20c8ff;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">Telefon</div>
                      <div style="color:#eaf9ff;font-size:15px;margin-top:4px;">${escapeHtml(phone)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #143247;">
                      <div style="color:#20c8ff;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">Einsatzart</div>
                      <div style="color:#eaf9ff;font-size:15px;margin-top:4px;">${escapeHtml(mode || "-")}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="color:#20c8ff;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">Nachricht</div>
                      <div style="color:#eaf9ff;font-size:15px;margin-top:4px;line-height:1.6;">${escapeHtml(message).replace(/\n/g, "<br>")}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <div style="color:#a9bfd0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Direkt Kontakt aufnehmen</div>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="33%" style="padding-right:6px;">
                      <a href="${waHref}" style="display:block;text-align:center;background:#25D366;color:#ffffff;font-weight:bold;font-size:13px;text-decoration:none;padding:12px 6px;border-radius:6px;">WhatsApp</a>
                    </td>
                    <td width="33%" style="padding:0 6px;">
                      <a href="${telHref}" style="display:block;text-align:center;background:linear-gradient(135deg,#20c8ff,#026dff);color:#02050a;font-weight:bold;font-size:13px;text-decoration:none;padding:12px 6px;border-radius:6px;">Anrufen</a>
                    </td>
                    <td width="33%" style="padding-left:6px;">
                      <a href="${mailHref}" style="display:block;text-align:center;background:#0a1b2c;border:1px solid #20c8ff;color:#eaf9ff;font-weight:bold;font-size:13px;text-decoration:none;padding:11px 6px;border-radius:6px;">E-Mail</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 30px;border-top:1px solid #143247;margin-top:20px;">
                <div style="color:#5a7488;font-size:11px;line-height:1.6;">
                  Powertech Performance &middot; Benjamin Lemmer &middot; An der Klinge 10, 99095 Erfurt<br>
                  Diese E-Mail wurde automatisch ueber das Kontaktformular auf der Website generiert.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, company, email, phone, mode, message, website } = body;

  // Honeypot: bots fill hidden "website" field, humans leave it empty.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ ok: false, error: "Bitte Name, E-Mail, Telefon und Nachricht ausfuellen." });
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

  const subject = "Anfrage dry-ice Powertech";
  const text = [
    `Name: ${name}`,
    `Unternehmen: ${company || "-"}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    `Einsatzart: ${mode || "-"}`,
    "",
    "Nachricht:",
    message,
  ].join("\n");

  const html = buildEmailHtml({ name, company, email, phone, mode, message });

  try {
    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: MAIL_TO,
      replyTo: email,
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
