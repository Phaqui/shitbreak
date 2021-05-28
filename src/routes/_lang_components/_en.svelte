<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let value = "US";

  function on_selected_change(
    ev: Event & { target: EventTarget & HTMLSelectElement }
  ) {
    dispatch('subtagchange', { value: ev.target.value });
  }

  onMount(() => {
    dispatch('subtagchange', { value });
  });
</script>

<br />
English as spoken in...<br />
<select {value} on:change={on_selected_change}>
  <option value="US">United States</option>
  <option value="GB">United Kingdom</option>
</select>
