import {Splide, SplideSlide} from "@splidejs/react-splide";
import "../assets/styles/imageSlider.scss";
import '@splidejs/react-splide/css';
import SecuredImage from "../sharedComponents/SecuredImage";

type SliderProps = {
    imageLinks: string[],
    cssAnchor?: string
}
export default function ImageSlider ({imageLinks, cssAnchor=""}: SliderProps) {
    return (
        <div className={`image-slider-wrapper ${cssAnchor}`}>
            <Splide options={{
                autoHeight: false,
                fixedHeight: "100%",
                pagination: true
            }} className={"image-slider"}>
                {imageLinks.map(link => {
                    return <SplideSlide key={link} className={"image-slider__slide"}>
                        <div className="image-slider__image-wrapper">
                            <SecuredImage className={"image-slider__image"} src={link} alt={"entity image"}/>
                        </div>
                    </SplideSlide>
                })}
            </Splide>
        </div>
    )
}