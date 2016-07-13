/*
This file will contain the Wu&Li CDS algorithm
implementation
*/

dominatorListWL = [];	//the dominators after Wu & Li's algorithm
finalResultsStringWL = "<p class=\"text-info\"><b>Initially we use the Wu && Li algorithm to obtain a minimum CDS</b></p>";

//Returns true if the given node has a neighbor with the given id 
var _hasNeighbor = function (node, id){
	for(var i=0; i<node.neighbors.length; i++){
		if(id == node.neighbors[i]){
			return true;
		}
	}
	return false;
}

//checks if one list is a subset of the superSet
//We asume that the lists contain numeric values only
var _isSubsetOf = function(list, superSet){
	var found;
	for(var i=0; i<list.length; i++){
		found=false;
		for(var j=0; j<superSet.length; j++){
			if(list[i] == superSet[j]){
				found = true;
			}
		}
		if(!found){
			return false;
		}
	}	
	return true;
}

//Implements first step of the Wu&Li algorithm
var _implementWLStep1 = function(){
	var neighborsConnected = true;
	var tempNode;
	dominatorListWL = [];
	//Initial decision without Rule1 && Rule 2 ========
	//for every node
	for(var i=0; i<network.nodes.length; i++){
		console.log("Current node : ", network.nodes[i].id);
		//for every neighbor of that node
		for(var j=0; j<network.nodes[i].neighbors.length; j++){
			//get a list of all the other neighbors than the current one
			neighborCheckList = network.nodes[i].neighbors.filter(function(el){
				return el != network.nodes[i].neighbors[j]; 
			});
			console.log("Checking neighbor : ", network.nodes[i].neighbors[j]);
			console.log("Remaining neighbors to check : ", neighborCheckList);
			if(neighborCheckList.length > 0){
				//Is j connected to all the other neighbor nodes?
				tempNode = network.nodes[ returnNodeIndexById(network.nodes[i].neighbors[j])];
				for(var k=0; k<neighborCheckList.length; k++){
					if( !hasNeighbor(tempNode, neighborCheckList[k]) ){
						neighborsConnected = false;
						console.log("The following neighbors are unconnected : ", tempNode.id, " , ", neighborCheckList[k]);
						break;
					}
				}
			}
			if(!neighborsConnected){
				network.nodes[i].dominator = true;
				dominatorListWL.push(network.nodes[i].id);
				neighborsConnected = true;
				break; //no need to check the other neighbors
			}
		}
	}
	finalResultsStringWL += "<p>Dominators after first step : " + dominatorListWL +"</p>";
	console.log("Network after WL Step 1 ", network);
}

//This function implements the Rule 1 of the algorithm
var _implementWLRule1 = function(){
	var curNode;
	var checkNodeList;
	var otherDom;
	var p=0;
	var resetP = false;
	var reducedNeighborSet;
	console.log("Beginning WL Rule 1 =======>"); 
	//Traverse the list of the dominators
	while( p<dominatorListWL.length){
		console.log("Checking dominator : ", dominatorListWL[p]);
		//get the dominator node object
		curNode = network.nodes[returnNodeIndexById(dominatorListWL[p])];
		//get the rest of the dominators
		checkNodeList = dominatorListWL.filter(function(el){
			return el != dominatorListWL[p];
		});
		console.log("Remaining dominators : ",checkNodeList);
		//for every other dominator, check if the neighbors of p are a
		//subset of the neighbors of that other dominator
		for(var d=0; d<checkNodeList.length; d++){
			otherDom = network.nodes[ returnNodeIndexById(checkNodeList[d])];
			//If you're checking for subsets, don't include in your neighborset the node you're checking against
			//if he is your neighbor.Otherwise the subset comparison will check if the other node has himself
			//as a neighbor, which will be always false.
			reducedNeighborSet = curNode.neighbors.filter(function(index) { 
				return index != checkNodeList[d];
			});
			if(isSubsetOf(reducedNeighborSet, otherDom.neighbors)){
				if(curNode.id < otherDom.id){
					network.nodes[returnNodeIndexById(curNode.id)].dominator = false;
					dominatorListWL = checkNodeList;
					resetP = true;
					console.log("Node ", curNode.id, " will be replaced by ", otherDom.id);
					console.log("New dominators list : ", dominatorListWL);
				}
			}
		}
		if(resetP){
			p = 0;
			resetP = false;
		}
		else{
			p++;
		}
	}
	finalResultsStringWL += "<p>Dominators after Rule 1 : " + dominatorListWL +"</p>";
	console.log("Network after WL Rule 1 ",network);
}

