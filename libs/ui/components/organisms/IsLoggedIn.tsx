import { getAuth } from '@autospace/network/src/config/authOptions'
import { ReactNode } from 'react'
import { AlertSection } from '../molecules/AlertSection'
import Link from 'next/link'

type RenderPropChild = (uid: string) => ReactNode
type AuthUser = {
    uid: string
    name?: string | null
    email?: string | null
    image?: string | null
}

export const IsLoggedIn = async ({
    children,
    notLoggedIn,
}: {
    children: RenderPropChild | ReactNode
    notLoggedIn?: ReactNode
}) => {
    const session = await getAuth()
    const user = session?.user as AuthUser | undefined

    if (!user?.uid) {
        if (notLoggedIn) {
            return <>{notLoggedIn}</>
        } else {
            return (
                <AlertSection title="You are not logged in.">
                    <Link href="/login">Login</Link>
                </AlertSection>
            )
        }
    }

    return (
        <>
            {typeof children === 'function'
                ? (children as RenderPropChild)(user.uid)
                : children}
        </>
    )
}
