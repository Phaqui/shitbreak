/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
    interface HTMLAttribute<T> {
        onbeforeinstallprompt?: (event: any) => any;
    }
}
