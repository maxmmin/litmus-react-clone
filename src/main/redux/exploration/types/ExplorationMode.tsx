import FindByFullNameGroup from "../../../react/exploration/InputGroupes/FindByFullNameGroup";
import React from "react";
import FindByIdGroup from "../../../react/exploration/InputGroupes/FindByIdGroup";

export enum ExplorationModeName {
    BY_FULL_NAME="BY_FULL_NAME",
    BY_ID="BY_ID"
}

/**
 * class used for fast access for all exploration modes.
 */
export default class ExplorationMode {
    private static lastId: number = 0;
    private static readonly modes: ExplorationMode[] = []

    public static readonly [ExplorationModeName.BY_FULL_NAME]: ExplorationMode = new ExplorationMode("За ФІО", <FindByFullNameGroup/>);
    public static readonly [ExplorationModeName.BY_ID]: ExplorationMode = new ExplorationMode("За ID", <FindByIdGroup/>);

    public readonly id: number;
    public readonly title: string;
    public readonly jsx: ()=>JSX.Element;

    private constructor(title: string, jsx: JSX.Element) {
        this.id = ExplorationMode.lastId++;
        this.jsx = ()=>jsx;
        this.title = title;
        ExplorationMode.modes.push(this);
    }

    public static getModeById (id: number): ExplorationMode {
        const mode = ExplorationMode.modes.find(mode=>mode.id===id);
        if (mode) return mode
            else throw new ModeNotFoundException(id);
    }
}


class ModeNotFoundException extends Error {
    constructor(id: number) {
        super("Mode with id "+id+" does not exist");
    }
}