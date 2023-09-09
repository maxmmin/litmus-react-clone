export default class DateEntity {
    day: string = "";
    month: string = "";
    year: string = "";


    constructor(year: string, month: string, day: string) {
        this.day = day;
        this.month = month;
        this.year = year;
    }
}

export class DateEntityTool {
    private static readonly separator = "-";

    private day: string = '';

    private month: string = '';

    private year: string = '';

    setDay (day: string): DateEntityTool {
        this.day = day;
        return this;
    }

    setMonth (month: string): DateEntityTool {
        this.month = month;
        return this;
    }

    setYear (year: string): DateEntityTool {
        this.year = year;
        return this;
    }

    buildStringDate (): string {
        return `${this.year}-${this.month}-${this.day}`
    }

    build (): DateEntity {
        return new DateEntity(this.year, this.month, this.day)
    }

    getDate (): Date {
        return new Date(`${this.year}-${this.month}-${this.day}`);
    }

    isValid (): boolean {
        return !isNaN(this.getDate().getTime())
    }

    static buildFromString (date: string): DateEntity {
        const [year, month, day] = date.split(DateEntityTool.separator)
        return {year, month, day};
    }

    static getTool(date: DateEntity): DateEntityTool {
        return new DateEntityTool().setYear(date.year).setMonth(date.month).setDay(date.day)
    }

    static getStringFrom (date: DateEntity): string {
        return DateEntityTool.getTool(date).buildStringDate();
    }

    static isValid(dateEntity: DateEntity): boolean {
        if ((!dateEntity.day || dateEntity.day.length!==2 || isNaN(+dateEntity.day))  ||
            (!dateEntity.month || dateEntity.month.length!==2 || isNaN(+dateEntity.month)) ||
            (!dateEntity.year || dateEntity.year.length!==4 || isNaN(+dateEntity.year))) return false;

        return !isNaN(this.getTool(dateEntity).getDate().getTime());
    }
}