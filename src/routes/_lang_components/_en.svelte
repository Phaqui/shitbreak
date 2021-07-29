<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import Select from '$lib/Select.svelte';

  let value = "US";
  let langs = ["United States", "Great Britain"];

  function on_change(ev: any) {
    dispatch('subtagchange', { value });
  }

  onMount(() => {
    dispatch('subtagchange', { value });
  });
</script>

<br />
...as spoken in...<br />
<Select
  {value}
  on:change={on_change}
  options={langs}
/>
