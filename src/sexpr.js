function fromStr(str) {
    str = str.replace(/;.*($|\n)/g, '')
    str = str.replace(/\n/g, '')
    str = str.replace(/[()[\]{}`']/g, (x) => ` ${x} `)
    const tokens = str.split(" ").filter((token) => token.length > 0)

    var stack = [[]]
    tokens.forEach((token) => {
        if (token === "(" || token === "[" || token === "{" || token === '`') {
            stack.push([])
        }
        else if (token === ")") {
            var combination = stack.pop()
            stack[stack.length - 1].push(
                { __COMBO__: combination[0]
                , __STUFF__: combination.slice(1)
                })
        }
        else if (token === "]") {
            var list = stack.pop()
            stack[stack.length - 1].push(list)
        }
        else if (token === "}") {
            var kvs = stack.pop()
            var obj = {}
            for (var i = 0, e = kvs.length; i < e; i += 2) {
                obj[kvs[i]] = kvs[i+1]
            }
            stack[stack.length - 1].push(obj)
        }
        else if (token === "'") {
            var string = stack.pop().join(" ")
            stack[stack.length - 1].push(string)
        }
        else if (token.startsWith("$")) {
            stack[stack.length - 1].push({__VAR__: token.slice(1)})
        }
        else if (token === "true") { stack[stack.length - 1].push(true) }
        else if (token === "false") { stack[stack.length - 1].push(false) }
        else if (/^-?[0-9]+(\.[0-9]+)?$/.test(token)) {
            stack[stack.length - 1].push(parseFloat(token))
        }
        else {
            stack[stack.length - 1].push(token)
        }
    })

    return stack[0]
}


function evalSexpr(env, sexpr) {
    var go = (x) => evalSexpr(env, x)
    go.env = (more) => Object.assign({}, env, more)

    if (sexpr.hasOwnProperty("__VAR__")) {
        return env[sexpr.__VAR__]
    }
    else if (sexpr.hasOwnProperty("__COMBO__") && sexpr.hasOwnProperty("__STUFF__")) {
        var f = env[sexpr.__COMBO__]
        if (typeof f !== "function") { throw sexpr.__COMBO__ + " is not a function" }
        return f(go, sexpr.__STUFF__)
    }
    else if (Array.isArray(sexpr)) {
        return sexpr.map(go)
    }
    else if (typeof sexpr === "object") {
        var value = {}
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
