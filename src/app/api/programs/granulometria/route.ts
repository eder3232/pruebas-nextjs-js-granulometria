import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const obj = await request.json()

  // get supabase instance
  const supabase = createRouteHandlerClient({ cookies })

  //get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  //insert a new row into the table

  const { data, error } = await supabase
    .from('calculations')
    .insert({
      user_id: session?.user.id,
      data: obj.data,
      type: '711ea959-7ad0-4260-a279-e5f91a5bc79f',
    })
    .select()
    .single()

  return NextResponse.json({ data, error })
}
