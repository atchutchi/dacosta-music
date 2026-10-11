export function stripeCheckoutAvailable(key: string | undefined, environment: string | undefined) {
  if (!key || !/^(sk|rk)_(test|live)_/.test(key)) return false
  return environment !== 'production' || /^(sk|rk)_live_/.test(key)
}
