import PagedData from "../rest/PagedData";
import Pagination from "react-bootstrap/Pagination";
import React from "react";

export const getVisibleIndexes = (pagedData: PagedData<unknown>) => {
    const desirableLength = 5;

    const sideLength = Math.trunc(desirableLength/2);

    const indexes: number[] = [pagedData.index]

    for (let cursor = pagedData.index-1; cursor>-1&&cursor>pagedData.index-sideLength-1; cursor--) {
        indexes.unshift(cursor);
    }

    for (let cursor = pagedData.index+1; cursor<pagedData.totalPages&&cursor<pagedData.index+1+sideLength; cursor++) {
        indexes.push(cursor);
    }

    return indexes;
}

export class LocalPager<T> {
    private pageData: PagedData<T>;

    constructor(private readonly fullContent: T[], options: PageOptions) {
        this.pageData = LocalPager.constructPageData(fullContent, options);
    }

    public goTo(i: number) {
        this.pageData = LocalPager.constructPageData(this.fullContent, {pageSize: this.pageData.size, pageIndex: i});
    }

    public goNext() {
        this.goTo(this.pageData.index+1)
    }

    public goPrev() {
        this.goTo(this.pageData.index-1)
    }

    public goFirst() {
        this.goTo(0);
    }

    public goLast() {
        this.goTo(this.pageData.totalPages-1)
    }

    public getPageData () {
        return this.pageData;
    }

    public static constructPageData <U> (fullContent: U[], {pageSize, pageIndex}: PageOptions): PagedData<U> {
        const totalPages: number = Math.ceil(fullContent.length/pageSize);

        if (pageIndex<0) throw new Error("index should be >= 0")

        if (pageIndex>0&&pageIndex>totalPages-1) throw new Error("index is higher than upper bound of current collection: "+(totalPages-1))

        const startPoint = pageSize*pageIndex;

        return {
            content: fullContent.slice(startPoint, startPoint+pageSize),
            totalPages: totalPages,
            last: totalPages===0||pageIndex===totalPages-1,
            empty: fullContent.length===0,
            size: pageSize,
            totalElements: fullContent.length,
            first: pageIndex===0,
            numberOfElements: fullContent.length<pageSize?fullContent.length:pageSize,
            index: pageIndex
        }
    }
}

export type PageOptions = {pageSize: number, pageIndex: number}

export function EntitiesPaginator ({page, goTo, cssAnchor=""}: {page: PagedData<any>, goTo: (i: number)=>any, cssAnchor?: string}) {
    return (
        <Pagination className={"litmus-pagination "+cssAnchor}>
            <Pagination.First disabled={page.first} onClick={()=>{
                if (!page.first) goTo(0)
            }} />
            <Pagination.Prev disabled={page.first} onClick={()=>{
               if (!page.first) goTo(page.index-1)
            }} />
            {getVisibleIndexes(page).map(index => <Pagination.Item onClick={()=>{
                if (page.index!==index) {
                    goTo(index)
                }
            }} key={index} active={page.index===index}>{index+1}</Pagination.Item>)}
            <Pagination.Next disabled={page.last} onClick={() =>{
                if (!page.last) goTo(page.index+1)
            }} />
            <Pagination.Last disabled={page.last} onClick={()=>{
                if (!page.last&&page.totalPages>0) goTo(page.totalPages-1)
            }} />
        </Pagination>
    )
}