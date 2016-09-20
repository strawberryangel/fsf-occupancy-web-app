import {OccupantSummary} from "./occupant.summary"

export interface RoomSummary {
    number: string
    occupants: OccupantSummary[]
}
