import { COL_BY_NAME } from "../config.js"
import * as SExpr from "../sexpr.js"
import { PRELUDE } from "./prelude.js"


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
