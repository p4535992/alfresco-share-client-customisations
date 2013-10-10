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
<#macro presenceIndicator userName userDisplayName presence>
	<#switch presence.availability>
		<#case "ONLINE">
			<#assign displayAvl = "online">
			<#break>
		<#case "BUSY">
			<#assign displayAvl = "busy">
			<#break>
		<#case "AWAY">
			<#assign displayAvl = "away">
			<#break>
		<#case "OFFLINE">
			<#assign displayAvl = "offline">
			<#break>
		<#default>
			<#assign displayAvl = "unknown">
	</#switch>

 	<#if presence.availability == "UNKNOWN">
			<#assign btnTitle = "Unable to retrieve status for ${userDisplayName?html}.">
	<#else>
			<#assign btnTitle = "${userDisplayName?html} is ${displayAvl?html} in chat.">
	</#if>			
			
	<div class="presence">
	    	<#if presence.availability == "UNKNOWN" || presence.availability == "OFFLINE" ||  presence.serviceEnabled?string == "false">
	    		<button class="presence-indicator ${displayAvl}" type="button" title="${btnTitle}" disabled="disabled">&nbsp;</button>
			<#else>
				<button class="presence-indicator ${displayAvl}" type="button" title="${btnTitle} ; Click to connect." onclick="Alfresco.thirdparty.presence.launchChat('${userName}','${presence.host}')">&nbsp;</button>
			</#if>
			
		<div class="presence-username">
		    <a href="${url.context}/page/user/${userName?url}/profile" class="theme-color-1" >${userDisplayName?html}</a>
		 </div>
		
	</div>
</#macro>
