var component = sitedata.getComponent(url.templateArgs.componentId);
if (component != null) {
   var names = json.names(), name, value;
   for (var i = 0, j = names.length(); i < j; i++) {
      name = names.get(i);
      
      var value = json.get(name);
      
      if (name == "height") { // Prevent the user entering a ridiculous dashlet height
    	  if (value < 50) value = 50;
    	  if (value > 1000) value = 1000;
      }
      
      component.properties[name] = String(value);
   }

   component.save();
}