<div class="dashlet site-profile">
   <div class="title">${msg("header.siteProfile")}</div>
   <div class="body">
      <div class="msg">
         <h3><#if (profile.title != "")>${msg("text.welcome", profile.title)?html}<#else>${msg("text.welcome", profile.shortName)?html}</#if></h3>
<#if (profile.description != "")>
         <p>${profile.description?html}</p>
</#if>
<#if profile.customProperties??>
   <#list profile.customProperties?keys as prop>
      <#assign customValue=profile.customProperties[prop].value>	
      <#if customValue?starts_with('alfresco-php://') == true>
         <p><a href="${url.context}/proxy/alfresco-php/${customValue?substring(15)}" target="_blank" class="theme-color-1">${profile.customProperties[prop].title}</a></p>
      <#else>
         <p>
            <span class="label">${profile.customProperties[prop].title}</span>
            <span>${customValue}</span>
         </p>
       </#if>
   </#list>
</#if>
      </div>
      <div class="clear"></div>
   </div>
</div>