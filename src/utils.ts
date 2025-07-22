import * as cheerio from "cheerio";

export function isValidURL( url : string ) : boolean {
    if( !(url.startsWith('http://') || url.startsWith('https://')) ) { return false; }
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}