var _implementWLRule2 = function(){
	var g=0;
	var resetG = false;
	var curDom;
	var domNeighbors;
	var remainingDomNeighbors;
	var unionSet;
	var reducedChecklist;
	console.log("Beginning WL Rule 2 ============>");
	//Traverse the dominators list
	while(g < dominatorListWL.length){
		//get the current node
		curDom = network.nodes[ returnNodeIndexById(dominatorListWL[g]) ];
		console.log("Current dominator : ",curDom);
		//get the dominator neighbors only
		domNeighbors = curDom.neighbors.filter(function(index) {
			return network.nodes[ returnNodeIndexById(index)].dominator == true ;
		});
		console.log("Check against : ", domNeighbors);
		//for each one of these neighbors
		for(var n=0; n<domNeighbors.length; n++){
			//get all the other neighbors
			remainingDomNeighbors = domNeighbors.filter(function(index) {
				return index != domNeighbors[n];
			});
			//and check if this one is connected with any one of the others
			//if so, we must check if the union of their neighbor sets can
			//contain all the neighbors of curDom
			for(var t=0; t<remainingDomNeighbors.length; t++){
				if(hasNeighbor( network.nodes[ returnNodeIndexById(domNeighbors[n])], remainingDomNeighbors[t]) ){
					unionSet = _.union(network.nodes[ returnNodeIndexById(domNeighbors[n])].neighbors, 
									network.nodes[ returnNodeIndexById(remainingDomNeighbors[t])].neighbors );
					console.log("United the sets of : ", domNeighbors[n], ",", remainingDomNeighbors[t]);
					console.log("Union result : ",unionSet);
					/*If you're checking for subsets, don't include in your neighborset the node you're checking against
					if he is your neighbor.Otherwise the subset comparison will check if the other node has himself
					as a neighbor, which will be always false. */
					reducedChecklist = curDom.neighbors.filter(function(index) {
						return ( (index != domNeighbors[n]) && (index != remainingDomNeighbors[t]) );
					});
					if(isSubsetOf(reducedChecklist, unionSet) && (curDom.id<domNeighbors[n]) && (curDom.id < remainingDomNeighbors[t]) ){
						network.nodes[returnNodeIndexById(curDom.id)].dominator = false;
						dominatorListWL = dominatorListWL.filter(function(index) {
							return index != curDom.id;
						});
						resetG = true;
					}
				}
			}
		}
		if(resetG){
			g=0;
			resetG = false;
		}
		else{
			g++;
		}
	}//end while
	finalResultsStringWL += "<p>Dominators after Rule 2 : " + dominatorListWL +"</p>";
	console.log("Network after WL Rule 2 ",network);
}

/* 
This function will use the Wu & Li algorithm to find a minimum ================================
CDS, but not k,m connected	
*/
var calculateWuLi = function(){
	if(network.nodes.length > 2){	
		console.log("The network ", network );
		console.log("Beginning Wu & Li ===========>");
		_implementWLStep1();
		_implementWLRule1();
		_implementWLRule2();
	}
	else{
		finalResultsStringWL = "<p>Network too small yet</p>";
	}
	console.log("Network after Wu&Li : ", network);
}