var result, themeDashboardConfig = {}, themeConfig = {};

// Get the dashboard configuration
result = remote.call("/sv-theme/config/user-dashboard");
   
if(result.status == 200){
  themeDashboardConfig = eval('(' + result + ')');
}

//Get the configuration
result = remote.call("/sv-theme/config/general");
   
if(result.status == 200){
  themeConfig = eval('(' + result + ')');
}

model.themeConfig = themeConfig;
model.themeDashboardConfig = themeDashboardConfig;
