import Header from "../components/Header";
import {Form} from "react-bootstrap";
import {Tables} from "../../types/explorationParams";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {Permissions} from "../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../components/PrivateComponent";
import React, {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../redux/actions/ExplorationParamsActions";

const Create = () => {
    const dispatch = useAppDispatch();

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const table: Tables = event.currentTarget.value as Tables;
        dispatch(updateExplorationParams({table: table}))
    }

    const table = useAppSelector(state => state.creationParams?.table)

    useEffect(()=>{
        if (!table) {
            dispatch(updateExplorationParams({table: Tables.PERSONS}))
        }
    }, [table])

    return (
        <div className="create-page">
            <Header backButtonPath={"/"}/>

            <main className={"create-page__main-container"}>
                <Form.Select className={"create__select"} value={table} onChange={handleSelectChange}>
                    <option value={Tables.PERSONS}>Фізичну особу</option>
                    <option value={Tables.JUR_PERSONS}>Юридичну особу</option>
                    <PrivateComponentWrapper neededPermissions={[Permissions.USERS_READ, Permissions.USERS_WRITE]} mode={ForbiddenOutputCallbackModesEnum.NO_OUTPUT}>
                        <option value={Tables.USERS}>Користувача</option>
                    </PrivateComponentWrapper>
                </Form.Select>
            </main>
        </div>
    )
}

export default Create;