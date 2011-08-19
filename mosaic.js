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
$(document).bind('loadingPhotos', function() {
    $('#loadText').text('Loading Photos');
});
$(document).bind("displayPhotos", function() {
    $('#loadingSpinner').hide();
    $('#loadText').hide();
    $("#photos").show();
    Slider.init('myAlbums', produceItemTest, false);
    Slider.init('profiles', null, false);
    Slider.init('filter', null, false);
});
/* * * * * * * * * * * * * * * * * * * *
 *     Actual mosaic shit goes here    *
 * * * * * * * * * * * * * * * * * * * */

/* sliderStuff */

var Slider = Slider || new function(){
    var sliderParams = [];
    this.init = function(id, loadCall, al){
        sliderParams[id] = {toggle: 0, slideItems: null, load: loadCall, alwaysLoad: al, pos: 0};
        $('#'+id+'>.slideLabel').click(function(){
            Slider.toggle(id);
        });
        $('#'+id+'>.slideBackward').click(function(){
            var s = sliderParams[id];
            var threeDiff = s.slideItems.length % 3;
            if ((s.pos + threeDiff) - 3 >= 0) {
                s.pos -= 3;
                $('#'+id+'>.slideContent>.slideContentHelper').animate({left: (s.pos * -164)+'px'}, 1000, function(){});   
            }   
            Slider.buttonAdjust(id);  
        });
        $('#'+id+'>.slideForward').click(function(){
            var s = sliderParams[id];
            if (s.pos + 3 <= (s.slideItems.length - 3)) {
                s.pos += 3;
                $('#'+id+'>.slideContent>.slideContentHelper').animate({left: (s.pos * -164)+'px'}, 1000, function(){}); 
            }   
            Slider.buttonAdjust(id);
        });
    };
    this.buttonAdjust = function(id) {
        var s = sliderParams[id];
        var threeDiff = s.slideItems.length % 3;
        if (s.pos == (s.slideItems.length - 3)) {
                $('#'+id+'>.slideForward').animate({width: '0px'}, 500, function(){});
        } else {
            if (parseInt($('#'+id+'>.slideForward').css('width')) == 0) {
                $('#'+id+'>.slideForward').animate({width: '55px'}, 500, function(){});
            }
        }
        if ((s.pos + threeDiff) - 3 <= 0) {
                $('#'+id+'>.slideBackward').animate({width: '0px'}, 500, function(){});
        } else {
            if (parseInt($('#'+id+'>.slideBackward').css('width')) == 0) {
                $('#'+id+'>.slideBackward').animate({width: '55px'}, 500, function(){});
            }
        }
    }
    this.toggle = function(id) {
        var s = sliderParams[id];
        if (s.toggle == 1) {
            $('#'+id).animate({marginLeft: '-602px'},1000,function(){});
            $('#'+id+'>.slideBackward').css('width', '55px');
            $('#'+id+'>.slideForward').css('width', '55px');
            s.toggle = 0; 
        } else {
            if (s.slideItems == null || s.alwaysLoad) {
                s.slideItems = s.load();
                for (i in s.slideItems.reverse()) {
                    $('#'+id+'>.slideContent>.slideContentHelper').append(s.slideItems[i]);
                }
                var threeDiff = s.slideItems.length % 3;
                s.pos = (s.slideItems.length - 3);
                $('#'+id+'>.slideContent>.slideContentHelper').css('left', ((s.slideItems.length - 3) * -164)+'px');
            } 
            Slider.buttonAdjust(id);
            $('#'+id).animate({marginLeft: '0px'},1000,function(){});
            s.toggle = 1; 
        }
    };
}(); 

function produceItemTest() {
    var i1 = '<div class="slideContentItem">hello-i1</div>';
    var i2 = '<div class="slideContentItem">hello-i2</div>';
    var i3 = '<div class="slideContentItem">hello-i3</div>';
    var i4 = '<div class="slideContentItem">hello-i4</div>';
    var i5 = '<div class="slideContentItem">hello-i5</div>';
    var i6 = '<div class="slideContentItem">hello-i6</div>';
    var i7 = '<div class="slideContentItem">hello-i7</div>';
    var i8 = '<div class="slideContentItem">hello-i8</div>';
    return [i1,i2,i3,i4,i5,i6,i7,i8]
}

