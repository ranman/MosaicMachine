/* Events which trigger page changes */
$(document).bind("FBLoaded", function() {
    $('#loginButton').hide();
    $('#loadingSpinner').show();
    $('#loadText').show();

    $('#constant').fadeTo(1,0.5);
    $('#constant').mouseover(function(){$('#constant').fadeTo(4,1);});
    $('#constant').mouseleave(function(){$('#constant').fadeTo(4,0.25);});
    $('#infobar').fadeTo(1,0.5);
    $('#infobar').mouseover(function(){$('#infobar').fadeTo(4,1);});
    $('#infobar').mouseleave(function(){$('#infobar').fadeTo(4,0.25);});
});
$(document).bind("loadingFriends", function() {
    $('#loadText').text("Loading Friends");
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
