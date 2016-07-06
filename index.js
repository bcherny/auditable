"use strict";
const state = {
    audits: new WeakMap(),
    proxyByList: new WeakMap()
};
function JustList(...as) {
    const interceptor = {
        get: function (target, prop) {
            const audit = state.audits.get(target);
            switch (prop) {
                case Symbol.toStringTag:
                    return audit[0].data;
                default:
                    return audit[0].data[prop];
            }
        },
        set: function (target, prop, value) {
            const audit = state.audits.get(target);
            const data = audit[0].data.slice(0); // clone
            data[prop] = value;
            const newAudit = {
                data: data,
                time: getTime(),
                trace: getTrace()
            };
            state.audits.set(target, [newAudit].concat(audit));
            return true;
        }
    };
    const proxy = new Proxy(this, interceptor);
    state.audits.set(this, [{
            data: as,
            time: getTime(),
            trace: null
        }]);
    state.proxyByList.set(proxy, this);
    return proxy;
}
exports.List = Object.assign(JustList, {
    audit: function audit(a) {
        const proxy = state.proxyByList.get(a);
        return state.audits.get(proxy).map(_ => _.data);
    },
    auditWithTraces: function auditWithTraces(a) {
        const proxy = state.proxyByList.get(a);
        return state.audits.get(proxy);
    }
});
function getTime() {
    return new Date().toISOString();
}
function getTrace() {
    try {
        throw new Error();
    }
    catch (e) {
        const stack = e.stack.split('\n').slice(3);
        stack[0] = stack[0].slice(7); // rm leading "     at" on 1st line
        return stack;
    }
}
