import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import {setLocalInput} from "../../../../redux/exploration/params/ExplorationParamsActions";
import {BasicHumanSearchPayload} from "../../../../redux/exploration/EntityExplorationState";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../../util/pureFunctions";

const FindById = () => {
    const dispatch = useAppDispatch();

    const isInvalid = useState<boolean>(false);
    const entity = useAppSelector(state => state.explorationParams?.entity)

    const localInput = useAppSelector(state => {
        const globalInput = state.explorationParams?.input;
        if (entity&&globalInput) {
            return globalInput[entity] as BasicHumanSearchPayload;
        }
        return null;
    })

    const id = localInput?localInput.id:""

    // useEffect(()=>{
    //     if (isNaN(+id!)) {
    //         if (!isInvalid) {
    //             dispatch(updateExplorationParams({isInvalid: true}))
    //         }
    //     } else if (isInvalid) {
    //         dispatch(updateExplorationParams({isInvalid: false}))
    //     }
    // },[id, isInvalid])


    // ${isInvalid?"is-invalid":""}`}
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <input autoComplete={"new-password"} onChange={e=>{
                    dispatch(setLocalInput({...localInput, id: e.currentTarget.value}))
                }} className={`id form-control`} value={id} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindById;