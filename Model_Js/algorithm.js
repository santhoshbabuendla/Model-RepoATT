/*
This file will handle the algorithm functionality. It will use the
network object created in network_manager.js
*/
var dominatorListWL = [];	//the dominators after Wu & Lee's algorithm
var dominatorListKM = [];	//the dominators after the K,M algorithm
var finalResultsStringWL = "<h5>Initially we use the Wu && Lee algorithm to get a minimum CDS</h5>";

//Returns true if the given node has a neighbor with the given id ======================
function hasNeighbor(node, id){

	for(var i=0; i<node.neighbors.length; i++){
		if(id == node.neighbors[i]){
			return true;
		}
	}

	return false;
}

/* 
This function will use the Wu & Lee algorithm to find a minimum ========================
CDS, but not k,m connected	
*/
function calculateWuLee(){

	if(network.nodes.length > 2){
			
		var nodesArray = network.nodes;
		var neighborsConnected = true;
		var tempNode;
		dominatorListWL = [];

		console.log("The network ", network );
		console.log("Beginning Wu & Lee");

		//Initial decision without Rule1 && Rule 2 ========
		//for every node
		for(var i=0; i<nodesArray.length; i++){
			console.log("beginning process ======>");
			console.log("current node : ", nodesArray[i].id);
			//for every neighbor of that node
			for(var j=0; j<nodesArray[i].neighbors.length; j++){
				//get a list of all the other neighbors than the current one
				neighborCheckList = nodesArray[i].neighbors.filter(function(el){
					return el != nodesArray[i].neighbors[j]; 
				});
				console.log("checking neighbor : ", nodesArray[i].neighbors[j]);
				console.log("neighbors to check : ", neighborCheckList);

				if(neighborCheckList.length > 0){
					console.log("non empty check list");
					//Is j connected to all the other neighbor nodes?
					tempNode = returnNodeById(nodesArray[i].neighbors[j]);
					for(var k=0; k<neighborCheckList.length; k++){
						if( !hasNeighbor(tempNode, neighborCheckList[k]) ){
							neighborsConnected = false;
							console.log("The following neighbors are unconnected", tempNode.id, ",", neighborCheckList[k]);
							break;
						}
					}
				}

				console.log("neighbors connected status : ", neighborsConnected);
				if(!neighborsConnected){
					nodesArray[i].dominator = true;
					dominatorListWL.push(nodesArray[i].id);
					neighborsConnected = true;
					break; //no need to check the other neighbors
				}

			}
		}

		//Rule 1
		//Rule 2



	}
	else{
		console.log("Network too small yet");
	}

}
