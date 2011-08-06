/* Events which trigger page changes */
$(document).bind("FBLoaded", function() {
    $('#constant').fadeTo(1,0.5);
    $('#constant').mouseover(function(){$('#constant').fadeTo(4,1);});
    $('#constant').mouseleave(function(){$('#constant').fadeTo(4,0.25);});
    
    $('#infoHideDivRight').mouseover(function(e){e.stopPropagation();});
    $('#infoHideDivRight').mouseleave(function(){$('#infoContent').fadeTo(4,0.25);$('#infoHideDivButton').fadeTo(4,0.25);});
    $('#infoHideDivLeft').mouseover(function(e){e.stopPropagation();});
    $('#infoHideDivLeft').mouseleave(function(){$('#infoContent').fadeTo(4,0.25);$('#infoHideDivButton').fadeTo(4,0.25);});
    
    $('#infoContent').fadeTo(4,0.5);
    $('#infoHideDivButton').fadeTo(4,0.5);
    $('#infobar').mouseover(function(){$('#infoContent').fadeTo(4,1);$('#infoHideDivButton').fadeTo(4,1);});
    $('#infobar').mouseleave(function(){$('#infoContent').fadeTo(4,0.25);$('#infoHideDivButton').fadeTo(4,0.25);});
        
    $("#infoHideDivButton").toggle(
		function(){
 			$("#infobar").animate({marginTop: "-35px"}, 1000);
 		},
        function(){
			$("#infobar").animate({marginTop: "-225px"}, 1000);
        }
    );
});
$(document).bind("loadingFriends", function() {
    $('#loginButton').hide();
    $('#loadingSpinner').show();
    $('#loadText').show();
    $('#loadText').text("Loading Friends");
    $("#infobar").animate({marginTop: "-225px"}, 1000);
});
$(document).bind("displayPhotos", function() {
    $('#loadingSpinner').hide();
    $('#loadText').hide();
    $("#photos").show();
})

/* * * * * * * * * * * * * * * * * * * *
 *     Actual mosaic shit goes here    *
 * * * * * * * * * * * * * * * * * * * */
/* Create the namespace */
/* I wanted public and private methods + fields.  Module pattern now.*/
var Mosaic = Mosaic || new function(){
    var loadedUsers = new Array(); // this will store data about already loaded users to prevent duplicate calls
    this.buildMosaic = function(response) {
        /* Let the pageb know we've started talking to facebook */
        /* If the response exists, check the session, 
         * if session exists, the login succeeded, proceed.
         */
        if(response && response.session) {
            uid = response.session.uid;
            Mosaic.loadProfile(uid, function(response) {console.log(response); }); 
            /* Let the page know we've started loading friends */
            $.event.trigger("loadingFriends");
            FB.api({
                method: 'fql.query',
                query: 'SELECT uid, sex, name, pic_big FROM user '
                        +'WHERE uid IN '
                        +'(SELECT uid2 FROM friend WHERE uid1 ='+uid+')'
            }, function(response) {
                /* Sort and filter through friends */
                response = Mosaic.filterFriends(response);
                response = Mosaic.sortFriends(response);
                /* Build the Mosaic */
                photo_array = [];
                photo_array.push('<ul id="photoList">');
                $.each(response, function(index, friend) {
                    photo_array.push('<li id="'+friend.uid+'" title="'+friend.name+'" class="something"><img src="'+friend.pic_big+'" /></li>');
                });
                photo_array.push('</ul>');
                $("#photos").html(photo_array.join(''));
                /* Mouse Event Handlers for Photos */
loadedUsers
                /* Setup the hover */
                $("#photoList>li").hover(
                    function() {
                        //Show most recent interaction
                    },
                    function() {
                        //Hide most recent interaction
                    }
                );
                /* Setup the click */
                $("#photoList>li").click(
                    function() {
                        /* Query to get photos of you with clicked on user */
                        FB.api({
                            method: 'fql.query',
                            query: 'SELECT src_big FROM photo WHERE pid IN (SELECT pid FROM photo_tag WHERE subject='+uid+') AND pid IN (SELECT pid FROM photo_tag WHERE subject='+$(this).attr('id')+')'
                        }, function(response) {
                            console.log(response);
                        })
                    }
                );
                /* Finally display the photo wall */
                $.event.trigger("displayPhotos");
            });
        }
    };
    this.loadProfile = function(id, callback) {
        if (id+'' in loadedUsers) {
            return loadedUsers[id+''];
        } else {
            FB.api({
                    method: 'fql.query',
                    query: 'SELECT uid, name, pic_small, religion, birthday, sex, meeting_for, meeting_sex, relationship_status, significant_other_id, political, current_location, interests, music, tv, movies, books, quotes, about_me, hs_info, education_history, status, website FROM user WHERE uid='+id 
               }, function(response) {
                    loadedUsers[id+''] = response;
                    callback(response); 
               });
        }
    }; 
    this.sortFriends = function(friends) {
        return friends;
    },
    this.filterFriends = function(friends) {
        return friends;
    }
}();
/* Load FB-async */
window.fbAsyncInit = function() {
    FB.init({appId: '153403654734305', status: true, cookie: true,
           xfbml: true});
    isLoaded = true;
    $.event.trigger("FBLoaded");
    /* Subscribe to 'login' events, build mosaic */
    FB.Event.subscribe('auth.login', Mosaic.buildMosaic);
    /* If already logged in, build mosaic */
    FB.getLoginStatus(Mosaic.buildMosaic);
};
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol +
    '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
