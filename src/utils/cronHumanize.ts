interface CronConstants {
    SEPARATOR: string;
    COMA: string;
    DASH: string;
    WILDCARD: string;
    UNSPECIFIED: string;
    SLASH: string;
    SPECIFIC: string;
    LAST_DAY: string;
    LAST_WEEKDAY_MONTH: string;

    NEAREST_WEEKDAY: RegExp;
    LAST_WEEKDAY_SPECIFIC: RegExp;

    TYPE_MULTI: string;
    TYPE_RANGE: string;
    TYPE_SINGLE: string;
    TYPE_WILDCARD: string;
    TYPE_UNSPECIFIED: string;
    TYPE_INTERVAL: string;
    TYPE_SPECIFIC: string;

    TYPE_LAST_DAY: string;
    TYPE_LAST_WEEKDAY_MONTH: string;

    TYPE_NEAREST_WEEKDAY: string;
    TYPE_LAST_WEEKDAY_SPECIFIC: string;

    SHORT_DAYS: string[];
    FULL_DAYS: string[];

    SHORT_MONTHS: string[];
    FULL_MONTHS: string[];
}

interface CronDissection {
    seconds: string;
    minutes: string;
    hours: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
    year: string;
}

interface MultiDef { values: number[], last: number }
interface RangeDef { start: number, end: number }
interface IntervalDef { start: number, step: number }
interface SpecificDef { week: number, day: number }
interface DaySpecificDef { day: number }

export const CONSTANTS: CronConstants = {
    SEPARATOR: ' ',
    COMA: ',',
    DASH: '-',
    WILDCARD: '*',
    UNSPECIFIED: '?',
    SLASH: '/',
    SPECIFIC: '#',

    LAST_DAY: 'L',
    LAST_WEEKDAY_MONTH: 'LW',
    NEAREST_WEEKDAY: /([0-9]?[0-9])W/,
    LAST_WEEKDAY_SPECIFIC: /([0-9]?[0-9])L/,

    TYPE_MULTI: 'multi',
    TYPE_RANGE: 'range',
    TYPE_SINGLE: 'single',
    TYPE_WILDCARD: 'wildcard',
    TYPE_UNSPECIFIED: 'unspecified',
    TYPE_INTERVAL: 'interval',
    TYPE_SPECIFIC: 'specific',

    TYPE_LAST_DAY: 'last_day',
    TYPE_LAST_WEEKDAY_MONTH: 'last_weekday_month',
    TYPE_NEAREST_WEEKDAY: 'nearest_weekday',
    TYPE_LAST_WEEKDAY_SPECIFIC: 'last_weekday_specific',

    SHORT_DAYS: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    FULL_DAYS: ['воскревенье', 'понедельник', 'вторник', 'стреда', 'четверг', 'пятница', 'суббота'],
    SHORT_MONTHS: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    FULL_MONTHS: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
};

export class UnitDefinition {
    public type: string;

    // @ts-ignore
    public multi: MultiDef;
    // @ts-ignore
    public range: RangeDef;
    // @ts-ignore
    public interval: IntervalDef;
    // @ts-ignore
    public specific: SpecificDef;

    // TODO: Add L, LW, _L and _W
    // @ts-ignore
    public lastDay: string;
    // @ts-ignore
    public lastWeekdayMonth: string;
    // @ts-ignore
    public nearestWeekday: DaySpecificDef;
    // @ts-ignore
    public lastWeekdaySpecific: DaySpecificDef;

    // @ts-ignore
    public unspecified: string;
    // @ts-ignore
    public wildcard: string;
    // @ts-ignore
    public single: number;

    constructor(public rawData: string,
                public min: number,
                public max: number,
                public names?: string[],
                private indexBase?: number) {
        this.type = this.setType(rawData);
        switch(this.type) {
            case CONSTANTS.TYPE_MULTI:
                this.multi = this.getMultiDef(rawData);
                break;
            case CONSTANTS.TYPE_RANGE:
                this.range = this.getRangeDef(rawData);
                break;
            case CONSTANTS.TYPE_INTERVAL:
                this.interval = this.getIntervalDef(rawData);
                break;
            case CONSTANTS.TYPE_UNSPECIFIED:
                this.unspecified = this.getDef(rawData);
                break;
            case CONSTANTS.TYPE_WILDCARD:
                this.wildcard = this.getDef(rawData);
                break;
            case CONSTANTS.TYPE_SPECIFIC:
                this.specific = this.getSpecificDef(rawData);
                break;
            case CONSTANTS.TYPE_SINGLE:
                this.single = this.getSingleDef(rawData);
                break;
            case CONSTANTS.TYPE_LAST_DAY:
                this.lastDay = this.getDef(rawData);
                break;
            case CONSTANTS.TYPE_LAST_WEEKDAY_MONTH:
                this.lastWeekdayMonth = this.getDef(rawData);
                break;
            case CONSTANTS.TYPE_NEAREST_WEEKDAY:
                this.nearestWeekday = this.getDaySpecificDef(rawData);
                break;
            case CONSTANTS.TYPE_LAST_WEEKDAY_SPECIFIC:
                this.lastWeekdaySpecific = this.getDaySpecificDef(rawData);
                break;
        }
    }

