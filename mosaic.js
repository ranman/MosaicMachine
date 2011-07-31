/* Events which trigger page changes */
$(document).bind("FBLoaded", function() {
    $('#loginButton').hide();
    $('#loadingSpinner').show();
    $('#loadText').show();
    $('#topBar').fadeTo(1,.1);
    $('#topBar').mouseover(function(){$('#constant').fadeTo(4,1);});
    $('#topBar').mouseleave(function(){$('#constant').fadeTo(4,0.1);});
});
$(document).bind("loadingFriends", function() {
    $('#loadText').text("Loading Friends");
});
$(document).bind("displayPhotos", function() {
    $('#loadingSpinner').hide();
    $('#loadText').hide();
    $("#photos").show();
})
/* Create the namespace */
var Mosaic = Mosaic || {
    buildMosaic: function(response) {
        /* Let the page know we've started talking to facebook */
        /* If the response exists, check the session, 
         * if session exists, the login succeeded, proceed.
         */
        if(response && response.session) {
            uid = response.session.uid;
            /* Let the page know we've started loading friends */
            $.event.trigger("loadingFriends");
            FB.api({
                method: 'fql.query',
                query: 'SELECT uid, sex, name, pic_big FROM user '
                        +'WHERE uid IN '
                        +'(SELECT uid2 FROM friend WHERE uid1 ='+uid+')'
            }, function(response) {
                response = Mosaic.filterFriends(response);
                response = Mosaic.sortFriends(response);
                photo_array = [];
                photo_array.push('<ul id="photoList">');
                $.each(response, function(index, friend) {
                    photo_array.push('<li id="'+friend.uid+'" title="'+friend.name+'" class="something"><img src="'+friend.pic_big+'" /></li>');
                });
                photo_array.push('</ul>');
                $("#photos").html(photo_array.join(''));

                /* Setup the hover */
                $("#photoList>li").hover(
                    function() {
                        //Show most recent interaction
                    },
                    function() {
                        //Hide most recent interaction
                    }
                );
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
                $.event.trigger("displayPhotos");
            });
        }
    },
    sortFriends: function(friends) {
        FB.api({
            method: ''
        }, function(response) {
            
        });
        return friends;
    },
    filterFriends: function(friends) {
        return friends;
    }
};
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