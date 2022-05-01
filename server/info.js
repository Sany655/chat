if (document.getElementById('FileBox').value != "") {
    FReader = new FileReader();
    Name = document.getElementById('NameBox').value;
    var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
    Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
    Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
    document.getElementById('UploadArea').innerHTML = Content;
    FReader.onload = function (evnt) {
        socket.emit('Upload', { 'Name': Name, Data: evnt.target.result });
    }
    socket.emit('Start', { 'Name': Name, 'Size': SelectedFile.size });
}
else {
    alert("Please Select A File");
}