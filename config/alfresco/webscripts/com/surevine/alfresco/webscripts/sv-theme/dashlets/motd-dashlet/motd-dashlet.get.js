var result, themeConfig = {}, content;

// Get the configuration
var result = remote.call("/sv-theme/config/motd-dashlet");
   
if(result.status == 200){
  themeConfig = eval('(' + result + ')');
  
  if(themeConfig.contentHTML) {
	  content = themeConfig.contentHTML;
  }
}

model.content = content;

cache.neverCache=false;
cache.isPublic=false;
cache.maxAge=3600; //1 hour
cache.mustRevalidate=false;
cache.ETag = 100;