import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {AppComponent} from './app.component'

import {AgentsService} from "./agents.service"
import {OccupantsService} from "./occupants.service"
import {RoomsService} from "./rooms.service"
import {RoomSummaryService} from './room.summary.service'
import {WsConnectionService} from './ws.connection.service'


@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent],
    providers: [
        AgentsService,
        OccupantsService,
        RoomsService,
        RoomSummaryService,
        WsConnectionService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
