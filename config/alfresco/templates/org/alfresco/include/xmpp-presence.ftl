<#--
    Copyright (C) 2008-2010 Surevine Limited.
      
    Although intended for deployment and use alongside Alfresco this module should
    be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
    http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
    
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->
<div id="presenceWrapper" class="yui-skin-default">

	<div id="setPresenceWrapper" class="xmpp-presence-control">
	
		<div id="setPresenceHeader" class="xmpp-presence-control-header yui-button">Update Presence</div>
	
		<form id="setPresenceForm">
	
			<input type="radio" name="setPresenceMode" value="available" checked="checked" id="availablePresence" /><label for="availablePresence" class="presenceLabel">Available</label>
			<input type="radio" name="setPresenceMode" value="busy" id="busyPresence" /><label for="busyPresence" class="presenceLabel">Busy</label>
			
			<label for="status" class="messageLabel">Custom Message</label>
			<input type="text" name="setPresenceStatus" id="setPresenceStatus" />
			
			<span class="yui-button yui-submit-button" id="setPresenceSubmitButton">
			    <span class="first-child">
					<button type="submit" id="setPresenceSubmit">Update Presence</button>
			    </span>
			</span>
		
		</form>
		
	</div>
	
	<div id="unreadMessagesWrapper" class="xmpp-presence-control">
	
		<div id="unreadMessagesHeader" class="xmpp-presence-control-header yui-button">Unread Messages</div>
	
		<div id="unreadMessagesNotifications"></div>
		
		<div id="launchChatWrapper">
			<span class="yui-button" id="launchChatButton">
			    <span class="first-child">
					<a href="http://@@chat_host@@/@@chat_path@@/" target="_blank" id="launchChat">Launch Chat</a>
			    </span>
			</span>
		</div>
		
	</div>

	<span class="yui-button xmpp-presence-button" id="setPresenceButton">
	    <span class="first-child">
			<a id="setPresenceToggle" class="xmpp-presence-toggle">
				<div id="currentPresenceLabel"></div>
			</a>
	    </span>
	 </span>
	 
	<span class="yui-button xmpp-presence-button" id="unreadMessagesButton">
	    <span class="first-child">
			<a id="unreadMessagesToggle" class="xmpp-presence-toggle">
				<div id="unreadMessagesLabel"></div>
			</a>
	    </span>
	 </span>

</div>
