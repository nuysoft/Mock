import { pick } from '../helper.js';
import { word } from '../text.js';
import { protocols, tlds } from './web_dict.js';
/*
    随机生成一个 URL。

    [URL 规范](http://www.w3.org/Addressing/URL/url-spec.txt)
        http                    Hypertext Transfer Protocol
        ftp                     File Transfer protocol
        gopher                  The Gopher protocol
        mailto                  Electronic mail address
        mid                     Message identifiers for electronic mail
        cid                     Content identifiers for MIME body part
        news                    Usenet news
        nntp                    Usenet news for local NNTP access only
        prospero                Access using the prospero protocols
        telnet rlogin tn3270    Reference to interactive sessions
        wais                    Wide Area Information Servers
*/
export function url(Protocol, host) {
    return `${Protocol || protocol()}://${host || domain()}/${word()}`;
}

// 随机生成一个 URL 协议。
export function protocol() {
    return pick(protocols);
}
// 随机生成一个域名。
export function domain(Tld) {
    return `${word()}.${Tld || tld()}`;
}
/*
    随机生成一个顶级域名。
    国际顶级域名 international top-level domain-names, iTLDs
    国家顶级域名 national top-level domainnames, nTLDs
    [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
*/
export function tld() {
    // Top Level Domain
    return pick(tlds);
}

import { character, natural } from '../basic.js';

// 随机生成一个邮件地址。
export function email(domain) {
    return `${character('lower')}.${word()}@${domain || word() + '.' + tld()}`;
}
// 随机生成一个 IP 地址。
export function ip() {
    // 这里不能用 Array(4).fill fill 是向数组注入同一个值
    return [...Array(4)].map(() => natural(0, 255)).join('.');
}
