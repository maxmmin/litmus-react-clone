import {useAppSelector} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {Entity} from "../../model/Entity";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import React from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ExplorationInputGroupByMode from "./ExplorationInputGroupByMode";

export type ExplorationFormProps = {
    exploredEntity: Entity, isPending: boolean, onSubmit: (e: React.MouseEvent<HTMLButtonElement>)=>void
}

function ExplorationInputForm ({exploredEntity, isPending, onSubmit}: ExplorationFormProps): JSX.Element|null {
    const exploration: RootState['exploration'] = useAppSelector(state => state.exploration)
    if (!exploredEntity) {
        return null;
    } else {
        let explorationModeId: number;

        switch (exploredEntity) {
            case Entity.PERSON:
                explorationModeId = exploration.person!.params.modeId;
                break;
            case Entity.JUR_PERSON:
                explorationModeId = exploration.jurPerson!.params.modeId;
                break;
            case Entity.USER:
                explorationModeId = exploration.user!.params.modeId;
                break;
            default: throw new Error("provided unknown entity")
        }

        const explorationMode = ExplorationMode.getModeById(explorationModeId);

        return (
            <div className="explore-page__input-group-container">
                <Form className={"explore-input-group"}>
                    <ExplorationInputGroupByMode mode={explorationMode}/>

                    <Button disabled={isPending} onClick={onSubmit} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn`}>
                        {isPending?"Завантаження...":"Пошук"}
                    </Button>
                </Form>
            </div>
        )
    }
}

export default ExplorationInputForm