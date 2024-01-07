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

const x: Paths = null!;
type RequestBody<Path extends PostPaths> = Paths[Path]['post'] extends {
    requestBody: { content: { 'application/json': infer Req } };
}
    ? Req
    : never;

type RequestBodyExtender<Path extends PostPaths> = RequestBody<Path> extends never
    ? { body?: undefined }
    : { body: RequestBody<Path> };

type params = Paths['/pet/{petId}']['post']['parameters']['query'];
type params1 = Paths['/pet/{petId}']['post'];
// const x1: params1 = { parameters: { path: { petId: 1 } } };
// const x2: params1 = { parameters: { path: { petId: 1 } } };

type PathParameter<Path extends PostPaths> = Paths[Path][Verbs & keyof Paths[Path]] extends {
    parameters: { path: infer PathParam };
}
    ? PathParam
    : never;
type PathParameterExtender<Path extends PostPaths> = PathParameter<Path> extends never
    ? { pathParams?: undefined }
    : { pathParams: PathParameter<Path> };

type HttpOptions = Parameters<HttpClient[Verbs]>[2] & { responseType?: 'json' };

type PathParamTest = HttpOptions & PathParameterExtender<'/pet/{petId}'>;
const y: PathParamTest = {
    pathParams: {
        petId: 1,
    },
};

@Injectable({ providedIn: 'root' })
export class PetApiService {
    #http = inject(HttpClient);
    #baseUrl = 'https://petstore3.swagger.io/api/v3' as const;

    get<Path extends GetPaths>(url: Path) {
        return this.#http.get(this.#baseUrl + url);
    }

    post<Path extends PostPaths>(
        url: Path,
        opt: HttpOptions & RequestBodyExtender<Path> & PathParameterExtender<Path>
    ) {
        const { body, pathParams } = opt;
        let requestPath: string = url;
        Object.entries(pathParams ?? {}).forEach(([key, value]) => {
            if (typeof value !== 'bigint' && typeof value !== 'number' && typeof value !== 'string')
                return;
            requestPath = requestPath.replace(`{${key}}`, value.toString());
        });
        return this.#http.post(this.#baseUrl + requestPath, opt.body ?? null);
    }
}
