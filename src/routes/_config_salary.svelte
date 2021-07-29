<script lang="ts">
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import NewRuleModal from './_config_salary_newrulemodal.svelte';
  import ConfigContainer from './_config_container.svelte';

  let ready = false;

  // store
  let hourly, currency, locale;

  let newrule_modal = false;

  onMount(async () => {
    const salary_module = await import('$lib/stores/salary');
    const lang_module = await import('$lib/stores/lang');
    hourly = salary_module.hourly;
    currency = salary_module.currency;
    locale = lang_module.locale;
    ready = true;
  });

  function handle_new_rule(ev) {
    console.log(ev.detail);
  }
</script>

{#if newrule_modal}
  <NewRuleModal
    on:add={handle_new_rule}
    on:close={() => newrule_modal = false}
  />
{/if}

<ConfigContainer title="Salary">
  <span id="hourly">
    <span>Hourly base salarly (gross)</span>
  {#if browser && ready}
    <input type="text" id="hourly" bind:value={$hourly}>
  {/if}
  </span>
  <button on:click={() => newrule_modal = true}>Add salary rule</button>
</ConfigContainer>

<style>
  input#hourly {
    width: 2em;
  }

  span#hourly {
    width: 100%;
    display: flex;
    align-items: center;
  }
  span#hourly input { margin-left: auto; }

  button {
    width: 100%;
  }
</style>
