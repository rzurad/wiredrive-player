/* 
 * This file was written to work with jQuery 1.4.2 (the version that comes with WordPress 3.0), hence the use of the .attr() method instead of the better .data() method.
 * Once WordPress 3.1 ships and is widely adopted, this will be re-written to use jQuery 1.4.4 and the .data() method.
 */

var wdp = {

    playSlideshow: true,
    fullscreenImage: false,
    touchx: 0,
    
    init: function() {
        // Set the first thumb as active
        jQuery('.wd-thumb-list li:first-child a').addClass('wd-active');
        
        
        // Show the first credit & title
        jQuery('.wd-credits-container').each(function() {
    
            jQuery(this).find('.wd-title')
                    .append(
                        jQuery(this).closest('.wd-player').find('.wd-thumb-list .wd-active').attr('data-wd-title')
                    );
            
            jQuery(this).find('.wd-credit')
                    .append(
                        jQuery(this).closest('.wd-player').find('.wd-thumb-list .wd-active').attr('data-wd-credit')
                    );
            
        });
        
        // Preload any auto slideshow images
        jQuery('.wd-player.autoslideshow .wd-thumb-list li a').each(function(index) {
            var imageSource = jQuery(this).attr('data-wd-source');
            var imageID = jQuery('<img />').attr('src', imageSource);
        });
        
        // Run any auto slideshows
        wdp.autoSlideshow();
        
        //Remove the inline style width from the player DIV.
        jQuery('.popup.wd-player').removeAttr('style');

    },
    
    
    
    /*
     *  The resizing function for slideshow images. Needs to be ready before (document).ready    
     */
    fit_within_box: function(box_width, box_height, new_width, new_height) 
    {
        var aspect_ratio=new_width/new_height;
        if(new_width>=box_width){
            new_width=box_width;
            new_height=Math.round(new_width/aspect_ratio);
        }
        if(new_height>=box_height){
            new_height=box_height;
            new_width=Math.round(new_height*aspect_ratio);
        }    
        return {
            width: new_width, 
            height: new_height
        };
    
    },
    
    autoSlideshow: function() {
        
        function delay() {

            jQuery('.wd-player.autoslideshow .wd-stage').not('.popup .wd-stage').each(function() {
                listLength = jQuery(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
                currentItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                                
                if (currentItem < listLength) {
                    if (wdp.playSlideshow) {
                        wdp.setNextSource.call(this);
                        wdp.autoSlideshow();
                    }
                    
                } else if (currentItem === listLength) {
                    jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', -1);
                    if (wdp.playSlideshow) {
                        wdp.setNextSource.call(this);
                        wdp.autoSlideshow();
                    }
                }
                
            });

        }
        
        setTimeout(delay, 5000);

    },
    
    setNextCredit: function(playerID) 
    {
        
        if (playerID === undefined) {
            // Is HTML5 Player or Slideshow
            playerID = jQuery(this).attr('id');
            
            if (playerID === undefined) {
                playerID = jQuery('.wd-stage.wd-active').attr('id');
            }
            
        }
        
        var nextItem = jQuery(playerID).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
       
        // New credits
        jQuery(playerID).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-title')
            );
        
        jQuery(playerID).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-credit')
            );
    },
    
    setPrevCredit: function() 
    {
        var prevItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                
        // New credits
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-title')
            );
        
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-credit')
            );
            
    },
    
    showCredit: function() 
    {
        // Title credit
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(this).attr('data-wd-title')
            );
            
        // First credit
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(this).attr('data-wd-credit')
            );
    
    },
    
    hideCredit: function()
    {
        // On mouse out
        var wdItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        
        // Add playing item's title back to credit container
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(wdItem).attr('data-wd-title')
            );
        
        // Add playing item's credit back to the credit container
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(wdItem).attr('data-wd-credit')
            );
    },
    
    
    
    /*
     * Handles the set credit feature
     */
    setClickedCredit: function()
    {   
        // Remove active class
        jQuery(this).closest('.wd-player')
                .find('.wd-thumb-list .wd-active')
                .removeClass('wd-active');
        
        // Add new active credit
        jQuery(this).addClass('wd-active');
        
        // Set the stage to the new item number.
        jQuery(this).closest('.wd-player')
            .find('.wd-stage')
            .attr('data-wd-item', jQuery(this).attr('data-wd-item'));
    },
    
    
    /*
     * Used for the slidehsow feature to make sure the next/prev button is displayed when it needs to be.
     */
    setNavButton: function(listLength) 
    {
        // Hide/show the correct next/prev button.
        var currentItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        if (currentItem === listLength ) {
            jQuery(this).closest('.wd-player').find('.wd-play-next').removeClass('wd-active');
            jQuery(this).closest('.wd-player').find('.wd-play-prev').addClass('wd-active'); 
        } else if (currentItem === 0) {
            jQuery(this).closest('.wd-player').find('.wd-play-prev').removeClass('wd-active');
            jQuery(this).closest('.wd-player').find('.wd-play-next').addClass('wd-active');    
        } else if (currentItem > 0) {
            jQuery(this).closest('.wd-player').find('.wd-play-next').addClass('wd-active');
            jQuery(this).closest('.wd-player').find('.wd-play-prev').addClass('wd-active');
        }

    },
    
    
    
    /*
     * Send next source to the player
     */
    setNextSource: function()
    {      
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = jQuery(this).closest('.wd-player').find('.wd-thumb-list li').size() - 1;
        var currentID = jQuery(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);
        var nextItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                
        if (nextItem < listLength) {
            
            // Get the new SRC URL.
                nextItem++;
            var nextSrc = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('href'); 
            
            if (videoContainer === null) {
                //This means it's an image
                
                //Check to see if the current image is still fading (prevents turbo clicking problems).
                if (jQuery(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    return;
                }
                
                var slideshowHeight = jQuery(this).closest('.wd-player').find('.wd-stage').height();
                var slideshowWidth = jQuery(this).closest('.wd-player').find('.wd-stage').width();
                var newImageHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-height');
                var newImageWidth = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-width');
                var currentImageHref = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src');
                        
                // Get the new image sizes
                var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
                // Get first image and duplicate it
                jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                    // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion. 
                            .hide()
                            .attr('src', nextSrc)
                            .attr('data-wd-item',nextItem)
                            .width(new_size.width)
                            .height(new_size.height)
                            .css('margin-top', 0-(new_size.height/2)+'px')
                            .css('margin-left', 0-(new_size.width/2)+'px')
                            .appendTo(jQuery(this).closest('.wd-player').find('.wd-stage'));
                
                jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
                {
                    jQuery(this).remove();
                });

                jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');
                
            } else if ( typeof videoContainer.load === 'function' ) {
                // This send it to the HTML player
                videoContainer.src = nextSrc;
                videoContainer.load();
                videoContainer.play();                
            } else {
                // This sends it to the Flash Player                     
                jQuery(videoContainer).externalInterface({method:'setNewSource', args:nextSrc});
                jQuery(videoContainer).externalInterface({method:'removePlayButton'});
            }
                            
            // Set active class on the new item
            // Remove active class
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list .wd-active')
                    .removeClass('wd-active');

            // Add active class        
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(nextItem)
                    .addClass('wd-active');
            
            // Set the new item number on the stage
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', nextItem);
        
            wdp.setNextCredit.call(this);
                                        
            wdp.setNavButton.call(this, listLength);   
        }
    },
    
    
    
    /*
     * Send previous source to the player
     */
    setPrevSource: function()
    {
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = jQuery(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;        
        var currentID = jQuery(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);
        var prevItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');

        if (prevItem > 0) { 
            // Hide play button between videos
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage .vjs-big-play-button')
                    .css('visibility','hidden');
            
            // Send next source to the HTML5 player
                prevItem--;        
            var prevSrc = jQuery(this).closest('.wd-player').find('.wd-thumb-list').children('li').eq(prevItem).children('a').attr('href');             

            if (videoContainer === null) {
                //This means it's an image
                
                //Check to see if the current image is still fading (prevents turbo clicking problems).
                if (jQuery(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    return;
                }
                
                var slideshowHeight = jQuery(this).closest('.wd-player').find('.wd-stage').height();
                var slideshowWidth = jQuery(this).closest('.wd-player').find('.wd-stage').width();
                var newImageHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-height');
                var newImageWidth = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-width');
                var currentImageHref = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src');
                        
                // Get the new image sizes
                var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
                // Get first image and duplicate it
                jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                    // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion. 
                            .hide()
                            .attr('src', prevSrc)
                            .attr('data-wd-item',prevItem)
                            .width(new_size.width)
                            .height(new_size.height)
                            .css('margin-top', 0-(new_size.height/2)+'px')
                            .css('margin-left', 0-(new_size.width/2)+'px')
                            .appendTo(jQuery(this).closest('.wd-player').find('.wd-stage'));
                
                jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
                {
                    jQuery(this).remove();
                });
                jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');   
                
            } else if ( typeof videoContainer.load === 'function' ) {
                // This send it to the HTML player
                videoContainer.src = prevSrc;
                videoContainer.load();
                videoContainer.play();                
            } else {
                // This sends it to the Flash Player                     
                jQuery(videoContainer).externalInterface({method:'setNewSource', args:prevSrc});
                jQuery(videoContainer).externalInterface({method:'removePlayButton'});
            }

            
            // Set active class on the new item
            // Remove active class
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list .wd-active')
                    .removeClass('wd-active');

            // Add active class        
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(prevItem)
                    .addClass('wd-active');
            
            // Set the new item number on the stage
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', prevItem);
            
            // Set the new item number on the stage
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', prevItem);
                    
            wdp.setPrevCredit.call(this);
            
            wdp.setNavButton.call(this, listLength);
        }
    },
    
    
    
    /*
     * For Flash: When video ends, play the next one.
     */
    stoppedPlaying: function(flashPlayerID)
    {
        var playerID = '#' + flashPlayerID;
    
        //jQuery .length() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li').size() - 1;   
                        
        var nextItem = jQuery(playerID).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
            nextItem = parseInt(nextItem, 10);
        
        //This if statment makes the player stop after the last item is played.
        if (nextItem < listLength) {
            nextItem++;
            // Send next source to the Flash player
            var nextSrc = jQuery(playerID).closest('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(nextItem).attr('href');
                                    
            jQuery(playerID).externalInterface({method:'setNewSource', args:nextSrc});
            
            jQuery(playerID).closest('.wd-player')
                                .find('.wd-stage')
                                .attr('data-wd-item', nextItem);
            
            // Set border around currently playing
            jQuery(playerID).closest('.wd-player')
                                .find('.wd-thumb-list .wd-active')
                                .removeClass('wd-active');
                                
            jQuery(playerID).closest('.wd-player')
                                .find('.wd-thumb-list li a')
                                .eq(nextItem)
                                .addClass('wd-active');
                                
            wdp.setNextCredit(playerID);
        } 
    } 

};

            
jQuery(document).ready(function($) {       

    wdp.init();             

    /*
     * Handles the mouseover credit feature
     * The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
     */ 
    $('.not-mobile .wd-thumb-list a').hover(wdp.showCredit, wdp.hideCredit);


    /*
     * On thumb click do...
     */ 
    $('.wd-player.not-slideshow .wd-thumb-list a').click(function(e)
    {
        
        // Get the href from the thumb link and feed it into the video player. This line is for HTML5 player only.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        var currentID = $(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);            
        var newSrc = $(this).attr('href');
        
        // This is testing to see if the newSrc has been set before starting. I do this so when Flash is used JavaScript doesn't throw an error.             
        if ( typeof videoContainer.load === 'function' ) {
            videoContainer.src = newSrc;
            videoContainer.load();
            videoContainer.play();
        } else {
    
            // For Flash: Send the href of the thumb to the Flash player
            $(this).closest('.wd-player')
                    .find('.wd-stage .wd-video-player')
                    .externalInterface({method:'setNewSource', args:$(this).attr('href')});
			
			$(this).closest('.wd-player')
                    .find('.wd-stage .wd-video-player')
                    .externalInterface({method:'removePlayButton'});
        }
        
        // When a thumb is clicked remove the poster attribute from the video tag
        $(this).closest('.wd-player')
                .find('.video-js')
                .attr('poster',null);

        // Set the stage to the current plaing item number. This is so the playlist function knows which video to play next.
        $(this).closest('.wd-player')
                .find('.wd-stage')
                .attr('data-wd-item', $(this).attr('data-wd-item'));
        
        // Set the current credit and/or title.
        wdp.setClickedCredit.call(this);
        
        // Set the next/prev button active
        wdp.setNavButton.call(this, listLength);
                
        e.preventDefault();

    });




    /*
     * Scroll list to the left/right when button clicked
     */ 
	var itemPos = 2;
    $('.wd-player .wd-nav-next').click(function()
    {
        $(this).closest('.wd-player')
                .find('.wd-thumb-list-container')
                .scrollTo( '+=250px', '800', { axis:'x'});
        
        var itemPos =+ 2;
    });
	
    $('.wd-nav-prev').click(function()
    {
        $(this).closest('.wd-player')
                .find('.wd-thumb-list-container')
                .scrollTo( '-=250px', '800', { axis:'x'});
    });
    
    
    
    /*
     * This is the HTML5 playlist code. When a video finsihes playing, play the next one.
     */ 
    $('video').bind('ended', function() 
    {   
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        
        var currentID = $(this).attr('id');
        var videoContainer = document.getElementById(currentID);
    
        var n = $(this).closest('.wd-stage').attr('data-wd-item');
            n = parseInt(n, 10);
                        
        //This if statments makes the player stop after the last item is played.
        if (n < listLength) {
            n++;
            
            // Send next source to the HTML5 player
            wdp.setNextSource.call(this);
            
        } else {
            videoContainer.pause();
            videoContainer.currentTime = 0;
            $(this).closest('.wd-player').find('.vjs-big-play-button').css('visibility','visible');
        }
    
    });



            
    /*
     *  When click on drop down button, slide down the thumb tray
     */
    $('.wd-thumb-dropdown').click(function()
    {
        // These varibles are written like this to ensure that the Thumb Tray height is correct, even if the credits container is or isn't inside the thumb tray.
        var thumbListHeight = $(this).closest('.wd-player').find('.wd-thumb-tray').find('.wd-thumb-list').outerHeight();
        if (thumbListHeight === null) {
            thumbListHeight = 0;
        }
                
        var creditsContainerHeight = $(this).find('.wd-thumb-tray').find('.wd-credits-container').outerHeight();
        if (creditsContainerHeight === null) {
            creditsContainerHeight = 0;
        }
        
        var thumbTrayHeight = thumbListHeight + creditsContainerHeight;
        
        var currentTrayHeight = $(this).closest('.wd-player').find('.wd-thumb-tray').outerHeight();
    	if ( currentTrayHeight === 0) {
    	   //Make tray go down
    		$(this).closest('.wd-player')
    		          .find('.wd-thumb-tray')
    		          .dequeue()
    		          .stop()
    		          .css('visibility', 'visible')
    		          .animate({ height: thumbTrayHeight });

    		$(this).addClass('wd-up-arrow');
    		
    		$(this).closest('.wd-player')
    		          .find('.wd-credits-container')
    		          .addClass('wd-active');
    		
    	} else {
    	   //Make tray go up
            $(this).closest('.wd-player')
                    .find('.wd-thumb-tray')
                    .animate({ height: '0' }, 'normal', 'linear', function() 
                        {
                            $(this).css('visibility', 'hidden');
                        }
                    );
                    
            $(this).removeClass('wd-up-arrow');
            
            $(this).closest('.wd-player')
                    .find('.wd-credits-container')
                    .removeClass('wd-active');
        }
    }); 


                    
/*
 * Below is code relating to the image slideshow feature.
 *
 ***************************************************************************
 */
    
    /*
     * This resizes the first slideshow image.
     */
    $('.wd-player.slideshow .wd-slideshow-image').each(function() {
        
        var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height();
        var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width();
        var newImageHeight = $(this).closest('.wd-player').find('.wd-thumb-list a').eq(0).attr('data-wd-height');
        var newImageWidth = $(this).closest('.wd-player').find('.wd-thumb-list a').eq(0).attr('data-wd-width');

        var first_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
        $(this).width(first_size.width)
            .height(first_size.height)
            .css('margin-top', 0-(first_size.height/2)+'px')
            .css('margin-left', 0-(first_size.width/2)+'px')
            .show();
    });
    
    
    
    /*
     *  When clicking on a slideshow thumb, do this
     */
    $('.wd-player.slideshow .wd-thumb-list a').click(function(e)
    {
        e.preventDefault();
        
        var newImageHref = $(this).attr('href');
        var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height();
        var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width();
        var newImageHeight = $(this).attr('data-wd-height');
        var newImageWidth = $(this).attr('data-wd-width');
        var currentImageHref = $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src');
        
        // If the image will be in a popup, then use a differnt size calculation        
        if ($(this).closest('.wd-player').hasClass('popup')) {
            
            // Allow the image to expand to 80% of the browser window
            slideshowHeight = $(window).height() - ($(window).height()/100)*20;
            slideshowWidth = $(window).width() - ($(window).width()/100)*20;
    
            // Set the stage to the size of the browser window
            $(this).closest('.wd-player').find('.wd-stage').css({
                        height: slideshowHeight,
                        width: slideshowWidth
            });
        
        }
        
        
        
        
        /*
         * Test to see if clicked thumb is current image
         */
        if ( newImageHref === currentImageHref ) {
            return;
        } else if ($(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
            return;
        } else {
            
            // Get the new image sizes
            var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);

            // Get first image and duplicate it
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion.
                        .hide()
                        .attr('src', newImageHref)
                        .attr('data-wd-item',$(this).attr('data-wd-item'))
                        .width(new_size.width)
                        .height(new_size.height)
                        .css('margin-top', 0-(new_size.height/2)+'px')
                        .css('margin-left', 0-(new_size.width/2)+'px')
                        .appendTo($(this).closest('.wd-player').find('.wd-stage'));
            
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function()
            {
                $(this).remove();
            });
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');
            
            // Set the stage to the current plaing item number. This is so the slideshow function knows which image to show next.
            $(this).closest('.wd-player')
                .find('.wd-stage')
                .attr('data-wd-item', $(this).attr('data-wd-item'));
            
            wdp.setClickedCredit.call(this);
            
            wdp.setNavButton.call(this);
        }
    
    });
    
    
    
    
    /*
     *  This will play the next item in the playlist
     */
    $('.wd-player .wd-play-next').click(function()
    {
        wdp.setNextSource.call(this);
    });

    
    
    
    /*
     *  This will play the previous item in the playlist
     */
    $('.wd-player .wd-play-prev').click(function()
    {
        wdp.setPrevSource.call(this);
    });
   
   
   
    /*
     *  This enables touch gestures for next/prev image on a slideshow
     */
    $('.wd-player.slideshow .wd-stage').live('touchstart touchmove touchend', function(event) {    
                
        
        
        var e = event.originalEvent;    
        
        if (event.type === 'touchend') {
            return;
        }

        if (event.type === 'touchstart') { 
            var t = e.touches[0];
    		wdp.touchx = t.clientX;         
        }
        
         if (event.type === 'touchmove') {
            // only deal with one finger
    		if (e.touches.length === 1) {
    			var t = e.touches[0],
    				deltaX = wdp.touchx - t.clientX;
                                
    			if (deltaX < 0 && !$(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    wdp.setPrevSource.call(this);
    			} else if (deltaX > 0 && !$(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    wdp.setNextSource.call(this);
                    
    			} 				
    			e.preventDefault();
    		}
        }
       
    });


        
    /*
     *  Kill the auto slideshow if something is clicked
     */
    $('.wd-player.slideshow, .slideshow wd-play-prev, .slideshow wd-play-next').click(function() {
        wdp.playSlideshow = false;
    });
    
   
/*
 * Below is the code relating to the Popup player.
 ***************************************************************************
 */    
     
    /*
     * When you click on a thumb do this
     */
    $('.popup.not-mobile .wd-thumb-list a').not('.ipad .wd-thumb-list a').click(function() {
    
        var popWidth = $(this).closest('.wd-player').find('.wd-stage').width();
        var popTitle = $(this).closest('.wd-player').find('.wd-credits').eq(0).clone().addClass('popup-credits');

        // Disable the scroll bar ont he browser
        $('body').css('overflow','hidden');
                                    
        //Fade in the Popup
        $(this).closest('.wd-player').find('.wd-stage').css({'top' : '50%', 'left' : '50%'});
        
        // Add active class to stage
        $(this).closest('.wd-player').find('.wd-stage').addClass('wd-active');
        
        // Add close button and set width
        $(this).closest('.wd-player').find('.wd-stage')
                            .animate({
                                opacity: 1
                            }, 'fast')
                            .css({ 'width': popWidth})
                            .append('<a href="#close" class="close">&#215;</a>')
                            .append(popTitle);
        
        //Define margin for center alignment (vertical and horizontal)
        var popMargTop = ($(this).closest('.wd-player').find('.wd-stage').height() + 0) / 2;
        var popMargLeft = ($(this).closest('.wd-player').find('.wd-stage').width() + 0) / 2;
    
        //Apply Margin to Popup
        $(this).closest('.wd-player').find('.wd-stage').css({
            'margin-top' : -popMargTop,
            'margin-left' : -popMargLeft
        });
         
        //Add the fade layer to bottom of the body tag.
        $('body').append('<div id="fade"></div>');
        
        //Fade in the fade layer - .css({'filter' : 'alpha(opacity=80)'}) is used to fix the IE Bug on fading transparencies
        $('#fade').fadeIn();
                
        return false;
    });
    
    
    
    /*
     * Re-enable the HREF's of thumb links.
     */
    $('.popup.mobile .wd-thumb-list a').click(function() {
        window.location = $(this).attr('href');
    });
    
    
    
    /*
     * Go full screen on iPad.
     */
    $('.popup.ipad .wd-thumb-list a').click(function(e) {
            window.location = $(this).attr('href');
            
/*
            e.preventDefault();

            $(this).closest('.wd-player').find('.wd-stage').show().css({'top' : '0', 'left' : '0', 'opacity' : '1'});
            var currentID = $(this).closest('.wd-player').find('video').attr('id');
            var videoContainer = document.getElementById(currentID);
            
            videoContainer.src = 'http://wpc.0155.edgecastcdn.net/800155/la-production.wiredrive.com//cdn/asset/view/client/iowa/package/library/id/393653/format/o/h/ba5c3d48d16ad6fdedf1601530199172/Wallaby_Boy.mov?7a6013aef28682d61703dff726d21b126928705a855f255f732b3a66a4890a66715b4d.mov';
            videoContainer.load();
            
            videoContainer.addEventListener('loadeddata', function() {
                videoContainer.webkitEnterFullscreen();
                videoContainer.play();
            });
*/
    });
    
    
    
    /*
     * Set the click tracker on a slideshow image
     */
    $('.popup.slideshow .wd-thumb-list a').click(function() {
        wdp.fullscreenImage = true;
    });
    
    
    
     /*
      * Resize the slideshow popup when the browser window is resized
      */
    $(window).resize(function() {
                
        if (wdp.fullscreenImage) {
                        
            var currentItem = $('.wd-stage.wd-active').attr('data-wd-item');
            var slideshowHeight = Math.round($(window).height() - ($(window).height()/100)*20);
            var slideshowWidth = Math.round($(window).width() - ($(window).width()/100)*20);
            var newImageHeight = $('.wd-stage.wd-active').closest('.wd-player').find('.wd-thumb-list li a').eq(currentItem).attr('data-wd-height');
            var newImageWidth = $('.wd-stage.wd-active').closest('.wd-player').find('.wd-thumb-list li a').eq(currentItem).attr('data-wd-width');
    
            // Get the new sizes
            var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
            
            // Resize the image
            $('.wd-stage.wd-active').find('.wd-slideshow-image')
                        .width(new_size.width)
                        .height(new_size.height)
                        .css('margin-top', 0-(new_size.height/2)+'px')
                        .css('margin-left', 0-(new_size.width/2)+'px');

            // Set the stage to the size of the window
            $('.wd-stage.wd-active')
                        .css('height', slideshowHeight)
                        .css('width', slideshowWidth)
                        .css('margin-top', 0-(slideshowHeight/2)+'px')
                        .css('margin-left', 0-(slideshowWidth/2)+'px');
        }

    });
    
    
    
    /*
     * Close Popups and Fade Layer
     */
    $('a.close, #fade').live('click', function(e) 
    { //When clicking on the close or fade layer...
        $('#fade, .popup .wd-stage').animate({
            opacity: 0
        }, 'fast', function() 
        {
            $('#fade, a.close, .popup-credits, .wd-arrows').remove();
            
            //Stop HTML5 video
            var currentID = $(this).closest('.wd-player').find('video').attr('id');
            var videoContainer = document.getElementById(currentID);           
            
            if (typeof currentID !== 'undefined') {
                    videoContainer.pause();
                    videoContainer.currentTime = 0;
            } else {            
                //Stop the Flash video
                $(this).closest('.wd-player').find('.wd-video-player').externalInterface({method:'pausevideo'});
            }
            
            //Move stage offscreen
            $('.popup .wd-stage').css({'top' : '999%', 'left' : '999%'});
        });
        
        // Enable browser scroll bars
        $('body').css('overflow','visible');
        
        // Remove active class from stage
        $(this).closest('.wd-player').find('.wd-stage').removeClass('wd-active');
        
        // Reset the click tracker
        wdp.fullscreenImage = false;
        
        e.preventDefault();
    });
    
    
    
    /*
     * On thumb hover show the credits
     */
    $('.wd-thumb-list a').hover(
        function () {
            $(this).closest('.popup.wd-player').find('.wd-credits').clone().appendTo($(this)).addClass('hover-credits');
        }, 
        function () {
            $(this).find('.hover-credits').remove();
        }
    );


});


/*
 * Run this after the browser window has loaded (meaning: all images have loaded).
 * For some reason, the $ shortcut doesn't work in this function. I think it's becuase of the jQuery version that ships with WordPress..
 *
 */
 
jQuery(window).load(function() {
    //Calculate thumblist width by adding up all list item widths
    jQuery('ul.wd-thumb-list').each(function() {
        var width = 0;
        jQuery(this).children('li')
                        .each(function() {

            //We add +1 here because sometimes jQuery will round down and cause the list to wrap.
            width += jQuery(this).outerWidth( true ) + 1;
        });

        jQuery(this).css('width', width);
    });
            
});



/*
 * jQuery Plugin: externalInterface
 * Version 1.0
 *
 * Copyright (c) 2010 David Comeau (http://www.davecomeau.net)
 * Licensed jointly under the GPL and MIT licenses.
 *
 */
(function(jQuery)
{
	jQuery.fn.externalInterface = function(args)
	{
		this.each(function()
		{
			if(typeof(args.method) !== 'undefined')
			{
				try
				{
					if(typeof(args.args) !== 'undefined')
					{
						var data = this[args.method](args.args);
					}
					else
					{
						var data = this[args.method]();
					}
					
					if(typeof(args.success) !== 'undefined')
					{
						args.success(data);
					}
				}
				catch(error)
				{
					if(typeof(args.error) != 'undefined')
					{
						args.error(error);
					}
				}
			}
		});
	
		return this;
	};
})(jQuery);