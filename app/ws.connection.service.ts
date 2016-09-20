/*
 Service to talk to the websocket server.
 */
import {Injectable} from '@angular/core'
import * as Rx from 'rxjs/Rx'


@Injectable()
export class WsConnectionService {
    public host: string
    public port: number

    private connection: WebSocket
    private error: any

    public observables: any

    constructor() {
        this.connection = null

        this.host = "162.243.199.109"
        this.port = 2999
        console.info("Starting WsConnectionService.")

        this.observables = {
            connected: new Rx.Subject(),  // true or false on connect/disconnect. This is a hot stream.
            data: new Rx.Subject(), // Relay data from the server to the app's services. This is a hot stream.
        }

        this.observables.error = this.observables.data.filter((x) => x && x.error != null)
        // Error handling/logging should be in its own service
        this.error = this.observables.error.subscribe((error) => console.error("Error: " + error.error))
    }

    connect = () => {
        return new Promise((resolve, reject) => {
                if (this.connection) {
                    console.info("WsConnectionService.connect: Already connected.")
                    this.observables.connected.next(true)
                    resolve()
                    return
                }

                try {
                    let connectionString = `ws://${this.host}:${this.port}`
                    console.info("Connecting to " + connectionString)
                    this.connection = new WebSocket(connectionString)
                } catch (error) {
                    console.error("Caught an error while trying to connect to the server: ", error)
                    reject(error)
                    return
                }

                this.connection.onmessage = (event) => {
                    let json: any
                    try {
                        json = JSON.parse(event.data)
                    } catch (error) {
                        console.error("Error receiving data: ", error)
                        return
                    }

                    this.observables.data.next(json)
                }

                this.connection.onerror = (error) => {
                    this.observables.data.next({
                        error: error
                    })
                    console.error("WebSocket Error: ", error)
                }

                this.connection.onclose = () => {
                    this.observables.connected.next(false)
                    this.connection = null
                    console.info("WebSocket closed.")
                }

                this.connection.onopen = () => {
                    console.info("WebSocket opened.")
                    this.observables.connected.next(true)
                    resolve()
                }

                setTimeout(() => {
                    reject()
                }, 10000)
            }
        )
    }

    disconnect = () => {
        if (this.connection)
            this.connection.close()
    }

    getAgent = (uuid) => this.send({
        command: "agent",
        uuid: uuid
    })

    getRooms = () => this.send({command: "rooms"})

    send = (data: any) => {
        let json: string
        try {
            json = JSON.stringify(data)
        } catch (error) {
            console.error("send: JSON.stringify failed:", error.message)
            return
        }

        if (this.connection)
            this.connection.send(json)
        else
            console.error("Cannot sent to server because not connected: ", json)
    }
}


