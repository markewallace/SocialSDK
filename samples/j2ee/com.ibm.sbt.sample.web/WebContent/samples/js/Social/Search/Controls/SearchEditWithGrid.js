require(["sbt/dom", "sbt/connections/controls/search/SearchBox", "sbt/connections/controls/search/SearchGrid"], function(dom, SearchBox,SearchGrid) {
        var searchBox = new SearchBox({
        	type:"part"
        });
        
        dom.byId("searchBox").appendChild(searchBox.domNode);
        
        searchBox.domNode.addEventListener("searchReadyEvent",function(event){
        	if(!event){
        		event = window.event;
        	}
        	document.getElementById("gridDiv").innerHTML = "";

    		var grid = new SearchGrid({
    			type: "all",
    			query : { component : event.selectedApplication, query : event.searchQuery }
    		});
    		dom.byId("gridDiv").appendChild(grid.domNode);
    		grid.update();
   	
        },false);        
});