import {useAppSelector} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {Entity} from "../../model/Entity";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import React from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ExplorationInputGroupByMode from "./ExplorationInputGroupByMode";
import PersonExplorationParams from "../../redux/types/exploration/human/person/PersonExplorationParams";
import {getEntityExplorationStateManager} from "../../util/getEntityExplorationService";

export type ExplorationFormProps = {
    exploredEntity: Entity, isPending: boolean, onSubmit: (e: React.MouseEvent<HTMLButtonElement>)=>void
}

function ExplorationInputForm ({exploredEntity, isPending, onSubmit}: ExplorationFormProps): JSX.Element|null {
    const explorationStateManager = useAppSelector(()=>exploredEntity?getEntityExplorationStateManager(exploredEntity):undefined);
    const modeId = useAppSelector(()=>explorationStateManager?.getExplorationParams().modeId);
    const validationErrors = useAppSelector(()=>explorationStateManager?.getValidationErrors());

    if (!exploredEntity||!explorationStateManager) {
        return null;
    }

    const explorationMode = ExplorationMode.getModeById(modeId!);

    const hasErrors = explorationMode.hasErrors(validationErrors!);

    return (
        <div className="explore-page__input-group-container">
            <Form className={"explore-input-group"}>
                <ExplorationInputGroupByMode mode={explorationMode}/>

                <Button disabled={isPending||hasErrors} onClick={onSubmit} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn`}>
                    {isPending?"Завантаження...":"Пошук"}
                </Button>
            </Form>
        </div>
    )
}

export default ExplorationInputForm