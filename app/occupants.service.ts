import {Injectable} from '@angular/core'
import {WsConnectionService} from "./ws.connection.service"

@Injectable()
export class OccupantsService {
    private cache: any

    constructor(private server: WsConnectionService) {
        console.info("Starting OccupantService.")
        this.clearCache()
        this.subscribe()
    }

    private clearCache = () => {
        this.cache = new Map<string, any>()
    }

    public connected = () => {
        this.server.send({command: "occupants"})
    }

    public getData = (): any[] => {
        return Array.from(this.cache.values())
    }

    private subscribe = () => {
        this.server.observables.connected.subscribe(() => this.connected())

        let observable = this.server.observables.data.filter((x) => x && x.occupant != null)
        observable.subscribe(
            (data) => this.update(data),
            (error) => console.error("OccupantService.subscription encountered an error: ", error),
            () => console.error("OccupantService.subscription should never complete but received a completion.")
        )
    }

    private update = (data) => {
        if (data.delete != null) {
            this.cache.delete(data.delete)
            return
        }

        this.cache.set(data.occupant._id, data.occupant)

        // Request agent data from the server.
        let command = {
            command: "agent",
            uuid: data.occupant.agent
        }
        this.server.send(command)
    }
}
