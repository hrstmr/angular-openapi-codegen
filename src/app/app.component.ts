import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PetApiService } from './pet-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [HttpClient],
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    api = inject(PetApiService);
    title = 'angular-openapi-codgen';

    abc() {
        this.test();
    }

    test() {
        this.api.get('/store/inventory').subscribe((x) => console.log(x));
    }
}
