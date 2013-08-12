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