    public setType(value: string): string {
        if (value.indexOf(CONSTANTS.COMA) > 0) {
            return CONSTANTS.TYPE_MULTI;
        } else if (value === CONSTANTS.WILDCARD) {
            return CONSTANTS.TYPE_WILDCARD;
        } else if (value === CONSTANTS.UNSPECIFIED) {
            return CONSTANTS.TYPE_UNSPECIFIED;
        } else if (value.indexOf(CONSTANTS.SLASH) > 0) {
            return CONSTANTS.TYPE_INTERVAL;
        } else if (value.indexOf(CONSTANTS.DASH) > 0) {
            return CONSTANTS.TYPE_RANGE;
        } else if (value.indexOf(CONSTANTS.SPECIFIC) > 0) {
            return CONSTANTS.TYPE_SPECIFIC;
        } else if (value === CONSTANTS.LAST_DAY) {
            return CONSTANTS.TYPE_LAST_DAY;
        } else if (value === CONSTANTS.LAST_WEEKDAY_MONTH) {
            return CONSTANTS.TYPE_LAST_WEEKDAY_MONTH;
        } else if (CONSTANTS.NEAREST_WEEKDAY.test(value)) {
            return CONSTANTS.TYPE_NEAREST_WEEKDAY;
        } else if (CONSTANTS.LAST_WEEKDAY_SPECIFIC.test(value)) {
            return CONSTANTS.TYPE_LAST_WEEKDAY_SPECIFIC;
        } else {
            return CONSTANTS.TYPE_SINGLE;
        }
    }

    private checkForNamed(value: string): number {
        return isNaN(parseInt(value)) ? this.getIndex(value) : parseInt(value);
    }

    private getMultiDef(value: string): MultiDef {
        let values = value.split(CONSTANTS.COMA).map(current => this.checkForNamed(current)),
            last = values.pop();

        // @ts-ignore
        return { values, last };
    }

    private getRangeDef(value: string): RangeDef {
        let range: number[] = value.split(CONSTANTS.DASH).map(current => this.checkForNamed(current));
        return {
            start: range[0],
            end: range[1]
        };
    }
    private getIntervalDef(value: string): IntervalDef {
        let interval = value.split(CONSTANTS.SLASH).map(current => this.checkForNamed(current));
        return {
            start: interval[0],
            step: interval[1]
        };
    }

    private getSpecificDef(value: string): SpecificDef {
        let specific = value.split(CONSTANTS.SPECIFIC).map(current => this.checkForNamed(current));
        return {
            week: specific[1],
            day: specific[0]
        }
    }

    private getDaySpecificDef(value: string): DaySpecificDef {
        let regex = /([0-9]?[0-9])[WL]/;
        // @ts-ignore
        return { day: parseInt(value.match(regex)[1]) };
    }

    private getDef(value: string): string {
        return value;
    }

    private getSingleDef(value: string): number {
        return this.checkForNamed(value);
    }

    private getIndex(value: string): number {
        // @ts-ignore
        return this.names.indexOf(value) + this.indexBase;
    }
}

export class CronExpression {
    // @ts-ignore
    private dissection: CronDissection;

    public seconds: UnitDefinition;
    public minutes: UnitDefinition;
    public hours: UnitDefinition;

    public dayOfMonth: UnitDefinition;
    public month: UnitDefinition;
    public dayOfWeek: UnitDefinition;
    public year: UnitDefinition;

    private cron: UnitDefinition[];

    [key: string]: any;

