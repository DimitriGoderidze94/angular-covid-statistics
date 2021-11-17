import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-boxes',
  templateUrl: './info-boxes.component.html',
  styleUrls: ['./info-boxes.component.css'],
})
export class InfoBoxesComponent implements OnInit {
  @Input() text!: string;
  @Input() label!: string;
  constructor() {}

  ngOnInit(): void {}
}
