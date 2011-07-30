/* Events which trigger page changes */
$.bind("FBLoaded", function() {
    $('#loginButton').hide();
    $('#loadingSpinner').show();
    $('#loadText').show();
    $('#topBar').fadeTo(1,.1);
    $('#topBar').mouseover(function(){$('#constant').fadeTo(4,1);});
    $('#topBar').mouseleave(function(){$('#constant').fadeTo(4,0.1);});
});
$.bind("loadingFriends", function() {
    $('#loadText').text("Loading Friends");
});
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
            /* Select yourself and all friends */
            FB.api({
                method: 'fql.query',
                query: 'SELECT uid, name, pic_big FROM user WHERE uid ='
                        +uid
                        +' OR uid IN (SELECT uid2 FROM friend WHERE uid1 ='+uid+')'
            }, function(response) {
                response = Mosaic.filterFriends(response);
                response = Mosaic.sortFriends(response);
                photo_array = [];
                photo_array.push('<ul id="something">');
                $.each(response, function(index, friend) {
                    photo_array.push('<li title="'+friend.name+'" class="something"><img src="'+friend.pic_big+'" /></li>');
                });
                photo_array.push('</ul>');
                $("#photos").html(photo_array.join(''));
            });
        }
    },
    sortFriends: function(friends) {
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