import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'roomDate'})
export class RoomDatePipe implements PipeTransform {
    transform(value: any): string {
        if (!value) return ""

        try {
            let date = new Date(value)
            return date.toLocaleDateString()
        } catch (e) {
            return ""
        }
    }
}