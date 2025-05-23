/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */
!function webpackUniversalModuleDefinition(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("pdfjs-dist/build/pdf", [], t) : "object" == typeof exports ? exports["pdfjs-dist/build/pdf"] = t() : e["pdfjs-dist/build/pdf"] = e.pdfjsLib = t()
}(this, (function() {
    return (()=>{
        "use strict";
        var __webpack_modules__ = [, (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.addLinkAttributes = function addLinkAttributes(e, {url: t, target: s, rel: n, enabled: a=!0}={}) {
                (0,
                r.assert)(t && "string" == typeof t, 'addLinkAttributes: A valid "url" parameter must provided.');
                const o = (0,
                r.removeNullCharacters)(t);
                if (a)
                    e.href = e.title = o;
                else {
                    e.href = "";
                    e.title = `Disabled: ${o}`;
                    e.onclick = ()=>!1
                }
                let l = "";
                switch (s) {
                case i.NONE:
                    break;
                case i.SELF:
                    l = "_self";
                    break;
                case i.BLANK:
                    l = "_blank";
                    break;
                case i.PARENT:
                    l = "_parent";
                    break;
                case i.TOP:
                    l = "_top"
                }
                e.target = l;
                e.rel = "string" == typeof n ? n : "noopener noreferrer nofollow"
            }
            ;
            t.deprecated = function deprecated(e) {
                console.log("Deprecated API usage: " + e)
            }
            ;
            t.getFilenameFromUrl = function getFilenameFromUrl(e) {
                const t = e.indexOf("#")
                  , s = e.indexOf("?")
                  , r = Math.min(t > 0 ? t : e.length, s > 0 ? s : e.length);
                return e.substring(e.lastIndexOf("/", r) + 1, r)
            }
            ;
            t.getPdfFilenameFromUrl = function getPdfFilenameFromUrl(e, t="document.pdf") {
                if ("string" != typeof e)
                    return t;
                if (isDataScheme(e)) {
                    (0,
                    r.warn)('getPdfFilenameFromUrl: ignore "data:"-URL for performance reasons.');
                    return t
                }
                const s = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i
                  , n = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/.exec(e);
                let a = s.exec(n[1]) || s.exec(n[2]) || s.exec(n[3]);
                if (a) {
                    a = a[0];
                    if (a.includes("%"))
                        try {
                            a = s.exec(decodeURIComponent(a))[0]
                        } catch (e) {}
                }
                return a || t
            }
            ;
            t.getXfaPageViewport = function getXfaPageViewport(e, {scale: t=1, rotation: s=0}) {
                const {width: r, height: n} = e.attributes.style
                  , a = [0, 0, parseInt(r), parseInt(n)];
                return new PageViewport({
                    viewBox: a,
                    scale: t,
                    rotation: s
                })
            }
            ;
            t.isDataScheme = isDataScheme;
            t.isPdfFile = function isPdfFile(e) {
                return "string" == typeof e && /\.pdf$/i.test(e)
            }
            ;
            t.isValidFetchUrl = isValidFetchUrl;
            t.loadScript = function loadScript(e, t=!1) {
                return new Promise(((s,r)=>{
                    const n = document.createElement("script");
                    n.src = e;
                    n.onload = function(e) {
                        t && n.remove();
                        s(e)
                    }
                    ;
                    n.onerror = function() {
                        r(new Error(`Cannot load script at: ${n.src}`))
                    }
                    ;
                    (document.head || document.documentElement).appendChild(n)
                }
                ))
            }
            ;
            t.StatTimer = t.RenderingCancelledException = t.PixelsPerInch = t.PDFDateString = t.PageViewport = t.LinkTarget = t.DOMSVGFactory = t.DOMStandardFontDataFactory = t.DOMCMapReaderFactory = t.DOMCanvasFactory = void 0;
            var r = s(2)
              , n = s(5);
            const a = {
                CSS: 96,
                PDF: 72,
                get PDF_TO_CSS_UNITS() {
                    return (0,
                    r.shadow)(this, "PDF_TO_CSS_UNITS", this.CSS / this.PDF)
                }
            };
            t.PixelsPerInch = a;
            class DOMCanvasFactory extends n.BaseCanvasFactory {
                constructor({ownerDocument: e=globalThis.document}={}) {
                    super();
                    this._document = e
                }
                _createCanvas(e, t) {
                    const s = this._document.createElement("canvas");
                    s.width = e;
                    s.height = t;
                    return s
                }
            }
            t.DOMCanvasFactory = DOMCanvasFactory;
            async function fetchData(e, t=!1) {
                if (isValidFetchUrl(e, document.baseURI)) {
                    const s = await fetch(e);
                    if (!s.ok)
                        throw new Error(s.statusText);
                    return t ? new Uint8Array(await s.arrayBuffer()) : (0,
                    r.stringToBytes)(await s.text())
                }
                return new Promise(((s,n)=>{
                    const a = new XMLHttpRequest;
                    a.open("GET", e, !0);
                    t && (a.responseType = "arraybuffer");
                    a.onreadystatechange = ()=>{
                        if (a.readyState === XMLHttpRequest.DONE) {
                            if (200 === a.status || 0 === a.status) {
                                let e;
                                t && a.response ? e = new Uint8Array(a.response) : !t && a.responseText && (e = (0,
                                r.stringToBytes)(a.responseText));
                                if (e) {
                                    s(e);
                                    return
                                }
                            }
                            n(new Error(a.statusText))
                        }
                    }
                    ;
                    a.send(null)
                }
                ))
            }
            class DOMCMapReaderFactory extends n.BaseCMapReaderFactory {
                _fetchData(e, t) {
                    return fetchData(e, this.isCompressed).then((e=>({
                        cMapData: e,
                        compressionType: t
                    })))
                }
            }
            t.DOMCMapReaderFactory = DOMCMapReaderFactory;
            class DOMStandardFontDataFactory extends n.BaseStandardFontDataFactory {
                _fetchData(e) {
                    return fetchData(e, !0)
                }
            }
            t.DOMStandardFontDataFactory = DOMStandardFontDataFactory;
            class DOMSVGFactory extends n.BaseSVGFactory {
                _createSVG(e) {
                    return document.createElementNS("http://www.w3.org/2000/svg", e)
                }
            }
            t.DOMSVGFactory = DOMSVGFactory;
            class PageViewport {
                constructor({viewBox: e, scale: t, rotation: s, offsetX: r=0, offsetY: n=0, dontFlip: a=!1}) {
                    this.viewBox = e;
                    this.scale = t;
                    this.rotation = s;
                    this.offsetX = r;
                    this.offsetY = n;
                    const i = (e[2] + e[0]) / 2
                      , o = (e[3] + e[1]) / 2;
                    let l, c, h, d, u, p, g, f;
                    (s %= 360) < 0 && (s += 360);
                    switch (s) {
                    case 180:
                        l = -1;
                        c = 0;
                        h = 0;
                        d = 1;
                        break;
                    case 90:
                        l = 0;
                        c = 1;
                        h = 1;
                        d = 0;
                        break;
                    case 270:
                        l = 0;
                        c = -1;
                        h = -1;
                        d = 0;
                        break;
                    case 0:
                        l = 1;
                        c = 0;
                        h = 0;
                        d = -1;
                        break;
                    default:
                        throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.")
                    }
                    if (a) {
                        h = -h;
                        d = -d
                    }
                    if (0 === l) {
                        u = Math.abs(o - e[1]) * t + r;
                        p = Math.abs(i - e[0]) * t + n;
                        g = Math.abs(e[3] - e[1]) * t;
                        f = Math.abs(e[2] - e[0]) * t
                    } else {
                        u = Math.abs(i - e[0]) * t + r;
                        p = Math.abs(o - e[1]) * t + n;
                        g = Math.abs(e[2] - e[0]) * t;
                        f = Math.abs(e[3] - e[1]) * t
                    }
                    this.transform = [l * t, c * t, h * t, d * t, u - l * t * i - h * t * o, p - c * t * i - d * t * o];
                    this.width = g;
                    this.height = f
                }
                clone({scale: e=this.scale, rotation: t=this.rotation, offsetX: s=this.offsetX, offsetY: r=this.offsetY, dontFlip: n=!1}={}) {
                    return new PageViewport({
                        viewBox: this.viewBox.slice(),
                        scale: e,
                        rotation: t,
                        offsetX: s,
                        offsetY: r,
                        dontFlip: n
                    })
                }
                convertToViewportPoint(e, t) {
                    return r.Util.applyTransform([e, t], this.transform)
                }
                convertToViewportRectangle(e) {
                    const t = r.Util.applyTransform([e[0], e[1]], this.transform)
                      , s = r.Util.applyTransform([e[2], e[3]], this.transform);
                    return [t[0], t[1], s[0], s[1]]
                }
                convertToPdfPoint(e, t) {
                    return r.Util.applyInverseTransform([e, t], this.transform)
                }
            }
            t.PageViewport = PageViewport;
            class RenderingCancelledException extends r.BaseException {
                constructor(e, t) {
                    super(e, "RenderingCancelledException");
                    this.type = t
                }
            }
            t.RenderingCancelledException = RenderingCancelledException;
            const i = {
                NONE: 0,
                SELF: 1,
                BLANK: 2,
                PARENT: 3,
                TOP: 4
            };
            t.LinkTarget = i;
            function isDataScheme(e) {
                const t = e.length;
                let s = 0;
                for (; s < t && "" === e[s].trim(); )
                    s++;
                return "data:" === e.substring(s, s + 5).toLowerCase()
            }
            t.StatTimer = class StatTimer {
                constructor() {
                    this.started = Object.create(null);
                    this.times = []
                }
                time(e) {
                    e in this.started && (0,
                    r.warn)(`Timer is already running for ${e}`);
                    this.started[e] = Date.now()
                }
                timeEnd(e) {
                    e in this.started || (0,
                    r.warn)(`Timer has not been started for ${e}`);
                    this.times.push({
                        name: e,
                        start: this.started[e],
                        end: Date.now()
                    });
                    delete this.started[e]
                }
                toString() {
                    const e = [];
                    let t = 0;
                    for (const e of this.times) {
                        const s = e.name;
                        s.length > t && (t = s.length)
                    }
                    for (const s of this.times) {
                        const r = s.end - s.start;
                        e.push(`${s.name.padEnd(t)} ${r}ms\n`)
                    }
                    return e.join("")
                }
            }
            ;
            function isValidFetchUrl(e, t) {
                try {
                    const {protocol: s} = t ? new URL(e,t) : new URL(e);
                    return "http:" === s || "https:" === s
                } catch (e) {
                    return !1
                }
            }
            let o;
            t.PDFDateString = class PDFDateString {
                static toDateObject(e) {
                    if (!e || !(0,
                    r.isString)(e))
                        return null;
                    o || (o = new RegExp("^D:(\\d{4})(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?([Z|+|-])?(\\d{2})?'?(\\d{2})?'?"));
                    const t = o.exec(e);
                    if (!t)
                        return null;
                    const s = parseInt(t[1], 10);
                    let n = parseInt(t[2], 10);
                    n = n >= 1 && n <= 12 ? n - 1 : 0;
                    let a = parseInt(t[3], 10);
                    a = a >= 1 && a <= 31 ? a : 1;
                    let i = parseInt(t[4], 10);
                    i = i >= 0 && i <= 23 ? i : 0;
                    let l = parseInt(t[5], 10);
                    l = l >= 0 && l <= 59 ? l : 0;
                    let c = parseInt(t[6], 10);
                    c = c >= 0 && c <= 59 ? c : 0;
                    const h = t[7] || "Z";
                    let d = parseInt(t[8], 10);
                    d = d >= 0 && d <= 23 ? d : 0;
                    let u = parseInt(t[9], 10) || 0;
                    u = u >= 0 && u <= 59 ? u : 0;
                    if ("-" === h) {
                        i += d;
                        l += u
                    } else if ("+" === h) {
                        i -= d;
                        l -= u
                    }
                    return new Date(Date.UTC(s, n, a, i, l, c))
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.arrayByteLength = arrayByteLength;
            t.arraysToBytes = function arraysToBytes(e) {
                const t = e.length;
                if (1 === t && e[0]instanceof Uint8Array)
                    return e[0];
                let s = 0;
                for (let r = 0; r < t; r++)
                    s += arrayByteLength(e[r]);
                let r = 0;
                const n = new Uint8Array(s);
                for (let s = 0; s < t; s++) {
                    let t = e[s];
                    t instanceof Uint8Array || (t = "string" == typeof t ? stringToBytes(t) : new Uint8Array(t));
                    const a = t.byteLength;
                    n.set(t, r);
                    r += a
                }
                return n
            }
            ;
            t.assert = assert;
            t.bytesToString = function bytesToString(e) {
                assert(null !== e && "object" == typeof e && void 0 !== e.length, "Invalid argument for bytesToString");
                const t = e.length
                  , s = 8192;
                if (t < s)
                    return String.fromCharCode.apply(null, e);
                const r = [];
                for (let n = 0; n < t; n += s) {
                    const a = Math.min(n + s, t)
                      , i = e.subarray(n, a);
                    r.push(String.fromCharCode.apply(null, i))
                }
                return r.join("")
            }
            ;
            t.createObjectURL = function createObjectURL(e, t="", s=!1) {
                if (URL.createObjectURL && !s)
                    return URL.createObjectURL(new Blob([e],{
                        type: t
                    }));
                const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                let n = `data:${t};base64,`;
                for (let t = 0, s = e.length; t < s; t += 3) {
                    const a = 255 & e[t]
                      , i = 255 & e[t + 1]
                      , o = 255 & e[t + 2];
                    n += r[a >> 2] + r[(3 & a) << 4 | i >> 4] + r[t + 1 < s ? (15 & i) << 2 | o >> 6 : 64] + r[t + 2 < s ? 63 & o : 64]
                }
                return n
            }
            ;
            t.createPromiseCapability = function createPromiseCapability() {
                const e = Object.create(null);
                let t = !1;
                Object.defineProperty(e, "settled", {
                    get: ()=>t
                });
                e.promise = new Promise((function(s, r) {
                    e.resolve = function(e) {
                        t = !0;
                        s(e)
                    }
                    ;
                    e.reject = function(e) {
                        t = !0;
                        r(e)
                    }
                }
                ));
                return e
            }
            ;
            t.createValidAbsoluteUrl = function createValidAbsoluteUrl(e, t=null, s=null) {
                if (!e)
                    return null;
                try {
                    if (s && "string" == typeof e) {
                        if (s.addDefaultProtocol && e.startsWith("www.")) {
                            const t = e.match(/\./g);
                            t && t.length >= 2 && (e = `http://${e}`)
                        }
                        if (s.tryConvertEncoding)
                            try {
                                e = stringToUTF8String(e)
                            } catch (e) {}
                    }
                    const r = t ? new URL(e,t) : new URL(e);
                    if (function _isValidProtocol(e) {
                        if (!e)
                            return !1;
                        switch (e.protocol) {
                        case "http:":
                        case "https:":
                        case "ftp:":
                        case "mailto:":
                        case "tel:":
                            return !0;
                        default:
                            return !1
                        }
                    }(r))
                        return r
                } catch (e) {}
                return null
            }
            ;
            t.escapeString = function escapeString(e) {
                return e.replace(/([()\\\n\r])/g, (e=>"\n" === e ? "\\n" : "\r" === e ? "\\r" : `\\${e}`))
            }
            ;
            t.getModificationDate = function getModificationDate(e=new Date) {
                return [e.getUTCFullYear().toString(), (e.getUTCMonth() + 1).toString().padStart(2, "0"), e.getUTCDate().toString().padStart(2, "0"), e.getUTCHours().toString().padStart(2, "0"), e.getUTCMinutes().toString().padStart(2, "0"), e.getUTCSeconds().toString().padStart(2, "0")].join("")
            }
            ;
            t.getVerbosityLevel = function getVerbosityLevel() {
                return n
            }
            ;
            t.info = function info(e) {
                n >= r.INFOS && console.log(`Info: ${e}`)
            }
            ;
            t.isArrayBuffer = function isArrayBuffer(e) {
                return "object" == typeof e && null !== e && void 0 !== e.byteLength
            }
            ;
            t.isArrayEqual = function isArrayEqual(e, t) {
                if (e.length !== t.length)
                    return !1;
                for (let s = 0, r = e.length; s < r; s++)
                    if (e[s] !== t[s])
                        return !1;
                return !0
            }
            ;
            t.isAscii = function isAscii(e) {
                return /^[\x00-\x7F]*$/.test(e)
            }
            ;
            t.isBool = function isBool(e) {
                return "boolean" == typeof e
            }
            ;
            t.isNum = function isNum(e) {
                return "number" == typeof e
            }
            ;
            t.isSameOrigin = function isSameOrigin(e, t) {
                let s;
                try {
                    s = new URL(e);
                    if (!s.origin || "null" === s.origin)
                        return !1
                } catch (e) {
                    return !1
                }
                const r = new URL(t,s);
                return s.origin === r.origin
            }
            ;
            t.isString = function isString(e) {
                return "string" == typeof e
            }
            ;
            t.objectFromMap = function objectFromMap(e) {
                const t = Object.create(null);
                for (const [s,r] of e)
                    t[s] = r;
                return t
            }
            ;
            t.objectSize = function objectSize(e) {
                return Object.keys(e).length
            }
            ;
            t.removeNullCharacters = function removeNullCharacters(e) {
                if ("string" != typeof e) {
                    warn("The argument for removeNullCharacters must be a string.");
                    return e
                }
                return e.replace(i, "")
            }
            ;
            t.setVerbosityLevel = function setVerbosityLevel(e) {
                Number.isInteger(e) && (n = e)
            }
            ;
            t.shadow = shadow;
            t.string32 = function string32(e) {
                return String.fromCharCode(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e)
            }
            ;
            t.stringToBytes = stringToBytes;
            t.stringToPDFString = function stringToPDFString(e) {
                const t = e.length
                  , s = [];
                if ("þ" === e[0] && "ÿ" === e[1])
                    for (let r = 2; r < t; r += 2)
                        s.push(String.fromCharCode(e.charCodeAt(r) << 8 | e.charCodeAt(r + 1)));
                else if ("ÿ" === e[0] && "þ" === e[1])
                    for (let r = 2; r < t; r += 2)
                        s.push(String.fromCharCode(e.charCodeAt(r + 1) << 8 | e.charCodeAt(r)));
                else
                    for (let r = 0; r < t; ++r) {
                        const t = h[e.charCodeAt(r)];
                        s.push(t ? String.fromCharCode(t) : e.charAt(r))
                    }
                return s.join("")
            }
            ;
            t.stringToUTF16BEString = function stringToUTF16BEString(e) {
                const t = ["þÿ"];
                for (let s = 0, r = e.length; s < r; s++) {
                    const r = e.charCodeAt(s);
                    t.push(String.fromCharCode(r >> 8 & 255), String.fromCharCode(255 & r))
                }
                return t.join("")
            }
            ;
            t.stringToUTF8String = stringToUTF8String;
            t.unreachable = unreachable;
            t.utf8StringToString = function utf8StringToString(e) {
                return unescape(encodeURIComponent(e))
            }
            ;
            t.warn = warn;
            t.VerbosityLevel = t.Util = t.UNSUPPORTED_FEATURES = t.UnknownErrorException = t.UnexpectedResponseException = t.TextRenderingMode = t.StreamType = t.RenderingIntentFlag = t.PermissionFlag = t.PasswordResponses = t.PasswordException = t.PageActionEventType = t.OPS = t.MissingPDFException = t.IsLittleEndianCached = t.IsEvalSupportedCached = t.InvalidPDFException = t.ImageKind = t.IDENTITY_MATRIX = t.FormatError = t.FontType = t.FONT_IDENTITY_MATRIX = t.DocumentActionEventType = t.CMapCompressionType = t.BaseException = t.AnnotationType = t.AnnotationStateModelType = t.AnnotationReviewState = t.AnnotationReplyType = t.AnnotationMode = t.AnnotationMarkedState = t.AnnotationFlag = t.AnnotationFieldFlag = t.AnnotationBorderStyleType = t.AnnotationActionEventType = t.AbortException = void 0;
            s(3);
            t.IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
            t.FONT_IDENTITY_MATRIX = [.001, 0, 0, .001, 0, 0];
            t.RenderingIntentFlag = {
                ANY: 1,
                DISPLAY: 2,
                PRINT: 4,
                ANNOTATIONS_FORMS: 16,
                ANNOTATIONS_STORAGE: 32,
                ANNOTATIONS_DISABLE: 64,
                OPLIST: 256
            };
            t.AnnotationMode = {
                DISABLE: 0,
                ENABLE: 1,
                ENABLE_FORMS: 2,
                ENABLE_STORAGE: 3
            };
            t.PermissionFlag = {
                PRINT: 4,
                MODIFY_CONTENTS: 8,
                COPY: 16,
                MODIFY_ANNOTATIONS: 32,
                FILL_INTERACTIVE_FORMS: 256,
                COPY_FOR_ACCESSIBILITY: 512,
                ASSEMBLE: 1024,
                PRINT_HIGH_QUALITY: 2048
            };
            t.TextRenderingMode = {
                FILL: 0,
                STROKE: 1,
                FILL_STROKE: 2,
                INVISIBLE: 3,
                FILL_ADD_TO_PATH: 4,
                STROKE_ADD_TO_PATH: 5,
                FILL_STROKE_ADD_TO_PATH: 6,
                ADD_TO_PATH: 7,
                FILL_STROKE_MASK: 3,
                ADD_TO_PATH_FLAG: 4
            };
            t.ImageKind = {
                GRAYSCALE_1BPP: 1,
                RGB_24BPP: 2,
                RGBA_32BPP: 3
            };
            t.AnnotationType = {
                TEXT: 1,
                LINK: 2,
                FREETEXT: 3,
                LINE: 4,
                SQUARE: 5,
                CIRCLE: 6,
                POLYGON: 7,
                POLYLINE: 8,
                HIGHLIGHT: 9,
                UNDERLINE: 10,
                SQUIGGLY: 11,
                STRIKEOUT: 12,
                STAMP: 13,
                CARET: 14,
                INK: 15,
                POPUP: 16,
                FILEATTACHMENT: 17,
                SOUND: 18,
                MOVIE: 19,
                WIDGET: 20,
                SCREEN: 21,
                PRINTERMARK: 22,
                TRAPNET: 23,
                WATERMARK: 24,
                THREED: 25,
                REDACT: 26
            };
            t.AnnotationStateModelType = {
                MARKED: "Marked",
                REVIEW: "Review"
            };
            t.AnnotationMarkedState = {
                MARKED: "Marked",
                UNMARKED: "Unmarked"
            };
            t.AnnotationReviewState = {
                ACCEPTED: "Accepted",
                REJECTED: "Rejected",
                CANCELLED: "Cancelled",
                COMPLETED: "Completed",
                NONE: "None"
            };
            t.AnnotationReplyType = {
                GROUP: "Group",
                REPLY: "R"
            };
            t.AnnotationFlag = {
                INVISIBLE: 1,
                HIDDEN: 2,
                PRINT: 4,
                NOZOOM: 8,
                NOROTATE: 16,
                NOVIEW: 32,
                READONLY: 64,
                LOCKED: 128,
                TOGGLENOVIEW: 256,
                LOCKEDCONTENTS: 512
            };
            t.AnnotationFieldFlag = {
                READONLY: 1,
                REQUIRED: 2,
                NOEXPORT: 4,
                MULTILINE: 4096,
                PASSWORD: 8192,
                NOTOGGLETOOFF: 16384,
                RADIO: 32768,
                PUSHBUTTON: 65536,
                COMBO: 131072,
                EDIT: 262144,
                SORT: 524288,
                FILESELECT: 1048576,
                MULTISELECT: 2097152,
                DONOTSPELLCHECK: 4194304,
                DONOTSCROLL: 8388608,
                COMB: 16777216,
                RICHTEXT: 33554432,
                RADIOSINUNISON: 33554432,
                COMMITONSELCHANGE: 67108864
            };
            t.AnnotationBorderStyleType = {
                SOLID: 1,
                DASHED: 2,
                BEVELED: 3,
                INSET: 4,
                UNDERLINE: 5
            };
            t.AnnotationActionEventType = {
                E: "Mouse Enter",
                X: "Mouse Exit",
                D: "Mouse Down",
                U: "Mouse Up",
                Fo: "Focus",
                Bl: "Blur",
                PO: "PageOpen",
                PC: "PageClose",
                PV: "PageVisible",
                PI: "PageInvisible",
                K: "Keystroke",
                F: "Format",
                V: "Validate",
                C: "Calculate"
            };
            t.DocumentActionEventType = {
                WC: "WillClose",
                WS: "WillSave",
                DS: "DidSave",
                WP: "WillPrint",
                DP: "DidPrint"
            };
            t.PageActionEventType = {
                O: "PageOpen",
                C: "PageClose"
            };
            t.StreamType = {
                UNKNOWN: "UNKNOWN",
                FLATE: "FLATE",
                LZW: "LZW",
                DCT: "DCT",
                JPX: "JPX",
                JBIG: "JBIG",
                A85: "A85",
                AHX: "AHX",
                CCF: "CCF",
                RLX: "RLX"
            };
            t.FontType = {
                UNKNOWN: "UNKNOWN",
                TYPE1: "TYPE1",
                TYPE1STANDARD: "TYPE1STANDARD",
                TYPE1C: "TYPE1C",
                CIDFONTTYPE0: "CIDFONTTYPE0",
                CIDFONTTYPE0C: "CIDFONTTYPE0C",
                TRUETYPE: "TRUETYPE",
                CIDFONTTYPE2: "CIDFONTTYPE2",
                TYPE3: "TYPE3",
                OPENTYPE: "OPENTYPE",
                TYPE0: "TYPE0",
                MMTYPE1: "MMTYPE1"
            };
            const r = {
                ERRORS: 0,
                WARNINGS: 1,
                INFOS: 5
            };
            t.VerbosityLevel = r;
            t.CMapCompressionType = {
                NONE: 0,
                BINARY: 1,
                STREAM: 2
            };
            t.OPS = {
                dependency: 1,
                setLineWidth: 2,
                setLineCap: 3,
                setLineJoin: 4,
                setMiterLimit: 5,
                setDash: 6,
                setRenderingIntent: 7,
                setFlatness: 8,
                setGState: 9,
                save: 10,
                restore: 11,
                transform: 12,
                moveTo: 13,
                lineTo: 14,
                curveTo: 15,
                curveTo2: 16,
                curveTo3: 17,
                closePath: 18,
                rectangle: 19,
                stroke: 20,
                closeStroke: 21,
                fill: 22,
                eoFill: 23,
                fillStroke: 24,
                eoFillStroke: 25,
                closeFillStroke: 26,
                closeEOFillStroke: 27,
                endPath: 28,
                clip: 29,
                eoClip: 30,
                beginText: 31,
                endText: 32,
                setCharSpacing: 33,
                setWordSpacing: 34,
                setHScale: 35,
                setLeading: 36,
                setFont: 37,
                setTextRenderingMode: 38,
                setTextRise: 39,
                moveText: 40,
                setLeadingMoveText: 41,
                setTextMatrix: 42,
                nextLine: 43,
                showText: 44,
                showSpacedText: 45,
                nextLineShowText: 46,
                nextLineSetSpacingShowText: 47,
                setCharWidth: 48,
                setCharWidthAndBounds: 49,
                setStrokeColorSpace: 50,
                setFillColorSpace: 51,
                setStrokeColor: 52,
                setStrokeColorN: 53,
                setFillColor: 54,
                setFillColorN: 55,
                setStrokeGray: 56,
                setFillGray: 57,
                setStrokeRGBColor: 58,
                setFillRGBColor: 59,
                setStrokeCMYKColor: 60,
                setFillCMYKColor: 61,
                shadingFill: 62,
                beginInlineImage: 63,
                beginImageData: 64,
                endInlineImage: 65,
                paintXObject: 66,
                markPoint: 67,
                markPointProps: 68,
                beginMarkedContent: 69,
                beginMarkedContentProps: 70,
                endMarkedContent: 71,
                beginCompat: 72,
                endCompat: 73,
                paintFormXObjectBegin: 74,
                paintFormXObjectEnd: 75,
                beginGroup: 76,
                endGroup: 77,
                beginAnnotations: 78,
                endAnnotations: 79,
                beginAnnotation: 80,
                endAnnotation: 81,
                paintJpegXObject: 82,
                paintImageMaskXObject: 83,
                paintImageMaskXObjectGroup: 84,
                paintImageXObject: 85,
                paintInlineImageXObject: 86,
                paintInlineImageXObjectGroup: 87,
                paintImageXObjectRepeat: 88,
                paintImageMaskXObjectRepeat: 89,
                paintSolidColorImageMask: 90,
                constructPath: 91
            };
            t.UNSUPPORTED_FEATURES = {
                unknown: "unknown",
                forms: "forms",
                javaScript: "javaScript",
                signatures: "signatures",
                smask: "smask",
                shadingPattern: "shadingPattern",
                font: "font",
                errorTilingPattern: "errorTilingPattern",
                errorExtGState: "errorExtGState",
                errorXObject: "errorXObject",
                errorFontLoadType3: "errorFontLoadType3",
                errorFontState: "errorFontState",
                errorFontMissing: "errorFontMissing",
                errorFontTranslate: "errorFontTranslate",
                errorColorSpace: "errorColorSpace",
                errorOperatorList: "errorOperatorList",
                errorFontToUnicode: "errorFontToUnicode",
                errorFontLoadNative: "errorFontLoadNative",
                errorFontBuildPath: "errorFontBuildPath",
                errorFontGetPath: "errorFontGetPath",
                errorMarkedContent: "errorMarkedContent",
                errorContentSubStream: "errorContentSubStream"
            };
            t.PasswordResponses = {
                NEED_PASSWORD: 1,
                INCORRECT_PASSWORD: 2
            };
            let n = r.WARNINGS;
            function warn(e) {
                n >= r.WARNINGS && console.log(`Warning: ${e}`)
            }
            function unreachable(e) {
                throw new Error(e)
            }
            function assert(e, t) {
                e || unreachable(t)
            }
            function shadow(e, t, s) {
                Object.defineProperty(e, t, {
                    value: s,
                    enumerable: !0,
                    configurable: !0,
                    writable: !1
                });
                return s
            }
            const a = function BaseExceptionClosure() {
                function BaseException(e, t) {
                    this.constructor === BaseException && unreachable("Cannot initialize BaseException.");
                    this.message = e;
                    this.name = t
                }
                BaseException.prototype = new Error;
                BaseException.constructor = BaseException;
                return BaseException
            }();
            t.BaseException = a;
            t.PasswordException = class PasswordException extends a {
                constructor(e, t) {
                    super(e, "PasswordException");
                    this.code = t
                }
            }
            ;
            t.UnknownErrorException = class UnknownErrorException extends a {
                constructor(e, t) {
                    super(e, "UnknownErrorException");
                    this.details = t
                }
            }
            ;
            t.InvalidPDFException = class InvalidPDFException extends a {
                constructor(e) {
                    super(e, "InvalidPDFException")
                }
            }
            ;
            t.MissingPDFException = class MissingPDFException extends a {
                constructor(e) {
                    super(e, "MissingPDFException")
                }
            }
            ;
            t.UnexpectedResponseException = class UnexpectedResponseException extends a {
                constructor(e, t) {
                    super(e, "UnexpectedResponseException");
                    this.status = t
                }
            }
            ;
            t.FormatError = class FormatError extends a {
                constructor(e) {
                    super(e, "FormatError")
                }
            }
            ;
            t.AbortException = class AbortException extends a {
                constructor(e) {
                    super(e, "AbortException")
                }
            }
            ;
            const i = /\x00/g;
            function stringToBytes(e) {
                assert("string" == typeof e, "Invalid argument for stringToBytes");
                const t = e.length
                  , s = new Uint8Array(t);
                for (let r = 0; r < t; ++r)
                    s[r] = 255 & e.charCodeAt(r);
                return s
            }
            function arrayByteLength(e) {
                if (void 0 !== e.length)
                    return e.length;
                assert(void 0 !== e.byteLength, "arrayByteLength - invalid argument.");
                return e.byteLength
            }
            const o = {
                get value() {
                    return shadow(this, "value", function isLittleEndian() {
                        const e = new Uint8Array(4);
                        e[0] = 1;
                        return 1 === new Uint32Array(e.buffer,0,1)[0]
                    }())
                }
            };
            t.IsLittleEndianCached = o;
            const l = {
                get value() {
                    return shadow(this, "value", function isEvalSupported() {
                        try {
                            new Function("");
                            return !0
                        } catch (e) {
                            return !1
                        }
                    }())
                }
            };
            t.IsEvalSupportedCached = l;
            const c = [...Array(256).keys()].map((e=>e.toString(16).padStart(2, "0")));
            class Util {
                static makeHexColor(e, t, s) {
                    return `#${c[e]}${c[t]}${c[s]}`
                }
                static transform(e, t) {
                    return [e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1], e[0] * t[2] + e[2] * t[3], e[1] * t[2] + e[3] * t[3], e[0] * t[4] + e[2] * t[5] + e[4], e[1] * t[4] + e[3] * t[5] + e[5]]
                }
                static applyTransform(e, t) {
                    return [e[0] * t[0] + e[1] * t[2] + t[4], e[0] * t[1] + e[1] * t[3] + t[5]]
                }
                static applyInverseTransform(e, t) {
                    const s = t[0] * t[3] - t[1] * t[2];
                    return [(e[0] * t[3] - e[1] * t[2] + t[2] * t[5] - t[4] * t[3]) / s, (-e[0] * t[1] + e[1] * t[0] + t[4] * t[1] - t[5] * t[0]) / s]
                }
                static getAxialAlignedBoundingBox(e, t) {
                    const s = Util.applyTransform(e, t)
                      , r = Util.applyTransform(e.slice(2, 4), t)
                      , n = Util.applyTransform([e[0], e[3]], t)
                      , a = Util.applyTransform([e[2], e[1]], t);
                    return [Math.min(s[0], r[0], n[0], a[0]), Math.min(s[1], r[1], n[1], a[1]), Math.max(s[0], r[0], n[0], a[0]), Math.max(s[1], r[1], n[1], a[1])]
                }
                static inverseTransform(e) {
                    const t = e[0] * e[3] - e[1] * e[2];
                    return [e[3] / t, -e[1] / t, -e[2] / t, e[0] / t, (e[2] * e[5] - e[4] * e[3]) / t, (e[4] * e[1] - e[5] * e[0]) / t]
                }
                static apply3dTransform(e, t) {
                    return [e[0] * t[0] + e[1] * t[1] + e[2] * t[2], e[3] * t[0] + e[4] * t[1] + e[5] * t[2], e[6] * t[0] + e[7] * t[1] + e[8] * t[2]]
                }
                static singularValueDecompose2dScale(e) {
                    const t = [e[0], e[2], e[1], e[3]]
                      , s = e[0] * t[0] + e[1] * t[2]
                      , r = e[0] * t[1] + e[1] * t[3]
                      , n = e[2] * t[0] + e[3] * t[2]
                      , a = e[2] * t[1] + e[3] * t[3]
                      , i = (s + a) / 2
                      , o = Math.sqrt((s + a) ** 2 - 4 * (s * a - n * r)) / 2
                      , l = i + o || 1
                      , c = i - o || 1;
                    return [Math.sqrt(l), Math.sqrt(c)]
                }
                static normalizeRect(e) {
                    const t = e.slice(0);
                    if (e[0] > e[2]) {
                        t[0] = e[2];
                        t[2] = e[0]
                    }
                    if (e[1] > e[3]) {
                        t[1] = e[3];
                        t[3] = e[1]
                    }
                    return t
                }
                static intersect(e, t) {
                    function compare(e, t) {
                        return e - t
                    }
                    const s = [e[0], e[2], t[0], t[2]].sort(compare)
                      , r = [e[1], e[3], t[1], t[3]].sort(compare)
                      , n = [];
                    e = Util.normalizeRect(e);
                    t = Util.normalizeRect(t);
                    if (!(s[0] === e[0] && s[1] === t[0] || s[0] === t[0] && s[1] === e[0]))
                        return null;
                    n[0] = s[1];
                    n[2] = s[2];
                    if (!(r[0] === e[1] && r[1] === t[1] || r[0] === t[1] && r[1] === e[1]))
                        return null;
                    n[1] = r[1];
                    n[3] = r[2];
                    return n
                }
            }
            t.Util = Util;
            const h = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 728, 711, 710, 729, 733, 731, 730, 732, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8226, 8224, 8225, 8230, 8212, 8211, 402, 8260, 8249, 8250, 8722, 8240, 8222, 8220, 8221, 8216, 8217, 8218, 8482, 64257, 64258, 321, 338, 352, 376, 381, 305, 322, 339, 353, 382, 0, 8364];
            function stringToUTF8String(e) {
                return decodeURIComponent(escape(e))
            }
        }
        , (e,t,s)=>{
            s(4)
        }
        , (e,t)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.isNodeJS = void 0;
            const s = !("object" != typeof process || process + "" != "[object process]" || process.versions.nw || process.versions.electron && process.type && "browser" !== process.type);
            t.isNodeJS = s
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.BaseSVGFactory = t.BaseStandardFontDataFactory = t.BaseCMapReaderFactory = t.BaseCanvasFactory = void 0;
            var r = s(2);
            class BaseCanvasFactory {
                constructor() {
                    this.constructor === BaseCanvasFactory && (0,
                    r.unreachable)("Cannot initialize BaseCanvasFactory.")
                }
                create(e, t) {
                    if (e <= 0 || t <= 0)
                        throw new Error("Invalid canvas size");
                    const s = this._createCanvas(e, t);
                    return {
                        canvas: s,
                        context: s.getContext("2d")
                    }
                }
                reset(e, t, s) {
                    if (!e.canvas)
                        throw new Error("Canvas is not specified");
                    if (t <= 0 || s <= 0)
                        throw new Error("Invalid canvas size");
                    e.canvas.width = t;
                    e.canvas.height = s
                }
                destroy(e) {
                    if (!e.canvas)
                        throw new Error("Canvas is not specified");
                    e.canvas.width = 0;
                    e.canvas.height = 0;
                    e.canvas = null;
                    e.context = null
                }
                _createCanvas(e, t) {
                    (0,
                    r.unreachable)("Abstract method `_createCanvas` called.")
                }
            }
            t.BaseCanvasFactory = BaseCanvasFactory;
            class BaseCMapReaderFactory {
                constructor({baseUrl: e=null, isCompressed: t=!1}) {
                    this.constructor === BaseCMapReaderFactory && (0,
                    r.unreachable)("Cannot initialize BaseCMapReaderFactory.");
                    this.baseUrl = e;
                    this.isCompressed = t
                }
                async fetch({name: e}) {
                    if (!this.baseUrl)
                        throw new Error('The CMap "baseUrl" parameter must be specified, ensure that the "cMapUrl" and "cMapPacked" API parameters are provided.');
                    if (!e)
                        throw new Error("CMap name must be specified.");
                    const t = this.baseUrl + e + (this.isCompressed ? ".bcmap" : "")
                      , s = this.isCompressed ? r.CMapCompressionType.BINARY : r.CMapCompressionType.NONE;
                    return this._fetchData(t, s).catch((e=>{
                        throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}CMap at: ${t}`)
                    }
                    ))
                }
                _fetchData(e, t) {
                    (0,
                    r.unreachable)("Abstract method `_fetchData` called.")
                }
            }
            t.BaseCMapReaderFactory = BaseCMapReaderFactory;
            class BaseStandardFontDataFactory {
                constructor({baseUrl: e=null}) {
                    this.constructor === BaseStandardFontDataFactory && (0,
                    r.unreachable)("Cannot initialize BaseStandardFontDataFactory.");
                    this.baseUrl = e
                }
                async fetch({filename: e}) {
                    if (!this.baseUrl)
                        throw new Error('The standard font "baseUrl" parameter must be specified, ensure that the "standardFontDataUrl" API parameter is provided.');
                    if (!e)
                        throw new Error("Font filename must be specified.");
                    const t = `${this.baseUrl}${e}`;
                    return this._fetchData(t).catch((e=>{
                        throw new Error(`Unable to load font data at: ${t}`)
                    }
                    ))
                }
                _fetchData(e) {
                    (0,
                    r.unreachable)("Abstract method `_fetchData` called.")
                }
            }
            t.BaseStandardFontDataFactory = BaseStandardFontDataFactory;
            class BaseSVGFactory {
                constructor() {
                    this.constructor === BaseSVGFactory && (0,
                    r.unreachable)("Cannot initialize BaseSVGFactory.")
                }
                create(e, t) {
                    if (e <= 0 || t <= 0)
                        throw new Error("Invalid SVG dimensions");
                    const s = this._createSVG("svg:svg");
                    s.setAttribute("version", "1.1");
                    s.setAttribute("width", `${e}px`);
                    s.setAttribute("height", `${t}px`);
                    s.setAttribute("preserveAspectRatio", "none");
                    s.setAttribute("viewBox", `0 0 ${e} ${t}`);
                    return s
                }
                createElement(e) {
                    if ("string" != typeof e)
                        throw new Error("Invalid SVG element type");
                    return this._createSVG(e)
                }
                _createSVG(e) {
                    (0,
                    r.unreachable)("Abstract method `_createSVG` called.")
                }
            }
            t.BaseSVGFactory = BaseSVGFactory
        }
        , (__unused_webpack_module,exports,__w_pdfjs_require__)=>{
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            exports.getDocument = getDocument;
            exports.setPDFNetworkStreamFactory = setPDFNetworkStreamFactory;
            exports.version = exports.RenderTask = exports.PDFWorker = exports.PDFPageProxy = exports.PDFDocumentProxy = exports.PDFDocumentLoadingTask = exports.PDFDataRangeTransport = exports.LoopbackPort = exports.DefaultStandardFontDataFactory = exports.DefaultCMapReaderFactory = exports.DefaultCanvasFactory = exports.build = void 0;
            var _util = __w_pdfjs_require__(2)
              , _display_utils = __w_pdfjs_require__(1)
              , _font_loader = __w_pdfjs_require__(7)
              , _node_utils = __w_pdfjs_require__(8)
              , _annotation_storage = __w_pdfjs_require__(9)
              , _canvas = __w_pdfjs_require__(10)
              , _worker_options = __w_pdfjs_require__(12)
              , _is_node = __w_pdfjs_require__(4)
              , _message_handler = __w_pdfjs_require__(13)
              , _metadata = __w_pdfjs_require__(14)
              , _optional_content_config = __w_pdfjs_require__(15)
              , _transport_stream = __w_pdfjs_require__(16)
              , _xfa_text = __w_pdfjs_require__(17);
            const DEFAULT_RANGE_CHUNK_SIZE = 65536
              , RENDERING_CANCELLED_TIMEOUT = 100
              , DefaultCanvasFactory = _is_node.isNodeJS ? _node_utils.NodeCanvasFactory : _display_utils.DOMCanvasFactory;
            exports.DefaultCanvasFactory = DefaultCanvasFactory;
            const DefaultCMapReaderFactory = _is_node.isNodeJS ? _node_utils.NodeCMapReaderFactory : _display_utils.DOMCMapReaderFactory;
            exports.DefaultCMapReaderFactory = DefaultCMapReaderFactory;
            const DefaultStandardFontDataFactory = _is_node.isNodeJS ? _node_utils.NodeStandardFontDataFactory : _display_utils.DOMStandardFontDataFactory;
            exports.DefaultStandardFontDataFactory = DefaultStandardFontDataFactory;
            let createPDFNetworkStream;
            function setPDFNetworkStreamFactory(e) {
                createPDFNetworkStream = e
            }
            function getDocument(e) {
                const t = new PDFDocumentLoadingTask;
                let s;
                if ("string" == typeof e || e instanceof URL)
                    s = {
                        url: e
                    };
                else if ((0,
                _util.isArrayBuffer)(e))
                    s = {
                        data: e
                    };
                else if (e instanceof PDFDataRangeTransport)
                    s = {
                        range: e
                    };
                else {
                    if ("object" != typeof e)
                        throw new Error("Invalid parameter in getDocument, need either string, URL, Uint8Array, or parameter object.");
                    if (!e.url && !e.data && !e.range)
                        throw new Error("Invalid parameter object: need either .data, .range or .url");
                    s = e
                }
                const r = Object.create(null);
                let n = null
                  , a = null;
                for (const e in s) {
                    const t = s[e];
                    switch (e) {
                    case "url":
                        if ("undefined" != typeof window)
                            try {
                                r[e] = new URL(t,window.location).href;
                                continue
                            } catch (e) {
                                (0,
                                _util.warn)(`Cannot create valid URL: "${e}".`)
                            }
                        else if ("string" == typeof t || t instanceof URL) {
                            r[e] = t.toString();
                            continue
                        }
                        throw new Error("Invalid PDF url data: either string or URL-object is expected in the url property.");
                    case "range":
                        n = t;
                        continue;
                    case "worker":
                        a = t;
                        continue;
                    case "data":
                        if (_is_node.isNodeJS && "undefined" != typeof Buffer && t instanceof Buffer)
                            r[e] = new Uint8Array(t);
                        else {
                            if (t instanceof Uint8Array)
                                break;
                            if ("string" == typeof t)
                                r[e] = (0,
                                _util.stringToBytes)(t);
                            else if ("object" != typeof t || null === t || isNaN(t.length)) {
                                if (!(0,
                                _util.isArrayBuffer)(t))
                                    throw new Error("Invalid PDF binary data: either typed array, string, or array-like object is expected in the data property.");
                                r[e] = new Uint8Array(t)
                            } else
                                r[e] = new Uint8Array(t)
                        }
                        continue
                    }
                    r[e] = t
                }
                r.rangeChunkSize = r.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
                r.CMapReaderFactory = r.CMapReaderFactory || DefaultCMapReaderFactory;
                r.StandardFontDataFactory = r.StandardFontDataFactory || DefaultStandardFontDataFactory;
                r.ignoreErrors = !0 !== r.stopAtErrors;
                r.fontExtraProperties = !0 === r.fontExtraProperties;
                r.pdfBug = !0 === r.pdfBug;
                r.enableXfa = !0 === r.enableXfa;
                ("string" != typeof r.docBaseUrl || (0,
                _display_utils.isDataScheme)(r.docBaseUrl)) && (r.docBaseUrl = null);
                Number.isInteger(r.maxImageSize) || (r.maxImageSize = -1);
                "boolean" != typeof r.useWorkerFetch && (r.useWorkerFetch = r.CMapReaderFactory === _display_utils.DOMCMapReaderFactory && r.StandardFontDataFactory === _display_utils.DOMStandardFontDataFactory);
                "boolean" != typeof r.isEvalSupported && (r.isEvalSupported = !0);
                "boolean" != typeof r.disableFontFace && (r.disableFontFace = _is_node.isNodeJS);
                "boolean" != typeof r.useSystemFonts && (r.useSystemFonts = !_is_node.isNodeJS && !r.disableFontFace);
                void 0 === r.ownerDocument && (r.ownerDocument = globalThis.document);
                "boolean" != typeof r.disableRange && (r.disableRange = !1);
                "boolean" != typeof r.disableStream && (r.disableStream = !1);
                "boolean" != typeof r.disableAutoFetch && (r.disableAutoFetch = !1);
                (0,
                _util.setVerbosityLevel)(r.verbosity);
                if (!a) {
                    const e = {
                        verbosity: r.verbosity,
                        port: _worker_options.GlobalWorkerOptions.workerPort
                    };
                    a = e.port ? PDFWorker.fromPort(e) : new PDFWorker(e);
                    t._worker = a
                }
                const i = t.docId;
                a.promise.then((function() {
                    if (t.destroyed)
                        throw new Error("Loading aborted");
                    const e = _fetchDocument(a, r, n, i)
                      , s = new Promise((function(e) {
                        let t;
                        n ? t = new _transport_stream.PDFDataTransportStream({
                            length: r.length,
                            initialData: r.initialData,
                            progressiveDone: r.progressiveDone,
                            contentDispositionFilename: r.contentDispositionFilename,
                            disableRange: r.disableRange,
                            disableStream: r.disableStream
                        },n) : r.data || (t = createPDFNetworkStream({
                            url: r.url,
                            length: r.length,
                            httpHeaders: r.httpHeaders,
                            withCredentials: r.withCredentials,
                            rangeChunkSize: r.rangeChunkSize,
                            disableRange: r.disableRange,
                            disableStream: r.disableStream
                        }));
                        e(t)
                    }
                    ));
                    return Promise.all([e, s]).then((function([e,s]) {
                        if (t.destroyed)
                            throw new Error("Loading aborted");
                        const n = new _message_handler.MessageHandler(i,e,a.port);
                        n.postMessageTransfers = a.postMessageTransfers;
                        const o = new WorkerTransport(n,t,s,r);
                        t._transport = o;
                        n.send("Ready", null)
                    }
                    ))
                }
                )).catch(t._capability.reject);
                return t
            }
            async function _fetchDocument(e, t, s, r) {
                if (e.destroyed)
                    throw new Error("Worker was destroyed");
                if (s) {
                    t.length = s.length;
                    t.initialData = s.initialData;
                    t.progressiveDone = s.progressiveDone;
                    t.contentDispositionFilename = s.contentDispositionFilename
                }
                const n = await e.messageHandler.sendWithPromise("GetDocRequest", {
                    docId: r,
                    apiVersion: "2.11.338",
                    source: {
                        data: t.data,
                        url: t.url,
                        password: t.password,
                        disableAutoFetch: t.disableAutoFetch,
                        rangeChunkSize: t.rangeChunkSize,
                        length: t.length
                    },
                    maxImageSize: t.maxImageSize,
                    disableFontFace: t.disableFontFace,
                    postMessageTransfers: e.postMessageTransfers,
                    docBaseUrl: t.docBaseUrl,
                    ignoreErrors: t.ignoreErrors,
                    isEvalSupported: t.isEvalSupported,
                    fontExtraProperties: t.fontExtraProperties,
                    enableXfa: t.enableXfa,
                    useSystemFonts: t.useSystemFonts,
                    cMapUrl: t.useWorkerFetch ? t.cMapUrl : null,
                    standardFontDataUrl: t.useWorkerFetch ? t.standardFontDataUrl : null
                });
                if (e.destroyed)
                    throw new Error("Worker was destroyed");
                return n
            }
            class PDFDocumentLoadingTask {
                static get idCounters() {
                    return (0,
                    _util.shadow)(this, "idCounters", {
                        doc: 0
                    })
                }
                constructor() {
                    this._capability = (0,
                    _util.createPromiseCapability)();
                    this._transport = null;
                    this._worker = null;
                    this.docId = "d" + PDFDocumentLoadingTask.idCounters.doc++;
                    this.destroyed = !1;
                    this.onPassword = null;
                    this.onProgress = null;
                    this.onUnsupportedFeature = null
                }
                get promise() {
                    return this._capability.promise
                }
                async destroy() {
                    this.destroyed = !0;
                    await (this._transport?.destroy());
                    this._transport = null;
                    if (this._worker) {
                        this._worker.destroy();
                        this._worker = null
                    }
                }
            }
            exports.PDFDocumentLoadingTask = PDFDocumentLoadingTask;
            class PDFDataRangeTransport {
                constructor(e, t, s=!1, r=null) {
                    this.length = e;
                    this.initialData = t;
                    this.progressiveDone = s;
                    this.contentDispositionFilename = r;
                    this._rangeListeners = [];
                    this._progressListeners = [];
                    this._progressiveReadListeners = [];
                    this._progressiveDoneListeners = [];
                    this._readyCapability = (0,
                    _util.createPromiseCapability)()
                }
                addRangeListener(e) {
                    this._rangeListeners.push(e)
                }
                addProgressListener(e) {
                    this._progressListeners.push(e)
                }
                addProgressiveReadListener(e) {
                    this._progressiveReadListeners.push(e)
                }
                addProgressiveDoneListener(e) {
                    this._progressiveDoneListeners.push(e)
                }
                onDataRange(e, t) {
                    for (const s of this._rangeListeners)
                        s(e, t)
                }
                onDataProgress(e, t) {
                    this._readyCapability.promise.then((()=>{
                        for (const s of this._progressListeners)
                            s(e, t)
                    }
                    ))
                }
                onDataProgressiveRead(e) {
                    this._readyCapability.promise.then((()=>{
                        for (const t of this._progressiveReadListeners)
                            t(e)
                    }
                    ))
                }
                onDataProgressiveDone() {
                    this._readyCapability.promise.then((()=>{
                        for (const e of this._progressiveDoneListeners)
                            e()
                    }
                    ))
                }
                transportReady() {
                    this._readyCapability.resolve()
                }
                requestDataRange(e, t) {
                    (0,
                    _util.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange")
                }
                abort() {}
            }
            exports.PDFDataRangeTransport = PDFDataRangeTransport;
            class PDFDocumentProxy {
                constructor(e, t) {
                    this._pdfInfo = e;
                    this._transport = t;
                    Object.defineProperty(this, "fingerprint", {
                        get() {
                            (0,
                            _display_utils.deprecated)("`PDFDocumentProxy.fingerprint`, please use `PDFDocumentProxy.fingerprints` instead.");
                            return this.fingerprints[0]
                        }
                    })
                }
                get annotationStorage() {
                    return this._transport.annotationStorage
                }
                get numPages() {
                    return this._pdfInfo.numPages
                }
                get fingerprints() {
                    return this._pdfInfo.fingerprints
                }
                get isPureXfa() {
                    return !!this._transport._htmlForXfa
                }
                get allXfaHtml() {
                    return this._transport._htmlForXfa
                }
                getPage(e) {
                    return this._transport.getPage(e)
                }
                getPageIndex(e) {
                    return this._transport.getPageIndex(e)
                }
                getDestinations() {
                    return this._transport.getDestinations()
                }
                getDestination(e) {
                    return this._transport.getDestination(e)
                }
                getPageLabels() {
                    return this._transport.getPageLabels()
                }
                getPageLayout() {
                    return this._transport.getPageLayout()
                }
                getPageMode() {
                    return this._transport.getPageMode()
                }
                getViewerPreferences() {
                    return this._transport.getViewerPreferences()
                }
                getOpenAction() {
                    return this._transport.getOpenAction()
                }
                getAttachments() {
                    return this._transport.getAttachments()
                }
                getJavaScript() {
                    return this._transport.getJavaScript()
                }
                getJSActions() {
                    return this._transport.getDocJSActions()
                }
                getOutline() {
                    return this._transport.getOutline()
                }
                getOptionalContentConfig() {
                    return this._transport.getOptionalContentConfig()
                }
                getPermissions() {
                    return this._transport.getPermissions()
                }
                getMetadata() {
                    return this._transport.getMetadata()
                }
                getMarkInfo() {
                    return this._transport.getMarkInfo()
                }
                getData() {
                    return this._transport.getData()
                }
                getDownloadInfo() {
                    return this._transport.downloadInfoCapability.promise
                }
                getStats() {
                    return this._transport.getStats()
                }
                cleanup(e=!1) {
                    return this._transport.startCleanup(e || this.isPureXfa)
                }
                destroy() {
                    return this.loadingTask.destroy()
                }
                get loadingParams() {
                    return this._transport.loadingParams
                }
                get loadingTask() {
                    return this._transport.loadingTask
                }
                saveDocument() {
                    this._transport.annotationStorage.size <= 0 && (0,
                    _display_utils.deprecated)("saveDocument called while `annotationStorage` is empty, please use the getData-method instead.");
                    return this._transport.saveDocument()
                }
                getFieldObjects() {
                    return this._transport.getFieldObjects()
                }
                hasJSActions() {
                    return this._transport.hasJSActions()
                }
                getCalculationOrderIds() {
                    return this._transport.getCalculationOrderIds()
                }
            }
            exports.PDFDocumentProxy = PDFDocumentProxy;
            class PDFPageProxy {
                constructor(e, t, s, r, n=!1) {
                    this._pageIndex = e;
                    this._pageInfo = t;
                    this._ownerDocument = r;
                    this._transport = s;
                    this._stats = n ? new _display_utils.StatTimer : null;
                    this._pdfBug = n;
                    this.commonObjs = s.commonObjs;
                    this.objs = new PDFObjects;
                    this.cleanupAfterRender = !1;
                    this.pendingCleanup = !1;
                    this._intentStates = new Map;
                    this._annotationPromises = new Map;
                    this.destroyed = !1
                }
                get pageNumber() {
                    return this._pageIndex + 1
                }
                get rotate() {
                    return this._pageInfo.rotate
                }
                get ref() {
                    return this._pageInfo.ref
                }
                get userUnit() {
                    return this._pageInfo.userUnit
                }
                get view() {
                    return this._pageInfo.view
                }
                getViewport({scale: e, rotation: t=this.rotate, offsetX: s=0, offsetY: r=0, dontFlip: n=!1}={}) {
                    return new _display_utils.PageViewport({
                        viewBox: this.view,
                        scale: e,
                        rotation: t,
                        offsetX: s,
                        offsetY: r,
                        dontFlip: n
                    })
                }
                getAnnotations({intent: e="display"}={}) {
                    const t = this._transport.getRenderingIntent(e);
                    let s = this._annotationPromises.get(t.cacheKey);
                    if (!s) {
                        s = this._transport.getAnnotations(this._pageIndex, t.renderingIntent);
                        this._annotationPromises.set(t.cacheKey, s);
                        s = s.then((e=>{
                            for (const t of e) {
                                void 0 !== t.titleObj && Object.defineProperty(t, "title", {
                                    get() {
                                        (0,
                                        _display_utils.deprecated)("`title`-property on annotation, please use `titleObj` instead.");
                                        return t.titleObj.str
                                    }
                                });
                                void 0 !== t.contentsObj && Object.defineProperty(t, "contents", {
                                    get() {
                                        (0,
                                        _display_utils.deprecated)("`contents`-property on annotation, please use `contentsObj` instead.");
                                        return t.contentsObj.str
                                    }
                                })
                            }
                            return e
                        }
                        ))
                    }
                    return s
                }
                getJSActions() {
                    return this._jsActionsPromise ||= this._transport.getPageJSActions(this._pageIndex)
                }
                async getXfa() {
                    return this._transport._htmlForXfa?.children[this._pageIndex] || null
                }
                render({canvasContext: e, viewport: t, intent: s="display", annotationMode: r=_util.AnnotationMode.ENABLE, transform: n=null, imageLayer: a=null, canvasFactory: i=null, background: o=null, optionalContentConfigPromise: l=null}) {
                    if (void 0 !== arguments[0]?.renderInteractiveForms) {
                        (0,
                        _display_utils.deprecated)("render no longer accepts the `renderInteractiveForms`-option, please use the `annotationMode`-option instead.");
                        !0 === arguments[0].renderInteractiveForms && r === _util.AnnotationMode.ENABLE && (r = _util.AnnotationMode.ENABLE_FORMS)
                    }
                    if (void 0 !== arguments[0]?.includeAnnotationStorage) {
                        (0,
                        _display_utils.deprecated)("render no longer accepts the `includeAnnotationStorage`-option, please use the `annotationMode`-option instead.");
                        !0 === arguments[0].includeAnnotationStorage && r === _util.AnnotationMode.ENABLE && (r = _util.AnnotationMode.ENABLE_STORAGE)
                    }
                    this._stats && this._stats.time("Overall");
                    const c = this._transport.getRenderingIntent(s, r);
                    this.pendingCleanup = !1;
                    l || (l = this._transport.getOptionalContentConfig());
                    let h = this._intentStates.get(c.cacheKey);
                    if (!h) {
                        h = Object.create(null);
                        this._intentStates.set(c.cacheKey, h)
                    }
                    if (h.streamReaderCancelTimeout) {
                        clearTimeout(h.streamReaderCancelTimeout);
                        h.streamReaderCancelTimeout = null
                    }
                    const d = i || new DefaultCanvasFactory({
                        ownerDocument: this._ownerDocument
                    })
                      , u = !!(c.renderingIntent & _util.RenderingIntentFlag.PRINT);
                    if (!h.displayReadyCapability) {
                        h.displayReadyCapability = (0,
                        _util.createPromiseCapability)();
                        h.operatorList = {
                            fnArray: [],
                            argsArray: [],
                            lastChunk: !1
                        };
                        this._stats && this._stats.time("Page Request");
                        this._pumpOperatorList(c)
                    }
                    const complete = e=>{
                        h.renderTasks.delete(p);
                        (this.cleanupAfterRender || u) && (this.pendingCleanup = !0);
                        this._tryCleanup();
                        if (e) {
                            p.capability.reject(e);
                            this._abortOperatorList({
                                intentState: h,
                                reason: e instanceof Error ? e : new Error(e)
                            })
                        } else
                            p.capability.resolve();
                        if (this._stats) {
                            this._stats.timeEnd("Rendering");
                            this._stats.timeEnd("Overall")
                        }
                    }
                      , p = new InternalRenderTask({
                        callback: complete,
                        params: {
                            canvasContext: e,
                            viewport: t,
                            transform: n,
                            imageLayer: a,
                            background: o
                        },
                        objs: this.objs,
                        commonObjs: this.commonObjs,
                        operatorList: h.operatorList,
                        pageIndex: this._pageIndex,
                        canvasFactory: d,
                        useRequestAnimationFrame: !u,
                        pdfBug: this._pdfBug
                    });
                    (h.renderTasks ||= new Set).add(p);
                    const g = p.task;
                    Promise.all([h.displayReadyCapability.promise, l]).then((([e,t])=>{
                        if (this.pendingCleanup)
                            complete();
                        else {
                            this._stats && this._stats.time("Rendering");
                            p.initializeGraphics({
                                transparency: e,
                                optionalContentConfig: t
                            });
                            p.operatorListChanged()
                        }
                    }
                    )).catch(complete);
                    return g
                }
                getOperatorList({intent: e="display", annotationMode: t=_util.AnnotationMode.ENABLE}={}) {
                    const s = this._transport.getRenderingIntent(e, t, !0);
                    let r, n = this._intentStates.get(s.cacheKey);
                    if (!n) {
                        n = Object.create(null);
                        this._intentStates.set(s.cacheKey, n)
                    }
                    if (!n.opListReadCapability) {
                        r = Object.create(null);
                        r.operatorListChanged = function operatorListChanged() {
                            if (n.operatorList.lastChunk) {
                                n.opListReadCapability.resolve(n.operatorList);
                                n.renderTasks.delete(r)
                            }
                        }
                        ;
                        n.opListReadCapability = (0,
                        _util.createPromiseCapability)();
                        (n.renderTasks ||= new Set).add(r);
                        n.operatorList = {
                            fnArray: [],
                            argsArray: [],
                            lastChunk: !1
                        };
                        this._stats && this._stats.time("Page Request");
                        this._pumpOperatorList(s)
                    }
                    return n.opListReadCapability.promise
                }
                streamTextContent({normalizeWhitespace: e=!1, disableCombineTextItems: t=!1, includeMarkedContent: s=!1}={}) {
                    return this._transport.messageHandler.sendWithStream("GetTextContent", {
                        pageIndex: this._pageIndex,
                        normalizeWhitespace: !0 === e,
                        combineTextItems: !0 !== t,
                        includeMarkedContent: !0 === s
                    }, {
                        highWaterMark: 100,
                        size: e=>e.items.length
                    })
                }
                getTextContent(e={}) {
                    if (this._transport._htmlForXfa)
                        return this.getXfa().then((e=>_xfa_text.XfaText.textContent(e)));
                    const t = this.streamTextContent(e);
                    return new Promise((function(e, s) {
                        const r = t.getReader()
                          , n = {
                            items: [],
                            styles: Object.create(null)
                        };
                        !function pump() {
                            r.read().then((function({value: t, done: s}) {
                                if (s)
                                    e(n);
                                else {
                                    Object.assign(n.styles, t.styles);
                                    n.items.push(...t.items);
                                    pump()
                                }
                            }
                            ), s)
                        }()
                    }
                    ))
                }
                getStructTree() {
                    return this._structTreePromise ||= this._transport.getStructTree(this._pageIndex)
                }
                _destroy() {
                    this.destroyed = !0;
                    this._transport.pageCache[this._pageIndex] = null;
                    const e = [];
                    for (const t of this._intentStates.values()) {
                        this._abortOperatorList({
                            intentState: t,
                            reason: new Error("Page was destroyed."),
                            force: !0
                        });
                        if (!t.opListReadCapability)
                            for (const s of t.renderTasks) {
                                e.push(s.completed);
                                s.cancel()
                            }
                    }
                    this.objs.clear();
                    this._annotationPromises.clear();
                    this._jsActionsPromise = null;
                    this._structTreePromise = null;
                    this.pendingCleanup = !1;
                    return Promise.all(e)
                }
                cleanup(e=!1) {
                    this.pendingCleanup = !0;
                    return this._tryCleanup(e)
                }
                _tryCleanup(e=!1) {
                    if (!this.pendingCleanup)
                        return !1;
                    for (const {renderTasks: e, operatorList: t} of this._intentStates.values())
                        if (e.size > 0 || !t.lastChunk)
                            return !1;
                    this._intentStates.clear();
                    this.objs.clear();
                    this._annotationPromises.clear();
                    this._jsActionsPromise = null;
                    this._structTreePromise = null;
                    e && this._stats && (this._stats = new _display_utils.StatTimer);
                    this.pendingCleanup = !1;
                    return !0
                }
                _startRenderPage(e, t) {
                    const s = this._intentStates.get(t);
                    if (s) {
                        this._stats && this._stats.timeEnd("Page Request");
                        s.displayReadyCapability && s.displayReadyCapability.resolve(e)
                    }
                }
                _renderPageChunk(e, t) {
                    for (let s = 0, r = e.length; s < r; s++) {
                        t.operatorList.fnArray.push(e.fnArray[s]);
                        t.operatorList.argsArray.push(e.argsArray[s])
                    }
                    t.operatorList.lastChunk = e.lastChunk;
                    for (const e of t.renderTasks)
                        e.operatorListChanged();
                    e.lastChunk && this._tryCleanup()
                }
                _pumpOperatorList({renderingIntent: e, cacheKey: t}) {
                    const s = this._transport.messageHandler.sendWithStream("GetOperatorList", {
                        pageIndex: this._pageIndex,
                        intent: e,
                        cacheKey: t,
                        annotationStorage: e & _util.RenderingIntentFlag.ANNOTATIONS_STORAGE ? this._transport.annotationStorage.serializable : null
                    }).getReader()
                      , r = this._intentStates.get(t);
                    r.streamReader = s;
                    const pump = ()=>{
                        s.read().then((({value: e, done: t})=>{
                            if (t)
                                r.streamReader = null;
                            else if (!this._transport.destroyed) {
                                this._renderPageChunk(e, r);
                                pump()
                            }
                        }
                        ), (e=>{
                            r.streamReader = null;
                            if (!this._transport.destroyed) {
                                if (r.operatorList) {
                                    r.operatorList.lastChunk = !0;
                                    for (const e of r.renderTasks)
                                        e.operatorListChanged();
                                    this._tryCleanup()
                                }
                                if (r.displayReadyCapability)
                                    r.displayReadyCapability.reject(e);
                                else {
                                    if (!r.opListReadCapability)
                                        throw e;
                                    r.opListReadCapability.reject(e)
                                }
                            }
                        }
                        ))
                    }
                    ;
                    pump()
                }
                _abortOperatorList({intentState: e, reason: t, force: s=!1}) {
                    if (e.streamReader) {
                        if (!s) {
                            if (e.renderTasks.size > 0)
                                return;
                            if (t instanceof _display_utils.RenderingCancelledException) {
                                e.streamReaderCancelTimeout = setTimeout((()=>{
                                    this._abortOperatorList({
                                        intentState: e,
                                        reason: t,
                                        force: !0
                                    });
                                    e.streamReaderCancelTimeout = null
                                }
                                ), RENDERING_CANCELLED_TIMEOUT);
                                return
                            }
                        }
                        e.streamReader.cancel(new _util.AbortException(t.message)).catch((()=>{}
                        ));
                        e.streamReader = null;
                        if (!this._transport.destroyed) {
                            for (const [t,s] of this._intentStates)
                                if (s === e) {
                                    this._intentStates.delete(t);
                                    break
                                }
                            this.cleanup()
                        }
                    }
                }
                get stats() {
                    return this._stats
                }
            }
            exports.PDFPageProxy = PDFPageProxy;
            class LoopbackPort {
                constructor() {
                    this._listeners = [];
                    this._deferred = Promise.resolve(void 0)
                }
                postMessage(e, t) {
                    const s = new WeakMap
                      , r = {
                        data: function cloneValue(e) {
                            if ("function" == typeof e || "symbol" == typeof e || e instanceof URL)
                                throw new Error(`LoopbackPort.postMessage - cannot clone: ${e?.toString()}`);
                            if ("object" != typeof e || null === e)
                                return e;
                            if (s.has(e))
                                return s.get(e);
                            let r, n;
                            if ((r = e.buffer) && (0,
                            _util.isArrayBuffer)(r)) {
                                n = t?.includes(r) ? new e.constructor(r,e.byteOffset,e.byteLength) : new e.constructor(e);
                                s.set(e, n);
                                return n
                            }
                            if (e instanceof Map) {
                                n = new Map;
                                s.set(e, n);
                                for (const [t,s] of e)
                                    n.set(t, cloneValue(s));
                                return n
                            }
                            if (e instanceof Set) {
                                n = new Set;
                                s.set(e, n);
                                for (const t of e)
                                    n.add(cloneValue(t));
                                return n
                            }
                            n = Array.isArray(e) ? [] : Object.create(null);
                            s.set(e, n);
                            for (const t in e) {
                                let s, r = e;
                                for (; !(s = Object.getOwnPropertyDescriptor(r, t)); )
                                    r = Object.getPrototypeOf(r);
                                void 0 !== s.value && (("function" != typeof s.value || e.hasOwnProperty?.(t)) && (n[t] = cloneValue(s.value)))
                            }
                            return n
                        }(e)
                    };
                    this._deferred.then((()=>{
                        for (const e of this._listeners)
                            e.call(this, r)
                    }
                    ))
                }
                addEventListener(e, t) {
                    this._listeners.push(t)
                }
                removeEventListener(e, t) {
                    const s = this._listeners.indexOf(t);
                    this._listeners.splice(s, 1)
                }
                terminate() {
                    this._listeners.length = 0
                }
            }
            exports.LoopbackPort = LoopbackPort;
            const PDFWorkerUtil = {
                isWorkerDisabled: !1,
                fallbackWorkerSrc: null,
                fakeWorkerId: 0
            };
            if (_is_node.isNodeJS && "function" == typeof require) {
                PDFWorkerUtil.isWorkerDisabled = !0;
                PDFWorkerUtil.fallbackWorkerSrc = "./pdf.worker.js"
            } else if ("object" == typeof document) {
                const e = document?.currentScript?.src;
                e && (PDFWorkerUtil.fallbackWorkerSrc = e.replace(/(\.(?:min\.)?js)(\?.*)?$/i, ".worker$1$2"))
            }
            PDFWorkerUtil.createCDNWrapper = function(e) {
                const t = `importScripts("${e}");`;
                return URL.createObjectURL(new Blob([t]))
            }
            ;
            class PDFWorker {
                static get _workerPorts() {
                    return (0,
                    _util.shadow)(this, "_workerPorts", new WeakMap)
                }
                constructor({name: e=null, port: t=null, verbosity: s=(0,
                _util.getVerbosityLevel)()}={}) {
                    if (t && PDFWorker._workerPorts.has(t))
                        throw new Error("Cannot use more than one PDFWorker per port.");
                    this.name = e;
                    this.destroyed = !1;
                    this.postMessageTransfers = !0;
                    this.verbosity = s;
                    this._readyCapability = (0,
                    _util.createPromiseCapability)();
                    this._port = null;
                    this._webWorker = null;
                    this._messageHandler = null;
                    if (t) {
                        PDFWorker._workerPorts.set(t, this);
                        this._initializeFromPort(t)
                    } else
                        this._initialize()
                }
                get promise() {
                    return this._readyCapability.promise
                }
                get port() {
                    return this._port
                }
                get messageHandler() {
                    return this._messageHandler
                }
                _initializeFromPort(e) {
                    this._port = e;
                    this._messageHandler = new _message_handler.MessageHandler("main","worker",e);
                    this._messageHandler.on("ready", (function() {}
                    ));
                    this._readyCapability.resolve()
                }
                _initialize() {
                    if ("undefined" != typeof Worker && !PDFWorkerUtil.isWorkerDisabled && !PDFWorker._mainThreadWorkerMessageHandler) {
                        let e = PDFWorker.workerSrc;
                        try {
                            (0,
                            _util.isSameOrigin)(window.location.href, e) || (e = PDFWorkerUtil.createCDNWrapper(new URL(e,window.location).href));
                            const t = new Worker(e)
                              , s = new _message_handler.MessageHandler("main","worker",t)
                              , terminateEarly = ()=>{
                                t.removeEventListener("error", onWorkerError);
                                s.destroy();
                                t.terminate();
                                this.destroyed ? this._readyCapability.reject(new Error("Worker was destroyed")) : this._setupFakeWorker()
                            }
                              , onWorkerError = ()=>{
                                this._webWorker || terminateEarly()
                            }
                            ;
                            t.addEventListener("error", onWorkerError);
                            s.on("test", (e=>{
                                t.removeEventListener("error", onWorkerError);
                                if (this.destroyed)
                                    terminateEarly();
                                else if (e) {
                                    this._messageHandler = s;
                                    this._port = t;
                                    this._webWorker = t;
                                    e.supportTransfers || (this.postMessageTransfers = !1);
                                    this._readyCapability.resolve();
                                    s.send("configure", {
                                        verbosity: this.verbosity
                                    })
                                } else {
                                    this._setupFakeWorker();
                                    s.destroy();
                                    t.terminate()
                                }
                            }
                            ));
                            s.on("ready", (e=>{
                                t.removeEventListener("error", onWorkerError);
                                if (this.destroyed)
                                    terminateEarly();
                                else
                                    try {
                                        sendTest()
                                    } catch (e) {
                                        this._setupFakeWorker()
                                    }
                            }
                            ));
                            const sendTest = ()=>{
                                const e = new Uint8Array([this.postMessageTransfers ? 255 : 0]);
                                try {
                                    s.send("test", e, [e.buffer])
                                } catch (t) {
                                    (0,
                                    _util.warn)("Cannot use postMessage transfers.");
                                    e[0] = 0;
                                    s.send("test", e)
                                }
                            }
                            ;
                            sendTest();
                            return
                        } catch (e) {
                            (0,
                            _util.info)("The worker has been disabled.")
                        }
                    }
                    this._setupFakeWorker()
                }
                _setupFakeWorker() {
                    if (!PDFWorkerUtil.isWorkerDisabled) {
                        (0,
                        _util.warn)("Setting up fake worker.");
                        PDFWorkerUtil.isWorkerDisabled = !0
                    }
                    PDFWorker._setupFakeWorkerGlobal.then((e=>{
                        if (this.destroyed) {
                            this._readyCapability.reject(new Error("Worker was destroyed"));
                            return
                        }
                        const t = new LoopbackPort;
                        this._port = t;
                        const s = "fake" + PDFWorkerUtil.fakeWorkerId++
                          , r = new _message_handler.MessageHandler(s + "_worker",s,t);
                        e.setup(r, t);
                        const n = new _message_handler.MessageHandler(s,s + "_worker",t);
                        this._messageHandler = n;
                        this._readyCapability.resolve();
                        n.send("configure", {
                            verbosity: this.verbosity
                        })
                    }
                    )).catch((e=>{
                        this._readyCapability.reject(new Error(`Setting up fake worker failed: "${e.message}".`))
                    }
                    ))
                }
                destroy() {
                    this.destroyed = !0;
                    if (this._webWorker) {
                        this._webWorker.terminate();
                        this._webWorker = null
                    }
                    PDFWorker._workerPorts.delete(this._port);
                    this._port = null;
                    if (this._messageHandler) {
                        this._messageHandler.destroy();
                        this._messageHandler = null
                    }
                }
                static fromPort(e) {
                    if (!e?.port)
                        throw new Error("PDFWorker.fromPort - invalid method signature.");
                    return this._workerPorts.has(e.port) ? this._workerPorts.get(e.port) : new PDFWorker(e)
                }
                static get workerSrc() {
                    if (_worker_options.GlobalWorkerOptions.workerSrc)
                        return _worker_options.GlobalWorkerOptions.workerSrc;
                    if (null !== PDFWorkerUtil.fallbackWorkerSrc) {
                        _is_node.isNodeJS || (0,
                        _display_utils.deprecated)('No "GlobalWorkerOptions.workerSrc" specified.');
                        return PDFWorkerUtil.fallbackWorkerSrc
                    }
                    throw new Error('No "GlobalWorkerOptions.workerSrc" specified.')
                }
                static get _mainThreadWorkerMessageHandler() {
                    try {
                        return globalThis.pdfjsWorker?.WorkerMessageHandler || null
                    } catch (e) {
                        return null
                    }
                }
                static get _setupFakeWorkerGlobal() {
                    const loader = async()=>{
                        const mainWorkerMessageHandler = this._mainThreadWorkerMessageHandler;
                        if (mainWorkerMessageHandler)
                            return mainWorkerMessageHandler;
                        if (_is_node.isNodeJS && "function" == typeof require) {
                            const worker = eval("require")(this.workerSrc);
                            return worker.WorkerMessageHandler
                        }
                        await (0,
                        _display_utils.loadScript)(this.workerSrc);
                        return window.pdfjsWorker.WorkerMessageHandler
                    }
                    ;
                    return (0,
                    _util.shadow)(this, "_setupFakeWorkerGlobal", loader())
                }
            }
            exports.PDFWorker = PDFWorker;
            PDFWorker.getWorkerSrc = function() {
                (0,
                _display_utils.deprecated)("`PDFWorker.getWorkerSrc()`, please use `PDFWorker.workerSrc` instead.");
                return this.workerSrc
            }
            ;
            class WorkerTransport {
                constructor(e, t, s, r) {
                    this.messageHandler = e;
                    this.loadingTask = t;
                    this.commonObjs = new PDFObjects;
                    this.fontLoader = new _font_loader.FontLoader({
                        docId: t.docId,
                        onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
                        ownerDocument: r.ownerDocument,
                        styleElement: r.styleElement
                    });
                    this._params = r;
                    if (!r.useWorkerFetch) {
                        this.CMapReaderFactory = new r.CMapReaderFactory({
                            baseUrl: r.cMapUrl,
                            isCompressed: r.cMapPacked
                        });
                        this.StandardFontDataFactory = new r.StandardFontDataFactory({
                            baseUrl: r.standardFontDataUrl
                        })
                    }
                    this.destroyed = !1;
                    this.destroyCapability = null;
                    this._passwordCapability = null;
                    this._networkStream = s;
                    this._fullReader = null;
                    this._lastProgress = null;
                    this.pageCache = [];
                    this.pagePromises = [];
                    this.downloadInfoCapability = (0,
                    _util.createPromiseCapability)();
                    this.setupMessageHandler()
                }
                get annotationStorage() {
                    return (0,
                    _util.shadow)(this, "annotationStorage", new _annotation_storage.AnnotationStorage)
                }
                getRenderingIntent(e, t=_util.AnnotationMode.ENABLE, s=!1) {
                    let r = _util.RenderingIntentFlag.DISPLAY
                      , n = "";
                    switch (e) {
                    case "any":
                        r = _util.RenderingIntentFlag.ANY;
                        break;
                    case "display":
                        break;
                    case "print":
                        r = _util.RenderingIntentFlag.PRINT;
                        break;
                    default:
                        (0,
                        _util.warn)(`getRenderingIntent - invalid intent: ${e}`)
                    }
                    switch (t) {
                    case _util.AnnotationMode.DISABLE:
                        r += _util.RenderingIntentFlag.ANNOTATIONS_DISABLE;
                        break;
                    case _util.AnnotationMode.ENABLE:
                        break;
                    case _util.AnnotationMode.ENABLE_FORMS:
                        r += _util.RenderingIntentFlag.ANNOTATIONS_FORMS;
                        break;
                    case _util.AnnotationMode.ENABLE_STORAGE:
                        r += _util.RenderingIntentFlag.ANNOTATIONS_STORAGE;
                        n = this.annotationStorage.lastModified;
                        break;
                    default:
                        (0,
                        _util.warn)(`getRenderingIntent - invalid annotationMode: ${t}`)
                    }
                    s && (r += _util.RenderingIntentFlag.OPLIST);
                    return {
                        renderingIntent: r,
                        cacheKey: `${r}_${n}`
                    }
                }
                destroy() {
                    if (this.destroyCapability)
                        return this.destroyCapability.promise;
                    this.destroyed = !0;
                    this.destroyCapability = (0,
                    _util.createPromiseCapability)();
                    this._passwordCapability && this._passwordCapability.reject(new Error("Worker was destroyed during onPassword callback"));
                    const e = [];
                    for (const t of this.pageCache)
                        t && e.push(t._destroy());
                    this.pageCache.length = 0;
                    this.pagePromises.length = 0;
                    this.hasOwnProperty("annotationStorage") && this.annotationStorage.resetModified();
                    const t = this.messageHandler.sendWithPromise("Terminate", null);
                    e.push(t);
                    Promise.all(e).then((()=>{
                        this.commonObjs.clear();
                        this.fontLoader.clear();
                        this._getFieldObjectsPromise = null;
                        this._hasJSActionsPromise = null;
                        this._networkStream && this._networkStream.cancelAllRequests(new _util.AbortException("Worker was terminated."));
                        if (this.messageHandler) {
                            this.messageHandler.destroy();
                            this.messageHandler = null
                        }
                        this.destroyCapability.resolve()
                    }
                    ), this.destroyCapability.reject);
                    return this.destroyCapability.promise
                }
                setupMessageHandler() {
                    const {messageHandler: e, loadingTask: t} = this;
                    e.on("GetReader", ((e,t)=>{
                        (0,
                        _util.assert)(this._networkStream, "GetReader - no `IPDFStream` instance available.");
                        this._fullReader = this._networkStream.getFullReader();
                        this._fullReader.onProgress = e=>{
                            this._lastProgress = {
                                loaded: e.loaded,
                                total: e.total
                            }
                        }
                        ;
                        t.onPull = ()=>{
                            this._fullReader.read().then((function({value: e, done: s}) {
                                if (s)
                                    t.close();
                                else {
                                    (0,
                                    _util.assert)((0,
                                    _util.isArrayBuffer)(e), "GetReader - expected an ArrayBuffer.");
                                    t.enqueue(new Uint8Array(e), 1, [e])
                                }
                            }
                            )).catch((e=>{
                                t.error(e)
                            }
                            ))
                        }
                        ;
                        t.onCancel = e=>{
                            this._fullReader.cancel(e);
                            t.ready.catch((e=>{
                                if (!this.destroyed)
                                    throw e
                            }
                            ))
                        }
                    }
                    ));
                    e.on("ReaderHeadersReady", (e=>{
                        const s = (0,
                        _util.createPromiseCapability)()
                          , r = this._fullReader;
                        r.headersReady.then((()=>{
                            if (!r.isStreamingSupported || !r.isRangeSupported) {
                                this._lastProgress && t.onProgress && t.onProgress(this._lastProgress);
                                r.onProgress = e=>{
                                    t.onProgress && t.onProgress({
                                        loaded: e.loaded,
                                        total: e.total
                                    })
                                }
                            }
                            s.resolve({
                                isStreamingSupported: r.isStreamingSupported,
                                isRangeSupported: r.isRangeSupported,
                                contentLength: r.contentLength
                            })
                        }
                        ), s.reject);
                        return s.promise
                    }
                    ));
                    e.on("GetRangeReader", ((e,t)=>{
                        (0,
                        _util.assert)(this._networkStream, "GetRangeReader - no `IPDFStream` instance available.");
                        const s = this._networkStream.getRangeReader(e.begin, e.end);
                        if (s) {
                            t.onPull = ()=>{
                                s.read().then((function({value: e, done: s}) {
                                    if (s)
                                        t.close();
                                    else {
                                        (0,
                                        _util.assert)((0,
                                        _util.isArrayBuffer)(e), "GetRangeReader - expected an ArrayBuffer.");
                                        t.enqueue(new Uint8Array(e), 1, [e])
                                    }
                                }
                                )).catch((e=>{
                                    t.error(e)
                                }
                                ))
                            }
                            ;
                            t.onCancel = e=>{
                                s.cancel(e);
                                t.ready.catch((e=>{
                                    if (!this.destroyed)
                                        throw e
                                }
                                ))
                            }
                        } else
                            t.close()
                    }
                    ));
                    e.on("GetDoc", (({pdfInfo: e})=>{
                        this._numPages = e.numPages;
                        this._htmlForXfa = e.htmlForXfa;
                        delete e.htmlForXfa;
                        t._capability.resolve(new PDFDocumentProxy(e,this))
                    }
                    ));
                    e.on("DocException", (function(e) {
                        let s;
                        switch (e.name) {
                        case "PasswordException":
                            s = new _util.PasswordException(e.message,e.code);
                            break;
                        case "InvalidPDFException":
                            s = new _util.InvalidPDFException(e.message);
                            break;
                        case "MissingPDFException":
                            s = new _util.MissingPDFException(e.message);
                            break;
                        case "UnexpectedResponseException":
                            s = new _util.UnexpectedResponseException(e.message,e.status);
                            break;
                        case "UnknownErrorException":
                            s = new _util.UnknownErrorException(e.message,e.details);
                            break;
                        default:
                            (0,
                            _util.unreachable)("DocException - expected a valid Error.")
                        }
                        t._capability.reject(s)
                    }
                    ));
                    e.on("PasswordRequest", (e=>{
                        this._passwordCapability = (0,
                        _util.createPromiseCapability)();
                        if (t.onPassword) {
                            const updatePassword = e=>{
                                this._passwordCapability.resolve({
                                    password: e
                                })
                            }
                            ;
                            try {
                                t.onPassword(updatePassword, e.code)
                            } catch (e) {
                                this._passwordCapability.reject(e)
                            }
                        } else
                            this._passwordCapability.reject(new _util.PasswordException(e.message,e.code));
                        return this._passwordCapability.promise
                    }
                    ));
                    e.on("DataLoaded", (e=>{
                        t.onProgress && t.onProgress({
                            loaded: e.length,
                            total: e.length
                        });
                        this.downloadInfoCapability.resolve(e)
                    }
                    ));
                    e.on("StartRenderPage", (e=>{
                        if (this.destroyed)
                            return;
                        this.pageCache[e.pageIndex]._startRenderPage(e.transparency, e.cacheKey)
                    }
                    ));
                    e.on("commonobj", (t=>{
                        if (this.destroyed)
                            return;
                        const [s,r,n] = t;
                        if (!this.commonObjs.has(s))
                            switch (r) {
                            case "Font":
                                const t = this._params;
                                if ("error"in n) {
                                    const e = n.error;
                                    (0,
                                    _util.warn)(`Error during font loading: ${e}`);
                                    this.commonObjs.resolve(s, e);
                                    break
                                }
                                let a = null;
                                t.pdfBug && globalThis.FontInspector?.enabled && (a = {
                                    registerFont(e, t) {
                                        globalThis.FontInspector.fontAdded(e, t)
                                    }
                                });
                                const i = new _font_loader.FontFaceObject(n,{
                                    isEvalSupported: t.isEvalSupported,
                                    disableFontFace: t.disableFontFace,
                                    ignoreErrors: t.ignoreErrors,
                                    onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
                                    fontRegistry: a
                                });
                                this.fontLoader.bind(i).catch((t=>e.sendWithPromise("FontFallback", {
                                    id: s
                                }))).finally((()=>{
                                    !t.fontExtraProperties && i.data && (i.data = null);
                                    this.commonObjs.resolve(s, i)
                                }
                                ));
                                break;
                            case "FontPath":
                            case "Image":
                                this.commonObjs.resolve(s, n);
                                break;
                            default:
                                throw new Error(`Got unknown common object type ${r}`)
                            }
                    }
                    ));
                    e.on("obj", (e=>{
                        if (this.destroyed)
                            return;
                        const [t,s,r,n] = e
                          , a = this.pageCache[s];
                        if (!a.objs.has(t))
                            switch (r) {
                            case "Image":
                                a.objs.resolve(t, n);
                                const e = 8e6;
                                n?.data?.length > e && (a.cleanupAfterRender = !0);
                                break;
                            case "Pattern":
                                a.objs.resolve(t, n);
                                break;
                            default:
                                throw new Error(`Got unknown object type ${r}`)
                            }
                    }
                    ));
                    e.on("DocProgress", (e=>{
                        this.destroyed || t.onProgress && t.onProgress({
                            loaded: e.loaded,
                            total: e.total
                        })
                    }
                    ));
                    e.on("UnsupportedFeature", this._onUnsupportedFeature.bind(this));
                    e.on("FetchBuiltInCMap", (e=>this.destroyed ? Promise.reject(new Error("Worker was destroyed.")) : this.CMapReaderFactory ? this.CMapReaderFactory.fetch(e) : Promise.reject(new Error("CMapReaderFactory not initialized, see the `useWorkerFetch` parameter."))));
                    e.on("FetchStandardFontData", (e=>this.destroyed ? Promise.reject(new Error("Worker was destroyed.")) : this.StandardFontDataFactory ? this.StandardFontDataFactory.fetch(e) : Promise.reject(new Error("StandardFontDataFactory not initialized, see the `useWorkerFetch` parameter."))))
                }
                _onUnsupportedFeature({featureId: e}) {
                    this.destroyed || this.loadingTask.onUnsupportedFeature && this.loadingTask.onUnsupportedFeature(e)
                }
                getData() {
                    return this.messageHandler.sendWithPromise("GetData", null)
                }
                getPage(e) {
                    if (!Number.isInteger(e) || e <= 0 || e > this._numPages)
                        return Promise.reject(new Error("Invalid page request"));
                    const t = e - 1;
                    if (t in this.pagePromises)
                        return this.pagePromises[t];
                    const s = this.messageHandler.sendWithPromise("GetPage", {
                        pageIndex: t
                    }).then((e=>{
                        if (this.destroyed)
                            throw new Error("Transport destroyed");
                        const s = new PDFPageProxy(t,e,this,this._params.ownerDocument,this._params.pdfBug);
                        this.pageCache[t] = s;
                        return s
                    }
                    ));
                    this.pagePromises[t] = s;
                    return s
                }
                getPageIndex(e) {
                    return this.messageHandler.sendWithPromise("GetPageIndex", {
                        ref: e
                    })
                }
                getAnnotations(e, t) {
                    return this.messageHandler.sendWithPromise("GetAnnotations", {
                        pageIndex: e,
                        intent: t
                    })
                }
                saveDocument() {
                    return this.messageHandler.sendWithPromise("SaveDocument", {
                        isPureXfa: !!this._htmlForXfa,
                        numPages: this._numPages,
                        annotationStorage: this.annotationStorage.serializable,
                        filename: this._fullReader?.filename ?? null
                    }).finally((()=>{
                        this.annotationStorage.resetModified()
                    }
                    ))
                }
                getFieldObjects() {
                    return this._getFieldObjectsPromise ||= this.messageHandler.sendWithPromise("GetFieldObjects", null)
                }
                hasJSActions() {
                    return this._hasJSActionsPromise ||= this.messageHandler.sendWithPromise("HasJSActions", null)
                }
                getCalculationOrderIds() {
                    return this.messageHandler.sendWithPromise("GetCalculationOrderIds", null)
                }
                getDestinations() {
                    return this.messageHandler.sendWithPromise("GetDestinations", null)
                }
                getDestination(e) {
                    return "string" != typeof e ? Promise.reject(new Error("Invalid destination request.")) : this.messageHandler.sendWithPromise("GetDestination", {
                        id: e
                    })
                }
                getPageLabels() {
                    return this.messageHandler.sendWithPromise("GetPageLabels", null)
                }
                getPageLayout() {
                    return this.messageHandler.sendWithPromise("GetPageLayout", null)
                }
                getPageMode() {
                    return this.messageHandler.sendWithPromise("GetPageMode", null)
                }
                getViewerPreferences() {
                    return this.messageHandler.sendWithPromise("GetViewerPreferences", null)
                }
                getOpenAction() {
                    return this.messageHandler.sendWithPromise("GetOpenAction", null)
                }
                getAttachments() {
                    return this.messageHandler.sendWithPromise("GetAttachments", null)
                }
                getJavaScript() {
                    return this.messageHandler.sendWithPromise("GetJavaScript", null)
                }
                getDocJSActions() {
                    return this.messageHandler.sendWithPromise("GetDocJSActions", null)
                }
                getPageJSActions(e) {
                    return this.messageHandler.sendWithPromise("GetPageJSActions", {
                        pageIndex: e
                    })
                }
                getStructTree(e) {
                    return this.messageHandler.sendWithPromise("GetStructTree", {
                        pageIndex: e
                    })
                }
                getOutline() {
                    return this.messageHandler.sendWithPromise("GetOutline", null)
                }
                getOptionalContentConfig() {
                    return this.messageHandler.sendWithPromise("GetOptionalContentConfig", null).then((e=>new _optional_content_config.OptionalContentConfig(e)))
                }
                getPermissions() {
                    return this.messageHandler.sendWithPromise("GetPermissions", null)
                }
                getMetadata() {
                    return this.messageHandler.sendWithPromise("GetMetadata", null).then((e=>({
                        info: e[0],
                        metadata: e[1] ? new _metadata.Metadata(e[1]) : null,
                        contentDispositionFilename: this._fullReader?.filename ?? null,
                        contentLength: this._fullReader?.contentLength ?? null
                    })))
                }
                getMarkInfo() {
                    return this.messageHandler.sendWithPromise("GetMarkInfo", null)
                }
                getStats() {
                    return this.messageHandler.sendWithPromise("GetStats", null)
                }
                async startCleanup(e=!1) {
                    await this.messageHandler.sendWithPromise("Cleanup", null);
                    if (!this.destroyed) {
                        for (let e = 0, t = this.pageCache.length; e < t; e++) {
                            const t = this.pageCache[e];
                            if (!t)
                                continue;
                            if (!t.cleanup())
                                throw new Error(`startCleanup: Page ${e + 1} is currently rendering.`)
                        }
                        this.commonObjs.clear();
                        e || this.fontLoader.clear();
                        this._getFieldObjectsPromise = null;
                        this._hasJSActionsPromise = null
                    }
                }
                get loadingParams() {
                    const e = this._params;
                    return (0,
                    _util.shadow)(this, "loadingParams", {
                        disableAutoFetch: e.disableAutoFetch,
                        enableXfa: e.enableXfa
                    })
                }
            }
            class PDFObjects {
                constructor() {
                    this._objs = Object.create(null)
                }
                _ensureObj(e) {
                    return this._objs[e] ? this._objs[e] : this._objs[e] = {
                        capability: (0,
                        _util.createPromiseCapability)(),
                        data: null,
                        resolved: !1
                    }
                }
                get(e, t=null) {
                    if (t) {
                        this._ensureObj(e).capability.promise.then(t);
                        return null
                    }
                    const s = this._objs[e];
                    if (!s || !s.resolved)
                        throw new Error(`Requesting object that isn't resolved yet ${e}.`);
                    return s.data
                }
                has(e) {
                    return this._objs[e]?.resolved || !1
                }
                resolve(e, t) {
                    const s = this._ensureObj(e);
                    s.resolved = !0;
                    s.data = t;
                    s.capability.resolve(t)
                }
                clear() {
                    this._objs = Object.create(null)
                }
            }
            class RenderTask {
                constructor(e) {
                    this._internalRenderTask = e;
                    this.onContinue = null
                }
                get promise() {
                    return this._internalRenderTask.capability.promise
                }
                cancel() {
                    this._internalRenderTask.cancel()
                }
            }
            exports.RenderTask = RenderTask;
            class InternalRenderTask {
                static get canvasInUse() {
                    return (0,
                    _util.shadow)(this, "canvasInUse", new WeakSet)
                }
                constructor({callback: e, params: t, objs: s, commonObjs: r, operatorList: n, pageIndex: a, canvasFactory: i, useRequestAnimationFrame: o=!1, pdfBug: l=!1}) {
                    this.callback = e;
                    this.params = t;
                    this.objs = s;
                    this.commonObjs = r;
                    this.operatorListIdx = null;
                    this.operatorList = n;
                    this._pageIndex = a;
                    this.canvasFactory = i;
                    this._pdfBug = l;
                    this.running = !1;
                    this.graphicsReadyCallback = null;
                    this.graphicsReady = !1;
                    this._useRequestAnimationFrame = !0 === o && "undefined" != typeof window;
                    this.cancelled = !1;
                    this.capability = (0,
                    _util.createPromiseCapability)();
                    this.task = new RenderTask(this);
                    this._cancelBound = this.cancel.bind(this);
                    this._continueBound = this._continue.bind(this);
                    this._scheduleNextBound = this._scheduleNext.bind(this);
                    this._nextBound = this._next.bind(this);
                    this._canvas = t.canvasContext.canvas
                }
                get completed() {
                    return this.capability.promise.catch((function() {}
                    ))
                }
                initializeGraphics({transparency: e=!1, optionalContentConfig: t}) {
                    if (this.cancelled)
                        return;
                    if (this._canvas) {
                        if (InternalRenderTask.canvasInUse.has(this._canvas))
                            throw new Error("Cannot use the same canvas during multiple render() operations. Use different canvas or ensure previous operations were cancelled or completed.");
                        InternalRenderTask.canvasInUse.add(this._canvas)
                    }
                    if (this._pdfBug && globalThis.StepperManager?.enabled) {
                        this.stepper = globalThis.StepperManager.create(this._pageIndex);
                        this.stepper.init(this.operatorList);
                        this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint()
                    }
                    const {canvasContext: s, viewport: r, transform: n, imageLayer: a, background: i} = this.params;
                    this.gfx = new _canvas.CanvasGraphics(s,this.commonObjs,this.objs,this.canvasFactory,a,t);
                    this.gfx.beginDrawing({
                        transform: n,
                        viewport: r,
                        transparency: e,
                        background: i
                    });
                    this.operatorListIdx = 0;
                    this.graphicsReady = !0;
                    this.graphicsReadyCallback && this.graphicsReadyCallback()
                }
                cancel(e=null) {
                    this.running = !1;
                    this.cancelled = !0;
                    this.gfx && this.gfx.endDrawing();
                    this._canvas && InternalRenderTask.canvasInUse.delete(this._canvas);
                    this.callback(e || new _display_utils.RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`,"canvas"))
                }
                operatorListChanged() {
                    if (this.graphicsReady) {
                        this.stepper && this.stepper.updateOperatorList(this.operatorList);
                        this.running || this._continue()
                    } else
                        this.graphicsReadyCallback || (this.graphicsReadyCallback = this._continueBound)
                }
                _continue() {
                    this.running = !0;
                    this.cancelled || (this.task.onContinue ? this.task.onContinue(this._scheduleNextBound) : this._scheduleNext())
                }
                _scheduleNext() {
                    this._useRequestAnimationFrame ? window.requestAnimationFrame((()=>{
                        this._nextBound().catch(this._cancelBound)
                    }
                    )) : Promise.resolve().then(this._nextBound).catch(this._cancelBound)
                }
                async _next() {
                    if (!this.cancelled) {
                        this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);
                        if (this.operatorListIdx === this.operatorList.argsArray.length) {
                            this.running = !1;
                            if (this.operatorList.lastChunk) {
                                this.gfx.endDrawing();
                                this._canvas && InternalRenderTask.canvasInUse.delete(this._canvas);
                                this.callback()
                            }
                        }
                    }
                }
            }
            const version = "2.11.338";
            exports.version = version;
            const build = "dedff3c98";
            exports.build = build
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.FontLoader = t.FontFaceObject = void 0;
            var r = s(2);
            class BaseFontLoader {
                constructor({docId: e, onUnsupportedFeature: t, ownerDocument: s=globalThis.document, styleElement: n=null}) {
                    this.constructor === BaseFontLoader && (0,
                    r.unreachable)("Cannot initialize BaseFontLoader.");
                    this.docId = e;
                    this._onUnsupportedFeature = t;
                    this._document = s;
                    this.nativeFontFaces = [];
                    this.styleElement = null
                }
                addNativeFontFace(e) {
                    this.nativeFontFaces.push(e);
                    this._document.fonts.add(e)
                }
                insertRule(e) {
                    let t = this.styleElement;
                    if (!t) {
                        t = this.styleElement = this._document.createElement("style");
                        t.id = `PDFJS_FONT_STYLE_TAG_${this.docId}`;
                        this._document.documentElement.getElementsByTagName("head")[0].appendChild(t)
                    }
                    const s = t.sheet;
                    s.insertRule(e, s.cssRules.length)
                }
                clear() {
                    for (const e of this.nativeFontFaces)
                        this._document.fonts.delete(e);
                    this.nativeFontFaces.length = 0;
                    if (this.styleElement) {
                        this.styleElement.remove();
                        this.styleElement = null
                    }
                }
                async bind(e) {
                    if (e.attached || e.missingFile)
                        return;
                    e.attached = !0;
                    if (this.isFontLoadingAPISupported) {
                        const t = e.createNativeFontFace();
                        if (t) {
                            this.addNativeFontFace(t);
                            try {
                                await t.loaded
                            } catch (s) {
                                this._onUnsupportedFeature({
                                    featureId: r.UNSUPPORTED_FEATURES.errorFontLoadNative
                                });
                                (0,
                                r.warn)(`Failed to load font '${t.family}': '${s}'.`);
                                e.disableFontFace = !0;
                                throw s
                            }
                        }
                        return
                    }
                    const t = e.createFontFaceRule();
                    if (t) {
                        this.insertRule(t);
                        if (this.isSyncFontLoadingSupported)
                            return;
                        await new Promise((s=>{
                            const r = this._queueLoadingCallback(s);
                            this._prepareFontLoadEvent([t], [e], r)
                        }
                        ))
                    }
                }
                _queueLoadingCallback(e) {
                    (0,
                    r.unreachable)("Abstract method `_queueLoadingCallback`.")
                }
                get isFontLoadingAPISupported() {
                    const e = !!this._document?.fonts;
                    return (0,
                    r.shadow)(this, "isFontLoadingAPISupported", e)
                }
                get isSyncFontLoadingSupported() {
                    (0,
                    r.unreachable)("Abstract method `isSyncFontLoadingSupported`.")
                }
                get _loadTestFont() {
                    (0,
                    r.unreachable)("Abstract method `_loadTestFont`.")
                }
                _prepareFontLoadEvent(e, t, s) {
                    (0,
                    r.unreachable)("Abstract method `_prepareFontLoadEvent`.")
                }
            }
            let n;
            t.FontLoader = n;
            t.FontLoader = n = class GenericFontLoader extends BaseFontLoader {
                constructor(e) {
                    super(e);
                    this.loadingContext = {
                        requests: [],
                        nextRequestId: 0
                    };
                    this.loadTestFontId = 0
                }
                get isSyncFontLoadingSupported() {
                    let e = !1;
                    if ("undefined" == typeof navigator)
                        e = !0;
                    else {
                        /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent)?.[1] >= 14 && (e = !0)
                    }
                    return (0,
                    r.shadow)(this, "isSyncFontLoadingSupported", e)
                }
                _queueLoadingCallback(e) {
                    const t = this.loadingContext
                      , s = {
                        id: "pdfjs-font-loading-" + t.nextRequestId++,
                        done: !1,
                        complete: function completeRequest() {
                            (0,
                            r.assert)(!s.done, "completeRequest() cannot be called twice.");
                            s.done = !0;
                            for (; t.requests.length > 0 && t.requests[0].done; ) {
                                const e = t.requests.shift();
                                setTimeout(e.callback, 0)
                            }
                        },
                        callback: e
                    };
                    t.requests.push(s);
                    return s
                }
                get _loadTestFont() {
                    return (0,
                    r.shadow)(this, "_loadTestFont", atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA=="))
                }
                _prepareFontLoadEvent(e, t, s) {
                    function int32(e, t) {
                        return e.charCodeAt(t) << 24 | e.charCodeAt(t + 1) << 16 | e.charCodeAt(t + 2) << 8 | 255 & e.charCodeAt(t + 3)
                    }
                    function spliceString(e, t, s, r) {
                        return e.substring(0, t) + r + e.substring(t + s)
                    }
                    let n, a;
                    const i = this._document.createElement("canvas");
                    i.width = 1;
                    i.height = 1;
                    const o = i.getContext("2d");
                    let l = 0;
                    const c = `lt${Date.now()}${this.loadTestFontId++}`;
                    let h = this._loadTestFont;
                    h = spliceString(h, 976, c.length, c);
                    const d = 1482184792;
                    let u = int32(h, 16);
                    for (n = 0,
                    a = c.length - 3; n < a; n += 4)
                        u = u - d + int32(c, n) | 0;
                    n < c.length && (u = u - d + int32(c + "XXX", n) | 0);
                    h = spliceString(h, 16, 4, (0,
                    r.string32)(u));
                    const p = `@font-face {font-family:"${c}";src:${`url(data:font/opentype;base64,${btoa(h)});`}}`;
                    this.insertRule(p);
                    const g = [];
                    for (const e of t)
                        g.push(e.loadedName);
                    g.push(c);
                    const f = this._document.createElement("div");
                    f.style.visibility = "hidden";
                    f.style.width = f.style.height = "10px";
                    f.style.position = "absolute";
                    f.style.top = f.style.left = "0px";
                    for (const e of g) {
                        const t = this._document.createElement("span");
                        t.textContent = "Hi";
                        t.style.fontFamily = e;
                        f.appendChild(t)
                    }
                    this._document.body.appendChild(f);
                    !function isFontReady(e, t) {
                        l++;
                        if (l > 30) {
                            (0,
                            r.warn)("Load test font never loaded.");
                            t();
                            return
                        }
                        o.font = "30px " + e;
                        o.fillText(".", 0, 20);
                        o.getImageData(0, 0, 1, 1).data[3] > 0 ? t() : setTimeout(isFontReady.bind(null, e, t))
                    }(c, (()=>{
                        this._document.body.removeChild(f);
                        s.complete()
                    }
                    ))
                }
            }
            ;
            t.FontFaceObject = class FontFaceObject {
                constructor(e, {isEvalSupported: t=!0, disableFontFace: s=!1, ignoreErrors: r=!1, onUnsupportedFeature: n, fontRegistry: a=null}) {
                    this.compiledGlyphs = Object.create(null);
                    for (const t in e)
                        this[t] = e[t];
                    this.isEvalSupported = !1 !== t;
                    this.disableFontFace = !0 === s;
                    this.ignoreErrors = !0 === r;
                    this._onUnsupportedFeature = n;
                    this.fontRegistry = a
                }
                createNativeFontFace() {
                    if (!this.data || this.disableFontFace)
                        return null;
                    let e;
                    if (this.cssFontInfo) {
                        const t = {
                            weight: this.cssFontInfo.fontWeight
                        };
                        this.cssFontInfo.italicAngle && (t.style = `oblique ${this.cssFontInfo.italicAngle}deg`);
                        e = new FontFace(this.cssFontInfo.fontFamily,this.data,t)
                    } else
                        e = new FontFace(this.loadedName,this.data,{});
                    this.fontRegistry && this.fontRegistry.registerFont(this);
                    return e
                }
                createFontFaceRule() {
                    if (!this.data || this.disableFontFace)
                        return null;
                    const e = (0,
                    r.bytesToString)(this.data)
                      , t = `url(data:${this.mimetype};base64,${btoa(e)});`;
                    let s;
                    if (this.cssFontInfo) {
                        let e = `font-weight: ${this.cssFontInfo.fontWeight};`;
                        this.cssFontInfo.italicAngle && (e += `font-style: oblique ${this.cssFontInfo.italicAngle}deg;`);
                        s = `@font-face {font-family:"${this.cssFontInfo.fontFamily}";${e}src:${t}}`
                    } else
                        s = `@font-face {font-family:"${this.loadedName}";src:${t}}`;
                    this.fontRegistry && this.fontRegistry.registerFont(this, t);
                    return s
                }
                getPathGenerator(e, t) {
                    if (void 0 !== this.compiledGlyphs[t])
                        return this.compiledGlyphs[t];
                    let s;
                    try {
                        s = e.get(this.loadedName + "_path_" + t)
                    } catch (e) {
                        if (!this.ignoreErrors)
                            throw e;
                        this._onUnsupportedFeature({
                            featureId: r.UNSUPPORTED_FEATURES.errorFontGetPath
                        });
                        (0,
                        r.warn)(`getPathGenerator - ignoring character: "${e}".`);
                        return this.compiledGlyphs[t] = function(e, t) {}
                    }
                    if (this.isEvalSupported && r.IsEvalSupportedCached.value) {
                        const e = [];
                        for (const t of s) {
                            const s = void 0 !== t.args ? t.args.join(",") : "";
                            e.push("c.", t.cmd, "(", s, ");\n")
                        }
                        return this.compiledGlyphs[t] = new Function("c","size",e.join(""))
                    }
                    return this.compiledGlyphs[t] = function(e, t) {
                        for (const r of s) {
                            "scale" === r.cmd && (r.args = [t, -t]);
                            e[r.cmd].apply(e, r.args)
                        }
                    }
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.NodeStandardFontDataFactory = t.NodeCMapReaderFactory = t.NodeCanvasFactory = void 0;
            var r = s(5)
              , n = s(4)
              , a = s(2);
            let i = class {
                constructor() {
                    (0,
                    a.unreachable)("Not implemented: NodeCanvasFactory")
                }
            }
            ;
            t.NodeCanvasFactory = i;
            let o = class {
                constructor() {
                    (0,
                    a.unreachable)("Not implemented: NodeCMapReaderFactory")
                }
            }
            ;
            t.NodeCMapReaderFactory = o;
            let l = class {
                constructor() {
                    (0,
                    a.unreachable)("Not implemented: NodeStandardFontDataFactory")
                }
            }
            ;
            t.NodeStandardFontDataFactory = l;
            if (n.isNodeJS) {
                const fetchData = function(e) {
                    return new Promise(((t,s)=>{
                        require("fs").readFile(e, ((e,r)=>{
                            !e && r ? t(new Uint8Array(r)) : s(new Error(e))
                        }
                        ))
                    }
                    ))
                };
                t.NodeCanvasFactory = i = class extends r.BaseCanvasFactory {
                    _createCanvas(e, t) {
                        return require("canvas").createCanvas(e, t)
                    }
                }
                ;
                t.NodeCMapReaderFactory = o = class extends r.BaseCMapReaderFactory {
                    _fetchData(e, t) {
                        return fetchData(e).then((e=>({
                            cMapData: e,
                            compressionType: t
                        })))
                    }
                }
                ;
                t.NodeStandardFontDataFactory = l = class extends r.BaseStandardFontDataFactory {
                    _fetchData(e) {
                        return fetchData(e)
                    }
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.AnnotationStorage = void 0;
            var r = s(2);
            t.AnnotationStorage = class AnnotationStorage {
                constructor() {
                    this._storage = new Map;
                    this._timeStamp = Date.now();
                    this._modified = !1;
                    this.onSetModified = null;
                    this.onResetModified = null
                }
                getValue(e, t) {
                    const s = this._storage.get(e);
                    return void 0 === s ? t : Object.assign(t, s)
                }
                setValue(e, t) {
                    const s = this._storage.get(e);
                    let r = !1;
                    if (void 0 !== s) {
                        for (const [e,n] of Object.entries(t))
                            if (s[e] !== n) {
                                r = !0;
                                s[e] = n
                            }
                    } else {
                        r = !0;
                        this._storage.set(e, t)
                    }
                    if (r) {
                        this._timeStamp = Date.now();
                        this._setModified()
                    }
                }
                getAll() {
                    return this._storage.size > 0 ? (0,
                    r.objectFromMap)(this._storage) : null
                }
                get size() {
                    return this._storage.size
                }
                _setModified() {
                    if (!this._modified) {
                        this._modified = !0;
                        "function" == typeof this.onSetModified && this.onSetModified()
                    }
                }
                resetModified() {
                    if (this._modified) {
                        this._modified = !1;
                        "function" == typeof this.onResetModified && this.onResetModified()
                    }
                }
                get serializable() {
                    return this._storage.size > 0 ? this._storage : null
                }
                get lastModified() {
                    return this._timeStamp.toString()
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.CanvasGraphics = void 0;
            var r = s(2)
              , n = s(11)
              , a = s(1);
            const i = 4096
              , o = 16;
            function addContextCurrentTransform(e) {
                if (!e.mozCurrentTransform) {
                    e._originalSave = e.save;
                    e._originalRestore = e.restore;
                    e._originalRotate = e.rotate;
                    e._originalScale = e.scale;
                    e._originalTranslate = e.translate;
                    e._originalTransform = e.transform;
                    e._originalSetTransform = e.setTransform;
                    e._originalResetTransform = e.resetTransform;
                    e._transformMatrix = e._transformMatrix || [1, 0, 0, 1, 0, 0];
                    e._transformStack = [];
                    try {
                        const t = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), "lineWidth");
                        e._setLineWidth = t.set;
                        e._getLineWidth = t.get;
                        Object.defineProperty(e, "lineWidth", {
                            set: function setLineWidth(e) {
                                this._setLineWidth(1.000001 * e)
                            },
                            get: function getLineWidth() {
                                return this._getLineWidth()
                            }
                        })
                    } catch (e) {}
                    Object.defineProperty(e, "mozCurrentTransform", {
                        get: function getCurrentTransform() {
                            return this._transformMatrix
                        }
                    });
                    Object.defineProperty(e, "mozCurrentTransformInverse", {
                        get: function getCurrentTransformInverse() {
                            const [e,t,s,r,n,a] = this._transformMatrix
                              , i = e * r - t * s
                              , o = t * s - e * r;
                            return [r / i, t / o, s / o, e / i, (r * n - s * a) / o, (t * n - e * a) / i]
                        }
                    });
                    e.save = function ctxSave() {
                        const e = this._transformMatrix;
                        this._transformStack.push(e);
                        this._transformMatrix = e.slice(0, 6);
                        this._originalSave()
                    }
                    ;
                    e.restore = function ctxRestore() {
                        const e = this._transformStack.pop();
                        if (e) {
                            this._transformMatrix = e;
                            this._originalRestore()
                        }
                    }
                    ;
                    e.translate = function ctxTranslate(e, t) {
                        const s = this._transformMatrix;
                        s[4] = s[0] * e + s[2] * t + s[4];
                        s[5] = s[1] * e + s[3] * t + s[5];
                        this._originalTranslate(e, t)
                    }
                    ;
                    e.scale = function ctxScale(e, t) {
                        const s = this._transformMatrix;
                        s[0] *= e;
                        s[1] *= e;
                        s[2] *= t;
                        s[3] *= t;
                        this._originalScale(e, t)
                    }
                    ;
                    e.transform = function ctxTransform(t, s, r, n, a, i) {
                        const o = this._transformMatrix;
                        this._transformMatrix = [o[0] * t + o[2] * s, o[1] * t + o[3] * s, o[0] * r + o[2] * n, o[1] * r + o[3] * n, o[0] * a + o[2] * i + o[4], o[1] * a + o[3] * i + o[5]];
                        e._originalTransform(t, s, r, n, a, i)
                    }
                    ;
                    e.setTransform = function ctxSetTransform(t, s, r, n, a, i) {
                        this._transformMatrix = [t, s, r, n, a, i];
                        e._originalSetTransform(t, s, r, n, a, i)
                    }
                    ;
                    e.resetTransform = function ctxResetTransform() {
                        this._transformMatrix = [1, 0, 0, 1, 0, 0];
                        e._originalResetTransform()
                    }
                    ;
                    e.rotate = function ctxRotate(e) {
                        const t = Math.cos(e)
                          , s = Math.sin(e)
                          , r = this._transformMatrix;
                        this._transformMatrix = [r[0] * t + r[2] * s, r[1] * t + r[3] * s, r[0] * -s + r[2] * t, r[1] * -s + r[3] * t, r[4], r[5]];
                        this._originalRotate(e)
                    }
                }
            }
            class CachedCanvases {
                constructor(e) {
                    this.canvasFactory = e;
                    this.cache = Object.create(null)
                }
                getCanvas(e, t, s, r) {
                    let n;
                    if (void 0 !== this.cache[e]) {
                        n = this.cache[e];
                        this.canvasFactory.reset(n, t, s);
                        n.context.setTransform(1, 0, 0, 1, 0, 0)
                    } else {
                        n = this.canvasFactory.create(t, s);
                        this.cache[e] = n
                    }
                    r && addContextCurrentTransform(n.context);
                    return n
                }
                clear() {
                    for (const e in this.cache) {
                        const t = this.cache[e];
                        this.canvasFactory.destroy(t);
                        delete this.cache[e]
                    }
                }
            }
            class LRUCache {
                constructor(e=0) {
                    this._cache = new Map;
                    this._maxSize = e
                }
                has(e) {
                    return this._cache.has(e)
                }
                get(e) {
                    if (this._cache.has(e)) {
                        const t = this._cache.get(e);
                        this._cache.delete(e);
                        this._cache.set(e, t)
                    }
                    return this._cache.get(e)
                }
                set(e, t) {
                    if (!(this._maxSize <= 0)) {
                        this._cache.size + 1 > this._maxSize && this._cache.delete(this._cache.keys().next().value);
                        this._cache.set(e, t)
                    }
                }
                clear() {
                    this._cache.clear()
                }
            }
            class CanvasExtraState {
                constructor() {
                    this.alphaIsShape = !1;
                    this.fontSize = 0;
                    this.fontSizeScale = 1;
                    this.textMatrix = r.IDENTITY_MATRIX;
                    this.textMatrixScale = 1;
                    this.fontMatrix = r.FONT_IDENTITY_MATRIX;
                    this.leading = 0;
                    this.x = 0;
                    this.y = 0;
                    this.lineX = 0;
                    this.lineY = 0;
                    this.charSpacing = 0;
                    this.wordSpacing = 0;
                    this.textHScale = 1;
                    this.textRenderingMode = r.TextRenderingMode.FILL;
                    this.textRise = 0;
                    this.fillColor = "#000000";
                    this.strokeColor = "#000000";
                    this.patternFill = !1;
                    this.fillAlpha = 1;
                    this.strokeAlpha = 1;
                    this.lineWidth = 1;
                    this.activeSMask = null;
                    this.resumeSMaskCtx = null;
                    this.transferMaps = null
                }
                clone() {
                    return Object.create(this)
                }
                setCurrentPoint(e, t) {
                    this.x = e;
                    this.y = t
                }
            }
            function putBinaryImageData(e, t, s=null) {
                if ("undefined" != typeof ImageData && t instanceof ImageData) {
                    e.putImageData(t, 0, 0);
                    return
                }
                const n = t.height
                  , a = t.width
                  , i = n % o
                  , l = (n - i) / o
                  , c = 0 === i ? l : l + 1
                  , h = e.createImageData(a, o);
                let d, u = 0;
                const p = t.data
                  , g = h.data;
                let f, m, _, A, b, y, S, x;
                if (s)
                    switch (s.length) {
                    case 1:
                        b = s[0];
                        y = s[0];
                        S = s[0];
                        x = s[0];
                        break;
                    case 4:
                        b = s[0];
                        y = s[1];
                        S = s[2];
                        x = s[3]
                    }
                if (t.kind === r.ImageKind.GRAYSCALE_1BPP) {
                    const t = p.byteLength
                      , s = new Uint32Array(g.buffer,0,g.byteLength >> 2)
                      , n = s.length
                      , A = a + 7 >> 3;
                    let b = 4294967295
                      , y = r.IsLittleEndianCached.value ? 4278190080 : 255;
                    x && 255 === x[0] && 0 === x[255] && ([b,y] = [y, b]);
                    for (f = 0; f < c; f++) {
                        _ = f < l ? o : i;
                        d = 0;
                        for (m = 0; m < _; m++) {
                            const e = t - u;
                            let r = 0;
                            const n = e > A ? a : 8 * e - 7
                              , i = -8 & n;
                            let o = 0
                              , l = 0;
                            for (; r < i; r += 8) {
                                l = p[u++];
                                s[d++] = 128 & l ? b : y;
                                s[d++] = 64 & l ? b : y;
                                s[d++] = 32 & l ? b : y;
                                s[d++] = 16 & l ? b : y;
                                s[d++] = 8 & l ? b : y;
                                s[d++] = 4 & l ? b : y;
                                s[d++] = 2 & l ? b : y;
                                s[d++] = 1 & l ? b : y
                            }
                            for (; r < n; r++) {
                                if (0 === o) {
                                    l = p[u++];
                                    o = 128
                                }
                                s[d++] = l & o ? b : y;
                                o >>= 1
                            }
                        }
                        for (; d < n; )
                            s[d++] = 0;
                        e.putImageData(h, 0, f * o)
                    }
                } else if (t.kind === r.ImageKind.RGBA_32BPP) {
                    const t = !!(b || y || S);
                    m = 0;
                    A = a * o * 4;
                    for (f = 0; f < l; f++) {
                        g.set(p.subarray(u, u + A));
                        u += A;
                        if (t)
                            for (let e = 0; e < A; e += 4) {
                                b && (g[e + 0] = b[g[e + 0]]);
                                y && (g[e + 1] = y[g[e + 1]]);
                                S && (g[e + 2] = S[g[e + 2]])
                            }
                        e.putImageData(h, 0, m);
                        m += o
                    }
                    if (f < c) {
                        A = a * i * 4;
                        g.set(p.subarray(u, u + A));
                        if (t)
                            for (let e = 0; e < A; e += 4) {
                                b && (g[e + 0] = b[g[e + 0]]);
                                y && (g[e + 1] = y[g[e + 1]]);
                                S && (g[e + 2] = S[g[e + 2]])
                            }
                        e.putImageData(h, 0, m)
                    }
                } else {
                    if (t.kind !== r.ImageKind.RGB_24BPP)
                        throw new Error(`bad image kind: ${t.kind}`);
                    {
                        const t = !!(b || y || S);
                        _ = o;
                        A = a * _;
                        for (f = 0; f < c; f++) {
                            if (f >= l) {
                                _ = i;
                                A = a * _
                            }
                            d = 0;
                            for (m = A; m--; ) {
                                g[d++] = p[u++];
                                g[d++] = p[u++];
                                g[d++] = p[u++];
                                g[d++] = 255
                            }
                            if (t)
                                for (let e = 0; e < d; e += 4) {
                                    b && (g[e + 0] = b[g[e + 0]]);
                                    y && (g[e + 1] = y[g[e + 1]]);
                                    S && (g[e + 2] = S[g[e + 2]])
                                }
                            e.putImageData(h, 0, f * o)
                        }
                    }
                }
            }
            function putBinaryImageMask(e, t) {
                const s = t.height
                  , r = t.width
                  , n = s % o
                  , a = (s - n) / o
                  , i = 0 === n ? a : a + 1
                  , l = e.createImageData(r, o);
                let c = 0;
                const h = t.data
                  , d = l.data;
                for (let t = 0; t < i; t++) {
                    const s = t < a ? o : n;
                    let i = 3;
                    for (let e = 0; e < s; e++) {
                        let e, t = 0;
                        for (let s = 0; s < r; s++) {
                            if (!t) {
                                e = h[c++];
                                t = 128
                            }
                            d[i] = e & t ? 0 : 255;
                            i += 4;
                            t >>= 1
                        }
                    }
                    e.putImageData(l, 0, t * o)
                }
            }
            function copyCtxState(e, t) {
                const s = ["strokeStyle", "fillStyle", "fillRule", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "globalCompositeOperation", "font"];
                for (let r = 0, n = s.length; r < n; r++) {
                    const n = s[r];
                    void 0 !== e[n] && (t[n] = e[n])
                }
                if (void 0 !== e.setLineDash) {
                    t.setLineDash(e.getLineDash());
                    t.lineDashOffset = e.lineDashOffset
                }
            }
            function resetCtxToDefault(e) {
                e.strokeStyle = "#000000";
                e.fillStyle = "#000000";
                e.fillRule = "nonzero";
                e.globalAlpha = 1;
                e.lineWidth = 1;
                e.lineCap = "butt";
                e.lineJoin = "miter";
                e.miterLimit = 10;
                e.globalCompositeOperation = "source-over";
                e.font = "10px sans-serif";
                if (void 0 !== e.setLineDash) {
                    e.setLineDash([]);
                    e.lineDashOffset = 0
                }
            }
            function composeSMaskBackdrop(e, t, s, r) {
                const n = e.length;
                for (let a = 3; a < n; a += 4) {
                    const n = e[a];
                    if (0 === n) {
                        e[a - 3] = t;
                        e[a - 2] = s;
                        e[a - 1] = r
                    } else if (n < 255) {
                        const i = 255 - n;
                        e[a - 3] = e[a - 3] * n + t * i >> 8;
                        e[a - 2] = e[a - 2] * n + s * i >> 8;
                        e[a - 1] = e[a - 1] * n + r * i >> 8
                    }
                }
            }
            function composeSMaskAlpha(e, t, s) {
                const r = e.length;
                for (let n = 3; n < r; n += 4) {
                    const r = s ? s[e[n]] : e[n];
                    t[n] = t[n] * r * .00392156862745098 | 0
                }
            }
            function composeSMaskLuminosity(e, t, s) {
                const r = e.length;
                for (let n = 3; n < r; n += 4) {
                    const r = 77 * e[n - 3] + 152 * e[n - 2] + 28 * e[n - 1];
                    t[n] = s ? t[n] * s[r >> 8] >> 8 : t[n] * r >> 16
                }
            }
            function composeSMask(e, t, s) {
                const r = t.canvas
                  , n = t.context;
                e.setTransform(t.scaleX, 0, 0, t.scaleY, t.offsetX, t.offsetY);
                !function genericComposeSMask(e, t, s, r, n, a, i) {
                    const o = !!a
                      , l = o ? a[0] : 0
                      , c = o ? a[1] : 0
                      , h = o ? a[2] : 0;
                    let d;
                    d = "Luminosity" === n ? composeSMaskLuminosity : composeSMaskAlpha;
                    const u = Math.min(r, Math.ceil(1048576 / s));
                    for (let n = 0; n < r; n += u) {
                        const a = Math.min(u, r - n)
                          , p = e.getImageData(0, n, s, a)
                          , g = t.getImageData(0, n, s, a);
                        o && composeSMaskBackdrop(p.data, l, c, h);
                        d(p.data, g.data, i);
                        e.putImageData(g, 0, n)
                    }
                }(n, s, r.width, r.height, t.subtype, t.backdrop, t.transferMap);
                e.drawImage(r, 0, 0)
            }
            function getImageSmoothingEnabled(e, t) {
                const s = r.Util.singularValueDecompose2dScale(e);
                s[0] = Math.fround(s[0]);
                s[1] = Math.fround(s[1]);
                const n = Math.fround((globalThis.devicePixelRatio || 1) * a.PixelsPerInch.PDF_TO_CSS_UNITS);
                return void 0 !== t ? t : s[0] <= n || s[1] <= n
            }
            const l = ["butt", "round", "square"]
              , c = ["miter", "round", "bevel"]
              , h = {}
              , d = {};
            class CanvasGraphics {
                constructor(e, t, s, r, n, a) {
                    this.ctx = e;
                    this.current = new CanvasExtraState;
                    this.stateStack = [];
                    this.pendingClip = null;
                    this.pendingEOFill = !1;
                    this.res = null;
                    this.xobjs = null;
                    this.commonObjs = t;
                    this.objs = s;
                    this.canvasFactory = r;
                    this.imageLayer = n;
                    this.groupStack = [];
                    this.processingType3 = null;
                    this.baseTransform = null;
                    this.baseTransformStack = [];
                    this.groupLevel = 0;
                    this.smaskStack = [];
                    this.smaskCounter = 0;
                    this.tempSMask = null;
                    this.contentVisible = !0;
                    this.markedContentStack = [];
                    this.optionalContentConfig = a;
                    this.cachedCanvases = new CachedCanvases(this.canvasFactory);
                    this.cachedCanvasPatterns = new LRUCache(2);
                    this.cachedPatterns = new Map;
                    e && addContextCurrentTransform(e);
                    this._cachedGetSinglePixelWidth = null
                }
                beginDrawing({transform: e, viewport: t, transparency: s=!1, background: r=null}) {
                    const n = this.ctx.canvas.width
                      , a = this.ctx.canvas.height;
                    this.ctx.save();
                    this.ctx.fillStyle = r || "rgb(255, 255, 255)";
                    this.ctx.fillRect(0, 0, n, a);
                    this.ctx.restore();
                    if (s) {
                        const e = this.cachedCanvases.getCanvas("transparent", n, a, !0);
                        this.compositeCtx = this.ctx;
                        this.transparentCanvas = e.canvas;
                        this.ctx = e.context;
                        this.ctx.save();
                        this.ctx.transform.apply(this.ctx, this.compositeCtx.mozCurrentTransform)
                    }
                    this.ctx.save();
                    resetCtxToDefault(this.ctx);
                    e && this.ctx.transform.apply(this.ctx, e);
                    this.ctx.transform.apply(this.ctx, t.transform);
                    this.baseTransform = this.ctx.mozCurrentTransform.slice();
                    this._combinedScaleFactor = Math.hypot(this.baseTransform[0], this.baseTransform[2]);
                    this.imageLayer && this.imageLayer.beginLayout()
                }
                executeOperatorList(e, t, s, n) {
                    const a = e.argsArray
                      , i = e.fnArray;
                    let o = t || 0;
                    const l = a.length;
                    if (l === o)
                        return o;
                    const c = l - o > 10 && "function" == typeof s
                      , h = c ? Date.now() + 15 : 0;
                    let d = 0;
                    const u = this.commonObjs
                      , p = this.objs;
                    let g;
                    for (; ; ) {
                        if (void 0 !== n && o === n.nextBreakPoint) {
                            n.breakIt(o, s);
                            return o
                        }
                        g = i[o];
                        if (g !== r.OPS.dependency)
                            this[g].apply(this, a[o]);
                        else
                            for (const e of a[o]) {
                                const t = e.startsWith("g_") ? u : p;
                                if (!t.has(e)) {
                                    t.get(e, s);
                                    return o
                                }
                            }
                        o++;
                        if (o === l)
                            return o;
                        if (c && ++d > 10) {
                            if (Date.now() > h) {
                                s();
                                return o
                            }
                            d = 0
                        }
                    }
                }
                endDrawing() {
                    for (; this.stateStack.length || null !== this.current.activeSMask; )
                        this.restore();
                    this.ctx.restore();
                    if (this.transparentCanvas) {
                        this.ctx = this.compositeCtx;
                        this.ctx.save();
                        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                        this.ctx.drawImage(this.transparentCanvas, 0, 0);
                        this.ctx.restore();
                        this.transparentCanvas = null
                    }
                    this.cachedCanvases.clear();
                    this.cachedCanvasPatterns.clear();
                    this.cachedPatterns.clear();
                    this.imageLayer && this.imageLayer.endLayout()
                }
                _scaleImage(e, t) {
                    const s = e.width
                      , r = e.height;
                    let n, a, i = Math.max(Math.hypot(t[0], t[1]), 1), o = Math.max(Math.hypot(t[2], t[3]), 1), l = s, c = r, h = "prescale1";
                    for (; i > 2 && l > 1 || o > 2 && c > 1; ) {
                        let t = l
                          , s = c;
                        if (i > 2 && l > 1) {
                            t = Math.ceil(l / 2);
                            i /= l / t
                        }
                        if (o > 2 && c > 1) {
                            s = Math.ceil(c / 2);
                            o /= c / s
                        }
                        n = this.cachedCanvases.getCanvas(h, t, s);
                        a = n.context;
                        a.clearRect(0, 0, t, s);
                        a.drawImage(e, 0, 0, l, c, 0, 0, t, s);
                        e = n.canvas;
                        l = t;
                        c = s;
                        h = "prescale1" === h ? "prescale2" : "prescale1"
                    }
                    return {
                        img: e,
                        paintWidth: l,
                        paintHeight: c
                    }
                }
                _createMaskCanvas(e) {
                    const t = this.ctx
                      , s = e.width
                      , n = e.height
                      , a = this.current.fillColor
                      , i = this.current.patternFill
                      , o = this.cachedCanvases.getCanvas("maskCanvas", s, n);
                    putBinaryImageMask(o.context, e);
                    const l = t.mozCurrentTransform;
                    let c = r.Util.transform(l, [1 / s, 0, 0, -1 / n, 0, 0]);
                    c = r.Util.transform(c, [1, 0, 0, 1, 0, -n]);
                    const h = r.Util.applyTransform([0, 0], c)
                      , d = r.Util.applyTransform([s, n], c)
                      , u = r.Util.normalizeRect([h[0], h[1], d[0], d[1]])
                      , p = Math.ceil(u[2] - u[0])
                      , g = Math.ceil(u[3] - u[1])
                      , f = this.cachedCanvases.getCanvas("fillCanvas", p, g, !0)
                      , m = f.context
                      , _ = Math.min(h[0], d[0])
                      , A = Math.min(h[1], d[1]);
                    m.translate(-_, -A);
                    m.transform.apply(m, c);
                    const b = this._scaleImage(o.canvas, m.mozCurrentTransformInverse);
                    m.imageSmoothingEnabled = getImageSmoothingEnabled(m.mozCurrentTransform, e.interpolate);
                    m.drawImage(b.img, 0, 0, b.img.width, b.img.height, 0, 0, s, n);
                    m.globalCompositeOperation = "source-in";
                    const y = r.Util.transform(m.mozCurrentTransformInverse, [1, 0, 0, 1, -_, -A]);
                    m.fillStyle = i ? a.getPattern(t, this, y, !1) : a;
                    m.fillRect(0, 0, s, n);
                    return {
                        canvas: f.canvas,
                        offsetX: Math.round(_),
                        offsetY: Math.round(A)
                    }
                }
                setLineWidth(e) {
                    this.current.lineWidth = e;
                    this.ctx.lineWidth = e
                }
                setLineCap(e) {
                    this.ctx.lineCap = l[e]
                }
                setLineJoin(e) {
                    this.ctx.lineJoin = c[e]
                }
                setMiterLimit(e) {
                    this.ctx.miterLimit = e
                }
                setDash(e, t) {
                    const s = this.ctx;
                    if (void 0 !== s.setLineDash) {
                        s.setLineDash(e);
                        s.lineDashOffset = t
                    }
                }
                setRenderingIntent(e) {}
                setFlatness(e) {}
                setGState(e) {
                    for (let t = 0, s = e.length; t < s; t++) {
                        const s = e[t]
                          , r = s[0]
                          , n = s[1];
                        switch (r) {
                        case "LW":
                            this.setLineWidth(n);
                            break;
                        case "LC":
                            this.setLineCap(n);
                            break;
                        case "LJ":
                            this.setLineJoin(n);
                            break;
                        case "ML":
                            this.setMiterLimit(n);
                            break;
                        case "D":
                            this.setDash(n[0], n[1]);
                            break;
                        case "RI":
                            this.setRenderingIntent(n);
                            break;
                        case "FL":
                            this.setFlatness(n);
                            break;
                        case "Font":
                            this.setFont(n[0], n[1]);
                            break;
                        case "CA":
                            this.current.strokeAlpha = s[1];
                            break;
                        case "ca":
                            this.current.fillAlpha = s[1];
                            this.ctx.globalAlpha = s[1];
                            break;
                        case "BM":
                            this.ctx.globalCompositeOperation = n;
                            break;
                        case "SMask":
                            this.current.activeSMask && (this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask ? this.suspendSMaskGroup() : this.endSMaskGroup());
                            this.current.activeSMask = n ? this.tempSMask : null;
                            this.current.activeSMask && this.beginSMaskGroup();
                            this.tempSMask = null;
                            break;
                        case "TR":
                            this.current.transferMaps = n
                        }
                    }
                }
                beginSMaskGroup() {
                    const e = this.current.activeSMask
                      , t = e.canvas.width
                      , s = e.canvas.height
                      , r = "smaskGroupAt" + this.groupLevel
                      , n = this.cachedCanvases.getCanvas(r, t, s, !0)
                      , a = this.ctx
                      , i = a.mozCurrentTransform;
                    this.ctx.save();
                    const o = n.context;
                    o.scale(1 / e.scaleX, 1 / e.scaleY);
                    o.translate(-e.offsetX, -e.offsetY);
                    o.transform.apply(o, i);
                    e.startTransformInverse = o.mozCurrentTransformInverse;
                    copyCtxState(a, o);
                    this.ctx = o;
                    this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
                    this.groupStack.push(a);
                    this.groupLevel++
                }
                suspendSMaskGroup() {
                    const e = this.ctx;
                    this.groupLevel--;
                    this.ctx = this.groupStack.pop();
                    composeSMask(this.ctx, this.current.activeSMask, e);
                    this.ctx.restore();
                    this.ctx.save();
                    copyCtxState(e, this.ctx);
                    this.current.resumeSMaskCtx = e;
                    const t = r.Util.transform(this.current.activeSMask.startTransformInverse, e.mozCurrentTransform);
                    this.ctx.transform.apply(this.ctx, t);
                    e.save();
                    e.setTransform(1, 0, 0, 1, 0, 0);
                    e.clearRect(0, 0, e.canvas.width, e.canvas.height);
                    e.restore()
                }
                resumeSMaskGroup() {
                    const e = this.current.resumeSMaskCtx
                      , t = this.ctx;
                    this.ctx = e;
                    this.groupStack.push(t);
                    this.groupLevel++
                }
                endSMaskGroup() {
                    const e = this.ctx;
                    this.groupLevel--;
                    this.ctx = this.groupStack.pop();
                    composeSMask(this.ctx, this.current.activeSMask, e);
                    this.ctx.restore();
                    copyCtxState(e, this.ctx);
                    const t = r.Util.transform(this.current.activeSMask.startTransformInverse, e.mozCurrentTransform);
                    this.ctx.transform.apply(this.ctx, t)
                }
                save() {
                    this.ctx.save();
                    const e = this.current;
                    this.stateStack.push(e);
                    this.current = e.clone();
                    this.current.resumeSMaskCtx = null
                }
                restore() {
                    this.current.resumeSMaskCtx && this.resumeSMaskGroup();
                    null === this.current.activeSMask || 0 !== this.stateStack.length && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask || this.endSMaskGroup();
                    if (0 !== this.stateStack.length) {
                        this.current = this.stateStack.pop();
                        this.ctx.restore();
                        this.pendingClip = null;
                        this._cachedGetSinglePixelWidth = null
                    } else
                        this.current.activeSMask = null
                }
                transform(e, t, s, r, n, a) {
                    this.ctx.transform(e, t, s, r, n, a);
                    this._cachedGetSinglePixelWidth = null
                }
                constructPath(e, t) {
                    const s = this.ctx
                      , n = this.current;
                    let a = n.x
                      , i = n.y;
                    for (let n = 0, o = 0, l = e.length; n < l; n++)
                        switch (0 | e[n]) {
                        case r.OPS.rectangle:
                            a = t[o++];
                            i = t[o++];
                            const e = t[o++]
                              , n = t[o++]
                              , l = a + e
                              , c = i + n;
                            s.moveTo(a, i);
                            if (0 === e || 0 === n)
                                s.lineTo(l, c);
                            else {
                                s.lineTo(l, i);
                                s.lineTo(l, c);
                                s.lineTo(a, c)
                            }
                            s.closePath();
                            break;
                        case r.OPS.moveTo:
                            a = t[o++];
                            i = t[o++];
                            s.moveTo(a, i);
                            break;
                        case r.OPS.lineTo:
                            a = t[o++];
                            i = t[o++];
                            s.lineTo(a, i);
                            break;
                        case r.OPS.curveTo:
                            a = t[o + 4];
                            i = t[o + 5];
                            s.bezierCurveTo(t[o], t[o + 1], t[o + 2], t[o + 3], a, i);
                            o += 6;
                            break;
                        case r.OPS.curveTo2:
                            s.bezierCurveTo(a, i, t[o], t[o + 1], t[o + 2], t[o + 3]);
                            a = t[o + 2];
                            i = t[o + 3];
                            o += 4;
                            break;
                        case r.OPS.curveTo3:
                            a = t[o + 2];
                            i = t[o + 3];
                            s.bezierCurveTo(t[o], t[o + 1], a, i, a, i);
                            o += 4;
                            break;
                        case r.OPS.closePath:
                            s.closePath()
                        }
                    n.setCurrentPoint(a, i)
                }
                closePath() {
                    this.ctx.closePath()
                }
                stroke(e) {
                    e = void 0 === e || e;
                    const t = this.ctx
                      , s = this.current.strokeColor;
                    t.globalAlpha = this.current.strokeAlpha;
                    if (this.contentVisible)
                        if ("object" == typeof s && s?.getPattern) {
                            const e = this.getSinglePixelWidth();
                            t.save();
                            t.strokeStyle = s.getPattern(t, this, t.mozCurrentTransformInverse);
                            t.lineWidth = Math.max(e, this.current.lineWidth);
                            t.stroke();
                            t.restore()
                        } else {
                            const e = this.getSinglePixelWidth();
                            if (e < 0 && -e >= this.current.lineWidth) {
                                t.save();
                                t.resetTransform();
                                t.lineWidth = Math.round(this._combinedScaleFactor);
                                t.stroke();
                                t.restore()
                            } else {
                                t.lineWidth = Math.max(e, this.current.lineWidth);
                                t.stroke()
                            }
                        }
                    e && this.consumePath();
                    t.globalAlpha = this.current.fillAlpha
                }
                closeStroke() {
                    this.closePath();
                    this.stroke()
                }
                fill(e) {
                    e = void 0 === e || e;
                    const t = this.ctx
                      , s = this.current.fillColor;
                    let r = !1;
                    if (this.current.patternFill) {
                        t.save();
                        t.fillStyle = s.getPattern(t, this, t.mozCurrentTransformInverse);
                        r = !0
                    }
                    if (this.contentVisible)
                        if (this.pendingEOFill) {
                            t.fill("evenodd");
                            this.pendingEOFill = !1
                        } else
                            t.fill();
                    r && t.restore();
                    e && this.consumePath()
                }
                eoFill() {
                    this.pendingEOFill = !0;
                    this.fill()
                }
                fillStroke() {
                    this.fill(!1);
                    this.stroke(!1);
                    this.consumePath()
                }
                eoFillStroke() {
                    this.pendingEOFill = !0;
                    this.fillStroke()
                }
                closeFillStroke() {
                    this.closePath();
                    this.fillStroke()
                }
                closeEOFillStroke() {
                    this.pendingEOFill = !0;
                    this.closePath();
                    this.fillStroke()
                }
                endPath() {
                    this.consumePath()
                }
                clip() {
                    this.pendingClip = h
                }
                eoClip() {
                    this.pendingClip = d
                }
                beginText() {
                    this.current.textMatrix = r.IDENTITY_MATRIX;
                    this.current.textMatrixScale = 1;
                    this.current.x = this.current.lineX = 0;
                    this.current.y = this.current.lineY = 0
                }
                endText() {
                    const e = this.pendingTextPaths
                      , t = this.ctx;
                    if (void 0 !== e) {
                        t.save();
                        t.beginPath();
                        for (let s = 0; s < e.length; s++) {
                            const r = e[s];
                            t.setTransform.apply(t, r.transform);
                            t.translate(r.x, r.y);
                            r.addToPath(t, r.fontSize)
                        }
                        t.restore();
                        t.clip();
                        t.beginPath();
                        delete this.pendingTextPaths
                    } else
                        t.beginPath()
                }
                setCharSpacing(e) {
                    this.current.charSpacing = e
                }
                setWordSpacing(e) {
                    this.current.wordSpacing = e
                }
                setHScale(e) {
                    this.current.textHScale = e / 100
                }
                setLeading(e) {
                    this.current.leading = -e
                }
                setFont(e, t) {
                    const s = this.commonObjs.get(e)
                      , n = this.current;
                    if (!s)
                        throw new Error(`Can't find font for ${e}`);
                    n.fontMatrix = s.fontMatrix || r.FONT_IDENTITY_MATRIX;
                    0 !== n.fontMatrix[0] && 0 !== n.fontMatrix[3] || (0,
                    r.warn)("Invalid font matrix for font " + e);
                    if (t < 0) {
                        t = -t;
                        n.fontDirection = -1
                    } else
                        n.fontDirection = 1;
                    this.current.font = s;
                    this.current.fontSize = t;
                    if (s.isType3Font)
                        return;
                    const a = s.loadedName || "sans-serif";
                    let i = "normal";
                    s.black ? i = "900" : s.bold && (i = "bold");
                    const o = s.italic ? "italic" : "normal"
                      , l = `"${a}", ${s.fallbackName}`;
                    let c = t;
                    t < 16 ? c = 16 : t > 100 && (c = 100);
                    this.current.fontSizeScale = t / c;
                    this.ctx.font = `${o} ${i} ${c}px ${l}`
                }
                setTextRenderingMode(e) {
                    this.current.textRenderingMode = e
                }
                setTextRise(e) {
                    this.current.textRise = e
                }
                moveText(e, t) {
                    this.current.x = this.current.lineX += e;
                    this.current.y = this.current.lineY += t
                }
                setLeadingMoveText(e, t) {
                    this.setLeading(-t);
                    this.moveText(e, t)
                }
                setTextMatrix(e, t, s, r, n, a) {
                    this.current.textMatrix = [e, t, s, r, n, a];
                    this.current.textMatrixScale = Math.hypot(e, t);
                    this.current.x = this.current.lineX = 0;
                    this.current.y = this.current.lineY = 0
                }
                nextLine() {
                    this.moveText(0, this.current.leading)
                }
                paintChar(e, t, s, n, a) {
                    const i = this.ctx
                      , o = this.current
                      , l = o.font
                      , c = o.textRenderingMode
                      , h = o.fontSize / o.fontSizeScale
                      , d = c & r.TextRenderingMode.FILL_STROKE_MASK
                      , u = !!(c & r.TextRenderingMode.ADD_TO_PATH_FLAG)
                      , p = o.patternFill && !l.missingFile;
                    let g;
                    (l.disableFontFace || u || p) && (g = l.getPathGenerator(this.commonObjs, e));
                    if (l.disableFontFace || p) {
                        i.save();
                        i.translate(t, s);
                        i.beginPath();
                        g(i, h);
                        n && i.setTransform.apply(i, n);
                        d !== r.TextRenderingMode.FILL && d !== r.TextRenderingMode.FILL_STROKE || i.fill();
                        if (d === r.TextRenderingMode.STROKE || d === r.TextRenderingMode.FILL_STROKE) {
                            if (a) {
                                i.resetTransform();
                                i.lineWidth = Math.round(this._combinedScaleFactor)
                            }
                            i.stroke()
                        }
                        i.restore()
                    } else {
                        d !== r.TextRenderingMode.FILL && d !== r.TextRenderingMode.FILL_STROKE || i.fillText(e, t, s);
                        if (d === r.TextRenderingMode.STROKE || d === r.TextRenderingMode.FILL_STROKE)
                            if (a) {
                                i.save();
                                i.moveTo(t, s);
                                i.resetTransform();
                                i.lineWidth = Math.round(this._combinedScaleFactor);
                                i.strokeText(e, 0, 0);
                                i.restore()
                            } else
                                i.strokeText(e, t, s)
                    }
                    if (u) {
                        (this.pendingTextPaths || (this.pendingTextPaths = [])).push({
                            transform: i.mozCurrentTransform,
                            x: t,
                            y: s,
                            fontSize: h,
                            addToPath: g
                        })
                    }
                }
                get isFontSubpixelAAEnabled() {
                    const {context: e} = this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled", 10, 10);
                    e.scale(1.5, 1);
                    e.fillText("I", 0, 10);
                    const t = e.getImageData(0, 0, 10, 10).data;
                    let s = !1;
                    for (let e = 3; e < t.length; e += 4)
                        if (t[e] > 0 && t[e] < 255) {
                            s = !0;
                            break
                        }
                    return (0,
                    r.shadow)(this, "isFontSubpixelAAEnabled", s)
                }
                showText(e) {
                    const t = this.current
                      , s = t.font;
                    if (s.isType3Font)
                        return this.showType3Text(e);
                    const n = t.fontSize;
                    if (0 === n)
                        return;
                    const a = this.ctx
                      , i = t.fontSizeScale
                      , o = t.charSpacing
                      , l = t.wordSpacing
                      , c = t.fontDirection
                      , h = t.textHScale * c
                      , d = e.length
                      , u = s.vertical
                      , p = u ? 1 : -1
                      , g = s.defaultVMetrics
                      , f = n * t.fontMatrix[0]
                      , m = t.textRenderingMode === r.TextRenderingMode.FILL && !s.disableFontFace && !t.patternFill;
                    a.save();
                    let _;
                    if (t.patternFill) {
                        a.save();
                        const e = t.fillColor.getPattern(a, this, a.mozCurrentTransformInverse);
                        _ = a.mozCurrentTransform;
                        a.restore();
                        a.fillStyle = e
                    }
                    a.transform.apply(a, t.textMatrix);
                    a.translate(t.x, t.y + t.textRise);
                    c > 0 ? a.scale(h, -1) : a.scale(h, 1);
                    let A = t.lineWidth
                      , b = !1;
                    const y = t.textMatrixScale;
                    if (0 === y || 0 === A) {
                        const e = t.textRenderingMode & r.TextRenderingMode.FILL_STROKE_MASK;
                        if (e === r.TextRenderingMode.STROKE || e === r.TextRenderingMode.FILL_STROKE) {
                            this._cachedGetSinglePixelWidth = null;
                            A = this.getSinglePixelWidth();
                            b = A < 0
                        }
                    } else
                        A /= y;
                    if (1 !== i) {
                        a.scale(i, i);
                        A /= i
                    }
                    a.lineWidth = A;
                    let S, x = 0;
                    for (S = 0; S < d; ++S) {
                        const t = e[S];
                        if ((0,
                        r.isNum)(t)) {
                            x += p * t * n / 1e3;
                            continue
                        }
                        let h = !1;
                        const d = (t.isSpace ? l : 0) + o
                          , A = t.fontChar
                          , y = t.accent;
                        let v, C, P, k = t.width;
                        if (u) {
                            const e = t.vmetric || g
                              , s = -(t.vmetric ? e[1] : .5 * k) * f
                              , r = e[2] * f;
                            k = e ? -e[0] : k;
                            v = s / i;
                            C = (x + r) / i
                        } else {
                            v = x / i;
                            C = 0
                        }
                        if (s.remeasure && k > 0) {
                            const e = 1e3 * a.measureText(A).width / n * i;
                            if (k < e && this.isFontSubpixelAAEnabled) {
                                const t = k / e;
                                h = !0;
                                a.save();
                                a.scale(t, 1);
                                v /= t
                            } else
                                k !== e && (v += (k - e) / 2e3 * n / i)
                        }
                        if (this.contentVisible && (t.isInFont || s.missingFile))
                            if (m && !y)
                                a.fillText(A, v, C);
                            else {
                                this.paintChar(A, v, C, _, b);
                                if (y) {
                                    const e = v + n * y.offset.x / i
                                      , t = C - n * y.offset.y / i;
                                    this.paintChar(y.fontChar, e, t, _, b)
                                }
                            }
                        P = u ? k * f - d * c : k * f + d * c;
                        x += P;
                        h && a.restore()
                    }
                    u ? t.y -= x : t.x += x * h;
                    a.restore()
                }
                showType3Text(e) {
                    const t = this.ctx
                      , s = this.current
                      , n = s.font
                      , a = s.fontSize
                      , i = s.fontDirection
                      , o = n.vertical ? 1 : -1
                      , l = s.charSpacing
                      , c = s.wordSpacing
                      , h = s.textHScale * i
                      , d = s.fontMatrix || r.FONT_IDENTITY_MATRIX
                      , u = e.length;
                    let p, g, f, m;
                    if (!(s.textRenderingMode === r.TextRenderingMode.INVISIBLE) && 0 !== a) {
                        this._cachedGetSinglePixelWidth = null;
                        t.save();
                        t.transform.apply(t, s.textMatrix);
                        t.translate(s.x, s.y);
                        t.scale(h, i);
                        for (p = 0; p < u; ++p) {
                            g = e[p];
                            if ((0,
                            r.isNum)(g)) {
                                m = o * g * a / 1e3;
                                this.ctx.translate(m, 0);
                                s.x += m * h;
                                continue
                            }
                            const i = (g.isSpace ? c : 0) + l
                              , u = n.charProcOperatorList[g.operatorListId];
                            if (!u) {
                                (0,
                                r.warn)(`Type3 character "${g.operatorListId}" is not available.`);
                                continue
                            }
                            if (this.contentVisible) {
                                this.processingType3 = g;
                                this.save();
                                t.scale(a, a);
                                t.transform.apply(t, d);
                                this.executeOperatorList(u);
                                this.restore()
                            }
                            f = r.Util.applyTransform([g.width, 0], d)[0] * a + i;
                            t.translate(f, 0);
                            s.x += f * h
                        }
                        t.restore();
                        this.processingType3 = null
                    }
                }
                setCharWidth(e, t) {}
                setCharWidthAndBounds(e, t, s, r, n, a) {
                    this.ctx.rect(s, r, n - s, a - r);
                    this.clip();
                    this.endPath()
                }
                getColorN_Pattern(e) {
                    let t;
                    if ("TilingPattern" === e[0]) {
                        const s = e[1]
                          , r = this.baseTransform || this.ctx.mozCurrentTransform.slice()
                          , a = {
                            createCanvasGraphics: e=>new CanvasGraphics(e,this.commonObjs,this.objs,this.canvasFactory)
                        };
                        t = new n.TilingPattern(e,s,this.ctx,a,r)
                    } else
                        t = this._getPattern(e[1], e[2]);
                    return t
                }
                setStrokeColorN() {
                    this.current.strokeColor = this.getColorN_Pattern(arguments)
                }
                setFillColorN() {
                    this.current.fillColor = this.getColorN_Pattern(arguments);
                    this.current.patternFill = !0
                }
                setStrokeRGBColor(e, t, s) {
                    const n = r.Util.makeHexColor(e, t, s);
                    this.ctx.strokeStyle = n;
                    this.current.strokeColor = n
                }
                setFillRGBColor(e, t, s) {
                    const n = r.Util.makeHexColor(e, t, s);
                    this.ctx.fillStyle = n;
                    this.current.fillColor = n;
                    this.current.patternFill = !1
                }
                _getPattern(e, t=null) {
                    let s;
                    if (this.cachedPatterns.has(e))
                        s = this.cachedPatterns.get(e);
                    else {
                        s = (0,
                        n.getShadingPattern)(this.objs.get(e), this.cachedCanvasPatterns);
                        this.cachedPatterns.set(e, s)
                    }
                    t && (s.matrix = t);
                    return s
                }
                shadingFill(e) {
                    if (!this.contentVisible)
                        return;
                    const t = this.ctx;
                    this.save();
                    const s = this._getPattern(e);
                    t.fillStyle = s.getPattern(t, this, t.mozCurrentTransformInverse, !0);
                    const n = t.mozCurrentTransformInverse;
                    if (n) {
                        const e = t.canvas
                          , s = e.width
                          , a = e.height
                          , i = r.Util.applyTransform([0, 0], n)
                          , o = r.Util.applyTransform([0, a], n)
                          , l = r.Util.applyTransform([s, 0], n)
                          , c = r.Util.applyTransform([s, a], n)
                          , h = Math.min(i[0], o[0], l[0], c[0])
                          , d = Math.min(i[1], o[1], l[1], c[1])
                          , u = Math.max(i[0], o[0], l[0], c[0])
                          , p = Math.max(i[1], o[1], l[1], c[1]);
                        this.ctx.fillRect(h, d, u - h, p - d)
                    } else
                        this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
                    this.restore()
                }
                beginInlineImage() {
                    (0,
                    r.unreachable)("Should not call beginInlineImage")
                }
                beginImageData() {
                    (0,
                    r.unreachable)("Should not call beginImageData")
                }
                paintFormXObjectBegin(e, t) {
                    if (this.contentVisible) {
                        this.save();
                        this.baseTransformStack.push(this.baseTransform);
                        Array.isArray(e) && 6 === e.length && this.transform.apply(this, e);
                        this.baseTransform = this.ctx.mozCurrentTransform;
                        if (t) {
                            const e = t[2] - t[0]
                              , s = t[3] - t[1];
                            this.ctx.rect(t[0], t[1], e, s);
                            this.clip();
                            this.endPath()
                        }
                    }
                }
                paintFormXObjectEnd() {
                    if (this.contentVisible) {
                        this.restore();
                        this.baseTransform = this.baseTransformStack.pop()
                    }
                }
                beginGroup(e) {
                    if (!this.contentVisible)
                        return;
                    this.save();
                    const t = this.ctx;
                    e.isolated || (0,
                    r.info)("TODO: Support non-isolated groups.");
                    e.knockout && (0,
                    r.warn)("Knockout groups not supported.");
                    const s = t.mozCurrentTransform;
                    e.matrix && t.transform.apply(t, e.matrix);
                    if (!e.bbox)
                        throw new Error("Bounding box is required.");
                    let n = r.Util.getAxialAlignedBoundingBox(e.bbox, t.mozCurrentTransform);
                    const a = [0, 0, t.canvas.width, t.canvas.height];
                    n = r.Util.intersect(n, a) || [0, 0, 0, 0];
                    const o = Math.floor(n[0])
                      , l = Math.floor(n[1]);
                    let c = Math.max(Math.ceil(n[2]) - o, 1)
                      , h = Math.max(Math.ceil(n[3]) - l, 1)
                      , d = 1
                      , u = 1;
                    if (c > i) {
                        d = c / i;
                        c = i
                    }
                    if (h > i) {
                        u = h / i;
                        h = i
                    }
                    let p = "groupAt" + this.groupLevel;
                    e.smask && (p += "_smask_" + this.smaskCounter++ % 2);
                    const g = this.cachedCanvases.getCanvas(p, c, h, !0)
                      , f = g.context;
                    f.scale(1 / d, 1 / u);
                    f.translate(-o, -l);
                    f.transform.apply(f, s);
                    if (e.smask)
                        this.smaskStack.push({
                            canvas: g.canvas,
                            context: f,
                            offsetX: o,
                            offsetY: l,
                            scaleX: d,
                            scaleY: u,
                            subtype: e.smask.subtype,
                            backdrop: e.smask.backdrop,
                            transferMap: e.smask.transferMap || null,
                            startTransformInverse: null
                        });
                    else {
                        t.setTransform(1, 0, 0, 1, 0, 0);
                        t.translate(o, l);
                        t.scale(d, u)
                    }
                    copyCtxState(t, f);
                    this.ctx = f;
                    this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
                    this.groupStack.push(t);
                    this.groupLevel++;
                    this.current.activeSMask = null
                }
                endGroup(e) {
                    if (!this.contentVisible)
                        return;
                    this.groupLevel--;
                    const t = this.ctx;
                    this.ctx = this.groupStack.pop();
                    this.ctx.imageSmoothingEnabled = !1;
                    e.smask ? this.tempSMask = this.smaskStack.pop() : this.ctx.drawImage(t.canvas, 0, 0);
                    this.restore()
                }
                beginAnnotations() {
                    this.save();
                    this.baseTransform && this.ctx.setTransform.apply(this.ctx, this.baseTransform)
                }
                endAnnotations() {
                    this.restore()
                }
                beginAnnotation(e, t, s, r) {
                    this.save();
                    resetCtxToDefault(this.ctx);
                    this.current = new CanvasExtraState;
                    if (Array.isArray(t) && 4 === t.length) {
                        const e = t[2] - t[0]
                          , s = t[3] - t[1];
                        this.ctx.rect(t[0], t[1], e, s);
                        this.clip();
                        this.endPath()
                    }
                    this.transform.apply(this, s);
                    this.transform.apply(this, r)
                }
                endAnnotation() {
                    this.restore()
                }
                paintImageMaskXObject(e) {
                    if (!this.contentVisible)
                        return;
                    const t = this.ctx
                      , s = e.width
                      , r = e.height
                      , n = this.processingType3;
                    n && void 0 === n.compiled && (n.compiled = s <= 1e3 && r <= 1e3 ? function compileType3Glyph(e) {
                        const t = new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0])
                          , s = e.width
                          , r = e.height
                          , n = s + 1;
                        let a, i, o, l;
                        const c = new Uint8Array(n * (r + 1))
                          , h = s + 7 & -8
                          , d = e.data
                          , u = new Uint8Array(h * r);
                        let p = 0;
                        for (a = 0,
                        i = d.length; a < i; a++) {
                            const e = d[a];
                            let t = 128;
                            for (; t > 0; ) {
                                u[p++] = e & t ? 0 : 255;
                                t >>= 1
                            }
                        }
                        let g = 0;
                        p = 0;
                        if (0 !== u[p]) {
                            c[0] = 1;
                            ++g
                        }
                        for (o = 1; o < s; o++) {
                            if (u[p] !== u[p + 1]) {
                                c[o] = u[p] ? 2 : 1;
                                ++g
                            }
                            p++
                        }
                        if (0 !== u[p]) {
                            c[o] = 2;
                            ++g
                        }
                        for (a = 1; a < r; a++) {
                            p = a * h;
                            l = a * n;
                            if (u[p - h] !== u[p]) {
                                c[l] = u[p] ? 1 : 8;
                                ++g
                            }
                            let e = (u[p] ? 4 : 0) + (u[p - h] ? 8 : 0);
                            for (o = 1; o < s; o++) {
                                e = (e >> 2) + (u[p + 1] ? 4 : 0) + (u[p - h + 1] ? 8 : 0);
                                if (t[e]) {
                                    c[l + o] = t[e];
                                    ++g
                                }
                                p++
                            }
                            if (u[p - h] !== u[p]) {
                                c[l + o] = u[p] ? 2 : 4;
                                ++g
                            }
                            if (g > 1e3)
                                return null
                        }
                        p = h * (r - 1);
                        l = a * n;
                        if (0 !== u[p]) {
                            c[l] = 8;
                            ++g
                        }
                        for (o = 1; o < s; o++) {
                            if (u[p] !== u[p + 1]) {
                                c[l + o] = u[p] ? 4 : 8;
                                ++g
                            }
                            p++
                        }
                        if (0 !== u[p]) {
                            c[l + o] = 4;
                            ++g
                        }
                        if (g > 1e3)
                            return null;
                        const f = new Int32Array([0, n, -1, 0, -n, 0, 0, 0, 1])
                          , m = [];
                        for (a = 0; g && a <= r; a++) {
                            let e = a * n;
                            const t = e + s;
                            for (; e < t && !c[e]; )
                                e++;
                            if (e === t)
                                continue;
                            const r = [e % n, a]
                              , i = e;
                            let o = c[e];
                            do {
                                const t = f[o];
                                do {
                                    e += t
                                } while (!c[e]);
                                const s = c[e];
                                if (5 !== s && 10 !== s) {
                                    o = s;
                                    c[e] = 0
                                } else {
                                    o = s & 51 * o >> 4;
                                    c[e] &= o >> 2 | o << 2
                                }
                                r.push(e % n, e / n | 0);
                                c[e] || --g
                            } while (i !== e);
                            m.push(r);
                            --a
                        }
                        return function(e) {
                            e.save();
                            e.scale(1 / s, -1 / r);
                            e.translate(0, -r);
                            e.beginPath();
                            for (let t = 0, s = m.length; t < s; t++) {
                                const s = m[t];
                                e.moveTo(s[0], s[1]);
                                for (let t = 2, r = s.length; t < r; t += 2)
                                    e.lineTo(s[t], s[t + 1])
                            }
                            e.fill();
                            e.beginPath();
                            e.restore()
                        }
                    }({
                        data: e.data,
                        width: s,
                        height: r
                    }) : null);
                    if (n?.compiled) {
                        n.compiled(t);
                        return
                    }
                    const a = this._createMaskCanvas(e)
                      , i = a.canvas;
                    t.save();
                    t.setTransform(1, 0, 0, 1, 0, 0);
                    t.drawImage(i, a.offsetX, a.offsetY);
                    t.restore()
                }
                paintImageMaskXObjectRepeat(e, t, s=0, n=0, a, i) {
                    if (!this.contentVisible)
                        return;
                    const o = this.ctx;
                    o.save();
                    const l = o.mozCurrentTransform;
                    o.transform(t, s, n, a, 0, 0);
                    const c = this._createMaskCanvas(e);
                    o.setTransform(1, 0, 0, 1, 0, 0);
                    for (let e = 0, h = i.length; e < h; e += 2) {
                        const h = r.Util.transform(l, [t, s, n, a, i[e], i[e + 1]])
                          , [d,u] = r.Util.applyTransform([0, 0], h);
                        o.drawImage(c.canvas, d, u)
                    }
                    o.restore()
                }
                paintImageMaskXObjectGroup(e) {
                    if (!this.contentVisible)
                        return;
                    const t = this.ctx
                      , s = this.current.fillColor
                      , r = this.current.patternFill;
                    for (let n = 0, a = e.length; n < a; n++) {
                        const a = e[n]
                          , i = a.width
                          , o = a.height
                          , l = this.cachedCanvases.getCanvas("maskCanvas", i, o)
                          , c = l.context;
                        c.save();
                        putBinaryImageMask(c, a);
                        c.globalCompositeOperation = "source-in";
                        c.fillStyle = r ? s.getPattern(c, this, t.mozCurrentTransformInverse, !1) : s;
                        c.fillRect(0, 0, i, o);
                        c.restore();
                        t.save();
                        t.transform.apply(t, a.transform);
                        t.scale(1, -1);
                        t.drawImage(l.canvas, 0, 0, i, o, 0, -1, 1, 1);
                        t.restore()
                    }
                }
                paintImageXObject(e) {
                    if (!this.contentVisible)
                        return;
                    const t = e.startsWith("g_") ? this.commonObjs.get(e) : this.objs.get(e);
                    t ? this.paintInlineImageXObject(t) : (0,
                    r.warn)("Dependent image isn't ready yet")
                }
                paintImageXObjectRepeat(e, t, s, n) {
                    if (!this.contentVisible)
                        return;
                    const a = e.startsWith("g_") ? this.commonObjs.get(e) : this.objs.get(e);
                    if (!a) {
                        (0,
                        r.warn)("Dependent image isn't ready yet");
                        return
                    }
                    const i = a.width
                      , o = a.height
                      , l = [];
                    for (let e = 0, r = n.length; e < r; e += 2)
                        l.push({
                            transform: [t, 0, 0, s, n[e], n[e + 1]],
                            x: 0,
                            y: 0,
                            w: i,
                            h: o
                        });
                    this.paintInlineImageXObjectGroup(a, l)
                }
                paintInlineImageXObject(e) {
                    if (!this.contentVisible)
                        return;
                    const t = e.width
                      , s = e.height
                      , r = this.ctx;
                    this.save();
                    r.scale(1 / t, -1 / s);
                    let n;
                    if ("function" == typeof HTMLElement && e instanceof HTMLElement || !e.data)
                        n = e;
                    else {
                        const r = this.cachedCanvases.getCanvas("inlineImage", t, s);
                        putBinaryImageData(r.context, e, this.current.transferMaps);
                        n = r.canvas
                    }
                    const a = this._scaleImage(n, r.mozCurrentTransformInverse);
                    r.imageSmoothingEnabled = getImageSmoothingEnabled(r.mozCurrentTransform, e.interpolate);
                    r.drawImage(a.img, 0, 0, a.paintWidth, a.paintHeight, 0, -s, t, s);
                    if (this.imageLayer) {
                        const n = this.getCanvasPosition(0, -s);
                        this.imageLayer.appendImage({
                            imgData: e,
                            left: n[0],
                            top: n[1],
                            width: t / r.mozCurrentTransformInverse[0],
                            height: s / r.mozCurrentTransformInverse[3]
                        })
                    }
                    this.restore()
                }
                paintInlineImageXObjectGroup(e, t) {
                    if (!this.contentVisible)
                        return;
                    const s = this.ctx
                      , r = e.width
                      , n = e.height
                      , a = this.cachedCanvases.getCanvas("inlineImage", r, n);
                    putBinaryImageData(a.context, e, this.current.transferMaps);
                    for (let i = 0, o = t.length; i < o; i++) {
                        const o = t[i];
                        s.save();
                        s.transform.apply(s, o.transform);
                        s.scale(1, -1);
                        s.drawImage(a.canvas, o.x, o.y, o.w, o.h, 0, -1, 1, 1);
                        if (this.imageLayer) {
                            const t = this.getCanvasPosition(o.x, o.y);
                            this.imageLayer.appendImage({
                                imgData: e,
                                left: t[0],
                                top: t[1],
                                width: r,
                                height: n
                            })
                        }
                        s.restore()
                    }
                }
                paintSolidColorImageMask() {
                    this.contentVisible && this.ctx.fillRect(0, 0, 1, 1)
                }
                markPoint(e) {}
                markPointProps(e, t) {}
                beginMarkedContent(e) {
                    this.markedContentStack.push({
                        visible: !0
                    })
                }
                beginMarkedContentProps(e, t) {
                    "OC" === e ? this.markedContentStack.push({
                        visible: this.optionalContentConfig.isVisible(t)
                    }) : this.markedContentStack.push({
                        visible: !0
                    });
                    this.contentVisible = this.isContentVisible()
                }
                endMarkedContent() {
                    this.markedContentStack.pop();
                    this.contentVisible = this.isContentVisible()
                }
                beginCompat() {}
                endCompat() {}
                consumePath() {
                    const e = this.ctx;
                    if (this.pendingClip) {
                        this.pendingClip === d ? e.clip("evenodd") : e.clip();
                        this.pendingClip = null
                    }
                    e.beginPath()
                }
                getSinglePixelWidth() {
                    if (null === this._cachedGetSinglePixelWidth) {
                        const e = this.ctx.mozCurrentTransform
                          , t = Math.abs(e[0] * e[3] - e[2] * e[1])
                          , s = e[0] ** 2 + e[2] ** 2
                          , r = e[1] ** 2 + e[3] ** 2
                          , n = Math.sqrt(Math.max(s, r)) / t;
                        s !== r && this._combinedScaleFactor * n > 1 ? this._cachedGetSinglePixelWidth = -this._combinedScaleFactor * n : t > Number.EPSILON ? this._cachedGetSinglePixelWidth = n : this._cachedGetSinglePixelWidth = 1
                    }
                    return this._cachedGetSinglePixelWidth
                }
                getCanvasPosition(e, t) {
                    const s = this.ctx.mozCurrentTransform;
                    return [s[0] * e + s[2] * t + s[4], s[1] * e + s[3] * t + s[5]]
                }
                isContentVisible() {
                    for (let e = this.markedContentStack.length - 1; e >= 0; e--)
                        if (!this.markedContentStack[e].visible)
                            return !1;
                    return !0
                }
            }
            t.CanvasGraphics = CanvasGraphics;
            for (const e in r.OPS)
                void 0 !== CanvasGraphics.prototype[e] && (CanvasGraphics.prototype[r.OPS[e]] = CanvasGraphics.prototype[e])
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.getShadingPattern = function getShadingPattern(e, t) {
                switch (e[0]) {
                case "RadialAxial":
                    return new RadialAxialShadingPattern(e,t);
                case "Mesh":
                    return new MeshShadingPattern(e);
                case "Dummy":
                    return new DummyShadingPattern
                }
                throw new Error(`Unknown IR type: ${e[0]}`)
            }
            ;
            t.TilingPattern = void 0;
            var r = s(2);
            function applyBoundingBox(e, t) {
                if (!t || "undefined" == typeof Path2D)
                    return;
                const s = t[2] - t[0]
                  , r = t[3] - t[1]
                  , n = new Path2D;
                n.rect(t[0], t[1], s, r);
                e.clip(n)
            }
            class BaseShadingPattern {
                constructor() {
                    this.constructor === BaseShadingPattern && (0,
                    r.unreachable)("Cannot initialize BaseShadingPattern.")
                }
                getPattern() {
                    (0,
                    r.unreachable)("Abstract method `getPattern` called.")
                }
            }
            class RadialAxialShadingPattern extends BaseShadingPattern {
                constructor(e, t) {
                    super();
                    this._type = e[1];
                    this._bbox = e[2];
                    this._colorStops = e[3];
                    this._p0 = e[4];
                    this._p1 = e[5];
                    this._r0 = e[6];
                    this._r1 = e[7];
                    this.matrix = null;
                    this.cachedCanvasPatterns = t
                }
                _createGradient(e) {
                    let t;
                    "axial" === this._type ? t = e.createLinearGradient(this._p0[0], this._p0[1], this._p1[0], this._p1[1]) : "radial" === this._type && (t = e.createRadialGradient(this._p0[0], this._p0[1], this._r0, this._p1[0], this._p1[1], this._r1));
                    for (const e of this._colorStops)
                        t.addColorStop(e[0], e[1]);
                    return t
                }
                getPattern(e, t, s, n=!1) {
                    let a;
                    if (n) {
                        applyBoundingBox(e, this._bbox);
                        a = this._createGradient(e)
                    } else if (this.cachedCanvasPatterns.has(this))
                        a = this.cachedCanvasPatterns.get(this);
                    else {
                        const s = t.cachedCanvases.getCanvas("pattern", t.ctx.canvas.width, t.ctx.canvas.height, !0)
                          , r = s.context;
                        r.clearRect(0, 0, r.canvas.width, r.canvas.height);
                        r.beginPath();
                        r.rect(0, 0, r.canvas.width, r.canvas.height);
                        r.setTransform.apply(r, t.baseTransform);
                        this.matrix && r.transform.apply(r, this.matrix);
                        applyBoundingBox(r, this._bbox);
                        r.fillStyle = this._createGradient(r);
                        r.fill();
                        a = e.createPattern(s.canvas, "repeat");
                        this.cachedCanvasPatterns.set(this, a)
                    }
                    if (!n) {
                        const e = new DOMMatrix(s);
                        try {
                            a.setTransform(e)
                        } catch (e) {
                            (0,
                            r.warn)(`RadialAxialShadingPattern.getPattern: "${e?.message}".`)
                        }
                    }
                    return a
                }
            }
            function drawTriangle(e, t, s, r, n, a, i, o) {
                const l = t.coords
                  , c = t.colors
                  , h = e.data
                  , d = 4 * e.width;
                let u;
                if (l[s + 1] > l[r + 1]) {
                    u = s;
                    s = r;
                    r = u;
                    u = a;
                    a = i;
                    i = u
                }
                if (l[r + 1] > l[n + 1]) {
                    u = r;
                    r = n;
                    n = u;
                    u = i;
                    i = o;
                    o = u
                }
                if (l[s + 1] > l[r + 1]) {
                    u = s;
                    s = r;
                    r = u;
                    u = a;
                    a = i;
                    i = u
                }
                const p = (l[s] + t.offsetX) * t.scaleX
                  , g = (l[s + 1] + t.offsetY) * t.scaleY
                  , f = (l[r] + t.offsetX) * t.scaleX
                  , m = (l[r + 1] + t.offsetY) * t.scaleY
                  , _ = (l[n] + t.offsetX) * t.scaleX
                  , A = (l[n + 1] + t.offsetY) * t.scaleY;
                if (g >= A)
                    return;
                const b = c[a]
                  , y = c[a + 1]
                  , S = c[a + 2]
                  , x = c[i]
                  , v = c[i + 1]
                  , C = c[i + 2]
                  , P = c[o]
                  , k = c[o + 1]
                  , w = c[o + 2]
                  , F = Math.round(g)
                  , R = Math.round(A);
                let T, E, M, D, O, I, L, N;
                for (let e = F; e <= R; e++) {
                    if (e < m) {
                        let t;
                        t = e < g ? 0 : (g - e) / (g - m);
                        T = p - (p - f) * t;
                        E = b - (b - x) * t;
                        M = y - (y - v) * t;
                        D = S - (S - C) * t
                    } else {
                        let t;
                        t = e > A ? 1 : m === A ? 0 : (m - e) / (m - A);
                        T = f - (f - _) * t;
                        E = x - (x - P) * t;
                        M = v - (v - k) * t;
                        D = C - (C - w) * t
                    }
                    let t;
                    t = e < g ? 0 : e > A ? 1 : (g - e) / (g - A);
                    O = p - (p - _) * t;
                    I = b - (b - P) * t;
                    L = y - (y - k) * t;
                    N = S - (S - w) * t;
                    const s = Math.round(Math.min(T, O))
                      , r = Math.round(Math.max(T, O));
                    let n = d * e + 4 * s;
                    for (let e = s; e <= r; e++) {
                        t = (T - e) / (T - O);
                        t < 0 ? t = 0 : t > 1 && (t = 1);
                        h[n++] = E - (E - I) * t | 0;
                        h[n++] = M - (M - L) * t | 0;
                        h[n++] = D - (D - N) * t | 0;
                        h[n++] = 255
                    }
                }
            }
            function drawFigure(e, t, s) {
                const r = t.coords
                  , n = t.colors;
                let a, i;
                switch (t.type) {
                case "lattice":
                    const o = t.verticesPerRow
                      , l = Math.floor(r.length / o) - 1
                      , c = o - 1;
                    for (a = 0; a < l; a++) {
                        let t = a * o;
                        for (let a = 0; a < c; a++,
                        t++) {
                            drawTriangle(e, s, r[t], r[t + 1], r[t + o], n[t], n[t + 1], n[t + o]);
                            drawTriangle(e, s, r[t + o + 1], r[t + 1], r[t + o], n[t + o + 1], n[t + 1], n[t + o])
                        }
                    }
                    break;
                case "triangles":
                    for (a = 0,
                    i = r.length; a < i; a += 3)
                        drawTriangle(e, s, r[a], r[a + 1], r[a + 2], n[a], n[a + 1], n[a + 2]);
                    break;
                default:
                    throw new Error("illegal figure")
                }
            }
            class MeshShadingPattern extends BaseShadingPattern {
                constructor(e) {
                    super();
                    this._coords = e[2];
                    this._colors = e[3];
                    this._figures = e[4];
                    this._bounds = e[5];
                    this._bbox = e[7];
                    this._background = e[8];
                    this.matrix = null
                }
                _createMeshCanvas(e, t, s) {
                    const r = Math.floor(this._bounds[0])
                      , n = Math.floor(this._bounds[1])
                      , a = Math.ceil(this._bounds[2]) - r
                      , i = Math.ceil(this._bounds[3]) - n
                      , o = Math.min(Math.ceil(Math.abs(a * e[0] * 1.1)), 3e3)
                      , l = Math.min(Math.ceil(Math.abs(i * e[1] * 1.1)), 3e3)
                      , c = a / o
                      , h = i / l
                      , d = {
                        coords: this._coords,
                        colors: this._colors,
                        offsetX: -r,
                        offsetY: -n,
                        scaleX: 1 / c,
                        scaleY: 1 / h
                    }
                      , u = o + 4
                      , p = l + 4
                      , g = s.getCanvas("mesh", u, p, !1)
                      , f = g.context
                      , m = f.createImageData(o, l);
                    if (t) {
                        const e = m.data;
                        for (let s = 0, r = e.length; s < r; s += 4) {
                            e[s] = t[0];
                            e[s + 1] = t[1];
                            e[s + 2] = t[2];
                            e[s + 3] = 255
                        }
                    }
                    for (const e of this._figures)
                        drawFigure(m, e, d);
                    f.putImageData(m, 2, 2);
                    return {
                        canvas: g.canvas,
                        offsetX: r - 2 * c,
                        offsetY: n - 2 * h,
                        scaleX: c,
                        scaleY: h
                    }
                }
                getPattern(e, t, s, n=!1) {
                    applyBoundingBox(e, this._bbox);
                    let a;
                    if (n)
                        a = r.Util.singularValueDecompose2dScale(e.mozCurrentTransform);
                    else {
                        a = r.Util.singularValueDecompose2dScale(t.baseTransform);
                        if (this.matrix) {
                            const e = r.Util.singularValueDecompose2dScale(this.matrix);
                            a = [a[0] * e[0], a[1] * e[1]]
                        }
                    }
                    const i = this._createMeshCanvas(a, n ? null : this._background, t.cachedCanvases);
                    if (!n) {
                        e.setTransform.apply(e, t.baseTransform);
                        this.matrix && e.transform.apply(e, this.matrix)
                    }
                    e.translate(i.offsetX, i.offsetY);
                    e.scale(i.scaleX, i.scaleY);
                    return e.createPattern(i.canvas, "no-repeat")
                }
            }
            class DummyShadingPattern extends BaseShadingPattern {
                getPattern() {
                    return "hotpink"
                }
            }
            const n = 1
              , a = 2;
            class TilingPattern {
                static get MAX_PATTERN_SIZE() {
                    return (0,
                    r.shadow)(this, "MAX_PATTERN_SIZE", 3e3)
                }
                constructor(e, t, s, r, n) {
                    this.operatorList = e[2];
                    this.matrix = e[3] || [1, 0, 0, 1, 0, 0];
                    this.bbox = e[4];
                    this.xstep = e[5];
                    this.ystep = e[6];
                    this.paintType = e[7];
                    this.tilingType = e[8];
                    this.color = t;
                    this.ctx = s;
                    this.canvasGraphicsFactory = r;
                    this.baseTransform = n
                }
                createPatternCanvas(e) {
                    const t = this.operatorList
                      , s = this.bbox
                      , n = this.xstep
                      , a = this.ystep
                      , i = this.paintType
                      , o = this.tilingType
                      , l = this.color
                      , c = this.canvasGraphicsFactory;
                    (0,
                    r.info)("TilingType: " + o);
                    const h = s[0]
                      , d = s[1]
                      , u = s[2]
                      , p = s[3]
                      , g = r.Util.singularValueDecompose2dScale(this.matrix)
                      , f = r.Util.singularValueDecompose2dScale(this.baseTransform)
                      , m = [g[0] * f[0], g[1] * f[1]]
                      , _ = this.getSizeAndScale(n, this.ctx.canvas.width, m[0])
                      , A = this.getSizeAndScale(a, this.ctx.canvas.height, m[1])
                      , b = e.cachedCanvases.getCanvas("pattern", _.size, A.size, !0)
                      , y = b.context
                      , S = c.createCanvasGraphics(y);
                    S.groupLevel = e.groupLevel;
                    this.setFillAndStrokeStyleToContext(S, i, l);
                    let x = h
                      , v = d
                      , C = u
                      , P = p;
                    if (h < 0) {
                        x = 0;
                        C += Math.abs(h)
                    }
                    if (d < 0) {
                        v = 0;
                        P += Math.abs(d)
                    }
                    y.translate(-_.scale * x, -A.scale * v);
                    S.transform(_.scale, 0, 0, A.scale, 0, 0);
                    this.clipBbox(S, x, v, C, P);
                    S.baseTransform = S.ctx.mozCurrentTransform.slice();
                    S.executeOperatorList(t);
                    S.endDrawing();
                    return {
                        canvas: b.canvas,
                        scaleX: _.scale,
                        scaleY: A.scale,
                        offsetX: x,
                        offsetY: v
                    }
                }
                getSizeAndScale(e, t, s) {
                    e = Math.abs(e);
                    const r = Math.max(TilingPattern.MAX_PATTERN_SIZE, t);
                    let n = Math.ceil(e * s);
                    n >= r ? n = r : s = n / e;
                    return {
                        scale: s,
                        size: n
                    }
                }
                clipBbox(e, t, s, r, n) {
                    const a = r - t
                      , i = n - s;
                    e.ctx.rect(t, s, a, i);
                    e.clip();
                    e.endPath()
                }
                setFillAndStrokeStyleToContext(e, t, s) {
                    const i = e.ctx
                      , o = e.current;
                    switch (t) {
                    case n:
                        const e = this.ctx;
                        i.fillStyle = e.fillStyle;
                        i.strokeStyle = e.strokeStyle;
                        o.fillColor = e.fillStyle;
                        o.strokeColor = e.strokeStyle;
                        break;
                    case a:
                        const l = r.Util.makeHexColor(s[0], s[1], s[2]);
                        i.fillStyle = l;
                        i.strokeStyle = l;
                        o.fillColor = l;
                        o.strokeColor = l;
                        break;
                    default:
                        throw new r.FormatError(`Unsupported paint type: ${t}`)
                    }
                }
                getPattern(e, t, s, n=!1) {
                    let a = s;
                    if (!n) {
                        a = r.Util.transform(a, t.baseTransform);
                        this.matrix && (a = r.Util.transform(a, this.matrix))
                    }
                    const i = this.createPatternCanvas(t);
                    let o = new DOMMatrix(a);
                    o = o.translate(i.offsetX, i.offsetY);
                    o = o.scale(1 / i.scaleX, 1 / i.scaleY);
                    const l = e.createPattern(i.canvas, "repeat");
                    try {
                        l.setTransform(o)
                    } catch (e) {
                        (0,
                        r.warn)(`TilingPattern.getPattern: "${e?.message}".`)
                    }
                    return l
                }
            }
            t.TilingPattern = TilingPattern
        }
        , (e,t)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.GlobalWorkerOptions = void 0;
            const s = Object.create(null);
            t.GlobalWorkerOptions = s;
            s.workerPort = void 0 === s.workerPort ? null : s.workerPort;
            s.workerSrc = void 0 === s.workerSrc ? "" : s.workerSrc
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.MessageHandler = void 0;
            var r = s(2);
            const n = 1
              , a = 2
              , i = 1
              , o = 2
              , l = 3
              , c = 4
              , h = 5
              , d = 6
              , u = 7
              , p = 8;
            function wrapReason(e) {
                if (!(e instanceof Error || "object" == typeof e && null !== e)) {
                    (0,
                    r.warn)('wrapReason: Expected "reason" to be a (possibly cloned) Error.');
                    return e
                }
                switch (e.name) {
                case "AbortException":
                    return new r.AbortException(e.message);
                case "MissingPDFException":
                    return new r.MissingPDFException(e.message);
                case "PasswordException":
                    return new r.PasswordException(e.message,e.code);
                case "UnexpectedResponseException":
                    return new r.UnexpectedResponseException(e.message,e.status);
                case "UnknownErrorException":
                    return new r.UnknownErrorException(e.message,e.details);
                default:
                    return new r.UnknownErrorException(e.message,e.toString())
                }
            }
            t.MessageHandler = class MessageHandler {
                constructor(e, t, s) {
                    this.sourceName = e;
                    this.targetName = t;
                    this.comObj = s;
                    this.callbackId = 1;
                    this.streamId = 1;
                    this.postMessageTransfers = !0;
                    this.streamSinks = Object.create(null);
                    this.streamControllers = Object.create(null);
                    this.callbackCapabilities = Object.create(null);
                    this.actionHandler = Object.create(null);
                    this._onComObjOnMessage = e=>{
                        const t = e.data;
                        if (t.targetName !== this.sourceName)
                            return;
                        if (t.stream) {
                            this._processStreamMessage(t);
                            return
                        }
                        if (t.callback) {
                            const e = t.callbackId
                              , s = this.callbackCapabilities[e];
                            if (!s)
                                throw new Error(`Cannot resolve callback ${e}`);
                            delete this.callbackCapabilities[e];
                            if (t.callback === n)
                                s.resolve(t.data);
                            else {
                                if (t.callback !== a)
                                    throw new Error("Unexpected callback case");
                                s.reject(wrapReason(t.reason))
                            }
                            return
                        }
                        const r = this.actionHandler[t.action];
                        if (!r)
                            throw new Error(`Unknown action from worker: ${t.action}`);
                        if (t.callbackId) {
                            const e = this.sourceName
                              , i = t.sourceName;
                            new Promise((function(e) {
                                e(r(t.data))
                            }
                            )).then((function(r) {
                                s.postMessage({
                                    sourceName: e,
                                    targetName: i,
                                    callback: n,
                                    callbackId: t.callbackId,
                                    data: r
                                })
                            }
                            ), (function(r) {
                                s.postMessage({
                                    sourceName: e,
                                    targetName: i,
                                    callback: a,
                                    callbackId: t.callbackId,
                                    reason: wrapReason(r)
                                })
                            }
                            ))
                        } else
                            t.streamId ? this._createStreamSink(t) : r(t.data)
                    }
                    ;
                    s.addEventListener("message", this._onComObjOnMessage)
                }
                on(e, t) {
                    const s = this.actionHandler;
                    if (s[e])
                        throw new Error(`There is already an actionName called "${e}"`);
                    s[e] = t
                }
                send(e, t, s) {
                    this._postMessage({
                        sourceName: this.sourceName,
                        targetName: this.targetName,
                        action: e,
                        data: t
                    }, s)
                }
                sendWithPromise(e, t, s) {
                    const n = this.callbackId++
                      , a = (0,
                    r.createPromiseCapability)();
                    this.callbackCapabilities[n] = a;
                    try {
                        this._postMessage({
                            sourceName: this.sourceName,
                            targetName: this.targetName,
                            action: e,
                            callbackId: n,
                            data: t
                        }, s)
                    } catch (e) {
                        a.reject(e)
                    }
                    return a.promise
                }
                sendWithStream(e, t, s, n) {
                    const a = this.streamId++
                      , o = this.sourceName
                      , l = this.targetName
                      , c = this.comObj;
                    return new ReadableStream({
                        start: s=>{
                            const i = (0,
                            r.createPromiseCapability)();
                            this.streamControllers[a] = {
                                controller: s,
                                startCall: i,
                                pullCall: null,
                                cancelCall: null,
                                isClosed: !1
                            };
                            this._postMessage({
                                sourceName: o,
                                targetName: l,
                                action: e,
                                streamId: a,
                                data: t,
                                desiredSize: s.desiredSize
                            }, n);
                            return i.promise
                        }
                        ,
                        pull: e=>{
                            const t = (0,
                            r.createPromiseCapability)();
                            this.streamControllers[a].pullCall = t;
                            c.postMessage({
                                sourceName: o,
                                targetName: l,
                                stream: d,
                                streamId: a,
                                desiredSize: e.desiredSize
                            });
                            return t.promise
                        }
                        ,
                        cancel: e=>{
                            (0,
                            r.assert)(e instanceof Error, "cancel must have a valid reason");
                            const t = (0,
                            r.createPromiseCapability)();
                            this.streamControllers[a].cancelCall = t;
                            this.streamControllers[a].isClosed = !0;
                            c.postMessage({
                                sourceName: o,
                                targetName: l,
                                stream: i,
                                streamId: a,
                                reason: wrapReason(e)
                            });
                            return t.promise
                        }
                    },s)
                }
                _createStreamSink(e) {
                    const t = e.streamId
                      , s = this.sourceName
                      , n = e.sourceName
                      , a = this.comObj
                      , i = this
                      , o = this.actionHandler[e.action]
                      , d = {
                        enqueue(e, a=1, o) {
                            if (this.isCancelled)
                                return;
                            const l = this.desiredSize;
                            this.desiredSize -= a;
                            if (l > 0 && this.desiredSize <= 0) {
                                this.sinkCapability = (0,
                                r.createPromiseCapability)();
                                this.ready = this.sinkCapability.promise
                            }
                            i._postMessage({
                                sourceName: s,
                                targetName: n,
                                stream: c,
                                streamId: t,
                                chunk: e
                            }, o)
                        },
                        close() {
                            if (!this.isCancelled) {
                                this.isCancelled = !0;
                                a.postMessage({
                                    sourceName: s,
                                    targetName: n,
                                    stream: l,
                                    streamId: t
                                });
                                delete i.streamSinks[t]
                            }
                        },
                        error(e) {
                            (0,
                            r.assert)(e instanceof Error, "error must have a valid reason");
                            if (!this.isCancelled) {
                                this.isCancelled = !0;
                                a.postMessage({
                                    sourceName: s,
                                    targetName: n,
                                    stream: h,
                                    streamId: t,
                                    reason: wrapReason(e)
                                })
                            }
                        },
                        sinkCapability: (0,
                        r.createPromiseCapability)(),
                        onPull: null,
                        onCancel: null,
                        isCancelled: !1,
                        desiredSize: e.desiredSize,
                        ready: null
                    };
                    d.sinkCapability.resolve();
                    d.ready = d.sinkCapability.promise;
                    this.streamSinks[t] = d;
                    new Promise((function(t) {
                        t(o(e.data, d))
                    }
                    )).then((function() {
                        a.postMessage({
                            sourceName: s,
                            targetName: n,
                            stream: p,
                            streamId: t,
                            success: !0
                        })
                    }
                    ), (function(e) {
                        a.postMessage({
                            sourceName: s,
                            targetName: n,
                            stream: p,
                            streamId: t,
                            reason: wrapReason(e)
                        })
                    }
                    ))
                }
                _processStreamMessage(e) {
                    const t = e.streamId
                      , s = this.sourceName
                      , n = e.sourceName
                      , a = this.comObj
                      , g = this.streamControllers[t]
                      , f = this.streamSinks[t];
                    switch (e.stream) {
                    case p:
                        e.success ? g.startCall.resolve() : g.startCall.reject(wrapReason(e.reason));
                        break;
                    case u:
                        e.success ? g.pullCall.resolve() : g.pullCall.reject(wrapReason(e.reason));
                        break;
                    case d:
                        if (!f) {
                            a.postMessage({
                                sourceName: s,
                                targetName: n,
                                stream: u,
                                streamId: t,
                                success: !0
                            });
                            break
                        }
                        f.desiredSize <= 0 && e.desiredSize > 0 && f.sinkCapability.resolve();
                        f.desiredSize = e.desiredSize;
                        new Promise((function(e) {
                            e(f.onPull && f.onPull())
                        }
                        )).then((function() {
                            a.postMessage({
                                sourceName: s,
                                targetName: n,
                                stream: u,
                                streamId: t,
                                success: !0
                            })
                        }
                        ), (function(e) {
                            a.postMessage({
                                sourceName: s,
                                targetName: n,
                                stream: u,
                                streamId: t,
                                reason: wrapReason(e)
                            })
                        }
                        ));
                        break;
                    case c:
                        (0,
                        r.assert)(g, "enqueue should have stream controller");
                        if (g.isClosed)
                            break;
                        g.controller.enqueue(e.chunk);
                        break;
                    case l:
                        (0,
                        r.assert)(g, "close should have stream controller");
                        if (g.isClosed)
                            break;
                        g.isClosed = !0;
                        g.controller.close();
                        this._deleteStreamController(g, t);
                        break;
                    case h:
                        (0,
                        r.assert)(g, "error should have stream controller");
                        g.controller.error(wrapReason(e.reason));
                        this._deleteStreamController(g, t);
                        break;
                    case o:
                        e.success ? g.cancelCall.resolve() : g.cancelCall.reject(wrapReason(e.reason));
                        this._deleteStreamController(g, t);
                        break;
                    case i:
                        if (!f)
                            break;
                        new Promise((function(t) {
                            t(f.onCancel && f.onCancel(wrapReason(e.reason)))
                        }
                        )).then((function() {
                            a.postMessage({
                                sourceName: s,
                                targetName: n,
                                stream: o,
                                streamId: t,
                                success: !0
                            })
                        }
                        ), (function(e) {
                            a.postMessage({
                                sourceName: s,
                                targetName: n,
                                stream: o,
                                streamId: t,
                                reason: wrapReason(e)
                            })
                        }
                        ));
                        f.sinkCapability.reject(wrapReason(e.reason));
                        f.isCancelled = !0;
                        delete this.streamSinks[t];
                        break;
                    default:
                        throw new Error("Unexpected stream case")
                    }
                }
                async _deleteStreamController(e, t) {
                    await Promise.allSettled([e.startCall && e.startCall.promise, e.pullCall && e.pullCall.promise, e.cancelCall && e.cancelCall.promise]);
                    delete this.streamControllers[t]
                }
                _postMessage(e, t) {
                    t && this.postMessageTransfers ? this.comObj.postMessage(e, t) : this.comObj.postMessage(e)
                }
                destroy() {
                    this.comObj.removeEventListener("message", this._onComObjOnMessage)
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.Metadata = void 0;
            var r = s(2);
            t.Metadata = class Metadata {
                constructor({parsedData: e, rawData: t}) {
                    this._metadataMap = e;
                    this._data = t
                }
                getRaw() {
                    return this._data
                }
                get(e) {
                    return this._metadataMap.get(e) ?? null
                }
                getAll() {
                    return (0,
                    r.objectFromMap)(this._metadataMap)
                }
                has(e) {
                    return this._metadataMap.has(e)
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.OptionalContentConfig = void 0;
            var r = s(2);
            class OptionalContentGroup {
                constructor(e, t) {
                    this.visible = !0;
                    this.name = e;
                    this.intent = t
                }
            }
            t.OptionalContentConfig = class OptionalContentConfig {
                constructor(e) {
                    this.name = null;
                    this.creator = null;
                    this._order = null;
                    this._groups = new Map;
                    if (null !== e) {
                        this.name = e.name;
                        this.creator = e.creator;
                        this._order = e.order;
                        for (const t of e.groups)
                            this._groups.set(t.id, new OptionalContentGroup(t.name,t.intent));
                        if ("OFF" === e.baseState)
                            for (const e of this._groups)
                                e.visible = !1;
                        for (const t of e.on)
                            this._groups.get(t).visible = !0;
                        for (const t of e.off)
                            this._groups.get(t).visible = !1
                    }
                }
                _evaluateVisibilityExpression(e) {
                    const t = e.length;
                    if (t < 2)
                        return !0;
                    const s = e[0];
                    for (let n = 1; n < t; n++) {
                        const t = e[n];
                        let a;
                        if (Array.isArray(t))
                            a = this._evaluateVisibilityExpression(t);
                        else {
                            if (!this._groups.has(t)) {
                                (0,
                                r.warn)(`Optional content group not found: ${t}`);
                                return !0
                            }
                            a = this._groups.get(t).visible
                        }
                        switch (s) {
                        case "And":
                            if (!a)
                                return !1;
                            break;
                        case "Or":
                            if (a)
                                return !0;
                            break;
                        case "Not":
                            return !a;
                        default:
                            return !0
                        }
                    }
                    return "And" === s
                }
                isVisible(e) {
                    if (0 === this._groups.size)
                        return !0;
                    if (!e) {
                        (0,
                        r.warn)("Optional content group not defined.");
                        return !0
                    }
                    if ("OCG" === e.type) {
                        if (!this._groups.has(e.id)) {
                            (0,
                            r.warn)(`Optional content group not found: ${e.id}`);
                            return !0
                        }
                        return this._groups.get(e.id).visible
                    }
                    if ("OCMD" === e.type) {
                        if (e.expression)
                            return this._evaluateVisibilityExpression(e.expression);
                        if (!e.policy || "AnyOn" === e.policy) {
                            for (const t of e.ids) {
                                if (!this._groups.has(t)) {
                                    (0,
                                    r.warn)(`Optional content group not found: ${t}`);
                                    return !0
                                }
                                if (this._groups.get(t).visible)
                                    return !0
                            }
                            return !1
                        }
                        if ("AllOn" === e.policy) {
                            for (const t of e.ids) {
                                if (!this._groups.has(t)) {
                                    (0,
                                    r.warn)(`Optional content group not found: ${t}`);
                                    return !0
                                }
                                if (!this._groups.get(t).visible)
                                    return !1
                            }
                            return !0
                        }
                        if ("AnyOff" === e.policy) {
                            for (const t of e.ids) {
                                if (!this._groups.has(t)) {
                                    (0,
                                    r.warn)(`Optional content group not found: ${t}`);
                                    return !0
                                }
                                if (!this._groups.get(t).visible)
                                    return !0
                            }
                            return !1
                        }
                        if ("AllOff" === e.policy) {
                            for (const t of e.ids) {
                                if (!this._groups.has(t)) {
                                    (0,
                                    r.warn)(`Optional content group not found: ${t}`);
                                    return !0
                                }
                                if (this._groups.get(t).visible)
                                    return !1
                            }
                            return !0
                        }
                        (0,
                        r.warn)(`Unknown optional content policy ${e.policy}.`);
                        return !0
                    }
                    (0,
                    r.warn)(`Unknown group type ${e.type}.`);
                    return !0
                }
                setVisibility(e, t=!0) {
                    this._groups.has(e) ? this._groups.get(e).visible = !!t : (0,
                    r.warn)(`Optional content group not found: ${e}`)
                }
                getOrder() {
                    return this._groups.size ? this._order ? this._order.slice() : Array.from(this._groups.keys()) : null
                }
                getGroups() {
                    return this._groups.size > 0 ? (0,
                    r.objectFromMap)(this._groups) : null
                }
                getGroup(e) {
                    return this._groups.get(e) || null
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.PDFDataTransportStream = void 0;
            var r = s(2)
              , n = s(1);
            t.PDFDataTransportStream = class PDFDataTransportStream {
                constructor(e, t) {
                    (0,
                    r.assert)(t, 'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');
                    this._queuedChunks = [];
                    this._progressiveDone = e.progressiveDone || !1;
                    this._contentDispositionFilename = e.contentDispositionFilename || null;
                    const s = e.initialData;
                    if (s?.length > 0) {
                        const e = new Uint8Array(s).buffer;
                        this._queuedChunks.push(e)
                    }
                    this._pdfDataRangeTransport = t;
                    this._isStreamingSupported = !e.disableStream;
                    this._isRangeSupported = !e.disableRange;
                    this._contentLength = e.length;
                    this._fullRequestReader = null;
                    this._rangeReaders = [];
                    this._pdfDataRangeTransport.addRangeListener(((e,t)=>{
                        this._onReceiveData({
                            begin: e,
                            chunk: t
                        })
                    }
                    ));
                    this._pdfDataRangeTransport.addProgressListener(((e,t)=>{
                        this._onProgress({
                            loaded: e,
                            total: t
                        })
                    }
                    ));
                    this._pdfDataRangeTransport.addProgressiveReadListener((e=>{
                        this._onReceiveData({
                            chunk: e
                        })
                    }
                    ));
                    this._pdfDataRangeTransport.addProgressiveDoneListener((()=>{
                        this._onProgressiveDone()
                    }
                    ));
                    this._pdfDataRangeTransport.transportReady()
                }
                _onReceiveData(e) {
                    const t = new Uint8Array(e.chunk).buffer;
                    if (void 0 === e.begin)
                        this._fullRequestReader ? this._fullRequestReader._enqueue(t) : this._queuedChunks.push(t);
                    else {
                        const s = this._rangeReaders.some((function(s) {
                            if (s._begin !== e.begin)
                                return !1;
                            s._enqueue(t);
                            return !0
                        }
                        ));
                        (0,
                        r.assert)(s, "_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.")
                    }
                }
                get _progressiveDataLength() {
                    return this._fullRequestReader?._loaded ?? 0
                }
                _onProgress(e) {
                    if (void 0 === e.total) {
                        const t = this._rangeReaders[0];
                        t?.onProgress && t.onProgress({
                            loaded: e.loaded
                        })
                    } else {
                        const t = this._fullRequestReader;
                        t?.onProgress && t.onProgress({
                            loaded: e.loaded,
                            total: e.total
                        })
                    }
                }
                _onProgressiveDone() {
                    this._fullRequestReader && this._fullRequestReader.progressiveDone();
                    this._progressiveDone = !0
                }
                _removeRangeReader(e) {
                    const t = this._rangeReaders.indexOf(e);
                    t >= 0 && this._rangeReaders.splice(t, 1)
                }
                getFullReader() {
                    (0,
                    r.assert)(!this._fullRequestReader, "PDFDataTransportStream.getFullReader can only be called once.");
                    const e = this._queuedChunks;
                    this._queuedChunks = null;
                    return new PDFDataTransportStreamReader(this,e,this._progressiveDone,this._contentDispositionFilename)
                }
                getRangeReader(e, t) {
                    if (t <= this._progressiveDataLength)
                        return null;
                    const s = new PDFDataTransportStreamRangeReader(this,e,t);
                    this._pdfDataRangeTransport.requestDataRange(e, t);
                    this._rangeReaders.push(s);
                    return s
                }
                cancelAllRequests(e) {
                    this._fullRequestReader && this._fullRequestReader.cancel(e);
                    for (const t of this._rangeReaders.slice(0))
                        t.cancel(e);
                    this._pdfDataRangeTransport.abort()
                }
            }
            ;
            class PDFDataTransportStreamReader {
                constructor(e, t, s=!1, r=null) {
                    this._stream = e;
                    this._done = s || !1;
                    this._filename = (0,
                    n.isPdfFile)(r) ? r : null;
                    this._queuedChunks = t || [];
                    this._loaded = 0;
                    for (const e of this._queuedChunks)
                        this._loaded += e.byteLength;
                    this._requests = [];
                    this._headersReady = Promise.resolve();
                    e._fullRequestReader = this;
                    this.onProgress = null
                }
                _enqueue(e) {
                    if (!this._done) {
                        if (this._requests.length > 0) {
                            this._requests.shift().resolve({
                                value: e,
                                done: !1
                            })
                        } else
                            this._queuedChunks.push(e);
                        this._loaded += e.byteLength
                    }
                }
                get headersReady() {
                    return this._headersReady
                }
                get filename() {
                    return this._filename
                }
                get isRangeSupported() {
                    return this._stream._isRangeSupported
                }
                get isStreamingSupported() {
                    return this._stream._isStreamingSupported
                }
                get contentLength() {
                    return this._stream._contentLength
                }
                async read() {
                    if (this._queuedChunks.length > 0) {
                        return {
                            value: this._queuedChunks.shift(),
                            done: !1
                        }
                    }
                    if (this._done)
                        return {
                            value: void 0,
                            done: !0
                        };
                    const e = (0,
                    r.createPromiseCapability)();
                    this._requests.push(e);
                    return e.promise
                }
                cancel(e) {
                    this._done = !0;
                    for (const e of this._requests)
                        e.resolve({
                            value: void 0,
                            done: !0
                        });
                    this._requests.length = 0
                }
                progressiveDone() {
                    this._done || (this._done = !0)
                }
            }
            class PDFDataTransportStreamRangeReader {
                constructor(e, t, s) {
                    this._stream = e;
                    this._begin = t;
                    this._end = s;
                    this._queuedChunk = null;
                    this._requests = [];
                    this._done = !1;
                    this.onProgress = null
                }
                _enqueue(e) {
                    if (!this._done) {
                        if (0 === this._requests.length)
                            this._queuedChunk = e;
                        else {
                            this._requests.shift().resolve({
                                value: e,
                                done: !1
                            });
                            for (const e of this._requests)
                                e.resolve({
                                    value: void 0,
                                    done: !0
                                });
                            this._requests.length = 0
                        }
                        this._done = !0;
                        this._stream._removeRangeReader(this)
                    }
                }
                get isStreamingSupported() {
                    return !1
                }
                async read() {
                    if (this._queuedChunk) {
                        const e = this._queuedChunk;
                        this._queuedChunk = null;
                        return {
                            value: e,
                            done: !1
                        }
                    }
                    if (this._done)
                        return {
                            value: void 0,
                            done: !0
                        };
                    const e = (0,
                    r.createPromiseCapability)();
                    this._requests.push(e);
                    return e.promise
                }
                cancel(e) {
                    this._done = !0;
                    for (const e of this._requests)
                        e.resolve({
                            value: void 0,
                            done: !0
                        });
                    this._requests.length = 0;
                    this._stream._removeRangeReader(this)
                }
            }
        }
        , (e,t)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.XfaText = void 0;
            class XfaText {
                static textContent(e) {
                    const t = []
                      , s = {
                        items: t,
                        styles: Object.create(null)
                    };
                    !function walk(e) {
                        if (!e)
                            return;
                        let s = null;
                        const r = e.name;
                        if ("#text" === r)
                            s = e.value;
                        else {
                            if (!XfaText.shouldBuildText(r))
                                return;
                            e?.attributes?.textContent ? s = e.attributes.textContent : e.value && (s = e.value)
                        }
                        null !== s && t.push({
                            str: s
                        });
                        if (e.children)
                            for (const t of e.children)
                                walk(t)
                    }(e);
                    return s
                }
                static shouldBuildText(e) {
                    return !("textarea" === e || "input" === e || "option" === e || "select" === e)
                }
            }
            t.XfaText = XfaText
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.AnnotationLayer = void 0;
            var r = s(2)
              , n = s(1)
              , a = s(9)
              , i = s(19);
            const o = 1e3
              , l = new WeakSet;
            class AnnotationElementFactory {
                static create(e) {
                    switch (e.data.annotationType) {
                    case r.AnnotationType.LINK:
                        return new LinkAnnotationElement(e);
                    case r.AnnotationType.TEXT:
                        return new TextAnnotationElement(e);
                    case r.AnnotationType.WIDGET:
                        switch (e.data.fieldType) {
                        case "Tx":
                            return new TextWidgetAnnotationElement(e);
                        case "Btn":
                            return e.data.radioButton ? new RadioButtonWidgetAnnotationElement(e) : e.data.checkBox ? new CheckboxWidgetAnnotationElement(e) : new PushButtonWidgetAnnotationElement(e);
                        case "Ch":
                            return new ChoiceWidgetAnnotationElement(e)
                        }
                        return new WidgetAnnotationElement(e);
                    case r.AnnotationType.POPUP:
                        return new PopupAnnotationElement(e);
                    case r.AnnotationType.FREETEXT:
                        return new FreeTextAnnotationElement(e);
                    case r.AnnotationType.LINE:
                        return new LineAnnotationElement(e);
                    case r.AnnotationType.SQUARE:
                        return new SquareAnnotationElement(e);
                    case r.AnnotationType.CIRCLE:
                        return new CircleAnnotationElement(e);
                    case r.AnnotationType.POLYLINE:
                        return new PolylineAnnotationElement(e);
                    case r.AnnotationType.CARET:
                        return new CaretAnnotationElement(e);
                    case r.AnnotationType.INK:
                        return new InkAnnotationElement(e);
                    case r.AnnotationType.POLYGON:
                        return new PolygonAnnotationElement(e);
                    case r.AnnotationType.HIGHLIGHT:
                        return new HighlightAnnotationElement(e);
                    case r.AnnotationType.UNDERLINE:
                        return new UnderlineAnnotationElement(e);
                    case r.AnnotationType.SQUIGGLY:
                        return new SquigglyAnnotationElement(e);
                    case r.AnnotationType.STRIKEOUT:
                        return new StrikeOutAnnotationElement(e);
                    case r.AnnotationType.STAMP:
                        return new StampAnnotationElement(e);
                    case r.AnnotationType.FILEATTACHMENT:
                        return new FileAttachmentAnnotationElement(e);
                    default:
                        return new AnnotationElement(e)
                    }
                }
            }
            class AnnotationElement {
                constructor(e, {isRenderable: t=!1, ignoreBorder: s=!1, createQuadrilaterals: r=!1}={}) {
                    this.isRenderable = t;
                    this.data = e.data;
                    this.layer = e.layer;
                    this.page = e.page;
                    this.viewport = e.viewport;
                    this.linkService = e.linkService;
                    this.downloadManager = e.downloadManager;
                    this.imageResourcesPath = e.imageResourcesPath;
                    this.renderForms = e.renderForms;
                    this.svgFactory = e.svgFactory;
                    this.annotationStorage = e.annotationStorage;
                    this.enableScripting = e.enableScripting;
                    this.hasJSActions = e.hasJSActions;
                    this._fieldObjects = e.fieldObjects;
                    this._mouseState = e.mouseState;
                    t && (this.container = this._createContainer(s));
                    r && (this.quadrilaterals = this._createQuadrilaterals(s))
                }
                _createContainer(e=!1) {
                    const t = this.data
                      , s = this.page
                      , n = this.viewport
                      , a = document.createElement("section");
                    let i = t.rect[2] - t.rect[0]
                      , o = t.rect[3] - t.rect[1];
                    a.setAttribute("data-annotation-id", t.id);
                    const l = r.Util.normalizeRect([t.rect[0], s.view[3] - t.rect[1] + s.view[1], t.rect[2], s.view[3] - t.rect[3] + s.view[1]]);
                    a.style.transform = `matrix(${n.transform.join(",")})`;
                    a.style.transformOrigin = `${-l[0]}px ${-l[1]}px`;
                    if (!e && t.borderStyle.width > 0) {
                        a.style.borderWidth = `${t.borderStyle.width}px`;
                        if (t.borderStyle.style !== r.AnnotationBorderStyleType.UNDERLINE) {
                            i -= 2 * t.borderStyle.width;
                            o -= 2 * t.borderStyle.width
                        }
                        const e = t.borderStyle.horizontalCornerRadius
                          , s = t.borderStyle.verticalCornerRadius;
                        if (e > 0 || s > 0) {
                            const t = `${e}px / ${s}px`;
                            a.style.borderRadius = t
                        }
                        switch (t.borderStyle.style) {
                        case r.AnnotationBorderStyleType.SOLID:
                            a.style.borderStyle = "solid";
                            break;
                        case r.AnnotationBorderStyleType.DASHED:
                            a.style.borderStyle = "dashed";
                            break;
                        case r.AnnotationBorderStyleType.BEVELED:
                            (0,
                            r.warn)("Unimplemented border style: beveled");
                            break;
                        case r.AnnotationBorderStyleType.INSET:
                            (0,
                            r.warn)("Unimplemented border style: inset");
                            break;
                        case r.AnnotationBorderStyleType.UNDERLINE:
                            a.style.borderBottomStyle = "solid"
                        }
                        t.borderColor || t.color || null ? a.style.borderColor = r.Util.makeHexColor(0 | t.color[0], 0 | t.color[1], 0 | t.color[2]) : a.style.borderWidth = 0
                    }
                    a.style.left = `${l[0]}px`;
                    a.style.top = `${l[1]}px`;
                    a.style.width = `${i}px`;
                    a.style.height = `${o}px`;
                    return a
                }
                _createQuadrilaterals(e=!1) {
                    if (!this.data.quadPoints)
                        return null;
                    const t = []
                      , s = this.data.rect;
                    for (const s of this.data.quadPoints) {
                        this.data.rect = [s[2].x, s[2].y, s[1].x, s[1].y];
                        t.push(this._createContainer(e))
                    }
                    this.data.rect = s;
                    return t
                }
                _createPopup(e, t) {
                    let s = this.container;
                    if (this.quadrilaterals) {
                        e = e || this.quadrilaterals;
                        s = this.quadrilaterals[0]
                    }
                    if (!e) {
                        (e = document.createElement("div")).style.height = s.style.height;
                        e.style.width = s.style.width;
                        s.appendChild(e)
                    }
                    const r = new PopupElement({
                        container: s,
                        trigger: e,
                        color: t.color,
                        titleObj: t.titleObj,
                        modificationDate: t.modificationDate,
                        contentsObj: t.contentsObj,
                        hideWrapper: !0
                    }).render();
                    r.style.left = s.style.width;
                    s.appendChild(r)
                }
                _renderQuadrilaterals(e) {
                    for (const t of this.quadrilaterals)
                        t.className = e;
                    return this.quadrilaterals
                }
                render() {
                    (0,
                    r.unreachable)("Abstract method `AnnotationElement.render` called")
                }
                _getElementsByName(e, t=null) {
                    const s = [];
                    if (this._fieldObjects) {
                        const n = this._fieldObjects[e];
                        if (n)
                            for (const {page: e, id: a, exportValues: i} of n) {
                                if (-1 === e)
                                    continue;
                                if (a === t)
                                    continue;
                                const n = "string" == typeof i ? i : null
                                  , o = document.getElementById(a);
                                !o || l.has(o) ? s.push({
                                    id: a,
                                    exportValue: n,
                                    domElement: o
                                }) : (0,
                                r.warn)(`_getElementsByName - element not allowed: ${a}`)
                            }
                        return s
                    }
                    for (const r of document.getElementsByName(e)) {
                        const {id: e, exportValue: n} = r;
                        e !== t && (l.has(r) && s.push({
                            id: e,
                            exportValue: n,
                            domElement: r
                        }))
                    }
                    return s
                }
                static get platform() {
                    const e = "undefined" != typeof navigator ? navigator.platform : "";
                    return (0,
                    r.shadow)(this, "platform", {
                        isWin: e.includes("Win"),
                        isMac: e.includes("Mac")
                    })
                }
            }
            class LinkAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.url || e.data.dest || e.data.action || e.data.isTooltipOnly || e.data.resetForm || e.data.actions && (e.data.actions.Action || e.data.actions["Mouse Up"] || e.data.actions["Mouse Down"])),
                        createQuadrilaterals: !0
                    })
                }
                render() {
                    const {data: e, linkService: t} = this
                      , s = document.createElement("a");
                    if (e.url) {
                        t.addLinkAttributes || (0,
                        r.warn)("LinkAnnotationElement.render - missing `addLinkAttributes`-method on the `linkService`-instance.");
                        t.addLinkAttributes?.(s, e.url, e.newWindow)
                    } else if (e.action)
                        this._bindNamedAction(s, e.action);
                    else if (e.dest)
                        this._bindLink(s, e.dest);
                    else {
                        let t = !1;
                        if (e.actions && (e.actions.Action || e.actions["Mouse Up"] || e.actions["Mouse Down"]) && this.enableScripting && this.hasJSActions) {
                            t = !0;
                            this._bindJSAction(s, e)
                        }
                        e.resetForm ? this._bindResetFormAction(s, e.resetForm) : t || this._bindLink(s, "")
                    }
                    if (this.quadrilaterals)
                        return this._renderQuadrilaterals("linkAnnotation").map(((e,t)=>{
                            const r = 0 === t ? s : s.cloneNode();
                            e.appendChild(r);
                            return e
                        }
                        ));
                    this.container.className = "linkAnnotation";
                    this.container.appendChild(s);
                    return this.container
                }
                _bindLink(e, t) {
                    e.href = this.linkService.getDestinationHash(t);
                    e.onclick = ()=>{
                        t && this.linkService.goToDestination(t);
                        return !1
                    }
                    ;
                    (t || "" === t) && (e.className = "internalLink")
                }
                _bindNamedAction(e, t) {
                    e.href = this.linkService.getAnchorUrl("");
                    e.onclick = ()=>{
                        this.linkService.executeNamedAction(t);
                        return !1
                    }
                    ;
                    e.className = "internalLink"
                }
                _bindJSAction(e, t) {
                    e.href = this.linkService.getAnchorUrl("");
                    const s = new Map([["Action", "onclick"], ["Mouse Up", "onmouseup"], ["Mouse Down", "onmousedown"]]);
                    for (const r of Object.keys(t.actions)) {
                        const n = s.get(r);
                        n && (e[n] = ()=>{
                            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                source: this,
                                detail: {
                                    id: t.id,
                                    name: r
                                }
                            });
                            return !1
                        }
                        )
                    }
                    e.onclick || (e.onclick = ()=>!1);
                    e.className = "internalLink"
                }
                _bindResetFormAction(e, t) {
                    const s = e.onclick;
                    s || (e.href = this.linkService.getAnchorUrl(""));
                    e.className = "internalLink";
                    if (this._fieldObjects)
                        e.onclick = ()=>{
                            s && s();
                            const {fields: e, refs: r, include: n} = t
                              , a = [];
                            if (0 !== e.length || 0 !== r.length) {
                                const t = new Set(r);
                                for (const s of e) {
                                    const e = this._fieldObjects[s] || [];
                                    for (const {id: s} of e)
                                        t.add(s)
                                }
                                for (const e of Object.values(this._fieldObjects))
                                    for (const s of e)
                                        t.has(s.id) === n && a.push(s)
                            } else
                                for (const e of Object.values(this._fieldObjects))
                                    a.push(...e);
                            const i = this.annotationStorage
                              , o = [];
                            for (const e of a) {
                                const {id: t} = e;
                                o.push(t);
                                switch (e.type) {
                                case "text":
                                    {
                                        const s = e.defaultValue || "";
                                        i.setValue(t, {
                                            value: s,
                                            valueAsString: s
                                        });
                                        break
                                    }
                                case "checkbox":
                                case "radiobutton":
                                    {
                                        const s = e.defaultValue === e.exportValues;
                                        i.setValue(t, {
                                            value: s
                                        });
                                        break
                                    }
                                case "combobox":
                                case "listbox":
                                    {
                                        const s = e.defaultValue || "";
                                        i.setValue(t, {
                                            value: s
                                        });
                                        break
                                    }
                                default:
                                    continue
                                }
                                const s = document.getElementById(t);
                                s && l.has(s) && s.dispatchEvent(new Event("resetform"))
                            }
                            this.enableScripting && this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                source: this,
                                detail: {
                                    id: "app",
                                    ids: o,
                                    name: "ResetForm"
                                }
                            });
                            return !1
                        }
                        ;
                    else {
                        (0,
                        r.warn)('_bindResetFormAction - "resetForm" action not supported, ensure that the `fieldObjects` parameter is provided.');
                        s || (e.onclick = ()=>!1)
                    }
                }
            }
            class TextAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str)
                    })
                }
                render() {
                    this.container.className = "textAnnotation";
                    const e = document.createElement("img");
                    e.style.height = this.container.style.height;
                    e.style.width = this.container.style.width;
                    e.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
                    e.alt = "[{{type}} Annotation]";
                    e.dataset.l10nId = "text_annotation_type";
                    e.dataset.l10nArgs = JSON.stringify({
                        type: this.data.name
                    });
                    this.data.hasPopup || this._createPopup(e, this.data);
                    this.container.appendChild(e);
                    return this.container
                }
            }
            class WidgetAnnotationElement extends AnnotationElement {
                render() {
                    this.data.alternativeText && (this.container.title = this.data.alternativeText);
                    return this.container
                }
                _getKeyModifier(e) {
                    const {isWin: t, isMac: s} = AnnotationElement.platform;
                    return t && e.ctrlKey || s && e.metaKey
                }
                _setEventListener(e, t, s, r) {
                    t.includes("mouse") ? e.addEventListener(t, (e=>{
                        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                            source: this,
                            detail: {
                                id: this.data.id,
                                name: s,
                                value: r(e),
                                shift: e.shiftKey,
                                modifier: this._getKeyModifier(e)
                            }
                        })
                    }
                    )) : e.addEventListener(t, (e=>{
                        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                            source: this,
                            detail: {
                                id: this.data.id,
                                name: s,
                                value: e.target.checked
                            }
                        })
                    }
                    ))
                }
                _setEventListeners(e, t, s) {
                    for (const [r,n] of t)
                        ("Action" === n || this.data.actions?.[n]) && this._setEventListener(e, r, n, s)
                }
                _setBackgroundColor(e) {
                    const t = this.data.backgroundColor || null;
                    e.style.backgroundColor = null === t ? "transparent" : r.Util.makeHexColor(t[0], t[1], t[2])
                }
                _dispatchEventFromSandbox(e, t) {
                    const setColor = (e,t,s)=>{
                        const r = s.detail[e];
                        s.target.style[t] = i.ColorConverters[`${r[0]}_HTML`](r.slice(1))
                    }
                      , s = {
                        display: e=>{
                            const t = e.detail.display % 2 == 1;
                            e.target.style.visibility = t ? "hidden" : "visible";
                            this.annotationStorage.setValue(this.data.id, {
                                hidden: t,
                                print: 0 === e.detail.display || 3 === e.detail.display
                            })
                        }
                        ,
                        print: e=>{
                            this.annotationStorage.setValue(this.data.id, {
                                print: e.detail.print
                            })
                        }
                        ,
                        hidden: e=>{
                            e.target.style.visibility = e.detail.hidden ? "hidden" : "visible";
                            this.annotationStorage.setValue(this.data.id, {
                                hidden: e.detail.hidden
                            })
                        }
                        ,
                        focus: e=>{
                            setTimeout((()=>e.target.focus({
                                preventScroll: !1
                            })), 0)
                        }
                        ,
                        userName: e=>{
                            e.target.title = e.detail.userName
                        }
                        ,
                        readonly: e=>{
                            e.detail.readonly ? e.target.setAttribute("readonly", "") : e.target.removeAttribute("readonly")
                        }
                        ,
                        required: e=>{
                            e.detail.required ? e.target.setAttribute("required", "") : e.target.removeAttribute("required")
                        }
                        ,
                        bgColor: e=>{
                            setColor("bgColor", "backgroundColor", e)
                        }
                        ,
                        fillColor: e=>{
                            setColor("fillColor", "backgroundColor", e)
                        }
                        ,
                        fgColor: e=>{
                            setColor("fgColor", "color", e)
                        }
                        ,
                        textColor: e=>{
                            setColor("textColor", "color", e)
                        }
                        ,
                        borderColor: e=>{
                            setColor("borderColor", "borderColor", e)
                        }
                        ,
                        strokeColor: e=>{
                            setColor("strokeColor", "borderColor", e)
                        }
                    };
                    for (const r of Object.keys(t.detail)) {
                        const n = e[r] || s[r];
                        n && n(t)
                    }
                }
            }
            class TextWidgetAnnotationElement extends WidgetAnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: e.renderForms || !e.data.hasAppearance && !!e.data.fieldValue
                    })
                }
                setPropertyOnSiblings(e, t, s, r) {
                    const n = this.annotationStorage;
                    for (const a of this._getElementsByName(e.name, e.id)) {
                        a.domElement && (a.domElement[t] = s);
                        n.setValue(a.id, {
                            [r]: s
                        })
                    }
                }
                render() {
                    const e = this.annotationStorage
                      , t = this.data.id;
                    this.container.className = "textWidgetAnnotation";
                    let s = null;
                    if (this.renderForms) {
                        const r = e.getValue(t, {
                            value: this.data.fieldValue,
                            valueAsString: this.data.fieldValue
                        })
                          , n = r.valueAsString || r.value || ""
                          , a = {
                            userValue: null,
                            formattedValue: null,
                            beforeInputSelectionRange: null,
                            beforeInputValue: null
                        };
                        if (this.data.multiLine) {
                            s = document.createElement("textarea");
                            s.textContent = n
                        } else {
                            s = document.createElement("input");
                            s.type = "text";
                            s.setAttribute("value", n)
                        }
                        l.add(s);
                        s.disabled = this.data.readOnly;
                        s.name = this.data.fieldName;
                        s.tabIndex = o;
                        a.userValue = n;
                        s.setAttribute("id", t);
                        s.addEventListener("input", (r=>{
                            e.setValue(t, {
                                value: r.target.value
                            });
                            this.setPropertyOnSiblings(s, "value", r.target.value, "value")
                        }
                        ));
                        s.addEventListener("resetform", (e=>{
                            const t = this.data.defaultFieldValue || "";
                            s.value = a.userValue = t;
                            delete a.formattedValue
                        }
                        ));
                        let blurListener = e=>{
                            a.formattedValue && (e.target.value = a.formattedValue);
                            e.target.scrollLeft = 0;
                            a.beforeInputSelectionRange = null
                        }
                        ;
                        if (this.enableScripting && this.hasJSActions) {
                            s.addEventListener("focus", (e=>{
                                a.userValue && (e.target.value = a.userValue)
                            }
                            ));
                            s.addEventListener("updatefromsandbox", (s=>{
                                const r = {
                                    value(s) {
                                        a.userValue = s.detail.value || "";
                                        e.setValue(t, {
                                            value: a.userValue.toString()
                                        });
                                        a.formattedValue || (s.target.value = a.userValue)
                                    },
                                    valueAsString(s) {
                                        a.formattedValue = s.detail.valueAsString || "";
                                        s.target !== document.activeElement && (s.target.value = a.formattedValue);
                                        e.setValue(t, {
                                            formattedValue: a.formattedValue
                                        })
                                    },
                                    selRange(e) {
                                        const [t,s] = e.detail.selRange;
                                        t >= 0 && s < e.target.value.length && e.target.setSelectionRange(t, s)
                                    }
                                };
                                this._dispatchEventFromSandbox(r, s)
                            }
                            ));
                            s.addEventListener("keydown", (e=>{
                                a.beforeInputValue = e.target.value;
                                let s = -1;
                                "Escape" === e.key ? s = 0 : "Enter" === e.key ? s = 2 : "Tab" === e.key && (s = 3);
                                if (-1 !== s) {
                                    a.userValue = e.target.value;
                                    this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                        source: this,
                                        detail: {
                                            id: t,
                                            name: "Keystroke",
                                            value: e.target.value,
                                            willCommit: !0,
                                            commitKey: s,
                                            selStart: e.target.selectionStart,
                                            selEnd: e.target.selectionEnd
                                        }
                                    })
                                }
                            }
                            ));
                            const r = blurListener;
                            blurListener = null;
                            s.addEventListener("blur", (e=>{
                                if (this._mouseState.isDown) {
                                    a.userValue = e.target.value;
                                    this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                        source: this,
                                        detail: {
                                            id: t,
                                            name: "Keystroke",
                                            value: e.target.value,
                                            willCommit: !0,
                                            commitKey: 1,
                                            selStart: e.target.selectionStart,
                                            selEnd: e.target.selectionEnd
                                        }
                                    })
                                }
                                r(e)
                            }
                            ));
                            s.addEventListener("mousedown", (e=>{
                                a.beforeInputValue = e.target.value;
                                a.beforeInputSelectionRange = null
                            }
                            ));
                            s.addEventListener("keyup", (e=>{
                                e.target.selectionStart === e.target.selectionEnd && (a.beforeInputSelectionRange = null)
                            }
                            ));
                            s.addEventListener("select", (e=>{
                                a.beforeInputSelectionRange = [e.target.selectionStart, e.target.selectionEnd]
                            }
                            ));
                            this.data.actions?.Keystroke && s.addEventListener("input", (e=>{
                                let s = -1
                                  , r = -1;
                                a.beforeInputSelectionRange && ([s,r] = a.beforeInputSelectionRange);
                                this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                    source: this,
                                    detail: {
                                        id: t,
                                        name: "Keystroke",
                                        value: a.beforeInputValue,
                                        change: e.data,
                                        willCommit: !1,
                                        selStart: s,
                                        selEnd: r
                                    }
                                })
                            }
                            ));
                            this._setEventListeners(s, [["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], (e=>e.target.value))
                        }
                        blurListener && s.addEventListener("blur", blurListener);
                        null !== this.data.maxLen && (s.maxLength = this.data.maxLen);
                        if (this.data.comb) {
                            const e = (this.data.rect[2] - this.data.rect[0]) / this.data.maxLen;
                            s.classList.add("comb");
                            s.style.letterSpacing = `calc(${e}px - 1ch)`
                        }
                    } else {
                        s = document.createElement("div");
                        s.textContent = this.data.fieldValue;
                        s.style.verticalAlign = "middle";
                        s.style.display = "table-cell"
                    }
                    this._setTextStyle(s);
                    this._setBackgroundColor(s);
                    this.container.appendChild(s);
                    return this.container
                }
                _setTextStyle(e) {
                    const t = ["left", "center", "right"]
                      , {fontSize: s, fontColor: n} = this.data.defaultAppearanceData
                      , a = e.style;
                    s && (a.fontSize = `${s}px`);
                    a.color = r.Util.makeHexColor(n[0], n[1], n[2]);
                    null !== this.data.textAlignment && (a.textAlign = t[this.data.textAlignment])
                }
            }
            class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: e.renderForms
                    })
                }
                render() {
                    const e = this.annotationStorage
                      , t = this.data
                      , s = t.id;
                    let r = e.getValue(s, {
                        value: t.exportValue === t.fieldValue
                    }).value;
                    if ("string" == typeof r) {
                        r = "Off" !== r;
                        e.setValue(s, {
                            value: r
                        })
                    }
                    this.container.className = "buttonWidgetAnnotation checkBox";
                    const n = document.createElement("input");
                    l.add(n);
                    n.disabled = t.readOnly;
                    n.type = "checkbox";
                    n.name = t.fieldName;
                    r && n.setAttribute("checked", !0);
                    n.setAttribute("id", s);
                    n.setAttribute("exportValue", t.exportValue);
                    n.tabIndex = o;
                    n.addEventListener("change", (r=>{
                        const {name: n, checked: a} = r.target;
                        for (const r of this._getElementsByName(n, s)) {
                            const s = a && r.exportValue === t.exportValue;
                            r.domElement && (r.domElement.checked = s);
                            e.setValue(r.id, {
                                value: s
                            })
                        }
                        e.setValue(s, {
                            value: a
                        })
                    }
                    ));
                    n.addEventListener("resetform", (e=>{
                        const s = t.defaultFieldValue || "Off";
                        e.target.checked = s === t.exportValue
                    }
                    ));
                    if (this.enableScripting && this.hasJSActions) {
                        n.addEventListener("updatefromsandbox", (t=>{
                            const r = {
                                value(t) {
                                    t.target.checked = "Off" !== t.detail.value;
                                    e.setValue(s, {
                                        value: t.target.checked
                                    })
                                }
                            };
                            this._dispatchEventFromSandbox(r, t)
                        }
                        ));
                        this._setEventListeners(n, [["change", "Validate"], ["change", "Action"], ["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], (e=>e.target.checked))
                    }
                    this._setBackgroundColor(n);
                    this.container.appendChild(n);
                    return this.container
                }
            }
            class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: e.renderForms
                    })
                }
                render() {
                    this.container.className = "buttonWidgetAnnotation radioButton";
                    const e = this.annotationStorage
                      , t = this.data
                      , s = t.id;
                    let r = e.getValue(s, {
                        value: t.fieldValue === t.buttonValue
                    }).value;
                    if ("string" == typeof r) {
                        r = r !== t.buttonValue;
                        e.setValue(s, {
                            value: r
                        })
                    }
                    const n = document.createElement("input");
                    l.add(n);
                    n.disabled = t.readOnly;
                    n.type = "radio";
                    n.name = t.fieldName;
                    r && n.setAttribute("checked", !0);
                    n.setAttribute("id", s);
                    n.tabIndex = o;
                    n.addEventListener("change", (t=>{
                        const {name: r, checked: n} = t.target;
                        for (const t of this._getElementsByName(r, s))
                            e.setValue(t.id, {
                                value: !1
                            });
                        e.setValue(s, {
                            value: n
                        })
                    }
                    ));
                    n.addEventListener("resetform", (e=>{
                        const s = t.defaultFieldValue;
                        e.target.checked = null != s && s === t.buttonValue
                    }
                    ));
                    if (this.enableScripting && this.hasJSActions) {
                        const r = t.buttonValue;
                        n.addEventListener("updatefromsandbox", (t=>{
                            const n = {
                                value: t=>{
                                    const n = r === t.detail.value;
                                    for (const r of this._getElementsByName(t.target.name)) {
                                        const t = n && r.id === s;
                                        r.domElement && (r.domElement.checked = t);
                                        e.setValue(r.id, {
                                            value: t
                                        })
                                    }
                                }
                            };
                            this._dispatchEventFromSandbox(n, t)
                        }
                        ));
                        this._setEventListeners(n, [["change", "Validate"], ["change", "Action"], ["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"]], (e=>e.target.checked))
                    }
                    this._setBackgroundColor(n);
                    this.container.appendChild(n);
                    return this.container
                }
            }
            class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
                render() {
                    const e = super.render();
                    e.className = "buttonWidgetAnnotation pushButton";
                    this.data.alternativeText && (e.title = this.data.alternativeText);
                    return e
                }
            }
            class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: e.renderForms
                    })
                }
                render() {
                    this.container.className = "choiceWidgetAnnotation";
                    const e = this.annotationStorage
                      , t = this.data.id;
                    e.getValue(t, {
                        value: this.data.fieldValue.length > 0 ? this.data.fieldValue[0] : void 0
                    });
                    let {fontSize: s} = this.data.defaultAppearanceData;
                    s || (s = 9);
                    const r = `calc(${s}px * var(--zoom-factor))`
                      , n = document.createElement("select");
                    l.add(n);
                    n.disabled = this.data.readOnly;
                    n.name = this.data.fieldName;
                    n.setAttribute("id", t);
                    n.tabIndex = o;
                    n.style.fontSize = `${s}px`;
                    if (!this.data.combo) {
                        n.size = this.data.options.length;
                        this.data.multiSelect && (n.multiple = !0)
                    }
                    n.addEventListener("resetform", (e=>{
                        const t = this.data.defaultFieldValue;
                        for (const e of n.options)
                            e.selected = e.value === t
                    }
                    ));
                    for (const e of this.data.options) {
                        const t = document.createElement("option");
                        t.textContent = e.displayValue;
                        t.value = e.exportValue;
                        this.data.combo && (t.style.fontSize = r);
                        this.data.fieldValue.includes(e.exportValue) && t.setAttribute("selected", !0);
                        n.appendChild(t)
                    }
                    const getValue = (e,t)=>{
                        const s = t ? "value" : "textContent"
                          , r = e.target.options;
                        return e.target.multiple ? Array.prototype.filter.call(r, (e=>e.selected)).map((e=>e[s])) : -1 === r.selectedIndex ? null : r[r.selectedIndex][s]
                    }
                      , getItems = e=>{
                        const t = e.target.options;
                        return Array.prototype.map.call(t, (e=>({
                            displayValue: e.textContent,
                            exportValue: e.value
                        })))
                    }
                    ;
                    if (this.enableScripting && this.hasJSActions) {
                        n.addEventListener("updatefromsandbox", (s=>{
                            const r = {
                                value(s) {
                                    const r = s.detail.value
                                      , a = new Set(Array.isArray(r) ? r : [r]);
                                    for (const e of n.options)
                                        e.selected = a.has(e.value);
                                    e.setValue(t, {
                                        value: getValue(s, !0)
                                    })
                                },
                                multipleSelection(e) {
                                    n.multiple = !0
                                },
                                remove(s) {
                                    const r = n.options
                                      , a = s.detail.remove;
                                    r[a].selected = !1;
                                    n.remove(a);
                                    if (r.length > 0) {
                                        -1 === Array.prototype.findIndex.call(r, (e=>e.selected)) && (r[0].selected = !0)
                                    }
                                    e.setValue(t, {
                                        value: getValue(s, !0),
                                        items: getItems(s)
                                    })
                                },
                                clear(s) {
                                    for (; 0 !== n.length; )
                                        n.remove(0);
                                    e.setValue(t, {
                                        value: null,
                                        items: []
                                    })
                                },
                                insert(s) {
                                    const {index: r, displayValue: a, exportValue: i} = s.detail.insert
                                      , o = document.createElement("option");
                                    o.textContent = a;
                                    o.value = i;
                                    n.insertBefore(o, n.children[r]);
                                    e.setValue(t, {
                                        value: getValue(s, !0),
                                        items: getItems(s)
                                    })
                                },
                                items(s) {
                                    const {items: r} = s.detail;
                                    for (; 0 !== n.length; )
                                        n.remove(0);
                                    for (const e of r) {
                                        const {displayValue: t, exportValue: s} = e
                                          , r = document.createElement("option");
                                        r.textContent = t;
                                        r.value = s;
                                        n.appendChild(r)
                                    }
                                    n.options.length > 0 && (n.options[0].selected = !0);
                                    e.setValue(t, {
                                        value: getValue(s, !0),
                                        items: getItems(s)
                                    })
                                },
                                indices(s) {
                                    const r = new Set(s.detail.indices);
                                    for (const e of s.target.options)
                                        e.selected = r.has(e.index);
                                    e.setValue(t, {
                                        value: getValue(s, !0)
                                    })
                                },
                                editable(e) {
                                    e.target.disabled = !e.detail.editable
                                }
                            };
                            this._dispatchEventFromSandbox(r, s)
                        }
                        ));
                        n.addEventListener("input", (s=>{
                            const r = getValue(s, !0)
                              , n = getValue(s, !1);
                            e.setValue(t, {
                                value: r
                            });
                            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                source: this,
                                detail: {
                                    id: t,
                                    name: "Keystroke",
                                    value: n,
                                    changeEx: r,
                                    willCommit: !0,
                                    commitKey: 1,
                                    keyDown: !1
                                }
                            })
                        }
                        ));
                        this._setEventListeners(n, [["focus", "Focus"], ["blur", "Blur"], ["mousedown", "Mouse Down"], ["mouseenter", "Mouse Enter"], ["mouseleave", "Mouse Exit"], ["mouseup", "Mouse Up"], ["input", "Action"]], (e=>e.target.checked))
                    } else
                        n.addEventListener("input", (function(s) {
                            e.setValue(t, {
                                value: getValue(s)
                            })
                        }
                        ));
                    this._setBackgroundColor(n);
                    this.container.appendChild(n);
                    return this.container
                }
            }
            class PopupAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !(!e.data.titleObj?.str && !e.data.contentsObj?.str)
                    })
                }
                render() {
                    this.container.className = "popupAnnotation";
                    if (["Line", "Square", "Circle", "PolyLine", "Polygon", "Ink"].includes(this.data.parentType))
                        return this.container;
                    const e = `[data-annotation-id="${this.data.parentId}"]`
                      , t = this.layer.querySelectorAll(e);
                    if (0 === t.length)
                        return this.container;
                    const s = new PopupElement({
                        container: this.container,
                        trigger: Array.from(t),
                        color: this.data.color,
                        titleObj: this.data.titleObj,
                        modificationDate: this.data.modificationDate,
                        contentsObj: this.data.contentsObj
                    })
                      , n = this.page
                      , a = r.Util.normalizeRect([this.data.parentRect[0], n.view[3] - this.data.parentRect[1] + n.view[1], this.data.parentRect[2], n.view[3] - this.data.parentRect[3] + n.view[1]])
                      , i = a[0] + this.data.parentRect[2] - this.data.parentRect[0]
                      , o = a[1];
                    this.container.style.transformOrigin = `${-i}px ${-o}px`;
                    this.container.style.left = `${i}px`;
                    this.container.style.top = `${o}px`;
                    this.container.appendChild(s.render());
                    return this.container
                }
            }
            class PopupElement {
                constructor(e) {
                    this.container = e.container;
                    this.trigger = e.trigger;
                    this.color = e.color;
                    this.titleObj = e.titleObj;
                    this.modificationDate = e.modificationDate;
                    this.contentsObj = e.contentsObj;
                    this.hideWrapper = e.hideWrapper || !1;
                    this.pinned = !1
                }
                render() {
                    const e = document.createElement("div");
                    e.className = "popupWrapper";
                    this.hideElement = this.hideWrapper ? e : this.container;
                    this.hideElement.hidden = !0;
                    const t = document.createElement("div");
                    t.className = "popup";
                    const s = this.color;
                    if (s) {
                        const e = .7 * (255 - s[0]) + s[0]
                          , n = .7 * (255 - s[1]) + s[1]
                          , a = .7 * (255 - s[2]) + s[2];
                        t.style.backgroundColor = r.Util.makeHexColor(0 | e, 0 | n, 0 | a)
                    }
                    const a = document.createElement("h1");
                    a.dir = this.titleObj.dir;
                    a.textContent = this.titleObj.str;
                    t.appendChild(a);
                    const i = n.PDFDateString.toDateObject(this.modificationDate);
                    if (i) {
                        const e = document.createElement("span");
                        e.textContent = "{{date}}, {{time}}";
                        e.dataset.l10nId = "annotation_date_string";
                        e.dataset.l10nArgs = JSON.stringify({
                            date: i.toLocaleDateString(),
                            time: i.toLocaleTimeString()
                        });
                        t.appendChild(e)
                    }
                    const o = this._formatContents(this.contentsObj);
                    t.appendChild(o);
                    Array.isArray(this.trigger) || (this.trigger = [this.trigger]);
                    for (const e of this.trigger) {
                        e.addEventListener("click", this._toggle.bind(this));
                        e.addEventListener("mouseover", this._show.bind(this, !1));
                        e.addEventListener("mouseout", this._hide.bind(this, !1))
                    }
                    t.addEventListener("click", this._hide.bind(this, !0));
                    e.appendChild(t);
                    return e
                }
                _formatContents({str: e, dir: t}) {
                    const s = document.createElement("p");
                    s.dir = t;
                    const r = e.split(/(?:\r\n?|\n)/);
                    for (let e = 0, t = r.length; e < t; ++e) {
                        const n = r[e];
                        s.appendChild(document.createTextNode(n));
                        e < t - 1 && s.appendChild(document.createElement("br"))
                    }
                    return s
                }
                _toggle() {
                    this.pinned ? this._hide(!0) : this._show(!0)
                }
                _show(e=!1) {
                    e && (this.pinned = !0);
                    if (this.hideElement.hidden) {
                        this.hideElement.hidden = !1;
                        this.container.style.zIndex += 1
                    }
                }
                _hide(e=!0) {
                    e && (this.pinned = !1);
                    if (!this.hideElement.hidden && !this.pinned) {
                        this.hideElement.hidden = !0;
                        this.container.style.zIndex -= 1
                    }
                }
            }
            class FreeTextAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    })
                }
                render() {
                    this.container.className = "freeTextAnnotation";
                    this.data.hasPopup || this._createPopup(null, this.data);
                    return this.container
                }
            }
            class LineAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    })
                }
                render() {
                    this.container.className = "lineAnnotation";
                    const e = this.data
                      , t = e.rect[2] - e.rect[0]
                      , s = e.rect[3] - e.rect[1]
                      , r = this.svgFactory.create(t, s)
                      , n = this.svgFactory.createElement("svg:line");
                    n.setAttribute("x1", e.rect[2] - e.lineCoordinates[0]);
                    n.setAttribute("y1", e.rect[3] - e.lineCoordinates[1]);
                    n.setAttribute("x2", e.rect[2] - e.lineCoordinates[2]);
                    n.setAttribute("y2", e.rect[3] - e.lineCoordinates[3]);
                    n.setAttribute("stroke-width", e.borderStyle.width || 1);
                    n.setAttribute("stroke", "transparent");
                    r.appendChild(n);
                    this.container.append(r);
                    this._createPopup(n, e);
                    return this.container
                }
            }
            class SquareAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    })
                }
                render() {
                    this.container.className = "squareAnnotation";
                    const e = this.data
                      , t = e.rect[2] - e.rect[0]
                      , s = e.rect[3] - e.rect[1]
                      , r = this.svgFactory.create(t, s)
                      , n = e.borderStyle.width
                      , a = this.svgFactory.createElement("svg:rect");
                    a.setAttribute("x", n / 2);
                    a.setAttribute("y", n / 2);
                    a.setAttribute("width", t - n);
                    a.setAttribute("height", s - n);
                    a.setAttribute("stroke-width", n || 1);
                    a.setAttribute("stroke", "transparent");
                    a.setAttribute("fill", "none");
                    r.appendChild(a);
                    this.container.append(r);
                    this._createPopup(a, e);
                    return this.container
                }
            }
            class CircleAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    })
                }
                render() {
                    this.container.className = "circleAnnotation";
                    const e = this.data
                      , t = e.rect[2] - e.rect[0]
                      , s = e.rect[3] - e.rect[1]
                      , r = this.svgFactory.create(t, s)
                      , n = e.borderStyle.width
                      , a = this.svgFactory.createElement("svg:ellipse");
                    a.setAttribute("cx", t / 2);
                    a.setAttribute("cy", s / 2);
                    a.setAttribute("rx", t / 2 - n / 2);
                    a.setAttribute("ry", s / 2 - n / 2);
                    a.setAttribute("stroke-width", n || 1);
                    a.setAttribute("stroke", "transparent");
                    a.setAttribute("fill", "none");
                    r.appendChild(a);
                    this.container.append(r);
                    this._createPopup(a, e);
                    return this.container
                }
            }
            class PolylineAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    });
                    this.containerClassName = "polylineAnnotation";
                    this.svgElementName = "svg:polyline"
                }
                render() {
                    this.container.className = this.containerClassName;
                    const e = this.data
                      , t = e.rect[2] - e.rect[0]
                      , s = e.rect[3] - e.rect[1]
                      , r = this.svgFactory.create(t, s);
                    let n = [];
                    for (const t of e.vertices) {
                        const s = t.x - e.rect[0]
                          , r = e.rect[3] - t.y;
                        n.push(s + "," + r)
                    }
                    n = n.join(" ");
                    const a = this.svgFactory.createElement(this.svgElementName);
                    a.setAttribute("points", n);
                    a.setAttribute("stroke-width", e.borderStyle.width || 1);
                    a.setAttribute("stroke", "transparent");
                    a.setAttribute("fill", "none");
                    r.appendChild(a);
                    this.container.append(r);
                    this._createPopup(a, e);
                    return this.container
                }
            }
            class PolygonAnnotationElement extends PolylineAnnotationElement {
                constructor(e) {
                    super(e);
                    this.containerClassName = "polygonAnnotation";
                    this.svgElementName = "svg:polygon"
                }
            }
            class CaretAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    })
                }
                render() {
                    this.container.className = "caretAnnotation";
                    this.data.hasPopup || this._createPopup(null, this.data);
                    return this.container
                }
            }
            class InkAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    });
                    this.containerClassName = "inkAnnotation";
                    this.svgElementName = "svg:polyline"
                }
                render() {
                    this.container.className = this.containerClassName;
                    const e = this.data
                      , t = e.rect[2] - e.rect[0]
                      , s = e.rect[3] - e.rect[1]
                      , r = this.svgFactory.create(t, s);
                    for (const t of e.inkLists) {
                        let s = [];
                        for (const r of t) {
                            const t = r.x - e.rect[0]
                              , n = e.rect[3] - r.y;
                            s.push(`${t},${n}`)
                        }
                        s = s.join(" ");
                        const n = this.svgFactory.createElement(this.svgElementName);
                        n.setAttribute("points", s);
                        n.setAttribute("stroke-width", e.borderStyle.width || 1);
                        n.setAttribute("stroke", "transparent");
                        n.setAttribute("fill", "none");
                        this._createPopup(n, e);
                        r.appendChild(n)
                    }
                    this.container.append(r);
                    return this.container
                }
            }
            class HighlightAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0,
                        createQuadrilaterals: !0
                    })
                }
                render() {
                    this.data.hasPopup || this._createPopup(null, this.data);
                    if (this.quadrilaterals)
                        return this._renderQuadrilaterals("highlightAnnotation");
                    this.container.className = "highlightAnnotation";
                    return this.container
                }
            }
            class UnderlineAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0,
                        createQuadrilaterals: !0
                    })
                }
                render() {
                    this.data.hasPopup || this._createPopup(null, this.data);
                    if (this.quadrilaterals)
                        return this._renderQuadrilaterals("underlineAnnotation");
                    this.container.className = "underlineAnnotation";
                    return this.container
                }
            }
            class SquigglyAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0,
                        createQuadrilaterals: !0
                    })
                }
                render() {
                    this.data.hasPopup || this._createPopup(null, this.data);
                    if (this.quadrilaterals)
                        return this._renderQuadrilaterals("squigglyAnnotation");
                    this.container.className = "squigglyAnnotation";
                    return this.container
                }
            }
            class StrikeOutAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0,
                        createQuadrilaterals: !0
                    })
                }
                render() {
                    this.data.hasPopup || this._createPopup(null, this.data);
                    if (this.quadrilaterals)
                        return this._renderQuadrilaterals("strikeoutAnnotation");
                    this.container.className = "strikeoutAnnotation";
                    return this.container
                }
            }
            class StampAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !!(e.data.hasPopup || e.data.titleObj?.str || e.data.contentsObj?.str),
                        ignoreBorder: !0
                    })
                }
                render() {
                    this.container.className = "stampAnnotation";
                    this.data.hasPopup || this._createPopup(null, this.data);
                    return this.container
                }
            }
            class FileAttachmentAnnotationElement extends AnnotationElement {
                constructor(e) {
                    super(e, {
                        isRenderable: !0
                    });
                    const {filename: t, content: s} = this.data.file;
                    this.filename = (0,
                    n.getFilenameFromUrl)(t);
                    this.content = s;
                    this.linkService.eventBus?.dispatch("fileattachmentannotation", {
                        source: this,
                        id: (0,
                        r.stringToPDFString)(t),
                        filename: t,
                        content: s
                    })
                }
                render() {
                    this.container.className = "fileAttachmentAnnotation";
                    const e = document.createElement("div");
                    e.style.height = this.container.style.height;
                    e.style.width = this.container.style.width;
                    e.addEventListener("dblclick", this._download.bind(this));
                    this.data.hasPopup || !this.data.titleObj?.str && !this.data.contentsObj?.str || this._createPopup(e, this.data);
                    this.container.appendChild(e);
                    return this.container
                }
                _download() {
                    this.downloadManager?.openOrDownloadData(this.container, this.content, this.filename)
                }
            }
            t.AnnotationLayer = class AnnotationLayer {
                static render(e) {
                    const t = []
                      , s = [];
                    for (const n of e.annotations)
                        n && (n.annotationType !== r.AnnotationType.POPUP ? t.push(n) : s.push(n));
                    s.length && t.push(...s);
                    for (const s of t) {
                        const t = AnnotationElementFactory.create({
                            data: s,
                            layer: e.div,
                            page: e.page,
                            viewport: e.viewport,
                            linkService: e.linkService,
                            downloadManager: e.downloadManager,
                            imageResourcesPath: e.imageResourcesPath || "",
                            renderForms: !1 !== e.renderForms,
                            svgFactory: new n.DOMSVGFactory,
                            annotationStorage: e.annotationStorage || new a.AnnotationStorage,
                            enableScripting: e.enableScripting,
                            hasJSActions: e.hasJSActions,
                            fieldObjects: e.fieldObjects,
                            mouseState: e.mouseState || {
                                isDown: !1
                            }
                        });
                        if (t.isRenderable) {
                            const r = t.render();
                            s.hidden && (r.style.visibility = "hidden");
                            if (Array.isArray(r))
                                for (const t of r)
                                    e.div.appendChild(t);
                            else
                                t instanceof PopupAnnotationElement ? e.div.prepend(r) : e.div.appendChild(r)
                        }
                    }
                }
                static update(e) {
                    const t = `matrix(${e.viewport.transform.join(",")})`;
                    for (const s of e.annotations) {
                        const r = e.div.querySelectorAll(`[data-annotation-id="${s.id}"]`);
                        if (r)
                            for (const e of r)
                                e.style.transform = t
                    }
                    e.div.hidden = !1
                }
            }
        }
        , (e,t)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.ColorConverters = void 0;
            function makeColorComp(e) {
                return Math.floor(255 * Math.max(0, Math.min(1, e))).toString(16).padStart(2, "0")
            }
            t.ColorConverters = class ColorConverters {
                static CMYK_G([e,t,s,r]) {
                    return ["G", 1 - Math.min(1, .3 * e + .59 * s + .11 * t + r)]
                }
                static G_CMYK([e]) {
                    return ["CMYK", 0, 0, 0, 1 - e]
                }
                static G_RGB([e]) {
                    return ["RGB", e, e, e]
                }
                static G_HTML([e]) {
                    const t = makeColorComp(e);
                    return `#${t}${t}${t}`
                }
                static RGB_G([e,t,s]) {
                    return ["G", .3 * e + .59 * t + .11 * s]
                }
                static RGB_HTML([e,t,s]) {
                    return `#${makeColorComp(e)}${makeColorComp(t)}${makeColorComp(s)}`
                }
                static T_HTML() {
                    return "#00000000"
                }
                static CMYK_RGB([e,t,s,r]) {
                    return ["RGB", 1 - Math.min(1, e + r), 1 - Math.min(1, s + r), 1 - Math.min(1, t + r)]
                }
                static CMYK_HTML(e) {
                    return this.RGB_HTML(this.CMYK_RGB(e))
                }
                static RGB_CMYK([e,t,s]) {
                    const r = 1 - e
                      , n = 1 - t
                      , a = 1 - s;
                    return ["CMYK", r, n, a, Math.min(r, n, a)]
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.renderTextLayer = function renderTextLayer(e) {
                const t = new TextLayerRenderTask({
                    textContent: e.textContent,
                    textContentStream: e.textContentStream,
                    container: e.container,
                    viewport: e.viewport,
                    textDivs: e.textDivs,
                    textContentItemsStr: e.textContentItemsStr,
                    enhanceTextSelection: e.enhanceTextSelection
                });
                t._render(e.timeout);
                return t
            }
            ;
            var r = s(2);
            const n = 30
              , a = new Map
              , i = /^\s+$/g;
            function appendText(e, t, s, o) {
                const l = document.createElement("span")
                  , c = e._enhanceTextSelection ? {
                    angle: 0,
                    canvasWidth: 0,
                    hasText: "" !== t.str,
                    hasEOL: t.hasEOL,
                    originalTransform: null,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 0,
                    scale: 1
                } : {
                    angle: 0,
                    canvasWidth: 0,
                    hasText: "" !== t.str,
                    hasEOL: t.hasEOL
                };
                e._textDivs.push(l);
                const h = r.Util.transform(e._viewport.transform, t.transform);
                let d = Math.atan2(h[1], h[0]);
                const u = s[t.fontName];
                u.vertical && (d += Math.PI / 2);
                const p = Math.hypot(h[2], h[3])
                  , g = p * function getAscent(e, t) {
                    const s = a.get(e);
                    if (s)
                        return s;
                    t.save();
                    t.font = `30px ${e}`;
                    const r = t.measureText("");
                    let i = r.fontBoundingBoxAscent
                      , o = Math.abs(r.fontBoundingBoxDescent);
                    if (i) {
                        t.restore();
                        const s = i / (i + o);
                        a.set(e, s);
                        return s
                    }
                    t.strokeStyle = "red";
                    t.clearRect(0, 0, n, n);
                    t.strokeText("g", 0, 0);
                    let l = t.getImageData(0, 0, n, n).data;
                    o = 0;
                    for (let e = l.length - 1 - 3; e >= 0; e -= 4)
                        if (l[e] > 0) {
                            o = Math.ceil(e / 4 / n);
                            break
                        }
                    t.clearRect(0, 0, n, n);
                    t.strokeText("A", 0, n);
                    l = t.getImageData(0, 0, n, n).data;
                    i = 0;
                    for (let e = 0, t = l.length; e < t; e += 4)
                        if (l[e] > 0) {
                            i = n - Math.floor(e / 4 / n);
                            break
                        }
                    t.restore();
                    if (i) {
                        const t = i / (i + o);
                        a.set(e, t);
                        return t
                    }
                    a.set(e, .8);
                    return .8
                }(u.fontFamily, o);
                let f, m;
                if (0 === d) {
                    f = h[4];
                    m = h[5] - g
                } else {
                    f = h[4] + g * Math.sin(d);
                    m = h[5] - g * Math.cos(d)
                }
                l.style.left = `${f}px`;
                l.style.top = `${m}px`;
                l.style.fontSize = `${p}px`;
                l.style.fontFamily = u.fontFamily;
                l.setAttribute("role", "presentation");
                l.textContent = t.str;
                l.dir = t.dir;
                e._fontInspectorEnabled && (l.dataset.fontName = t.fontName);
                0 !== d && (c.angle = d * (180 / Math.PI));
                let _ = !1;
                if (t.str.length > 1 || e._enhanceTextSelection && i.test(t.str))
                    _ = !0;
                else if (t.transform[0] !== t.transform[3]) {
                    const e = Math.abs(t.transform[0])
                      , s = Math.abs(t.transform[3]);
                    e !== s && Math.max(e, s) / Math.min(e, s) > 1.5 && (_ = !0)
                }
                _ && (u.vertical ? c.canvasWidth = t.height * e._viewport.scale : c.canvasWidth = t.width * e._viewport.scale);
                e._textDivProperties.set(l, c);
                e._textContentStream && e._layoutText(l);
                if (e._enhanceTextSelection && c.hasText) {
                    let s = 1
                      , n = 0;
                    if (0 !== d) {
                        s = Math.cos(d);
                        n = Math.sin(d)
                    }
                    const a = (u.vertical ? t.height : t.width) * e._viewport.scale
                      , i = p;
                    let o, c;
                    if (0 !== d) {
                        o = [s, n, -n, s, f, m];
                        c = r.Util.getAxialAlignedBoundingBox([0, 0, a, i], o)
                    } else
                        c = [f, m, f + a, m + i];
                    e._bounds.push({
                        left: c[0],
                        top: c[1],
                        right: c[2],
                        bottom: c[3],
                        div: l,
                        size: [a, i],
                        m: o
                    })
                }
            }
            function render(e) {
                if (e._canceled)
                    return;
                const t = e._textDivs
                  , s = e._capability
                  , r = t.length;
                if (r > 1e5) {
                    e._renderingDone = !0;
                    s.resolve()
                } else {
                    if (!e._textContentStream)
                        for (let s = 0; s < r; s++)
                            e._layoutText(t[s]);
                    e._renderingDone = !0;
                    s.resolve()
                }
            }
            function findPositiveMin(e, t, s) {
                let r = 0;
                for (let n = 0; n < s; n++) {
                    const s = e[t++];
                    s > 0 && (r = r ? Math.min(s, r) : s)
                }
                return r
            }
            function expand(e) {
                const t = e._bounds
                  , s = e._viewport
                  , n = function expandBounds(e, t, s) {
                    const r = s.map((function(e, t) {
                        return {
                            x1: e.left,
                            y1: e.top,
                            x2: e.right,
                            y2: e.bottom,
                            index: t,
                            x1New: void 0,
                            x2New: void 0
                        }
                    }
                    ));
                    expandBoundsLTR(e, r);
                    const n = new Array(s.length);
                    for (const e of r) {
                        const t = e.index;
                        n[t] = {
                            left: e.x1New,
                            top: 0,
                            right: e.x2New,
                            bottom: 0
                        }
                    }
                    s.map((function(t, s) {
                        const a = n[s]
                          , i = r[s];
                        i.x1 = t.top;
                        i.y1 = e - a.right;
                        i.x2 = t.bottom;
                        i.y2 = e - a.left;
                        i.index = s;
                        i.x1New = void 0;
                        i.x2New = void 0
                    }
                    ));
                    expandBoundsLTR(t, r);
                    for (const e of r) {
                        const t = e.index;
                        n[t].top = e.x1New;
                        n[t].bottom = e.x2New
                    }
                    return n
                }(s.width, s.height, t);
                for (let s = 0; s < n.length; s++) {
                    const a = t[s].div
                      , i = e._textDivProperties.get(a);
                    if (0 === i.angle) {
                        i.paddingLeft = t[s].left - n[s].left;
                        i.paddingTop = t[s].top - n[s].top;
                        i.paddingRight = n[s].right - t[s].right;
                        i.paddingBottom = n[s].bottom - t[s].bottom;
                        e._textDivProperties.set(a, i);
                        continue
                    }
                    const o = n[s]
                      , l = t[s]
                      , c = l.m
                      , h = c[0]
                      , d = c[1]
                      , u = [[0, 0], [0, l.size[1]], [l.size[0], 0], l.size]
                      , p = new Float64Array(64);
                    for (let e = 0, t = u.length; e < t; e++) {
                        const t = r.Util.applyTransform(u[e], c);
                        p[e + 0] = h && (o.left - t[0]) / h;
                        p[e + 4] = d && (o.top - t[1]) / d;
                        p[e + 8] = h && (o.right - t[0]) / h;
                        p[e + 12] = d && (o.bottom - t[1]) / d;
                        p[e + 16] = d && (o.left - t[0]) / -d;
                        p[e + 20] = h && (o.top - t[1]) / h;
                        p[e + 24] = d && (o.right - t[0]) / -d;
                        p[e + 28] = h && (o.bottom - t[1]) / h;
                        p[e + 32] = h && (o.left - t[0]) / -h;
                        p[e + 36] = d && (o.top - t[1]) / -d;
                        p[e + 40] = h && (o.right - t[0]) / -h;
                        p[e + 44] = d && (o.bottom - t[1]) / -d;
                        p[e + 48] = d && (o.left - t[0]) / d;
                        p[e + 52] = h && (o.top - t[1]) / -h;
                        p[e + 56] = d && (o.right - t[0]) / d;
                        p[e + 60] = h && (o.bottom - t[1]) / -h
                    }
                    const g = 1 + Math.min(Math.abs(h), Math.abs(d));
                    i.paddingLeft = findPositiveMin(p, 32, 16) / g;
                    i.paddingTop = findPositiveMin(p, 48, 16) / g;
                    i.paddingRight = findPositiveMin(p, 0, 16) / g;
                    i.paddingBottom = findPositiveMin(p, 16, 16) / g;
                    e._textDivProperties.set(a, i)
                }
            }
            function expandBoundsLTR(e, t) {
                t.sort((function(e, t) {
                    return e.x1 - t.x1 || e.index - t.index
                }
                ));
                const s = [{
                    start: -1 / 0,
                    end: 1 / 0,
                    boundary: {
                        x1: -1 / 0,
                        y1: -1 / 0,
                        x2: 0,
                        y2: 1 / 0,
                        index: -1,
                        x1New: 0,
                        x2New: 0
                    }
                }];
                for (const e of t) {
                    let t = 0;
                    for (; t < s.length && s[t].end <= e.y1; )
                        t++;
                    let r, n, a = s.length - 1;
                    for (; a >= 0 && s[a].start >= e.y2; )
                        a--;
                    let i, o, l = -1 / 0;
                    for (i = t; i <= a; i++) {
                        r = s[i];
                        n = r.boundary;
                        let t;
                        t = n.x2 > e.x1 ? n.index > e.index ? n.x1New : e.x1 : void 0 === n.x2New ? (n.x2 + e.x1) / 2 : n.x2New;
                        t > l && (l = t)
                    }
                    e.x1New = l;
                    for (i = t; i <= a; i++) {
                        r = s[i];
                        n = r.boundary;
                        void 0 === n.x2New ? n.x2 > e.x1 ? n.index > e.index && (n.x2New = n.x2) : n.x2New = l : n.x2New > l && (n.x2New = Math.max(l, n.x2))
                    }
                    const c = [];
                    let h = null;
                    for (i = t; i <= a; i++) {
                        r = s[i];
                        n = r.boundary;
                        const t = n.x2 > e.x2 ? n : e;
                        if (h === t)
                            c[c.length - 1].end = r.end;
                        else {
                            c.push({
                                start: r.start,
                                end: r.end,
                                boundary: t
                            });
                            h = t
                        }
                    }
                    if (s[t].start < e.y1) {
                        c[0].start = e.y1;
                        c.unshift({
                            start: s[t].start,
                            end: e.y1,
                            boundary: s[t].boundary
                        })
                    }
                    if (e.y2 < s[a].end) {
                        c[c.length - 1].end = e.y2;
                        c.push({
                            start: e.y2,
                            end: s[a].end,
                            boundary: s[a].boundary
                        })
                    }
                    for (i = t; i <= a; i++) {
                        r = s[i];
                        n = r.boundary;
                        if (void 0 !== n.x2New)
                            continue;
                        let e = !1;
                        for (o = t - 1; !e && o >= 0 && s[o].start >= n.y1; o--)
                            e = s[o].boundary === n;
                        for (o = a + 1; !e && o < s.length && s[o].end <= n.y2; o++)
                            e = s[o].boundary === n;
                        for (o = 0; !e && o < c.length; o++)
                            e = c[o].boundary === n;
                        e || (n.x2New = l)
                    }
                    Array.prototype.splice.apply(s, [t, a - t + 1].concat(c))
                }
                for (const t of s) {
                    const s = t.boundary;
                    void 0 === s.x2New && (s.x2New = Math.max(e, s.x2))
                }
            }
            class TextLayerRenderTask {
                constructor({textContent: e, textContentStream: t, container: s, viewport: n, textDivs: a, textContentItemsStr: i, enhanceTextSelection: o}) {
                    this._textContent = e;
                    this._textContentStream = t;
                    this._container = s;
                    this._document = s.ownerDocument;
                    this._viewport = n;
                    this._textDivs = a || [];
                    this._textContentItemsStr = i || [];
                    this._enhanceTextSelection = !!o;
                    this._fontInspectorEnabled = !!globalThis.FontInspector?.enabled;
                    this._reader = null;
                    this._layoutTextLastFontSize = null;
                    this._layoutTextLastFontFamily = null;
                    this._layoutTextCtx = null;
                    this._textDivProperties = new WeakMap;
                    this._renderingDone = !1;
                    this._canceled = !1;
                    this._capability = (0,
                    r.createPromiseCapability)();
                    this._renderTimer = null;
                    this._bounds = [];
                    this._capability.promise.finally((()=>{
                        this._enhanceTextSelection || (this._textDivProperties = null);
                        if (this._layoutTextCtx) {
                            this._layoutTextCtx.canvas.width = 0;
                            this._layoutTextCtx.canvas.height = 0;
                            this._layoutTextCtx = null
                        }
                    }
                    )).catch((()=>{}
                    ))
                }
                get promise() {
                    return this._capability.promise
                }
                cancel() {
                    this._canceled = !0;
                    if (this._reader) {
                        this._reader.cancel(new r.AbortException("TextLayer task cancelled.")).catch((()=>{}
                        ));
                        this._reader = null
                    }
                    if (null !== this._renderTimer) {
                        clearTimeout(this._renderTimer);
                        this._renderTimer = null
                    }
                    this._capability.reject(new Error("TextLayer task cancelled."))
                }
                _processItems(e, t) {
                    for (let s = 0, r = e.length; s < r; s++)
                        if (void 0 !== e[s].str) {
                            this._textContentItemsStr.push(e[s].str);
                            appendText(this, e[s], t, this._layoutTextCtx)
                        } else if ("beginMarkedContentProps" === e[s].type || "beginMarkedContent" === e[s].type) {
                            const t = this._container;
                            this._container = document.createElement("span");
                            this._container.classList.add("markedContent");
                            null !== e[s].id && this._container.setAttribute("id", `${e[s].id}`);
                            t.appendChild(this._container)
                        } else
                            "endMarkedContent" === e[s].type && (this._container = this._container.parentNode)
                }
                _layoutText(e) {
                    const t = this._textDivProperties.get(e);
                    let s = "";
                    if (0 !== t.canvasWidth && t.hasText) {
                        const {fontSize: r, fontFamily: n} = e.style;
                        if (r !== this._layoutTextLastFontSize || n !== this._layoutTextLastFontFamily) {
                            this._layoutTextCtx.font = `${r} ${n}`;
                            this._layoutTextLastFontSize = r;
                            this._layoutTextLastFontFamily = n
                        }
                        const {width: a} = this._layoutTextCtx.measureText(e.textContent);
                        if (a > 0) {
                            const e = t.canvasWidth / a;
                            this._enhanceTextSelection && (t.scale = e);
                            s = `scaleX(${e})`
                        }
                    }
                    0 !== t.angle && (s = `rotate(${t.angle}deg) ${s}`);
                    if (s.length > 0) {
                        this._enhanceTextSelection && (t.originalTransform = s);
                        e.style.transform = s
                    }
                    t.hasText && this._container.appendChild(e);
                    if (t.hasEOL) {
                        const e = document.createElement("br");
                        e.setAttribute("role", "presentation");
                        this._container.appendChild(e)
                    }
                }
                _render(e=0) {
                    const t = (0,
                    r.createPromiseCapability)();
                    let s = Object.create(null);
                    const a = this._document.createElement("canvas");
                    a.height = a.width = n;
                    a.mozOpaque = !0;
                    this._layoutTextCtx = a.getContext("2d", {
                        alpha: !1
                    });
                    if (this._textContent) {
                        const e = this._textContent.items
                          , s = this._textContent.styles;
                        this._processItems(e, s);
                        t.resolve()
                    } else {
                        if (!this._textContentStream)
                            throw new Error('Neither "textContent" nor "textContentStream" parameters specified.');
                        {
                            const pump = ()=>{
                                this._reader.read().then((({value: e, done: r})=>{
                                    if (r)
                                        t.resolve();
                                    else {
                                        Object.assign(s, e.styles);
                                        this._processItems(e.items, s);
                                        pump()
                                    }
                                }
                                ), t.reject)
                            }
                            ;
                            this._reader = this._textContentStream.getReader();
                            pump()
                        }
                    }
                    t.promise.then((()=>{
                        s = null;
                        e ? this._renderTimer = setTimeout((()=>{
                            render(this);
                            this._renderTimer = null
                        }
                        ), e) : render(this)
                    }
                    ), this._capability.reject)
                }
                expandTextDivs(e=!1) {
                    if (!this._enhanceTextSelection || !this._renderingDone)
                        return;
                    if (null !== this._bounds) {
                        expand(this);
                        this._bounds = null
                    }
                    const t = []
                      , s = [];
                    for (let r = 0, n = this._textDivs.length; r < n; r++) {
                        const n = this._textDivs[r]
                          , a = this._textDivProperties.get(n);
                        if (a.hasText)
                            if (e) {
                                t.length = 0;
                                s.length = 0;
                                a.originalTransform && t.push(a.originalTransform);
                                if (a.paddingTop > 0) {
                                    s.push(`${a.paddingTop}px`);
                                    t.push(`translateY(${-a.paddingTop}px)`)
                                } else
                                    s.push(0);
                                a.paddingRight > 0 ? s.push(a.paddingRight / a.scale + "px") : s.push(0);
                                a.paddingBottom > 0 ? s.push(`${a.paddingBottom}px`) : s.push(0);
                                if (a.paddingLeft > 0) {
                                    s.push(a.paddingLeft / a.scale + "px");
                                    t.push(`translateX(${-a.paddingLeft / a.scale}px)`)
                                } else
                                    s.push(0);
                                n.style.padding = s.join(" ");
                                t.length && (n.style.transform = t.join(" "))
                            } else {
                                n.style.padding = null;
                                n.style.transform = a.originalTransform
                            }
                    }
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.SVGGraphics = void 0;
            var r = s(2)
              , n = s(1)
              , a = s(4);
            let i = class {
                constructor() {
                    (0,
                    r.unreachable)("Not implemented: SVGGraphics")
                }
            }
            ;
            t.SVGGraphics = i;
            {
                const e = {
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fillColor: "#000000"
                }
                  , s = "http://www.w3.org/XML/1998/namespace"
                  , o = "http://www.w3.org/1999/xlink"
                  , l = ["butt", "round", "square"]
                  , c = ["miter", "round", "bevel"]
                  , h = function() {
                    const e = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
                      , t = new Int32Array(256);
                    for (let e = 0; e < 256; e++) {
                        let s = e;
                        for (let e = 0; e < 8; e++)
                            s = 1 & s ? 3988292384 ^ s >> 1 & 2147483647 : s >> 1 & 2147483647;
                        t[e] = s
                    }
                    function writePngChunk(e, s, r, n) {
                        let a = n;
                        const i = s.length;
                        r[a] = i >> 24 & 255;
                        r[a + 1] = i >> 16 & 255;
                        r[a + 2] = i >> 8 & 255;
                        r[a + 3] = 255 & i;
                        a += 4;
                        r[a] = 255 & e.charCodeAt(0);
                        r[a + 1] = 255 & e.charCodeAt(1);
                        r[a + 2] = 255 & e.charCodeAt(2);
                        r[a + 3] = 255 & e.charCodeAt(3);
                        a += 4;
                        r.set(s, a);
                        a += s.length;
                        const o = function crc32(e, s, r) {
                            let n = -1;
                            for (let a = s; a < r; a++) {
                                const s = 255 & (n ^ e[a]);
                                n = n >>> 8 ^ t[s]
                            }
                            return -1 ^ n
                        }(r, n + 4, a);
                        r[a] = o >> 24 & 255;
                        r[a + 1] = o >> 16 & 255;
                        r[a + 2] = o >> 8 & 255;
                        r[a + 3] = 255 & o
                    }
                    function deflateSyncUncompressed(e) {
                        let t = e.length;
                        const s = 65535
                          , r = Math.ceil(t / s)
                          , n = new Uint8Array(2 + t + 5 * r + 4);
                        let a = 0;
                        n[a++] = 120;
                        n[a++] = 156;
                        let i = 0;
                        for (; t > s; ) {
                            n[a++] = 0;
                            n[a++] = 255;
                            n[a++] = 255;
                            n[a++] = 0;
                            n[a++] = 0;
                            n.set(e.subarray(i, i + s), a);
                            a += s;
                            i += s;
                            t -= s
                        }
                        n[a++] = 1;
                        n[a++] = 255 & t;
                        n[a++] = t >> 8 & 255;
                        n[a++] = 255 & ~t;
                        n[a++] = (65535 & ~t) >> 8 & 255;
                        n.set(e.subarray(i), a);
                        a += e.length - i;
                        const o = function adler32(e, t, s) {
                            let r = 1
                              , n = 0;
                            for (let a = t; a < s; ++a) {
                                r = (r + (255 & e[a])) % 65521;
                                n = (n + r) % 65521
                            }
                            return n << 16 | r
                        }(e, 0, e.length);
                        n[a++] = o >> 24 & 255;
                        n[a++] = o >> 16 & 255;
                        n[a++] = o >> 8 & 255;
                        n[a++] = 255 & o;
                        return n
                    }
                    function encode(t, s, n, i) {
                        const o = t.width
                          , l = t.height;
                        let c, h, d;
                        const u = t.data;
                        switch (s) {
                        case r.ImageKind.GRAYSCALE_1BPP:
                            h = 0;
                            c = 1;
                            d = o + 7 >> 3;
                            break;
                        case r.ImageKind.RGB_24BPP:
                            h = 2;
                            c = 8;
                            d = 3 * o;
                            break;
                        case r.ImageKind.RGBA_32BPP:
                            h = 6;
                            c = 8;
                            d = 4 * o;
                            break;
                        default:
                            throw new Error("invalid format")
                        }
                        const p = new Uint8Array((1 + d) * l);
                        let g = 0
                          , f = 0;
                        for (let e = 0; e < l; ++e) {
                            p[g++] = 0;
                            p.set(u.subarray(f, f + d), g);
                            f += d;
                            g += d
                        }
                        if (s === r.ImageKind.GRAYSCALE_1BPP && i) {
                            g = 0;
                            for (let e = 0; e < l; e++) {
                                g++;
                                for (let e = 0; e < d; e++)
                                    p[g++] ^= 255
                            }
                        }
                        const m = new Uint8Array([o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, 255 & o, l >> 24 & 255, l >> 16 & 255, l >> 8 & 255, 255 & l, c, h, 0, 0, 0])
                          , _ = function deflateSync(e) {
                            if (!a.isNodeJS)
                                return deflateSyncUncompressed(e);
                            try {
                                let t;
                                t = parseInt(process.versions.node) >= 8 ? e : Buffer.from(e);
                                const s = require("zlib").deflateSync(t, {
                                    level: 9
                                });
                                return s instanceof Uint8Array ? s : new Uint8Array(s)
                            } catch (e) {
                                (0,
                                r.warn)("Not compressing PNG because zlib.deflateSync is unavailable: " + e)
                            }
                            return deflateSyncUncompressed(e)
                        }(p)
                          , A = e.length + 36 + m.length + _.length
                          , b = new Uint8Array(A);
                        let y = 0;
                        b.set(e, y);
                        y += e.length;
                        writePngChunk("IHDR", m, b, y);
                        y += 12 + m.length;
                        writePngChunk("IDATA", _, b, y);
                        y += 12 + _.length;
                        writePngChunk("IEND", new Uint8Array(0), b, y);
                        return (0,
                        r.createObjectURL)(b, "image/png", n)
                    }
                    return function convertImgDataToPng(e, t, s) {
                        return encode(e, void 0 === e.kind ? r.ImageKind.GRAYSCALE_1BPP : e.kind, t, s)
                    }
                }();
                class SVGExtraState {
                    constructor() {
                        this.fontSizeScale = 1;
                        this.fontWeight = e.fontWeight;
                        this.fontSize = 0;
                        this.textMatrix = r.IDENTITY_MATRIX;
                        this.fontMatrix = r.FONT_IDENTITY_MATRIX;
                        this.leading = 0;
                        this.textRenderingMode = r.TextRenderingMode.FILL;
                        this.textMatrixScale = 1;
                        this.x = 0;
                        this.y = 0;
                        this.lineX = 0;
                        this.lineY = 0;
                        this.charSpacing = 0;
                        this.wordSpacing = 0;
                        this.textHScale = 1;
                        this.textRise = 0;
                        this.fillColor = e.fillColor;
                        this.strokeColor = "#000000";
                        this.fillAlpha = 1;
                        this.strokeAlpha = 1;
                        this.lineWidth = 1;
                        this.lineJoin = "";
                        this.lineCap = "";
                        this.miterLimit = 0;
                        this.dashArray = [];
                        this.dashPhase = 0;
                        this.dependencies = [];
                        this.activeClipUrl = null;
                        this.clipGroup = null;
                        this.maskId = ""
                    }
                    clone() {
                        return Object.create(this)
                    }
                    setCurrentPoint(e, t) {
                        this.x = e;
                        this.y = t
                    }
                }
                function opListToTree(e) {
                    let t = [];
                    const s = [];
                    for (const r of e)
                        if ("save" !== r.fn)
                            "restore" === r.fn ? t = s.pop() : t.push(r);
                        else {
                            t.push({
                                fnId: 92,
                                fn: "group",
                                items: []
                            });
                            s.push(t);
                            t = t[t.length - 1].items
                        }
                    return t
                }
                function pf(e) {
                    if (Number.isInteger(e))
                        return e.toString();
                    const t = e.toFixed(10);
                    let s = t.length - 1;
                    if ("0" !== t[s])
                        return t;
                    do {
                        s--
                    } while ("0" === t[s]);
                    return t.substring(0, "." === t[s] ? s : s + 1)
                }
                function pm(e) {
                    if (0 === e[4] && 0 === e[5]) {
                        if (0 === e[1] && 0 === e[2])
                            return 1 === e[0] && 1 === e[3] ? "" : `scale(${pf(e[0])} ${pf(e[3])})`;
                        if (e[0] === e[3] && e[1] === -e[2]) {
                            return `rotate(${pf(180 * Math.acos(e[0]) / Math.PI)})`
                        }
                    } else if (1 === e[0] && 0 === e[1] && 0 === e[2] && 1 === e[3])
                        return `translate(${pf(e[4])} ${pf(e[5])})`;
                    return `matrix(${pf(e[0])} ${pf(e[1])} ${pf(e[2])} ${pf(e[3])} ${pf(e[4])} ${pf(e[5])})`
                }
                let d = 0
                  , u = 0
                  , p = 0;
                t.SVGGraphics = i = class {
                    constructor(e, t, s=!1) {
                        this.svgFactory = new n.DOMSVGFactory;
                        this.current = new SVGExtraState;
                        this.transformMatrix = r.IDENTITY_MATRIX;
                        this.transformStack = [];
                        this.extraStack = [];
                        this.commonObjs = e;
                        this.objs = t;
                        this.pendingClip = null;
                        this.pendingEOFill = !1;
                        this.embedFonts = !1;
                        this.embeddedFonts = Object.create(null);
                        this.cssStyle = null;
                        this.forceDataSchema = !!s;
                        this._operatorIdMapping = [];
                        for (const e in r.OPS)
                            this._operatorIdMapping[r.OPS[e]] = e
                    }
                    save() {
                        this.transformStack.push(this.transformMatrix);
                        const e = this.current;
                        this.extraStack.push(e);
                        this.current = e.clone()
                    }
                    restore() {
                        this.transformMatrix = this.transformStack.pop();
                        this.current = this.extraStack.pop();
                        this.pendingClip = null;
                        this.tgrp = null
                    }
                    group(e) {
                        this.save();
                        this.executeOpTree(e);
                        this.restore()
                    }
                    loadDependencies(e) {
                        const t = e.fnArray
                          , s = e.argsArray;
                        for (let e = 0, n = t.length; e < n; e++)
                            if (t[e] === r.OPS.dependency)
                                for (const t of s[e]) {
                                    const e = t.startsWith("g_") ? this.commonObjs : this.objs
                                      , s = new Promise((s=>{
                                        e.get(t, s)
                                    }
                                    ));
                                    this.current.dependencies.push(s)
                                }
                        return Promise.all(this.current.dependencies)
                    }
                    transform(e, t, s, n, a, i) {
                        const o = [e, t, s, n, a, i];
                        this.transformMatrix = r.Util.transform(this.transformMatrix, o);
                        this.tgrp = null
                    }
                    getSVG(e, t) {
                        this.viewport = t;
                        const s = this._initialize(t);
                        return this.loadDependencies(e).then((()=>{
                            this.transformMatrix = r.IDENTITY_MATRIX;
                            this.executeOpTree(this.convertOpList(e));
                            return s
                        }
                        ))
                    }
                    convertOpList(e) {
                        const t = this._operatorIdMapping
                          , s = e.argsArray
                          , r = e.fnArray
                          , n = [];
                        for (let e = 0, a = r.length; e < a; e++) {
                            const a = r[e];
                            n.push({
                                fnId: a,
                                fn: t[a],
                                args: s[e]
                            })
                        }
                        return opListToTree(n)
                    }
                    executeOpTree(e) {
                        for (const t of e) {
                            const e = t.fn
                              , s = t.fnId
                              , n = t.args;
                            switch (0 | s) {
                            case r.OPS.beginText:
                                this.beginText();
                                break;
                            case r.OPS.dependency:
                                break;
                            case r.OPS.setLeading:
                                this.setLeading(n);
                                break;
                            case r.OPS.setLeadingMoveText:
                                this.setLeadingMoveText(n[0], n[1]);
                                break;
                            case r.OPS.setFont:
                                this.setFont(n);
                                break;
                            case r.OPS.showText:
                            case r.OPS.showSpacedText:
                                this.showText(n[0]);
                                break;
                            case r.OPS.endText:
                                this.endText();
                                break;
                            case r.OPS.moveText:
                                this.moveText(n[0], n[1]);
                                break;
                            case r.OPS.setCharSpacing:
                                this.setCharSpacing(n[0]);
                                break;
                            case r.OPS.setWordSpacing:
                                this.setWordSpacing(n[0]);
                                break;
                            case r.OPS.setHScale:
                                this.setHScale(n[0]);
                                break;
                            case r.OPS.setTextMatrix:
                                this.setTextMatrix(n[0], n[1], n[2], n[3], n[4], n[5]);
                                break;
                            case r.OPS.setTextRise:
                                this.setTextRise(n[0]);
                                break;
                            case r.OPS.setTextRenderingMode:
                                this.setTextRenderingMode(n[0]);
                                break;
                            case r.OPS.setLineWidth:
                                this.setLineWidth(n[0]);
                                break;
                            case r.OPS.setLineJoin:
                                this.setLineJoin(n[0]);
                                break;
                            case r.OPS.setLineCap:
                                this.setLineCap(n[0]);
                                break;
                            case r.OPS.setMiterLimit:
                                this.setMiterLimit(n[0]);
                                break;
                            case r.OPS.setFillRGBColor:
                                this.setFillRGBColor(n[0], n[1], n[2]);
                                break;
                            case r.OPS.setStrokeRGBColor:
                                this.setStrokeRGBColor(n[0], n[1], n[2]);
                                break;
                            case r.OPS.setStrokeColorN:
                                this.setStrokeColorN(n);
                                break;
                            case r.OPS.setFillColorN:
                                this.setFillColorN(n);
                                break;
                            case r.OPS.shadingFill:
                                this.shadingFill(n[0]);
                                break;
                            case r.OPS.setDash:
                                this.setDash(n[0], n[1]);
                                break;
                            case r.OPS.setRenderingIntent:
                                this.setRenderingIntent(n[0]);
                                break;
                            case r.OPS.setFlatness:
                                this.setFlatness(n[0]);
                                break;
                            case r.OPS.setGState:
                                this.setGState(n[0]);
                                break;
                            case r.OPS.fill:
                                this.fill();
                                break;
                            case r.OPS.eoFill:
                                this.eoFill();
                                break;
                            case r.OPS.stroke:
                                this.stroke();
                                break;
                            case r.OPS.fillStroke:
                                this.fillStroke();
                                break;
                            case r.OPS.eoFillStroke:
                                this.eoFillStroke();
                                break;
                            case r.OPS.clip:
                                this.clip("nonzero");
                                break;
                            case r.OPS.eoClip:
                                this.clip("evenodd");
                                break;
                            case r.OPS.paintSolidColorImageMask:
                                this.paintSolidColorImageMask();
                                break;
                            case r.OPS.paintImageXObject:
                                this.paintImageXObject(n[0]);
                                break;
                            case r.OPS.paintInlineImageXObject:
                                this.paintInlineImageXObject(n[0]);
                                break;
                            case r.OPS.paintImageMaskXObject:
                                this.paintImageMaskXObject(n[0]);
                                break;
                            case r.OPS.paintFormXObjectBegin:
                                this.paintFormXObjectBegin(n[0], n[1]);
                                break;
                            case r.OPS.paintFormXObjectEnd:
                                this.paintFormXObjectEnd();
                                break;
                            case r.OPS.closePath:
                                this.closePath();
                                break;
                            case r.OPS.closeStroke:
                                this.closeStroke();
                                break;
                            case r.OPS.closeFillStroke:
                                this.closeFillStroke();
                                break;
                            case r.OPS.closeEOFillStroke:
                                this.closeEOFillStroke();
                                break;
                            case r.OPS.nextLine:
                                this.nextLine();
                                break;
                            case r.OPS.transform:
                                this.transform(n[0], n[1], n[2], n[3], n[4], n[5]);
                                break;
                            case r.OPS.constructPath:
                                this.constructPath(n[0], n[1]);
                                break;
                            case r.OPS.endPath:
                                this.endPath();
                                break;
                            case 92:
                                this.group(t.items);
                                break;
                            default:
                                (0,
                                r.warn)(`Unimplemented operator ${e}`)
                            }
                        }
                    }
                    setWordSpacing(e) {
                        this.current.wordSpacing = e
                    }
                    setCharSpacing(e) {
                        this.current.charSpacing = e
                    }
                    nextLine() {
                        this.moveText(0, this.current.leading)
                    }
                    setTextMatrix(e, t, s, r, n, a) {
                        const i = this.current;
                        i.textMatrix = i.lineMatrix = [e, t, s, r, n, a];
                        i.textMatrixScale = Math.hypot(e, t);
                        i.x = i.lineX = 0;
                        i.y = i.lineY = 0;
                        i.xcoords = [];
                        i.ycoords = [];
                        i.tspan = this.svgFactory.createElement("svg:tspan");
                        i.tspan.setAttributeNS(null, "font-family", i.fontFamily);
                        i.tspan.setAttributeNS(null, "font-size", `${pf(i.fontSize)}px`);
                        i.tspan.setAttributeNS(null, "y", pf(-i.y));
                        i.txtElement = this.svgFactory.createElement("svg:text");
                        i.txtElement.appendChild(i.tspan)
                    }
                    beginText() {
                        const e = this.current;
                        e.x = e.lineX = 0;
                        e.y = e.lineY = 0;
                        e.textMatrix = r.IDENTITY_MATRIX;
                        e.lineMatrix = r.IDENTITY_MATRIX;
                        e.textMatrixScale = 1;
                        e.tspan = this.svgFactory.createElement("svg:tspan");
                        e.txtElement = this.svgFactory.createElement("svg:text");
                        e.txtgrp = this.svgFactory.createElement("svg:g");
                        e.xcoords = [];
                        e.ycoords = []
                    }
                    moveText(e, t) {
                        const s = this.current;
                        s.x = s.lineX += e;
                        s.y = s.lineY += t;
                        s.xcoords = [];
                        s.ycoords = [];
                        s.tspan = this.svgFactory.createElement("svg:tspan");
                        s.tspan.setAttributeNS(null, "font-family", s.fontFamily);
                        s.tspan.setAttributeNS(null, "font-size", `${pf(s.fontSize)}px`);
                        s.tspan.setAttributeNS(null, "y", pf(-s.y))
                    }
                    showText(t) {
                        const n = this.current
                          , a = n.font
                          , i = n.fontSize;
                        if (0 === i)
                            return;
                        const o = n.fontSizeScale
                          , l = n.charSpacing
                          , c = n.wordSpacing
                          , h = n.fontDirection
                          , d = n.textHScale * h
                          , u = a.vertical
                          , p = u ? 1 : -1
                          , g = a.defaultVMetrics
                          , f = i * n.fontMatrix[0];
                        let m = 0;
                        for (const e of t) {
                            if (null === e) {
                                m += h * c;
                                continue
                            }
                            if ((0,
                            r.isNum)(e)) {
                                m += p * e * i / 1e3;
                                continue
                            }
                            const t = (e.isSpace ? c : 0) + l
                              , s = e.fontChar;
                            let d, _, A, b = e.width;
                            if (u) {
                                let t;
                                const s = e.vmetric || g;
                                t = e.vmetric ? s[1] : .5 * b;
                                t = -t * f;
                                const r = s[2] * f;
                                b = s ? -s[0] : b;
                                d = t / o;
                                _ = (m + r) / o
                            } else {
                                d = m / o;
                                _ = 0
                            }
                            if (e.isInFont || a.missingFile) {
                                n.xcoords.push(n.x + d);
                                u && n.ycoords.push(-n.y + _);
                                n.tspan.textContent += s
                            }
                            A = u ? b * f - t * h : b * f + t * h;
                            m += A
                        }
                        n.tspan.setAttributeNS(null, "x", n.xcoords.map(pf).join(" "));
                        u ? n.tspan.setAttributeNS(null, "y", n.ycoords.map(pf).join(" ")) : n.tspan.setAttributeNS(null, "y", pf(-n.y));
                        u ? n.y -= m : n.x += m * d;
                        n.tspan.setAttributeNS(null, "font-family", n.fontFamily);
                        n.tspan.setAttributeNS(null, "font-size", `${pf(n.fontSize)}px`);
                        n.fontStyle !== e.fontStyle && n.tspan.setAttributeNS(null, "font-style", n.fontStyle);
                        n.fontWeight !== e.fontWeight && n.tspan.setAttributeNS(null, "font-weight", n.fontWeight);
                        const _ = n.textRenderingMode & r.TextRenderingMode.FILL_STROKE_MASK;
                        if (_ === r.TextRenderingMode.FILL || _ === r.TextRenderingMode.FILL_STROKE) {
                            n.fillColor !== e.fillColor && n.tspan.setAttributeNS(null, "fill", n.fillColor);
                            n.fillAlpha < 1 && n.tspan.setAttributeNS(null, "fill-opacity", n.fillAlpha)
                        } else
                            n.textRenderingMode === r.TextRenderingMode.ADD_TO_PATH ? n.tspan.setAttributeNS(null, "fill", "transparent") : n.tspan.setAttributeNS(null, "fill", "none");
                        if (_ === r.TextRenderingMode.STROKE || _ === r.TextRenderingMode.FILL_STROKE) {
                            const e = 1 / (n.textMatrixScale || 1);
                            this._setStrokeAttributes(n.tspan, e)
                        }
                        let A = n.textMatrix;
                        if (0 !== n.textRise) {
                            A = A.slice();
                            A[5] += n.textRise
                        }
                        n.txtElement.setAttributeNS(null, "transform", `${pm(A)} scale(${pf(d)}, -1)`);
                        n.txtElement.setAttributeNS(s, "xml:space", "preserve");
                        n.txtElement.appendChild(n.tspan);
                        n.txtgrp.appendChild(n.txtElement);
                        this._ensureTransformGroup().appendChild(n.txtElement)
                    }
                    setLeadingMoveText(e, t) {
                        this.setLeading(-t);
                        this.moveText(e, t)
                    }
                    addFontStyle(e) {
                        if (!e.data)
                            throw new Error('addFontStyle: No font data available, ensure that the "fontExtraProperties" API parameter is set.');
                        if (!this.cssStyle) {
                            this.cssStyle = this.svgFactory.createElement("svg:style");
                            this.cssStyle.setAttributeNS(null, "type", "text/css");
                            this.defs.appendChild(this.cssStyle)
                        }
                        const t = (0,
                        r.createObjectURL)(e.data, e.mimetype, this.forceDataSchema);
                        this.cssStyle.textContent += `@font-face { font-family: "${e.loadedName}"; src: url(${t}); }\n`
                    }
                    setFont(e) {
                        const t = this.current
                          , s = this.commonObjs.get(e[0]);
                        let n = e[1];
                        t.font = s;
                        if (this.embedFonts && !s.missingFile && !this.embeddedFonts[s.loadedName]) {
                            this.addFontStyle(s);
                            this.embeddedFonts[s.loadedName] = s
                        }
                        t.fontMatrix = s.fontMatrix || r.FONT_IDENTITY_MATRIX;
                        let a = "normal";
                        s.black ? a = "900" : s.bold && (a = "bold");
                        const i = s.italic ? "italic" : "normal";
                        if (n < 0) {
                            n = -n;
                            t.fontDirection = -1
                        } else
                            t.fontDirection = 1;
                        t.fontSize = n;
                        t.fontFamily = s.loadedName;
                        t.fontWeight = a;
                        t.fontStyle = i;
                        t.tspan = this.svgFactory.createElement("svg:tspan");
                        t.tspan.setAttributeNS(null, "y", pf(-t.y));
                        t.xcoords = [];
                        t.ycoords = []
                    }
                    endText() {
                        const e = this.current;
                        if (e.textRenderingMode & r.TextRenderingMode.ADD_TO_PATH_FLAG && e.txtElement?.hasChildNodes()) {
                            e.element = e.txtElement;
                            this.clip("nonzero");
                            this.endPath()
                        }
                    }
                    setLineWidth(e) {
                        e > 0 && (this.current.lineWidth = e)
                    }
                    setLineCap(e) {
                        this.current.lineCap = l[e]
                    }
                    setLineJoin(e) {
                        this.current.lineJoin = c[e]
                    }
                    setMiterLimit(e) {
                        this.current.miterLimit = e
                    }
                    setStrokeAlpha(e) {
                        this.current.strokeAlpha = e
                    }
                    setStrokeRGBColor(e, t, s) {
                        this.current.strokeColor = r.Util.makeHexColor(e, t, s)
                    }
                    setFillAlpha(e) {
                        this.current.fillAlpha = e
                    }
                    setFillRGBColor(e, t, s) {
                        this.current.fillColor = r.Util.makeHexColor(e, t, s);
                        this.current.tspan = this.svgFactory.createElement("svg:tspan");
                        this.current.xcoords = [];
                        this.current.ycoords = []
                    }
                    setStrokeColorN(e) {
                        this.current.strokeColor = this._makeColorN_Pattern(e)
                    }
                    setFillColorN(e) {
                        this.current.fillColor = this._makeColorN_Pattern(e)
                    }
                    shadingFill(e) {
                        const t = this.viewport.width
                          , s = this.viewport.height
                          , n = r.Util.inverseTransform(this.transformMatrix)
                          , a = r.Util.applyTransform([0, 0], n)
                          , i = r.Util.applyTransform([0, s], n)
                          , o = r.Util.applyTransform([t, 0], n)
                          , l = r.Util.applyTransform([t, s], n)
                          , c = Math.min(a[0], i[0], o[0], l[0])
                          , h = Math.min(a[1], i[1], o[1], l[1])
                          , d = Math.max(a[0], i[0], o[0], l[0])
                          , u = Math.max(a[1], i[1], o[1], l[1])
                          , p = this.svgFactory.createElement("svg:rect");
                        p.setAttributeNS(null, "x", c);
                        p.setAttributeNS(null, "y", h);
                        p.setAttributeNS(null, "width", d - c);
                        p.setAttributeNS(null, "height", u - h);
                        p.setAttributeNS(null, "fill", this._makeShadingPattern(e));
                        this.current.fillAlpha < 1 && p.setAttributeNS(null, "fill-opacity", this.current.fillAlpha);
                        this._ensureTransformGroup().appendChild(p)
                    }
                    _makeColorN_Pattern(e) {
                        return "TilingPattern" === e[0] ? this._makeTilingPattern(e) : this._makeShadingPattern(e)
                    }
                    _makeTilingPattern(e) {
                        const t = e[1]
                          , s = e[2]
                          , n = e[3] || r.IDENTITY_MATRIX
                          , [a,i,o,l] = e[4]
                          , c = e[5]
                          , h = e[6]
                          , d = e[7]
                          , u = "shading" + p++
                          , [g,f,m,_] = r.Util.normalizeRect([...r.Util.applyTransform([a, i], n), ...r.Util.applyTransform([o, l], n)])
                          , [A,b] = r.Util.singularValueDecompose2dScale(n)
                          , y = c * A
                          , S = h * b
                          , x = this.svgFactory.createElement("svg:pattern");
                        x.setAttributeNS(null, "id", u);
                        x.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
                        x.setAttributeNS(null, "width", y);
                        x.setAttributeNS(null, "height", S);
                        x.setAttributeNS(null, "x", `${g}`);
                        x.setAttributeNS(null, "y", `${f}`);
                        const v = this.svg
                          , C = this.transformMatrix
                          , P = this.current.fillColor
                          , k = this.current.strokeColor
                          , w = this.svgFactory.create(m - g, _ - f);
                        this.svg = w;
                        this.transformMatrix = n;
                        if (2 === d) {
                            const e = r.Util.makeHexColor(...t);
                            this.current.fillColor = e;
                            this.current.strokeColor = e
                        }
                        this.executeOpTree(this.convertOpList(s));
                        this.svg = v;
                        this.transformMatrix = C;
                        this.current.fillColor = P;
                        this.current.strokeColor = k;
                        x.appendChild(w.childNodes[0]);
                        this.defs.appendChild(x);
                        return `url(#${u})`
                    }
                    _makeShadingPattern(e) {
                        switch (e[0]) {
                        case "RadialAxial":
                            const t = "shading" + p++
                              , s = e[3];
                            let n;
                            switch (e[1]) {
                            case "axial":
                                const s = e[4]
                                  , r = e[5];
                                n = this.svgFactory.createElement("svg:linearGradient");
                                n.setAttributeNS(null, "id", t);
                                n.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
                                n.setAttributeNS(null, "x1", s[0]);
                                n.setAttributeNS(null, "y1", s[1]);
                                n.setAttributeNS(null, "x2", r[0]);
                                n.setAttributeNS(null, "y2", r[1]);
                                break;
                            case "radial":
                                const a = e[4]
                                  , i = e[5]
                                  , o = e[6]
                                  , l = e[7];
                                n = this.svgFactory.createElement("svg:radialGradient");
                                n.setAttributeNS(null, "id", t);
                                n.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
                                n.setAttributeNS(null, "cx", i[0]);
                                n.setAttributeNS(null, "cy", i[1]);
                                n.setAttributeNS(null, "r", l);
                                n.setAttributeNS(null, "fx", a[0]);
                                n.setAttributeNS(null, "fy", a[1]);
                                n.setAttributeNS(null, "fr", o);
                                break;
                            default:
                                throw new Error(`Unknown RadialAxial type: ${e[1]}`)
                            }
                            for (const e of s) {
                                const t = this.svgFactory.createElement("svg:stop");
                                t.setAttributeNS(null, "offset", e[0]);
                                t.setAttributeNS(null, "stop-color", e[1]);
                                n.appendChild(t)
                            }
                            this.defs.appendChild(n);
                            return `url(#${t})`;
                        case "Mesh":
                            (0,
                            r.warn)("Unimplemented pattern Mesh");
                            return null;
                        case "Dummy":
                            return "hotpink";
                        default:
                            throw new Error(`Unknown IR type: ${e[0]}`)
                        }
                    }
                    setDash(e, t) {
                        this.current.dashArray = e;
                        this.current.dashPhase = t
                    }
                    constructPath(e, t) {
                        const s = this.current;
                        let n = s.x
                          , a = s.y
                          , i = []
                          , o = 0;
                        for (const s of e)
                            switch (0 | s) {
                            case r.OPS.rectangle:
                                n = t[o++];
                                a = t[o++];
                                const e = n + t[o++]
                                  , s = a + t[o++];
                                i.push("M", pf(n), pf(a), "L", pf(e), pf(a), "L", pf(e), pf(s), "L", pf(n), pf(s), "Z");
                                break;
                            case r.OPS.moveTo:
                                n = t[o++];
                                a = t[o++];
                                i.push("M", pf(n), pf(a));
                                break;
                            case r.OPS.lineTo:
                                n = t[o++];
                                a = t[o++];
                                i.push("L", pf(n), pf(a));
                                break;
                            case r.OPS.curveTo:
                                n = t[o + 4];
                                a = t[o + 5];
                                i.push("C", pf(t[o]), pf(t[o + 1]), pf(t[o + 2]), pf(t[o + 3]), pf(n), pf(a));
                                o += 6;
                                break;
                            case r.OPS.curveTo2:
                                i.push("C", pf(n), pf(a), pf(t[o]), pf(t[o + 1]), pf(t[o + 2]), pf(t[o + 3]));
                                n = t[o + 2];
                                a = t[o + 3];
                                o += 4;
                                break;
                            case r.OPS.curveTo3:
                                n = t[o + 2];
                                a = t[o + 3];
                                i.push("C", pf(t[o]), pf(t[o + 1]), pf(n), pf(a), pf(n), pf(a));
                                o += 4;
                                break;
                            case r.OPS.closePath:
                                i.push("Z")
                            }
                        i = i.join(" ");
                        if (s.path && e.length > 0 && e[0] !== r.OPS.rectangle && e[0] !== r.OPS.moveTo)
                            i = s.path.getAttributeNS(null, "d") + i;
                        else {
                            s.path = this.svgFactory.createElement("svg:path");
                            this._ensureTransformGroup().appendChild(s.path)
                        }
                        s.path.setAttributeNS(null, "d", i);
                        s.path.setAttributeNS(null, "fill", "none");
                        s.element = s.path;
                        s.setCurrentPoint(n, a)
                    }
                    endPath() {
                        const e = this.current;
                        e.path = null;
                        if (!this.pendingClip)
                            return;
                        if (!e.element) {
                            this.pendingClip = null;
                            return
                        }
                        const t = "clippath" + d++
                          , s = this.svgFactory.createElement("svg:clipPath");
                        s.setAttributeNS(null, "id", t);
                        s.setAttributeNS(null, "transform", pm(this.transformMatrix));
                        const r = e.element.cloneNode(!0);
                        "evenodd" === this.pendingClip ? r.setAttributeNS(null, "clip-rule", "evenodd") : r.setAttributeNS(null, "clip-rule", "nonzero");
                        this.pendingClip = null;
                        s.appendChild(r);
                        this.defs.appendChild(s);
                        if (e.activeClipUrl) {
                            e.clipGroup = null;
                            for (const e of this.extraStack)
                                e.clipGroup = null;
                            s.setAttributeNS(null, "clip-path", e.activeClipUrl)
                        }
                        e.activeClipUrl = `url(#${t})`;
                        this.tgrp = null
                    }
                    clip(e) {
                        this.pendingClip = e
                    }
                    closePath() {
                        const e = this.current;
                        if (e.path) {
                            const t = `${e.path.getAttributeNS(null, "d")}Z`;
                            e.path.setAttributeNS(null, "d", t)
                        }
                    }
                    setLeading(e) {
                        this.current.leading = -e
                    }
                    setTextRise(e) {
                        this.current.textRise = e
                    }
                    setTextRenderingMode(e) {
                        this.current.textRenderingMode = e
                    }
                    setHScale(e) {
                        this.current.textHScale = e / 100
                    }
                    setRenderingIntent(e) {}
                    setFlatness(e) {}
                    setGState(e) {
                        for (const [t,s] of e)
                            switch (t) {
                            case "LW":
                                this.setLineWidth(s);
                                break;
                            case "LC":
                                this.setLineCap(s);
                                break;
                            case "LJ":
                                this.setLineJoin(s);
                                break;
                            case "ML":
                                this.setMiterLimit(s);
                                break;
                            case "D":
                                this.setDash(s[0], s[1]);
                                break;
                            case "RI":
                                this.setRenderingIntent(s);
                                break;
                            case "FL":
                                this.setFlatness(s);
                                break;
                            case "Font":
                                this.setFont(s);
                                break;
                            case "CA":
                                this.setStrokeAlpha(s);
                                break;
                            case "ca":
                                this.setFillAlpha(s);
                                break;
                            default:
                                (0,
                                r.warn)(`Unimplemented graphic state operator ${t}`)
                            }
                    }
                    fill() {
                        const e = this.current;
                        if (e.element) {
                            e.element.setAttributeNS(null, "fill", e.fillColor);
                            e.element.setAttributeNS(null, "fill-opacity", e.fillAlpha);
                            this.endPath()
                        }
                    }
                    stroke() {
                        const e = this.current;
                        if (e.element) {
                            this._setStrokeAttributes(e.element);
                            e.element.setAttributeNS(null, "fill", "none");
                            this.endPath()
                        }
                    }
                    _setStrokeAttributes(e, t=1) {
                        const s = this.current;
                        let r = s.dashArray;
                        1 !== t && r.length > 0 && (r = r.map((function(e) {
                            return t * e
                        }
                        )));
                        e.setAttributeNS(null, "stroke", s.strokeColor);
                        e.setAttributeNS(null, "stroke-opacity", s.strokeAlpha);
                        e.setAttributeNS(null, "stroke-miterlimit", pf(s.miterLimit));
                        e.setAttributeNS(null, "stroke-linecap", s.lineCap);
                        e.setAttributeNS(null, "stroke-linejoin", s.lineJoin);
                        e.setAttributeNS(null, "stroke-width", pf(t * s.lineWidth) + "px");
                        e.setAttributeNS(null, "stroke-dasharray", r.map(pf).join(" "));
                        e.setAttributeNS(null, "stroke-dashoffset", pf(t * s.dashPhase) + "px")
                    }
                    eoFill() {
                        this.current.element && this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
                        this.fill()
                    }
                    fillStroke() {
                        this.stroke();
                        this.fill()
                    }
                    eoFillStroke() {
                        this.current.element && this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
                        this.fillStroke()
                    }
                    closeStroke() {
                        this.closePath();
                        this.stroke()
                    }
                    closeFillStroke() {
                        this.closePath();
                        this.fillStroke()
                    }
                    closeEOFillStroke() {
                        this.closePath();
                        this.eoFillStroke()
                    }
                    paintSolidColorImageMask() {
                        const e = this.svgFactory.createElement("svg:rect");
                        e.setAttributeNS(null, "x", "0");
                        e.setAttributeNS(null, "y", "0");
                        e.setAttributeNS(null, "width", "1px");
                        e.setAttributeNS(null, "height", "1px");
                        e.setAttributeNS(null, "fill", this.current.fillColor);
                        this._ensureTransformGroup().appendChild(e)
                    }
                    paintImageXObject(e) {
                        const t = e.startsWith("g_") ? this.commonObjs.get(e) : this.objs.get(e);
                        t ? this.paintInlineImageXObject(t) : (0,
                        r.warn)(`Dependent image with object ID ${e} is not ready yet`)
                    }
                    paintInlineImageXObject(e, t) {
                        const s = e.width
                          , r = e.height
                          , n = h(e, this.forceDataSchema, !!t)
                          , a = this.svgFactory.createElement("svg:rect");
                        a.setAttributeNS(null, "x", "0");
                        a.setAttributeNS(null, "y", "0");
                        a.setAttributeNS(null, "width", pf(s));
                        a.setAttributeNS(null, "height", pf(r));
                        this.current.element = a;
                        this.clip("nonzero");
                        const i = this.svgFactory.createElement("svg:image");
                        i.setAttributeNS(o, "xlink:href", n);
                        i.setAttributeNS(null, "x", "0");
                        i.setAttributeNS(null, "y", pf(-r));
                        i.setAttributeNS(null, "width", pf(s) + "px");
                        i.setAttributeNS(null, "height", pf(r) + "px");
                        i.setAttributeNS(null, "transform", `scale(${pf(1 / s)} ${pf(-1 / r)})`);
                        t ? t.appendChild(i) : this._ensureTransformGroup().appendChild(i)
                    }
                    paintImageMaskXObject(e) {
                        const t = this.current
                          , s = e.width
                          , r = e.height
                          , n = t.fillColor;
                        t.maskId = "mask" + u++;
                        const a = this.svgFactory.createElement("svg:mask");
                        a.setAttributeNS(null, "id", t.maskId);
                        const i = this.svgFactory.createElement("svg:rect");
                        i.setAttributeNS(null, "x", "0");
                        i.setAttributeNS(null, "y", "0");
                        i.setAttributeNS(null, "width", pf(s));
                        i.setAttributeNS(null, "height", pf(r));
                        i.setAttributeNS(null, "fill", n);
                        i.setAttributeNS(null, "mask", `url(#${t.maskId})`);
                        this.defs.appendChild(a);
                        this._ensureTransformGroup().appendChild(i);
                        this.paintInlineImageXObject(e, a)
                    }
                    paintFormXObjectBegin(e, t) {
                        Array.isArray(e) && 6 === e.length && this.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
                        if (t) {
                            const e = t[2] - t[0]
                              , s = t[3] - t[1]
                              , r = this.svgFactory.createElement("svg:rect");
                            r.setAttributeNS(null, "x", t[0]);
                            r.setAttributeNS(null, "y", t[1]);
                            r.setAttributeNS(null, "width", pf(e));
                            r.setAttributeNS(null, "height", pf(s));
                            this.current.element = r;
                            this.clip("nonzero");
                            this.endPath()
                        }
                    }
                    paintFormXObjectEnd() {}
                    _initialize(e) {
                        const t = this.svgFactory.create(e.width, e.height)
                          , s = this.svgFactory.createElement("svg:defs");
                        t.appendChild(s);
                        this.defs = s;
                        const r = this.svgFactory.createElement("svg:g");
                        r.setAttributeNS(null, "transform", pm(e.transform));
                        t.appendChild(r);
                        this.svg = r;
                        return t
                    }
                    _ensureClipGroup() {
                        if (!this.current.clipGroup) {
                            const e = this.svgFactory.createElement("svg:g");
                            e.setAttributeNS(null, "clip-path", this.current.activeClipUrl);
                            this.svg.appendChild(e);
                            this.current.clipGroup = e
                        }
                        return this.current.clipGroup
                    }
                    _ensureTransformGroup() {
                        if (!this.tgrp) {
                            this.tgrp = this.svgFactory.createElement("svg:g");
                            this.tgrp.setAttributeNS(null, "transform", pm(this.transformMatrix));
                            this.current.activeClipUrl ? this._ensureClipGroup().appendChild(this.tgrp) : this.svg.appendChild(this.tgrp)
                        }
                        return this.tgrp
                    }
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.XfaLayer = void 0;
            var r = s(2)
              , n = s(17);
            t.XfaLayer = class XfaLayer {
                static setupStorage(e, t, s, r, n) {
                    const a = r.getValue(t, {
                        value: null
                    });
                    switch (s.name) {
                    case "textarea":
                        null !== a.value && (e.textContent = a.value);
                        if ("print" === n)
                            break;
                        e.addEventListener("input", (e=>{
                            r.setValue(t, {
                                value: e.target.value
                            })
                        }
                        ));
                        break;
                    case "input":
                        if ("radio" === s.attributes.type || "checkbox" === s.attributes.type) {
                            a.value === s.attributes.xfaOn ? e.setAttribute("checked", !0) : a.value === s.attributes.xfaOff && e.removeAttribute("checked");
                            if ("print" === n)
                                break;
                            e.addEventListener("change", (e=>{
                                r.setValue(t, {
                                    value: e.target.checked ? e.target.getAttribute("xfaOn") : e.target.getAttribute("xfaOff")
                                })
                            }
                            ))
                        } else {
                            null !== a.value && e.setAttribute("value", a.value);
                            if ("print" === n)
                                break;
                            e.addEventListener("input", (e=>{
                                r.setValue(t, {
                                    value: e.target.value
                                })
                            }
                            ))
                        }
                        break;
                    case "select":
                        if (null !== a.value)
                            for (const e of s.children)
                                e.attributes.value === a.value && (e.attributes.selected = !0);
                        e.addEventListener("input", (e=>{
                            const s = e.target.options
                              , n = -1 === s.selectedIndex ? "" : s[s.selectedIndex].value;
                            r.setValue(t, {
                                value: n
                            })
                        }
                        ))
                    }
                }
                static setAttributes({html: e, element: t, storage: s=null, intent: n, linkService: a}) {
                    const {attributes: i} = t
                      , o = e instanceof HTMLAnchorElement;
                    "radio" === i.type && (i.name = `${i.name}-${n}`);
                    for (const [t,s] of Object.entries(i))
                        if (null != s && "dataId" !== t)
                            if ("style" !== t)
                                if ("textContent" === t)
                                    e.textContent = s;
                                else if ("class" === t)
                                    e.setAttribute(t, s.join(" "));
                                else {
                                    if (o && ("href" === t || "newWindow" === t))
                                        continue;
                                    e.setAttribute(t, s)
                                }
                            else
                                Object.assign(e.style, s);
                    if (o) {
                        a.addLinkAttributes || (0,
                        r.warn)("XfaLayer.setAttribute - missing `addLinkAttributes`-method on the `linkService`-instance.");
                        a.addLinkAttributes?.(e, i.href, i.newWindow)
                    }
                    s && i.dataId && this.setupStorage(e, i.dataId, t, s)
                }
                static render(e) {
                    const t = e.annotationStorage
                      , s = e.linkService
                      , r = e.xfa
                      , a = e.intent || "display"
                      , i = document.createElement(r.name);
                    r.attributes && this.setAttributes({
                        html: i,
                        element: r,
                        intent: a,
                        linkService: s
                    });
                    const o = [[r, -1, i]]
                      , l = e.div;
                    l.appendChild(i);
                    const c = `matrix(${e.viewport.transform.join(",")})`;
                    l.style.transform = c;
                    l.setAttribute("class", "xfaLayer xfaFont");
                    const h = [];
                    for (; o.length > 0; ) {
                        const [e,r,i] = o[o.length - 1];
                        if (r + 1 === e.children.length) {
                            o.pop();
                            continue
                        }
                        const l = e.children[++o[o.length - 1][1]];
                        if (null === l)
                            continue;
                        const {name: c} = l;
                        if ("#text" === c) {
                            const e = document.createTextNode(l.value);
                            h.push(e);
                            i.appendChild(e);
                            continue
                        }
                        let d;
                        d = l?.attributes?.xmlns ? document.createElementNS(l.attributes.xmlns, c) : document.createElement(c);
                        i.appendChild(d);
                        l.attributes && this.setAttributes({
                            html: d,
                            element: l,
                            storage: t,
                            intent: a,
                            linkService: s
                        });
                        if (l.children && l.children.length > 0)
                            o.push([l, -1, d]);
                        else if (l.value) {
                            const e = document.createTextNode(l.value);
                            n.XfaText.shouldBuildText(c) && h.push(e);
                            d.appendChild(e)
                        }
                    }
                    for (const e of l.querySelectorAll(".xfaNonInteractive input, .xfaNonInteractive textarea"))
                        e.setAttribute("readOnly", !0);
                    return {
                        textDivs: h
                    }
                }
                static update(e) {
                    const t = `matrix(${e.viewport.transform.join(",")})`;
                    e.div.style.transform = t;
                    e.div.hidden = !1
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.PDFNodeStream = void 0;
            var r = s(2)
              , n = s(24);
            const a = require("fs")
              , i = require("http")
              , o = require("https")
              , l = require("url")
              , c = /^file:\/\/\/[a-zA-Z]:\//;
            t.PDFNodeStream = class PDFNodeStream {
                constructor(e) {
                    this.source = e;
                    this.url = function parseUrl(e) {
                        const t = l.parse(e);
                        if ("file:" === t.protocol || t.host)
                            return t;
                        if (/^[a-z]:[/\\]/i.test(e))
                            return l.parse(`file:///${e}`);
                        t.host || (t.protocol = "file:");
                        return t
                    }(e.url);
                    this.isHttp = "http:" === this.url.protocol || "https:" === this.url.protocol;
                    this.isFsUrl = "file:" === this.url.protocol;
                    this.httpHeaders = this.isHttp && e.httpHeaders || {};
                    this._fullRequestReader = null;
                    this._rangeRequestReaders = []
                }
                get _progressiveDataLength() {
                    return this._fullRequestReader?._loaded ?? 0
                }
                getFullReader() {
                    (0,
                    r.assert)(!this._fullRequestReader, "PDFNodeStream.getFullReader can only be called once.");
                    this._fullRequestReader = this.isFsUrl ? new PDFNodeStreamFsFullReader(this) : new PDFNodeStreamFullReader(this);
                    return this._fullRequestReader
                }
                getRangeReader(e, t) {
                    if (t <= this._progressiveDataLength)
                        return null;
                    const s = this.isFsUrl ? new PDFNodeStreamFsRangeReader(this,e,t) : new PDFNodeStreamRangeReader(this,e,t);
                    this._rangeRequestReaders.push(s);
                    return s
                }
                cancelAllRequests(e) {
                    this._fullRequestReader && this._fullRequestReader.cancel(e);
                    for (const t of this._rangeRequestReaders.slice(0))
                        t.cancel(e)
                }
            }
            ;
            class BaseFullReader {
                constructor(e) {
                    this._url = e.url;
                    this._done = !1;
                    this._storedError = null;
                    this.onProgress = null;
                    const t = e.source;
                    this._contentLength = t.length;
                    this._loaded = 0;
                    this._filename = null;
                    this._disableRange = t.disableRange || !1;
                    this._rangeChunkSize = t.rangeChunkSize;
                    this._rangeChunkSize || this._disableRange || (this._disableRange = !0);
                    this._isStreamingSupported = !t.disableStream;
                    this._isRangeSupported = !t.disableRange;
                    this._readableStream = null;
                    this._readCapability = (0,
                    r.createPromiseCapability)();
                    this._headersCapability = (0,
                    r.createPromiseCapability)()
                }
                get headersReady() {
                    return this._headersCapability.promise
                }
                get filename() {
                    return this._filename
                }
                get contentLength() {
                    return this._contentLength
                }
                get isRangeSupported() {
                    return this._isRangeSupported
                }
                get isStreamingSupported() {
                    return this._isStreamingSupported
                }
                async read() {
                    await this._readCapability.promise;
                    if (this._done)
                        return {
                            value: void 0,
                            done: !0
                        };
                    if (this._storedError)
                        throw this._storedError;
                    const e = this._readableStream.read();
                    if (null === e) {
                        this._readCapability = (0,
                        r.createPromiseCapability)();
                        return this.read()
                    }
                    this._loaded += e.length;
                    this.onProgress && this.onProgress({
                        loaded: this._loaded,
                        total: this._contentLength
                    });
                    return {
                        value: new Uint8Array(e).buffer,
                        done: !1
                    }
                }
                cancel(e) {
                    this._readableStream ? this._readableStream.destroy(e) : this._error(e)
                }
                _error(e) {
                    this._storedError = e;
                    this._readCapability.resolve()
                }
                _setReadableStream(e) {
                    this._readableStream = e;
                    e.on("readable", (()=>{
                        this._readCapability.resolve()
                    }
                    ));
                    e.on("end", (()=>{
                        e.destroy();
                        this._done = !0;
                        this._readCapability.resolve()
                    }
                    ));
                    e.on("error", (e=>{
                        this._error(e)
                    }
                    ));
                    !this._isStreamingSupported && this._isRangeSupported && this._error(new r.AbortException("streaming is disabled"));
                    this._storedError && this._readableStream.destroy(this._storedError)
                }
            }
            class BaseRangeReader {
                constructor(e) {
                    this._url = e.url;
                    this._done = !1;
                    this._storedError = null;
                    this.onProgress = null;
                    this._loaded = 0;
                    this._readableStream = null;
                    this._readCapability = (0,
                    r.createPromiseCapability)();
                    const t = e.source;
                    this._isStreamingSupported = !t.disableStream
                }
                get isStreamingSupported() {
                    return this._isStreamingSupported
                }
                async read() {
                    await this._readCapability.promise;
                    if (this._done)
                        return {
                            value: void 0,
                            done: !0
                        };
                    if (this._storedError)
                        throw this._storedError;
                    const e = this._readableStream.read();
                    if (null === e) {
                        this._readCapability = (0,
                        r.createPromiseCapability)();
                        return this.read()
                    }
                    this._loaded += e.length;
                    this.onProgress && this.onProgress({
                        loaded: this._loaded
                    });
                    return {
                        value: new Uint8Array(e).buffer,
                        done: !1
                    }
                }
                cancel(e) {
                    this._readableStream ? this._readableStream.destroy(e) : this._error(e)
                }
                _error(e) {
                    this._storedError = e;
                    this._readCapability.resolve()
                }
                _setReadableStream(e) {
                    this._readableStream = e;
                    e.on("readable", (()=>{
                        this._readCapability.resolve()
                    }
                    ));
                    e.on("end", (()=>{
                        e.destroy();
                        this._done = !0;
                        this._readCapability.resolve()
                    }
                    ));
                    e.on("error", (e=>{
                        this._error(e)
                    }
                    ));
                    this._storedError && this._readableStream.destroy(this._storedError)
                }
            }
            function createRequestOptions(e, t) {
                return {
                    protocol: e.protocol,
                    auth: e.auth,
                    host: e.hostname,
                    port: e.port,
                    path: e.path,
                    method: "GET",
                    headers: t
                }
            }
            class PDFNodeStreamFullReader extends BaseFullReader {
                constructor(e) {
                    super(e);
                    const handleResponse = t=>{
                        if (404 === t.statusCode) {
                            const e = new r.MissingPDFException(`Missing PDF "${this._url}".`);
                            this._storedError = e;
                            this._headersCapability.reject(e);
                            return
                        }
                        this._headersCapability.resolve();
                        this._setReadableStream(t);
                        const getResponseHeader = e=>this._readableStream.headers[e.toLowerCase()]
                          , {allowRangeRequests: s, suggestedLength: a} = (0,
                        n.validateRangeRequestCapabilities)({
                            getResponseHeader: getResponseHeader,
                            isHttp: e.isHttp,
                            rangeChunkSize: this._rangeChunkSize,
                            disableRange: this._disableRange
                        });
                        this._isRangeSupported = s;
                        this._contentLength = a || this._contentLength;
                        this._filename = (0,
                        n.extractFilenameFromHeader)(getResponseHeader)
                    }
                    ;
                    this._request = null;
                    "http:" === this._url.protocol ? this._request = i.request(createRequestOptions(this._url, e.httpHeaders), handleResponse) : this._request = o.request(createRequestOptions(this._url, e.httpHeaders), handleResponse);
                    this._request.on("error", (e=>{
                        this._storedError = e;
                        this._headersCapability.reject(e)
                    }
                    ));
                    this._request.end()
                }
            }
            class PDFNodeStreamRangeReader extends BaseRangeReader {
                constructor(e, t, s) {
                    super(e);
                    this._httpHeaders = {};
                    for (const t in e.httpHeaders) {
                        const s = e.httpHeaders[t];
                        void 0 !== s && (this._httpHeaders[t] = s)
                    }
                    this._httpHeaders.Range = `bytes=${t}-${s - 1}`;
                    const handleResponse = e=>{
                        if (404 !== e.statusCode)
                            this._setReadableStream(e);
                        else {
                            const e = new r.MissingPDFException(`Missing PDF "${this._url}".`);
                            this._storedError = e
                        }
                    }
                    ;
                    this._request = null;
                    "http:" === this._url.protocol ? this._request = i.request(createRequestOptions(this._url, this._httpHeaders), handleResponse) : this._request = o.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
                    this._request.on("error", (e=>{
                        this._storedError = e
                    }
                    ));
                    this._request.end()
                }
            }
            class PDFNodeStreamFsFullReader extends BaseFullReader {
                constructor(e) {
                    super(e);
                    let t = decodeURIComponent(this._url.path);
                    c.test(this._url.href) && (t = t.replace(/^\//, ""));
                    a.lstat(t, ((e,s)=>{
                        if (e) {
                            "ENOENT" === e.code && (e = new r.MissingPDFException(`Missing PDF "${t}".`));
                            this._storedError = e;
                            this._headersCapability.reject(e)
                        } else {
                            this._contentLength = s.size;
                            this._setReadableStream(a.createReadStream(t));
                            this._headersCapability.resolve()
                        }
                    }
                    ))
                }
            }
            class PDFNodeStreamFsRangeReader extends BaseRangeReader {
                constructor(e, t, s) {
                    super(e);
                    let r = decodeURIComponent(this._url.path);
                    c.test(this._url.href) && (r = r.replace(/^\//, ""));
                    this._setReadableStream(a.createReadStream(r, {
                        start: t,
                        end: s - 1
                    }))
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.createResponseStatusError = function createResponseStatusError(e, t) {
                if (404 === e || 0 === e && t.startsWith("file:"))
                    return new r.MissingPDFException('Missing PDF "' + t + '".');
                return new r.UnexpectedResponseException(`Unexpected server response (${e}) while retrieving PDF "${t}".`,e)
            }
            ;
            t.extractFilenameFromHeader = function extractFilenameFromHeader(e) {
                const t = e("Content-Disposition");
                if (t) {
                    let e = (0,
                    n.getFilenameFromContentDispositionHeader)(t);
                    if (e.includes("%"))
                        try {
                            e = decodeURIComponent(e)
                        } catch (e) {}
                    if ((0,
                    a.isPdfFile)(e))
                        return e
                }
                return null
            }
            ;
            t.validateRangeRequestCapabilities = function validateRangeRequestCapabilities({getResponseHeader: e, isHttp: t, rangeChunkSize: s, disableRange: n}) {
                (0,
                r.assert)(s > 0, "Range chunk size must be larger than zero");
                const a = {
                    allowRangeRequests: !1,
                    suggestedLength: void 0
                }
                  , i = parseInt(e("Content-Length"), 10);
                if (!Number.isInteger(i))
                    return a;
                a.suggestedLength = i;
                if (i <= 2 * s)
                    return a;
                if (n || !t)
                    return a;
                if ("bytes" !== e("Accept-Ranges"))
                    return a;
                if ("identity" !== (e("Content-Encoding") || "identity"))
                    return a;
                a.allowRangeRequests = !0;
                return a
            }
            ;
            t.validateResponseStatus = function validateResponseStatus(e) {
                return 200 === e || 206 === e
            }
            ;
            var r = s(2)
              , n = s(25)
              , a = s(1)
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.getFilenameFromContentDispositionHeader = function getFilenameFromContentDispositionHeader(e) {
                let t = !0
                  , s = toParamRegExp("filename\\*", "i").exec(e);
                if (s) {
                    s = s[1];
                    let e = rfc2616unquote(s);
                    e = unescape(e);
                    e = rfc5987decode(e);
                    e = rfc2047decode(e);
                    return fixupEncoding(e)
                }
                s = function rfc2231getparam(e) {
                    const t = [];
                    let s;
                    const r = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
                    for (; null !== (s = r.exec(e)); ) {
                        let[,e,r,n] = s;
                        e = parseInt(e, 10);
                        if (e in t) {
                            if (0 === e)
                                break
                        } else
                            t[e] = [r, n]
                    }
                    const n = [];
                    for (let e = 0; e < t.length && e in t; ++e) {
                        let[s,r] = t[e];
                        r = rfc2616unquote(r);
                        if (s) {
                            r = unescape(r);
                            0 === e && (r = rfc5987decode(r))
                        }
                        n.push(r)
                    }
                    return n.join("")
                }(e);
                if (s) {
                    return fixupEncoding(rfc2047decode(s))
                }
                s = toParamRegExp("filename", "i").exec(e);
                if (s) {
                    s = s[1];
                    let e = rfc2616unquote(s);
                    e = rfc2047decode(e);
                    return fixupEncoding(e)
                }
                function toParamRegExp(e, t) {
                    return new RegExp("(?:^|;)\\s*" + e + '\\s*=\\s*([^";\\s][^;\\s]*|"(?:[^"\\\\]|\\\\"?)+"?)',t)
                }
                function textdecode(e, s) {
                    if (e) {
                        if (!/^[\x00-\xFF]+$/.test(s))
                            return s;
                        try {
                            const n = new TextDecoder(e,{
                                fatal: !0
                            })
                              , a = (0,
                            r.stringToBytes)(s);
                            s = n.decode(a);
                            t = !1
                        } catch (r) {
                            if (/^utf-?8$/i.test(e))
                                try {
                                    s = decodeURIComponent(escape(s));
                                    t = !1
                                } catch (e) {}
                        }
                    }
                    return s
                }
                function fixupEncoding(e) {
                    if (t && /[\x80-\xff]/.test(e)) {
                        e = textdecode("utf-8", e);
                        t && (e = textdecode("iso-8859-1", e))
                    }
                    return e
                }
                function rfc2616unquote(e) {
                    if (e.startsWith('"')) {
                        const t = e.slice(1).split('\\"');
                        for (let e = 0; e < t.length; ++e) {
                            const s = t[e].indexOf('"');
                            if (-1 !== s) {
                                t[e] = t[e].slice(0, s);
                                t.length = e + 1
                            }
                            t[e] = t[e].replace(/\\(.)/g, "$1")
                        }
                        e = t.join('"')
                    }
                    return e
                }
                function rfc5987decode(e) {
                    const t = e.indexOf("'");
                    if (-1 === t)
                        return e;
                    return textdecode(e.slice(0, t), e.slice(t + 1).replace(/^[^']*'/, ""))
                }
                function rfc2047decode(e) {
                    return !e.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(e) ? e : e.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, (function(e, t, s, r) {
                        if ("q" === s || "Q" === s)
                            return textdecode(t, r = (r = r.replace(/_/g, " ")).replace(/=([0-9a-fA-F]{2})/g, (function(e, t) {
                                return String.fromCharCode(parseInt(t, 16))
                            }
                            )));
                        try {
                            r = atob(r)
                        } catch (e) {}
                        return textdecode(t, r)
                    }
                    ))
                }
                return ""
            }
            ;
            var r = s(2)
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.PDFNetworkStream = void 0;
            var r = s(2)
              , n = s(24);
            class NetworkManager {
                constructor(e, t={}) {
                    this.url = e;
                    this.isHttp = /^https?:/i.test(e);
                    this.httpHeaders = this.isHttp && t.httpHeaders || Object.create(null);
                    this.withCredentials = t.withCredentials || !1;
                    this.getXhr = t.getXhr || function NetworkManager_getXhr() {
                        return new XMLHttpRequest
                    }
                    ;
                    this.currXhrId = 0;
                    this.pendingRequests = Object.create(null)
                }
                requestRange(e, t, s) {
                    const r = {
                        begin: e,
                        end: t
                    };
                    for (const e in s)
                        r[e] = s[e];
                    return this.request(r)
                }
                requestFull(e) {
                    return this.request(e)
                }
                request(e) {
                    const t = this.getXhr()
                      , s = this.currXhrId++
                      , r = this.pendingRequests[s] = {
                        xhr: t
                    };
                    t.open("GET", this.url);
                    t.withCredentials = this.withCredentials;
                    for (const e in this.httpHeaders) {
                        const s = this.httpHeaders[e];
                        void 0 !== s && t.setRequestHeader(e, s)
                    }
                    if (this.isHttp && "begin"in e && "end"in e) {
                        t.setRequestHeader("Range", `bytes=${e.begin}-${e.end - 1}`);
                        r.expectedStatus = 206
                    } else
                        r.expectedStatus = 200;
                    t.responseType = "arraybuffer";
                    e.onError && (t.onerror = function(s) {
                        e.onError(t.status)
                    }
                    );
                    t.onreadystatechange = this.onStateChange.bind(this, s);
                    t.onprogress = this.onProgress.bind(this, s);
                    r.onHeadersReceived = e.onHeadersReceived;
                    r.onDone = e.onDone;
                    r.onError = e.onError;
                    r.onProgress = e.onProgress;
                    t.send(null);
                    return s
                }
                onProgress(e, t) {
                    const s = this.pendingRequests[e];
                    s && s.onProgress?.(t)
                }
                onStateChange(e, t) {
                    const s = this.pendingRequests[e];
                    if (!s)
                        return;
                    const n = s.xhr;
                    if (n.readyState >= 2 && s.onHeadersReceived) {
                        s.onHeadersReceived();
                        delete s.onHeadersReceived
                    }
                    if (4 !== n.readyState)
                        return;
                    if (!(e in this.pendingRequests))
                        return;
                    delete this.pendingRequests[e];
                    if (0 === n.status && this.isHttp) {
                        s.onError?.(n.status);
                        return
                    }
                    const a = n.status || 200;
                    if (!(200 === a && 206 === s.expectedStatus) && a !== s.expectedStatus) {
                        s.onError?.(n.status);
                        return
                    }
                    const i = function getArrayBuffer(e) {
                        const t = e.response;
                        return "string" != typeof t ? t : (0,
                        r.stringToBytes)(t).buffer
                    }(n);
                    if (206 === a) {
                        const e = n.getResponseHeader("Content-Range")
                          , t = /bytes (\d+)-(\d+)\/(\d+)/.exec(e);
                        s.onDone({
                            begin: parseInt(t[1], 10),
                            chunk: i
                        })
                    } else
                        i ? s.onDone({
                            begin: 0,
                            chunk: i
                        }) : s.onError?.(n.status)
                }
                getRequestXhr(e) {
                    return this.pendingRequests[e].xhr
                }
                isPendingRequest(e) {
                    return e in this.pendingRequests
                }
                abortRequest(e) {
                    const t = this.pendingRequests[e].xhr;
                    delete this.pendingRequests[e];
                    t.abort()
                }
            }
            t.PDFNetworkStream = class PDFNetworkStream {
                constructor(e) {
                    this._source = e;
                    this._manager = new NetworkManager(e.url,{
                        httpHeaders: e.httpHeaders,
                        withCredentials: e.withCredentials
                    });
                    this._rangeChunkSize = e.rangeChunkSize;
                    this._fullRequestReader = null;
                    this._rangeRequestReaders = []
                }
                _onRangeRequestReaderClosed(e) {
                    const t = this._rangeRequestReaders.indexOf(e);
                    t >= 0 && this._rangeRequestReaders.splice(t, 1)
                }
                getFullReader() {
                    (0,
                    r.assert)(!this._fullRequestReader, "PDFNetworkStream.getFullReader can only be called once.");
                    this._fullRequestReader = new PDFNetworkStreamFullRequestReader(this._manager,this._source);
                    return this._fullRequestReader
                }
                getRangeReader(e, t) {
                    const s = new PDFNetworkStreamRangeRequestReader(this._manager,e,t);
                    s.onClosed = this._onRangeRequestReaderClosed.bind(this);
                    this._rangeRequestReaders.push(s);
                    return s
                }
                cancelAllRequests(e) {
                    this._fullRequestReader?.cancel(e);
                    for (const t of this._rangeRequestReaders.slice(0))
                        t.cancel(e)
                }
            }
            ;
            class PDFNetworkStreamFullRequestReader {
                constructor(e, t) {
                    this._manager = e;
                    const s = {
                        onHeadersReceived: this._onHeadersReceived.bind(this),
                        onDone: this._onDone.bind(this),
                        onError: this._onError.bind(this),
                        onProgress: this._onProgress.bind(this)
                    };
                    this._url = t.url;
                    this._fullRequestId = e.requestFull(s);
                    this._headersReceivedCapability = (0,
                    r.createPromiseCapability)();
                    this._disableRange = t.disableRange || !1;
                    this._contentLength = t.length;
                    this._rangeChunkSize = t.rangeChunkSize;
                    this._rangeChunkSize || this._disableRange || (this._disableRange = !0);
                    this._isStreamingSupported = !1;
                    this._isRangeSupported = !1;
                    this._cachedChunks = [];
                    this._requests = [];
                    this._done = !1;
                    this._storedError = void 0;
                    this._filename = null;
                    this.onProgress = null
                }
                _onHeadersReceived() {
                    const e = this._fullRequestId
                      , t = this._manager.getRequestXhr(e)
                      , getResponseHeader = e=>t.getResponseHeader(e)
                      , {allowRangeRequests: s, suggestedLength: r} = (0,
                    n.validateRangeRequestCapabilities)({
                        getResponseHeader: getResponseHeader,
                        isHttp: this._manager.isHttp,
                        rangeChunkSize: this._rangeChunkSize,
                        disableRange: this._disableRange
                    });
                    s && (this._isRangeSupported = !0);
                    this._contentLength = r || this._contentLength;
                    this._filename = (0,
                    n.extractFilenameFromHeader)(getResponseHeader);
                    this._isRangeSupported && this._manager.abortRequest(e);
                    this._headersReceivedCapability.resolve()
                }
                _onDone(e) {
                    if (e)
                        if (this._requests.length > 0) {
                            this._requests.shift().resolve({
                                value: e.chunk,
                                done: !1
                            })
                        } else
                            this._cachedChunks.push(e.chunk);
                    this._done = !0;
                    if (!(this._cachedChunks.length > 0)) {
                        for (const e of this._requests)
                            e.resolve({
                                value: void 0,
                                done: !0
                            });
                        this._requests.length = 0
                    }
                }
                _onError(e) {
                    this._storedError = (0,
                    n.createResponseStatusError)(e, this._url);
                    this._headersReceivedCapability.reject(this._storedError);
                    for (const e of this._requests)
                        e.reject(this._storedError);
                    this._requests.length = 0;
                    this._cachedChunks.length = 0
                }
                _onProgress(e) {
                    this.onProgress?.({
                        loaded: e.loaded,
                        total: e.lengthComputable ? e.total : this._contentLength
                    })
                }
                get filename() {
                    return this._filename
                }
                get isRangeSupported() {
                    return this._isRangeSupported
                }
                get isStreamingSupported() {
                    return this._isStreamingSupported
                }
                get contentLength() {
                    return this._contentLength
                }
                get headersReady() {
                    return this._headersReceivedCapability.promise
                }
                async read() {
                    if (this._storedError)
                        throw this._storedError;
                    if (this._cachedChunks.length > 0) {
                        return {
                            value: this._cachedChunks.shift(),
                            done: !1
                        }
                    }
                    if (this._done)
                        return {
                            value: void 0,
                            done: !0
                        };
                    const e = (0,
                    r.createPromiseCapability)();
                    this._requests.push(e);
                    return e.promise
                }
                cancel(e) {
                    this._done = !0;
                    this._headersReceivedCapability.reject(e);
                    for (const e of this._requests)
                        e.resolve({
                            value: void 0,
                            done: !0
                        });
                    this._requests.length = 0;
                    this._manager.isPendingRequest(this._fullRequestId) && this._manager.abortRequest(this._fullRequestId);
                    this._fullRequestReader = null
                }
            }
            class PDFNetworkStreamRangeRequestReader {
                constructor(e, t, s) {
                    this._manager = e;
                    const r = {
                        onDone: this._onDone.bind(this),
                        onError: this._onError.bind(this),
                        onProgress: this._onProgress.bind(this)
                    };
                    this._url = e.url;
                    this._requestId = e.requestRange(t, s, r);
                    this._requests = [];
                    this._queuedChunk = null;
                    this._done = !1;
                    this._storedError = void 0;
                    this.onProgress = null;
                    this.onClosed = null
                }
                _close() {
                    this.onClosed?.(this)
                }
                _onDone(e) {
                    const t = e.chunk;
                    if (this._requests.length > 0) {
                        this._requests.shift().resolve({
                            value: t,
                            done: !1
                        })
                    } else
                        this._queuedChunk = t;
                    this._done = !0;
                    for (const e of this._requests)
                        e.resolve({
                            value: void 0,
                            done: !0
                        });
                    this._requests.length = 0;
                    this._close()
                }
                _onError(e) {
                    this._storedError = (0,
                    n.createResponseStatusError)(e, this._url);
                    for (const e of this._requests)
                        e.reject(this._storedError);
                    this._requests.length = 0;
                    this._queuedChunk = null
                }
                _onProgress(e) {
                    this.isStreamingSupported || this.onProgress?.({
                        loaded: e.loaded
                    })
                }
                get isStreamingSupported() {
                    return !1
                }
                async read() {
                    if (this._storedError)
                        throw this._storedError;
                    if (null !== this._queuedChunk) {
                        const e = this._queuedChunk;
                        this._queuedChunk = null;
                        return {
                            value: e,
                            done: !1
                        }
                    }
                    if (this._done)
                        return {
                            value: void 0,
                            done: !0
                        };
                    const e = (0,
                    r.createPromiseCapability)();
                    this._requests.push(e);
                    return e.promise
                }
                cancel(e) {
                    this._done = !0;
                    for (const e of this._requests)
                        e.resolve({
                            value: void 0,
                            done: !0
                        });
                    this._requests.length = 0;
                    this._manager.isPendingRequest(this._requestId) && this._manager.abortRequest(this._requestId);
                    this._close()
                }
            }
        }
        , (e,t,s)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            t.PDFFetchStream = void 0;
            var r = s(2)
              , n = s(24);
            function createFetchOptions(e, t, s) {
                return {
                    method: "GET",
                    headers: e,
                    signal: s?.signal,
                    mode: "cors",
                    credentials: t ? "include" : "same-origin",
                    redirect: "follow"
                }
            }
            function createHeaders(e) {
                const t = new Headers;
                for (const s in e) {
                    const r = e[s];
                    void 0 !== r && t.append(s, r)
                }
                return t
            }
            t.PDFFetchStream = class PDFFetchStream {
                constructor(e) {
                    this.source = e;
                    this.isHttp = /^https?:/i.test(e.url);
                    this.httpHeaders = this.isHttp && e.httpHeaders || {};
                    this._fullRequestReader = null;
                    this._rangeRequestReaders = []
                }
                get _progressiveDataLength() {
                    return this._fullRequestReader?._loaded ?? 0
                }
                getFullReader() {
                    (0,
                    r.assert)(!this._fullRequestReader, "PDFFetchStream.getFullReader can only be called once.");
                    this._fullRequestReader = new PDFFetchStreamReader(this);
                    return this._fullRequestReader
                }
                getRangeReader(e, t) {
                    if (t <= this._progressiveDataLength)
                        return null;
                    const s = new PDFFetchStreamRangeReader(this,e,t);
                    this._rangeRequestReaders.push(s);
                    return s
                }
                cancelAllRequests(e) {
                    this._fullRequestReader && this._fullRequestReader.cancel(e);
                    for (const t of this._rangeRequestReaders.slice(0))
                        t.cancel(e)
                }
            }
            ;
            class PDFFetchStreamReader {
                constructor(e) {
                    this._stream = e;
                    this._reader = null;
                    this._loaded = 0;
                    this._filename = null;
                    const t = e.source;
                    this._withCredentials = t.withCredentials || !1;
                    this._contentLength = t.length;
                    this._headersCapability = (0,
                    r.createPromiseCapability)();
                    this._disableRange = t.disableRange || !1;
                    this._rangeChunkSize = t.rangeChunkSize;
                    this._rangeChunkSize || this._disableRange || (this._disableRange = !0);
                    "undefined" != typeof AbortController && (this._abortController = new AbortController);
                    this._isStreamingSupported = !t.disableStream;
                    this._isRangeSupported = !t.disableRange;
                    this._headers = createHeaders(this._stream.httpHeaders);
                    const s = t.url;
                    fetch(s, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then((e=>{
                        if (!(0,
                        n.validateResponseStatus)(e.status))
                            throw (0,
                            n.createResponseStatusError)(e.status, s);
                        this._reader = e.body.getReader();
                        this._headersCapability.resolve();
                        const getResponseHeader = t=>e.headers.get(t)
                          , {allowRangeRequests: t, suggestedLength: a} = (0,
                        n.validateRangeRequestCapabilities)({
                            getResponseHeader: getResponseHeader,
                            isHttp: this._stream.isHttp,
                            rangeChunkSize: this._rangeChunkSize,
                            disableRange: this._disableRange
                        });
                        this._isRangeSupported = t;
                        this._contentLength = a || this._contentLength;
                        this._filename = (0,
                        n.extractFilenameFromHeader)(getResponseHeader);
                        !this._isStreamingSupported && this._isRangeSupported && this.cancel(new r.AbortException("Streaming is disabled."))
                    }
                    )).catch(this._headersCapability.reject);
                    this.onProgress = null
                }
                get headersReady() {
                    return this._headersCapability.promise
                }
                get filename() {
                    return this._filename
                }
                get contentLength() {
                    return this._contentLength
                }
                get isRangeSupported() {
                    return this._isRangeSupported
                }
                get isStreamingSupported() {
                    return this._isStreamingSupported
                }
                async read() {
                    await this._headersCapability.promise;
                    const {value: e, done: t} = await this._reader.read();
                    if (t)
                        return {
                            value: e,
                            done: t
                        };
                    this._loaded += e.byteLength;
                    this.onProgress && this.onProgress({
                        loaded: this._loaded,
                        total: this._contentLength
                    });
                    return {
                        value: new Uint8Array(e).buffer,
                        done: !1
                    }
                }
                cancel(e) {
                    this._reader && this._reader.cancel(e);
                    this._abortController && this._abortController.abort()
                }
            }
            class PDFFetchStreamRangeReader {
                constructor(e, t, s) {
                    this._stream = e;
                    this._reader = null;
                    this._loaded = 0;
                    const a = e.source;
                    this._withCredentials = a.withCredentials || !1;
                    this._readCapability = (0,
                    r.createPromiseCapability)();
                    this._isStreamingSupported = !a.disableStream;
                    "undefined" != typeof AbortController && (this._abortController = new AbortController);
                    this._headers = createHeaders(this._stream.httpHeaders);
                    this._headers.append("Range", `bytes=${t}-${s - 1}`);
                    const i = a.url;
                    fetch(i, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then((e=>{
                        if (!(0,
                        n.validateResponseStatus)(e.status))
                            throw (0,
                            n.createResponseStatusError)(e.status, i);
                        this._readCapability.resolve();
                        this._reader = e.body.getReader()
                    }
                    )).catch(this._readCapability.reject);
                    this.onProgress = null
                }
                get isStreamingSupported() {
                    return this._isStreamingSupported
                }
                async read() {
                    await this._readCapability.promise;
                    const {value: e, done: t} = await this._reader.read();
                    if (t)
                        return {
                            value: e,
                            done: t
                        };
                    this._loaded += e.byteLength;
                    this.onProgress && this.onProgress({
                        loaded: this._loaded
                    });
                    return {
                        value: new Uint8Array(e).buffer,
                        done: !1
                    }
                }
                cancel(e) {
                    this._reader && this._reader.cancel(e);
                    this._abortController && this._abortController.abort()
                }
            }
        }
        ]
          , __webpack_module_cache__ = {};
        function __w_pdfjs_require__(e) {
            var t = __webpack_module_cache__[e];
            if (void 0 !== t)
                return t.exports;
            var s = __webpack_module_cache__[e] = {
                exports: {}
            };
            __webpack_modules__[e](s, s.exports, __w_pdfjs_require__);
            return s.exports
        }
        var __webpack_exports__ = {};
        (()=>{
            var e = __webpack_exports__;
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            Object.defineProperty(e, "addLinkAttributes", {
                enumerable: !0,
                get: function() {
                    return t.addLinkAttributes
                }
            });
            Object.defineProperty(e, "getFilenameFromUrl", {
                enumerable: !0,
                get: function() {
                    return t.getFilenameFromUrl
                }
            });
            Object.defineProperty(e, "getPdfFilenameFromUrl", {
                enumerable: !0,
                get: function() {
                    return t.getPdfFilenameFromUrl
                }
            });
            Object.defineProperty(e, "getXfaPageViewport", {
                enumerable: !0,
                get: function() {
                    return t.getXfaPageViewport
                }
            });
            Object.defineProperty(e, "isPdfFile", {
                enumerable: !0,
                get: function() {
                    return t.isPdfFile
                }
            });
            Object.defineProperty(e, "LinkTarget", {
                enumerable: !0,
                get: function() {
                    return t.LinkTarget
                }
            });
            Object.defineProperty(e, "loadScript", {
                enumerable: !0,
                get: function() {
                    return t.loadScript
                }
            });
            Object.defineProperty(e, "PDFDateString", {
                enumerable: !0,
                get: function() {
                    return t.PDFDateString
                }
            });
            Object.defineProperty(e, "PixelsPerInch", {
                enumerable: !0,
                get: function() {
                    return t.PixelsPerInch
                }
            });
            Object.defineProperty(e, "RenderingCancelledException", {
                enumerable: !0,
                get: function() {
                    return t.RenderingCancelledException
                }
            });
            Object.defineProperty(e, "AnnotationMode", {
                enumerable: !0,
                get: function() {
                    return s.AnnotationMode
                }
            });
            Object.defineProperty(e, "CMapCompressionType", {
                enumerable: !0,
                get: function() {
                    return s.CMapCompressionType
                }
            });
            Object.defineProperty(e, "createObjectURL", {
                enumerable: !0,
                get: function() {
                    return s.createObjectURL
                }
            });
            Object.defineProperty(e, "createPromiseCapability", {
                enumerable: !0,
                get: function() {
                    return s.createPromiseCapability
                }
            });
            Object.defineProperty(e, "createValidAbsoluteUrl", {
                enumerable: !0,
                get: function() {
                    return s.createValidAbsoluteUrl
                }
            });
            Object.defineProperty(e, "InvalidPDFException", {
                enumerable: !0,
                get: function() {
                    return s.InvalidPDFException
                }
            });
            Object.defineProperty(e, "MissingPDFException", {
                enumerable: !0,
                get: function() {
                    return s.MissingPDFException
                }
            });
            Object.defineProperty(e, "OPS", {
                enumerable: !0,
                get: function() {
                    return s.OPS
                }
            });
            Object.defineProperty(e, "PasswordResponses", {
                enumerable: !0,
                get: function() {
                    return s.PasswordResponses
                }
            });
            Object.defineProperty(e, "PermissionFlag", {
                enumerable: !0,
                get: function() {
                    return s.PermissionFlag
                }
            });
            Object.defineProperty(e, "removeNullCharacters", {
                enumerable: !0,
                get: function() {
                    return s.removeNullCharacters
                }
            });
            Object.defineProperty(e, "shadow", {
                enumerable: !0,
                get: function() {
                    return s.shadow
                }
            });
            Object.defineProperty(e, "UnexpectedResponseException", {
                enumerable: !0,
                get: function() {
                    return s.UnexpectedResponseException
                }
            });
            Object.defineProperty(e, "UNSUPPORTED_FEATURES", {
                enumerable: !0,
                get: function() {
                    return s.UNSUPPORTED_FEATURES
                }
            });
            Object.defineProperty(e, "Util", {
                enumerable: !0,
                get: function() {
                    return s.Util
                }
            });
            Object.defineProperty(e, "VerbosityLevel", {
                enumerable: !0,
                get: function() {
                    return s.VerbosityLevel
                }
            });
            Object.defineProperty(e, "build", {
                enumerable: !0,
                get: function() {
                    return r.build
                }
            });
            Object.defineProperty(e, "getDocument", {
                enumerable: !0,
                get: function() {
                    return r.getDocument
                }
            });
            Object.defineProperty(e, "LoopbackPort", {
                enumerable: !0,
                get: function() {
                    return r.LoopbackPort
                }
            });
            Object.defineProperty(e, "PDFDataRangeTransport", {
                enumerable: !0,
                get: function() {
                    return r.PDFDataRangeTransport
                }
            });
            Object.defineProperty(e, "PDFWorker", {
                enumerable: !0,
                get: function() {
                    return r.PDFWorker
                }
            });
            Object.defineProperty(e, "version", {
                enumerable: !0,
                get: function() {
                    return r.version
                }
            });
            Object.defineProperty(e, "AnnotationLayer", {
                enumerable: !0,
                get: function() {
                    return n.AnnotationLayer
                }
            });
            Object.defineProperty(e, "GlobalWorkerOptions", {
                enumerable: !0,
                get: function() {
                    return a.GlobalWorkerOptions
                }
            });
            Object.defineProperty(e, "renderTextLayer", {
                enumerable: !0,
                get: function() {
                    return o.renderTextLayer
                }
            });
            Object.defineProperty(e, "SVGGraphics", {
                enumerable: !0,
                get: function() {
                    return l.SVGGraphics
                }
            });
            Object.defineProperty(e, "XfaLayer", {
                enumerable: !0,
                get: function() {
                    return c.XfaLayer
                }
            });
            var t = __w_pdfjs_require__(1)
              , s = __w_pdfjs_require__(2)
              , r = __w_pdfjs_require__(6)
              , n = __w_pdfjs_require__(18)
              , a = __w_pdfjs_require__(12)
              , i = __w_pdfjs_require__(4)
              , o = __w_pdfjs_require__(20)
              , l = __w_pdfjs_require__(21)
              , c = __w_pdfjs_require__(22);
            if (i.isNodeJS) {
                const {PDFNodeStream: e} = __w_pdfjs_require__(23);
                (0,
                r.setPDFNetworkStreamFactory)((t=>new e(t)))
            } else {
                const {PDFNetworkStream: e} = __w_pdfjs_require__(26)
                  , {PDFFetchStream: s} = __w_pdfjs_require__(27);
                (0,
                r.setPDFNetworkStreamFactory)((r=>(0,
                t.isValidFetchUrl)(r.url) ? new s(r) : new e(r)))
            }
        }
        )();
        return __webpack_exports__
    }
    )()
}
));