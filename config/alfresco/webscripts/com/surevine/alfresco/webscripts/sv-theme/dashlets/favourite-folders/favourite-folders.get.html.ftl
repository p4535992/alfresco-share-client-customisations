<script type="text/javascript">//<![CDATA[
function loadFavouriteFoldersData()
{

  Alfresco.util.Ajax.request(
    {
      url: Alfresco.constants.PROXY_URI + "/api/people/${username}/preferences?pf=org.alfresco.share.folders.favourites",
      method: "GET",
      responseContentType : "text/json",
      successCallback:
    {
      fn: enrichFolderData,
      scope: this
    },
    failureCallback:
    {
      fn: onFavouriteFolderLoadFail,
      scope: this
    }
  });

}

function enrichFolderData(response) {
    output = new Array();
    var responseObj = YAHOO.lang.JSON.parse(response.serverResponse.responseText);
    try {
        var folders = responseObj.org.alfresco.share.folders.favourites.split(",");
    }
    catch (error) {
        displayHelpMessage();
    }
        
    if (folders && folders.length>0 && !(folders.length==1  && folders[0]=="")) {
    
        Alfresco.util.Ajax.request(
        {
          url: Alfresco.constants.PROXY_URI + "/sv-theme/enrich-folders?folders=" + folders.join("&folders="),
          method: "GET",
          responseContentType : "text/json",
          successCallback:
        {
          fn: onFavouriteFolderLoadSuccess,
          scope: this
        },
        failureCallback:
        {
          fn: onFavouriteFolderLoadFail,
          scope: this
        }
      });
   }
   else {
    displayHelpMessage();
   }
}

function displayHelpMessage() {
     document.getElementById('folder-help-message').style.cssText='';
     document.getElementById('folder-loading-message').style.cssText='display:none;';
}

function onFavouriteFolderLoadSuccess(response) {
    var folders = YAHOO.lang.JSON.parse(response.serverResponse.responseText);
    var html="";
    for (var i=0; i < folders.length; i++) {
       var folder = folders[i];
       var url="/share/page/site/"+folder.siteName+"/documentlibrary#filter=path%7C"+folder.path+"/"+folder.name+"&page=1";
    
       html += "<div class='detail-list-item'><span><a href='"+url+"'><img style='height:2em;margin-right:1em;' src='/share/res/components/documentlibrary/images/folder-32.png'/></a></span><span>";
       html += "<a style='vertical-align:top;' href='"+url+"'>"+folder.name+"</a>";
       if (folder.title && folder.title.length>0) {
        html+="<span style='color: #606060;font-size: 82%;padding-left: 0.7em; vertical-align:top;'>("+folder.title+")</span>";
       } 
       html += "<div style='margin-left:3em; margin-top:-0.8em;'>"+folder.description+"</div>";
       
       html+="</span></div>";
    }
    setFavouriteFolderContent(html);
    
}

function onFavouriteFolderLoadFail(response) {
    setFavouriteFolderContent("<h3>Could not load the current user's favourite folders</h3>");
}

function setFavouriteFolderContent(content) {
    var body = YAHOO.util.Selector.query('div[id=favourite-folders-dashlet-body]')[0];
    body.innerHTML=content;
}

loadFavouriteFoldersData();
//]]></script>

<script type="text/javascript">//<![CDATA[
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>
<div class="dashlet">
   <div class="title">My Favourite Folders</div>
   <div id="favourite-folders-dashlet-body" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      <div id='folder-loading-message'>Loading data...</div>
      <div id='folder-help-message' style='display:none;'>
        <p>You have not yet favourited any folders in the document library.</p>
        <p>To make a folder a favourite simply click on the <img src='/share/res/components/images/star-selected_16x16.png' alt='favourite'/> icon next to the folder in the document library list</p>
        <p>Once you have favourited a folder you'll be able to easily return to it from here</p>
      </div>
   </div>
</div>