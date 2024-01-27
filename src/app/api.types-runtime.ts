const paths = {} as any; // Assuming 'paths' is defined somewhere

const Verbs = ['get', 'post', 'put', 'delete', 'patch'] as const;
const PathStrings = Object.keys(paths);

function extractPathFromVerbs(path: string, verb: string) {
    if (paths?.[path]?.[verb]) {
        return path;
    } else {
        return null;
    }
}

const GetPaths = PathStrings.filter((path) => extractPathFromVerbs(path, 'get'));
const PostPaths = PathStrings.filter((path) => extractPathFromVerbs(path, 'post'));
const PutPaths = PathStrings.filter((path) => extractPathFromVerbs(path, 'put'));
const DeletePaths = PathStrings.filter((path) => extractPathFromVerbs(path, 'delete'));
const PatchPaths = PathStrings.filter((path) => extractPathFromVerbs(path, 'patch'));

function getRequestBody(path: string, verb: string) {
    const body = paths?.[path]?.[verb]?.requestBody?.content?.['application/json'];
    return body ? body : null;
}

function getRequestBodyExtender(path: string, verb: string) {
    const body = getRequestBody(path, verb);
    return !body ? { body: undefined } : { body };
}

function getResponse(path: string, verb: string) {
    const response = paths?.[path]?.[verb]?.responses?.[200]?.content?.['application/json'];
    return response ? response : null;
}

function getPathParameter(path: string, verb: string) {
    const pathParam = paths?.[path]?.[verb]?.parameters?.path;
    return pathParam ? pathParam : null;
}

function getPathParameterExtender(path: string, verb: string) {
    const pathParams = getPathParameter(path, verb);
    return !pathParams ? { pathParams: undefined } : { pathParams };
}

function getQueryParameter(path: string, verb: string) {
    const param = paths?.[path]?.[verb]?.parameters?.query;
    return param ? param : null;
}

function getQueryParameterExtender(path: string, verb: string) {
    const queryParams = getQueryParameter(path, verb);
    const ngParams = {}; // Assuming NgParams is a global object
    return !queryParams
        ? { queryParams: undefined }
        : { queryParams: { ...queryParams, ...ngParams } };
}

function GetOptions(path: string) {
    const httpOptions = {}; //Assuming these are ;
    return {
        ...httpOptions,
        ...getPathParameterExtender(path, 'get'),
        ...getQueryParameterExtender(path, 'get'),
    };
}

function PostOptions(path: string) {
    const httpOptions = {}; //Assuming these are ;
    return {
        ...httpOptions,
        ...getRequestBodyExtender(path, 'post'),
        ...getPathParameterExtender(path, 'post'),
        ...getQueryParameterExtender(path, 'post'),
    };
}
