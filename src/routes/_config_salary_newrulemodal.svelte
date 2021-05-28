<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import Select from '$lib/Select.svelte';

  import Modal from '$lib/Modal.svelte';
  let from, to, increment;
  let day = [false, false, false, false, false, false, false];
  let incr_type = "";

  function dispatch_add() {
    const obj = {
      days: day,
      from,
      to,
      increment,
      incr_type  // "" for currency (scalar value) or "%" for % from base salary
    };
    dispatch('add', obj);
  }
</script>

<Modal on:close={() => dispatch('close')}>
  <div class="modal-container" slot="content">
    <h4>New salary rule</h4>

    <p>Affects days...</p>
    <div style="display: flex;">
      <span class="day" class:selected={day[0]} on:click={() => day[0] = !day[0]}>Monday</span>
      <span class="day" class:selected={day[1]} on:click={() => day[1] = !day[1]}>Tuesday</span>
      <span class="day" class:selected={day[2]} on:click={() => day[2] = !day[2]}>Wednesday</span>
      <span class="day" class:selected={day[3]} on:click={() => day[3] = !day[3]}>Thursday</span>
      <span class="day" class:selected={day[4]} on:click={() => day[4] = !day[4]}>Friday</span>
      <span class="day" class:selected={day[5]} on:click={() => day[5] = !day[5]}>Saturday</span>
      <span class="day" class:selected={day[6]} on:click={() => day[6] = !day[6]}>Sunday</span>
    </div>

    <p>
      From <input type="text" bind:value={from} /> to <input type="text" bind:value={to} />
    </p>

    <p>
      Salary change:<br />
      + <input type="text" bind:value={increment} />
      <Select bind:myvalue={incr_type} options={["", "%"]} />
    </p>

    <div style="display: flex; justify-content: space-evenly;">
      <button on:click={dispatch_add}>Add rule</button>
      <button on:click={() => dispatch('close')}>Cancel</button>
    </div>
  </div>
</Modal>

<style>
  div.modal-container {
    border-radius: 5%;
    display: flex;
    flex-direction: column;
    padding: 2em;
    background-color: #352b2a;
  }

  span.day {
    padding: 0.4em;
    background-color: #3c251c;
    border-radius: 4px;
    border: 1px solid gray;
    margin: 0.4em;
  }

  span.day.selected {
    border-color: #ff3e00;
  }

  input[type="text"] {
    width: 3em;
  }
</style>
