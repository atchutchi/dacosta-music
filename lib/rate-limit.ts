import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

type RateBucket =
  | "emails"
  | "checkout"
  | "webhooks"
  | "products_get"
  | "products_mut"
  | "default"

function resolveBucket(pathname: string, method: string): RateBucket {
  if (pathname.startsWith("/api/emails/")) return "emails"
  if (pathname.startsWith("/api/checkout/")) return "checkout"
  if (pathname.startsWith("/api/webhooks/")) return "webhooks"
  if (pathname.startsWith("/api/products")) {
    return method === "GET" ? "products_get" : "products_mut"
  }
  return "default"
}

function maxForBucket(bucket: RateBucket): number {
  switch (bucket) {
    case "emails":
      return 5
    case "checkout":
      return 10
    case "webhooks":
      return 100
    case "products_get":
      return 60
    case "products_mut":
      return 10
    default:
      return 30
  }
}

const WINDOW_MS = 60_000
const WINDOW_STR = "60 s" as const

let redisSingleton: Redis | null | undefined
function getRedis(): Redis | null {
  if (redisSingleton !== undefined) return redisSingleton
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    redisSingleton = null
    return null
  }
  redisSingleton = new Redis({ url, token })
  return redisSingleton
}

const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(bucket: RateBucket, max: number): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  const cacheKey = `${bucket}:${max}`
  let lim = upstashLimiters.get(cacheKey)
  if (!lim) {
    lim = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, WINDOW_STR),
      prefix: `@dacosta/rl/${bucket}`,
    })
    upstashLimiters.set(cacheKey, lim)
  }
  return lim
}

type MemStore = Map<string, number[]>
function getMemoryStore(): MemStore {
  const g = globalThis as unknown as { __dacostaRateLimit?: MemStore }
  if (!g.__dacostaRateLimit) g.__dacostaRateLimit = new Map()
  return g.__dacostaRateLimit
}

function memorySlidingWindow(key: string, max: number, windowMs: number): boolean {
  const store = getMemoryStore()
  const now = Date.now()
  const arr = (store.get(key) || []).filter((t) => now - t < windowMs)
  if (arr.length >= max) {
    store.set(key, arr)
    return false
  }
  arr.push(now)
  store.set(key, arr)
  return true
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()
  return "unknown"
}

export async function checkApiRateLimit(request: NextRequest): Promise<{ success: boolean }> {
  const pathname = request.nextUrl.pathname
  const method = request.method.toUpperCase()
  const bucket = resolveBucket(pathname, method)
  const max = maxForBucket(bucket)
  const ip = getClientIp(request)
  const id = `${ip}:${bucket}`

  const limiter = getUpstashLimiter(bucket, max)
  if (limiter) {
    const { success } = await limiter.limit(id)
    return { success }
  }

  return { success: memorySlidingWindow(id, max, WINDOW_MS) }
}
