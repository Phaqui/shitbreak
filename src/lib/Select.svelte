<script lang="ts">
  import Select from '$lib/BaseSelect.svelte';

  export let value;
  export let options;
  export let key = null;
</script>

<Select
  bind:value
  on:change
  bind:options
>
  <span slot="dropdown" class="dropdown" let:value>
    <span>
      {key && value[key] || value}
    </span>
    <span class="indicator">
      <svg viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" fill="#3c251c" />
        <line x1="20" y1="40" x2="50" y2="60" stroke="#e93a03" stroke-width="7" />
        <line x1="50" y1="60" x2="80" y2="40" stroke="#e93a03" stroke-width="7" />
      </svg>
    </span>
  </span>

  <span slot="element" let:optionvalue={optval} class="dropdown-element">
    {key && optval[key] || optval}
  </span>

  <svelte:fragment slot="native_select_slot" let:optionvalue={optval}>
    <option value={key && optval[key] || optval}>
      {key && optval[key] || optval} 
    </option>
  </svelte:fragment>
</Select>

<style>
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
