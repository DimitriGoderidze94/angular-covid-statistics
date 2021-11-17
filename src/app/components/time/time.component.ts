import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
})
export class TimeComponent implements OnInit {
  chosenDate = new Date().toISOString().slice(0, 10);
  @Output() dateChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onChange() {
    this.dateChange.emit();
  }
}
