<#assign activePage = page.url.templateArgs.pageid!"customise-user-dashboard">
<#assign userName>${user.properties["firstName"]?html} <#if user.properties["lastName"]??>${user.properties["lastName"]?html}</#if></#assign>
<script type="text/javascript">//<![CDATA[
   Alfresco.constants.DASHLET_RESIZE = ${((page.url.templateArgs.userid!"-") = (user.name!""))?string};
//]]></script>
<div class="user-dashboard-header">
  	<#if themeDashboardConfig.backgroundImage.nodeRef != "">
     <img class="banner-image" src="${url.context}/proxy/alfresco/api/node/${themeDashboardConfig.backgroundImage.nodeRef?replace('://','/')}/content" alt="${themeDashboardConfig.backgroundImage.title?html}" />
    <#else>
     <img class="banner-image" src="${url.context}/themes/${theme}/images/user-dashboard/banner-image.jpg" alt="My Homepage" />
	</#if>

	<div class="header-content">
		${(themeDashboardConfig.userDashboardTitleHTML)!}
		<div class="tools">
			<ul>
			    <li><a href="${msg("syops.link")}">${msg("syops.title")}</a></li>
			    <li><span class="tools-separator"></span><a href="${msg("brules.link")}">${msg("brules.title")}</a></li>
				<li><span class="tools-separator"></span><a href="${(themeConfig.changePasswordUrl)!?html}">Change Password</a></li>
			   	<#if user.isAdmin>
			      <#assign linkClass><#if "customise-user-dashboard" == activePage>class="active-page"</#if></#assign>
			   	<li><span class="tools-separator"></span><a href="${url.context}/page/customise-user-dashboard" ${linkClass}>${msg("link.customiseDashboard")}</a></li>
			   	</#if>
			</ul>
		</div>
	</div>
</div>