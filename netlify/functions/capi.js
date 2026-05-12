// Meta Conversions API relay.
//
// Receives an event payload from the browser, hashes any provided PII
// per Meta's spec, adds server-side context (IP, UA), and posts to the
// Graph API using the access token from the Netlify env var META_CAPI_TOKEN.
//
// The browser pixel and this CAPI relay share an `event_id` per logical
// event so Meta can deduplicate on its side.
//
// Endpoint: POST /.netlify/functions/capi
// Expected body:
//   {
//     event_name: "Purchase",
//     event_id: "rr_...",          // shared with browser pixel for dedup
//     event_source_url: "https://therizqreset.netlify.app/",
//     user_data: { em, ph, fbp, fbc, ... }, // any PII gets SHA-256 hashed
//     custom_data: { value, currency, content_ids, ... }
//   }

'use strict';

const crypto = require('crypto');

const META_PIXEL_ID = '1028694942816111';
const META_API_VERSION = 'v20.0';
const GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`;

function sha256(value) {
  if (value === undefined || value === null || value === '') return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

function buildUserData(eventUser, headers) {
  const u = eventUser || {};

  // X-Forwarded-For may be a comma-separated list; first value is the client.
  const forwarded = headers['x-forwarded-for'] || headers['client-ip'] || '';
  const clientIp = forwarded.split(',')[0].trim() || undefined;

  return {
    client_ip_address: clientIp,
    client_user_agent: headers['user-agent'],
    em: u.em ? [sha256(u.em)] : undefined,
    ph: u.ph ? [sha256(u.ph)] : undefined,
    fn: u.fn ? [sha256(u.fn)] : undefined,
    ln: u.ln ? [sha256(u.ln)] : undefined,
    fbp: u.fbp,
    fbc: u.fbc,
  };
}

exports.handler = async (event) => {
  // CORS preflight (in case the funnel is ever embedded cross-origin)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'capi_token_missing' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  const incoming = Array.isArray(payload.events) ? payload.events : [payload];
  const headers = event.headers || {};

  const data = incoming
    .filter((e) => e && e.event_name)
    .map((e) => ({
      event_name: e.event_name,
      event_time: e.event_time || Math.floor(Date.now() / 1000),
      event_id: e.event_id,
      event_source_url: e.event_source_url,
      action_source: 'website',
      user_data: buildUserData(e.user_data, headers),
      custom_data: e.custom_data || {},
    }));

  if (data.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'no_events' }) };
  }

  try {
    const res = await fetch(GRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, access_token: token }),
    });
    const result = await res.json();
    return {
      statusCode: res.ok ? 200 : 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'capi_request_failed', detail: String(err) }),
    };
  }
};
