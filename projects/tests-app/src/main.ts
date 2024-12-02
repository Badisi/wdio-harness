import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideNativeDateAdapter } from '@angular/material/core';

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideNativeDateAdapter()
    ]
}).catch(err => console.error(err));
