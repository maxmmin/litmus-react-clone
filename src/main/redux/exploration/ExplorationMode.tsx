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

    public static readonly [ExplorationModeName.BY_FULL_NAME]: ExplorationMode = new ExplorationMode("За ФІО");
    public static readonly [ExplorationModeName.BY_ID]: ExplorationMode = new ExplorationMode("За ID");

    public readonly id: number;
    public readonly title: string;

    private constructor(title: string) {
        this.id = ExplorationMode.lastId++;
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