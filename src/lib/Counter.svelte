<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import { format_duration } from '$lib/dt_utils';

  export let enabled = false;

  let start_time;

  let timer = null;
  let elapsed = 0;

  onMount(async () => {
    let timer_module = await import('$lib/stores/timer');
    start_time = timer_module.start_time;

    if ($start_time !== null) {
      interval();
      timer = window.setInterval(interval, 1000);
    }
  });

  onDestroy(() => {
    if (timer) window.clearInterval(timer);
  });

  const format_duration_opts = {
    hour_str_singular: 'h', hour_str_plural: 'h',
    min_str_singular: 'm', min_str_plural: 'm',
    sec_str_singular: 's', sec_str_plural: 's',
  };
  $: elapsed_printable = format_duration(elapsed / 1000, format_duration_opts);

  function interval() {
    elapsed = Date.now() - $start_time;
  }

  function on_click() {
    if (!enabled) {
      return;
    }

    if ($start_time !== null) {
      elapsed = Date.now() - $start_time;
      window.clearInterval(timer);
      timer = null;
      dispatch('ended', { elapsed: elapsed });
      $start_time = null;
    } else {
      elapsed = 0;
      dispatch('started');
      timer = window.setInterval(interval, 1000);
      $start_time = Date.now();
    }
  }
</script>

<button disabled={!enabled} on:click={on_click}>
  {#if $start_time === null}
    Start shit break
  {:else}
    On shitbreak for {elapsed_printable}
  {/if}
</button>

<style>
	button {
		font-family: inherit;
		font-size: 1.1rem;
		padding: 1em 2em;
		color: #ff3e00;
		background-color: rgba(255, 62, 0, 0.1);
		border-radius: 2em;
		border: 2px solid #ff3e00;
		outline: none;
    text-shadow: 0 0 30px rgb(0, 0, 0);
		width: 300px;
		height: 60px;
		font-variant-numeric: tabular-nums;
    font-variant: small-caps;
    letter-spacing: 1px;
    box-shadow:
      0 0 60px 30px rgba(64, 37, 10, 0.46),
      4px 4px 10px 4px #261911;
	}

	button:hover {
		border: 3px solid #ff3e00;
	}

	button:active {
		background-color: rgba(255, 62, 0, 0.2);
	}

  button:disabled {
    filter: grayscale(1.0);
  }
</style>
