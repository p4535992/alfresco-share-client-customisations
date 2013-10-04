<import resource="classpath:/alfresco/site-webscripts/org/alfresco/components/enhanced-security/lib/enhanced-security.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/components/perishability/perishable-reasons.lib.js">

/*
 * Copyright (C) 2008-2010 Surevine Limited.
 *   
 * Although intended for deployment and use alongside Alfresco this module should
 * be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
 * http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

/**
 * Main entry point for component webscript logic
 *
 * @method main
 */
function main()
{
   // Check mandatory parameters
   var nodeRef = args.nodeRef;
   if (nodeRef == null || nodeRef.length == 0)
   {
      status.code = 400;
      status.message = "Parameter 'nodeRef' is missing.";
      status.redirect = true;
   }

   // Call repo for node's metadata
   var json = remote.call("/api/metadata?nodeRef=" + nodeRef);
   if (json != null && json.toString().trim().length() > 2)
   {
      var node = {},
         n = eval('(' + json + ')');
         mcns = "{http://www.alfresco.org/model/content/1.0}",
         content = n.properties[mcns + "content"];

      // Call repo for available previews
      json = remote.call("/api/node/" + nodeRef.replace(":/", "") + "/content/thumbnaildefinitions");
      var previews =  eval('(' + json + ')');

      node.nodeRef = nodeRef;
      node.name = n.properties[mcns + "name"];
      node.icon = "/components/images/generic-file-32.png";
      node.mimeType = n.mimetype;
      node.previews = previews;

      
      var mdns="{http://www.surevine.com/alfresco/model/managedDeletion/1.0}";
      var deletedBy = n.properties[mdns+"deletedBy"];
      var archiveDue = n.properties[mdns+"archivalDue"];
      if (archiveDue!=null) {
    	  model.deletedBy=deletedBy;
    	  model.archiveDue=archiveDue;
      }

      var perishDue = n.properties[mdns+"perishDue"];
      var perishReason = n.properties[mdns+"perishReason"];
      var perishRequestedBy = n.properties[mdns+"perishRequestedBy"];
      if (perishDue!=null) {
    	  model.perishDue = perishDue;
    	  model.perishReason = perishReason;
    	  model.perishRequestedBy = perishRequestedBy;
    	  
    	  for (var i = 0; i<model.perishableReasons.length; i++) {
    		  if (model.perishableReasons[i].code === model.perishReason) {
    			  model.perishTitle = model.perishableReasons[i].title;
    		  }
    	  }
      }

      // Get the node archival details if required
      if((archiveDue != null) || (perishDue!=null)) {
	      json = remote.call("/sv-theme/delete/archive-details?nodeRef=" + nodeRef);
	      var archiveDetails =  eval('(' + json + ')');

	      model.archiveDetails = archiveDetails;
      }

      
      var eslNS="{http://www.alfresco.org/model/enhancedSecurity/0.3}";
      var eslNod=n.properties[eslNS + "nod"];
      var eslPM=n.properties[eslNS + "pm"];
      var eslFreeFormCaveats=n.properties[eslNS + "freeformcaveats"];
      var eslClosed = new Array();
      eslClosed = n.properties[eslNS + "closedMarkings"];
      var seperatedClosed = seperateAtomalFromClosedMarkings(eslClosed);
      eslClosed = seperatedClosed.closedMarkings;
      var eslAtomal = seperatedClosed.atomal;
      var eslOpen = new Array();
      eslOpen = n.properties[eslNS + "openMarkings"];
      var eslOrganisation = new Array();
      eslOrganisation = n.properties[eslNS + "organisations"];

      var eslEyes=n.properties[eslNS + "nationalityCaveats"];
      
      
      
      var closedStr="";
      if (eslClosed != null) {
        for ( var i=0; i < eslClosed.length; i++)
        {
          closedStr = closedStr + " ";
          closedStr = closedStr + eslClosed[i];
        }
      }

      var openStr="";
      if (eslOpen !=null) {
        for ( var i=0; i < eslOpen.length; i++)
        {
          openStr = openStr+" ";
          openStr = openStr+eslOpen[i];
        }
      }
      
      var orgStr="";
      if (eslOrganisation !=null) {
        for ( var i=0; i < eslOrganisation.length; i++)
        {
          orgStr = orgStr+" ";
          orgStr = orgStr+eslOrganisation[i];
        }
      }
      
      
      
      if (eslNS !=null ) {
        model.eslNS=eslNS;
      }
      else {
        model.eslNS="";
      }
      if (eslNod != null ) {
        model.eslNod=eslNod;
      }
      else {
        model.eslNod="";
      }
      if (eslPM != null ) {
        model.eslPM=eslPM;
      }
      else {
        model.eslPM="";
      }
      if (eslFreeFormCaveats !=null ) {
        model.eslFreeFormCaveats=eslFreeFormCaveats;
      }
      else {
        model.eslFreeFormCaveats="";
      }
      model.eslClosed=closedStr;
      model.eslOpen=openStr;
      model.eslOrganisation=orgStr;
      if (eslEyes !=null ) {
        model.eslEyes=eslEyes;
      }
      else {
        model.eslEyes="";
      }
      if (eslAtomal!=null) {
          model.eslAtomal=eslAtomal;
      }
      else {
          model.eslAtomal="";
      }
      
      if (content)
      {
         var size = content.substring(content.indexOf("size=") + 5);
         size = size.substring(0, size.indexOf("|"));
         node.size = size;
      }
      else
      {
         node.size = "0";
      }

      // Prepare the model
      model.node = node;
   }
}

// Start the webscript
main();
