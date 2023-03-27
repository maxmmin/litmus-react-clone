import {DateBuilder, preventEnter, switchNeighbourInput, switchNext} from "../../data/pureFunctions";
import {updatePersonCreationParams} from "../../redux/actions/CreationParamsActions";
import React from "react";

type DateProps = {
    date: DateBuilder,
    setDate: (date: DateBuilder)=>void,
    className?: string
}

const InputDate = ({date, setDate, className}: DateProps) => {
    const [year, month, day] = [date.getYear(), date.getMonth(), date.getDay()];

    return <div className={`date-container ${className?className:""}`}>
        <input value={year} autoComplete={"new-password"} className={`date-container__item date-container__item_year form-control`} type="text" placeholder="YYYY"
               onKeyDown={preventEnter}
               onChange={e => {
                   setDate(new DateBuilder().setYear(e.currentTarget.value).setDay(day).setMonth(month))
                   if (e.currentTarget.value.length>3) {
                       switchNeighbourInput(e)
                   }
               }
               }
        />

        <input value={month} autoComplete={"new-password"} className={`date-container__item date-container__item_month form-control`} type="text" placeholder="MM"
               onKeyDown={preventEnter}
               onChange={e => {
                   setDate(new DateBuilder().setYear(year).setDay(day).setMonth(e.currentTarget.value))
                   if (e.currentTarget.value.length>1) {
                       switchNeighbourInput(e)
                   }
               }}
        />

        <input value={day} autoComplete={"new-password"} className={`date-container__item date-container__item_day form-control`} type="text" placeholder="DD"
               onKeyDown={preventEnter}
               onChange={e => {
                   setDate(new DateBuilder().setYear(year).setDay(e.currentTarget.value).setMonth(month))
                   if (e.currentTarget.value.length>1) {
                       switchNext(e)
                   }
               }}
        />
    </div>
}

export default InputDate;