import * as Hi from "./hello.js"

window.foo = Hi
Hi.hi()


function* a() {
  yield 1;
}

let it = a()
console.log(it.next())