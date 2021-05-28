<script lang="ts">
  import { onMount } from 'svelte';
  import { format_duration } from '$lib/dt_utils';

  let shit_entries;
  let currency;

  onMount(async () => {
    let shits_mod = await import('$lib/stores/shit_entries');
    let salary_module = await import('$lib/stores/salary');
    shit_entries = shits_mod.shit_entries;
    currency = salary_module.currency;
  });

  let current_year = (new Date(Date.now())).getFullYear();
</script>

<p>Some stats n shit</p>

{#if shit_entries}
  <p>Summary so far for {current_year}</p>
  {#await shit_entries.get_yearly_total(current_year)}
    <p>...</p>
  {:then yearly_total}
    <p>Time spent on the head: {format_duration(yearly_total.duration)}</p>
    <p>Total earnings: {yearly_total.earnings} {$currency}</p>
  {:catch err}
    <p>{err}</p>
  {/await}
{/if}
