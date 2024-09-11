// ==UserScript==
// @name         "Same Date" button on Trakt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a "same date" button when viewing other peoples play histories, so you can save a play at the same date
// @author       Sam
// @match        *://trakt.tv/users/*/history
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function injectCSS() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.popover.remove.with-datepicker.fade.bottom.in { max-width: 600px !important; }';
        document.head.appendChild(style);
    }

    function overrideActionWatchPopup() {
        if (typeof window.actionWatchPopup === 'function') {
            console.log("Overriding original popup");

            var originalActionWatchPopup = window.actionWatchPopup;

            window.actionWatchPopup = function(attach, action, forceAdd, triggerMetadata) {
                console.log("Call to modified popup");

                originalActionWatchPopup(attach, action, forceAdd, triggerMetadata);

                attach.on('shown.bs.popover', function () {
                    var popoverContent = $(this).siblings('.popover').find('.popover-content');

                    if (popoverContent.find('.same-date').length === 0) {
                        popoverContent.append('<button class="btn btn-primary same-date">Same date</button>');
                    }

                    popoverContent.find('.same-date').off('click').on('click', function() {
                        var gridItem = $(this).closest('.grid-item');
                        var formatDateField = gridItem.find('.format-date');

                        if (formatDateField.length > 0) {
                            var dateValue = formatDateField.text();

                            actionWatch(gridItem, 'watch', false, dateValue, false);
                            console.log('ActionWatch triggered with date:', dateValue);
                        } else {
                            console.log('No .format-date field found');
                        }
                    });

                });
            };
            console.log("actionWatchPopup overridden successfully.");
        }
    }

    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                if (typeof window.actionWatchPopup === 'function') {
                    overrideActionWatchPopup();
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    injectCSS();

    observer.observe(document, { childList: true, subtree: true });
})();
