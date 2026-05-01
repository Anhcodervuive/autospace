import { BaseComponent } from '@autospace/util/types'
import Image from 'next/image'

type HeaderUser = {
    uid: string
    name?: string | null
    email?: string | null
    image?: string | null
}

type UserInfoProps = BaseComponent & {
    user: HeaderUser
}

export const UserInfo = ({ children, className, user }: UserInfoProps) => {
    const image = user.image
    const name = user.name
    const uid = user.uid

    return (
        <div className={`flex gap-2 ${className}`}>
            {image ? (
                <Image
                    src={image}
                    alt={name || 'User avatar'}
                    width={300}
                    height={300}
                    className="w-16 h-16 object-cover border"
                />
            ) : (
                <div className="flex items-center justify-center w-16 h-16 border bg-gray-100 text-lg font-semibold">
                    {(name || uid || '?').slice(0, 1).toUpperCase()}
                </div>
            )}
            <div>
                <div>{name}</div>
                <div className="text-sm text-gray">{uid}</div>
            </div>
            {children}
        </div>
    )
}