/* Create the namespace */
var Mosaic = Mosaic || new function(){
    var cUser; //this is the uid of the user who is using the application
    
    /* caching fields*/
    var friendsCache = [];
    var jointCache = [];
    var permissionsCache = [];
    var albumsCache = []; // stores data about cUser's albums
    var albumDataCache = []; // stores the images in each of cUser's albums
    var friendPhotoCache = [];
    
    this.buildMosaic = function(response) {
        /* Let the pageb know we've started talking to facebook 
         * If the response exists, check the session, 
         * if session exists, the login succeeded, proceed.
         */
        if(response && response.session) {
            uid = response.session.uid;
            cUser = uid+'';
            /* Let the page know we've started loading friends */
            $.event.trigger("loadingFriends");
            
            Mosaic.loadFriends(uid, function(photos){
                $("#photos").html('<ul id="photoList"></ul>');
                
                response = Mosaic.filterFriends(response);
                response = Mosaic.sortFriends(response);
                Mosaic.addPhotos(photos, function(){});
                
                $.event.trigger("displayPhotos");
            });
        }
    };
    this.addPhotos = function(photos, clickCallback) {
        photo_array = [];
        for (p in photos) {
            photo_array.push('<li id="'+photos[p].ids+'" title="'+photos[p].name+'" class="something"><img src="'+photos[p].src+'" /></li>');
        }
        $("#photoList").html($("#photoList").html()+photo_array.join(''));
        $('#photoList>li').click(clickCallback);
    };
    this.clearPhotos = function() {
        $("#photoList").html('');
    };
    //TODO: make working filtering functions
    this.sortFriends = function(friends) {
        return friends;
    };
    this.filterFriends = function(friends) {
        return friends;
    };
        
    /* load all friends / profile pictures for init */
    this.loadFriends = function(uid, callback) {
        if (friendsCache.length > 0) {
            callback(friendsCache);
        } else {
            FB.api({
                method: 'fql.query',
                query: 'SELECT uid, sex, name, pic_big, relationship_status FROM user '
                      +'WHERE uid IN '
                      +'(SELECT uid2 FROM friend WHERE uid1 ='+uid+')'
            }, function(response) {
                $.each(response, function(index, friend) {
                    friendsCache[friend.uid+''] = {ids: friend.uid, sex: friend.sex, name: friend.name, src: friend.pic_big, relationship_status: friend.relationship_status};
                });
                callback(friendsCache);
            });
        }           
    };
    /* load permissions for a friend */ 
    /*
    this.loadPermissions = function(id, callback) {
        FB.api
    };
    */
    //uid2 is always the friend of the current user
    this.loadJointPhotos = function(uid1, uid2, callback){ 
        if (uid2+'' in Mosaic.jointCache) {
            callback(jointCache[uid2+'']);
        } else {
            FB.api({
            method: 'fql.query',
            query: 'SELECT src_big FROM photo WHERE pid IN (SELECT pid FROM photo_tag WHERE subject='+uid1+') AND pid IN (SELECT pid FROM photo_tag WHERE subject='+uid2+')'
            }, function(response) {
                jointCache[uid2+''] = response;
                console.log(response);
                callback(response);
            }); 
        }
    };
    
    /* load photos of a friend */
    this.loadPhotos = function(uid, callback) {
        if (uid+'' in friendPhotoCache) {
            return callback(friendPhotoCache[uid+'']);
        } else {
            FB.api('/'+uid+'/photos', function(response){
                friendPhotoCache[uid+''] = response;    
                console.log(response);
                callback(response);
            });
        }
    };
    /* load one of your facebook albums */
    this.loadUserAlbums = function(uid, callback) {
        if (uid+'' in MosaicCache.albums) {
            callback(albumsCache[uid+'']);
        } else { 
        //add code to inspect cache
            FB.api('/me/albums', function(response){
                albumsCache[uid+''] = response;    
                console.log(response);
                callback(response);
            });
        }
    }
    /* load your facebook albums */
    this.loadAlbumPhotos = function(albumId, callback) {
        if (albumId+'' in albumDataCache) {
            callback(albumDataCache[albumId+'']);
        } else {
            FB.api('/'+albumId+'/photos', function(response){
                albumDataCache[albumId+''] = response;
                var paging = pagingHelperCache(response)
                if (paging) {
                    console.log(paging);
                } 
            });
        }
    };
    /*Some calls to the FB API only return part of the dataset
    *we'll need to build in code to get successive pages and add these to the mosaic on screen
    *this is why we have an addPhotos function, becuase photos may be loaded in batches and delivered to screen
    */
    this.pagingHelper = function(response) {
        if ("next" in response.paging) {
            var pStr = response.paging.next.split('?').pop();
            var pArr = pStr.split('&');
            var p1 = pArr.pop().split('=');
            var startV = p1.pop();
            var startL = p1.pop();
            var p2 = pArr.pop().split('=');
            var stopV = p2.pop();
            var stopL = p2.pop();
            return {startL: startL,startV: startV,stopL: stopL,stopV: stopV};
        } else {
            return false;
        }
    }; 
}();
/*** END MOSAIC CODE ***/
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
