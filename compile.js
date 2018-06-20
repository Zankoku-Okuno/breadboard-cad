LIBRARY =
    { "+": strict((args) => args.reduce(Array.isArray(args[0]) ? (a, b) => a.concat(b) : (a, b) => a + b))
    , "-": strict((args) => args.length === 1 ? -args[0] : args[1] - args[0])
    , "*": strict((args) => args.reduce((a, b) => a * b))
    , "%": strict((args) => args[1] % args[0])
    , ".": strict((args) => args[0][args[1]])
    , "=?": strict((args) => args[0] === args[1])
    , "DEBUG": strict((args) => { console.log(args[0]); return args[0] })
    , "cat": strict((args) => args[0].reduce((a, b) => a.concat(b)))
    , "let": (go, args) => {
            var binds = args[0]
            var body = args[1]

            var local = {}
            for (var i = 0, e = binds.length; i < e; i += 2) {
                local[binds[i]] = eval(go.env(local), binds[i+1])
            }

            return eval(go.env(local), body)
        }
    , "cond": (go, args) => {
            for (var i = 0; i < args.length; i += 2) {
                if (go(args[i]) === true) {
                    return go(args[i+1])
                }
            }
            return false
        }
    , "map": (go, args) => {
            if (Array.isArray(args[0])) {
                var x = args[0][1]
                var i = args[0][0]
            }
            else {
                var x = args[0]
                var i = undefined
            }
            var over = go(args[1])
            var body = args[2]

            var innerGo = (sexpr) => eval()

            return over.map((item, ix) => {
                var local = {}
                local[x] = go(item)
                local[i] = ix
                return eval(go.env(local), body)
            })
        }
    , "catMap": (go, args) => {
            return LIBRARY["map"](go, args).reduce((a, b) => a.concat(b), [])
        }
    }

function compile(source) {
    var ast = str2sexprs(source)[0]
    console.log(ast)
    ast = eval(LIBRARY, ast)

    applyDefaults(ast)
    lookupParts(ast)
    adjustPositions(ast)

    // TODO check no two pins in the same hole

    Object.freeze(ast)
    return ast
}


function applyDefaults(ast) {
    ast.dips.forEach((dip) => {
        if (dip.flip === undefined) { dip.flip = false }
    })
    ast.wires.forEach((wire) => {
        if (wire.route === undefined) { wire.route = [] }
    })
}

function lookupParts(ast) {
    ast.dips.forEach((dip) => {
        var partinfo = PINS_BY_PART[dip.partno]
        dip.pins = partinfo.pins
        dip.width = partinfo.width
    })
}

function adjustPositions(ast) {
    ast.dips.forEach((dip) => {
        dip.start[0]--
        if (typeof dip.start[1] !== "number") {
            dip.start[1] = COL_BY_NAME[dip.start[1]]
        }
    })
    ast.wires.forEach((wire) => {
        wire.start[0]--
        if (typeof wire.start[1] !== "number") {
            wire.start[1] = COL_BY_NAME[wire.start[1]]
        }
        wire.route.forEach((point) => {
            point[0]--
            if (typeof point[1] !== "number") {
                point[1] = COL_BY_NAME[point[1]]
            }
        })
        wire.stop[0]--
        if (typeof wire.stop[1] !== "number") {
            wire.stop[1] = COL_BY_NAME[wire.stop[1]]
        }
    })
    ast.headers.forEach((header) => {
        header.at[0]--
        if (typeof header.at[1] !== "number") {
            header.at[1] = COL_BY_NAME[header.at[1]]
        }
    })
}
