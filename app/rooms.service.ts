import {Injectable} from '@angular/core'
import {WsConnectionService} from "./ws.connection.service"

@Injectable()
export class RoomsService {
    private cache: any

    constructor(private server: WsConnectionService) {
        console.info("Starting RoomsService.")
        this.clearCache()
        this.subscribe()
    }

    private clearCache = () => {
        this.cache = new Map<string, any>()
    }

    public connected = () => {
        this.server.send({command: "rooms"})
    }

    public getData = (): any[] => {
        return Array.from(this.cache.values())
    }

    private subscribe = () => {
        this.server.observables.connected.subscribe(() => this.connected())

        let observable = this.server.observables.data.filter((x) => x && x.room != null)
        observable.subscribe(
            (data) => this.update(data),
            (error) => console.error("RoomsService.subscription encountered an error: ", error),
            () => console.error("RoomsService.subscription should never complete but received a completion.")
        )
    }

    private update = (data) => {
        if (data.delete != null) {
            this.cache.delete(data.delete)
            return
        }

        this.cache.set(data.room._id, data.room)
    }
}