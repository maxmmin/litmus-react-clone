import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {GeoLocation} from "../../../model/GeoLocation";
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from "@reach/combobox";
import {LitmusServiceContext} from "../../App";
import LoaderSpinner from "../../loader/LoaderSpinner";


type AutocompleteProps = {
    address: string,
    setLocation: Dispatch<SetStateAction<GeoLocation | null>>;
}

type AutoSuggestRequest = {
    value: string
}

const PlacesAutocomplete = ({address,setLocation}: AutocompleteProps) => {
    const geocodingService = useContext(LitmusServiceContext).geocodingService;

    const [places, setPlaces] = useState<string[]>([])

    const [inputValue, setInputValue] = useState<string>("")

    const [pending, setPending] = useState<boolean>(false);

    const handleSelect = async (address: string) => {
        setPlaces([])

        setPending(true);

        try {
            const location = await geocodingService.geocode(address);
            setLocation({...location, address: address});
        } finally {
            setPending(false);
        }
    };

    useEffect(()=>{
        setInputValue(address)
    }, [address])

    useEffect(() => {
        let timerId: null|number = null;

        let aborted: {value: boolean} = {value: false};

        if (inputValue.length>0&&inputValue!==address) {
            timerId = window.setTimeout(()=>{
                setPending(true);
                if (places.length>0) setPlaces([]);
                geocodingService
                    .autocomplete(inputValue)
                    .then(data=> {
                        if (!aborted.value) {
                            setPlaces(data);
                        }
                    })
                    .finally(()=>{
                        if (!aborted.value) {
                            setPending(false);
                        }
                    });
            }, 100)

        } else {
            if (places.length>0) setPlaces([]);
            setPending(false);
        }

        return ()=>{
            if (timerId!==null) window.clearTimeout(timerId);
            aborted.value = true;
        }
    }, [inputValue]);

    return (
        <Combobox className={"geo-autocomplete-container"} onSelect={handleSelect}>
            <div className="geo-input-wrapper">
                <ComboboxInput
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    disabled={false}
                    className="combobox-input form-control"
                    placeholder="Search an address"
                />
                {pending ?
                    <div className="input__loader-container">
                        <LoaderSpinner/>
                    </div>
                    :   null
                }
            </div>
            <ComboboxPopover portal={false} className={"autocomplete-items-popover"}>
                <ComboboxList className={"autocomplete-items-list"}>
                    {
                        places.map( (place, index) => {
                            return <ComboboxOption className={"autocomplete-items__item"} key={index} value={place} />
                        })
                    }
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export default PlacesAutocomplete;
