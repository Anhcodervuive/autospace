'use client'

import { IconSearch } from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState, useTransition } from 'react'

interface QuerySearchInputProps {
    value: string
    paramName?: string
    placeholder?: string
    resetParams?: string[]
}

export const QuerySearchInput = ({
    value,
    paramName = 'q',
    placeholder = 'Search',
    resetParams = ['page'],
}: QuerySearchInputProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [inputValue, setInputValue] = useState(value)
    const [, startTransition] = useTransition()

    useEffect(() => {
        setInputValue(value)
    }, [value])

    const updateQuery = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const params = new URLSearchParams(searchParams.toString())
        const normalizedValue = inputValue.trim()

        if (normalizedValue) {
            params.set(paramName, normalizedValue)
        } else {
            params.delete(paramName)
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
    }

    return (
        <form
            onSubmit={updateQuery}
            className="flex justify-start items-center gap-2 w-full max-w-xl rounded-full shadow-xl bg-white px-4"
        >
            <IconSearch />
            <input
                placeholder={placeholder}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="flex-grow py-4 bg-transparent"
            />
            <button type="submit" className="sr-only">
                Search
            </button>
        </form>
    )
}
