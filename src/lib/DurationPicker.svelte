<script lang="ts">
  import click_outside from '$lib/click_outside';
  import create_popper_action from '$lib/popper';

  export let showSeconds: boolean = true;

  // 5 hours, by default this component is used for the duration
  // of a shit, but I'm also using it for setting the time
  export let numHours = 5;

  export let hr = 0;
  export let min = 0;
  export let sec = 0;

  let hr_tooltip_visible = false,
      min_tooltip_visible = false,
      sec_tooltip_visible = false;
  const [hr_el, hr_tooltip] = create_popper_action();
  const [min_el, min_tooltip] = create_popper_action();
  const [sec_el, sec_tooltip] = create_popper_action();

  function close_hr_tooltip(ev: any) {
    ev.stopPropagation();
    hr_tooltip_visible = false;
  }

  function close_min_tooltip(ev: any) {
    ev.stopPropagation();
    min_tooltip_visible = false;
  }

  function close_sec_tooltip(ev: any) {
    ev.stopPropagation();
    sec_tooltip_visible = false;
  }

  // The options that we pass to the tooltips
  const tooltip_opts = {
    placement: 'top-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -100]
        }
      }
    ]
  };

  function leadingzero(i: number) {
    if (i < 10) {
      return '0' + i;
    } else {
      return i;
    }
  }
</script>


<table>
  <thead>
    <tr>
      <td>Hours</td>
      <td></td>
      <td>Minutes</td>
      {#if showSeconds}
        <td></td>
        <td>Seconds</td>
      {/if}
    </tr>
  </thead>

  <tbody>
    <tr>
      <td
        use:hr_el
        on:click={() => hr_tooltip_visible = true}
      >
        {#if !hr_tooltip_visible}
          {leadingzero(hr)}
        {:else}
          <div
            class="popper-tooltip"
            class:small={numHours < 24}
            use:hr_tooltip={{ placement: 'top-start' }}
            use:click_outside={close_hr_tooltip}
          >
            {#each { length: numHours } as _, i}
              <span on:click={ev => { hr = i; close_hr_tooltip(ev); }}>
                {leadingzero(i)}
              </span>
            {/each}
          </div>
        {/if}
      </td>

      <td>:</td>

      <td
        use:min_el
        on:click={() => min_tooltip_visible = true}>
        {#if !min_tooltip_visible}
          {leadingzero(min)}
        {:else}
          <div
            class="popper-tooltip"
            use:min_tooltip={tooltip_opts}
            use:click_outside={close_min_tooltip}>
            {#each { length: 60 } as _, i}
              <span on:click={ev => { min = i; close_min_tooltip(ev); }}>
                {leadingzero(i)}
              </span>
            {/each}
          </div>
        {/if}
      </td>

      {#if showSeconds}
        <td>:</td>

        <td
          use:sec_el
          on:click={() => sec_tooltip_visible = true}>
          {#if !sec_tooltip_visible}
            {leadingzero(sec)}
          {:else}
            <div
              class="popper-tooltip"
              use:sec_tooltip={tooltip_opts}
              use:click_outside={close_sec_tooltip}>
              {#each { length: 60 } as _, i}
                <span on:click={ev => { sec = i; close_sec_tooltip(ev); }}>
                  {leadingzero(i)}
                </span>
              {/each}
            </div>
          {/if}
        </td>
      {/if}
    </tr>
  </tbody>
</table>

<style>
  td {
    position: relative;
  }

  tbody td:nth-of-type(2n+1) {
    text-align: center;
    background-color: #513f3e;
    padding: 3px;
  }

  .popper-tooltip {
    width: 100%;
    overflow-x: scroll;
    height: 1000%;
    background-color: #513f3e;
    position: absolute;
    display: flex;
    flex-direction: column;
  }

  .popper-tooltip.small {
    height: 400%;
  }

  .popper-tooltip span {
    margin-top: 2px;
    margin-bottom: 2px;
  }
</style>
