// Type definitions for mockjs
// Project: https://github.com/nuysoft/Mock
// Definitions by: xunjianxiang <xunjianxiang@gmail.com>

declare interface MockRequestBody {
  url: string;
  type: string;
  body: string;
}

declare interface ValidResult {
  path: string[];
  type: string;
  actual: string;
  expected: string;
  action: string;
  message: string;
}

declare interface JSONSchemaRule {
  parameters: any[];
  rage: string[];
  min: number;
  max: number;
  count: number;
  decimal: number;
  dmin: number,
  dmax: number;
  dcount: number;
}

declare interface JSONSchema {
  name: string;
  path: string[];
  type: string;
  template: any;
  rule: JSONSchemaRule;
  properties: JSONSchema;
  items: JSONSchema[];
}

declare namespace mockjs {
  let version: string;
  function mock (rurl?: RegExp | string, rtype?: string, template?: object | string | ((options: MockRequestBody) => any)): void;
  function setup (config: object): void;
  namespace Random {
    function boolean (min?: number, max?: number, current?: boolean): boolean;
    function natural (min?: number, max?: number): number;
    function integer (min?: number, max?: number): number;
    function float (min?: number, max?: number, dmin?: number, dmax?: number): number;
    function character (pool?: string): string;
    function string (pool?: string, min?: number, max?: number): string;
    function range (start: number, stop?: number, step?: number): number[];
    function email (domain?: string): string;

    function date (format?: string): string;
    function time (format?: string): string;
    function datetime (format?: string): string;
    function now (unit?: string, format?: string): string;

    function image (size?: string, background?: string, foreground?: string, format?: string, text?: string): string;
    function dataImage( size?: string, text?: string): string;

    function color (): string;
    function hex (): string;
    function rgb (): string;
    function rgba (): string;
    function hsl (): string;

    function paragraph (len: number): string;
    function paragraph (min: number, max: number): string;
    function cparagraph (len: number): string;
    function cparagraph (min: number, max: number): string;
    function sentence (len: number): string;
    function sentence (min: number, max: number): string;
    function csentence (len: number): string;
    function csentence (min: number, max: number): string;
    function word (len: number): string;
    function word (min: number, max: number): string;
    function cword (len: number): string;
    function cword (min: number, max: number): string;
    function title (len: number): string;
    function title (min: number, max: number): string;
    function ctitle (len: number): string;
    function ctitle (min: number, max: number): string;

    function first (): string;
    function last (): string;
    function name (middle?: string): string;
    function cfirst (): string;
    function clast (): string;
    function cname (): string;

    function url (protocol?: string, host?: string): string;
    function protocol (): string;
    function domain (): string;
    function tld (): string;
    function ip (): string;

    function region (): string;
    function province (): string;
    function city (prefix?: boolean): string;
    function county (prefix?: boolean): string;
    function zip (): string;

    function capitalize (word: string): string;
    function upper (string: string): string;
    function lower (string: string): string;
    function pick (array: any[]): any;
    function shuffle (array: any[]): any[];

    function guid (): string;
    function id (): string;
    function increment (step?: number): number;

  }
  function valid (template: object | string, data: object | string): ValidResult;

  function toJSONSchema (template: object | string): JSONSchema;
}

export default mockjs;
