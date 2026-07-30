const PERMISSIONS_POLICY = [
  "camera=()",
  "geolocation=()",
  "microphone=()",
  "payment=()",
  "usb=()",
].join(", ");

/**
 * Add response headers that are safe for the current private Sites embedding
 * boundary. A page-level CSP and frame policy require a separate verified
 * integration review, so this helper deliberately does not guess at either.
 *
 * @param {Request} request
 * @param {Response} response
 */
export function withSecurityHeaders(request, response) {
  const headers = new Headers(response.headers);
  headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-DNS-Prefetch-Control", "off");
  if (new URL(request.url).protocol === "https:") {
    headers.set("Strict-Transport-Security", "max-age=31536000");
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
