import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { onRequest } from "../functions/_middleware.ts";
import { onRequestPost } from "../functions/api/submit-lead.ts";

const form = readFileSync(new URL("../src/components/StepsForm.astro", import.meta.url), "utf8");
const adapter = readFileSync(new URL("../functions/api/submit-lead.ts", import.meta.url), "utf8");

test("Nord submits only through its same-origin server adapter", () => {
  assert.doesNotMatch(form, /submit_benne_lead/);
  assert.doesNotMatch(form, /supabaseUrl|supabaseKey|apikey/i);
  assert.match(form, /fetch\('\/api\/submit-lead'/);
  assert.match(form, /name="consent"[^>]*required/);
});

test("Nord adapter forwards a strict authenticated source contract", () => {
  assert.doesNotMatch(adapter, /SUPABASE|\/rest\/v1/);
  assert.match(adapter, /MARKETPLACE_INGEST_URL/);
  assert.match(adapter, /MARKETPLACE_INGEST_KEY/);
  assert.match(adapter, /Access-Control-Allow-Origin/);
  assert.match(adapter, /https:\/\/les-bennes-du-nord\.fr/);
  for (const field of ["source_site", "source_domain", "source_campaign", "source_submission_id", "consent_marketplace_at", "privacy_policy_version", "lead_fingerprint"]) {
    assert.match(adapter, new RegExp(`${field}:`));
  }
});

const validLead = (overrides = {}) => ({
  nom: "Martin", prenom: "Alice", email: "alice@example.test",
  telephone: "0612345678", adresse: "10 rue Exemple", ville: "Lille",
  code_postal: "59000", volume: "8m³", type_dechet: "bois",
  date_livraison: "2026-08-20", message: "", consent: true,
  source_submission_id: "nord-550e8400-e29b-41d4-a716-446655440000",
  ...overrides,
});

test("Nord borne le corps réellement lu même sans Content-Length", async () => {
  const response = await onRequestPost({
    request: new Request("https://les-bennes-du-nord.fr/api/submit-lead", {
      method: "POST",
      headers: { Origin: "https://les-bennes-du-nord.fr", "Content-Type": "application/json" },
      body: JSON.stringify({ padding: "x".repeat(33_000) }),
    }),
    env: {},
  });
  assert.equal(response.status, 413);
});

test("Nord conserve l'identifiant aléatoire du navigateur et transmet l'IP Cloudflare", async () => {
  let forwarded;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    forwarded = { body: JSON.parse(init.body), headers: new Headers(init.headers) };
    return Response.json({ success: true });
  };
  try {
    const response = await onRequestPost({
      request: new Request("https://les-bennes-du-nord.fr/api/submit-lead", {
        method: "POST",
        headers: { Origin: "https://les-bennes-du-nord.fr", "Content-Type": "application/json", "cf-connecting-ip": "192.0.2.45" },
        body: JSON.stringify(validLead()),
      }),
      env: { MARKETPLACE_INGEST_URL: "https://central.example/api", MARKETPLACE_INGEST_KEY: "test-key" },
    });
    assert.equal(response.status, 201);
    assert.equal(forwarded.body.source_submission_id, validLead().source_submission_id);
    assert.equal(forwarded.headers.get("x-marketplace-visitor-ip"), "192.0.2.45");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Nord redirige www vers l'apex canonique en conservant chemin et requête", async () => {
  const next = async () => new Response("unexpected");
  const response = await onRequest({
    request: new Request(
      "https://www.les-bennes-du-nord.fr/location-benne-lille?source=test",
    ),
    next,
  });

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://les-bennes-du-nord.fr/location-benne-lille?source=test",
  );
});
