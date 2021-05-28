<script lang="ts">
  import Select from '$lib/Select.svelte';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';

  let ready = false;

  // locale store, will be set on onMount since it depends on `window`
  // TODO maybe type it (it's a sort of custom store, the "Locale" type
  // from the store
  // TODO ALSO maybe don't dynamically import it (will require guarding agaisnt
  // being run on the server more explicitly inside - the reason why
  // it's loaded onMount here is because the store depends on (reads and writes)
  // localstorage
  let locale: any;

  // map over "sub components" that we have already loaded
  // (since we load them async)
  const components: Map<string, any> = new Map<string, any>();
  components.set('en', null);
  components.set('no', null);

  // by default, the selected language starts out as unspecified,
  // (will be auto-detected)
  let selected_language = undefined;

  onMount(async () => {
    const lang_module = await import('$lib/stores/lang');
    locale = lang_module.locale;
    ready = true;
  });

  async function component_for_lang(lang: any) {
    lang = lang.value;
    const component = components.get(lang);
    if (component === undefined) {
      throw Error('lang not supported: ' + lang);
    }
    if (component !== null) {
      return component;
    }
    const module = await import(`./_lang_components/_${lang}.svelte`);
    components.set(lang, module.default);
    return module.default;
  }

  function on_lang_change(ev: any) {
    const selected = ev.detail.new_value;
    console.log(selected);
    if (selected === selected_language) {
      // the event is "on change", so it shouldn't fire an event for when
      // it "changes to the same"... right?
      throw Error("unreachable!");
    }

    selected_language = selected;
    if (selected === "") {
      $locale = "";
    }
  }

  function on_subtagchange(ev: any) {
    const subtag = ev.detail.value;
    $locale = selected_language + '-' + subtag;
  }

  const LANG_OPTIONS = [
    { value: "en", text: "English" },
    { value: "no", text: "Norwegian" },
  ];
</script>

<div class="header">Language and locale:</div>
<blockquote>
  <span class="info">i</span>Language determines how dates are formatted.
</blockquote>

<div class="box">
</div>
{#if !ready}
  DOM HASN'T LOADED YET
{:else}
  {#if !browser}
    (... waiting)
  {:else}
    {$locale.humanreadable} ({$locale.raw})
  {/if}
{/if}
{#if browser && ready && $locale.autodetected}(auto-detected){/if}

Language:
{#if browser}
  <Select
    value={selected_language}
    on:change={on_lang_change}
    options={LANG_OPTIONS}
    unspecified_value="(use detected language)"
  >
    <span slot="dropdown" class="dropdown" let:value>
      <span>{value.text || value}</span>
      <span class="indicator">
        <svg viewBox="0 0 100 100">
          <rect x="0" y="0" width="100" height="100" fill="#3c251c" />
          <line x1="20" y1="40" x2="50" y2="60" stroke="#e93a03" stroke-width="7" />
          <line x1="50" y1="60" x2="80" y2="40" stroke="#e93a03" stroke-width="7" />
        </svg>
      </span>
    </span>

    <span slot="element" let:optionvalue={optval} class="dropdown-element">
      {optval.text}
    </span>
  </Select>

  <!--
  <select on:change={on_lang_change} value={selected_language}>
    <option value="">(use detected language)</option>
    <option value="en">English</option>
    <option value="no">Norwegian</option>
  </select>
  -->
{/if}

{#if browser && ready && selected_language !== '(use detected language)'}
  {#await component_for_lang(selected_language) then component}
    <svelte:component on:subtagchange={on_subtagchange} this={component} />
  {/await}
{/if}

Currency:
{#if browser}
  currency goes here
{/if}

<style>
  span.info {
    color: #131e13;
    background-color: #307130;
    font-size: 0.9em;
    font-weight: bold;
    border: 2px solid #307130;
    border-radius: 50%;
    padding: 0 0.5em;
    margin-right: 0.5em;
  }
  div.header {
    font-size: 1.2em;
  }
  blockquote {
    border: 1px solid #d4623e;
    border-radius: 4px;
    padding: 0.7em;
    margin: 0.4em auto;
    background-color: #33312e;
  }

  span.dropdown {
    display: flex;
    border: 1px solid #ff3e00;
    background-color: #3c251c;
    color: #e93a03;
    width: 100%;
  }

  span.dropdown > span:first-child {
    padding: 6px;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  span.dropdown > span.indicator {
    margin-left: auto;
    margin-right: 0.5em;
    height: 2em;
    width: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span.dropdown-element {
    color: #e93a03;
    cursor: pointer;
    padding: 6px;
    width: 100%;
    background-color: #3c251c;
    transition: background-color 0.15s ease-out;
  }

  span.dropdown-element:hover {
    transition: background-color 0.15s ease-out;
    background-color: #326b42;
  }
</style>
