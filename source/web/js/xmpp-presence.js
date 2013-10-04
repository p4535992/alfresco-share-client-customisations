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
Alfresco.thirdparty.xmpp = Alfresco.thirdparty.xmpp || {};

// Levels of polling frequency
Alfresco.thirdparty.xmpp.pollFastIntervalMillis = 5000; // 5 seconds
Alfresco.thirdparty.xmpp.pollSlowIntervalMillis = 45000; // 45 seconds

// Current polling frequency for presence & message notifications (variable)
Alfresco.thirdparty.xmpp.pollInterval = 5000; // Initially set to 5 seconds (fast interval)
Alfresco.thirdparty.xmpp.otherUserPollInterval = 20000; // Poll for other users' presence every 20 seconds
Alfresco.thirdparty.xmpp.otherUserPollOnlineBias=3; // Poll just for online users 3 times as much as for offline users. 
													// So, if otherUserPollInterval = 20 seconds and this = 3, then the
													// system will refresh the presence of online/busy users every 20 seconds
													// and of offline users every 60 seconds
Alfresco.thirdparty.xmpp.otherUserPollOnlineBiasCount=0;
Alfresco.thirdparty.xmpp.userQueryLimit=75;

// Set cookie lifespans
Alfresco.thirdparty.xmpp.lastKnownCookieExpiryInMins = 15;
Alfresco.thirdparty.xmpp.lastPolledCookieExpiryInMins = 15;
Alfresco.thirdparty.xmpp.lastSetCookieExpiryInMins = 1440;
Alfresco.thirdparty.xmpp.userChatEnabledCookieExpiryInMins = 1440;

// Error threshold (number of consecutive errors before which we display errors to user)
Alfresco.thirdparty.xmpp.errorThreshold = 3;

// Minutes to have expired since last 'activity' before we consider it to be non-recent, and switch to slower polling frequency
Alfresco.thirdparty.xmpp.recentActivityThresholdInMins = 3;

// Default presence for users with no presence established
Alfresco.thirdparty.xmpp.defaultPresence = { "mode": "available", "status": "", "source": "space" };

// Text strings
Alfresco.thirdparty.xmpp.UnreadMessageWindowTitle = "You have unread chat messages.";

// Store last known presence / messages to avoid having to compare with DOM
Alfresco.thirdparty.xmpp.lastKnownPresence = Alfresco.thirdparty.xmpp.lastKnownPresence || '';
Alfresco.thirdparty.xmpp.lastKnownMessages = Alfresco.thirdparty.xmpp.lastKnownMessages || '{ "count": "0", "messages": [] }';

// Error counters
Alfresco.thirdparty.xmpp.presenceErrorCount = Alfresco.thirdparty.xmpp.presenceErrorCount || 0;
Alfresco.thirdparty.xmpp.messageErrorCount = Alfresco.thirdparty.xmpp.messageErrorCount || 0;

// Flags to track whether chat error / open messages are being displayed
Alfresco.thirdparty.xmpp.chatPresenceErrorActive = Alfresco.thirdparty.xmpp.chatPresenceErrorActive || false;
Alfresco.thirdparty.xmpp.chatPresenceOpenActive = Alfresco.thirdparty.xmpp.chatPresenceOpenActive || false; 
Alfresco.thirdparty.xmpp.chatMessagesErrorActive = Alfresco.thirdparty.xmpp.chatMessagesErrorActive || false;
Alfresco.thirdparty.xmpp.chatMessagesOpenActive = Alfresco.thirdparty.xmpp.chatMessagesOpenActive || false; 

// Flag to track time of last activity
Alfresco.thirdparty.xmpp.lastActivity = Alfresco.thirdparty.xmpp.lastActivity || 0;

// IE6 console fix (prevent errors being thrown)
if (typeof console == "undefined") {
    var console = { log: function() {} };  	
}

/**
 * Retrieve presence of current user
 */
Alfresco.thirdparty.xmpp.getPresence = function() {
	
	// Store last polled timestamp
	Alfresco.thirdparty.xmpp.setCookie("lastPolled", new Date().getTime(), Alfresco.thirdparty.xmpp.lastPolledCookieExpiryInMins);

	YAHOO.util.Connect.asyncRequest('GET', "/share/proxy/alfresco/surevine/xmpp/presence", Alfresco.thirdparty.xmpp.getPresenceCallback, null);	
};


/**
 * Callback functions for getPresence
 */
Alfresco.thirdparty.xmpp.getPresenceCallback = {
		
	success: function(response) {
		
		var data = YAHOO.lang.JSON.parse(response.responseText);
		var presence = data.presences[0];
		
		// Handle offline presence
		if(presence.mode=="offline") {
			
			var lastSetPresenceString = Alfresco.thirdparty.xmpp.getCookie("lastSetPresence");
			if(lastSetPresenceString!=undefined) {
				var lastSetPresence = YAHOO.lang.JSON.parse(lastSetPresenceString);
			}

			if(lastSetPresence!=undefined && lastSetPresence.mode!=undefined && lastSetPresence.mode!="") {
				// Set presence from last used
				Alfresco.thirdparty.xmpp.setPresence(lastSetPresence.mode,lastSetPresence.status);
			}
			else {
				// Set presence from default
				Alfresco.thirdparty.xmpp.setPresence(Alfresco.thirdparty.xmpp.defaultPresence.mode,"");
			}
			
		}
		else {
			
			if(presence.source=="chat") {
				// Show chat 
				Alfresco.thirdparty.xmpp.renderChatOpen(presence);
			}
			else {
				// Poll messages
				Alfresco.thirdparty.xmpp.getMessages();
				// Update presence UI
				Alfresco.thirdparty.xmpp.renderPresence(presence, false);
			}
			
		}
			
		// Reset error count
		Alfresco.thirdparty.xmpp.presenceErrorCount = 0;
		
		// reset poll interval if required, unless chat is open (as we force faster polling rate in that case) 
		if(presence.source!="chat") {
			Alfresco.thirdparty.xmpp.resetpollInterval();
		}
		
	},
	failure: function(response) {	
		
		// Increment error count
		Alfresco.thirdparty.xmpp.presenceErrorCount++;
		
		if(Alfresco.thirdparty.xmpp.presenceErrorCount >= Alfresco.thirdparty.xmpp.errorThreshold) {
			// Render error message
			Alfresco.thirdparty.xmpp.renderChatError();
		}
	}
};


