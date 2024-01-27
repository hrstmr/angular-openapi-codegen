import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetPaths, PostPaths, Response, GetOptions, PostOptions } from './api.types';

@Injectable({ providedIn: 'root' })
export class PetApiService {
    #http = inject(HttpClient);
    #baseUrl = 'https://petstore3.swagger.io/api/v3' as const;

    get<Path extends GetPaths>(url: Path, opt: GetOptions<Path>) {
        return this.#http.get<Response<Path, 'get'>>(this.#baseUrl + url, opt);
    }

    post<Path extends PostPaths>(url: Path, opt: PostOptions<Path>) {
        const { body, pathParams, queryParams } = opt;
        opt.params = queryParams;
        let requestPath: string = url;
        Object.entries(pathParams ?? {}).forEach(([key, value]) => {
            if (typeof value !== 'bigint' && typeof value !== 'number' && typeof value !== 'string')
                return;
            requestPath = requestPath.replace(`{${key}}`, value.toString());
        });
        return this.#http.post<Response<Path, 'post'>>(
            this.#baseUrl + requestPath,
            body ?? null,
            opt
        );
    }
}
