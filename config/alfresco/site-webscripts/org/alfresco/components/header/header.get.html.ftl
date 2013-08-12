<#include "../../include/alfresco-macros.lib.ftl" />
<#import "header.inc.ftl" as header>
<#assign helpPages = config.scoped["HelpPages"]["help-pages"]>
<#assign helpLink = helpPages.getChildValue("share-help")!"">
<#assign siteActive = page.url.templateArgs.site??>
<#assign id = args.htmlid>

<#if !user.isGuest>
<script type="text/javascript">//<![CDATA[
   var thisHeader = new Alfresco.component.Header("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      siteTitle: "${siteTitle?js_string}",
      minSearchTermLength: ${args.minSearchTermLength!config.scoped["Search"]["search"].getChildValue("min-search-term-length")},
      tokens:
      {
         site: "${page.url.templateArgs.site!""}",
         pageid: "${page.url.templateArgs.pageid!""}",
         userid: "${user.name?js_string}"
      }
   }).setMessages(
      ${messages}
   );
   Alfresco.util.createTwister.collapsed = "${collapsedTwisters?html}"
//]]></script>
</#if>
<#--
	      <#list page.url.templateArgs?keys as key>
	      	${key} : ${page.url.templateArgs[key]}<br />
	      </#list>
	      <#list page.url?keys as key>
	      	${key}<br />
	      </#list>
-->
<div class="header">
	<div class="header-protective-marking">${(themeConfig.headerSecurityLabel)!?html}</div>

    <div class="logo-wrapper">
      <div class="logo">
      	<#if themeConfig.appLogo.nodeRef != "">
         <img src="${url.context}/proxy/alfresco/api/node/${themeConfig.appLogo.nodeRef?replace('://','/')}/content" alt="${themeConfig.appLogo.title?html}" />
        <#else>
         <img src="${url.context}/themes/${theme}/images/app-logo.png" alt="Surevine" />
		</#if>
      </div>
    </div>

	<div class="menu-wrapper-outer">
	   <div class="menu-wrapper">
	      <#if !user.isGuest>
	      <div class="personal-menu">
			 <#assign linkClass><#if page.url.templateArgs.userid?? && !page.url.templateArgs.pageid?? && (page.url.templateArgs.userid == user.name)>class="active"</#if></#assign>
	         <span class="menu-item my-dashboard"><a href="${url.context}/page/user/${user.name?url}/dashboard" ${linkClass}>${msg("link.myDashboard")}</a></span>
	         
			 <#assign linkClass><#if page.url.templateArgs.userid?? && page.url.templateArgs.pageid?? && (page.url.templateArgs.pageid == "profile") && (page.url.templateArgs.userid == user.name)>class="active"</#if></#assign>
	         <span class="menu-item my-profile"><a href="${url.context}/page/user/${user.name?url}/profile" ${linkClass}>${msg("link.myProfile")}</a></span>
			
			<#-- List all the sites the user is a member of -->
			<#list sites as site>
		      <#assign linkClass><#if page.url.templateArgs.site?? && (site.shortName == page.url.templateArgs.site)>class="active"</#if></#assign>
			<span class="menu-item"><a href="${url.context}/page/site/${site.shortName}/dashboard" ${linkClass}>${msg("link.site", site.title)}</a></span>
			</#list>
	        
			 <#assign linkClass><#if page.url.uri?starts_with(url.context + "/page/people-finder")>class="active"</#if></#assign>
	         <span class="menu-item people"><a href="${url.context}/page/people-finder" ${linkClass}>${msg("link.people")}</a></span>
	      </div>
	      </#if>
	
	      <div class="util-menu">
	         <#if user.isAdmin>
	         <span class="menu-item"><a href="#" onclick="Alfresco.util.ComponentManager.findFirst('Alfresco.module.Sites').showCreateSite(); return false;">${msg("header.sites.createSite")}</a></span>
	         
			 <#assign linkClass><#if page.url.templateArgs.pageid?? && (page.url.templateArgs.pageid == "admin-console")>class="active"</#if></#assign>
	         <span class="menu-item"><a href="${url.context}/page/console/admin-console/" ${linkClass}>${msg("link.console")}</a></span>

	         <span class="menu-item-separator">&nbsp;</span>
	         </#if>
	         <span class="menu-item"><a href="${(themeConfig.helpLinkUrl)!?html}" rel="_blank">${msg("link.help")}</a></span>
<#--
	         <#if !user.isGuest>
		         <#if !context.externalAuthentication>
		         <span class="menu-item-separator">&nbsp;</span>
		         <span class="menu-item"><a href="${url.context}/logout" title="${msg("link.logout.tooltip", user.name?html)}">${msg("link.logout")}</a></span>
		         <span class="menu-item-separator">&nbsp;</span>
		         </#if>
	         </#if>
-->
	      </div>
	   </div>
	</div>
   <#if !user.isGuest>
      <div class="search-box">
         <span id="${id}-search_more" class="yui-button yui-menu-button">
            <span class="first-child" style="background-image: url(${url.context}/res/components/images/header/search-menu.png)">
               <button type="button" title="${msg("header.search.description")}" tabindex="0"></button>
            </span>
         </span>
         <input id="${id}-searchText" type="text" maxlength="1024" />
      </div>
      <div id="${id}-searchmenu_more" class="yuimenu yui-overlay yui-overlay-hidden">
         <div class="bd">
            <ul class="first-of-type">
               <li><span style="background-image: url(${url.context}/res/components/images/header/advanced-search.png)"><a title="${msg("header.advanced-search.description")}" href="${siteURL("advsearch")}">${msg("header.advanced-search.label")}</a></span></li>
            </ul>
         </div>
      </div>
   </#if>
  
	<div class="chat-launcher">
	  	<a href="${(themeConfig.launchChatUrl)!?html}" target="chatWindow"><img src="${url.context}/themes/${theme}/images/header/chat-logo.gif" alt="${msg("link.launchChat.alt")}" title="${msg("link.launchChat")}" /></a>
	</div>
</div>
<script type="text/javascript">//<![CDATA[
(function()
{
   Alfresco.util.relToTarget("${args.htmlid}");
})();
//]]></script>
