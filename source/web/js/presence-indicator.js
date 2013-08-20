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
Alfresco.thirdparty.presence = Alfresco.thirdparty.presence || {};

/**
 * Returns a human readable, one-word description of the specified availability code (suitable for use in dialogs
 * or CSS classes)
 * 
 * @method Alfresco.thirdparty.presence.getDisplayAvailability
 * @param availability {string} Availability code
 * @return {string} Human readable representation of the specified availability state 
 * @static
 */
Alfresco.thirdparty.presence.getDisplayAvailability = function(availability) {
	var displayAvailability;
	      
	switch (availability) {
		case "ONLINE":
			displayAvailability = "online";
			break;
		case "BUSY":
			displayAvailability = "busy";
			break;
		case "AWAY":
			displayAvailability = "away";
			break;
		case "OFFLINE":
			displayAvailability = "offline";
			break;
		default:
			displayAvailability = "unknown";
	}
	
	return displayAvailability;
};

/**
 * Returns a human readable description of the specified user's availability, based on the specified availability code
 * 
 * @method Alfresco.thirdparty.presence.getAvailabilityLine
 * @param displayName {string} Specifies how the user's name should appear in the generated description
 * @param availability {string} Availability code
 * @return {string} Human readable representation of the specified availability state 
 * @static
 */
Alfresco.thirdparty.presence.getAvailabilityLine = function(displayName, availability) {
	if (availability == 'UNKNOWN') {
		return 'Unable to retrieve status for ' + displayName;
	} else {
		return displayName + ' is ' + Alfresco.thirdparty.presence.getDisplayAvailability(availability) + ' in chat';
	}
};


/**
 * Launches a chat session for the current user with the supplied userName
 * @method Alfresco.thirdparty.presence.launchChatWithUserName
 * @param userName {string} the user id of the selected presence indicator
 * @param openFireIpAddress {string} the ip address of the openfire server
 * @return
 **/
Alfresco.thirdparty.presence.launchChat = function(userName,openFireIpAddress) {
    document.domain = "@@document.domain@@";
    if (userName && openFireIpAddress) {

        var remoteLaunchChatFromSpaceJID = userName + '@' + openFireIpAddress;

        // More validation, don't attempt to chat with oneself
        if (Alfresco.constants.USERNAME != userName) {
            var chatAppUrl =  window.location.protocol + "//@@chat.host@@/@@chat.path@@";
            var pageToLoad = chatAppUrl + "/?jid=" + remoteLaunchChatFromSpaceJID;            
            var chatLoaded;
            
            try {
            	if(typeof chatWindow == undefined  || chatWindow == null || chatWindow.closed || chatWindow.location.toString().indexOf(chatAppUrl) == -1) {
            		chatLoaded = false;
            	}
            	else {
            		chatLoaded = true;
            	}
            }
            catch(err) {
            	chatLoaded = false;
            }
            
            if (!chatLoaded) {
                
            	chatWindow = window.open(pageToLoad);
                
                // Force Firefox tab / window switch
                if(navigator.userAgent.indexOf("Firefox") != -1) {
                  chatWindow.alert("Chat conversation has been started from Space.");
                }

            } else {
                chatWindow.rosterAction(remoteLaunchChatFromSpaceJID);
                // Force Firefox tab / window switch
                if(navigator.userAgent.indexOf("Firefox") != -1) {
                	chatWindow.alert("Chat conversation has been started from Space.");
                }
                chatWindow.focus();
            }
       } else {
           alert("Chat will not be launched, it appears you are trying to chat with yourself.")
       }
   } else {
       // Either of the expected arguments were non-truthy
       alert("Could not initiate chat, invalid user or chat host");
   }
}


/**
 * Returns markup for a presence indicator and user profile link for the specified user
 * 
 * Displays a button to indicate presence, and also initiate chat conversation. This button is disabled when either the
 * availability is UNKNOWN or OFFLINE or when the serviceEnabled value for chat is false.
 * 
 * @method Alfresco.thirdparty.presence.getPresenceIndicatorHtml
 * @param userName {string} User's id
 * @param displayName {string} Specified how the user's name should appear in presence indicator and tooltip
 * @param presence {object} The Alfresco webscript presence model object.
 * @return {string} Markup for a presence indicator and user profile link for the specified user
 */
Alfresco.thirdparty.presence.getPresenceIndicatorHtml = function(userName, displayName, presence) {
	
	var displayAvailability = Alfresco.thirdparty.presence.getDisplayAvailability(presence.availability);
	var availabilityLine = Alfresco.thirdparty.presence.getAvailabilityLine(displayName,presence. availability);
	
	var availability = presence.availability;
	var serviceEnabled = presence.serviceEnabled;
	
	var uri = Alfresco.util.uriTemplate("userprofilepage",
			{
				userid: userName
			});
	
	var markup = '<div class="presence">';
	markup += ' <button class="presence-indicator ' + Alfresco.util.encodeHTML(displayAvailability) + ' " type="button" title="' +  Alfresco.util.encodeHTML(availabilityLine) + '" ' ;
	if (serviceEnabled=='false' || availability == 'UNKNOWN' || availability == 'OFFLINE')
	{
		markup+=' disabled="disabled" ';
	} else
	{
		markup += ' onclick="Alfresco.thirdparty.presence.launchChat(\'' + Alfresco.util.encodeHTML(userName) + '\',\''  +  Alfresco.util.encodeHTML(presence.host) + '\')" ';
	}
	markup += '>&nbsp;</button>';
	markup += '<div class="presence-username">';
	markup += '<a  href="' + uri + '">' + Alfresco.util.encodeHTML(displayName) + '</a>';
	markup += '</div></div>';
	
	return markup;
	
};

(function($) {

	/**
	 * Renders a presence indicator for the specified user in the specified container
	 * 
	 * @param userName {string} User's id
	 * @param displayName {string} Specified how the user's name should appear in presence indicator and tooltip
 	 * @param presence {object} The Alfresco webscript presence model object.
	 */
	$.fn.presenceIndicator = function(userName, displayName, presence) {
		$(this).html(Alfresco.thirdparty.presence.getPresenceIndicatorHtml(userName, displayName,presence));
	};
	
	
})(jQuery);