/**
 * Check unread messages for user
 */
Alfresco.thirdparty.xmpp.getMessages = function() {
	YAHOO.util.Connect.asyncRequest('GET', "/share/proxy/alfresco/surevine/xmpp/message-summary", Alfresco.thirdparty.xmpp.getMessagesCallback, null);
};


/**
 * Callback functions for getMessages
 */
Alfresco.thirdparty.xmpp.getMessagesCallback = {
			
	success: function(response) {
		
		var messageData = YAHOO.lang.JSON.parse(response.responseText);
		
		// Update messages UI
		Alfresco.thirdparty.xmpp.renderMessages(messageData, false);
		
		// Reset error count
		Alfresco.thirdparty.xmpp.messageErrorCount = 0;
		
	},
	failure: function(response) {
		
		// Increment error count
		Alfresco.thirdparty.xmpp.messageErrorCount++;
		
		if(Alfresco.thirdparty.xmpp.messageErrorCount >= Alfresco.thirdparty.xmpp.errorThreshold) {
			// Render error message
			Alfresco.thirdparty.xmpp.renderChatError();
		}
	}
	
};


/**
 * Reads submitted form data and calls setPresence
 * @param event form submit event
 */
Alfresco.thirdparty.xmpp.presenceFormSubmit = function(event) {
	
	// default mode
    var mode = Alfresco.thirdparty.xmpp.defaultPresence.mode;
    
	var modeOptions = document.getElementsByName("setPresenceMode");
    for (var i=0, len=modeOptions.length; i<len; ++i) {
    	if (modeOptions[i].checked) {
    		mode = modeOptions[i].value;
    	}
    }
    
    var status = document.getElementById("setPresenceStatus").value;
    
    // encode status message
    status = YAHOO.lang.trim(status);
    status = status.replace(/£/g,"");
    status = status.replace(/"/g,"");
    status = encodeURIComponent(status);
    
	Alfresco.thirdparty.xmpp.setPresence(mode, status);
	
    // Prevent form submission
    YAHOO.util.Event.preventDefault(event);
	
};


/**
 * Callback functions on response of setPresence
 */
Alfresco.thirdparty.xmpp.setPresenceCallback = {	
		
	success: function(response) {
		
		var data = YAHOO.lang.JSON.parse(response.responseText);
		
		if(data.result=="true") {
			
			// Store last set presence cookie
			Alfresco.thirdparty.xmpp.setCookie("lastSetPresence", YAHOO.lang.JSON.stringify(data.presence), Alfresco.thirdparty.xmpp.lastKnownCookieExpiryInMins);
			
			// Render set presence
			Alfresco.thirdparty.xmpp.renderPresence(data.presence, true);
			
			// Refresh messages
			var lastKnownMessages = YAHOO.lang.JSON.parse(Alfresco.thirdparty.xmpp.lastKnownMessages);
			Alfresco.thirdparty.xmpp.renderMessages(lastKnownMessages, true);
			
			// Collapse presence control
			if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active")) {
				Alfresco.thirdparty.xmpp.togglePresenceForm();
			}
			
			// Update last activity stamp
			Alfresco.thirdparty.xmpp.lastActivity = new Date().getTime();
			// Adjust polling
			Alfresco.thirdparty.xmpp.resetpollInterval();

		}
		else {
			console.log("Error setting presence for "+Alfresco.constants.USERNAME);
		}
		
	},
	failure: function(response) {
		// Replace loading spinner with blank presence icon
		Alfresco.thirdparty.xmpp.currentPresenceLabel.className = '';
		console.log("Error setting presence for "+Alfresco.constants.USERNAME);
	}
};


/**
 * Set presence for current user
 * @param mode presence mode to set  
 * @param status customer string message
 */
Alfresco.thirdparty.xmpp.setPresence = function(mode, status) {
	// Display loading icon
	Alfresco.thirdparty.xmpp.currentPresenceLabel.className = "loading";
	var setPresenceUrl = "/share/proxy/alfresco/surevine/xmpp/presence?presence="+mode+"&status="+status;
	YAHOO.util.Connect.asyncRequest("POST", setPresenceUrl, Alfresco.thirdparty.xmpp.setPresenceCallback, null);
};


/**
 * Reset controls from any 'special' state (chat open or error)
 */
Alfresco.thirdparty.xmpp.resetControls = function() {
	
	// Disable Chat error tooltip
	Alfresco.thirdparty.xmpp.chatErrorTooltip.cfg.setProperty("disabled", true); 
	// Disable Chat open tooltip
	Alfresco.thirdparty.xmpp.chatOpenTooltip.cfg.setProperty("disabled", true); 	
}


/**
 * Display chat error notification
 */
