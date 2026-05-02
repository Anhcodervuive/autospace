'use client'

import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import {
    CreateVerificationDocument,
} from '@autospace/network/src/gql/generated'
import { Button } from '../../atoms/Button'

export const CreateVerificationButton = ({
    garageId,
}: {
    garageId: number
}) => {
    const router = useRouter()
    const [createVerification, { loading }] = useMutation(
        CreateVerificationDocument,
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
            className="font-semibold underline underline-offset-4"
            onClick={async () => {
                await createVerification({
                    variables: {
                        createVerificationInput: {
                            garageId,
                            verified: true,
                        },
                    },
                })
            }}
        >
            Verify
        </Button>
    )
}