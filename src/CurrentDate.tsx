import { useMemo } from "react";

type CurrentDateProps = {
    dt: number;
    timezone: number;
};

export function CurrentDate({ dt, timezone }: CurrentDateProps) {
    const cityDate = useMemo(() => new Date((dt + timezone) * 1000), [dt, timezone]);

    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
    }).format(cityDate);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(cityDate);

    return (
        <div>
            <span className='date'>{dayOfWeek}, </span>
            <span className='date'>{formattedDate}</span>
        </div>
    );
}
