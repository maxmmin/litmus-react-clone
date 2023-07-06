import {preventEnter, switchNeighbourInput, switchNext} from "../../util/pureFunctions";
import React from "react";
import DateEntity from "../../model/DateEntity";

type DateProps = {
    date: DateEntity,
    setDate: (date: DateEntity)=>void,
    className?: string,
    inputPrefix?: string
}

const InputDate = ({date, setDate, className, inputPrefix=""}: DateProps) => {
    const {year, month, day} = date;

    return <div className={`date-container ${className?className:""}`}>
        <input value={day} autoComplete={"new-password"} className={`date-container__item date-container__item_day form-control ${inputPrefix}`} type="text" placeholder="DD"
               onKeyDown={preventEnter}
               onChange={e => {
                   setDate({year, month, day: e.currentTarget.value})
                   if (e.currentTarget.value.length>1) {
                       switchNeighbourInput(e)
                   }
               }}
        />

        <input value={month} autoComplete={"new-password"} className={`date-container__item date-container__item_month form-control ${inputPrefix}`} type="text" placeholder="MM"
               onKeyDown={preventEnter}
               onChange={e => {
                   setDate({day, month: e.currentTarget.value, year})
                   if (e.currentTarget.value.length>1) {
                       switchNeighbourInput(e)
                   }
               }}
        />

        <input value={year} autoComplete={"new-password"} className={`date-container__item date-container__item_year form-control ${inputPrefix}`} type="text" placeholder="YYYY"
               onChange={e => {
                   setDate({year: e.currentTarget.value, month, day})
                   if (e.currentTarget.value.length>3) {

                       const event: React.SyntheticEvent = {
                         ...e,
                           currentTarget: e.currentTarget.parentElement!
                       }
                       switchNext(event)
                   }
               }
               }
        />

    </div>
}

export default InputDate;