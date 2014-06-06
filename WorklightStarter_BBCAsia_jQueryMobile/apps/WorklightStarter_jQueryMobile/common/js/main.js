/*
 * COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
 * these sample programs in any form without payment to IBMfor the purposes of developing, using, marketing or distributing
 * application programs conforming to the application programming interface for the operating platform for which the sample code is written.
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
 * EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
 * IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.
 */
function wlCommonInit(){
	loadFeeds();
}

$("#ReloadLink").bind("click", function(){
	loadFeeds();
});

//**************************************
// loadFeedsPage
//**************************************
function loadFeedsPage() {
	WL.App.overrideBackButton (function(){WL.App.close();});
	$.mobile.changePage("index.html", {prefetch:"true"});	
}

//**************************************
// loadAboutPage
//**************************************
function loadAboutPage() {
	
	$.mobile.changePage("about.html", {prefetch:"true"});
}

$(document).on( "pageload", function( event ) { 
	$(".translate").each(function(index, element) {
		  element = $(element);
		  var elementId = element.attr("id");
		  element.text(Messages[elementId]);
		});
});

//**************************************
// Load feeds
//**************************************
function loadFeeds(){	
	$.mobile.showPageLoadingMsg();
	WL.App.overrideBackButton (function(){WL.App.close();});
	var invocationData = {
			adapter: "WorklightStarterAdapter",
			procedure: "getEngadgetFeeds",
			parameters: []
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: loadFeedsOK, 
		onFailure: loadFeedsFAIL
	});
}

function loadFeedsOK(data){
	if (!data || !data.invocationResult || !data.invocationResult.items || data.invocationResult.items.length == 0)
		alert("Could not retrieve feeds");	
	feeds = data.invocationResult.items;
	$("#FeedsList").empty();
	// Create the list items
	for (var i=0; i<feeds.length; i++){
		var dataItem = feeds[i];
		var listItem = $("<li class='FeedItem' id='" + i + "'><h3>" + (i+1) + ". " + dataItem.title + "</h3><p>"+ dataItem.pubDate+"</p></li>");
		$("#FeedsList").append(listItem);
	}
	// Attach a 'click' event handler to each item in the list
	$(".FeedItem").bind("click", function(){
		displayFeed($(this).attr("id"));
	});
		
	$("#FeedsList").listview('refresh');
	$.mobile.hidePageLoadingMsg();
}

function loadFeedsFAIL(data){
	WL.SimpleDialog.show(
		"Error Message", "Server connectivity error", 
		[{text: "OK", handler: function() {WL.Logger.debug("Server connectivity error"); }}]
	); 
}

//**************************************
// Display feed
//**************************************
function displayFeed(FeedId){
	WL.App.resetBackButton();
	var item = feeds[FeedId].description;
	$(document).on('pageinit',$('#FeedContentPage'), function(event) {
	    $("#FeedContent").html(item);
	    // Resize images to max width of 260px
	    $("#FeedContent").find("img").each(function(){
	    	if ($(this).attr("src").indexOf("jpg")>=0){
	    		$(this).width(260);
	    	}
	    });
	    // add target='_blank' attribute to all the links
	    $("#FeedContent a").attr("target","_blank");
	});
	$.mobile.changePage("FeedContentPage.html", {prefetch:"true"});
}
