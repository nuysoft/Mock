/**
 * Response.js
 *
 * Response class provides content decoding
 */

import Body from './body.js';
import { extractContentType } from './body/exactContentType.js';
import { isRedirect } from './utils/is-redirect.js';
import { RESPONSE as INTERNALS } from './INTERNALS.js';
/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
export default class fakeResponse extends Body {
    constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers(options.headers);
        if (body !== null && !headers.has('Content-Type')) {
            const contentType = extractContentType(body);
            if (contentType) {
                headers.append('Content-Type', contentType);
            }
        }
        this[INTERNALS] = {
            type: 'default',
            url: options.url,
            status,
            statusText: options.statusText || '',
            headers,
            counter: options.counter,
        };
    }

    get type() {
        return this[INTERNALS].type;
    }

    get url() {
        return this[INTERNALS].url || '';
    }

    get status() {
        return this[INTERNALS].status;
    }

    /**
     * Convenience property representing if the request ended normally
     */
    get ok() {
        return this[INTERNALS].status >= 200 && this[INTERNALS].status < 300;
    }

    get redirected() {
        return this[INTERNALS].counter > 0;
    }

    get statusText() {
        return this[INTERNALS].statusText;
    }

    get headers() {
        return this[INTERNALS].headers;
    }

    /**
     * Clone this response
     *
     * @return  Response
     */
    clone() {
        // Don't allow cloning a used body
        if (this.bodyUsed) {
            throw new Error('cannot clone body after it is used');
        }
        return new Response(this.body, {
            type: this.type,
            url: this.url,
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            ok: this.ok,
            redirected: this.redirected,
            size: this.size,
        });
    }

    /**
     * @param {string} url    The URL that the new response is to originate from.
     * @param {number} status An optional status code for the response (e.g., 302.)
     * @return {Response}    A Response object.
     */
    static redirect(url, status = 302) {
        if (!isRedirect(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }

        return new Response(null, {
            headers: {
                location: new URL(url).toString(),
            },
            status,
        });
    }

    static error() {
        const response = new Response(null, { status: 0, statusText: '' });
        response[INTERNALS].type = 'error';
        return response;
    }

    get [Symbol.toStringTag]() {
        return 'Response';
    }
}

Object.defineProperties(Response.prototype, {
    type: { enumerable: true },
    url: { enumerable: true },
    status: { enumerable: true },
    ok: { enumerable: true },
    redirected: { enumerable: true },
    statusText: { enumerable: true },
    headers: { enumerable: true },
    clone: { enumerable: true },
});
