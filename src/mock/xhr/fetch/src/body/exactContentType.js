import { isURLSearchParameters } from '../utils/is';
import { BODY as INTERNALS } from '../INTERNALS';
/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param {any} body Any options.body input
 * @return {string | null}
 */
export const extractContentType = (body, request) => {
    // Body is null or undefined
    if (body === null) {
        return null;
    }

    // Body is string
    if (typeof body === 'string') {
        return 'text/plain;charset=UTF-8';
    }

    // Body is a URLSearchParams
    if (isURLSearchParameters(body)) {
        return 'application/x-www-form-urlencoded;charset=UTF-8';
    }

    // Body is blob
    if (body instanceof Blob) {
        return body.type || null;
    }

    if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS].boundary}`;
    }

    // Body constructor defaults other things to string
    return 'text/plain;charset=UTF-8';
};
