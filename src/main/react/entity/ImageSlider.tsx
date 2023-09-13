import {Splide, SplideSlide} from "@splidejs/react-splide";
import "../../css/imageSlider.scss";
import '@splidejs/react-splide/css';

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
                            <img className={"image-slider__image"} src={link} alt={"person image"}/>
                        </div>
                    </SplideSlide>
                })}
            </Splide>
        </div>
    )
}