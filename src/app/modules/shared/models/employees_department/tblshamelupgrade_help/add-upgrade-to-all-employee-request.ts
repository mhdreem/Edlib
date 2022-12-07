import { ITBLShamelRank } from "../ITBLShamelRank";

export interface AddUpgradeToAllEmployeeRequest {
    auto: number,
    rank: ITBLShamelRank,
    duaration: number,
    year: number,
    user_FK: number
}
