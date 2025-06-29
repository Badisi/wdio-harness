
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [
        MatButton,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
    ]
})
export class AppComponent {
    public foods: string[] = ['Steak', 'Pizza', 'Tacos'];
    public message: string = '';
}