Alfresco.thirdparty.xmpp.renderChatError = function() {	
	
	if(Alfresco.thirdparty.xmpp.chatPresenceErrorActive) {
		// Chat error already active, do nothing
		return;
	}
	else {
		
		if(Alfresco.thirdparty.xmpp.chatPresenceOpenActive) {
			// Chat open were previously displayed. Remove tooltips
			Alfresco.thirdparty.xmpp.resetControls();
		}
		
		// Draw error
		Alfresco.thirdparty.xmpp.currentPresenceLabel.title = "";
		Alfresco.thirdparty.xmpp.currentPresenceLabel.className = "chat-error";
		Alfresco.thirdparty.xmpp.unreadMessagesLabel.innerHTML = "Chat Application Error";
		Alfresco.thirdparty.xmpp.unreadMessagesLabel.className = "";
		
		// Disable controls
		Alfresco.thirdparty.xmpp.disablePresenceControls();
		
		// Enable Chat error tooltip
		Alfresco.thirdparty.xmpp.chatErrorTooltip.cfg.setProperty("disabled", false); 
		
		// Set flag active
		Alfresco.thirdparty.xmpp.chatPresenceErrorActive = true;
		Alfresco.thirdparty.xmpp.chatMessagesErrorActive = true;
		
	}
	
}


/**
 * Display chat open notification
 * @param presence presence to render (from chat)
 */
Alfresco.thirdparty.xmpp.renderChatOpen = function(presence) {
	
	if(presence==null || presence==undefined) {
		console.log("Alfresco.thirdparty.xmpp.renderChatOpen(presence): presence was null or undefined. Cannot render chat open message.");
		return;
	}
	
	if(!Alfresco.thirdparty.xmpp.chatPresenceOpenActive) {
		
		if(Alfresco.thirdparty.xmpp.chatPresenceErrorActive) {
			// Chat error was previously displayed. Remove tooltips
			Alfresco.thirdparty.xmpp.resetControls();
		}
		
		// Draw chat open message
		Alfresco.thirdparty.xmpp.unreadMessagesLabel.innerHTML = "Chat Application Active";
		Alfresco.thirdparty.xmpp.unreadMessagesLabel.className = "chat-open";
		
		// Reset last known messages as they are/have been consumed by chat
		Alfresco.thirdparty.xmpp.lastKnownMessages = '{ "count": "0", "messages": [], "reset": "true" }';
		
		// Reset any unread message notifications
		Alfresco.thirdparty.xmpp.unreadMessagesNotifications.innerHTML = "";
		
		// Reset window title
		window.document.title = Alfresco.thirdparty.xmpp.originalWindowTitle;
		
		// Disable controls
		Alfresco.thirdparty.xmpp.disablePresenceControls();
		
		// Enable Chat open tooltip
		Alfresco.thirdparty.xmpp.chatOpenTooltip.cfg.setProperty("disabled", false); 
		
		// Switch polling to fast rate (to detect chat closures quicker)
		Alfresco.thirdparty.xmpp.pollInterval = Alfresco.thirdparty.xmpp.pollFastIntervalMillis;
		window.clearInterval(Alfresco.thirdparty.xmpp.presencePoll);
		Alfresco.thirdparty.xmpp.presencePoll = window.setInterval(function(){
			Alfresco.thirdparty.xmpp.getPresence();
		}, Alfresco.thirdparty.xmpp.pollInterval);
		
		// Set flag active
		Alfresco.thirdparty.xmpp.chatPresenceOpenActive = true;
		Alfresco.thirdparty.xmpp.chatMessagesOpenActive = true;
		
	}
	
	// Capitalize mode for use as label
	var modeLabel = presence.mode.charAt(0).toUpperCase() + presence.mode.slice(1);
	
	// Draw presence
	Alfresco.thirdparty.xmpp.currentPresenceLabel.title = modeLabel;
	if(presence.status != undefined && presence.status != "") {
		Alfresco.thirdparty.xmpp.currentPresenceLabel.title +=" - "+presence.status;
	}
	Alfresco.thirdparty.xmpp.currentPresenceLabel.className = presence.mode;
	
}


/**
 * Display presence
 * @param presence presence to display
 * @param forceRender always draw new presence 
 */
