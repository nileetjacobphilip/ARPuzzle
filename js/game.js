{
    const image = new Image(),
    takePhotoButton = document.querySelector('.takePhoto');
    let constraints, imageCapture, mediaStream, video;
    
    //Puzzle Variables
    const markers = document.querySelectorAll('a-marker'),
    numCol=3,
    numRow=3,
    puzzlePieces = numRow*numCol,
    tolerance = 1.9;
    
    //Puzzle Array Variables
    let imgPieces = new Array(puzzlePieces),
    puzzle = [...Array(puzzlePieces).keys()].map(String),
    pieces = numCol*numRow - 1,
    positionMarkers = [],
    check = new Array;

    //initialisation and error handling
    const init = () => {
        video =document.querySelector('video');
        navigator.mediaDevices.enumerateDevices()
         .catch(error=> console.log('enumerateDevices() error', error))
         .then(getStream);
        takePhotoButton.addEventListener('click', getPicture);
    }
    
    //Get Video Stream from the Camera
    const getStream =() => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        constraints = {
            video:{
                width:720,
                height: 720,
            }
        }
        navigator.mediaDevices.getUserMedia(constraints)
         .then(gotStream)
         .catch(error => {
             console.log('getUserMedia error', error);
         });
    };
    
    //Display the stream from the camera 
    //create an imageCapture object using video from stream
    const gotStream = stream => {
        mediaStream= stream;
        video.srcObject = stream;
        imageCapture = new imageCapture(stream.getVideoTracks()[0]);
    };
    
    //Take the Picture
    const getPicture =() =>{
        imageCapture.takePhoto()
            .then((img) =>{
                image.src = URL.createObjectURL(img);
                image.addEventListener('load', () => creatImagePieces(image));
                setInterval(() => checkDistance(), 1000);
            })
            .catch((error)=> {console.log('takePhoto() error', error)});
    };
    //Create 2D Image Pieces onto canvas
    const creatImagePieces = image => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const pieceWidth = image.width/numCol;
        const pieceHeight = image.height/numRow;
        for(let x=0; x < numCol; ++x){
            for(let y=0; y<numRow; ++y){
                ctx.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth,pieceHeight,0,0, canvas.width,canvas.height);
            }
        }
    }
}