First, I had to install a halfway recent version of node.
The debian repos have version 4, which fails to run webpack 4.
I used a [NodeSource](https://github.com/nodesource/distributions#installation-instructions) script to connect to a PPA with newer node versions.
That comes with npm and npx.

Next up is initializing a node package: `npm init -y`.
Apparently, it should be a private package (private: true, no main property).
This package contains the entire application.
Since node packages can have development dependencies, it's also the build script, which is kinda nice.

When node build stuff, it creates a `package-lock.json` file.
This is a list of the exact packages it has resolved and installed, for later use in reproducing the build.
Apparently, best practice is to commit this into version control, but that can also cause messy diffs and merge conflicts.
Personally, I don't think dependencies should be added often or carelessly, so I'm not so worried about conflicts, and the messiness of the diff is restricted to one file.

Next, we add webpack to the dev deps: `npm install webpack webpack-cli --save-dev`.
We can also set up src/ and dist/ folders here.
You can run webpack with `npx webpack [entry point]?`.
If you add `scripts: { ..., build: "webpack", ...}` to the package.json, then you can also invoke webpack as `npm run build`.

Best practice is to use a webpack.config.js file, and it's probably necessary for having nice things like es6 in the browser.
A basic config file will set the entry point with `module.exports.entry` and the output filename and filepath with `module.exports.output.{filename, path}`.

Now we get into loaders.
I don't trust the proliferation of trendy js technologies.
Therefore, I'll mostly limit myself to es6 and polyfill up to the latest WebAPI standards.

First, install babel: `npm install babel-core babel-loader babel-preset-env --save-dev`.
Next, configure babel through a `.babelrc` file; it'll likely be easier to do it there than try to shove it into the webpack configuration.
Now, set up a webpack rule that runs your source code through the babel-loader.

Now, I guess we install something which apparently get us some runtime support needed for bits of es6: `npm install bable-polyfill --save`.
Note that this is `--save`, not `--save-dev`.
For one thig, this seems to give support for generators.
I'm not sure if async/await support is included here, or anything else for that matter, but it is ~85KiB of code, so that's fun.
