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

const x: GetPaths = '/store/order/{orderId}';

@Injectable({ providedIn: 'root' })
export class PetApiService {
    #http = inject(HttpClient);
    #baseUrl = 'https://petstore3.swagger.io/api/v3' as const;
    get<Path extends GetPaths>(url: Path) {
        return this.#http.get(this.#baseUrl + url);
    }
}