    constructor(private expressionString: string) {
        this.setDissection(expressionString);
        // @ts-ignore
        this.seconds = new UnitDefinition(this.dissection.seconds, 0, 59);
        // @ts-ignore
        this.minutes = new UnitDefinition(this.dissection.minutes, 0, 59);
        // @ts-ignore
        this.hours = new UnitDefinition(this.dissection.hours, 0, 23);

        // @ts-ignore
        this.dayOfMonth = new UnitDefinition(this.dissection.dayOfMonth, 1, 31);
        // @ts-ignore
        this.month = new UnitDefinition(this.dissection.month, 1, 12, CONSTANTS.SHORT_MONTHS, 0);
        // @ts-ignore
        this.dayOfWeek = new UnitDefinition(this.dissection.dayOfWeek, 1, 7, CONSTANTS.SHORT_DAYS, 1);
        // @ts-ignore
        this.year = this.dissection.year ? new UnitDefinition(this.dissection.year, 1970, 2099) : null;

        this.cron = [this.seconds, this.minutes, this.hours, this.dayOfMonth, this.month, this.dayOfWeek, this.year];
    }

    // @ts-ignore
    public isValid(): boolean {
        for (let unit of this.cron) {
            switch (unit.type) {
                case CONSTANTS.TYPE_SINGLE:
                    return this.validateSingle(unit);
                case CONSTANTS.TYPE_UNSPECIFIED:
                    return this.validateUnspecified(unit);
                case CONSTANTS.TYPE_WILDCARD:
                    return this.validateWildcard(unit);
                case CONSTANTS.TYPE_MULTI:
                    return this.validateMulti(unit);
                case CONSTANTS.TYPE_INTERVAL:
                    return this.validateInterval(unit);
                case CONSTANTS.TYPE_RANGE:
                    return this.validateRange(unit);
                case CONSTANTS.TYPE_SPECIFIC:
                    return this.validateSpecific(unit);
            }
        }
    }

    private validateSingle(unit: UnitDefinition): boolean {
        return unit.single >= unit.min && unit.single <= unit.max;
    }

    private validateUnspecified(unit: UnitDefinition): boolean {
        return unit.unspecified === CONSTANTS.UNSPECIFIED;
    }

    private validateWildcard(unit: UnitDefinition): boolean {
        return unit.wildcard === CONSTANTS.WILDCARD;
    }

    private validateMulti(unit: UnitDefinition): boolean {
        return unit.multi.values.every(value => value >= unit.min && value <= unit.max);
    }

    private validateInterval(unit: UnitDefinition): boolean {
        return unit.interval.start >= unit.min && unit.interval.start <= unit.max;
    }

    private validateRange(unit: UnitDefinition): boolean {
        return unit.range.start < unit.range.end && unit.range.start >= unit.min && unit.range.end <= unit.max;
    }

    private validateSpecific(unit: UnitDefinition): boolean {
        return unit.specific.day >= 1 && unit.specific.day <= 7 && unit.specific.week >= 1 && unit.specific.week <= 5;
    }

    public getKey(key: string): any {
        return this[key];
    }

    public setDissection(expression: string | CronDissection): void {
        if (!expression) {
            throw new Error('A valid cron expression or generated expression must be provided.');
        } else if (typeof expression === 'string') {
            let exprArray = expression.split(CONSTANTS.SEPARATOR);

            if (exprArray.length > 7 || exprArray.length < 6) {
                throw new Error(`Invalid cron expression: ${expression}. Wrong length: ${exprArray.length}.`);
            }

            this.dissection = {
                seconds: exprArray[0],
                minutes: exprArray[1],
                hours: exprArray[2],
                dayOfMonth: exprArray[3],
                month: exprArray[4],
                dayOfWeek: exprArray[5],
                year: exprArray[6]
            };
        } else {
            try {
                this.dissection = expression;
            } catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        }
    }

    public getDissection(): CronDissection {
        return this.dissection;
    }
}

class CronParser {

    public humanize(expression: string): string {
        let cron: CronExpression = new CronExpression(expression),
            order: string[] = ['month', 'dayOfWeek', 'year'];

        let result = `Запланировано на ${this.getTimeString(cron.seconds, cron.minutes, cron.hours)}`,
            dayOfMonth = this.getDayOfMonthString(cron.dayOfMonth);

        if (dayOfMonth.length > 0) {
            result += `, ${dayOfMonth}`;
        }

        if (cron.dayOfMonth.type != CONSTANTS.TYPE_WILDCARD && cron.dayOfMonth.type != CONSTANTS.TYPE_UNSPECIFIED &&
            (cron.month.type === CONSTANTS.TYPE_WILDCARD || cron.month.type === CONSTANTS.TYPE_UNSPECIFIED)) {
            result += ` каждого месяца`;
        }

        for (let key of order) {
            if (cron[key].type != CONSTANTS.TYPE_WILDCARD && cron[key].type != CONSTANTS.TYPE_UNSPECIFIED || key === 'dayOfWeek') {
                result += `, ${this.getString(key, cron[key])}`;
            }
        }

        return result + '.';
    }

