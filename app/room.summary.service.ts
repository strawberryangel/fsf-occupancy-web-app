import {Injectable} from '@angular/core'

import {AgentsService} from "./agents.service"
import {OccupantsService} from "./occupants.service"
import {RoomsService} from "./rooms.service"
import {RoomSummary} from "./room.summary"
import {OccupantSummary} from "./occupant.summary"


@Injectable()
export class RoomSummaryService {
    constructor(private agentsService: AgentsService,
                private occupantsService: OccupantsService,
                private roomsService: RoomsService) {
    }

    public assemble = (): RoomSummary[] => {
        // Turn stream of values into a Map.
        let agents = this.agentsService.getData()

        let occupantsValues = this.occupantsService.getData()
        let occupants = occupantsValues.map((x) => {
            return {
                room: x.room,
                agent: agents.get(x.agent) || {uuid: x.agent, username: "unknown", displayName: x.agent},
                when: x.when ? new Date(x.when) : null
            }
        })

        let roomsValues = this.roomsService.getData()
        let rooms = roomsValues.map((r) => {
            return {
                number: r.number,
                name: r.name,
                occupants: occupants.filter((y) => y.room === r.number).sort(
                    (a: OccupantSummary, b: OccupantSummary) => a.agent.username > b.agent.username ? 1 : a.agent.username === b.agent.username ? 0 : -1
                )
            }
        }).sort(
            (a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1
        )

        return rooms
    }

    public load = () => this.assemble()
}


