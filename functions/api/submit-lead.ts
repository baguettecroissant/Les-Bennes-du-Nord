type Env = {
  MARKETPLACE_INGEST_URL?: string;
  MARKETPLACE_INGEST_KEY?: string;
};

type Context = {
  request: Request;
  env: Env;
};

const buckets = new Map<string, { count: number; resetAt: number }>();
const allowedWaste = new Set(["gravats", "dib", "dechets-verts", "bois"]);
const allowedVolumes = new Set(["8m³", "10m³", "15m³", "30m³"]);
const canonicalOrigins = new Set(["https://les-bennes-du-nord.fr", "https://www.les-bennes-du-nord.fr"]);

function text(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin") || "";
  return canonicalOrigins.has(origin) || /^http:\/\/localhost(?::\d+)?$/.test(origin)
    ? origin
    : "";
}

function cors(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(body: Record<string, unknown>, status: number, origin: string) {
  return Response.json(body, {
    status,
    headers: { ...cors(origin), "Cache-Control": "no-store" },
  });
}

function rateLimited(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export const onRequestOptions = ({ request }: Context) => {
  const origin = allowedOrigin(request);
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: cors(origin) });
};

export const onRequestPost = async ({ request, env }: Context) => {
  const origin = allowedOrigin(request);
  if (!origin) return json({ success: false, error: "Origine non autorisée" }, 403, "null");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ success: false, error: "Format invalide" }, 415, origin);
  }
  if (Number(request.headers.get("content-length") || "0") > 32_768) {
    return json({ success: false, error: "Requête trop volumineuse" }, 413, origin);
  }
  if (rateLimited(request)) {
    return json({ success: false, error: "Trop de demandes" }, 429, origin);
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 32_768) {
    return json({ success: false, error: "Requête trop volumineuse" }, 413, origin);
  }
  const body = (() => {
    try { return JSON.parse(raw) as Record<string, unknown>; } catch { return null; }
  })();
  if (!body) return json({ success: false, error: "Requête invalide" }, 400, origin);
  if (text(body.website, 100)) return json({ success: true }, 200, origin);

  const nom = text(body.nom, 100);
  const prenom = text(body.prenom, 100);
  const email = text(body.email, 180).toLowerCase();
  const telephone = text(body.telephone, 30);
  const adresse = text(body.adresse, 250);
  const ville = text(body.ville, 120);
  const codePostal = text(body.code_postal, 5);
  const volume = text(body.volume, 20);
  const typeDechet = text(body.type_dechet, 40);
  const dateLivraison = text(body.date_livraison, 10);
  const message = text(body.message, 1500);
  const consent = body.consent === true;
  const sourceSubmissionId = text(body.source_submission_id, 80);

  if (
    !nom ||
    !prenom ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    telephone.replace(/\D/g, "").length < 10 ||
    !adresse ||
    !ville ||
    !/^59\d{3}$/.test(codePostal) ||
    !allowedVolumes.has(volume) ||
    !allowedWaste.has(typeDechet) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateLivraison) ||
    !consent ||
    !/^nord-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sourceSubmissionId)
  ) {
    return json({ success: false, error: "Informations invalides" }, 400, origin);
  }
  if (!env.MARKETPLACE_INGEST_URL || !env.MARKETPLACE_INGEST_KEY) {
    return json({ success: false, error: "Service indisponible" }, 503, origin);
  }

  const consentAt = new Date().toISOString();
  const leadFingerprint = await sha256(
    [email, telephone.replace(/\D/g, ""), codePostal, typeDechet, volume, consentAt.slice(0, 10)].join("|"),
  );
  const payload = {
    nom,
    prenom,
    email,
    telephone,
    adresse,
    ville,
    code_postal: codePostal,
    departement: "59",
    profil: "particulier",
    entreprise: "",
    volume,
    type_dechet: typeDechet,
    date_livraison: dateLivraison,
    date_retrait: "",
    message,
    consent: true,
    source_site: "les-bennes-du-nord.fr",
    source_domain: "les-bennes-du-nord.fr",
    source_campaign: "organic-form",
    source_submission_id: sourceSubmissionId,
    consent_marketplace_at: consentAt,
    privacy_policy_version: "2026-07-27",
    lead_fingerprint: leadFingerprint,
  };
  const response = await fetch(env.MARKETPLACE_INGEST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.MARKETPLACE_INGEST_KEY}`,
      "X-Marketplace-Source": "les-bennes-du-nord.fr",
      "Content-Type": "application/json",
      "X-Marketplace-Visitor-Ip": request.headers.get("cf-connecting-ip") || "unknown",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    duplicate?: boolean;
  } | null;
  if (!response.ok || result?.success !== true) {
    return json({ success: false, error: "Enregistrement impossible" }, 502, origin);
  }
  return json(
    { success: true, duplicate: result.duplicate === true },
    result.duplicate ? 200 : 201,
    origin,
  );
};
