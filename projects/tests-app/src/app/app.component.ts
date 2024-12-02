import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        NgFor, MatLabel, MatButton, MatSelect, MatInput, MatFormField, MatOption,
        FormsModule, MatDatepickerModule
    ]
})
export class AppComponent {
    public foods: string[] = ['Steak', 'Pizza', 'Tacos'];
    public message: string = '';
}
