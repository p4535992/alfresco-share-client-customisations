var result, themeConfig = {}, content;

// Get the configuration
var result = remote.call("/sv-theme/config/esl-help");
   
if(result.status == 200){
  themeConfig = eval('(' + result + ')');
  
  if(themeConfig.contentHTML) {
	  content = themeConfig.contentHTML;
  }
}

model.content = content;