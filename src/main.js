import { PITCH, COL_BY_NAME } from "./config.js"
import { compile } from "./circuit/compile.js"
import * as Draw from "./draw.js"





document.createSvgElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag)



function drawBreadboard(dom) {
    // main holes
    for (let i = 0; i < 63; ++i) {
        for (let j = 0; j < 5; ++j) {
            Draw.point(dom, i, j)
            Draw.point(dom, i, j + 7)
        }
    }
    // power rail holes
    for (let i = 0, offset = 2; i < 10; ++i, ++offset) {
        for (let j = 0; j < 5; ++j) {
            ;["-T", "+T", "-B", "+B"].forEach((col) => {
                Draw.point(dom, i*5 + j + offset, COL_BY_NAME[col])
            })
        }
    }
    // column labels
    "ABCDEFGHIJ".split("").forEach((col) => {
        ;[-1, 63].forEach((row) => {
            const label = document.createSvgElement("text")
            label.textContent = col
            label.setAttribute("x", row*PITCH)
            label.setAttribute("y", (COL_BY_NAME[col] + 2/5)*PITCH)
            dom.appendChild(label)
        })
    })
    //row labels
    for (let i = 0; i < 63; i += (i === 0 ? 4 : 5)) {
        ;[["A", 1.5], ["J", -1]].forEach((entry) => {
            const label = document.createSvgElement("text")
            label.textContent = i+1
            label.setAttribute("x", i*PITCH)
            label.setAttribute("y", (COL_BY_NAME[entry[0]] + entry[1])*PITCH)
            dom.appendChild(label)
        })
    }
    // power rail labels
    ;[1, 61].forEach((row) => {
        ;["T", "B"].forEach((side) => {
            ;["-", "+"].forEach((polarity) => {
                const label = document.createSvgElement("text")
                label.textContent = polarity
                label.setAttribute("x", row*PITCH)
                label.setAttribute("y", (COL_BY_NAME[polarity+side] + 1/5)*PITCH)
                dom.appendChild(label)
            })
        })
    })
}



function render(ast, dom) {
    ast.dips.forEach((dip) => Draw.dip(dom.components, dip))
    ast.wires.forEach((wire) => Draw.wire(dom.wires, wire))
    ast.headers.forEach((header) => Draw.header(dom.wires, header))
}


function updateFromSource(dom) {
    const source = dom.sourcecode.value
    const circuit = compile(source)
    dom.components.innerHTML = ""
    dom.wires.innerHTML = ""
    render(circuit,
        { components: dom.components
        , wires: dom.wires
        })
}



document.addEventListener("DOMContentLoaded", () => {
    const dom =
        { holes: document.querySelector("#holes")
        , sourcecode: document.querySelector("#sourcecode")
        , components: document.querySelector("#components")
        , wires: document.querySelector("#wires")
        }
    Object.freeze(dom)


    drawBreadboard(dom.holes)

    updateFromSource(dom)
    dom.sourcecode.addEventListener("input", () => updateFromSource(dom))
})
