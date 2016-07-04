"use strict";
const Immutable = require('immutable');
const lodash_1 = require('lodash');
const AUDIT = Symbol();
exports.List = Object.assign(function List(...as) {
    const state = {
        audit: [
            Immutable.List(as)
        ]
    };
    const interceptor = {
        get: function (target, prop) {
            console.log('get', prop);
            switch (prop) {
                case Symbol.toStringTag: return lodash_1.first(state.audit).toJS();
                case AUDIT: return state.audit.map(_ => _.toJS());
                default: return lodash_1.first(state.audit).get(prop);
            }
        },
        set: function (target, prop, value) {
            console.log('set', prop, value);
            switch (prop) {
                case AUDIT: break;
                default:
                    state.audit = [
                        lodash_1.first(state.audit).set(prop, value)
                    ].concat(state.audit);
            }
            return true;
        }
    };
    const p = new Proxy(this, interceptor);
    p[AUDIT] = () => state.audit;
    return p;
}, {
    audit: function Audit(a) {
        console.log('audit', a);
        return a[AUDIT];
    }
});
function getTrace() {
    try {
        throw new Error;
    }
    catch (e) {
        console.log(e.stack);
    }
}