Alfresco.thirdparty.xmpp.renderPresence = function(presence, forceRender) {
	
	if(presence==null || presence==undefined) {
		console.log("Alfresco.thirdparty.xmpp.renderPresence(presence): presence was null or undefined. Cannot render presence.");
		return;
	}
	
	var presenceString = YAHOO.lang.JSON.stringify(presence);
	
	if(Alfresco.thirdparty.xmpp.chatPresenceErrorActive || Alfresco.thirdparty.xmpp.chatPresenceOpenActive) {
		// Chat error/open were previously displayed. Remove tooltips
		Alfresco.thirdparty.xmpp.resetControls();
		
		// Capitalize mode for use as label
		var modeLabel = presence.mode.charAt(0).toUpperCase() + presence.mode.slice(1);
		
		// Draw presence
		Alfresco.thirdparty.xmpp.currentPresenceLabel.title = modeLabel;
		if(presence.status != undefined && presence.status != "") {
			Alfresco.thirdparty.xmpp.currentPresenceLabel.title +=" - "+presence.status;
		}
		Alfresco.thirdparty.xmpp.currentPresenceLabel.className = presence.mode;
		
		// Update selected option in set presence form
		if(presence.mode!="busy") {
			YAHOO.util.Dom.setAttribute("availablePresence", "checked", "checked");
		}
		else {
			YAHOO.util.Dom.setAttribute("busyPresence", "checked", "checked");
		}

		// Enable controls
		Alfresco.thirdparty.xmpp.enablePresenceControls();
		
		// clear the state flags
		Alfresco.thirdparty.xmpp.chatPresenceErrorActive = false;
		Alfresco.thirdparty.xmpp.chatPresenceOpenActive = false;
		
	}
	else {
		
		if((presenceString!=Alfresco.thirdparty.xmpp.lastKnownPresence) || forceRender) {
			
			// Capitalize mode for use as label
			var modeLabel = presence.mode.charAt(0).toUpperCase() + presence.mode.slice(1);
			
			// Draw presence
			Alfresco.thirdparty.xmpp.currentPresenceLabel.title = modeLabel;
			if(presence.status != undefined && presence.status != "") {
				Alfresco.thirdparty.xmpp.currentPresenceLabel.title +=" - "+presence.status;
			}
			Alfresco.thirdparty.xmpp.currentPresenceLabel.className = presence.mode;
			
			// Update selected option in set presence form
			if(presence.mode!="busy") {
				YAHOO.util.Dom.setAttribute("availablePresence", "checked", "checked");
			}
			else {
				YAHOO.util.Dom.setAttribute("busyPresence", "checked", "checked");
			}
			
		}
		
	}
	
	if(presenceString!=Alfresco.thirdparty.xmpp.lastKnownPresence) {	
		// Update last known presence
		Alfresco.thirdparty.xmpp.lastKnownPresence = presenceString;
		Alfresco.thirdparty.xmpp.setCookie("lastKnownPresence", presenceString, Alfresco.thirdparty.xmpp.lastKnownCookieExpiryInMins);
		// Update last activity stamp
		Alfresco.thirdparty.xmpp.lastActivity = new Date().getTime();
	}
	
}


/**
 * Draw new messages to DOM
 * @param messageData messages to draw
 * @param forceRender always draw messages
 */
Alfresco.thirdparty.xmpp.renderMessages = function(messageData, forceRender) {
	
	if(messageData==null || messageData==undefined) {
		console.log("Alfresco.thirdparty.xmpp.renderMessages(messageData): messageData was null or undefined. Cannot render messages.");
		return;
	}
	
	var messageString = YAHOO.lang.JSON.stringify(messageData);
	
	if(Alfresco.thirdparty.xmpp.chatMessagesErrorActive || Alfresco.thirdparty.xmpp.chatMessagesOpenActive) {
		
		// Chat error/open were previously displayed. Remove tooltips
		Alfresco.thirdparty.xmpp.resetControls();
		
		// draw messages
		if(messageData.count==0) {
			
			// Display unread message count in control
			Alfresco.thirdparty.xmpp.unreadMessagesLabel.innerHTML = "No Unread Messages";
			YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesLabel, "unread");
			
			// Clear any previous message notifications
			Alfresco.thirdparty.xmpp.unreadMessagesNotifications.innerHTML = "";
			
			// Reset window title
			window.document.title = Alfresco.thirdparty.xmpp.originalWindowTitle;
			
			YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesNotifications, "empty");
			
		}
		else {
			
			// Display unread message count in control
			Alfresco.thirdparty.xmpp.unreadMessagesLabel.innerHTML = "Unread Messages ("+messageData.count+")";
			YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesLabel, "unread");
			
			// Build notifications
			var notificationString = "";
			for (var i = 0; i < messageData.messages.length; i++) {
				var contact = messageData.messages[i];
				notificationString += '<p class="messageNotification"><img src="/share/proxy/alfresco/sv-theme/user-profile/avatar?user='+contact.userName+'&size=smallAvatar" alt="'+contact.userName+'" />'
										+'<span class="messageNotificationName">'+contact.displayName+'</span>'
										+'<span class="yui-button messageNotificationButton"><span class="first-child"><a href="http://@@chat_host@@/@@chat_path@@/" target="_blank">'+contact.count+'</a></span></span>'
										+'<span class="clearfix"></span>'
										+'</p>';
			}
			// Build any invites
			for(var i = 0; i < messageData.invites.length; i++) {
				var invite = messageData.invites[i];
				notificationString += '<p class="inviteNotification"><span class="inviteText">You have been invited to</span><span class="groupChatName">'+invite.groupChatName+'</span>'
									+'<span class="yui-button inviteNotificationButton"><span class="first-child"><a href="http://@@chat_host@@/@@chat_path@@/" target="_blank">Join</a></span></span>'
									+'<span class="clearfix"></span>'
									+'</p>';
			}
			
			// Draw notifications / invites
			Alfresco.thirdparty.xmpp.unreadMessagesNotifications.innerHTML = notificationString;
			
			// Update window title
			window.document.title = "You have unread chat messages.";
			
			YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesNotifications, "empty");
			
		}
		
		// Enable controls
		Alfresco.thirdparty.xmpp.enablePresenceControls();
		
		// clear the state flags
		Alfresco.thirdparty.xmpp.chatMessagesErrorActive = false;
		Alfresco.thirdparty.xmpp.chatMessagesOpenActive = false;
		
	}
	else {
		
		if(messageString!=Alfresco.thirdparty.xmpp.lastKnownMessages || forceRender) {
			
			// draw messages
			if(messageData.count==0) {
				
				// Display unread message count in control
				Alfresco.thirdparty.xmpp.unreadMessagesLabel.innerHTML = "No Unread Messages";
				YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesLabel, "unread");
				
				// Clear any previous message notifications
				Alfresco.thirdparty.xmpp.unreadMessagesNotifications.innerHTML = "";
				
				// Reset window title
				window.document.title = Alfresco.thirdparty.xmpp.originalWindowTitle;
				
				YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesNotifications, "empty");
				
			}
			else {
				
				// Display unread message count in control
				Alfresco.thirdparty.xmpp.unreadMessagesLabel.innerHTML = "Unread Messages ("+messageData.count+")";
				YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesLabel, "unread");
				
				// Build notifications
				var notificationString = "";
				for (var i = 0; i < messageData.messages.length; i++) {
					var contact = messageData.messages[i];
					notificationString += '<p class="messageNotification"><img src="/share/proxy/alfresco/sv-theme/user-profile/avatar?user='+contact.userName+'&size=smallAvatar" alt="'+contact.userName+'" />'
											+'<span class="messageNotificationName">'+contact.displayName+'</span>'
											+'<span class="yui-button messageNotificationButton"><span class="first-child"><a href="http://@@chat_host@@/@@chat_path@@/" onclick="Alfresco.thirdparty.xmpp.chatLaunchHandler()" target="_blank">'+contact.count+'</a></span></span>'
											+'<span class="clearfix"></span>'
											+'</p>';
				}
				// Build any invites
				for(var i = 0; i < messageData.invites.length; i++) {
					var invite = messageData.invites[i];
					notificationString += '<p class="inviteNotification"><span class="inviteText">You have been invited to</span><span class="groupChatName">'+invite.groupChatName+'</span>'
										+'<span class="yui-button inviteNotificationButton"><span class="first-child"><a href="http://@@chat_host@@/@@chat_path@@/" onclick="Alfresco.thirdparty.xmpp.chatLaunchHandler()" target="_blank">Join</a></span></span>'
										+'<span class="clearfix"></span>'
										+'</p>';
				}
				
				// Draw notifications / invites
				Alfresco.thirdparty.xmpp.unreadMessagesNotifications.innerHTML = notificationString;
				
				// Update window title
				window.document.title = Alfresco.thirdparty.xmpp.UnreadMessageWindowTitle;
				
				YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesNotifications, "empty");
				
			}
			
			// Reposition expanded notifications
			var notificationsSize = YAHOO.util.Dom.getRegion("unreadMessagesWrapper");
			if(notificationsSize.bottom != undefined && notificationsSize.top != undefined) {
				var notificationsOffset = "-"+(notificationsSize.bottom - notificationsSize.top)+"px";
				YAHOO.util.Dom.setStyle('unreadMessagesWrapper', 'top', notificationsOffset); 
			}
			
			// Update last known messages
			Alfresco.thirdparty.xmpp.lastKnownMessages = messageString;
			Alfresco.thirdparty.xmpp.setCookie("lastKnownMessages", messageString, Alfresco.thirdparty.xmpp.lastKnownCookieExpiryInMins);
			
		}
		
		if(messageString!=Alfresco.thirdparty.xmpp.lastKnownMessages) {
			// Update last known messages
			Alfresco.thirdparty.xmpp.lastKnownMessages = messageString;
			Alfresco.thirdparty.xmpp.setCookie("lastKnownMessages",messageString,Alfresco.thirdparty.xmpp.lastKnownCookieExpiryInMins);
			// Update last activity stamp
			Alfresco.thirdparty.xmpp.lastActivity = new Date().getTime();
		}
		
	}
	
}


