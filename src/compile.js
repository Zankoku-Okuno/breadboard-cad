import { COL_BY_NAME } from "./config.js"
import * as SExpr from "./sexpr.js"
import { strictly } from "./sexpr.js"


const PRELUDE =
    { "+": strictly((args) => args.reduce(Array.isArray(args[0]) ? (a, b) => a.concat(b) : (a, b) => a + b))
    , "-": strictly((args) => args.length === 1 ? -args[0] : args[1] - args[0])
    , "*": strictly((args) => args.reduce((a, b) => a * b))
    , "%": strictly((args) => args[1] % args[0])
    , ".": strictly((args) => args[0][args[1]])
    , "=?": strictly((args) => args[0] === args[1])
    , "DEBUG": strictly((args) => { console.log(args[0]); return args[0] })
    , "cat": strictly((args) => args[0].reduce((a, b) => a.concat(b)))
    , "let": (go, args) => {
            const binds = args[0]
            const body = args[1]

            const local = {}
            for (let i = 0, e = binds.length; i < e; i += 2) {
                local[binds[i].__VAR__] = SExpr.eval(go.env(local), binds[i+1])
            }

            return SExpr.eval(go.env(local), body)
        }
    , "cond": (go, args) => {
            for (let i = 0; i < args.length; i += 2) {
                if (go(args[i]) === true) {
                    return go(args[i+1])
                }
            }
            return false
        }
    , "map": (go, args) => {
            let i, x
            if (Array.isArray(args[0])) {
                i = args[0][0].__VAR__
                x = args[0][1].__VAR__
            }
            else {
                i = undefined
                x = args[0].__VAR__
            }
            const over = go(args[1])
            const body = args[2]

            return over.map((item, ix) => {
                const  local = { [i]: ix, [x]: go(item) }
                return SExpr.eval(go.env(local), body)
            })
        }
    , "catMap": (go, args) => {
            return PRELUDE["map"](go, args).reduce((a, b) => a.concat(b), [])
        }
    }

function compile(source) {
    const ast = SExpr.fromStr(source)[0]
    const circuit = SExpr.eval(PRELUDE, ast)

    applyDefaults(circuit)
    lookupParts(circuit)
    adjustPositions(circuit)

    // TODO check no two pins in the same hole

    Object.freeze(circuit)
    return circuit
}


function applyDefaults(circuit) {
    circuit.dips.forEach((dip) => {
        if (dip.flip === undefined) { dip.flip = false }
    })
    circuit.wires.forEach((wire) => {
        if (wire.route === undefined) { wire.route = [] }
    })
}

function lookupParts(circuit) {
    circuit.dips.forEach((dip) => {
        const partinfo = PINS_BY_PART[dip.partno]
        if (partinfo === undefined) { throw `unknown part: ${dip.partno}` }
        dip.pins = partinfo.pins
        dip.width = partinfo.width
    })
}

function adjustPositions(circuit) {
    circuit.dips.forEach((dip) => {
        dip.start[0]--
        if (typeof dip.start[1] !== "number") {
            dip.start[1] = COL_BY_NAME[dip.start[1]]
        }
    })
    circuit.wires.forEach((wire) => {
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
    circuit.headers.forEach((header) => {
        header.at[0]--
        if (typeof header.at[1] !== "number") {
            header.at[1] = COL_BY_NAME[header.at[1]]
        }
    })
}


export { compile }
