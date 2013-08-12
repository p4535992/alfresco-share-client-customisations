<script type="text/javascript">//<![CDATA[
   new Alfresco.DocumentInfo("${args.htmlid}").setMessages(${messages});
//]]></script>

<div id="${args.htmlid}-body" class="document-info">
   
   <div class="info-section">
      <div class="heading">${msg("label.tags")}</div>
      
      <div id="${args.htmlid}-tags"></div>
   </div>

	<#include "/org/alfresco/components/perishability/perishable-dialog.lib.ftl" />
</div>