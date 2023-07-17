
// Get the source image to be edited
let image = document.getElementById('sourceImage');
 
// Get the canvas for the edited image
let canvas = document.getElementById('canvas');
 
// Get the 2D context of the image
let context = canvas.getContext('2d');

// Get the canvas for the edited image
let editedCanvas = document.getElementById('editedCanvas');
 
// Get the 2D context of the image
let editedContext = editedCanvas.getContext('2d');

let tileButton = document.getElementById('tileButton');
tileButton.onclick = async () => {
	await tileImage();
};
 
// Get all the sliders of the image
let brightnessSlider = document.getElementById("brightnessSlider");
let contrastSlider = document.getElementById("contrastSlider");
let grayscaleSlider = document.getElementById("grayscaleSlider");
let hueRotateSlider = document.getElementById("hueRotateSlider");
let saturateSlider = document.getElementById("saturationSlider");
let sepiaSlider = document.getElementById("sepiaSlider");

var imageName = '';

function uploadImage(event) {
 
    // Set the source of the image from the uploaded file
    image.src = URL.createObjectURL(event.target.files[0]);
	imageName = event.target.files[0].name.split('.').slice(0, -1).join('.');
 
    image.onload = function () {
        // Set the canvas the same width and height of the image
        canvas.width = this.width;
        canvas.height = this.height;
		
		editedCanvas.width = canvas.width * 2;
		editedCanvas.height = canvas.height * 2;

		context.drawImage(image, 0, 0);
    };
 
    // Show the image editor controls and hide the help text
    document.querySelector('.help-text').style.display = "none";
    document.querySelector('.image-save').style.display = "block";
    document.querySelector('.preset-filters').style.display = "block";
	
	context.willReadFrequently = true;
}

async function tileImage() {
	console.log(tileButton.innerHTML);

	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	let editedData = editedContext.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
	
	var i = 0;
	
	var dstX = 0;
	var dstY = 0;
	for(i = 0; i < editedData.data.length; i += 4) {
		var srcX = dstX % canvas.width;
		var srcY = dstY % canvas.height;
		var srcIndex = 4 * (srcY * canvas.width + srcX);
		
		editedData.data[i] = imageData.data[srcIndex];
		editedData.data[i + 1] = imageData.data[srcIndex + 1];
		editedData.data[i + 2] = imageData.data[srcIndex + 2];
		editedData.data[i + 3] = imageData.data[srcIndex + 3];
		
		dstX++;
		if (dstX >= editedCanvas.width) {
			dstX = 0;
			dstY++;
		}
	}
	editedContext.putImageData(editedData, 0, 0);
}

function saveImage() {
    // Select the temporary element we have created for
    // helping to save the image
    let linkElement = document.getElementById('link');
    linkElement.setAttribute(
      'download', imageName + ' tiled.png'
    );
 
    // Convert the canvas data to a image data URL
    let canvasData = editedCanvas.toDataURL("image/png")
 
    // Replace it with a stream so that
    // it starts downloading
    canvasData.replace("image/png", "image/octet-stream")
 
    // Set the location href to the canvas data
    linkElement.setAttribute('href', canvasData);
 
    // Click on the link to start the download
    linkElement.click();
}