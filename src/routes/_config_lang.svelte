<script lang="ts">
  import { browser } from '$app/env';

  import ConfigContainer from './_config_container.svelte';
  import { locale } from '$lib/stores/lang';
  import Select from '$lib/Select.svelte';

  // map over "sub components" that we have already loaded
  // (since we load them async)
  const components: Map<string, any> = new Map<string, any>();
  components.set('en', null);
  components.set('no', null);

  async function component_for_lang(lang: any) {
    if (lang === "") {
      throw new Error('component_for_lang(): lang === ""');
    }
    if (lang.includes('-')) {
      lang = lang.split('-')[0];
    }
    const component = components.get(lang);
    if (component === undefined) {
      throw Error(`component_for_lang(): lang ('${lang}') not in map!`);
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
    console.log("on_lang_change() called");
    console.log($locale.lang);
    console.log("on_lang_change(): setting $locale to", selected.value);
    $locale = selected.value;
    console.log("on_lang_change(): done");
  }

  function on_subtagchange(ev: any) {
    const subtag = ev.detail.value;
    //$locale = $locale.lang + '-' + subtag;
  }

  const LANG_OPTIONS = [
    { value: "", text: "Use detected: English (US)" },
    { value: "en", text: "English" },
    { value: "no", text: "Norwegian" },
  ];
</script>

<ConfigContainer title="Language">
  {#if browser}
    <Select
      key={'text'}
      value={LANG_OPTIONS.find(lang => lang.value === $locale.lang)}
      on:change={on_lang_change}
      options={LANG_OPTIONS}
    />

    {#if $locale.lang !== ""}
      {#await component_for_lang($locale.lang) then component}
        <svelte:component this={component} on:subtagchange={on_subtagchange} />
      {/await}
    {/if}
  {/if}
</ConfigContainer>

<ConfigContainer title="Date format">
  <blockquote>
    <span class="info">i</span>Countries have different way of writing dates.
  </blockquote>
  <div class="spacer"></div>
  {#if browser}
    <Select
      value="United States"
      options={["United States", "England"]}
    />
  {/if}
</ConfigContainer>

<ConfigContainer title="Currency">
  {#if browser}
    <Select
      value={"(none used)"}
      on:change={() => undefined}
      options={["(none used)", "USD", "NOK"]}
    />
  {/if}
</ConfigContainer>

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

  blockquote {
    border: 1px solid #d4623e;
    border-radius: 4px;
    padding: 0.7em;
    margin: 0.4em auto;
    background-color: #33312e;
  }

  div.spacer {
    margin-bottom: 0.5em;
  }
</style>
