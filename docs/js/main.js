 function loginLogout(ref) {
	  if($("#loginButton").val()=="login"){
			FB.getLoginStatus(function(response){
				if(response.status=="not_authorized"){
					$("#status").text("You are not authorized to use this app");
				}
				else{ 
				if(response.status=="connected"){
					
					//Changing value and display name of button	
					  $("#loginButton").text("Sign Out");		
				      $("#loginButton").val("signout");
					addHtmlElements();
					displayFeed();
				}
				else if(ref=="click"){
					FB.login(function(resp){
						if(resp.authResponse){
							//Changing value and display name of button	
							  $("#loginButton").text("Sign Out");		
						      $("#loginButton").val("signout");
								addHtmlElements();
						displayFeed();
						}
							},{scope: "user_birthday,user_hometown, user_likes,user_location,publish_actions, manage_notifications, read_insights, read_stream"}
						);
					
					
				}
				}});
		}
		else if($("#loginButton").val()=="signout"){
		
			  $("#loginButton").text("Login");
		      $("#loginButton").val("login");
		     $("#container").find("*").remove();
		     $("#birthdayFeed").find("*").remove();
			FB.logout();
				
			} 
  }
  //Adding html elements
  function addHtmlElements(){
	  

  	//Input box to write the comment
     var inputBox= $("<input></input>").attr("id","comment")
										   .attr("type","text");
	//Button to post comment
	var postCommentButton=$("<button></button>").attr("id","postComment")
											.attr("value","postComment")
										  .text("Comment")
										  .attr("class","postComment")
	  										.attr("onclick", "checkInput()");
	 
 	$("#container").append(inputBox);
 	$("#container").append(postCommentButton);

  }
  
//Login script or logout
	$("document").ready(function(){
	$("#loginButton").click(function(){
	loginLogout("click");
	});
	});	
//Displaying feed
function displayFeed(){
		
		
		FB.api("me/feed",function(response){
				var i=response.data.length;
				var d = response.data
				var fromName,fromId;
				var wallPostId;
				var message;
				console.log("data array: "+i)
				
				var j=0;
				//Displaying Birthday feed on index page
				
				while(i!=0){
					if(d[j].to){
							fromId=d[j].from.id;
							fromName=d[j].from.name;
							wallPostId=d[j].id;
							message=d[j].message;
						
							//posts only if message contain "happ" string
							var value = message.toLowerCase().search("happ");
							if(value>=0){

								
								var htmlContent;
								if(d[j].comments!=null){
									htmlContent="<span class='tickContainer'><img class='tick' src='images/tick.png'/></span>";
									}
								htmlContent=htmlContent+" <b>"+"<a target='_blank' class='facebookLink' id='"+fromId+"'" +"href='https://www.facebook.com/"+fromId+"'>"
								+fromName+"</a>"+"</b>"+" posted "+ "\""+message+"\"";
								var feedMessage = $("<p></p>").attr("class","feed")
								.html(htmlContent);
		
								$("#birthdayFeed").append(feedMessage);
							
						}
						
					}
					j++;
						i--;
				}
		});
		
	}
	
	//Posting a comment to a wall post
	
	function postComment(resp){
		
		console.log(JSON.stringify(resp)+ " pC");
		//Gets all posts on your wall
		FB.api("me/feed",function(response){
				var i=response.data.length;
				var d = response.data
				var fromName;
				var wallPostId;
				var message;
				console.log("data array: "+i)
				
				var j=0;
				
				
				//Searching for "happ" string and posting comment
				while(i!=0){
				if(d[j].to){
					if(d[j].to.data[0].id==resp.id){
						fromName=d[j].from.name;
						wallPostId=d[j].id;
						message=d[j].message;
						console.log(fromName+" id: "+wallPostId+" message: "+message );
						//posts only if message contain "happ" string
						var value = message.toLowerCase().search("happ");
						if(value>=0){
						//Post Comment only if you didn't comment earlier
							if(d[j].comments==null ||!checkYourComment(d[j].comments.data,resp.id)){
								
								alert("Do you really want to post "+ message); 
						FB.api("/"+wallPostId+"/comments","POST",{message:$("#comment").val().trim()},function(response){
								console.log(JSON.stringify(response+"  response of post"));
							});
							}
					}
					}
				}
				j++;
					i--;
				}
			});
			
		}
	//Gets user details and forwards to postComment() method
	function getUserDetails(){
			
		FB.api("me?fields=birthday,id,hometown,location,first_name, name", function(resp){
			console.log(JSON.stringify(resp)+" gUD");
			
			postComment(resp);
			});
		
				
		}
	
//Checks if you had already commented on the post or not
function checkYourComment(comments, yourId){
if(comments==null)
	return false;
var d = comments.data;
var l = d.length;
var m=0;
while(l!=0){
	if(d[m].id==yourId)
		return true;
	m++;
	l--;
}
return false;
}

//Check whether input box is empty or not

function checkInput(){

	var comment = $("#comment").val().trim();
	if(comment==""||comment==null){
		if($("#errorMessage")){
			$("#errorMessage").remove();
			}
		var errorMessage = $("<p></p>").attr("id","errorMessage")
												.text("Write your comment first");
		$("#container").append(errorMessage);
		$("#errorMessage").fadeOut(1000,function(){
			$("#errorMessage").remove();});
	}
	else{
		console.log("Your comment:"+$("#comment").val());
	getUserDetails();	
	}
	
}
