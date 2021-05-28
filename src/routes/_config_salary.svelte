<script lang="ts">
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import NewRuleModal from './_config_salary_newrulemodal.svelte';

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

<div class="header">Salary</div>
Currency:
<select>
  <option>(select a currency...)</option>
  <option>USD</option>
  <option>NOK</option>
</select>

<br />

<span id="hourly">
  <span>Hourly salarly (gross)</span>
{#if browser && ready}
  <input type="text" id="hourly" bind:value={$hourly}>
{/if}
</span>

<button on:click={() => newrule_modal = true}>Add salary rule</button>

<p>Additional evening/weekend pay</p>
<p>When</p>
<p>Time interval</p> <p>From 1600</p> to <p>1800</p>
<p>All</p><p>
<p>Change:</p>
<p>+ X CURRENCY / %</p>

<style>
  div.header {
    font-size: 1.2em;
  }
  input#hourly {
    width: 2em;
  }

  span#hourly {
    width: 100%;
    display: flex;
    align-items: center;
  }
  span#hourly input { margin-left: auto; }
</style>
