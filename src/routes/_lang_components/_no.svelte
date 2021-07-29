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

<div>
  <span class:active={value === 'nb'} on:click={() => value = 'nb'}>Bokmål</span>
  <span class:active={value === 'nn'} on:click={() => value = 'nn'}>Nynorsk</span>
</div>

<style>
  div {
    margin-top: 0.5em;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  span {
    cursor: pointer;
    display: inline-block;
    padding: 10px;
    border: 1px solid #ff3e00;
    border-radius: 6px;
  }

  span.active {
    background-color: #3c251c;
  }
</style>
