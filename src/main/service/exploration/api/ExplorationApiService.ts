/**
 * P - response dto
 * Service which provides work with REST API
 */


interface LookupService<P> {
    findById (id: string): Promise<P|null>;
}

export default LookupService;