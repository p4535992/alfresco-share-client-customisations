// Call the repo for the sites profile
var profile =
{
   title: "",
   shortName: "",   
   description: ""
}

var json = remote.call("/api/sites/" + page.url.templateArgs.site);
if (json.status == 200)
{
   // Create javascript object from the repo response
   var obj = eval('(' + json + ')');
   if (obj)
   {
      profile = obj;
   }
}

// Prepare the model
model.profile = profile;

cache.neverCache=false;
cache.isPublic=false;
cache.maxAge=36000; //10 hours
cache.mustRevalidate=false;
cache.ETag = 100;