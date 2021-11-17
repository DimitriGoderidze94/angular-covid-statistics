import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '';
  displayElement1 = true;
  displayElement2 = false;
  firsPage() {
    this.displayElement1 = true;
    this.displayElement2 = false;
  }
  secondPage() {
    this.displayElement2 = true;
    this.displayElement1 = false;
  }
}
