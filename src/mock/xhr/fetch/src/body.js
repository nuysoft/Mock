/**
 * Body.js
 *
 * Body interface provides common methods for Request and Response
 */

import { isURLSearchParameters } from "./utils/is.js";
import { BODY as INTERNALS } from "./INTERNALS.js";

import { consumeBody } from "./body/consumeBody.js";
/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
export default class Body {
    constructor(body, { size = 0 } = {}) {
        if (body === null) {
            // Body is undefined or null
            body = new Blob([]);
        } else if (isURLSearchParameters(body)) {
            // Body is a URLSearchParams
            body = new Blob([body]);
        } else if (ArrayBuffer.isView(body)) {
            // Body is ArrayBufferView
            body = new Blob([body]);
        } else {
            body = new Blob([JSON.stringify(body)]);
        }

        this[INTERNALS] = {
            body,
            boundary: null,
            disturbed: false,
            error: null,
        };
        this.size = size;
    }

    get body() {
        return this[INTERNALS].body;
    }

    get bodyUsed() {
        return this[INTERNALS].disturbed;
    }

    /**
     * Decode response as ArrayBuffer
     *
     * @return  Promise
     */
    async arrayBuffer() {
        const blob = await consumeBody(this[INTERNALS]);
        return blob.arrayBuffer();
    }

    /**
     * Return raw response as Blob
     *
     * @return Promise
     */
    async blob() {
        return consumeBody(this[INTERNALS]);
    }

    /**
     * Decode response as json
     *
     * @return  Promise
     */
    async json() {
        const text = await this.text();
        return JSON.parse(text || "{}");
    }

    /**
     * Decode response as text
     *
     * @return  Promise
     */
    async text() {
        const blob = await consumeBody(this[INTERNALS]);
        return blob.text();
    }

    /**
     * Decode response as buffer (non-spec api)
     *
     * @return  Promise
     */
}

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
    body: { enumerable: true },
    bodyUsed: { enumerable: true },
    arrayBuffer: { enumerable: true },
    blob: { enumerable: true },
    json: { enumerable: true },
    text: { enumerable: true },
});