/**
 * Disable the presence controls in the DOM
 */
Alfresco.thirdparty.xmpp.disablePresenceControls = function() {
	// Collapse / hide any active controls
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesWrapper, "active");
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "active");
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active");
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "active");
	// Disable toggling controls
	YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "disabled");
	YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "disabled");
	YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesButton, "yui-button-disabled");
	YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.setPresenceButton, "yui-button-disabled");
};


/**
 * Enable the presence controls in the DOM
 */
Alfresco.thirdparty.xmpp.enablePresenceControls = function() {
	// Enable toggling controls
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "disabled");
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "disabled");
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesButton, "yui-button-disabled");
	YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceButton, "yui-button-disabled");
};


/**
 * Expand / collapse the presence form
 */
Alfresco.thirdparty.xmpp.togglePresenceForm = function() {
	
	// If disabled, do nothing
	if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "disabled")) {
		return;
	}
	
	if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active")) {
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active");
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "active");
	}
	else {
		YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active");
		YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "active");
		// Hide message notifications if visible
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesWrapper, "active");
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "active");
	}
	
};


/**
 * Expand / collapse the message notifications
 */
Alfresco.thirdparty.xmpp.toggleUnreadMessagesNotifications = function() {
	
	// If disabled, do nothing
	if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "disabled")) {
		return;
	}
	
	if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.unreadMessagesWrapper, "active")) {
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesWrapper, "active");
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "active");
	}
	else {
		// Display notifications
		YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesWrapper, "active");
		YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "active");
		
		// Position expanded notifications
		var notificationsSize = YAHOO.util.Dom.getRegion("unreadMessagesWrapper");
		var notificationsOffset = "-"+(notificationsSize.bottom - notificationsSize.top)+"px";
		YAHOO.util.Dom.setStyle('unreadMessagesWrapper', 'top', notificationsOffset); 
		
		// Hide presence form if visible
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active");
		YAHOO.util.Dom.removeClass(Alfresco.thirdparty.xmpp.setPresenceToggle, "active");
	}
	
};


/**
 * Adjust polling rate according to recent system activity
 */
