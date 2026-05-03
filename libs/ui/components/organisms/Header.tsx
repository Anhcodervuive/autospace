'use client'

import { BaseComponent, MenuItem, Role } from '@autospace/util/types'
import { Brand } from '../atoms/Brand'
import { Container } from '../atoms/Container'
import Link from 'next/link'
import { Button } from '../atoms/Button'
import { NavSidebar } from './NavSidebar'
import { Menus } from './Menus'
import { useSession } from 'next-auth/react'

type HeaderUser = {
    uid?: string | null
    name?: string | null
    email?: string | null
    image?: string | null
}

export type IHeaderProps = {
    type?: Role
    menuItems: MenuItem[]
    user?: HeaderUser | null
} & BaseComponent

export const Header = ({ type, menuItems, user }: IHeaderProps) => {
    const { data: session, status } = useSession()
    const resolvedUser = (session?.user as HeaderUser | undefined) ?? user
    const uid = resolvedUser?.uid
    const isSessionLoading = status === 'loading' && !uid

    return (
        <header>
            <nav className="fixed z-40 top-0 w-full shadow-md bg-white/50 backdrop-blur-md">
                <Container className="relative   flex items-center justify-between h-16 py-2 gap-16">
                    <Link href="/" aria-label="Home" className="w-auto z-50">
                        <Brand type={type} className="hidden h-10 sm:block" />
                        <Brand type={type} shortForm className="block sm:hidden" />
                    </Link>
                    <div className="flex items-center gap-2">
                        {uid ? (
                            <div className="flex gap-6 items-center">
                                <div className="text-sm mr-6 flex gap-3">
                                    <Menus menuItems={menuItems} />
                                </div>

                                <NavSidebar menuItems={menuItems} user={{ ...resolvedUser, uid }} />
                            </div>
                        ) : isSessionLoading ? (
                            <div className="flex items-center gap-2" aria-label="Loading session">
                                <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse" />
                                <div className="h-9 w-20 rounded-md bg-gray-200 animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <Link href="/register">
                                    <Button variant="outlined" className="hidden md:block">
                                        Register
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button>Log in</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </Container>
            </nav>
            <div className="h-16" />
        </header>
    )
}
