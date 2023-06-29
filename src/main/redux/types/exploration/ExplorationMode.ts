import React from "react";
import PersonExplorationParams from "./human/person/PersonExplorationParams";
import {
    hasFullNameErrors,
    hasIdErrors
} from "../../../service/exploration/validation/BasicExplorationValidationService";

/**
 * class used for fast access for all exploration modes.
 */
export default class ExplorationMode {
    private static lastId: number = 0;
    private static readonly modes: ExplorationMode[] = []

    public static readonly BY_FULL_NAME: ExplorationMode = new ExplorationMode("За ФІО", hasFullNameErrors);
    public static readonly BY_ID: ExplorationMode = new ExplorationMode("За ID", hasIdErrors);

    public readonly id: number;
    public readonly title: string;

    public readonly hasErrors: (er: Partial<Record<keyof PersonExplorationParams, string>>)=>boolean

    private constructor(title: string, hasErrors: (er: Partial<Record<keyof PersonExplorationParams, string>>)=>boolean) {
        this.id = ExplorationMode.lastId++;
        this.title = title;
        this.hasErrors=hasErrors;
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