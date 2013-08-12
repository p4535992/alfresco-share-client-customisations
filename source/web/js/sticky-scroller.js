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