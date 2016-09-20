///<reference path="agent.ts"/>

import {Component} from '@angular/core'
import {RoomSummaryService} from "./room.summary.service"
import {RoomSummary} from "./room.summary"
import {WsConnectionService} from "./ws.connection.service"
import * as Rx from 'rxjs/Rx'

@Component({
    selector: 'my-app',
    styleUrls: ['app/app.component.css'],
    templateUrl: 'app/app.component.html'
})

export class AppComponent {
    public data: RoomSummary[]

    constructor(private roomSummary: RoomSummaryService, private server: WsConnectionService) {
        this.data = []

        // When the room summary generator says it has data available, show it on the screen.
        this.server.observables.data.debounce(
            x => Rx.Observable.timer(700)
        ).subscribe(
            (data) => this.data = roomSummary.load()
        )

        this.server.connect()
    }
}

