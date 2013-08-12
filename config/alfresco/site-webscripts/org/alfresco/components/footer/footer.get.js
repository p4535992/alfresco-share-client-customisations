function main()
{
   var themeConfig = {};
   
   // Get the configuration
   result = remote.call("/sv-theme/config/general");
   
   if(result.status == 200){
	   themeConfig = eval('(' + result + ')');
   }

   model.themeConfig = themeConfig;
}

main();