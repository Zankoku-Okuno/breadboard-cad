import { PITCH } from "./config.js"


function drawPoint(dom, row, col) {
    var point = document.createSvgElement("circle")
    point.setAttribute("cx", PITCH * row)
    point.setAttribute("cy", PITCH * col)
    point.setAttribute("r", PITCH/4)
    dom.appendChild(point)
    return point
}


function drawWire(dom, wire) {
    drawPoint(dom, wire.start[0], wire.start[1]).setAttribute("fill", wire.color)
    drawPoint(dom, wire.stop[0], wire.stop[1]).setAttribute("fill", wire.color)

    var d = "M "+(wire.start[0]*PITCH)+" "+(wire.start[1]*PITCH)
    wire.route.forEach((point) => {
        d += " L "+(point[0]*PITCH)+" "+(point[1]*PITCH)
    })
    d += " L "+(wire.stop[0]*PITCH)+" "+(wire.stop[1]*PITCH)
    var line = document.createSvgElement("path")
    line.setAttribute("d", d)
    line.setAttribute("stroke", wire.color)
    dom.appendChild(line)
}


function drawHeader(dom, header) {
    var point = document.createSvgElement("rect")
    point.setAttribute("x", (header.at[0] - 2/5)*PITCH)
    point.setAttribute("y", (header.at[1] - 2/5)*PITCH)
    point.setAttribute("width", (4/5)*PITCH)
    point.setAttribute("height", (4/5)*PITCH)
    var title = document.createSvgElement("title")
    title.textContent = header.name
    point.appendChild(title)
    point.setAttribute("fill", header.color)
    dom.appendChild(point)
}

function drawDip(dom, dip) {
    var x1 = dip.start[0]
    var y1 = dip.start[1]
    var x2 = dip.start[0] + dip.pins.length/2 - 1
    var y2 = dip.start[1] - dip.width

    // packaging
    var pkg = document.createSvgElement("rect")
    pkg.setAttribute("x", x1*PITCH - (2/5)*PITCH)
    pkg.setAttribute("y", y2*PITCH)
    pkg.setAttribute("width", (dip.pins.length/2 - 1)*PITCH + 2*(2/5)*PITCH)
    pkg.setAttribute("height", (dip.width)*PITCH)
    dom.appendChild(pkg)
    // pins
    // these go over the package so that they are more easily tooltipped-over
    for (var i = 0; i < dip.pins.length / 2; ++i) {
        var topPoint = drawPoint(dom, x1 + i, y2)
        var topTooltip = document.createSvgElement("title")
        topTooltip.textContent = dip.pins[dip.pins.length - 1 - i]
        topPoint.appendChild(topTooltip)

        var botPoint = drawPoint(dom, x1 + i, y1)
        var botTooltip = document.createSvgElement("title")
        botTooltip.textContent = dip.pins[i]
        botPoint.appendChild(botTooltip)
    }
    // labels
    var name = document.createSvgElement("text")
    name.textContent = dip.name
    name.setAttribute("x", x1*PITCH)
    name.setAttribute("y", (y2+1)*PITCH)
    dom.appendChild(name)
    var partno = document.createSvgElement("text")
    partno.textContent = dip.partno
    partno.setAttribute("x", x1*PITCH)
    partno.setAttribute("y", (y2+2)*PITCH)
    dom.appendChild(partno)
    // pin 1 indicator
    var indicator = document.createSvgElement("circle")
    if (dip.flip) {
        var indicatorX = x2*PITCH - (1/5)*PITCH
        var indicatorY = (y2+0.5)*PITCH
    }
    else {
        var indicatorX = x1*PITCH + (1/5)*PITCH
        var indicatorY = (y1-0.5)*PITCH
    }
    indicator.setAttribute("cx", indicatorX)
    indicator.setAttribute("cy", indicatorY)
    indicator.setAttribute("r", PITCH/6)
    indicator.setAttribute("class", "indicator")
    dom.appendChild(indicator)
}


export { drawPoint, drawWire, drawHeader, drawDip }
