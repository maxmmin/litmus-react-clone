export default interface PagedData<E> {
    content: E[];

    index: number;

    size: number;

    numberOfElements: number;

    totalElements: number;

    totalPages: number;

    first: boolean;

    last: boolean;

    empty: boolean;
}

export class UnPagedData<E> implements PagedData<E>{
    content: E[];
    empty: boolean;
    first: boolean = false;
    index: number = -1;
    last: boolean = false;
    numberOfElements: number;
    size: number = -1;
    totalElements: number;
    totalPages: number = -1;
    unPaged = true;


    constructor(content: E[]) {
        this.content = Array.of(...content);
        this.empty = content.length===0;
        this.numberOfElements = content.length;
        this.totalElements = content.length;
    }
}

export function isUnPaged(response: PagedData<any>) {
    const unPagedFlag = "unPaged"
    return Object.hasOwn(response,unPagedFlag)&&(response as any)[unPagedFlag]===true
}

