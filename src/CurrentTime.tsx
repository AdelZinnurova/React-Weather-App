import {useEffect, useState} from "react";

type CurrentTimeProps = {
    timezoneOffsetSec?: number | null
};

export function CurrentTime({ timezoneOffsetSec }: CurrentTimeProps) {
    const [now, setNow] = useState<number>(Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (timezoneOffsetSec == null) return null;

    const cityDate = new Date(now + timezoneOffsetSec * 1000);

    const timeStr = new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        hour12: true,
    }).format(cityDate);

    return <h2 className='time'>{timeStr}</h2>;
}
