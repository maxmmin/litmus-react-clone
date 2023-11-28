class UnsupportedModeError extends Error {

    constructor(message: string = "Unsupported exploration mode") {
        super(message);
    }
}

export default UnsupportedModeError;