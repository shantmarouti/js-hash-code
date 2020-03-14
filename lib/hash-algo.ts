import crc from "crc";
import crypto from "crypto";
export type HashAlgorithm =
    | "md2"
    | "md5"
    | "mdc2"
    | "rmd160"
    | "sha"
    | "sha1"
    | "sha224"
    | "sha256"
    | "sha384"
    | "sha512"
    | "crc1"
    | "crc8"
    | "crc16"
    | "crc24"
    | "crc32"
    | "djb2"
    | "sdbm"
    | "lose";

export function selectHashAlgorithm(algorithm?: HashAlgorithm) {
    switch (algorithm) {
        case "md2":
        case "md5":
        case "mdc2":
        case "rmd160":
        case "sha":
        case "sha1":
        case "sha224":
        case "sha256":
        case "sha384":
        case "sha512":
            return function(str: string) {
                return crypto
                    .createHash(algorithm)
                    .update(str)
                    .digest("hex");
            };

        case "crc1":
        case "crc8":
        case "crc16":
        case "crc24":
        case "crc32":
            return function(str: string) {
                return crc[algorithm](str).toString(16);
            };

        case "djb2":
            return function(str: string) {
                let hash = 5381;
                for (let i = 0; i < str.length; i++) {
                    hash = (hash << 5) + hash + str.charCodeAt(i);
                }
                return hash.toString(16);
            };

        case "sdbm":
            return function(str: string) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash =
                        str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
                }
                return hash.toString(16);
            };

        case "lose":
            return function(str: string) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash += str.charCodeAt(i);
                }
                return hash.toString(16);
            };

        default:
            return function(str: string) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = (hash << 5) - hash + str.charCodeAt(i);
                    hash = hash & hash;
                }
                return hash.toString(16);
            };
    }
}
