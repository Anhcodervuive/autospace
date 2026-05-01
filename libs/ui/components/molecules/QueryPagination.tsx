'use client'

import { Pagination } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface QueryPaginationProps {
    page: number
    pageSize: number
    totalCount: number
    paramName?: string
}

export const QueryPagination = ({
    page,
    pageSize,
    totalCount,
    paramName = 'page',
}: QueryPaginationProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()
    const totalPages = Math.ceil(totalCount / pageSize)

    if (totalPages <= 1) {
        return null
    }

    return (
        <Pagination
            count={totalPages}
            showFirstButton
            showLastButton
            page={Math.min(page, totalPages)}
            onChange={(_, nextPage) => {
                const params = new URLSearchParams(searchParams.toString())

                if (nextPage <= 1) {
                    params.delete(paramName)
                } else {
                    params.set(paramName, String(nextPage))
                }

                const query = params.toString()

                startTransition(() => {
                    router.push(query ? `${pathname}?${query}` : pathname, {
                        scroll: false,
                    })
                })
            }}
        />
    )
}
