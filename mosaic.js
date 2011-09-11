/* Events which trigger page changes */
window.$my = {
    constant: $('#constant'),
    infoHideDivRight: $('#infoHideDivRight'),
    infoHideDivLeft: $('#infoHideDivLeft'),
    infoHideDivButton: $('#infoHideDivButton'),
    infoContent: $('#infoContent'),
    infobar: $('#infobar'),
    loginButton: $('#loginButton'),
    loadingSpinner: $('#loadingSpinner'),
    loadText: $('#loadText'),
    photos: $('#photos')
};
$(document).bind("FBLoaded", function() {
    $my.constant.fadeTo(1,0.5).mouseover(function(){$my.constant.fadeTo(4,1);}).mouseleave(function(){$my.constant.fadeTo(4,0.25);});

    $my.infoHideDivRight.mouseover(function(e){e.stopPropagation();});
    $my.infoHideDivRight.mouseleave(function(){$my.infoContent.fadeTo(4,0.25);$my.infoHideDivButton.fadeTo(4,0.25);});
    $my.infoHideDivLeft.mouseover(function(e){e.stopPropagation();});
    $my.infoHideDivLeft.mouseleave(function(){$my.infoContent.fadeTo(4,0.25);$my.infoHideDivButton.fadeTo(4,0.25);});

    $my.infoContent.fadeTo(4,0.5);
    $my.infoHideDivButton.fadeTo(4,0.5);
    $my.infobar.mouseover(function(){$my.infoContent.fadeTo(4,1);$my.infoHideDivButton.fadeTo(4,1);});
    $my.infobar.mouseleave(function(){$my.infoContent.fadeTo(4,0.25);$my.infoHideDivButton.fadeTo(4,0.25);});
});
$(document).bind('loadingFriends', function() {
    $my.loginButton.hide();
    $my.loadingSpinner.show();
    $my.loadText.show();
    $my.loadText.text('Loading Friends');
    $my.infobar.animate({marginTop: '-225px'}, 1000);
});
$(document).bind('loadingPhotos', function() {
    $my.loadText.text('Loading Photos');
});
$(document).bind("displayPhotos", function() {
    $my.loadingSpinner.hide();
    $my.loadText.hide();
    $my.photos.show();
    Slider.init('myAlbums', Mosaic.sliderAlbumsPreviewArray, false);
    Slider.init('profiles', produceItemTest, false);
    Slider.init('filter', produceItemTest, false);
});
/* * * * * * * * * * * * * * * * * * * *
 *     Actual mosaic shit goes here    *
 * * * * * * * * * * * * * * * * * * * */

/* sliderStuff */

var Slider = Slider || new function(){
    var sliderParams = [];
    this.init = function(id, loadCall, al){
        sliderParams[id] = {toggle: 0, slideItems: [], load: loadCall,loadMode: 0, alwaysLoad: al, pos: 0};
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
    };
    this.clear = function(id) {
        var s = sliderParams[id];  
        $('#'+id+'>.slideContent>.slideContentHelper').html('');
        s.slideItems.length = 0;
        s.pos = 0;
    };
    this.add = function(item, id, callback) {
        var s = sliderParams[id];    
        if (s.loadMode == 1) {
            Slider.setLoading(id, 0);
        } 
        for (i in item.reverse()) {
            $('#'+id+'>.slideContent>.slideContentHelper').append(item[i]);
            s.slideItems.push(item[i]);
        }
        $('#'+id+'>.slideContent>.slideContentHelper').children().click(callback);
        if (s.pos == 0) {
            s.pos = (s.slideItems.length - 3);
            $('#'+id+'>.slideContent>.slideContentHelper').css('left', ((s.slideItems.length - 3) * -164)+'px');
            Slider.buttonAdjust(id);
        } else {
            $('#'+id+'>.slideContent>.slideContentHelper').css('left', ((s.slideItems.length - 3) * -164)+'px');
        }
    };
    this.setLoading = function(id, loadState) {
        var s = sliderParams[id];
        s.loadMode = loadState;
        if (loadState == 0) {
            Slider.clear(id);
        }
        else if (loadState == 1) {
            Slider.clear(id);
            $('#'+id+'>.slideContent>.slideContentHelper').append('<div class="slideContentItem"></div>');
            $('#'+id+'>.slideContent>.slideContentHelper').append('<div class="slideContentItem"><img src="ajax-loader.gif" /></div>');
            s.slideItems.push('<div class="slideContentItem">block</div>');
            s.slideItems.push('<div class="slideContentItem">loading spinner</div>');
            Slider.buttonAdjust(id);
        }    
        else{}
    };
    this.toggle = function(id) {
        var s = sliderParams[id];
        if (s.toggle == 1) {
            var slideVal = -602;
            if (parseInt($('#'+id+'>.slideBackward').css('width')) < 55) {
                slideVal += 55;
            }
            if (parseInt($('#'+id+'>.slideForward').css('width')) < 55) {
                slideVal += 55;
            }
            $('#'+id).animate({marginLeft: slideVal+'px'},1000,function(){});
            s.toggle = 0; 
        } else {
            if (s.slideItems.length == 0 || s.alwaysLoad) {
                Slider.setLoading(id, 1);
                s.load(id);
            } 
            Slider.buttonAdjust(id);
            $('#'+id).animate({marginLeft: '0px'},1000,function(){});
            s.toggle = 1; 
        }
    };
}(); 