    public getString(type: string, value: UnitDefinition) {
        switch(type) {
            case 'dayOfMonth':
                return this.getDayOfMonthString(value);
            case 'month':
                return this.getMonthString(value);
            case 'dayOfWeek':
                return this.getDayOfWeekString(value);
            case 'year':
                return this.getYearString(value);
            default:
                throw new Error('Something went wrong.');
        }
    }

    public getTimeString(seconds: UnitDefinition, minutes: UnitDefinition, hours: UnitDefinition): string {
        if (seconds.type === CONSTANTS.TYPE_SINGLE && minutes.type === CONSTANTS.TYPE_SINGLE && hours.type === CONSTANTS.TYPE_SINGLE) {
            return `${this.padZero(hours.single)}:${this.padZero(minutes.single)}${seconds.single === 0 ? '' : ':' + this.padZero(seconds.single)}`;
        } else if (seconds.type === CONSTANTS.TYPE_WILDCARD && minutes.type === CONSTANTS.TYPE_WILDCARD && hours.type === CONSTANTS.TYPE_WILDCARD) {
            return 'каждую секунду';
        } else if (seconds.type === CONSTANTS.TYPE_INTERVAL && minutes.type === CONSTANTS.TYPE_WILDCARD) {
            return `${this.getSecondsString(seconds)}, ${this.getHoursString(hours)}`
        } else {
            return `${this.getSecondsString(seconds)}, ${this.getMinutesString(minutes)}, ${this.getHoursString(hours)}`;
        }
    }

    public getSecondsString(seconds: UnitDefinition): string {
        switch(seconds.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'каждую секунду';
            case CONSTANTS.TYPE_UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `каждую секунду с ${seconds.range.start} по ${seconds.range.end}`;
            case CONSTANTS.TYPE_MULTI:
                return `в ${seconds.multi.values.join(', ')} и ${seconds.multi.last} секунд`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = seconds.interval.step === 1;
                return `каждые ${isOne ? '' : seconds.interval.step + ' '}секунд${seconds.interval.start === 0 ? '' : ' начиная с ' + seconds.interval.start}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `в ${seconds.single} секунду`;
        }
    }

    public getMinutesString(minutes: UnitDefinition) {
        switch(minutes.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'каждую минуну';
            case CONSTANTS.TYPE_UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `каждую минуту с ${minutes.range.start} по ${minutes.range.end}`;
            case CONSTANTS.TYPE_MULTI:
                return `в определенные минуты ${minutes.multi.values.join(', ')} и ${minutes.multi.last}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = minutes.interval.step === 1;
                return `каждую ${isOne ? '' : minutes.interval.step + this.getOrdinal(minutes.interval.step) + ' '}минуту${minutes.interval.start === 0 ? '' : ' начиная с ' + minutes.interval.start} минуты`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `в ${minutes.single} минут`;
        }
    }

