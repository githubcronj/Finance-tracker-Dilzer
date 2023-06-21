import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  transparent = false;

  constructor(public resources: ResourcesService) { }

  ngOnInit() {
  }

}
