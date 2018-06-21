// FIXME I think I could use generators to write a proper top-down parser that looks reasonably like parsec
function parse(tokenStream) {
    const tokens = [...tokenStream]
    const stack = [[]]
    // FIXME why not a for...of loop?
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


export { parse }