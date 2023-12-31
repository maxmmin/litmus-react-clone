/**
 * class used for fast access for all exploration modes.
 */
export default class ExplorationMode {
    private static lastId: number = 0;
    private static readonly modes: ExplorationMode[] = []

    public static readonly BY_FULL_NAME: ExplorationMode = new ExplorationMode("За ФІО");
    public static readonly BY_JUR_NAME: ExplorationMode = new ExplorationMode("За назвою");
    public static readonly FIND_ALL: ExplorationMode = new ExplorationMode("Без критеріїв");
    public static readonly BY_ID: ExplorationMode = new ExplorationMode("За ID");
    public static readonly BY_EMAIL: ExplorationMode = new ExplorationMode("За email адресою")

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

export const basicExplorationModes: ExplorationMode[] = [ExplorationMode.FIND_ALL, ExplorationMode.BY_ID]

export const basicHumanExplorationModes: ExplorationMode[] = [ExplorationMode.FIND_ALL, ExplorationMode.BY_ID, ExplorationMode.BY_FULL_NAME]