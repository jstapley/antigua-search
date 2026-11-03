import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** A chainable stub that resolves to empty data when no credentials are set. */
function makeStub(isSingle = false): Promise<{ data: unknown; error: null }> & Record<string, unknown> {
  const resolved = Promise.resolve({ data: isSingle ? null : [], error: null })
  return new Proxy(resolved, {
    get(target, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (target as any)[prop].bind(target)
      }
      if (prop === 'single') return () => makeStub(true)
      return () => makeStub(isSingle)
    },
  }) as Promise<{ data: unknown; error: null }> & Record<string, unknown>
}

function makeStubClient() {
  return {
    from: () => makeStub(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: null,
        error: { message: 'No Supabase credentials configured. Add them to .env.local.' },
      }),
      signOut: async () => ({ error: null }),
    },
  } as unknown as ReturnType<typeof createServerClient>
}

export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return makeStubClient()
  }

  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server component — cookies can't be set here
        }
      },
    },
  })
}
