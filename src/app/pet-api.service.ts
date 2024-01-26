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
type RequestBody<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    requestBody: { content: { 'application/json': infer Body } };
}
    ? Body
    : never;

type RequestBodyExtender<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = RequestBody<Path, Verb> extends never
    ? { body?: undefined }
    : { body: RequestBody<Path, Verb> };

type params = Paths['/pet/{petId}']['get']['responses']['400'];
type params1 = Paths['/pet/{petId}']['post'];
// const x1: params1 = { parameters: { path: { petId: 1 } } };
// const x2: params1 = { parameters: { path: { petId: 1 } } };

type PathParameter<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    parameters: { path?: infer PathParam };
}
    ? PathParam
    : never;
type PathParameterExtender<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = PathParameter<Path, Verb> extends never
    ? { pathParams?: undefined }
    : { pathParams: PathParameter<Path, Verb> };

type QueryParameter<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    parameters: { query?: infer Param };
}
    ? Param
    : never;
type NgParams = Record<
    string,
    string | number | boolean | ReadonlyArray<string | number | boolean>
>;

type QueryParameterExtender<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = QueryParameter<Path, Verb> extends never
    ? { queryParams?: undefined }
    : { queryParams: QueryParameter<Path, Verb> & NgParams };

type HttpOptions = Parameters<HttpClient[Verbs]>[2] & { responseType?: 'json' };

type x = { one: { path?: number; query?: string }; two: { abc: boolean } } extends {
    one: { path?: number };
}
    ? 'yes'
    : 'no';

type Test = QueryParameter<'/pet/{petId}', 'get'>;

@Injectable({ providedIn: 'root' })
export class PetApiService {
    #http = inject(HttpClient);
    #baseUrl = 'https://petstore3.swagger.io/api/v3' as const;

    get<Path extends GetPaths>(
        url: Path,
        opt: HttpOptions &
            RequestBodyExtender<Path, 'get'> &
            PathParameterExtender<Path, 'get'> &
            QueryParameterExtender<Path, 'get'>
    ) {
        return this.#http.get(this.#baseUrl + url);
    }

    post<Path extends PostPaths>(
        url: Path,
        opt: HttpOptions &
            RequestBodyExtender<Path, 'post'> &
            PathParameterExtender<Path, 'post'> &
            QueryParameterExtender<Path, 'post'>
    ) {
        const { body, pathParams, queryParams } = opt;
        opt.params = queryParams;
        let requestPath: string = url;
        Object.entries(pathParams ?? {}).forEach(([key, value]) => {
            if (typeof value !== 'bigint' && typeof value !== 'number' && typeof value !== 'string')
                return;
            requestPath = requestPath.replace(`{${key}}`, value.toString());
        });
        return this.#http.post(this.#baseUrl + requestPath, body ?? null, opt);
    }
}
