import TH1 from '@/components/typography/typography-h1'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const Page = async () => {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect('/user/not-found')
  }

  const image = data.session?.user?.user_metadata?.avatar_url

  return (
    <div className="flex justify-center">
      <div className="container">
        <TH1>Profile</TH1>
        <div>
          <span>Email: </span>
          <span>{data.session?.user?.email}</span>
        </div>
        <div>
          <span>Name: </span>
          <span>{data.session?.user?.user_metadata?.full_name}</span>
        </div>
        <Image alt="profile picture" src={image} width={100} height={100} />
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </div>
    </div>
  )
}

export default Page