/* Dummy function for testing sliders*/
function produceItemTest(id) {
    var i1 = '<div class="slideContentItem">hello-i1</div>';
    var i2 = '<div class="slideContentItem">hello-i2</div>';
    var i3 = '<div class="slideContentItem">hello-i3</div>';
    var i4 = '<div class="slideContentItem">hello-i4</div>';
    var i5 = '<div class="slideContentItem">hello-i5</div>';
    var i6 = '<div class="slideContentItem">hello-i6</div>';
    var i7 = '<div class="slideContentItem">hello-i7</div>';
    var i8 = '<div class="slideContentItem">hello-i8</div>';
    Slider.add([i1,i2,i3,i4,i5,i6,i7,i8], id);
}

/* Create the namespace */
var Mosaic = Mosaic || new function(){
    var cUser; //this is the uid of the user who is using the application
    var accessToken; // we'll need this to get to a lot of the photos
    
    /* caching fields*/
    var friendsCache = [];
    var jointCache = [];
    var permissionsCache = [];
    var albumsCache = []; // stores data about cUser's albums
    var albumDataCache = []; // stores the images in each of cUser's albums
    var friendPhotoCache = [];
    
    this.buildMosaic = function(response) {
        /* Let the page know we've started talking to facebook 
         * If the response exists, check the session, 
         * if session exists, the login succeeded, proceed.
         */
        if(response && response.session) {
            uid = response.session.uid;
            cUser = uid+'';
            accessToken = response.session.access_token;   
            /* Let the page know we've started loading friends */
            $.event.trigger("loadingFriends");
            
            Mosaic.loadFriends(uid, function(photos){
                $("#photos").html('<ul id="photoList"></ul>');
                
                response = Mosaic.filterFriends(response, {});
                response = Mosaic.sortFriends(response, {});
                Mosaic.addPhotos(photos, function(){});
                
                $.event.trigger("displayPhotos");
            });
        }
    };
    this.addPhotos = function(photos, clickCallback) {
        photo_array = [];
        for (p in photos) {
            photo_array.push('<li id="'+photos[p].ids+'" title="'+photos[p].name+'"><img src="'+photos[p].src+'" /></li>');
        }
        $("#photoList").html($("#photoList").html()+photo_array.join(''));
        $('#photoList>li').click(clickCallback);
    };
    this.clearPhotos = function() {
        $("#photoList").html('');
    };
    //TODO: make working filtering functions
    this.sortFriends = function(friends, params) {
        return friends;
    };
    this.filterFriends = function(friends, params) {
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
    this.sliderAlbumsPreviewArray = function(id) {
        Mosaic.loadUserAlbums(cUser, function(response){
            var output = [];
            for (ak in response.data) {
               output.push('<div class="slideContentItem" id="'+response.data[ak].id+'"><img src="https://graph.facebook.com/'+response.data[ak].id+'/picture?access_token='+accessToken+'"title="'+response.data[ak].name+'" height="111" width="144"/></div>');
               // TODO: bind click functions to slide content items
            }
            Slider.add(output, id, Mosaic.loadAlbumPhotos);
        });
    };
    /* loads the albums of a user*/
    this.loadUserAlbums = function(uid, callback) {
        if (uid+'' in albumsCache) {
            callback(albumsCache[uid+'']);
        } else { 
            FB.api('/me/albums', function(response){
                albumsCache[uid+''] = response;
                callback(response);
            });
        }
    };
    /* load the photos of a specific album */
    this.loadAlbumPhotos = function() {
    	var albumId = this.id;
        if (albumId+'' in albumDataCache) {
            callback(albumDataCache[albumId+'']);
        } else {
        	Mosaic.clearPhotos();
        	var f = function(response) {
        		albumDataCache[albumId+''] = response;
                console.log(response);
                var photos = [];
                for (p in response.data) {
                	var tPhoto = new Object();
                	tPhoto.ids = response.data[p].from.id;
                	tPhoto.name = response.data[p].from.name; 
                	tPhoto.src = response.data[p].source;
                	photos.push(tPhoto);
                }
                Mosaic.addPhotos(photos, function(){});
                if ("next" in response.paging) {
                	var paging = Mosaic.pagingHelper(response);
                	if (paging.limit && paging.offset) {
                		FB.api('/'+albumId+'/photos?offset='+paging.offset+'&limit='+paging.limit, function(response){
                			console.log(Mosaic.pagingHelper(response));
                			f(response);
            			});
            		}
                }
        	};
            FB.api('/'+albumId+'/photos', function(response){
            	//TODO: ADD LOADING SPINNER LOGIC
            	console.log(Mosaic.pagingHelper(response));
                f(response);
            });
        }
    };
    /*Some calls to the FB API only return part of the dataset
    *we'll need to build in code to get successive pages and add these to the mosaic on screen
    *this is why we have an addPhotos function, becuase photos may be loaded in batches and delivered to screen
    */
    this.pagingHelper = function(response) {
        if ("next" in response.paging) {
        	var limit = null;
        	var offset = null;
            var pStr = response.paging.next.split('?').pop();
            var pArr = pStr.split('&');
            for (i in pArr) {
            	var t = pArr[i].split('=');
            	var val = t.pop();
            	var key = t.pop();
            	if (key == 'limit') {
            		limit = val;
            	}
            	if (key == 'offset') {
            		offset = val;
            	}
            }
            return {limit: limit, offset: offset};
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
