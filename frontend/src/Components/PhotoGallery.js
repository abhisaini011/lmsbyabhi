import React from 'react'
import './PhotoGallery.css'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function PhotoGallery() {
    return (
        <div className='photogallery-container'>
            <h1 className='photogallery-title'>Photo Gallery</h1>
            <div className="photogallery-images">
                <img src="../../assets/images/image1.png" alt=''/>
                <img src="../../assets/images/image2.png" alt=''/>
                <img src="../../assets/images/image3.png" alt=''/>  
                <img src="../../assets/images/image4.png" alt=''/>
                <img src="../../assets/images/image5.png" alt=''/>
                <img src="../../assets/images/image6.png" alt=''/>
                <img src="../../assets/images/image7.png" alt=''/>
                <img src="../../assets/images/image8.png" alt=''/>
                <img src="../../assets/images/image9.png" alt=''/>
                <img src="../../assets/images/image10.png" alt=''/>
            </div>
            <button>VIEW MORE<ArrowForwardIosIcon style={{fontSize:20}}/></button>
        </div>
    )
}

export default PhotoGallery