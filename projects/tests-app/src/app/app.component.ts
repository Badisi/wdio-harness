import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent {
    public foods: string[] = ['Steak', 'Pizza', 'Tacos'];
    public message: string = '';
}
