/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return Promise
 */
export async function consumeBody(data) {
    // 标记为已经使用
    if (data.disturbed) {
        throw new TypeError(`body used already for: ${data.url}`);
    }
    data.disturbed = true;

    // 报错
    if (data.error) {
        throw data.error;
    }

    if (data.body instanceof FormData) {
        return new Blob([Object.fromEntries(a.entries())]);
    }
    return data.body;
}
