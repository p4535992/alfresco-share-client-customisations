var result, themeConfig = {};

//Get the configuration
result = remote.call("/sv-theme/config/general");
   
if(result.status == 200){
  themeConfig = eval('(' + result + ')');
}

/**
 * User Profile Toolbar Component
 */
model.activeUserProfile = (page.url.templateArgs["userid"] == user.name);

model.themeConfig = themeConfig;