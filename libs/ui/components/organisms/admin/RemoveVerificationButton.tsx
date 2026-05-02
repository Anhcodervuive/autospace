'use client'

import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import {
    RemoveVerificationDocument,
} from '@autospace/network/src/gql/generated'
import { Button } from '../../atoms/Button'

export const RemoveVerificationButton = ({
    garageId,
}: {
    garageId: number
}) => {
    const router = useRouter()
    const [removeVerification, { loading }] = useMutation(
        RemoveVerificationDocument,
        {
            onCompleted: () => {
                router.refresh()
            }
        }
    )

    return (
        <Button
            size="none"
            variant="text"
            loading={loading}
            className="font-semibold"
            onClick={async () => {
                await removeVerification({
                    variables: {
                        where: {
                            garageId,
                        },
                    },
                })
            }}
        >
            Unlist
        </Button>
    )
}