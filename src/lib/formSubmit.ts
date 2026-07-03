// Shared client-side submit helper for every VOR form.
// Posts the canonical contact-form contract to the shared Cloudflare Worker
// (site-infra/forms-worker). The Worker derives `site` from the Origin, so no
// `site` field is sent. See forms-worker/CONTRACT.md.

export const FORMS_ENDPOINT = 'https://forms-worker.troysybert.workers.dev/submit';

export interface SubmitInput {
  name: string;
  email: string;
  organization?: string | null;
  message?: string | null;
  /** Sub-surface tag: 'contact' | 'selah' | 'am-i-saved' | 'ai-ministry'. */
  source: string;
  /** Optional structured extras (e.g. am-i-saved reflections). */
  metadata?: unknown;
  /** Honeypot field value (bots fill it; humans leave it empty). */
  website?: string;
  /** Cloudflare Turnstile token (the hidden cf-turnstile-response input). */
  token: string | null;
}

/** Read the Turnstile token + honeypot from a form and POST the canonical body. */
export function submitForm(form: HTMLFormElement, input: Omit<SubmitInput, 'token' | 'website'>): Promise<Response> {
  const token = (form.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || null;
  const website = (form.querySelector('[name="website"]') as HTMLInputElement | null)?.value ?? '';
  return fetch(FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      organization: input.organization ?? null,
      message: input.message ?? null,
      source: input.source,
      metadata: input.metadata ?? null,
      website,
      cf_turnstile_response: token,
    }),
  });
}