    public getHoursString(hours: UnitDefinition) {
        switch(hours.type) {
            case CONSTANTS.TYPE_WILDCARD:
            case CONSTANTS.TYPE_UNSPECIFIED:
                return 'каждый час';
            case CONSTANTS.TYPE_RANGE:
                return `каждый час с ${this.pad(hours.range.start)} по ${this.pad(hours.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `в часы -  ${hours.multi.values.map(this.pad).join(', ')} и ${this.pad(hours.multi.last)}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = hours.interval.step === 1;
                return `past every ${isOne ? '' : hours.interval.step + this.getOrdinal(hours.interval.step) + ' '}hour starting at ${this.pad(hours.interval.start)}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `в ${this.pad(hours.single)} часов`;
        }
    }

    private getOrdinal(value: number): string {
        let numString = value.toString();
        switch (parseInt(numString[numString.length - 1])) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    private pad(value: number | string): string {
        let converted = typeof value === 'number' ? value.toString() : value;

        return converted.length === 1 ?
            `0${value}:00` :
            `${value}:00`;
    }

    private padZero(value: number | string): string {
        let converted = typeof value === 'number' ? value.toString() : value;

        return converted.length === 1 ?
            `0${value}` :
            `${value}`;
    }

    public getDayOfMonthString(dayOfMonth: UnitDefinition) {
        switch(dayOfMonth.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return '';
            case CONSTANTS.TYPE_UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `с ${dayOfMonth.range.start + this.getOrdinal(dayOfMonth.range.start)} по ${dayOfMonth.range.end + this.getOrdinal(dayOfMonth.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `в течение ${dayOfMonth.multi.values.map(this.getOrdinal).join(', ')} и ${dayOfMonth.multi.last}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = dayOfMonth.interval.step === 1;
                return `every ${isOne ? '' : dayOfMonth.interval.step + ' '}day${isOne ? '' : 's'} starting on the ${dayOfMonth.interval.start + this.getOrdinal(dayOfMonth.interval.start)}`;
            case CONSTANTS.TYPE_NEAREST_WEEKDAY:
                return `в будний день, ближайший к ${dayOfMonth.nearestWeekday.day}-му дню месяца`;
            case CONSTANTS.TYPE_LAST_WEEKDAY_MONTH:
                return `в последний будний день месяца`;
            case CONSTANTS.TYPE_LAST_DAY:
                return `в послдений день месяца`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `в ${dayOfMonth.single + this.getOrdinal(dayOfMonth.single)} день месяца`
        }
    }

    public getYearString(years: UnitDefinition) {
        switch(years.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'каждый год';
            case CONSTANTS.TYPE_UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `с ${years.range.start} по ${years.range.end}`;
            case CONSTANTS.TYPE_MULTI:
                return `с ${years.multi.values.join(', ')} по ${years.multi.last}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = years.interval.step === 1;
                return `каждый ${isOne ? '' : years.interval.step + ' '}год${isOne ? '' : 's'} начиная с ${years.interval.start}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `в течение ${years.single} года`;
        }
    }

    public getMonthString(months: UnitDefinition): string {
        switch(months.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'каждый месяц';
            case CONSTANTS.TYPE_UNSPECIFIED:
                return '';
            case CONSTANTS.TYPE_RANGE:
                return `в месяцы с ${this.getMonthName(months.range.start)} по ${this.getMonthName(months.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `в месяцы: ${months.multi.values.map(this.getMonthName).join(', ')} и ${this.getMonthName(months.multi.last)}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = months.interval.step === 1;
                return `каждый ${isOne ? '' : months.interval.step + ' '}месяц${isOne ? '' : 's'} начиная с ${this.getMonthName(months.interval.start)}`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `в ${this.getMonthName(months.single)} месяце`;
        }
    }

    public getMonthName(month: number): string {
        return CONSTANTS.FULL_MONTHS[month];
    }

    public getDayOfWeekString(days: UnitDefinition): string {
        switch(days.type) {
            case CONSTANTS.TYPE_WILDCARD:
                return 'каждый день';
            case CONSTANTS.TYPE_UNSPECIFIED:
                return 'каждый день';
            case CONSTANTS.TYPE_RANGE:
                return `с ${this.getDayOfWeekName(days.range.start)} по ${this.getDayOfWeekName(days.range.end)}`;
            case CONSTANTS.TYPE_MULTI:
                return `только в ${days.multi.values.map(this.getDayOfWeekName).join(', ')} и ${this.getDayOfWeekName(days.multi.last)}`;
            case CONSTANTS.TYPE_INTERVAL:
                let isOne = days.interval.step === 1;
                return `каждый ${isOne ? '' : days.interval.step + ' '}день${isOne ? '' : 's'} начиная с ${this.getDayOfWeekName(days.interval.start)}`;
            case CONSTANTS.TYPE_SPECIFIC:
                return `в ${days.specific.week + this.getOrdinal(days.specific.week)} ${this.getDayOfWeekName(days.specific.day)} день месяца`;
            case CONSTANTS.TYPE_LAST_WEEKDAY_SPECIFIC:
                return `с последний ${this.getDayOfWeekName(days.lastWeekdaySpecific.day)} месяца`;
            case CONSTANTS.TYPE_LAST_DAY:
                return `с подледнее воскресенье месяца`;
            case CONSTANTS.TYPE_SINGLE:
            default:
                return `по ${this.getDayOfWeekName(days.single)}ам`;
        }
    }

    public getDayOfWeekName(day: number): string {
        return CONSTANTS.FULL_DAYS[day - 1];
    }
}

const CronHumanize = new CronParser();
export default CronHumanize;