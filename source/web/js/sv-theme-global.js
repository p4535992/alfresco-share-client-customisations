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
var Surevine = {};

YAHOO.util.Event.onDOMReady(function() {
	// Attach a click event to the help link
	YAHOO.util.Event.on(YAHOO.util.Selector.query('.eslHelpLink a'), "click", function(e) {
	    YAHOO.util.Event.stopEvent(e);

        var panel = new YAHOO.widget.Dialog("eslHelpPopup",
            {
               modal: true,
               visible: true,
               close: true,
               draggable: true,
               effect:
               {
                  effect: YAHOO.widget.ContainerEffect.FADE,
                  duration: 0.5
               },
               zIndex: 1000,
               width: "400px",
               height: "300px"
            });
        panel.setHeader('<h3>Help</h3>');
	    panel.setBody('<span class="loading">Loading...</span>');
	    panel.render(document.body);
	    panel.center();
	    
	    Alfresco.util.Ajax.request(
    		{
    			url: Alfresco.constants.URL_SERVICECONTEXT + "sv-theme/help/esl-help-html",
    			successCallback: {
    				fn: function(response) {
	    				panel.setBody(response.serverResponse.responseText);
	    			},
	    			scope: this
    			},
    			failureCallback: {
    				fn: function() {
	    				panel.setBody("Failed to load help text");
	    			},
	    			scope: this
    			}
    		}
	    );
	});
});

//Uses the site name to determine whether or not the site is a deleted items site - note that this does not interact cleanly with the backend services which allow this value
//to be changed via Spring - if the site name postfix is changed in spring, it will need to be changed here, too
function isCurrentSiteDeletedItemsSite()
{
	var siteName = Alfresco.constants.SITE;
	return (siteName.indexOf('deletedItems')!=-1);
}

SurevineValidators = {
	mandatory: function(field, args, event, form, silent, message)
	{
	   if (Alfresco.logger.isDebugEnabled())
	      Alfresco.logger.debug("Validating mandatory state of field '" + field.id + "'");
	   
	   var valid = true; 
	      
	   if (field.type && field.type == "radio")
	   {
	      // TODO: Do we actually need to support this scenario?
	      //       wouldn't a radio button normally have a default
	      //       'checked' option?
	      
	      var formElem = YAHOO.util.Dom.get(form.formId),
	         radios = formElem[field.name],
	         anyChecked = false;
	      for (var x = 0, xx = radios.length; x < xx; x++)
	      {
	         if (radios[x].checked)
	         {
	            anyChecked = true;
	            break;
	         }
	      }
	      
	      valid = anyChecked;
	   }
	   else
	   {
	      valid = YAHOO.lang.trim(field.value).length !== 0;
	   }
	   
	   if (!valid && !silent && form)
	   {
	      // if the keyCode from the event is the TAB or SHIFT keys don't show the error
	      if (event && event.keyCode != 9 && event.keyCode != 16 || !event)
	      {
	         var msg = (message != null) ? message : "is mandatory.";
	         form.addError(form.getFieldLabel(field.id) + " " + msg, field);
	      }
	   }
	   
	   return valid; 
	}
};

