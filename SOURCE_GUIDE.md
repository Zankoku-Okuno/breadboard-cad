The point of the application is to visualize a circuit before ordering parts and building it.
Well, the point is to understand the circuit, and visualization helps a lot with understanding the geometry, but it could be useful to later produce netlists or simulators, test electrical properties, confirm the generated netlist against a given netlist, and so on.

The inputs of the application are:
    * some basic configuration
    * a description of the geometry of the mounting medium
    * a library of known integrated chip parts
    * a description of the circuit

The fundamental processing flow for each input is `parse s-expression -> evaluate s-expression with a custom prelude -> elaborate with libraries and defaults -> render`.


For now, many of these inputs are hardwired.
The basic configuration is given in `src/config.js`.
The "mounting medium", as I'm calling it, is a breadboard, perfboard, stripboard, PCB, &c.
Currently, only breadboards are supported, and in only one shape; later versions should allow the mounting medium geometry to be described using s-expressions.
The library of ICs is given in a file not managed by Webpack, `partinfo.js`; later, parts should be describable using s-expressions.
The circuit desciption is not hardwired: it is input in the textarea on the webpage.


S-expressions are dealt with in their entirety in `src/sexpr/`.
This could (and perhaps should) be a separate module from the rest of the application.

The circuit description is understood by the application through several transform layers.
First, the source code string is parsed into an s-expression.
Next, the s-expression is evaluated to give a simple Javascript object.
Finally, that object is examined and adjusted to ease any renderer's job.
This includes (at the moment) inlining part information, filling in defaults, and altering index semantics.
Aside from the s-expression parsing (which is in the dedicated `src/sexpr/`), all of this logic is implemented in `src/circuit/`.

Utilities for producing SVG from the output of circuit compilation is done in `src/draw.js`.

So far, each module has been essentially independent of all others (save for `src/circuit` relying on `src/sexpr`).
These modules are glued together in `src/main.js`, which also sets up interactivity in the DOM.
One thing of note is that `src/main.js` modifies the `document` object to add a `createSvgElement` method, since the regular `document.createElement` requires passing a namespace to create svg elements.
The fact that `src/main.js` is handling multiple concerns isn't great, but it'll do for now.