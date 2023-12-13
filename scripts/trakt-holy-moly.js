// ==UserScript==
// @name         Holy Moly on trakt.tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace "Totally Ninja!" by "Holy Moly"
// @author       Sam
// @match        *://trakt.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if ratingsText exists and is an array
    if (window.ratingsText) {
        window.ratingsText[10] = "Holy Moly";
    }
})();
