var loadingBarImage = new Image();
loadingBarImage.src = 'html5game/lpic.png';
loadingBarImage.width = 200;
loadingBarImage.height = 226;
loadingBarImage.x_offset = -(loadingBarImage.width / 2);
loadingBarImage.y_offset = -(loadingBarImage.height / 2);

function loadingFuction(_graphics, _width, _height, _total, _current, _loadingscreen) {
	if (_loadingscreen){
		_graphics.drawImage(_loadingscreen, 0, 0, _width, _height);
	} 
	else
	{
		var barwidth = (_width / 5) * 4;
		var barheight = 5;
		var x = (_width - barwidth) / 2;
		var y = _height*0.65;	
		var w = (barwidth / _total) * _current;
  		var loading = document.getElementById("loading_screen");
		var load_width = document.getElementById("loading_screen").offsetWidth;
		var load_height = document.getElementById("loading_screen").offsetHeight;
		loading.style.position = "fixed";
		loading.style.left = "50%";
		loading.style.top = "50%";
		loading.style.marginLeft = -(0.5)*load_width+"px";
		loading.style.marginTop = -(0.5)*load_height+"px";
		loading.style.padding = "0";
		loading.style.border = "0";
		_graphics.fillStyle = "#C7D35F";
		_graphics.fillRect(0, 0, _width, _height);
		if (_current != 0)
		{
			_graphics.fillStyle = "#C7D35F"
			_graphics.barheight = 20;
			_graphics.fillRect(x, y, barwidth, barheight);
			_graphics.fillStyle = "#171324";
			_graphics.barheight = 20;
			_graphics.fillRect(x, y, w, barheight);
			_graphics.drawImage(loadingBarImage,_width/2+loadingBarImage.x_offset,_height/2.5+loadingBarImage.y_offset);
		}
	}
}

