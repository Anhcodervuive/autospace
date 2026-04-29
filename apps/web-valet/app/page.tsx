'use client'
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn'
import { IsValet } from '@autospace/ui/components/organisms/IsValet'
import { ValetHome } from '@autospace/ui/components/templates/ValetHome'

export default function Home() {
  return (
    <main>
      <IsLoggedIn>
        {(uid) => (
          <IsValet uid={uid}>
            <ValetHome />
          </IsValet>
        )}
      </IsLoggedIn>
    </main>
  )
}