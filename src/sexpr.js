import { tokenize } from "./sexpr/tokenize.js"
import { parse } from "./sexpr/parse.js"


function fromStr(str) {
    return parse(tokenize(str))
}


function evalSexpr(env, sexpr) {
    const go = (x) => evalSexpr(env, x)
    go.env = (more) => Object.assign({}, env, more)

    if (sexpr.hasOwnProperty("__VAR__")) {
        const val = env[sexpr.__VAR__]
        if (val === undefined) { console.log(env); throw `unbound variable: ${sexpr.__VAR__}` }
        return val
    }
    else if (sexpr.hasOwnProperty("__COMBO__") && sexpr.hasOwnProperty("__STUFF__")) {
        const f = env[sexpr.__COMBO__]
        if (typeof f !== "function") { throw sexpr.__COMBO__ + " is not a function" }
        return f(go, sexpr.__STUFF__)
    }
    else if (Array.isArray(sexpr)) {
        return sexpr.map(go)
    }
    else if (typeof sexpr === "object") {
        const value = {}
        Object.keys(sexpr).forEach((k) => {
            value[k] = go(sexpr[k])
        })
        return value
    }
    else {
        return sexpr
    }
}


const strictly = (f) => (go, sexprs) => f(sexprs.map(go))


export { fromStr, evalSexpr as eval, strictly }
