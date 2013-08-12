<script type="text/javascript">//<![CDATA[
function loadActivityData()
{

  Alfresco.util.Ajax.request(
    {
      url: Alfresco.constants.PROXY_URI + "/sv-theme/${page.url.templateArgs.site}/activities?format=html",
      method: "GET",
      responseContentType : "text/html",
      successCallback:
    {
      fn: onActivityLoadSuccess,
      scope: this
    },
    failureCallback:
    {
      fn: onActivityLoadFail,
      scope: this
    }
  });

}

function onActivityLoadSuccess(response) {
    setActivityContent(response.serverResponse.responseText);
}

function onActivityLoadFail(response) {
    setActivityContent("<h3>Could not load recent activities</h3>");
}

function setActivityContent(content) {
    var body = YAHOO.util.Selector.query('div[id=site-activities-dashlet-body]')[0];
    body.innerHTML=content;
}

loadActivityData();
//]]></script>

<script type="text/javascript">//<![CDATA[
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>
<div class="dashlet">
   <div class="title">${msg("header.docSummary")}</div>
   <div id="site-activities-dashlet-body" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      Loading data...
   </div>
</div>