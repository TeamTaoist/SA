import { useEffect } from "react";
import PubSub from "pubsub-js";

export default function useSubcribe(event: string, callback: (message: string, data?: any) => void) {
    useEffect(() => {
        event && PubSub.unsubscribe(event);
        PubSub.subscribe(event, callback);
    }, [event, callback]);

    useEffect(() => {
        return () => {
            PubSub.unsubscribe(event);
        };
    }, []);
}
