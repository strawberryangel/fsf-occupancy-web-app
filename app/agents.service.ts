import {Injectable} from '@angular/core'
import {WsConnectionService} from "./ws.connection.service"

@Injectable()
export class AgentsService {
    private cache: any

    constructor(private server: WsConnectionService) {
        console.info("Starting AgentsService.")
        this.clearCache()
        this.subscribe()
    }

    private clearCache = () => {
        this.cache = new Map<string, any>()
    }

    public connected = () => {
        // This server is passive, acting as a cache for agent data that other servers request.
    }

    public getData = () => {
        return this.cache
    }

    private subscribe = () => {
        this.server.observables.connected.subscribe(() => this.connected())

        let observable = this.server.observables.data.filter((x) => x && x.agent != null)
        observable.subscribe(
            (data) => this.update(data),
            (error) => console.error("AgentsService.subscription encountered an error: ", error),
            () => console.error("AgentsService.subscription should never complete but received a completion.")
        )
    }

    private update = (data) => {
        if (data.delete != null) {
            this.cache.delete(data.delete)
            return
        }

        this.cache.set(data.agent.uuid, data.agent)
    }
}