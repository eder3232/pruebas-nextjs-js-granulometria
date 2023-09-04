// 'use client'

import * as React from 'react'
import Link from 'next/link'

import { Icons } from '@/components/icons/icons'

import { ThemeSwitcher } from './theme-switcher'
import { DropdownMenuEder } from './drowdown-menu'
import { AuthGoogleButtonServer } from '../../auth/auth-button-server'

function Navbar() {
  return (
    <div className="w-full p-2 border-b-2">
      <div className="container flex justify-between items-center">
        <div className="flex gap-x-4 ">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="text-lg font-medium">eder3232</span>
          </Link>
        </div>

        <div className="flex items-center gap-x-2">
          <ThemeSwitcher />
          {/* <Button>Ingresa aquí</Button> */}
          <AuthGoogleButtonServer />
          <DropdownMenuEder />
        </div>
      </div>
    </div>
  )
}

export default Navbar
