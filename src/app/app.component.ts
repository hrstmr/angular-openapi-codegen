import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { operations, paths } from '../../petstore';

const paths: paths = null!;
const storeOrder = paths['/store/order/{orderId}'];
type StoreOrderVerbs = keyof typeof storeOrder;
type StoreOrder = 'get' extends StoreOrderVerbs ? 'yes' : 'no';

type pathStrings = keyof paths;
type hasGetVerb<verb, path> = 'get' extends verb ? path : verb;
type hasGet<T extends keyof paths> = T extends T
    ? 'get' extends keyof paths[T]
        ? T
        : never
    : never;

type getPaths = sd;

const getPaths: getPaths = '/store/order';

type x = keyof StoreOrder extends 'post' ? 'yes' : 'no';
type gets = hasGet<pathStrings>;

const x: gets = '/store/order/{orderId}';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    http = inject(HttpClient);
    title = 'angular-openapi-codgen';

    abc() {}

    test(paths: paths, operations: operations) {}
}
