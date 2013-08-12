<script type="text/javascript">//<![CDATA[
function loadPerishableData()
{

  Alfresco.util.Ajax.request(
    {
      url: Alfresco.constants.PROXY_URI + "/sv-theme/perishable?format=html",
      method: "GET",
      responseContentType : "text/html",
      successCallback:
    {
      fn: onPerishableLoadSuccess,
      scope: this
    },
    failureCallback:
    {
      fn: onPerishableLoadFail,
      scope: this
    }
  });

}

function onPerishableLoadSuccess(response) {
    setPerishableContent(response.serverResponse.responseText);
}

function onPerishableLoadFail(response) {
    setPerishableContent("<h3>Could not load perishable items</h3>");
}

function setPerishableContent(content) {
    var body = YAHOO.util.Selector.query('div[id=perishable-dashlet-body]')[0];
    
    body.innerHTML=content;
    // if content isn't just that there's no items then display the dashlet.
    
    var wrapper = YAHOO.util.Selector.query('div[id=perishable-dashlet-wrapper]')[0];
    if (content.indexOf("Nothing to display") == -1) {
        YAHOO.util.Dom.setStyle(wrapper, 'display', 'block');
	
		// Now the dashlet is displayed we can apply the dashlet resizer functionality
		new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
    } else {
        YAHOO.util.Dom.setStyle(wrapper, 'display', 'none');
    }
}

loadPerishableData();
//]]></script>

<div id="perishable-dashlet-wrapper" class="dashlet" style="display: none">
   <div class="title">${msg("header.docSummary")} <span style="background: url('/share/components/enhanced-security/images/info.gif') no-repeat; width: 16px; height: 16px; display: inline-block"
   		title="${msg("header.perishableInfo")}">&nbsp;</span></div>
   <div id="perishable-dashlet-body" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      Loading data...
   </div>
</div>