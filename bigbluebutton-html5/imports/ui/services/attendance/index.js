/* eslint prefer-promise-reject-errors: 0 */

import Auth from '/imports/ui/services/auth';

class Attendance {

    checkAttendance(eventID, name, userID, userType){

      var x = new XMLHttpRequest();
      var getMeetings_url = "https://netstudy.saehaens.com/bigbluebutton/api/getMeetings?checksum=28100ab2078628fbfdd708c6be0295e67bb4c220";
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

                console.log("Id" + meetingID);

                if(internalMeetingID == Auth.meetingID){
  
                  if(meetingID.indexOf("FT001") == -1){
         
                    if(eventID === "user-left"){

                        var form = document.createElement("form");
                        var parm = new Array();
                        var input = new Array();
                
                        //form.target = "_blank";
                        //form.action = "http://jangoneadmin.inetstudy.co.kr/adminClass/schedule/ReceiveIOData.asp";
                        form.action = "https://abc.sdm.go.kr/Common/ReceiveIOData.asp";
                        form.method = "post";
                
                        var pw = 2;

                        if(userType == "teacher") 
                          pw = 1;
                        else 
                          pw = 2;

                        parm.push( ['Id', eventID] );
                        parm.push( ['external', meetingID] );
                        parm.push( ['name', name] );
                        parm.push( ['userID', userID] );
                        parm.push( ['userType', userType] );
                    
                        //console.log(eventID + " : " + meetingID + " : " + name + " : " + userID + " : " + userType);
                        //alert(eventID + " : " + meetingID + " : " + name + " : " + userID + " : " + userType);

                        //alert(eventID + " : " + getJoinUrl(meetingID, pw, userID, name));           

                        for (var i = 0; i < parm.length; i++) {
                          input[i] = document.createElement("input");
                          input[i].setAttribute("type", "hidden");
                          input[i].setAttribute('name', parm[i][0]);
                          input[i].setAttribute("value", parm[i][1]);
                          form.appendChild(input[i]);
                        }
                      
                      document.body.appendChild(form);
                      form.submit();

                    } else if(eventID === "meeting-ended"){

                        var form = document.createElement("form");
                        var parm = new Array();
                        var input = new Array();
                
                        //form.target = "_blank";
                        //form.action = "http://jangoneadmin.inetstudy.co.kr/adminClass/schedule/ReceiveIOData.asp";
                        form.action = "https://abc.sdm.go.kr/Common/ReceiveIOData.asp";
                        form.method = "post";
                
                        var pw = 2;

                        if(userType == "teacher") 
                          pw = 1;
                        else 
                          pw = 2;

                        parm.push( ['Id', eventID] );
                        parm.push( ['external', meetingID] );
        
                        //alert(eventID + " : " + meetingID);
                        //console.log(eventID + " : " + meetingID);
                        
                        //alert(eventID + " : " + getJoinUrl(meetingID, pw, userID, name));           

                        for (var i = 0; i < parm.length; i++) {
                          input[i] = document.createElement("input");
                          input[i].setAttribute("type", "hidden");
                          input[i].setAttribute('name', parm[i][0]);
                          input[i].setAttribute("value", parm[i][1]);
                          form.appendChild(input[i]);
                      }
                      
                      document.body.appendChild(form);
                      form.submit();

                    }
                        //window.open(url, 'API', 'width=500, height=500, left=0, top=0');
                        
                    
  
                  //} 
                  
                  // else if(meetingID.indexOf("AA800") !== -1){

                  //   // if(eventID === "user-joined" || eventID === "user-left"){
                  //   //   url = "http://lms.beaconeng.co.kr/adminClass/course/ReceiveData.asp?Id=" + eventID + "&external=" + meetingID + 
                  //   //           "&name=" + name + "&userID=" + userID + "&userType=" + userType;
                  //   // } else if(eventID === "meeting-ended"){
                  //   //   url = "http://lms.beaconeng.co.kr/adminClass/course/ReceiveData.asp?Id=" + eventID + "&external=" + meetingID;
                  //   // }                   
                  //   // window.open(url, 'API', 'width=500, height=500, left=0, top=0');

                  //   console.log("Id" + eventID);
                  //   console.log("Id" + meetingID);
                  //   console.log("Id" + userType);


                  //   if(eventID === "user-left"){

                  //       var form = document.createElement("form");
                  //       var parm = new Array();
                  //       var input = new Array();
                
                  //       //form.target = "_blank";
                  //       //form.action = "http://jangoneadmin.inetstudy.co.kr/adminClass/schedule/ReceiveIOData.asp";
                  //       form.action = "https://abc.sdm.go.kr/Common/ReceiveIOData.asp";
                  //       form.method = "post";
                
                  //       var pw = 2;

                  //       if(userType == "teacher") 
                  //         pw = 1;
                  //       else 
                  //         pw = 2;

                  //       parm.push( ['Id', eventID] );
                  //       parm.push( ['external', meetingID] );
                  //       parm.push( ['name', name] );
                  //       parm.push( ['userID', userID] );
                  //       parm.push( ['userType', userType] );
                    
                        
                  //       //alert(eventID + " : " + getJoinUrl(meetingID, pw, userID, name));           

                  //       for (var i = 0; i < parm.length; i++) {
                  //         input[i] = document.createElement("input");
                  //         input[i].setAttribute("type", "hidden");
                  //         input[i].setAttribute('name', parm[i][0]);
                  //         input[i].setAttribute("value", parm[i][1]);
                  //         form.appendChild(input[i]);
                  //       }
                      
                  //     document.body.appendChild(form);
                  //     form.submit();

                  //   } else if(eventID === "meeting-ended"){

                  //       var form = document.createElement("form");
                  //       var parm = new Array();
                  //       var input = new Array();
                
                  //       //form.target = "_blank";
                  //       //form.action = "http://jangoneadmin.inetstudy.co.kr/adminClass/schedule/ReceiveIOData.asp";
                  //       form.action = "https://abc.sdm.go.kr/Common/ReceiveIOData.asp";
                  //       form.method = "post";
                
                  //       var pw = 2;

                  //       if(userType == "teacher") 
                  //         pw = 1;
                  //       else 
                  //         pw = 2;

                  //       parm.push( ['Id', eventID] );
                  //       parm.push( ['external', meetingID] );
        
                        
                  //       //alert(eventID + " : " + getJoinUrl(meetingID, pw, userID, name));           

                  //       for (var i = 0; i < parm.length; i++) {
                  //         input[i] = document.createElement("input");
                  //         input[i].setAttribute("type", "hidden");
                  //         input[i].setAttribute('name', parm[i][0]);
                  //         input[i].setAttribute("value", parm[i][1]);
                  //         form.appendChild(input[i]);
                  //     }
                      
                  //     document.body.appendChild(form);
                  //     form.submit();

                  //   }
               
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