Alfresco.thirdparty.xmpp.resetpollInterval = function() {
	
	var millisSinceLastActivity = (new Date().getTime() - Alfresco.thirdparty.xmpp.lastActivity);
	var recentActivityThresholdInMillis = Alfresco.thirdparty.xmpp.recentActivityThresholdInMins * 60000;
	
	// Adjust polling depending on how recent the last activity was
	if(millisSinceLastActivity > recentActivityThresholdInMillis) {
		// last activity was not recent, so decrease polling frequency if required
		if(Alfresco.thirdparty.xmpp.pollInterval!=Alfresco.thirdparty.xmpp.pollSlowIntervalMillis) {
			
			Alfresco.thirdparty.xmpp.pollInterval = Alfresco.thirdparty.xmpp.pollSlowIntervalMillis;
			window.clearInterval(Alfresco.thirdparty.xmpp.presencePoll);
			
			// Adjust polling interval
			Alfresco.thirdparty.xmpp.presencePoll = window.setInterval(function(){
				Alfresco.thirdparty.xmpp.getPresence();
			}, Alfresco.thirdparty.xmpp.pollInterval);
		}
	}
	else {
		// last activity was recent, so increase polling frequency if required
		if(Alfresco.thirdparty.xmpp.pollInterval!=Alfresco.thirdparty.xmpp.pollFastIntervalMillis) {
			
			Alfresco.thirdparty.xmpp.pollInterval = Alfresco.thirdparty.xmpp.pollFastIntervalMillis;
			window.clearInterval(Alfresco.thirdparty.xmpp.presencePoll);

			// Adjust polling interval
			Alfresco.thirdparty.xmpp.presencePoll = window.setInterval(function(){
				Alfresco.thirdparty.xmpp.getPresence();
			}, Alfresco.thirdparty.xmpp.pollInterval);
		}		
	}
	
};

Alfresco.thirdparty.xmpp.chatLaunchHandler = function() {
	
	// Update last activity stamp
	Alfresco.thirdparty.xmpp.lastActivity = new Date().getTime();
	
	// Switch polling to fast rate (to detect chat open/close quicker)
	Alfresco.thirdparty.xmpp.pollInterval = Alfresco.thirdparty.xmpp.pollFastIntervalMillis;
	window.clearInterval(Alfresco.thirdparty.xmpp.presencePoll);
	Alfresco.thirdparty.xmpp.presencePoll = window.setInterval(function(){
		Alfresco.thirdparty.xmpp.getPresence();
	}, Alfresco.thirdparty.xmpp.pollInterval);
	
};


/**
 * Set a cookie
 * @param name cookie name
 * @param value cookie value
 * @param exmins cookie expiry (minutes in future)
 */
