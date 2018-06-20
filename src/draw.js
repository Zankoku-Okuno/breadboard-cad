import { PITCH } from "./config.js"


function point(dom, row, col) {
    const point = document.createSvgElement("circle")
    point.setAttribute("cx", PITCH * row)
    point.setAttribute("cy", PITCH * col)
    point.setAttribute("r", PITCH/4)
    dom.appendChild(point)
    return point
}


function wire(dom, wire) {
    point(dom, wire.start[0], wire.start[1]).setAttribute("fill", wire.color)
    point(dom, wire.stop[0], wire.stop[1]).setAttribute("fill", wire.color)

    let d = "M "+(wire.start[0]*PITCH)+" "+(wire.start[1]*PITCH)
    wire.route.forEach((point) => {
        d += " L "+(point[0]*PITCH)+" "+(point[1]*PITCH)
    })
    d += " L "+(wire.stop[0]*PITCH)+" "+(wire.stop[1]*PITCH)
    const line = document.createSvgElement("path")
    line.setAttribute("d", d)
    line.setAttribute("stroke", wire.color)
    dom.appendChild(line)
}


function header(dom, header) {
    const point = document.createSvgElement("rect")
    point.setAttribute("x", (header.at[0] - 2/5)*PITCH)
    point.setAttribute("y", (header.at[1] - 2/5)*PITCH)
    point.setAttribute("width", (4/5)*PITCH)
    point.setAttribute("height", (4/5)*PITCH)
    const title = document.createSvgElement("title")
    title.textContent = header.name
    point.appendChild(title)
    point.setAttribute("fill", header.color)
    dom.appendChild(point)
}

function dip(dom, dip) {
    const x1 = dip.start[0]
    const y1 = dip.start[1]
    const x2 = dip.start[0] + dip.pins.length/2 - 1
    const y2 = dip.start[1] - dip.width

    // packaging
    const pkg = document.createSvgElement("rect")
    pkg.setAttribute("x", x1*PITCH - (2/5)*PITCH)
    pkg.setAttribute("y", y2*PITCH)
    pkg.setAttribute("width", (dip.pins.length/2 - 1)*PITCH + 2*(2/5)*PITCH)
    pkg.setAttribute("height", (dip.width)*PITCH)
    dom.appendChild(pkg)
    // pins
    // these go over the package so that they are more easily tooltipped-over
    for (let i = 0; i < dip.pins.length / 2; ++i) {
        const topPoint = point(dom, x1 + i, y2)
        const topTooltip = document.createSvgElement("title")
        topTooltip.textContent = dip.pins[dip.pins.length - 1 - i]
        topPoint.appendChild(topTooltip)

        const botPoint = point(dom, x1 + i, y1)
        const botTooltip = document.createSvgElement("title")
        botTooltip.textContent = dip.pins[i]
        botPoint.appendChild(botTooltip)
    }
    // labels
    const name = document.createSvgElement("text")
    name.textContent = dip.name
    name.setAttribute("x", x1*PITCH)
    name.setAttribute("y", (y2+1)*PITCH)
    dom.appendChild(name)
    const partno = document.createSvgElement("text")
    partno.textContent = dip.partno
    partno.setAttribute("x", x1*PITCH)
    partno.setAttribute("y", (y2+2)*PITCH)
    dom.appendChild(partno)
    // pin 1 indicator
    const indicator = document.createSvgElement("circle")
    let indicatorX, indicatorY
    if (dip.flip) {
        indicatorX = x2*PITCH - (1/5)*PITCH
        indicatorY = (y2+0.5)*PITCH
    }
    else {
        indicatorX = x1*PITCH + (1/5)*PITCH
        indicatorY = (y1-0.5)*PITCH
    }
    indicator.setAttribute("cx", indicatorX)
    indicator.setAttribute("cy", indicatorY)
    indicator.setAttribute("r", PITCH/6)
    indicator.setAttribute("class", "indicator")
    dom.appendChild(indicator)
}


export { point, wire, header, dip }
