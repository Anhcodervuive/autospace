export type SearchParamValue = string | string[] | undefined
export type SearchParamsRecord = Record<string, SearchParamValue>

export const getSearchParamValue = (value: SearchParamValue) => {
    if (Array.isArray(value)) {
        return value[0]
    }

    return value
}

export const parsePositiveIntParam = (
    value: SearchParamValue,
    fallback = 1,
) => {
    const normalized = getSearchParamValue(value)
    const parsed = Number(normalized)

    if (!Number.isFinite(parsed) || parsed < 1) {
        return fallback
    }

    return Math.floor(parsed)
}

export const parseEnumParam = <T extends string>(
    value: SearchParamValue,
    allowedValues: readonly T[],
    fallback: T,
) => {
    const normalized = getSearchParamValue(value)

    if (!normalized) {
        return fallback
    }

    return allowedValues.includes(normalized as T) ? (normalized as T) : fallback
}

export const parseStringParam = (value: SearchParamValue, fallback = '') => {
    return getSearchParamValue(value) ?? fallback
}
