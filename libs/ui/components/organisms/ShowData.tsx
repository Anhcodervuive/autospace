import { AlertSection } from '../molecules/AlertSection'
import { QueryPagination } from '../molecules/QueryPagination'
import { NoResults } from '../molecules/NoResults'

interface ShowDataProps {
    error?: string
    resultCount: number
    pagination?: {
        page: number
        pageSize: number
        resultCount?: number
        totalCount?: number
        paramName?: string
    }
    title?: React.ReactNode
    children: React.ReactNode
    childrenClassName?: string
}

export const ShowData = ({
    error,
    resultCount,
    pagination,
    title,
    children,
    childrenClassName = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3',
}: ShowDataProps) => {
    return (
        <div>
            <h2 className="text-lg mb-1 font-semibold mt-2">{title}</h2>
            {!error && resultCount === 0 && <NoResults />}

            {error && (
                <AlertSection>
                    Oops. Something went wrong.{' '}
                    <span className="text-xs">Psst. {error}</span>
                </AlertSection>
            )}

            <div className={childrenClassName}>{children}</div>
            <div className="flex justify-center mt-8">
                {pagination?.totalCount ? (
                    <QueryPagination
                        page={pagination.page}
                        pageSize={pagination.pageSize}
                        totalCount={pagination.totalCount}
                        paramName={pagination.paramName}
                    />
                ) : null}
            </div>
        </div>
    )
}
