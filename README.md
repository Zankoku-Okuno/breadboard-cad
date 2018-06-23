# Breadboard CAD

Parametric computer-aided design software for breadboard layouts that runs in the browser.

At the moment, there isn't really a GUI, just a textarea in which you can describe your circuit in a Lisp-like language.

## Building

The build system requires node version 8+ (it may work with 6+, but that hasn't been tested).

Install the package prerequisites.
Then, run `npm run build` to generate the `dist/` files.
The final site consists of `main.html`, `main.css`, `partinfo.js`, and `dist/`.

An example circuit is given in `test.sexpr`.
Once loading the site in your browser, copy-paste the contents of the file into the textarea.
The image at the top of the page should alter to show a number of ICs and wires.