Alfresco.thirdparty.xmpp.setCookie = function(name,value,exmins)
{
	var currentDate=new Date();
	var exdate = new Date(currentDate.getTime()+exmins*60000);
	var cookieValue=escape(value) + ((exmins==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=name + "=" + cookieValue;
};


/**
 * Get a cookie
 * @param name name of cookie
 */
Alfresco.thirdparty.xmpp.getCookie = function(name)
{
	var i,x,y,cookies=document.cookie.split(";");
	for (i=0;i<cookies.length;i++)
	{
		x=cookies[i].substr(0,cookies[i].indexOf("="));
		y=cookies[i].substr(cookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==name) {
			return unescape(y);
	    }
	}
};


/**
 * Preload image resources so they are available if the repository goes down
 */
Alfresco.thirdparty.xmpp.preloadImages = function() 
{
	// preload warning icon
	var warningIcon = new Image(); 
	warningIcon.src = "/share/res/components/images/warning-16.png";
}

/**
 * Setup presence polling for current user
 */
function initXMPPPresence() {
	
	// Setup DOM handles
	Alfresco.thirdparty.xmpp.presenceWrapper = YAHOO.util.Dom.get("presenceWrapper");
	
	Alfresco.thirdparty.xmpp.setPresenceToggle = YAHOO.util.Dom.get("setPresenceToggle");
	Alfresco.thirdparty.xmpp.unreadMessagesToggle = YAHOO.util.Dom.get("unreadMessagesToggle");
	Alfresco.thirdparty.xmpp.setPresenceButton = YAHOO.util.Dom.get("setPresenceButton");
	Alfresco.thirdparty.xmpp.unreadMessagesButton = YAHOO.util.Dom.get("unreadMessagesButton");
	
	Alfresco.thirdparty.xmpp.setPresenceHeader = YAHOO.util.Dom.get("setPresenceHeader");
	Alfresco.thirdparty.xmpp.unreadMessagesHeader = YAHOO.util.Dom.get("unreadMessagesHeader");
	
	Alfresco.thirdparty.xmpp.setPresenceWrapper = YAHOO.util.Dom.get("setPresenceWrapper");
	Alfresco.thirdparty.xmpp.setPresenceMode = YAHOO.util.Dom.get("setPresenceMode");
	Alfresco.thirdparty.xmpp.setPresenceStatus = YAHOO.util.Dom.get("setPresenceStatus");
	Alfresco.thirdparty.xmpp.setPresenceSubmit = YAHOO.util.Dom.get("setPresenceSubmit");
	
	Alfresco.thirdparty.xmpp.unreadMessagesWrapper = YAHOO.util.Dom.get("unreadMessagesWrapper");
	Alfresco.thirdparty.xmpp.unreadMessagesNotifications = YAHOO.util.Dom.get("unreadMessagesNotifications");
	
	Alfresco.thirdparty.xmpp.currentPresenceLabel = YAHOO.util.Dom.get("currentPresenceLabel");
	Alfresco.thirdparty.xmpp.unreadMessagesLabel = YAHOO.util.Dom.get("unreadMessagesLabel");
	
	Alfresco.thirdparty.xmpp.launchChatButton = YAHOO.util.Dom.get("launchChat");
	
	// Setup click handlers
	YAHOO.util.Event.addListener(Alfresco.thirdparty.xmpp.setPresenceToggle, "click", Alfresco.thirdparty.xmpp.togglePresenceForm);
	YAHOO.util.Event.addListener(Alfresco.thirdparty.xmpp.setPresenceHeader, "click", Alfresco.thirdparty.xmpp.togglePresenceForm);
	
	YAHOO.util.Event.addListener(Alfresco.thirdparty.xmpp.unreadMessagesToggle, "click", Alfresco.thirdparty.xmpp.toggleUnreadMessagesNotifications);
	YAHOO.util.Event.addListener(Alfresco.thirdparty.xmpp.unreadMessagesHeader, "click", Alfresco.thirdparty.xmpp.toggleUnreadMessagesNotifications);
	
	YAHOO.util.Event.addListener(Alfresco.thirdparty.xmpp.launchChatButton, "click", Alfresco.thirdparty.xmpp.chatLaunchHandler);
	
	// Setup set presence listener
	YAHOO.util.Event.addListener("setPresenceForm", "submit", Alfresco.thirdparty.xmpp.presenceFormSubmit);
	
	// Prevent clicks on presence control from triggering control collapse
	YAHOO.util.Event.addListener("presenceWrapper", "click", function(e) {
		YAHOO.util.Event.stopPropagation(e);
	});
	
	// Collapse control if user clicks off of control
	YAHOO.util.Event.addListener("Share", "click", function() {
		if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.setPresenceWrapper, "active")) {
			Alfresco.thirdparty.xmpp.togglePresenceForm();
		}
		if(YAHOO.util.Dom.hasClass(Alfresco.thirdparty.xmpp.unreadMessagesWrapper, "active")) {
			Alfresco.thirdparty.xmpp.toggleUnreadMessagesNotifications();
		}
	});
	
	// Setup UI widgets
	Alfresco.thirdparty.xmpp.chatOpenTooltip = new YAHOO.widget.Tooltip("chatOpenTooltip", {
	    context: [Alfresco.thirdparty.xmpp.setPresenceToggle, Alfresco.thirdparty.xmpp.unreadMessagesToggle],
	    text: "Chat client is already open",
	    preventoverlap: true,
	    disabled: true,
	    zIndex: 150
	});
	
	Alfresco.thirdparty.xmpp.chatErrorTooltip = new YAHOO.widget.Tooltip("chatErrorTooltip", {
	    context: [Alfresco.thirdparty.xmpp.setPresenceToggle, Alfresco.thirdparty.xmpp.unreadMessagesToggle],
	    text: "Unable to connect to presence service",
	    preventoverlap: true,
	    disabled: true,
	    zIndex: 150
	});
	
	// Store window title (used for notifications)
	Alfresco.thirdparty.xmpp.originalWindowTitle = window.document.title;
	
	// Render control
	YAHOO.util.Dom.addClass(Alfresco.thirdparty.xmpp.presenceWrapper, "enabled");

	// Render last known presence / messages, if set
	var lastKnownPresenceString = Alfresco.thirdparty.xmpp.getCookie("lastKnownPresence");
	if(lastKnownPresenceString!=undefined && lastKnownPresenceString!=null) {
		var lastKnownPresence = YAHOO.lang.JSON.parse(lastKnownPresenceString);
		Alfresco.thirdparty.xmpp.renderPresence(lastKnownPresence, true);
	}
	var lastKnownMessagesString = Alfresco.thirdparty.xmpp.getCookie("lastKnownMessages");
	if(lastKnownMessagesString!=undefined && lastKnownMessagesString!=null) {
		var lastKnownMessages = YAHOO.lang.JSON.parse(lastKnownMessagesString);
		Alfresco.thirdparty.xmpp.renderMessages(lastKnownMessages, true);
	}
	
	// Preload images
	Alfresco.thirdparty.xmpp.preloadImages();

	// Initial presence lookup, if not performed recently
	var lastPolledTimestamp = Alfresco.thirdparty.xmpp.getCookie("lastPolled");
	var currentTime = new Date().getTime();
	if(lastPolledTimestamp==undefined || (currentTime-lastPolledTimestamp > (Alfresco.thirdparty.xmpp.pollInterval-1000))) {	
		Alfresco.thirdparty.xmpp.getPresence();
	}

	// Poll presence/messages according to pollInterval setting 
	Alfresco.thirdparty.xmpp.presencePoll = window.setInterval(function(){
		Alfresco.thirdparty.xmpp.getPresence();
	}, Alfresco.thirdparty.xmpp.pollInterval);
	
	Alfresco.thirdparty.xmpp.otherUserPresencePoll = window.setInterval(function(){
		Alfresco.thirdparty.xmpp.refreshPresences();
	}, Alfresco.thirdparty.xmpp.otherUserPollInterval);
	
};


