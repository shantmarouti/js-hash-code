import util from "util";
import { HashAlgorithm, selectHashAlgorithm } from "./hash-algo";

function isObject(value: any): boolean {
    if (value == null) {
        return false;
    }

    if (Array.isArray(value)) {
        return true;
    }

    if (typeof value !== "object") {
        return false;
    }

    if (value.toString() !== "[object Object]") {
        return false;
    }

    return true;
}

function valueToString(value: any, _set: any): string {
    return (
        Object.prototype.toString.call(value) +
        (value == null ? util.inspect(value) : value.toString())
    );
}

function toString(obj: any, set: any): any {
    return isObject(obj)
        ? "@" + objectToString(obj, set)
        : valueToString(obj, set);
}

function objectToString(obj: any, set: any): string {
    let ary = [];
    for (let key in obj) {
        ary.push((set && +key >= 0 ? "" : key) + toString(obj[key], set));
    }

    return (set ? "" : Object.prototype.toString.call(obj)) + ary.sort();
}

function mask(str: string): string {
    let hash = "";
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i).toString(16);
    }
    return hash;
}

export function hash(obj: any, algorithm: HashAlgorithm | Function, set?: any) {
    let custom = typeof algorithm == "function";
    let algo =
        algorithm == null || typeof algorithm == "string"
            ? selectHashAlgorithm(algorithm)
            : algorithm;
    if (typeof algo != "function") {
        set = algo;
        algo = selectHashAlgorithm();
    }

    if (typeof set != "boolean") {
        set = false;
    }

    let str = toString(obj, set);
    return algo(custom ? mask(str) : str);
}
