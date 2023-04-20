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

export class DateBuilder {
    private day: string = '';

    private month: string = '';

    private year: string = '';

    setDay (day: string): DateBuilder {
        this.day = day;
        return this;
    }

    setMonth (month: string): DateBuilder {
        this.month = month;
        return this;
    }

    setYear (year: string): DateBuilder {
        this.year = year;
        return this;
    }

    buildStringFrom (date: DateEntity): string {
        return this.setYear(date.year).setMonth(date.month).setDay(date.day).buildStringDate();
    }

    buildStringDate (): string {
        return `${this.year}-${this.month}-${this.day}`
    }

    buildFromString (date: string): DateEntity {
        const [year, month, day] = date.split("-")
        return {year, month, day};
    }

    build (): DateEntity {
        return new DateEntity(this.year, this.month, this.day)
    }

    isValid (): boolean {
        return !isNaN(new Date(`${this.year}-${this.month}-${this.day}`).getTime())
    }
}