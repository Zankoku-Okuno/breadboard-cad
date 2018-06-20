// import * as Pinout from "pinout.js"

PITCH = 18
COL_BY_NAME = {
    "A": 11, "A.5": 11+0.5,
    "B": 10, "B.5": 10+0.5,
    "C": 9, "C.5": 9+0.5,
    "D": 8, "D.5": 8+0.5,
    "E": 7, "E.5": 7+0.5,
    "F": 4, "F.5": 4-0.5,
    "G": 3, "G.5": 3-0.5,
    "H": 2, "H.5": 2-0.5,
    "I": 1, "I.5": 1-0.5,
    "J": 0, "J.5": 0-0.5,
    "-T": -4, "+T": -3,
    "-B": 14, "+B": 15,
}



document.createSvgElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag)



function drawBreadboard(dom) {
    // main holes
    for (var i = 0; i < 63; ++i) {
        for (var j = 0; j < 5; ++j) {
            drawPoint(dom, i, j)
            drawPoint(dom, i, j + 7)
        }
    }
    // power rail holes
    for (var i = 0, offset = 2; i < 10; ++i, ++offset) {
        for (var j = 0; j < 5; ++j) {
            ;["-T", "+T", "-B", "+B"].forEach((col) => {
                drawPoint(dom, i*5 + j + offset, COL_BY_NAME[col])
            })
        }
    }
    // column labels
    "ABCDEFGHIJ".split("").forEach((col) => {
        ;[-1, 63].forEach((row) => {
            var label = document.createSvgElement("text")
            label.textContent = col
            label.setAttribute("x", row*PITCH)
            label.setAttribute("y", (COL_BY_NAME[col] + 2/5)*PITCH)
            dom.appendChild(label)
        })
    })
    //row labels
    for (var i = 0; i < 63; i += (i === 0 ? 4 : 5)) {
        ;[["A", 1.5], ["J", -1]].forEach((entry) => {
            var label = document.createSvgElement("text")
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
                var label = document.createSvgElement("text")
                label.textContent = polarity
                label.setAttribute("x", row*PITCH)
                label.setAttribute("y", (COL_BY_NAME[polarity+side] + 1/5)*PITCH)
                dom.appendChild(label)
            })
        })
    })
}



function render(ast, dom) {
    ast.dips.forEach((dip) => drawDip(dom.components, dip))
    ast.wires.forEach((wire) => drawWire(dom.wires, wire))
    ast.headers.forEach((header) => drawHeader(dom.wires, header))
}


function updateFromSource(dom) {
    var source = dom.sourcecode.value
    var ast = compile(source)
    dom.components.innerHTML = ""
    dom.wires.innerHTML = ""
    render(ast,
        { components: dom.components
        , wires: dom.wires
        })
}



document.addEventListener("DOMContentLoaded", () => {
    var dom =
        { holes: document.querySelector("#holes")
        , sourcecode: document.querySelector("#sourcecode")
        , components: document.querySelector("#components")
        , wires: document.querySelector("#wires")
        }


    drawBreadboard(dom.holes)

    updateFromSource(dom)
    dom.sourcecode.addEventListener("input", () => updateFromSource(dom))
})
