/*
 * Copyright (C) 2008-2010 Surevine Limited.
 *   
 * Although intended for deployment and use alongside Alfresco this module should
 * be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
 * http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
(function($) {

    /**
     * Check whether the current browser supports the 'sticky scroller' feature.
     * 
     * @return {boolean} true if the current browser supports the 'sticky scroller' feature, false otherwise
     */
    $.isStickyScrollerSupported = function() {
        return !$.browser.msie || $.browser.version >= 7;
    }
    
    /**
     * Check whether the requested element is currently sticky
     * 
     * @return {boolean} true if the requested element is currently sticky, false otherwise
     */
    $.fn.isSticky = function() {
        return $(this).data('sticky-scroller-original-css') != undefined;
    }
    
    /**
     * Returns any placeholder for the specified element created by this component
     * 
     * @return {object} Any placeholder for the requested element created by this component
     */
    $.fn.stickyPlaceHolder = function() {
        return $('#' + $(this).attr('id') + 'sticky-scroller-placeholder');
    }
    
    /**
     * Makes the requested element(s) sticky
     * 
     * @param top {integer} Number of pixels from the top of the viewport to fix the requested element
     */
    $.fn.makeSticky = function(top) {
        if ($.isStickyScrollerSupported() && !$(this).isSticky()) {
            var placeHolderId = $(this).attr('id') + 'sticky-scroller-placeholder';
    
            // Preserve original styling
            var originalCss = {
                'position': $(this).css('position'),
                'width': $(this).outerWidth() == this[0].style.width == '' || this[0].style.width == 'auto' ? 'auto' : $(this).css('width'),
                'top': $(this).css('top'),
                'z-index': $(this).css('z-index')
            };
            $(this).data('sticky-scroller-original-css', originalCss);

            // Create a placeholder of equal height to the sticky element to preserve vertical positioning of any subsequent content
            $(this).after('<div id="' + placeHolderId + '"></div>');
            $('#'+placeHolderId).height($(this).outerHeight(true));
    
            // Fix the sticky element the requested number of pixels from the top of the viewport
            $(this).css('width', $(this).css('width'));
            $(this).css('position', 'fixed');
            $(this).css('top', top + 'px');
            
            // Move sticky elements above normally positioned elements, but preserve original z ordering between sticky elements
            $(this).css('z-index', isNaN(originalCss['z-index']) ? '10' : parseInt(originalCss['z-index']) + 10);
        }
    }

    /**
     * Restore the requested elements to their original position
     */
    $.fn.unSticky = function() {
        if ($.isStickyScrollerSupported() && $(this).isSticky()) {
            // Restore original styling and remove placeholder
            var originalCss = $(this).data('sticky-scroller-original-css');
            $(this).css(originalCss);
            $(this).removeData('sticky-scroller-original-css');
            $(this).stickyPlaceHolder().remove();
        }
    }

    /**
     * Makes the requested element(s) sticky.
     * 
     * Any elements specified in 'otherElements' are also made sticky when this element reaches the top of the viewport, and will
     * maintain their original positioning relative to this element.
     * 
     * @param otherElements {object} Other elements to be made sticky when this element reaches the top of the viewport (optional)
     */
    $.fn.stickyScroller = function(otherElements) {
        if ($.isStickyScrollerSupported()) {
            $(this).waypoint(function(event, direction) {
                if (direction == 'down') {
                    if (otherElements) {
                        var trigger = $(this);
                        otherElements.each(function() {
                            $(this).makeSticky($(this).offset().top - trigger.offset().top);
                        });
                    }
                    $(this).makeSticky(0);
                } else {
                    $(this).unSticky();
                    if (otherElements) {
                        otherElements.unSticky();
                    }
                }
            });
        }
    };
    
    /**
     * As per stickyScroller(), but registers listeners for YUI onResize() events to ensure any sticky elements inside YUI resize
     * controls scale horizontally when required
     * 
     * @param otherElements {object} Other elements to be made sticky when this element reaches the top of the viewport (optional)
     */
    $.fn.resizingStickyScroller = function(otherElements) {
        $(this).stickyScroller(otherElements);        
        
        var all = $(this);
        if (otherElements) {
           $.merge(all, otherElements);    
        }

        all.each(function() {
            var el = $(this);
            YAHOO.Bubbling.on("onResize", function(layer, args) {
                if (el.isSticky()) {
                    el.width(el.width() - args[1].dx);
                }
            });
        });
    }
})(jQuery);
