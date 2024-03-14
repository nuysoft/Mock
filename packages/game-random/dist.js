import { random } from "./dist/index.js";
import alea from "seedrandom";
const a = random(0, 100, "2");
const b = random(0, 100, "3");
console.log(a, b, alea("3").quick(), alea("2").quick());
