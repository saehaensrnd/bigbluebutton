/* eslint prefer-promise-reject-errors: 0 */

import Auth from '/imports/ui/services/auth';

class Attendance {

    checkAttendance(eventID, name, userID, userType){

      var x = new XMLHttpRequest();
      var getMeetings_url = "https://HOST/bigbluebutton/api/getMeetings?checksum=checksum";
      x.open("GET", getMeetings_url, false);
      x.onreadystatechange = function () {
        if (x.readyState == 4) {
    
          if(x.status == 200){
    
            var doc = x.responseXML;
          
            var meetings = "";
           
    
            meetings = doc.getElementsByTagName("meeting");
   
            if(meetings.length > 0){
              
              for(var i=0; i<meetings.length; i++){

                var meetingID = meetings[i].getElementsByTagName("meetingID").item(0).textContent;
                var internalMeetingID = meetings[i].getElementsByTagName("internalMeetingID").item(0).textContent;
  
                if(internalMeetingID == Auth.meetingID){
  
                  var url = "";
                  if(meetingID.indexOf("B0001") !== -1){
                    if(meetingID.indexOf("60542") !== -1 || meetingID.indexOf("60610") !== -1 || 
                      meetingID.indexOf("60544") !== -1 ||meetingID.indexOf("60377") !== -1){

                        if(eventID === "user-joined" || eventID === "user-left"){
                          url = "http://HOST?Id=" + eventID + "&external=" + meetingID + 
                                  "&name=" + name + "&userID=" + userID + "&userType=" + userType;
                        } else if(eventID === "meeting-ended"){
                          url = "http://HOST?Id=" + eventID + "&external=" + meetingID;
                        }
                        window.open(url, 'API', 'width=500, height=500, left=0, top=0');
                        
                    }
  
                  } else if(meetingID.indexOf("AA800") !== -1){

                    if(eventID === "user-joined" || eventID === "user-left"){
                      url = "HOST?Id=" + eventID + "&external=" + meetingID + 
                              "&name=" + name + "&userID=" + userID + "&userType=" + userType;
                    } else if(eventID === "meeting-ended"){
                      url = "HOST?Id=" + eventID + "&external=" + meetingID;
                    }                   
                    window.open(url, 'API', 'width=500, height=500, left=0, top=0');
                  }
                  break;
                }
                        
              }
    
            }
    
          } 
    
      }};
              
      x.send();  
  
    }

}

const AttendanceSingleton = new Attendance();
export default AttendanceSingleton;
