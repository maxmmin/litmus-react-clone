import {DateBuilder, preventEnter, switchNeighbourInput, switchNext} from "../../data/pureFunctions";
import {updatePersonCreationParams} from "../../redux/actions/CreationParamsActions";
import React from "react";
import {DateEntity} from "../../types/DateEntity";

type DateProps = {
    date: DateBuilder,
    setDate: (date: DateEntity)=>void,
    className?: string
}

const InputDate = ({date, setDate, className}: DateProps) => {
    const [year, month, day] = [date.getYear(), date.getMonth(), date.getDay()];

    return <div className={`date-container ${className?className:""}`}>
        <input value={day} autoComplete={"new-password"} className={`date-container__item date-container__item_day form-control`} type="text" placeholder="DD"
               onKeyDown={preventEnter}
               onFocus={e => {

               }
               }
               onChange={e => {
                   setDate({year: year, month: month, day: e.currentTarget.value})
                   if (e.currentTarget.value.length>1) {
                       switchNeighbourInput(e)
                   }
               }}
        />

        <input value={month} autoComplete={"new-password"} className={`date-container__item date-container__item_month form-control`} type="text" placeholder="MM"
               onKeyDown={preventEnter}
               onChange={e => {
                   setDate({day: day, month: e.currentTarget.value, year: year})
                   if (e.currentTarget.value.length>1) {
                       switchNeighbourInput(e)
                   }
               }}
        />

        <input value={year} autoComplete={"new-password"} className={`date-container__item date-container__item_year form-control`} type="text" placeholder="YYYY"
               onChange={e => {
                   setDate({day: day, month: month, year: e.currentTarget.value})
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