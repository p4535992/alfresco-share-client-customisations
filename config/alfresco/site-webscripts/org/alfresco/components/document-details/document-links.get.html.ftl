<#assign el=args.htmlid?html>
<script type="text/javascript">//<![CDATA[
   new Alfresco.DocumentLinks("${el}").setOptions(
   {
      <#if repositoryUrl??>repositoryUrl: "${repositoryUrl}"</#if>
   }).setMessages(${messages});
//]]></script>

<div id="${el}-body" class="document-links hidden">
   
   <div class="heading">${msg("document-links.heading")}</div>
   
   <!-- download link -->
   <div id="${el}-download" class="hidden">
      <div class="url-title"><label for="${el}-download-url">${msg("document-links.download")}</label></div>
      <input id="${el}-download-url" class="link-value" />
      <input id="${el}-download-button" type="button" class="copy-button" value="${msg("document-links.copy")}" />
   </div>
   
   <!-- document/view link -->
   <div id="${el}-view" class="hidden">
      <div class="url-title"><label for="${el}-view-url">${msg("document-links.view")}</label></div>
      <input id="${el}-view-url" class="link-value" />
      <input id="${el}-view-button" type="button" class="copy-button" value="${msg("document-links.copy")}" />
   </div>

</div>