import { WorkerEntrypoint } from "cloudflare:workers";

const EMAIL_RE = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/;

function addressOf(value) {
	if (!value) return "";
	return typeof value === "string" ? value : value.email || "";
}

function clean(value, max) {
	return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export default class Mailer extends WorkerEntrypoint {
	async fetch() {
		return new Response("Not found", { status: 404 });
	}

	/**
	 * @param {{ from: string | {email: string, name?: string}, to: string | {email: string, name?: string},
	 *   replyTo?: string | {email: string, name?: string}, subject: string, text: string, html?: string }} msg
	 * @returns {Promise<{ ok: true, id: string } | { ok: false, error: string }>}
	 */
	async send(msg) {
		const allowedDomains = String(this.env.ALLOWED_FROM_DOMAINS || "")
			.split(",")
			.map((d) => d.trim().toLowerCase())
			.filter(Boolean);

		const from = addressOf(msg?.from).toLowerCase();
		const to = addressOf(msg?.to);
		const replyTo = addressOf(msg?.replyTo);
		const subject = clean(msg?.subject, 200);

		if (!EMAIL_RE.test(from) || !allowedDomains.includes(from.split("@")[1])) {
			return { ok: false, error: "E_FROM_NOT_ALLOWED" };
		}
		if (!EMAIL_RE.test(to)) return { ok: false, error: "E_INVALID_TO" };
		if (replyTo && !EMAIL_RE.test(replyTo)) return { ok: false, error: "E_INVALID_REPLY_TO" };
		if (!subject || !msg?.text) return { ok: false, error: "E_FIELD_MISSING" };

		try {
			const result = await this.env.EMAIL.send({
				from: msg.from,
				to: msg.to,
				...(replyTo ? { replyTo: msg.replyTo } : {}),
				subject,
				text: String(msg.text),
				...(msg.html ? { html: String(msg.html) } : {}),
			});
			return { ok: true, id: result.messageId };
		} catch (err) {
			console.error("send failed", err?.code, err?.message);
			return { ok: false, error: `${err?.code || "E_UNKNOWN"}: ${err?.message || "send failed"}` };
		}
	}
}
