import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Location} from "../../../model/Location";
import usePlacesAutocomplete from "use-places-autocomplete";
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from "@reach/combobox";
import {geocode} from "../../../util/pureFunctions";
import {gmapsRegionOptions} from "../../../util/appConfig";


type AutocompleteProps = {
    address: string,
    setLocation: Dispatch<SetStateAction<Location | null>>;
}

const PlacesAutocomplete = ({address,setLocation}: AutocompleteProps) => {
    const {
        ready,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            ...gmapsRegionOptions
        }
    });

    const [inputValue, setInputValue] = useState<string>("")

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await geocode(address)
        const result = results[0]

        setLocation({ latitude: result.geometry.location.lat()!, longitude: result.geometry.location.lng()!, address: result.formatted_address});
    };
    // I split value for input and value of autocomplete to prevent firing Google Maps Autocomplete invoking when you select position on map.
    useEffect(()=>{
        setInputValue(address)
    }, [address])

    return (
        <Combobox className={"geo-autocomplete-container"} onSelect={handleSelect}>
            <ComboboxInput
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    setValue(e.target.value)
                }}
                disabled={!ready}
                className="combobox-input form-control"
                placeholder="Search an address"
            />
            <ComboboxPopover portal={false} className={"autocomplete-items-popover"}>
                <ComboboxList className={"autocomplete-items-list"}>
                    {
                        status === "OK" &&
                        data.map(({ place_id, description }: {place_id: string, description: string}) => {
                            return <ComboboxOption className={"autocomplete-items__item"} key={place_id} value={description} />
                        })
                    }
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export default PlacesAutocomplete;
