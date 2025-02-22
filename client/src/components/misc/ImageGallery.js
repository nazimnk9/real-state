import { useParams } from "react-router-dom"
import { useState, useCallback } from "react"
import Gallery from "react-photo-gallery"
import Carousel, { Modal, ModalGateway } from 'react-images'
import Logo from "../../logo.svg"


// const photos = [
//     {
//         src: 'https://firebasestorage.googleapis.com/v0/b/onlineeducation-cffb9.appspot.com/o/images%2FBgp0CKlwU98LXR0ZqWoNX.jpeg?alt=media&token=0f21819a-1e82-4591-8829-4e186ee3b591',
//         width: 4,
//         height: 3
//     },
//     {
//         src: 'https://firebasestorage.googleapis.com/v0/b/onlineeducation-cffb9.appspot.com/o/images%2FWmYaEDU0PQJF2kGIBc4Ak.jpeg?alt=media&token=5320f60e-d60d-4c1e-b47c-efb303095e90',
//         width: 1,
//         height: 1
//     }
// ];

export default function ImageGallery({photos}) {
    //state
    const [current, setCurrent] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    // hooks
    const params = useParams()

   
    const openLightBox = useCallback((event,{photo,index}) =>{
        setCurrent(index)
        setIsOpen(true)
    },[])

    const closeLightBox = () => {
        setCurrent(0)
        setIsOpen(false)
    }
    return (
        <>
            <Gallery photos={photos} onClick={openLightBox} />
            <ModalGateway>
                {isOpen ? (
                    <Modal onClose={closeLightBox}>
                        <Carousel currentIndex={current} views={photos.map((x) => ({
                            ...x, 
                            srcset: x.srcSet,
                            caption: x.title,
                            }))} />
                    </Modal>
                ) : null}
            </ModalGateway>
        </>
    )
}