Alfresco.thirdparty.xmpp.refreshPresences = function() {

	var usersToQuery={};
	
	var refreshOffline=false;
	if (++Alfresco.thirdparty.xmpp.otherUserPollOnlineBiasCount >= Alfresco.thirdparty.xmpp.otherUserPollOnlineBias) {
		refreshOffline=true;
		Alfresco.thirdparty.xmpp.otherUserPollOnlineBiasCount=0;
	}
	
	var presencesDisplayed=YAHOO.util.Selector.query('div.presence-username a');
	
	for (var displayedPresence in presencesDisplayed) {
		if (!refreshOffline) { //If we're not refreshing offline users, then skip any where the button has the offline class
			if (YAHOO.util.Dom.hasClass(presencesDisplayed[displayedPresence].parentNode.parentNode.getElementsByTagName('button')[0], 'offline')) {
				continue;
			}
		}
		var profileLink=presencesDisplayed[displayedPresence].href;
		var userName=profileLink.substring(profileLink.indexOf('/share/page/user/')+17, profileLink.length-8); //17 is the length of /share/page/user/ and 8 is /profile
		usersToQuery[userName]=true;
		if (usersToQuery.length > Alfresco.thirdparty.xmpp.userQueryLimit) {
			break;
		}
	}
	
	var url=Alfresco.constants.PROXY_URI+'surevine/xmpp/presence?';
	for (user in usersToQuery) {
		url+='users='+user+'&';
	}
	url=url.substring(0, url.length-1);
	
	Alfresco.util.Ajax.request(
         {
            url: url,
            method: "GET",
            responseContentType : "application/json",
            successCallback:
            {
               fn: Alfresco.thirdparty.xmpp.onPresencesRefreshed,
               scope: this
            },
            failureCallback:
            {
            	fn: Alfresco.thirdparty.xmpp.onPresencesRefreshFail,
            	scope: this
            }
         });
};

Alfresco.thirdparty.xmpp.onPresencesRefreshed=function(response) {
	
	var rawPresences=response.json.presences;
	
	//Convert to associative array for easier comparison with historical data
	var presences={};
	for (rawPresenceIdx in rawPresences) {
		var rawPresence=rawPresences[rawPresenceIdx];
		presences[rawPresence.user]={};
		presences[rawPresence.user].mode=rawPresence.mode;
		presences[rawPresence.user].status=rawPresence.status;
	}
	
	//Do we have history defined
	var hasHistory=("com_surevine_alfresco_xmpp_lastPresenceUpdate" in window);
	
	//Iterate through our results and see if anything has changed
	
	for (user in presences) {
		//If history is available for that user, check to see if anything has changed
		if (hasHistory && user in com_surevine_alfresco_xmpp_lastPresenceUpdate) {
			var oldPresence=com_surevine_alfresco_xmpp_lastPresenceUpdate[user];
			var presence=presences[user];
			if (presence.mode!=oldPresence.mode || presence.status!=oldPresence.status) {
				Alfresco.thirdparty.xmpp.updateUserPresence(user, presence);
			}
		}
		else {  //No history available so just update
			Alfresco.thirdparty.xmpp.updateUserPresence(user, presences[user]);
		}

	}

	com_surevine_alfresco_xmpp_lastPresenceUpdate=presences;
}

Alfresco.thirdparty.xmpp.updateUserPresence=function(user, presence) {

	// Identify the controls that need changing.  This actually selects the child element, but
	// it's faster for us to call .parent in this code than rely on YUI to do it efficiently in all
	// browsers
	var presenceControls=YAHOO.util.Selector.query('div.presence-username a[href$=/share/page/user/'+user+'/profile]');
	
	for (controlIdx in presenceControls) {
		var control=presenceControls[controlIdx].parentNode.parentNode;
		
		//Change the icon
		var button=control.getElementsByTagName('button')[0];
		if (presence.mode=='available') {
			button.className="presence-indicator online";
		}
		else if (presence.mode=='busy') {
			button.className="presence-indicator busy";
		}
		else {
			button.className="presence-indicator offline";
		}
		//Change the status message, if appropriate (ie. people in my groups)
		if (YAHOO.util.Dom.hasClass(control.parentNode, 'mygroups-row')) {
			var nextNode=control.nextSibling;
			if (nextNode && nextNode.className=='status') {
				nextNode.innerHTML=presence.status;
			}
			else { //If there's no status message yet, and we have one, then add it in
				if (presence.status && presence.status.length > 0 ) {
					control.parentNode.innerHTML+='<div class="status">'+presence.status+'</div>';
				}
			}
		}
	}
}

Alfresco.thirdparty.xmpp.onPresencesRefreshFail=function(response) {
}

/**
 * Checks whether current user is part of the chat 
 */
function checkChatEnabled() {
	
	if (Alfresco.constants.USERNAME=="guest") {
		return;
	}
	
	var chatEnabled = Alfresco.thirdparty.xmpp.getCookie("chatEnabled");
	if(chatEnabled!=undefined && chatEnabled==Alfresco.constants.USERNAME) {
		initXMPPPresence();	
	}
	else {
		
		var chatEnabledCallback = {
				
			success: function(response) {
				var responseObj = YAHOO.lang.JSON.parse(response.responseText);
				var groupUsers = responseObj.data;
				var chatEnabled = false;
				
				for (var i = 0; i < groupUsers.length; i++) {
				    var user = groupUsers[i];
				    if(user.fullName==Alfresco.constants.USERNAME) {
				    	chatEnabled=true;
				    	break;
				    }
				}
				
				if(chatEnabled) {
					// Store chat enabled state in cookie to avoid subsequent lookups
					Alfresco.thirdparty.xmpp.setCookie("chatEnabled", Alfresco.constants.USERNAME, Alfresco.thirdparty.xmpp.userChatEnabledCookieExpiryInMins);
					initXMPPPresence();
				}
				
			},
			failure: function(response) {
				console.log("Error checking whether chat enabled for "+Alfresco.constants.USERNAME);
			}	
		};
		
		YAHOO.util.Connect.asyncRequest('GET', "/share/proxy/alfresco/api/groups/alf_ctl_CHAT/children?authorityType=USER", chatEnabledCallback, null);
	}
};

// Initialize the XMPP presence / message monitoring
YAHOO.util.Event.onDOMReady(checkChatEnabled);

