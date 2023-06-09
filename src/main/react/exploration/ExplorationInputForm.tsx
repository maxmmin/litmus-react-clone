import {useAppSelector} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {Entity} from "../../redux/exploration/Entity";
import ExplorationMode from "../../redux/exploration/ExplorationMode";
import FindByFullNameGroup from "./InputGroupes/FindByFullNameGroup";
import FindByIdGroup from "./InputGroupes/FindByIdGroup";
import React from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";

function getInputGroupJsxByMode (mode: ExplorationMode): JSX.Element {
    console.log(mode)
    switch (mode) {
        case (ExplorationMode.BY_FULL_NAME): {
            return <FindByFullNameGroup/>
        }

        case (ExplorationMode.BY_ID): {
            return <FindByIdGroup/>
        }

        default: {
            throw new Error("unknown exploration mode value was provided")
        }
    }
}

export type ExplorationFormProps = {
    exploredEntity: Entity, isPending: boolean, onSubmit: (e: React.MouseEvent<HTMLButtonElement>)=>void
}

function ExplorationInputForm ({exploredEntity, isPending, onSubmit}: ExplorationFormProps): JSX.Element|null {
    const exploration: RootState['exploration'] = useAppSelector(state => state.exploration)
    if (!exploredEntity) {
        return null;
    } else {
        let explorationMode: ExplorationMode|null = null;

        switch (exploredEntity) {
            case Entity.PERSON:
                explorationMode = exploration.person!.params.modeId;
                break;
            case Entity.JUR_PERSON:
                explorationMode = exploration.jurPerson!.params.modeId;
                break;
            case Entity.USER:
                explorationMode = exploration.user!.params.modeId;
                break;
            default: throw new Error("provided unknown entity")
        }

        return (
            <div className="explore-page__input-group-container">
                <Form className={"explore-input-group"}>

                    { getInputGroupJsxByMode(explorationMode) }

                    <Button disabled={isPending} onClick={onSubmit} variant="primary" className={`w-100 py-2 mt-3 litmus-primary-btn`}>
                        {isPending?"Завантаження...":"Пошук"}
                    </Button>
                </Form>
            </div>
        )
    }
}

export default ExplorationInputForm