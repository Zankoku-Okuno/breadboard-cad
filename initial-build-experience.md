Two light days of work and I have build a useful prototype breadboard CAD tool.

I know it's useful because I have used it.
I started out now knowing how I would build Sigma8's register file (or portions thereof), but by using the tool, I figured it out.
I designed everything about a functional cascadable 4 x 8-bit register file.
Not only that, but my initial design wasn't correct (I had forgot about the active-low demux output vs. the active-high load enable pins of the specific chips I'm using).
I therefore had to iterate on my design, and I was able to with ease.

The question is, why has nobody built anything like this before?
It is that nobody expects a programmer to be designing hardware (even though hardware is just fast software)?
Is it that the existing tools work "well enough" for most people (though that didn't stop TeX)?
Is it that it exists but I haven't found it, or haven't found the features?
