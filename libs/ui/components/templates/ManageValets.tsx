import { AddValet } from '../organisms/AddValet'
import { ListValets } from '../organisms/ListValets'

export const ManageValets = ({ page }: { page: number }) => {
    return (
        <div>
            <div className="flex justify-end">
                <AddValet />
            </div>
            <ListValets page={page} />
        </div>
    )
}
