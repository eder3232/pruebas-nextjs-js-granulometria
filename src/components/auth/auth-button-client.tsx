'use client'
import { Button } from '@/components/ui/button'
import {
  type Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Props {
  session: Session | null
}

const AuthGoogleButtonClient = ({ session }: Props) => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div>
      {session === null ? (
        <Button color="primary" onClick={handleSignIn}>
          Ingresa
        </Button>
      ) : (
        <Button color="primary" onClick={handleSignOut}>
          Cerrar sesión
        </Button>
      )}
    </div>
  )
}

export default AuthGoogleButtonClient
