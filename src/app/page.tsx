import TH1 from '@/components/typography/typography-h1'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/shared/navbar/theme-switcher'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="bg-background">
      <h1>eder!</h1>
      <Button>hostia!</Button>
      {/* <ThemeSwitcher />
      <TH1 className="text-primary">eder el mas gosu! raaa</TH1> */}
    </main>
  )
}
