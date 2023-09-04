import AuthGoogleButtonClient from './auth-button-client'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function AuthGoogleButtonServer() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <AuthGoogleButtonClient session={session} />
}
