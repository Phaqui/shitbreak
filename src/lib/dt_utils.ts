// takes a number in seconds, and outputs a string
// such as e.g. "2 hours 35 minutes 55 seconds"
export function format_duration(
    duration: number,
    {
        hour_str,
        min_str,
        sec_str,
    }: {
        hour_str: string;
        min_str: string;
        sec_str: string;
    } = {
        hour_str: " hours",
        min_str: " minutes",
        sec_str: " seconds",
    }
) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    const have_hrs = hours > 0;
    const have_mins = minutes > 0;
    const have_secs = seconds > 0;


    let s = "";
    if (have_hrs) {
        s += `${Math.round(hours)}${hour_str}`;
    }
    if (have_mins) {
        if (have_hrs) s += ' ';
        s += `${Math.round(minutes)}${min_str}`;
    }
    if (have_secs) {
        if (have_mins) s += ' ';
        s += `${Math.round(seconds)}${sec_str}`;
    } else {
        s = `0${sec_str}`;
    }

    return s;
}
