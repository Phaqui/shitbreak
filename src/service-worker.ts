import { build } from '$service-worker';

self.addEventListener('message', (ev) => {
    const msgPort: MessagePort = ev.data.port;
    const { title } = ev.data;
    //new Notification(title);
    try {
        //new Notification(title);
        msgPort.postMessage("OK");
    } catch (err) {
        msgPort.postMessage(err);
    }
});

