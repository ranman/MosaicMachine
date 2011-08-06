/* Events which trigger page changes */
$(document).bind('FBLoaded', function() {
    // Fade out header.
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

    $('#infoHideDivButton').toggle(
        function(){
            $('#infobar').animate({marginTop: '-35px'}, 1000);
        },
        function(){
            $('#infobar').animate({marginTop: '-225px'}, 1000);
        }
    );
});
$(document).bind('loadingFriends', function() {
    $('#loginButton').hide();
    $('#loadingSpinner').show();
    $('#loadText').show();
    $('#loadText').text('Loading Friends');
    $('#infobar').animate({marginTop: '-225px'}, 1000);
});
$(document).bind('loadingPhotos', function() {
    console.log('Loading Photos');
    $('#loadText').text('Loading Photos');
})
$(document).bind('displayPhotos', function() {
    $('#loadingSpinner').hide();
    $('#loadText').hide();
    $('#photos').show();
});
$(document).bind('photoListItemClick', function() {
    /* Query to get photos of you with clicked on user */
    FB.api({
        method: 'fql.query',
        query: 'SELECT src_big FROM photo WHERE pid IN (SELECT pid FROM photo_tag WHERE subject='+uid+') AND pid IN (SELECT pid FROM photo_tag WHERE subject='+$(this).attr('id')+')'
    }, function(response) {
        console.log(response);
    })
});

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
            $.event.trigger('loadingFriends');
            FB.api({
                method: 'fql.query',
                query: 'SELECT uid, sex, name, pic_big FROM user '
                        +'WHERE uid IN '
                        +'(SELECT uid2 FROM friend WHERE uid1 ='+uid+')'
            }, function(response) {
                /* Sort and filter through friends */
                response = Mosaic.sortFriends(response);
                response = Mosaic.filterFriends(response);
                /* Build the Mosaic */
                $.event.trigger('loadingPhotos');
                photo_array = [];
                photo_array.push('<ul id="photoList">');
                imageObj = new Image(); // object to preload images into cache
                $.each(response, function(index, friend) {
                    imageObj.src=friend.pic_big; // preload images
                    photo_array.push('<li id="'+friend.uid+'" title="'+friend.name+'" class="photoListItem"><img src="'+friend.pic_big+'" /></li>');
                });
                photo_array.push('</ul>');
                $('#photos').html(photo_array.join(''));

                /* Setup the click */
                $('#photoList>li').click(
                    function() {
                        $.event.trigger('photoListItemClick');
                    }
                );
                /* Finally display the photo wall */
                $.event.trigger('displayPhotos');
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
    $.event.trigger('FBLoaded');
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