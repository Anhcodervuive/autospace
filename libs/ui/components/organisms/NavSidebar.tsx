'use client'
import { IconMenu2 } from '@tabler/icons-react'
import { Sidebar } from './Sidebar'
import { useDialogState } from '@autospace/util/hooks/dialog'

import { MenuItem } from '@autospace/util/types'
import { LogoutButton } from '../molecules/LogoutButton'
import { UserInfo } from '../molecules/UserInfo'
import { Menus } from './Menus'

type HeaderUser = {
    uid: string
    name?: string | null
    email?: string | null
    image?: string | null
}

export interface INavSidebarProps {
    menuItems: MenuItem[]
    user: HeaderUser
}

export const NavSidebar = ({ menuItems, user }: INavSidebarProps) => {
    const [open, setOpen] = useDialogState()

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((state) => !state)}
                className="p-2"
                aria-label="Open main menu"
            >
                <IconMenu2 className="w-5 h-5" />
            </button>
            <Sidebar open={open} setOpen={setOpen}>
                <div className="flex flex-col items-start space-y-1">
                    <UserInfo className="mb-4" user={user} />
                    <Menus menuItems={menuItems} />
                </div>
                <div className=" mt-auto">
                    <LogoutButton />
                </div>
            </Sidebar>
        </>
    )
}
