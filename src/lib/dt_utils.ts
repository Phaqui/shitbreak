// takes a number in seconds, and outputs a string
// such as e.g. "2 hours 35 minutes 55 seconds"
export function format_duration(
    duration: number,
    {
        hour_str_plural,
        hour_str_singular,
        min_str_plural,
        min_str_singular,
        sec_str_plural,
        sec_str_singular,
    }: {
        hour_str_plural: string;
        hour_str_singular: string;
        min_str_plural: string;
        min_str_singular: string;
        sec_str_plural: string;
        sec_str_singular: string;
    } = {
        hour_str_plural: " hours",
        hour_str_singular: " hour",
        min_str_plural: " minutes",
        min_str_singular: " minute",
        sec_str_plural: " seconds",
        sec_str_singular: " second",
    }
) {
    const hours = Math.floor(duration / 3600);
    duration -= hours * 3600;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    const have_hrs = hours > 0;
    const have_mins = minutes > 0;
    const have_secs = seconds > 0;

    let s = "";
    if (have_hrs) {
        const hour_str = hours === 1 ? hour_str_singular : hour_str_plural;
        s += `${Math.round(hours)}${hour_str}`;
    }
    if (have_mins) {
        if (have_hrs) s += ' ';
        const min_str = minutes === 1 ? min_str_singular : min_str_plural;
        s += `${Math.round(minutes)}${min_str}`;
    }
    if (have_secs) {
        if (have_hrs || have_mins) s += ' ';
        const sec_str = seconds === 1 ? sec_str_singular : sec_str_plural;
        s += `${Math.round(seconds)}${sec_str}`;
    }

    // if s is still "", then we don't have anything
    if (s === "") {
        s = `0${sec_str_plural}`;
    }

    return s;
}
