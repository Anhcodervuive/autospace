'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Tab, Tabs } from './Tabs'

interface QueryTabItem {
    label: string
    value: string
}

interface QueryTabsProps {
    items: QueryTabItem[]
    value: string
    paramName?: string
    defaultValue?: string
    resetParams?: string[]
}

export const QueryTabs = ({
    items,
    value,
    paramName = 'tab',
    defaultValue,
    resetParams = [],
}: QueryTabsProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()

    return (
        <Tabs
            value={value}
            onChange={(_, nextValue) => {
                const params = new URLSearchParams(searchParams.toString())

                if (defaultValue && nextValue === defaultValue) {
                    params.delete(paramName)
                } else {
                    params.set(paramName, String(nextValue))
                }

                for (const resetParam of resetParams) {
                    params.delete(resetParam)
                }

                const query = params.toString()

                startTransition(() => {
                    router.push(query ? `${pathname}?${query}` : pathname, {
                        scroll: false,
                    })
                })
            }}
            aria-label={paramName}
        >
            {items.map((item) => (
                <Tab key={item.value} label={item.label} value={item.value} />
            ))}
        </Tabs>
    )
}
