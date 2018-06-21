import * as SExpr from "../sexpr.js"
import { strictly } from "../sexpr.js"


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


export { PRELUDE }