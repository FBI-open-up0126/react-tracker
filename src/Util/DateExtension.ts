declare global {
    interface Date {
        toInputDateString: () => string;
        inputDateToLocalDate: () => Date;
    }
}

Date.prototype.toInputDateString = function () {
    return toDateString(this);
};
Date.prototype.inputDateToLocalDate = function () {
    return inputDateToLocalDate(this);
};

function toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function inputDateToLocalDate(date: Date): Date {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    );
}

export {};
