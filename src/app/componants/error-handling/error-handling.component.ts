import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';


@Component({
    selector: 'app-error-handling',
    templateUrl: './error-handling.component.html',
    styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {

    @Output() retryEmitter = new EventEmitter<any>();
    constructor(public resources: ResourcesService) { }

    message: string;
    buttonText = "Retry"

    ngOnInit() {
    }
    retry() {
        this.retryEmitter.emit(null)
    }
}
 