/*******************************************************************************
 * Copyright 2017 Adobe
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
 ******************************************************************************/
if (window.Element && !Element.prototype.closest) {
    // eslint valid-jsdoc: "off"
    Element.prototype.closest =
        function(s) {
            "use strict";
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var el      = this;
            var i;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {
                    // continue
                }
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            "use strict";
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var i       = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
                // continue
            }
            return i > -1;
        };
}

if (!Object.assign) {
    Object.assign = function(target, varArgs) { // .length of function is 2
        "use strict";
        if (target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

(function(arr) {
    "use strict";
    arr.forEach(function(item) {
        if (Object.prototype.hasOwnProperty.call(item, "remove")) {
            return;
        }
        Object.defineProperty(item, "remove", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/*******************************************************************************
 * Copyright 2022 Adobe
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
 ******************************************************************************/
(function(document) {
    "use strict";

    window.CMP = window.CMP || {};
    window.CMP.utils = (function() {
        var NS = "cmp";

        /**
         * Reads options data from the Component wrapper element, defined via {@code data-cmp-*} data attributes
         *
         * @param {HTMLElement} element The component element to read options data from
         * @param {String} is The component identifier
         * @returns {String[]} The options read from the component data attributes
         */
        var readData = function(element, is) {
            var data = element.dataset;
            var options = [];
            var capitalized = is;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var reserved = ["is", "hook" + capitalized];

            for (var key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    var value = data[key];

                    if (key.indexOf(NS) === 0) {
                        key = key.slice(NS.length);
                        key = key.charAt(0).toLowerCase() + key.substring(1);

                        if (reserved.indexOf(key) === -1) {
                            options[key] = value;
                        }
                    }
                }
            }
            return options;
        };

        /**
         * Set up the final properties of a component by evaluating the transform function or fall back to the default value on demand
         * @param {String[]} options the options to transform
         * @param {Object} properties object of properties of property functions
         * @returns {Object} transformed properties
         */
        var setupProperties = function(options, properties) {
            var transformedProperties = {};

            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    var property = properties[key];
                    if (options && options[key] != null) {
                        if (property && typeof property.transform === "function") {
                            transformedProperties[key] = property.transform(options[key]);
                        } else {
                            transformedProperties[key] = options[key];
                        }
                    } else {
                        transformedProperties[key] = properties[key]["default"];
                    }
                }
            }
            return transformedProperties;
        };


        return {
            readData: readData,
            setupProperties: setupProperties
        };
    }());
}(window.document));

/*******************************************************************************
 * Copyright 2022 Adobe
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
 ******************************************************************************/
(function(document) {
    "use strict";

    window.CMP = window.CMP || {};
    window.CMP.image = window.CMP.image || {};
    window.CMP.image.dynamicMedia = (function() {
        var autoSmartCrops = {};
        var SRC_URI_TEMPLATE_WIDTH_VAR = "{.width}";
        var SRC_URI_TEMPLATE_DPR_VAR = "{dpr}";
        var SRC_URI_DPR_OFF = "dpr=off";
        var SRC_URI_DPR_ON = "dpr=on,{dpr}";
        var dpr = window.devicePixelRatio || 1;
        var config = {
            minWidth: 20
        };

        /**
         * get auto smart crops from dm
         * @param {String} src the src uri
         * @returns {{}} the smart crop json object
         */
        var getAutoSmartCrops = function(src) {
            var request = new XMLHttpRequest();
            var url = src.split(SRC_URI_TEMPLATE_WIDTH_VAR)[0] + "?req=set,json";
            request.open("GET", url, false);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // success status
                    var responseText = request.responseText;
                    var rePayload = new RegExp(/^(?:\/\*jsonp\*\/)?\s*([^()]+)\(([\s\S]+),\s*"[0-9]*"\);?$/gmi);
                    var rePayloadJSON = new RegExp(/^{[\s\S]*}$/gmi);
                    var resPayload = rePayload.exec(responseText);
                    var payload;
                    if (resPayload) {
                        var payloadStr = resPayload[2];
                        if (rePayloadJSON.test(payloadStr)) {
                            payload = JSON.parse(payloadStr);
                        }

                    }
                    // check "relation" - only in case of smartcrop preset
                    if (payload && payload.set.relation && payload.set.relation.length > 0) {
                        for (var i = 0; i < payload.set.relation.length; i++) {
                            autoSmartCrops[parseInt(payload.set.relation[i].userdata.SmartCropWidth)] =
                                ":" + payload.set.relation[i].userdata.SmartCropDef;
                        }
                    }
                } else {
                    // error status
                }
            };
            request.send();
            return autoSmartCrops;
        };

        /**
         * Build and return the srcset value based on the available auto smart crops
         * @param {String} src the src uri
         * @param {Object} smartCrops the smart crops object
         * @returns {String} the srcset
         */
        var getSrcSet = function(src, smartCrops) {
            var srcset;
            var keys = Object.keys(smartCrops);
            if (keys.length > 0) {
                srcset = [];
                for (var key in autoSmartCrops) {
                    srcset.push(src.replace(SRC_URI_TEMPLATE_WIDTH_VAR, smartCrops[key]) + " " + key + "w");
                }
            }
            return  srcset.join(",");
        };

        /**
         * Get the optimal width based on the available sizes
         * @param {[Number]} sizes the available sizes
         * @param {Number} width the element width
         * @returns {String} the optimal width
         */
        function getOptimalWidth(sizes, width) {
            var len = sizes.length;
            var key = 0;

            while ((key < len - 1) && (sizes[key] < width)) {
                key++;
            }

            return sizes[key] !== undefined ? sizes[key].toString() : width;
        }

        /**
         * Get the width of an element or parent element if the width is smaller than the minimum width
         * @param {HTMLElement} component the image component
         * @param {HTMLElement | Node} parent the parent element
         * @returns {Number} the width of the element
         */
        var getWidth = function(component, parent) {
            var width = component.offsetWidth;
            while (width < config.minWidth && parent && !component._autoWidth) {
                width =  parent.offsetWidth;
                parent = parent.parentNode;
            }
            return width;
        };

        /**
         * Set the src and srcset attribute for a Dynamic Media Image which auto smart crops enabled.
         * @param {HTMLElement} component the image component
         * @param {{}} properties the component properties
         */
        var setDMAttributes = function(component, properties) {
            // for v3 we first have to turn the dpr on
            var src = properties.src.replace(SRC_URI_DPR_OFF, SRC_URI_DPR_ON);
            src = src.replace(SRC_URI_TEMPLATE_DPR_VAR, dpr);
            var smartCrops = {};
            var width;
            if (properties["smartcroprendition"] === "SmartCrop:Auto") {
                smartCrops = getAutoSmartCrops(src);
            }
            var hasWidths = (properties.widths && properties.widths.length > 0) || Object.keys(smartCrops).length > 0;
            if (hasWidths) {
                var image = component.querySelector("img");
                var elemWidth = getWidth(component, component.parentNode);
                if (properties["smartcroprendition"] === "SmartCrop:Auto") {
                    image.setAttribute("srcset", CMP.image.dynamicMedia.getSrcSet(src, smartCrops));
                    width = getOptimalWidth(Object.keys(smartCrops, elemWidth));
                    image.setAttribute("src", CMP.image.dynamicMedia.getSrc(src, smartCrops[width]));
                } else {
                    width = getOptimalWidth(properties.widths, elemWidth);
                    image.setAttribute("src", CMP.image.dynamicMedia.getSrc(src, width));
                }
            }
        };

        /**
         * Get the src attribute based on the optimal width
         * @param {String} src the src uri
         * @param {String} width the element width
         * @returns {String} the final src attribute
         */
        var getSrc = function(src, width) {
            if (src.indexOf(SRC_URI_TEMPLATE_WIDTH_VAR) > -1) {
                src = src.replace(SRC_URI_TEMPLATE_WIDTH_VAR, width);
            }
            return src;
        };


        return {
            getAutoSmartCrops: getAutoSmartCrops,
            getSrcSet: getSrcSet,
            getSrc: getSrc,
            setDMAttributes: setDMAttributes,
            getWidth: getWidth
        };
    }());
    document.dispatchEvent(new CustomEvent("core.wcm.components.commons.site.image.dynamic-media.loaded"));
}(window.document));

/*******************************************************************************
 * Copyright 2016 Adobe
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
 ******************************************************************************/
(function() {
    "use strict";

    var NS = "cmp";
    var IS = "image";

    var EMPTY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    var LAZY_THRESHOLD_DEFAULT = 0;
    var SRC_URI_TEMPLATE_WIDTH_VAR = "{.width}";
    var SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY = "width={width}";
    var SRC_URI_TEMPLATE_DPR_VAR = "{dpr}";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        image: '[data-cmp-hook-image="image"]',
        map: '[data-cmp-hook-image="map"]',
        area: '[data-cmp-hook-image="area"]'
    };

    var lazyLoader = {
        "cssClass": "cmp-image__image--is-loading",
        "style": {
            "height": 0,
            "padding-bottom": "" // will be replaced with % ratio
        }
    };

    var properties = {
        /**
         * An array of alternative image widths (in pixels).
         * Used to replace a {.width} variable in the src property with an optimal width if a URI template is provided.
         *
         * @memberof Image
         * @type {Number[]}
         * @default []
         */
        "widths": {
            "default": [],
            "transform": function(value) {
                var widths = [];
                value.split(",").forEach(function(item) {
                    item = parseFloat(item);
                    if (!isNaN(item)) {
                        widths.push(item);
                    }
                });
                return widths;
            }
        },
        /**
         * Indicates whether the image should be rendered lazily.
         *
         * @memberof Image
         * @type {Boolean}
         * @default false
         */
        "lazy": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * Indicates image is DynamicMedia image.
         *
         * @memberof Image
         * @type {Boolean}
         * @default false
         */
        "dmimage": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        },
        /**
         * The lazy threshold.
         * This is the number of pixels, in advance of becoming visible, when an lazy-loading image should begin
         * to load.
         *
         * @memberof Image
         * @type {Number}
         * @default 0
         */
        "lazythreshold": {
            "default": 0,
            "transform": function(value) {
                var val =  parseInt(value);
                if (isNaN(val)) {
                    return LAZY_THRESHOLD_DEFAULT;
                }
                return val;
            }
        },
        /**
         * The image source.
         *
         * Can be a simple image source, or a URI template representation that
         * can be variable expanded - useful for building an image configuration with an alternative width.
         * e.g. '/path/image.coreimg{.width}.jpeg/1506620954214.jpeg'
         *
         * @memberof Image
         * @type {String}
         */
        "src": {
            "transform": function(value) {
                return decodeURIComponent(value);
            }
        }
    };

    var devicePixelRatio = window.devicePixelRatio || 1;

    function Image(config) {
        var that = this;

        var smartCrops = {};

        var useAssetDelivery = false;
        var srcUriTemplateWidthVar = SRC_URI_TEMPLATE_WIDTH_VAR;

        function init(config) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            // check if asset delivery is used
            if (config.options.src && config.options.src.indexOf(SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY) >= 0) {
                useAssetDelivery = true;
                srcUriTemplateWidthVar = SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY;
            }

            that._properties = CMP.utils.setupProperties(config.options, properties);
            cacheElements(config.element);
            // check image is DM asset; if true try to make req=set
            if (config.options.src && Object.prototype.hasOwnProperty.call(config.options, "dmimage") && (config.options["smartcroprendition"] === "SmartCrop:Auto")) {
                smartCrops = CMP.image.dynamicMedia.getAutoSmartCrops(config.options.src);
            }

            if (!that._elements.noscript) {
                return;
            }

            that._elements.container = that._elements.link ? that._elements.link : that._elements.self;

            unwrapNoScript();

            if (that._properties.lazy) {
                addLazyLoader();
            }

            if (that._elements.map) {
                that._elements.image.addEventListener("load", onLoad);
            }

            window.addEventListener("resize", onWindowResize);
            ["focus", "click", "load", "transitionend", "animationend", "scroll"].forEach(function(name) {
                document.addEventListener(name, that.update);
            });

            that._elements.image.addEventListener("cmp-image-redraw", that.update);

            that._interSectionObserver = new IntersectionObserver(function(entries, interSectionObserver) {
                entries.forEach(function(entry) {
                    if (entry.intersectionRatio > 0) {
                        that.update();
                    }
                });
            });
            that._interSectionObserver.observe(that._elements.self);

            that.update();
        }

        function loadImage() {
            var hasWidths = (that._properties.widths && that._properties.widths.length > 0) || Object.keys(smartCrops).length > 0;
            var replacement;
            if (Object.keys(smartCrops).length > 0) {
                var optimalWidth = getOptimalWidth(Object.keys(smartCrops), false);
                replacement = smartCrops[optimalWidth];
            } else {
                replacement = hasWidths ? (that._properties.dmimage ? "" : ".") + getOptimalWidth(that._properties.widths, true) : "";
            }
            if (useAssetDelivery) {
                replacement = replacement !== "" ? ("width=" + replacement.substring(1)) : "";
            }
            var url = that._properties.src.replace(srcUriTemplateWidthVar, replacement);
            url = url.replace(SRC_URI_TEMPLATE_DPR_VAR, devicePixelRatio);

            var imgSrcAttribute = that._elements.image.getAttribute("src");

            if (url !== imgSrcAttribute) {
                if (imgSrcAttribute === null || imgSrcAttribute === EMPTY_PIXEL) {
                    that._elements.image.setAttribute("src", url);
                } else {
                    var urlTemplateParts = that._properties.src.split(srcUriTemplateWidthVar);
                    // check if image src was dynamically swapped meanwhile (e.g. by Target)
                    var isImageRefSame = imgSrcAttribute.startsWith(urlTemplateParts[0]);
                    if (isImageRefSame && urlTemplateParts.length > 1) {
                        isImageRefSame = imgSrcAttribute.endsWith(urlTemplateParts[urlTemplateParts.length - 1]);
                    }
                    if (isImageRefSame) {
                        that._elements.image.setAttribute("src", url);
                        if (!hasWidths) {
                            window.removeEventListener("scroll", that.update);
                        }
                    }
                }
            }
            if (that._lazyLoaderShowing) {
                that._elements.image.addEventListener("load", removeLazyLoader);
            }
            that._interSectionObserver.unobserve(that._elements.self);
        }

        function getOptimalWidth(widths, useDevicePixelRatio) {
            var container = that._elements.self;
            var containerWidth = container.clientWidth;
            while (containerWidth === 0 && container.parentNode) {
                container = container.parentNode;
                containerWidth = container.clientWidth;
            }

            var dpr = useDevicePixelRatio ? devicePixelRatio : 1;
            var optimalWidth = containerWidth * dpr;
            var len = widths.length;
            var key = 0;

            while ((key < len - 1) && (widths[key] < optimalWidth)) {
                key++;
            }

            return widths[key].toString();
        }

        function addLazyLoader() {
            var width = that._elements.image.getAttribute("width");
            var height = that._elements.image.getAttribute("height");

            if (width && height) {
                var ratio = (height / width) * 100;
                var styles = lazyLoader.style;

                styles["padding-bottom"] = ratio + "%";

                for (var s in styles) {
                    if (Object.prototype.hasOwnProperty.call(styles, s)) {
                        that._elements.image.style[s] = styles[s];
                    }
                }
            }
            that._elements.image.setAttribute("src", EMPTY_PIXEL);
            that._elements.image.classList.add(lazyLoader.cssClass);
            that._lazyLoaderShowing = true;
        }

        function unwrapNoScript() {
            var markup = decodeNoscript(that._elements.noscript.textContent.trim());
            var parser = new DOMParser();

            // temporary document avoids requesting the image before removing its src
            var temporaryDocument = parser.parseFromString(markup, "text/html");
            var imageElement = temporaryDocument.querySelector(selectors.image);
            imageElement.removeAttribute("src");
            that._elements.container.insertBefore(imageElement, that._elements.noscript);

            var mapElement = temporaryDocument.querySelector(selectors.map);
            if (mapElement) {
                that._elements.container.insertBefore(mapElement, that._elements.noscript);
            }

            that._elements.noscript.parentNode.removeChild(that._elements.noscript);
            if (that._elements.container.matches(selectors.image)) {
                that._elements.image = that._elements.container;
            } else {
                that._elements.image = that._elements.container.querySelector(selectors.image);
            }

            that._elements.map = that._elements.container.querySelector(selectors.map);
            that._elements.areas = that._elements.container.querySelectorAll(selectors.area);
        }

        function removeLazyLoader() {
            that._elements.image.classList.remove(lazyLoader.cssClass);
            for (var property in lazyLoader.style) {
                if (Object.prototype.hasOwnProperty.call(lazyLoader.style, property)) {
                    that._elements.image.style[property] = "";
                }
            }
            that._elements.image.removeEventListener("load", removeLazyLoader);
            that._lazyLoaderShowing = false;
        }

        function isLazyVisible() {
            if (that._elements.container.offsetParent === null) {
                return false;
            }

            var wt = window.pageYOffset;
            var wb = wt + document.documentElement.clientHeight;
            var et = that._elements.container.getBoundingClientRect().top + wt;
            var eb = et + that._elements.container.clientHeight;

            return eb >= wt - that._properties.lazythreshold && et <= wb + that._properties.lazythreshold;
        }

        function resizeAreas() {
            if (that._elements.areas && that._elements.areas.length > 0) {
                for (var i = 0; i < that._elements.areas.length; i++) {
                    var width = that._elements.image.width;
                    var height = that._elements.image.height;

                    if (width && height) {
                        var relcoords = that._elements.areas[i].dataset.cmpRelcoords;
                        if (relcoords) {
                            var relativeCoordinates = relcoords.split(",");
                            var coordinates = new Array(relativeCoordinates.length);

                            for (var j = 0; j < coordinates.length; j++) {
                                if (j % 2 === 0) {
                                    coordinates[j] = parseInt(relativeCoordinates[j] * width);
                                } else {
                                    coordinates[j] = parseInt(relativeCoordinates[j] * height);
                                }
                            }

                            that._elements.areas[i].coords = coordinates;
                        }
                    }
                }
            }
        }

        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + "Hook" + capitalized];
                that._elements[key] = hook;
            }
        }

        function onWindowResize() {
            that.update();
            resizeAreas();
        }

        function onLoad() {
            resizeAreas();
        }

        that.update = function() {
            if (that._properties.lazy) {
                if (isLazyVisible()) {
                    loadImage();
                }
            } else {
                loadImage();
            }
        };

        if (config && config.element) {
            init(config);
        }
    }

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Image({ element: elements[i], options: CMP.utils.readData(elements[i], IS) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector("body");
        var observer         = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Image({ element: element, options: CMP.utils.readData(element, IS) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    var documentReady = document.readyState !== "loading" ? Promise.resolve() : new Promise(function(resolve) {
        document.addEventListener("DOMContentLoaded", resolve);
    });

    Promise.all([documentReady]).then(onDocumentReady);
    /*
        on drag & drop of the component into a parsys, noscript's content will be escaped multiple times by the editor which creates
        the DOM for editing; the HTML parser cannot be used here due to the multiple escaping
     */
    function decodeNoscript(text) {
        text = text.replace(/&(amp;)*lt;/g, "<");
        text = text.replace(/&(amp;)*gt;/g, ">");
        return text;
    }

})();

!function(){"use strict";var e,t={97091:function(e,t,i){i(28706);var n=i(59257),o=i(23029),a=i(92901),r=(i(2008),i(23418),i(25276),i(23792),i(60739),i(79432),i(26099),i(27495),i(47764),i(25440),i(23500),i(62953),i(3296),i(27208),i(48408),i(19625));(new(function(){return(0,a.A)(function e(){(0,o.A)(this,e),this.modal=null,this.exitRampConfig=null,this._focusTrapActive=!1,this._focusTrapRoot=null,this._previouslyFocusedEl=null,this.onClickEventListener=this.onClickEventListener.bind(this),this.onModalBoxOpen=this.onModalBoxOpen.bind(this),this.onModalBoxClose=this.onModalBoxClose.bind(this),this.closeModalBox=this.closeModalBox.bind(this),this.checkSkipExitRampUrls=this.checkSkipExitRampUrls.bind(this),this._onFocusTrapKeyDown=this._onFocusTrapKeyDown.bind(this),this._onFocusTrapFocusIn=this._onFocusTrapFocusIn.bind(this)},[{key:"init",value:function(){var e=JSON.stringify(window.exitRampConfig);e&&(this.exitRampConfig=JSON.parse(e),this.bindEventListeners())}},{key:"bindEventListeners",value:function(){document.addEventListener("click",this.onClickEventListener)}},{key:"onClickEventListener",value:function(e){var t=e.target.closest("a");if(t){var i=this.exitRampConfig.skipexitrampurls,n=t.href,o=t.target;n&&"#"!=n&&"javascript:void(0);"!=n&&(t.classList.contains("skip-exit-ramp")?this.closeModalBox():this.checkSkipExitRampUrls(i,n)||(e.preventDefault(),this.processModalBox(n,o)))}}},{key:"checkSkipExitRampUrls",value:function(e,t){var i=window.location.hostname,n=new URL(t),o=!1;return i===n.hostname||"tel:"==t.substr(0,4)||"mailto:"==t.substr(0,7)||(e.forEach(function(e){var t=n.hostname.replace(/^www\./,"").toLowerCase(),i=e.url.replace(/(^\w+:|^)\/\//,"").replace(/^www\./,"").toLowerCase().split("."),a=t.split(".");if(i.length===a.length){var r=i.join("").replace(/\*/gi,"");-1!==a.join("").indexOf(r)&&(o=!0)}}),o)}},{key:"processModalBox",value:function(e,t){var i=this,n=this.generateModalContent(e,t);this.modal=new r.ng({cssClass:["exit-ramp-modal"],onOpen:function(){return i.onModalBoxOpen(n)},onClose:function(){return i.onModalBoxClose(n)}}),this.modal.content(n),this.modal.open()}},{key:"closeModalBox",value:function(){this.modal&&this.modal.close()}},{key:"generateModalContent",value:function(e,t){var i=this,n=this.exitRampConfig,o=n.body,a=n.back,r=n.continue,s=n.title,l=document.createElement("div"),c=document.createElement("div"),u=document.createElement("div"),d=document.createElement("div"),p=document.createElement("a"),v=document.createElement("div"),f=Date.now(),h="exit-ramp-title-".concat(f),m="exit-ramp-body-".concat(f);return l.classList.add("exit-ramp-content"),c.classList.add("exit-ramp-title"),c.id=h,c.innerText=s,u.classList.add("exit-ramp-body"),u.id=m,u.innerText=o,p.classList.add("exit-ramp-continue"),p.classList.add("skip-exit-ramp"),p.href=e,p.target=t,p.innerText=r,p.setAttribute("aria-label","".concat(r," - Opens in ").concat("_blank"===t?"new window":"current window")),v.classList.add("exit-ramp-cancel"),v.classList.add("close-exit-ramp"),v.innerText=a,v.setAttribute("role","button"),v.setAttribute("tabindex","0"),v.setAttribute("aria-label",a),v.addEventListener("click",function(){i.closeModalBox()}),v.addEventListener("keydown",function(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),i.closeModalBox())}),d.classList.add("exit-ramp-actions"),d.appendChild(p),d.appendChild(v),l.appendChild(c),l.appendChild(u),l.appendChild(d),l}},{key:"onModalBoxOpen",value:function(e){var t=(null==e?void 0:e.closest(".modal.exit-ramp-modal"))||(null==e?void 0:e.closest(".modal"))||e;if(t){var i,n;t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true");var o=null==e||null===(i=e.querySelector)||void 0===i?void 0:i.call(e,".exit-ramp-title"),a=null==e||null===(n=e.querySelector)||void 0===n?void 0:n.call(e,".exit-ramp-body");o&&(o.id||(o.id="exit-ramp-title-".concat(Date.now())),t.setAttribute("aria-labelledby",o.id)),a&&(a.id||(a.id="exit-ramp-body-".concat(Date.now())),t.setAttribute("aria-describedby",a.id))}this._activateFocusTrap(t);var r=new CustomEvent("exitRampModalOpenEvent",{bubbles:!0,detail:{node:e}});document.dispatchEvent(r)}},{key:"onModalBoxClose",value:function(e){this._deactivateFocusTrap();var t=new CustomEvent("exitRampModalCloseEvent",{bubbles:!0,detail:{node:e}});document.dispatchEvent(t)}},{key:"_activateFocusTrap",value:function(e){var t,i;e&&!this._focusTrapActive&&(this._focusTrapActive=!0,this._focusTrapRoot=e,this._previouslyFocusedEl=document.activeElement,this._focusTrapRoot.hasAttribute("tabindex")||this._focusTrapRoot.setAttribute("tabindex","-1"),document.addEventListener("keydown",this._onFocusTrapKeyDown,!0),document.addEventListener("focusin",this._onFocusTrapFocusIn,!0),null===(t=(i=this._getFocusableElements(this._focusTrapRoot)[0]||this._focusTrapRoot).focus)||void 0===t||t.call(i))}},{key:"_deactivateFocusTrap",value:function(){var e;if(this._focusTrapActive){document.removeEventListener("keydown",this._onFocusTrapKeyDown,!0),document.removeEventListener("focusin",this._onFocusTrapFocusIn,!0),this._focusTrapActive=!1,this._focusTrapRoot=null;var t=this._previouslyFocusedEl;this._previouslyFocusedEl=null,null==t||null===(e=t.focus)||void 0===e||e.call(t)}}},{key:"_onFocusTrapKeyDown",value:function(e){if(this._focusTrapActive&&this._focusTrapRoot){if("Escape"===e.key)return e.preventDefault(),void this.closeModalBox();if("Tab"===e.key){var t,i,n=this._getFocusableElements(this._focusTrapRoot);if(0===n.length)return e.preventDefault(),void(null===(t=(i=this._focusTrapRoot).focus)||void 0===t||t.call(i));var o=n[0],a=n[n.length-1],r=document.activeElement;e.shiftKey?r!==o&&this._focusTrapRoot.contains(r)||(e.preventDefault(),a.focus()):r===a&&(e.preventDefault(),o.focus())}}}},{key:"_onFocusTrapFocusIn",value:function(e){var t,i;this._focusTrapActive&&this._focusTrapRoot&&(this._focusTrapRoot.contains(e.target)||null===(t=(i=this._getFocusableElements(this._focusTrapRoot)[0]||this._focusTrapRoot).focus)||void 0===t||t.call(i))}},{key:"_getFocusableElements",value:function(e){var t=["a[href]","button:not([disabled])",'[tabindex]:not([tabindex="-1"])','[role="button"][tabindex]'].join(",");return Array.from(e.querySelectorAll(t)).filter(function(e){var t=window.getComputedStyle(e);return"hidden"!==t.visibility&&"none"!==t.display&&!e.hasAttribute("hidden")})}}])}())).init(),i(42762);var s=i(60769),l=i(99315);(new(function(){return(0,a.A)(function e(){(0,o.A)(this,e)},[{key:"init",value:function(){void 0!==(0,s.e)("verification_code")&&""!=(0,s.e)("verification_code")&&"undefined"!=(0,s.e)("verification_code")&&this.verifyUserEmail((0,s.e)("verification_code")),this.bindEvents()}},{key:"bindEvents",value:function(){null!=document.querySelector(".az-authorized-person")&&document.querySelector(".az-authorized-person").addEventListener("click",function(){(0,l.TV)("logMetrics",!1)})}},{key:"verifyUserEmail",value:function(e){var t=document.querySelector("[name=verifyEmailErrorPath]").value.replace(/.html/g,"").trim(),i=new FormData,n=document.createElement("div"),o=document.createElement("span");n.setAttribute("class","email-verify-spinner overlay"),o.setAttribute("class","fa fa-spinner fa-pulse"),n.appendChild(o),document.body.appendChild(n),i.append("formName","verifyEmail"),i.append("pagePath",t),i.append("verificationCode",e),(0,l.NP)("emailVerificationStatus");var a=window.location.origin+t+"/jcr:content.verifyEmail.json";(0,r.B_)(a,i,null,null,null,this.verificationSuccess.bind(this),this.processError)}},{key:"verificationSuccess",value:function(e){var t=document.querySelector("[name=verifyEmailErrorPath]").value,i=(0,s.e)("hcmId");if(null!=e){var n=JSON.parse(e);"200"==n.statusCode&&null!=n.statusCode?(i?document.querySelector(".email-verify-review-msg").style.display="block":document.querySelector(".email-verify-success-msg").style.display="block",(0,l.TV)("emailVerificationStatus",!0,"")):null!=n.errorcode&&"106"==n.errorcode?((0,l.TV)("emailVerificationStatus","error",""),t&&""!=t&&(location.href=t,(0,l.TV)("emailVerificationStatus","error",""))):(0,l.TV)("emailVerificationStatus","error",""),document.querySelector(".email-verify-spinner").style.display="none"}}}])}())).init();var c=i(72940);(0,n.Qc)(),window.addEventListener("DOMContentLoaded",function(){u()});var u=function(){var e=document.querySelector("body").dataset,t=e.enableDelayedTealium,i=e.tealiumProfilename,n=e.tealiumEnv,o=e.delayedTealiumTimeout,a=parseInt(o)?parseInt(o):100;t&&"true"===t&&setTimeout(function(){var e,t;t=n,(e=i)&&(0,c.k0)("https://tags.tiqcdn.com/utag/astrazeneca/".concat(e,"/").concat(t,"/utag.js")).then(function(){console.log("utag successfully loaded")})},a)}}},i={};function n(e){var o=i[e];if(void 0!==o)return o.exports;var a=i[e]={exports:{}};return t[e].call(a.exports,a,a.exports,n),a.exports}n.m=t,e=[],n.O=function(t,i,o,a){if(!i){var r=1/0;for(u=0;u<e.length;u++){i=e[u][0],o=e[u][1],a=e[u][2];for(var s=!0,l=0;l<i.length;l++)(!1&a||r>=a)&&Object.keys(n.O).every(function(e){return n.O[e](i[l])})?i.splice(l--,1):(s=!1,a<r&&(r=a));if(s){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[i,o,a]},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.j=3913,function(){var e={3913:0};n.O.j=function(t){return 0===e[t]};var t=function(t,i){var o,a,r=i[0],s=i[1],l=i[2],c=0;if(r.some(function(t){return 0!==e[t]})){for(o in s)n.o(s,o)&&(n.m[o]=s[o]);if(l)var u=l(n)}for(t&&t(i);c<r.length;c++)a=r[c],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(u)},i=self.webpackChunkintelligentcontent_clientlibs=self.webpackChunkintelligentcontent_clientlibs||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}();var o=n.O(void 0,[3444],function(){return n(97091)});o=n.O(o)}();
