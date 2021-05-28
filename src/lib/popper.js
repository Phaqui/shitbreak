// thank you, lihautan
// svelte.dev/repl/6ef53f4882324d21a14f49ec68cf60f7?version=3.37.0

import { createPopper } from '@popperjs/core';

export default function create_popper_action() {
    let popper_el, popper_tooltip, popper_params;
    let popper;

    function init_popper() {
        if (popper_el && popper_tooltip) {
            popper = createPopper(popper_el, popper_tooltip, popper_params);
        }
    }

    function destroy_popper() {
        if (popper) {
            popper.destroy();
            popper = null;
        }
    }

    function usePopperElement(el) {
        popper_el = el;
        init_popper();
        return {
            destroy() {
                popper_el = null;
                destroy_popper();
            }
        }
    }

    function usePopperTooltip(el, params) {
        popper_tooltip = el;
        popper_params = params;
        init_popper();
        return {
            update(new_params) {
                popper_params = new_params;
                popper.setOptions(popper_params);
            },
            destroy() {
                popper_tooltip = null;
                destroy_popper();
            }
        }
    }

    return [usePopperElement, usePopperTooltip];
}
