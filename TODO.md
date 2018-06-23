# To-do

This project is liable to get really ambitious really quickly.
Milestones are therefore essential to keeping my sanity.

    * Non-IC components (resistors, caps, pots, switches, buttons, lights, &c)
    * Custom component geometries, both IC and non-IC
    * User-supplied parts library
    * User-supplied board geometry and connectivity
    * PCB gemometries
    * Schematic (non-geometrical) design
    * Toggle display of part groups (this is an opportunity to learn CSSOM)
    * Separate styling of parts from description (probably using groups)
    * GUI placement interfaces
    * Create and combine sub-designs
    * Generate bill-of-goods
    * Generate HDL, netlist, or simulator
    * Generate silkscreen
    * Test geometry for sanity
    * Specify and test electrical characteristics
    * Automatically route wires based on connectivity description


## Cleanup

I should come up with a style guide.
At this point, all I know is that I want to use my crazy indentation and that const and frozen objects should be used wherever possible.
I suppose I should have a standard for fixmes also.

I need some documentation generator.
I'm hoping webpack can deliver.

Write a proper top-down parser instead of that hacked-together stack-based parser.
Ultimately, I'd like the parser description to look a lot like a BNF grammar.

Flesh out the language.
At the moment, documentation is scant, which is a serious problem.
A good library of list manipulation function is key for parametric design.
A good start is: map, reduce, filter/exclude, zip, group.
String manipulation is not so important, I think, but numerical functions are definitely useful.
List comprehensions might be good to have as well.
I think I don't want full first-class functions, but first-order functions with closure could come in handy.
Error reporting is piss-poor at the moment.

Sometimes when there's an error in parsing or compilation, updates to the textarea stop triggering re-compilation.
In any case, there is not currently an indication for when the compilation fails apart from the console.