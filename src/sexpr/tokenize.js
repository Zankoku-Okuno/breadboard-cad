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

export { tokenize }