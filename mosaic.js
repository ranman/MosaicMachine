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
    Slider.init('profiles', null, false);
    Slider.init('filter', produceItemTest, false);
});
/* sliderStuff */

var Slider = Slider || new function(){
    var sliderParams = [];
    this.init = function(id, loadCall, al){
        sliderParams[id] = {toggle: 0, slideItems: [], load: loadCall,loadMode: 0, alwaysLoad: al, pos: 0, me: $('#'+id), label: $('#'+id+'>.slideLabel'), backward: $('#'+id+'>.slideBackward'), forward: $('#'+id+'>.slideForward'), contentHelper: $('#'+id+'>.slideContent>.slideContentHelper')};
        var s = sliderParams[id];
        s.label.click(function(){
            Slider.toggle(id);
        });
        s.backward.click(function(){
            var threeDiff = s.slideItems.length % 3;
            if (s.pos + ((3 - threeDiff) % 3) > 0) {
                s.pos -= 3;
                s.contentHelper.animate({left: (s.pos * -164)+'px'}, 1000, function(){});   
            }   
            Slider.buttonAdjust(id);  
        });
        s.forward.click(function(){
            if (s.pos + 3 <= (s.slideItems.length - 3)) {
                s.pos += 3;
                s.contentHelper.animate({left: (s.pos * -164)+'px'}, 1000, function(){}); 
            }   
            Slider.buttonAdjust(id);
        });
    };
    this.buttonAdjust = function(id) {
        var s = sliderParams[id];
        var threeDiff = s.slideItems.length % 3;
        if (s.pos == (s.slideItems.length - 3)) {
               s.forward.animate({width: '0px'}, 500, function(){});
        } else {
            if (parseInt(s.forward.css('width')) == 0) {
                s.forward.animate({width: '55px'}, 500, function(){});
            }
        }
        console.log(s.pos);
        console.log(threeDiff);
        console.log(s.pos + (3 - threeDiff));
        if (s.pos + ((3 - threeDiff) % 3) > 0) {
        	if (parseInt(s.backward.css('width')) == 0) {
                s.backward.animate({width: '55px'}, 500, function(){});
            }
        } else {
            s.backward.animate({width: '0px'}, 500, function(){});
        }
    };
    this.clear = function(id) {
        var s = sliderParams[id];  
        s.contentHelper.html('');
        s.slideItems.length = 0;
        s.pos = 0;
    };
    this.add = function(item, id, callback) {
        var s = sliderParams[id];    
        if (s.loadMode == 1) {
            Slider.setLoading(id, 0);
        } 
        for (i in item.reverse()) {
            s.contentHelper.append(item[i]);
            s.slideItems.push(item[i]);
        }
        if (callback != null) {
        	s.contentHelper.children().click(callback);
        }
        if (s.pos == 0) {
        	s.pos = (s.slideItems.length - 3);
        } 
        s.contentHelper.css('left', ((s.slideItems.length - 3) * -164)+'px');
        Slider.buttonAdjust(id);
    };
    this.setLoading = function(id, loadState) {
        var s = sliderParams[id];
        s.loadMode = loadState;
        if (loadState == 0) {
            Slider.clear(id);
        }
        else if (loadState == 1) {
            Slider.clear(id);
            s.contentHelper.append('<div class="slideContentItem"></div>');
            s.contentHelper.append('<div class="slideContentItem"><img src="ajax-loader.gif" /></div>');
            s.slideItems.push('<div class="slideContentItem">block</div>');
            s.slideItems.push('<div class="slideContentItem">loading spinner</div>');
        }    
        else{}
    };
    this.toggle = function(id) {
        var s = sliderParams[id];
        if (s.toggle == 1) {
            Slider.slideIn(id);
        } else {
            Slider.slideOut(id);
        }
    };
    this.slideOut = function(id) {
    	var s = sliderParams[id];
    	if (s.toggle == 0) {
    		if (s.slideItems.length == 0 || s.alwaysLoad) {
    			if (s.load != null) {
    				Slider.setLoading(id, 1);
                	s.load(id);	
    			}
            } else {
            	Slider.buttonAdjust(id);
            }
            s.me.animate({marginLeft: '0px'},1000,function(){});
            s.toggle = 1; 
    	}
    }
    this.slideIn = function(id) {
    	var s = sliderParams[id];
        if (s.toggle == 1) {
            var slideVal = -602;
            if (parseInt(s.backward.css('width')) < 55) {
                slideVal += 55;
            }
            if (parseInt(s.forward.css('width')) < 55) {
                slideVal += 55;
            }
            s.me.animate({marginLeft: slideVal+'px'},1000,function(){});
            s.toggle = 0; 
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
    Slider.add([i1,i2,i3,i4,i5,i6,i7,i8,i8], id);
}
/* * * * * * * * * * * * * * * * * * * *
 *     Actual mosaic shit goes here    *
 * * * * * * * * * * * * * * * * * * * */
//TODO: LOADING INDICATION(SPINNERS) THROUGHOUT DURING LOADING
//DO THIS AFTER YOU FIX UP THE INITIAL LOADING SCREEN
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
                $my.photos.html('<ul id="photoList"></ul>');
                $my.photoList = $('#photoList');
                
                response = Mosaic.filterFriends(response, {});
                Mosaic.addPhotos(photos, Mosaic.photoClick);
                
                $.event.trigger("displayPhotos");
            });
            
        }
    };
    this.addPhotos = function(photos, clickCallback) {
        var photo_array = [];
        for (p in photos) {
            photo_array.push('<li id="'+photos[p].ids+'" title="'+photos[p].name+'"><img src="'+photos[p].src+'" /></li>');
        }
        $my.photoList.html($my.photoList.html()+photo_array.join(''));
        $my.photoList.children().click(clickCallback);
    };
    //TODO: NEED TO MAKE SURE SCROLLING BUTTONS APPEAR WHEN THERE ARE MORE THAN THREE PEOPLE
    this.photoClick = function(){
    	Slider.clear('profiles');
    	Slider.slideOut('profiles');
    	var tButtons = [];
    	var ids = this.id.split(',');
    	for (i in ids) {
			var tId = ids[i];
			if (tId in friendsCache) {
				var user = friendsCache[tId];
				var contentItem = $('<div>', {
					class: 'slideContentItem'
				});
				var picture = $('<img>', {
					src: user.small,
					name: user.name,
					class: 'smallPicture'
				});
				picture.appendTo(contentItem);
				var dn = $('<div>', {
					class: 'smallName',
					text: user.name.split(' ')[0]
				});
				//TODO: IF THERE IS NO cUser, Add them 
				dn.appendTo(contentItem);
				if (tId == cUser) { 
					var myPictures = $('<button>', {
						text: 'pictures'
					});
					myPictures.click(function(){
						Slider.slideIn('profiles');
						Mosaic.clearPhotos();
						Mosaic.loadPhotos(cUser);
					});
					myPictures.appendTo(contentItem);
					var myFriends = $('<button>',{
						text: 'friends'
					});
					myFriends.click(function(){
						Mosaic.loadFriends(cUser, function(photos){
							Slider.slideIn('profiles');
							Mosaic.clearPhotos();
                			Mosaic.addPhotos(photos, Mosaic.photoClick);
            			});
					});
					myFriends.appendTo(contentItem);
				} else {
					var myPictures = $('<button>', {
						text: 'pictures'
					});
					myPictures.click(function(){
						Slider.slideIn('profiles');
						Mosaic.clearPhotos();
						Mosaic.loadPhotos(tId);
					});
					myPictures.appendTo(contentItem);
					var myFriends = $('<button>',{
						text: 'me & you'
					});
					myFriends.appendTo(contentItem);
				}
				tButtons.push(contentItem);
			}
		}
    	//need to add callbacks here because of multiple buttons
    	//add these slider
    	Slider.add(tButtons, 'profiles', null);
    };
    this.clearPhotos = function() {
        $my.photoList.html('');
    };
    //TODO: make working filtering functions
    //THESE SCAN CURRENTLY DISPLAYED PHOTOS AND JUST CHANGE VISABILITY PROPERTIES
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
                query: 'SELECT uid, sex, name, pic_big, pic_square, relationship_status FROM user '
                      +'WHERE uid='+cUser+' OR uid IN '
                      +'(SELECT uid2 FROM friend WHERE uid1 ='+uid+')'
            }, function(response) {
            	console.log('count: '+response.length);
                $.each(response, function(index, friend) {
                    friendsCache[friend.uid+''] = {ids: friend.uid, sex: friend.sex, name: friend.name, src: friend.pic_big, small: friend.pic_square, relationship_status: friend.relationship_status};
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
    
    this.prepareAndAddPhotos = function(response) {
    	var photos = [];
        for (p in response.data) {
           	var tPhoto = new Object();
           	var raw = response.data[p];
            tPhoto.ids = raw.from.id;
            tPhoto.name = '';
            if (raw.tags && raw.tags.data) {
				var firstName = true;
             	for (i in raw.tags.data) {
               		if (raw.tags.data[i].id != cUser) {
               			tPhoto.ids += ','+raw.tags.data[i].id;	
               		}
               		if(firstName) {
               			tPhoto.name += raw.tags.data[i].name;
               			firstName = false;
               		} else {
               			tPhoto.name += ', '+raw.tags.data[i].name;
               		}
               	}
            }
            tPhoto.src = raw.source;
            photos.push(tPhoto);
        }
        Mosaic.addPhotos(photos, Mosaic.photoClick);
   	};
    	
    //TODO: GLOBAL LOCK ON WHAT PHOTOS ARE BEING DISPLAYED
    /* load the photos of a specific album */
    this.loadAlbumPhotos = function() {
    	Slider.slideIn('myAlbums');
    	var albumId = this.id;
    	Mosaic.clearPhotos();
        if (albumId+'' in albumDataCache) {
        	for (d in albumDataCache[albumId+'']) {
        		Mosaic.prepareAndAddPhotos(albumDataCache[albumId+''][d]);
        	} 
        } else {
        	var f = function(response) {
        		if (albumId+'' in albumDataCache) {
        			albumDataCache[albumId+''].push(response);
        		} else {
        			albumDataCache[albumId+''] = [response];	
        		}
                Mosaic.prepareAndAddPhotos(response);
                if (response.paging && "next" in response.paging) {
                	var paging = Mosaic.pagingHelper(response);
                	if (paging.limit && paging.offset) {
                		FB.api('/'+albumId+'/photos?offset='+paging.offset+'&limit='+paging.limit, function(response){
                			f(response);
            			});
            		}
                }
        	};
            FB.api('/'+albumId+'/photos', function(response){
            	//TODO: ADD LOADING SPINNER LOGIC
                f(response);
            });
        }
    };
    /* load photos of a friend */
    this.loadPhotos = function(uid) {
        Slider.slideIn('profiles');
    	Mosaic.clearPhotos();
        if (uid+'' in friendPhotoCache) {
        	for (d in friendPhotoCache[uid+'']) {
        		Mosaic.prepareAndAddPhotos(friendPhotoCache[uid+''][d]);
        	} 
        } else {
        	var f = function(response) {
        		if (uid+'' in friendPhotoCache) {
        			friendPhotoCache[uid+''].push(response);
        		} else {
        			friendPhotoCache[uid+''] = [response];	
        		}
                Mosaic.prepareAndAddPhotos(response);
                if (response.paging && "next" in response.paging) {
                	var paging = Mosaic.pagingHelper(response);
                	if (paging.limit && paging.until) {
                		FB.api('/'+uid+'/photos?until='+paging.until+'&limit='+paging.limit, function(response){
                			f(response);
            			});
            		}
                }
        	};
            FB.api('/'+uid+'/photos', function(response){
            	//TODO: ADD LOADING SPINNER LOGIC
            	//CHECK IF ARRAY LENGTH 0 --> PERMISSIONS DON'T LET YOU SEE THE USER'S PHOTOS
           		console.log(response);
                f(response);
            });
        }  
    };
    this.pagingHelper = function(response) {
        if (response.paging && "next" in response.paging) {
        	var limit = null;
        	var offset = null;
        	var until = null;
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
            	if (key == 'until') {
            		until = val;
            	}
            }
            if (until != null) {
            	return {limit: limit, until: until};
            } else {
            	return {limit: limit, offset: offset};
            }
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
