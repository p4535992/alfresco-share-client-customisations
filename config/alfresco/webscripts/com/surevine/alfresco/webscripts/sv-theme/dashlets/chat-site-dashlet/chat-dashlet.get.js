var result, themeConfig = {};

// Get the configuration
var result = remote.call("/sv-theme/config/general");
   
if(result.status == 200){
  themeConfig = eval('(' + result + ')');
}

model.themeConfig = themeConfig;

cache.neverCache=false;
cache.isPublic=false;
cache.maxAge=36000; //10 hours
cache.mustRevalidate=false;
cache.ETag = 100;