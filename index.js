"use strict";
var Immutable = require('immutable');
var lodash_1 = require('lodash');
function Map(data) {
    var history = [
        new Immutable.Map(data)
    ];
    var interceptor = {
        get: function (target, prop) {
            return lodash_1.last(history).get(prop);
        },
        set: function (target, prop, value) {
            history.push(lodash_1.last(history).set(prop, value));
            return this;
        }
    };
    return new Proxy(data, interceptor);
}
exports.Map = Map;
