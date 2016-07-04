"use strict";
const Immutable = require('immutable');
const lodash_1 = require('lodash');
const AUDIT = Symbol();
const AUDIT_WITH_TRACES = Symbol();
function JustList(...as) {
    const state = {
        audit: [
            { data: Immutable.List(as), trace: null }
        ]
    };
    const interceptor = {
        get: function (target, prop) {
            switch (prop) {
                case Symbol.toStringTag:
                    return lodash_1.first(state.audit).data.toJS();
                case AUDIT:
                    return state.audit.map(_ => _.data.toJS());
                case AUDIT_WITH_TRACES:
                    return state.audit.map(({ data, trace }) => ({
                        trace: trace,
                        data: data.toJS()
                    }));
                default:
                    return lodash_1.first(state.audit).data.get(prop);
            }
        },
        set: function (target, prop, value) {
            switch (prop) {
                case AUDIT: break;
                default:
                    state.audit = [
                        {
                            data: lodash_1.first(state.audit).data.set(prop, value),
                            trace: getTrace()
                        }
                    ].concat(state.audit);
            }
            return true;
        }
    };
    const p = new Proxy(this, interceptor);
    p[AUDIT] = () => state.audit;
    return p;
}
exports.List = Object.assign(JustList, {
    audit: function audit(a) {
        return a[AUDIT];
    },
    auditWithTraces: function auditWithTraces(a) {
        return a[AUDIT_WITH_TRACES];
    }
});
function getTrace() {
    try {
        throw new Error;
    }
    catch (e) {
        const stack = e.stack.split('\n').slice(3);
        stack[0] = stack[0].slice(7); // rm leading "     at" on 1st line
        return stack;
    }
}
