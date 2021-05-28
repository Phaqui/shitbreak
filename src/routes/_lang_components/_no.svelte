<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let value = "nb";

  $: on_selected_change(value);

  function on_selected_change(value: string) {
    dispatch('subtagchange', { value });
  }

  onMount(() => {
    dispatch('subtagchange', { value });
  });
</script>

<br />
Norsk
<span class:active={value === 'nb'} on:click={() => value = 'nb'}>bokmål</span>
eller
<span class:active={value === 'nn'} on:click={() => value = 'nn'}>Nynorsk</span>

<style>
  span {
    border: 1px solid gray;
  }

  span.active {
    border: 1px solid red;
  }
</style>
