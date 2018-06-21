function updateLoc(loc0, tok) {
    const loc = Object.assign({}, loc0)
    const lines = tok.split("\n")
    if (lines.length > 1) {
        loc.line += lines.length - 1
        loc.col = 1
    }
    const lastLine = lines[lines.length - 1]
    loc.col += lastLine.length
    Object.freeze(loc)
    return loc
}
function* tokenize(str) {
    let loc = { line: 1, col: 1 }
    const fromRx = (rx) => (x) => {
        rx = new RegExp("^" + rx.source, rx.flags)
        const match = x.match(rx)
        return match === null ? null : match[0]
    }
    const mkTok = (tag) => (tok) => {
        if (tok === null) { return null }
        const loc0 = Object.assign({}, loc)
        loc = updateLoc(loc, tok)
        str = str.slice(tok.length)
        return { tag, loc: [loc0, loc], tok }
    }

    const tokenizers =
        [ (x) => mkTok("whitespace")(fromRx(/\s+/)(x))
        , (x) => mkTok("comment")(fromRx(/;[^\n]*(\n|$)/)(x))
        , (x) => mkTok("keyword")(fromRx(/true|false/)(x))
        , (x) => mkTok("number")(fromRx(/-?[0-9]+(\.[0-9]+)?/)(x))
        , (x) => mkTok("string")(fromRx(/"[^"]*"/)(x)) // FIXME non-terrible strings
        , (x) => mkTok("name")(fromRx(/[-_~<>=.?!@#$%^&*+/a-zA-Z][-_~<>=.?!@#$%^&*+a-zA-Z0-9]*/)(x))
        , (x) => mkTok("delimiter")(fromRx(/[()[\]{}]/)(x))
        , (x) => mkTok("error")(fromRx(/./)(x))
        ]

        while (str.length > 0) {
            for(let i = 0, e = tokenizers.length; i < e; ++i) {
                const tok = tokenizers[i](str)
                if (tok !== null) {
                    yield tok
                    break
                }
            }
        }
}

// FIXME I think I could use generators to write a proper top-down parser that looks reasonably like parsec
function parse(tokenStream) {
    const tokens = [...tokenStream]
    const stack = [[]]
    tokens.forEach((token) => {
        if (token.tag === "whitespace" || token.tag === "comment") { return }
        else if (token.tag === "keyword") {
            if (token.tok === "true") { stack[stack.length - 1].push(true) }
            else if (token.tok === "false") { stack[stack.length - 1].push(false) }
            else { throw "unknown keyword" }
        }
        else if (token.tag === "number") {
            stack[stack.length - 1].push(parseFloat(token.tok))
        }
        else if (token.tag === "string") {
            stack[stack.length - 1].push(token.tok.slice(1,-1)) // FIXME terrible strings
        }
        else if (token.tag === "name") {
            stack[stack.length - 1].push({__VAR__: token.tok})
        }
        else if (token.tag === "delimiter") {
            if (token.tok === "(" || token.tok === "[" || token.tok === "{") {
                stack.push([])
            }
            else if (token.tok === ")") {
                const combination = stack.pop()
                // FIXME isn't there new syntax I can use here?
                stack[stack.length - 1].push(
                    { __COMBO__: combination[0].__VAR__ // FIXME use of __VAR__
                    , __STUFF__: combination.slice(1)
                    })
            }
            else if (token.tok === "]") {
                const list = stack.pop()
                stack[stack.length - 1].push(list)
            }
            else if (token.tok === "}") {
                const kvs = stack.pop()
                // FIXME use a recude over entries with assign or something?
                const obj = {}
                for (let i = 0, e = kvs.length; i < e; i += 2) {
                    obj[kvs[i].__VAR__] = kvs[i+1] // FIXME use of __VAR__
                }
                stack[stack.length - 1].push(obj)
            }
            else { throw `unknown delimiter "${token.tok}"` }
        }
        else { throw "unknown token tag" }
    })

    return stack[0]
}

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
