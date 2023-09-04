import React from 'react'
import Granulometria from '../granulometria'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database'
import { granulometriaDefaultData } from '.././data/granulometria-default-data'
import { IGranulometriaInput } from '../types/granulometria-types'

async function getDataFromSupabase(id: string) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect('/user/not-found')
  }

  const { data: granulometriaData, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.log(error)
    return granulometriaDefaultData
  }

  return granulometriaData.data
}

const Page = async ({ params }: { params: { id: string } }) => {
  const id = params.id
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect('/user/not-found')
  }

  const asdf = await getDataFromSupabase(id)

  return (
    <div className="w-full flex justify-center">
      <Granulometria initialData={asdf as IGranulometriaInput[]} />
    </div>
  )
}

export default Page
