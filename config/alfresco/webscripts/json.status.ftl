<!--
    Copyright (C) 2008-2010 Surevine Limited.
      
    Although intended for deployment and use alongside Alfresco this module should
    be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
    http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
    
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->
{
  <#-- Details of the response code -->
  "status" : 
  {
    "code" : "",
    "name" : "An Error has Occurred",
    "description" : "An Error has Occurred.  This may be because the item you requested doesn't exist or because you don't have the necessary permissions to view it.  If you believe that the item you are requesting exists, and that you have the permissions to see it, then please contact your system administrator."
  },  
  
  <#-- Exception details -->
  "message" : "",  
  "exception" : "",
  
  <#-- Exception call stack --> 
  "callstack" : 
  [ 
  ],
  
  <#-- Server details and time stamp -->
  "server" : "",
  "time" : "${date?datetime}"
}
