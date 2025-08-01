// Simple in-memory token-bucket rate limiter.  Works for a single Next.js
// server instance.  For multi-instance deployments, replace with Redis or
// another shared store.
//
// Example usage in a route:
//   const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
//   const { allowed } = rateLimit(ip, 60, 60_000) // 60 req / minute
//   if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

const buckets = new Map<string, { tokens: number; reset: number }>()

export function rateLimit(
  key: string,
  maxRequests = 60,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { tokens: 1, reset: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (bucket.tokens >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  bucket.tokens += 1
  return { allowed: true, remaining: maxRequests - bucket.tokens }
}
