<script lang="typescript">
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import { browser } from '$app/env';
  export let value: any;
  export let unspecified_value: boolean | string = false;
  export let options: Array<any> = [];

  let selected = value !== undefined ? options.findIndex(opt => value == opt) : (unspecified_value !== false ? -1 : 0);
  let open = false;
  let outerwrapper: HTMLElement;

  let native_select: HTMLSelectElement;

  // unspecified value, should be null instead of empty string?
  $: value = selected === -1 ? unspecified_value : options[selected];

  const is_mobile = browser && window.screen.width < 768;

  onMount(() => {
    if (is_mobile) {
      native_select.style.display = 'block';
    }
  });


  function on_select_change(i: number) {
    selected = i;

    let new_value;
    if (i === -1) {
      if (unspecified_value !== false) {
        new_value = unspecified_value;
      } else {
        new_value = "(not specified)";
      }
    } else {
      new_value = options[i];
    }
    dispatch('change', { new_value });
  }

  function on_native_select_change() {
    const new_val = native_select.value;
    const idx = options.findIndex(opt => opt === new_val);
    if (idx === -1) {
      console.log("error...");
    } else {
      selected = idx;
    }
  }

  // ## warning: dirty, hacky, flithy, nasty code ahead...
  // okay, so.. when open_dropdown() is called and I register the body
  // for a "click" event, that very same click that triggered the open_dropdown()
  // function to be called in the first place will also the trigger the
  // event listener that we register in that function... so, as a workaround:
  // in the open_dropdown() function, when we register a "once" click handler
  // (which, as just stated, will be executed immediately from the same click that),
  // and in _that_ event handler, we set up the real handler (which itself will _not_
  // also react to the one same click that the event listener setup in open_dropdown()
  // reacted to immediately
  // So by this time, we now have "1 global click once"-function that has already run,
  // and IT has set up another "1 global click once"-function, whose job it is to
  // simply set open = false; on the next click, to close the dropdown on any click
  // the user clicks after the initial click that opened up the dropdown in the first
  // place
  function open_dropdown() {
    if (is_mobile || open) return;
    open = true;
    document.body.addEventListener(
      'click', 
      () => document.body.addEventListener(
        'click',
        () => open = false,
        { once: true }
      ),
      { once: true }
    );
  }
</script>

<span id="outer-wrapper" bind:this={outerwrapper}>
  <span id="dropdown" on:click={open_dropdown}>
    <select id="native_select" bind:this={native_select} on:change={on_native_select_change}>
      {#each options as opt}
        <option value={opt}>{opt}</option>
      {/each}
    </select>
    <slot name="dropdown" value={value}>
      <span class:unspecified={unspecified_value !== false && selected === -1}>{value}</span>
      <span class="indicator">
        <svg viewBox="0 0 100 100">
          <rect x="0" y="0" width="100" height="100" fill="rgb(40, 45, 215)" />
          <line x1="20" y1="40" x2="50" y2="60" stroke="rgb(230, 230, 230)" stroke-width="7" />
          <line x1="50" y1="60" x2="80" y2="40" stroke="rgb(230, 230, 230)" stroke-width="7" />
        </svg>
      </span>
    </slot>
  </span>

  <div class:open id="dropdown-wrapper">
    {#if unspecified_value !== false}
      <span on:click={() => on_select_change(-1)} class="dropdown-element unspecified">{unspecified_value}</span>
    {/if}
    {#each options as opt, i}
      {#if $$slots.element}
        <span style="display: inherit;" on:click={() => on_select_change(i)}>
          <slot name="element" optionvalue={opt} />
        </span>
      {:else}
        <span on:click={() => selected = i} class="dropdown-element">{opt}</span>
      {/if}
    {/each}
  </div>
</span>

<style>
  #outer-wrapper {
    position: relative;
  }

  #native_select {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    display: none;
  }

  #dropdown {
    /*border: 1px solid gray;*/
    background-color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: black;
  }

  #dropdown > span:first-child {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  #dropdown > span.indicator {
    margin-left: auto;
    height: 0.8em;
    width: 0.8em;
    font-size: 2.5em;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div#dropdown-wrapper {
    width: 100%;
    position: absolute;
    display: none;
  }

  #dropdown-wrapper.open {
    display: flex;
    flex-direction: column;
  }

  .dropdown-element {
    color: black;
    padding: 6px;
    cursor: pointer;
    background-color: white;
    transition: background-color 0.10s ease-out;
  }
  .dropdown-element:hover {
    background-color: rgb(80, 80, 200);
    transition: background-color 0.15s ease-out;
  }

  span.unspecified {
    font-style: italic;
    color: black;
  }
  /* probably won't need both of these, if I just cascade it correctly */
  .dropdown-element.unspecified {
    font-style: italic;
    color: gray;
  }
</style>
