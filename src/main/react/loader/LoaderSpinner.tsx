import {Spinner} from "react-bootstrap";

type Props = {
    cssAnchor?: string
}

const LoaderSpinner = ({cssAnchor=""}: Props) => {
    return <Spinner animation="border" className={"application-loader "+cssAnchor}/>
}

export default LoaderSpinner