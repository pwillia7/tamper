var selectedElement;

function insertSiblingBeforeSummary(){
	var bvElement = document.getElementById('BVRRSummaryContainer');
	selectedElement.parentNode.insertBefore(bvElement,selectedElement);
}
function insertSiblingAfterSummary(){
	var bvElement = document.getElementById('BVRRSummaryContainer');
	selectedElement.parentNode.insertBefore(bvElement,selectedElement.nextSibling);
}
function insertLastChildSummary(){
	var bvElement = document.getElementById('BVRRSummaryContainer');
	selectedElement.appendChild(bvElement);

}
function insertFirstChildSummary(){
	var bvElement = document.getElementById('BVRRSummaryContainer');
	selectedElement.insertBefore(bvElement,selectedElement.children[0]);
}
function insertParentSummary(){
	var bvElement = document.getElementById('BVRRSummaryContainer');
	selectedElement.parentNode.replaceChild(bvElement, selectedElement);
	bvElement.appendChild(selectedElement);

}
function insertSiblingBefore(){
	var bvElement = document.getElementById('BVRRContainer');
	selectedElement.parentNode.insertBefore(bvElement,selectedElement);
}
function insertSiblingAfter(){
	var bvElement = document.getElementById('BVRRContainer');
	selectedElement.parentNode.insertBefore(bvElement,selectedElement.nextSibling);
}
function insertLastChild(){
	var bvElement = document.getElementById('BVRRContainer');
	selectedElement.appendChild(bvElement);

}
function insertFirstChild(){
	var bvElement = document.getElementById('BVRRContainer');
	selectedElement.insertBefore(bvElement,selectedElement.children[0]);
}
function insertParent(){
	var bvElement = document.getElementById('BVRRContainer');
	selectedElement.parentNode.replaceChild(bvElement, selectedElement);
	bvElement.appendChild(selectedElement);

}
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "insertSiblingBefore") {
        insertSiblingBefore();
    } else
    if (message.functiontoInvoke == "insertSiblingAfter") {
        insertSiblingAfter();
    } else
    if (message.functiontoInvoke == "insertLastChild") {
        insertLastChild();
    } else
    if (message.functiontoInvoke == "insertFirstChild") {
        insertFirstChild();
    } else
    if (message.functiontoInvoke == "insertParent") {
        insertParent();
    } else
    if (message.functiontoInvoke == "insertSiblingBeforeSummary") {
        insertSiblingBeforeSummary();
    } else
    if (message.functiontoInvoke == "insertSiblingAfterSummary") {
        insertSiblingAfterSummary();
    } else
    if (message.functiontoInvoke == "insertLastChildSummary") {
        insertLastChildSummary();
    } else
    if (message.functiontoInvoke == "insertFirstChildSummary") {
        insertFirstChildSummary();
    } else
    if (message.functiontoInvoke == "insertParentSummary") {
        insertParentSummary();
    }
});

document.addEventListener('contextmenu', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
   		selectedElement = target;
   		ogStyle = target.style.border;
        target.style.border = '3px solid red';
        setTimeout(function(){target.style.border = ogStyle;},1200);
}, false);
