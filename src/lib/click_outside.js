// thanks again, lihautan

export default function click_outside(el, cb) {
    let first_clicked = false;

    function on_click(ev) {
        if (!first_clicked) {
            first_clicked = true;
            return;
        }
        if (!el.contains(ev.target)) {
            cb(ev);
        }
    }

    document.body.addEventListener('click', on_click);

    return {
        update(new_cb) {
            cb = new_cb;
        },
        destroy() {
            document.body.removeEventListener('click', on_click);
        }
    };
}
