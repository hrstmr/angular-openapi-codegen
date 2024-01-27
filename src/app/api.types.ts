import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { paths } from '../../petstore';

/**
 * Paths: A type alias for the paths import from petstore. It represents the API paths available in the application.
 */
export type Paths = paths;

/**
 * Verbs: A string literal type representing HTTP methods: `get`, `post`, `put`, `delete`, and `patch`.
 */
export type Verbs = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * PathStrings: A union type of all keys in the Paths type, representing all possible paths in the API.
 */
export type PathStrings = keyof Paths;

/**
 * Utility type to extract paths based on HTTP verbs.
 */
export type ExtractPathFromVerbs<Path extends keyof Paths, Verb extends Verbs> = Path extends Path
    ? Verb extends keyof Paths[Path]
        ? Path
        : never
    : never;
export type GetPaths = ExtractPathFromVerbs<PathStrings, 'get'>;
export type PostPaths = ExtractPathFromVerbs<PathStrings, 'post'>;
export type PutPaths = ExtractPathFromVerbs<PathStrings, 'put'>;
export type DeletePaths = ExtractPathFromVerbs<PathStrings, 'delete'>;
export type PatchPaths = ExtractPathFromVerbs<PathStrings, 'patch'>;

/**
 * Extracts the request body for a specific path and HTTP verb
 * when request body is of type json.
 */
export type RequestBody<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    requestBody: { content: { 'application/json': infer Body } };
}
    ? Body
    : never;

/**
 * Extends the request body or indicates its absence.
 * This can be combined with another type to pass the body value as property,
 */
export type RequestBodyExtender<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = RequestBody<Path, Verb> extends never
    ? { body?: undefined }
    : { body: RequestBody<Path, Verb> };

/**
 * Extracts the response for a specific path and HTTP verb
 * when response type is json
 * and status code is 200.
 */
export type Response<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    responses: { 200: { content: { 'application/json': infer Response } } };
}
    ? Response
    : never;

/**
 * Extracts path parameters for a specific path and HTTP verb.
 */
export type PathParameter<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    parameters: { path?: infer PathParam };
}
    ? PathParam
    : never;

/**
 * Extends the path parameters or indicates its absence.
 * This can be combined with another type to pass the path parameters value as property,
 */
export type PathParameterExtender<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = PathParameter<Path, Verb> extends never
    ? { pathParams?: undefined }
    : { pathParams: PathParameter<Path, Verb> };

/**
 * Extracts query parameters for a specific path and HTTP verb
 */
export type QueryParameter<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = Paths[Path][Verb] extends {
    parameters: { query?: infer Param };
}
    ? Param
    : never;

/**
 * Extends the query parameters or indicates their absence.
 * It also includes general Angular http parameters (NgParams) so it can be assigned back to HttpParams
 */
export type QueryParameterExtender<
    Path extends PathStrings,
    Verb extends Verbs & keyof Paths[Path]
> = QueryParameter<Path, Verb> extends never
    ? { queryParams?: undefined }
    : { queryParams: QueryParameter<Path, Verb> & NgParams };

/**
 * Angular's HttpClient params without the class HttpParams
 */
export type NgParams = Exclude<HttpOptions['params'], HttpParams>;

/**
 * options that can be passed to angular http client's methods
 */
export type HttpOptions = Parameters<HttpClient[Verbs]>[2] & { responseType?: 'json' };

/**
 * Attaches the path and query parameters to the http options
 */
export type GetOptions<Path extends GetPaths> = HttpOptions &
    PathParameterExtender<Path, 'get'> &
    QueryParameterExtender<Path, 'get'>;
/**
 * Attaches the path, query and body to the http options
 */
export type PostOptions<Path extends PostPaths> = HttpOptions &
    RequestBodyExtender<Path, 'post'> &
    PathParameterExtender<Path, 'post'> &
    QueryParameterExtender<Path, 'post'>;
