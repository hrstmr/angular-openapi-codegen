import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { paths } from '../../petstore';

type Paths = paths;

type Verbs = 'get' | 'post' | 'put' | 'delete' | 'patch';
type PathStrings = keyof Paths;
type ExtractPathFromVerbs<Path extends keyof Paths, Verb extends Verbs> = Path extends Path
    ? Verb extends keyof Paths[Path]
        ? Path
        : never
    : never;
type GetPaths = ExtractPathFromVerbs<PathStrings, 'get'>;
type PostPaths = ExtractPathFromVerbs<PathStrings, 'post'>;
type PutPaths = ExtractPathFromVerbs<PathStrings, 'put'>;
type DeletePaths = ExtractPathFromVerbs<PathStrings, 'delete'>;
type PatchPaths = ExtractPathFromVerbs<PathStrings, 'patch'>;

type params = Paths['/user/login']['get'];
const x: Paths = null!;
type RequestBody<Path extends PostPaths> = Paths[Path]['post'] extends {
    requestBody: { content: { 'application/json': infer Req } };
}
    ? Req
    : never;

type RequestBodyExtender<Path extends PostPaths> = RequestBody<Path> extends never
    ? { body?: undefined }
    : { body: RequestBody<Path> };

type HttpOptions = Parameters<HttpClient['post']>[2];

@Injectable({ providedIn: 'root' })
export class PetApiService {
    #http = inject(HttpClient);
    #baseUrl = 'https://petstore3.swagger.io/api/v3' as const;
    get<Path extends GetPaths>(url: Path) {
        return this.#http.get(this.#baseUrl + url);
    }

    post<Path extends PostPaths>(url: Path, opt: HttpOptions & RequestBodyExtender<Path>) {
        return this.#http.post(this.#baseUrl + url, opt.body ?? null);
    }
}
