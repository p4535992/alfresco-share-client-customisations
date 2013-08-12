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