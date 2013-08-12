<script type="text/javascript">//<![CDATA[
   new Alfresco.DiscussionsToolbar("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs["site"]!""}",
      containerId: "${template.properties.container!'discussions'}",
      allowCreate: ${forum.forumPermissions.create?string}
   }).setMessages(
      ${messages}
   );
   
   $(document).ready(function() {
      $("#${args.htmlid}").resizingStickyScroller($(".topiclist-infobar").first());
   });
   
//]]></script>
<div id="${args.htmlid}-body" class="share-toolbar discussions-toolbar flat-button theme-bg-2">

   <div class="navigation-bar <#if (args.showNavigationBar == "false")>hide</#if>">
      <div>
         <span class="<#if (page.url.args.listViewLinkBack! == "true")>backLink<#else>forwardLink</#if>">
            <a href="${url.context}/page/site/${page.url.templateArgs.site}/discussions-topiclist">${msg("link.listView")}</a>
         </span>
      </div>
   </div>

   <div class="action-bar theme-bg-1">
      <div class="new-topic"><button id="${args.htmlid}-create-button">${msg("button.create")}</button></div>
   </div>

</div>
<div class="clear"></div>
        
