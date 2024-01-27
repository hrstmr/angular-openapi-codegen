import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PetApiService } from './pet-api.service';
import { HttpClient } from '@angular/common/http';
import { paths } from '../../petstore';

const baseUrl = 'https://petstore3.swagger.io/api/v3' as const;

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
    http = inject(HttpClient);
    title = 'angular-openapi-codegen';

    abc() {
        this.test();
    }

    getStoreInventory1() {
        return this.api.get('/store/inventory', {});
    }

    getStoreInventory2() {
        const path = '/store/inventory' as const;
        return this.http.get<
            paths[typeof path]['get']['responses']['200']['content']['application/json']
        >(baseUrl + path);
    }

    getStoreOrderById1(orderId: number) {
        return this.api.get('/store/order/{orderId}', {
            pathParams: { orderId },
        });
    }

    getStoreOrderById2({ orderId }: paths['/store/order/{orderId}']['get']['parameters']['path']) {
        const path = `/store/order/${orderId}` as const;

        return this.http.get<
            paths['/store/order/{orderId}']['get']['responses']['200']['content']['application/json']
        >(baseUrl + path);
    }

    UserLogin1(password: string, username: string) {
        return this.api.get('/user/login', {
            queryParams: {
                password,
                username,
            },
        });
    }

    UserLogin2(password: string, username: string) {
        const path = `/user/login` as const;
        return this.http.get<
            paths['/user/login']['get']['responses']['200']['content']['application/json']
        >(baseUrl + path, {
            params: {
                password,
                username,
            } as paths['/user/login']['get']['parameters']['query'],
        });
    }

    test() {
        this.api.get('/store/inventory', {}).subscribe((x) => console.log(x));
        this.api
            .post('/pet', {
                body: {
                    id: 10,
                    name: 'doggie',
                    category: { id: 1, name: 'Dogs' },
                    photoUrls: ['string'],
                    tags: [{ id: 0, name: 'string' }],
                    status: 'available',
                },
            })
            .subscribe((x) => console.log(x));

        this.api
            .post('/pet/{petId}', {
                pathParams: { petId: 1 },
                queryParams: { name: 'doggie', status: 'available' },
            })
            .subscribe((x) => console.log(x));
    }
}
