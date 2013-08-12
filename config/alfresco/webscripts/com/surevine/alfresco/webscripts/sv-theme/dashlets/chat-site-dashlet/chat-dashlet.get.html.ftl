<#assign svThemeConfig = config.scoped["SvTheme"]["svTheme"] />
<div class="dashlet chat-dashlet">
	<div class="title">Chat</div>
	<div class="body">
		<img src="${url.context}/proxy/alfresco/api/path/content/workspace/SpacesStore/Company%20Home/${svThemeConfig.getChildValue("repositoryRootUrl")}/Configuration/Chat%20Dashlet/logo" class="chat-logo" />
		<div class="launch-text"><a href="${(themeConfig.launchChatUrl)!?html}" target="chatWindow">Launch Chat Client</a></div>
	</div>
</div>