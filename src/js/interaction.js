const baseURL = "https://generalmotors.pegatsdemo.com/prweb/PRRestService/CPMCRestService/SelfService/";
var interactionID = "";
var intID;

function setInteraction(interactionType, customerID, accountNumber) {
    const Http = new XMLHttpRequest();
    var url = baseURL+'CreateInteraction?interactiontype='+interactionType+'&customerid='+customerID+'&accountnumber='+accountNumber;
    Http.open("POST", url);
    Http.send();

    Http.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
            console.log("Interaction created. Interaction ID: " + Http.responseText);
            interactionID = Http.responseText;
            document.getElementById("interactionID").value = interactionID;
            //alert(document.getElementById("interactionID").value);
            //alert("Created interaction: " +interactionID);
            Http.abort();
        }
    }
}

function resolveInteraction (status) {
    const Http = new XMLHttpRequest();
    var intID = document.getElementById("interactionID").value;
    var url = baseURL+'ResolveInteraction?interactionid=' + intID + '&statuswork=' +status;
    Http.open("POST", url);
    Http.send();

    Http.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
            console.log("Resolved interaction " + intID + " with status " +Http.responseText);
            Http.abort();
        }
    }
    return true;
}