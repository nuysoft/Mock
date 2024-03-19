// @vitest-environment jsdom

import { it, describe, expect, afterEach } from 'vitest';
import Mock from '../src/mock';
import * as _ from 'lodash-es';
import $ from 'jquery';
import { Blob } from 'blob-polyfill';
globalThis.Blob = Blob;
describe('Request', function () {
    const donePolyfill = (fn) => {
        return () => new Promise((res) => fn(res));
    };

    afterEach(() => {
        Mock._mocked.$clear();
    });
    it('Mock.mock( rurl, template )', async function (done) {
        const url = 'rurl_template.json';

        Mock.mock(/rurl_template.json/, {
            'list|1-10': [
                {
                    'id|+1': 1,
                    email: '@EMAIL',
                },
            ],
        });

        Mock.setup({
            // timeout: 100,
            timeout: '10-50',
        });
        await fetch(url)
            .then((res) => res.json())
            .then(function (data /*, textStatus, jqXHR*/) {
                expect(data).to.have.property('list').that.be.an('array').with.length.within(1, 10);
                _.each(data.list, function (item, index, list) {
                    if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1);
                });
            });
    });

    describe('Mock.mock( rurl, function(options) )', function () {
        it(
            'rurl_function.json',
            donePolyfill(function (done) {
                var that = this;
                var url = 'rurl_function.json';

                Mock.mock(/rurl_function\.json/, function (options) {
                    expect(options).to.not.equal(undefined);
                    expect(options.url).to.be.equal(url);
                    expect(options.type).to.be.equal('GET');
                    expect(options.body).toBeFalsy();
                    return Mock.mock({
                        'list|1-10': [
                            {
                                'id|+1': 1,
                                email: '@EMAIL',
                            },
                        ],
                    });
                });

                $.ajax({
                    url: url,
                    dataType: 'json',
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('list').that.be.an('array').with.length.within(1, 10);
                        _.each(data.list, function (item, index, list) {
                            if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1);
                        });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // console.log(jqXHR, textStatus, errorThrown);
                    })
                    .always(function () {
                        done();
                    });
            }),
        );
    });

    it(
        'Mock.mock( rurl, function(options) ) + GET + data',
        donePolyfill(function (done) {
            var that = this;
            var url = 'rurl_function.json';

            Mock.mock(/rurl_function\.json/, function (options) {
                expect(options).to.not.equal(undefined);
                expect(options.url).to.be.equal('rurl_function.json?foo=1');
                expect(options.type).to.be.equal('GET');
                expect(options.body).to.be.equal(null);
                return Mock.mock({
                    'list|1-10': [
                        {
                            'id|+1': 1,
                            email: '@EMAIL',
                        },
                    ],
                });
            });

            $.ajax({
                url: url,
                dataType: 'json',
                data: {
                    foo: 1,
                },
            })
                .done(function (data /*, status, jqXHR*/) {
                    expect(data).to.have.property('list').that.be.an('array').with.length.within(1, 10);
                    _.each(data.list, function (item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1);
                    });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                })
                .always(function () {
                    done();
                });
        }),
    );

    describe('Mock.mock( rurl, function(options) ) + POST + data', function () {
        it(
            'rurl_function.json',
            donePolyfill(function (done) {
                var url = 'rurl_function.json';

                Mock.mock(/rurl_function\.json/, function (options) {
                    expect(options).to.not.equal(undefined);
                    expect(options.url).to.be.equal(url);
                    expect(options.type).to.be.equal('POST');
                    expect(options.body).to.be.equal('foo=1');
                    return Mock.mock({
                        'list|1-10': [
                            {
                                'id|+1': 1,
                                email: '@EMAIL',
                            },
                        ],
                    });
                });

                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        foo: 1,
                    },
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('list').that.be.an('array').with.length.within(1, 10);
                        _.each(data.list, function (item, index, list) {
                            if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1);
                        });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown);
                    })
                    .always(function () {
                        done();
                    });
            }),
        );
    });

    describe('Mock.mock( rurl, rtype, template )', function () {
        it(
            'rurl_rtype_template.json',
            donePolyfill(function (done) {
                var that = this;
                var url = 'rurl_rtype_template.json';
                var count = 0;

                Mock.mock(/rurl_rtype_template\.json/, 'get', {
                    'list|1-10': [
                        {
                            'id|+1': 1,
                            email: '@EMAIL',
                            type: 'get',
                        },
                    ],
                });
                Mock.mock(/rurl_rtype_template\.json/, 'post', {
                    'list|1-10': [
                        {
                            'id|+1': 1,
                            email: '@EMAIL',
                            type: 'post',
                        },
                    ],
                });

                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('list').that.be.an('array').with.length.within(1, 10);
                        _.each(data.list, function (item, index, list) {
                            if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1);
                            expect(item).to.have.property('type').equal('get');
                        });
                    })
                    .done(success)
                    .always(complete);

                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('list').that.be.an('array').with.length.within(1, 10);
                        _.each(data.list, function (item, index, list) {
                            if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1);
                            expect(item).to.have.property('type').equal('post');
                        });
                    })
                    .done(success)
                    .always(complete);

                function success(/*data*/) {
                    count++;
                }

                function complete() {
                    if (count === 2) done();
                }
            }),
        );
    });

    describe('Mock.mock( rurl, rtype, function(options) )', function () {
        it(
            'rurl_rtype_function.json',
            donePolyfill(function (done) {
                var that = this;
                var url = 'rurl_rtype_function.json';
                var count = 0;

                Mock.mock(/rurl_rtype_function\.json/, /get/, function (options) {
                    expect(options).to.not.equal(undefined);
                    expect(options.url).to.be.equal(url);
                    expect(options.type).to.be.equal('GET');
                    expect(options.body).to.be.equal(null);
                    return {
                        type: 'get',
                    };
                });
                Mock.mock(/rurl_rtype_function\.json/, /post|put/, function (options) {
                    expect(options).to.not.equal(undefined);
                    expect(options.url).to.be.equal(url);
                    expect(['POST', 'PUT']).to.include(options.type);
                    expect(options.body).to.be.equal(null);
                    return {
                        type: options.type.toLowerCase(),
                    };
                });

                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('type', 'get');
                    })
                    .done(success)
                    .always(complete);

                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('type', 'post');
                    })
                    .done(success)
                    .always(complete);

                $.ajax({
                    url: url,
                    type: 'put',
                    dataType: 'json',
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('type', 'put');
                    })
                    .done(success)
                    .always(complete);

                function success(/*data*/) {
                    count++;
                }

                function complete() {
                    if (count === 3) done();
                }
            }),
        );
    });
    describe('Mock.mock( rurl, rtype, function(options) ) + data', function () {
        it(
            '',
            donePolyfill(function (done) {
                var that = this;
                var url = 'rurl_rtype_function.json';
                var count = 0;

                Mock.mock(/rurl_rtype_function\.json/, /get/, function (options) {
                    expect(options).to.not.equal(undefined);
                    expect(options.url).to.be.equal(url + '?foo=1');
                    expect(options.type).to.be.equal('GET');
                    expect(options.body).to.be.equal(null);
                    return {
                        type: 'get',
                    };
                });
                Mock.mock(/rurl_rtype_function\.json/, /post|put/, function (options) {
                    expect(options).to.not.equal(undefined);
                    expect(options.url).to.be.equal(url);
                    expect(['POST', 'PUT']).to.include(options.type);
                    expect(options.body).to.be.equal('foo=1');
                    return {
                        type: options.type.toLowerCase(),
                    };
                });

                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        foo: 1,
                    },
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('type', 'get');
                    })
                    .done(success)
                    .always(complete);

                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        foo: 1,
                    },
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('type', 'post');
                    })
                    .done(success)
                    .always(complete);

                $.ajax({
                    url: url,
                    type: 'put',
                    dataType: 'json',
                    data: {
                        foo: 1,
                    },
                })
                    .done(function (data /*, status, jqXHR*/) {
                        expect(data).to.have.property('type', 'put');
                    })
                    .done(success)
                    .always(complete);

                function success(/*data*/) {
                    count++;
                }

                function complete() {
                    if (count === 3) done();
                }
            }),
        );
    });
    describe('#105 addEventListener', function () {
        it(
            'addEventListene => addEventListener',
            donePolyfill(function (done) {
                var xhr = new Mock.XHR();
                expect(xhr.addEventListener).to.not.equal(undefined);
                expect(xhr.addEventListene).to.equal(undefined);
                done();
            }),
        );
    });
});
