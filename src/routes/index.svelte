<script lang="ts">
  import { browser } from '$app/env';
  import { onMount } from 'svelte';

  import DatePicker from 'svelte-calendar';

  import Counter from '$lib/Counter.svelte';
  import Modal from '$lib/Modal.svelte';
  import DurationPicker from '$lib/DurationPicker.svelte';
  import create_popper_action from '$lib/popper';
  import click_outside from '$lib/click_outside';

  // stores
  let hourly, currency;
  let start_time;
  let shit_entries;


  // POPPER
  let popper_els: Array<any> = Array(10);
  let popper_tooltips = Array(10);
  let actionbuttons_tooltip = -1;

  // I need one of these for each one of the rows, below
  for (let i = 0; i < 10; i++) {
    const newaction = create_popper_action();
    popper_els[i] = newaction[0];
    popper_tooltips[i] = newaction[1];
  }

  function get_latest_shit_entries(shit_entries) {
    const latest = shit_entries.slice(0, 10);
    latest.forEach((se, i) => {
      se.popper_el = popper_els[i];
      se.popper_tooltip = popper_tooltips[i];
    });
    return latest;
  }

  // will be enabled iff salary is set to a proper value
  let enabled: boolean;
  $: enabled = hourly && $hourly > 0;

  onMount(async () => {
    let salary_mod = await import('$lib/stores/salary');
    let timer_mod = await import('$lib/stores/timer');
    let shits_mod = await import('$lib/stores/shit_entries');
    hourly = salary_mod.hourly;
    currency = salary_mod.currency;
    shit_entries = shits_mod.shit_entries;
    start_time = timer_mod.start_time;
  });

  let times = [];

  function on_timer_ended(ev: CustomEvent) {
    let elapsed = ev.detail.elapsed;
    elapsed /= 1000;
    let amount = $hourly * elapsed / 3600;

    let date = new Date(Date.now());
    let s = date.toLocaleDateString() + ` - shit break for ${elapsed} seconds` +
      `(earning ${amount})`;

    shit_entries.add(elapsed, $hourly);
    times.push(s);
    times = times;
  }

  let jokes = [
    "Time to get some real work done!",
    "It's shit-o-clock!",
    "Time to conquer the porcelain throne!",
    "Do you want to hear a poop joke? ... Never mind, it's too corny.",
    "15 minutes of peace, quiet, and freedom.",
    "Nature calls.",
    "Good luck.",
    "Lets hope there's some substance in this!",
    "Boss makes a dollar, I make a dime - that's why I poop during company time!",
  ];

  let joke_selector = Math.floor(Math.random() * jokes.length)
  function nextjoke() {
    const oldjoke = joke_selector;
    do {
      joke_selector = Math.floor(Math.random() * jokes.length);
    } while (joke_selector == oldjoke);
  }

  async function test_notification() {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      try {
        let reg = await navigator.serviceWorker.ready;
        reg.active.postMessage('hey there, big boy');

        let p;
        try {
          p = await reg.showNotification('hey there, big boy');
        } catch (err) {
        }

        //console.log("message to service worker sent");
        //new Notification("hey there, big boy");
      } catch (err) {
      }
    } else if (Notification.permission === "denied") {
    }
  }

  function on_sw_message(ev) {
      console.log("serviceworker sent us a message");
      // @ts-ignore
      console.log(ev.data);
  }

  let sw: ServiceWorker;
  if (browser) {
    navigator.serviceWorker.ready.then(registration => {
      sw = registration.active;
      sw.addEventListener('message', on_sw_message);
    });
  }


  // edits, deletes and additions
  //

  function start_edit(shit: Shit) {
    editshit = shit;

    // hide the popper buttons popup tooltip
    actionbuttons_tooltip = -1;
  }

  function start_delete(shit: Shit) {
    deleteshit = shit;

    // hide the popper buttons popup tooltip
    actionbuttons_tooltip = -1;
  }

  // references to the shit currently being asked for deletion, or currently
  // being edited. A Modal will show if any of them are non-null
  let deleteshit = null, editshit = null, addshit = null;
  let addshit_hr = 0, addshit_min = 0, addshit_sec = 0;

  const DATE_FORMAT = "#{l}, #{j}. #{M} #{Y}";
  let addshit_dt_hr = 0;
  let addshit_dt_min = 0;

  // for the datepicker
  let addshit_date;
  let addshit_date_chosen = false;
  let addshit_date_raw = new Date();

  $: can_add =
    addshit_date_chosen &&
    (addshit_dt_hr > 0 || addshit_dt_min > 0) &&
    (addshit_hr > 0 || addshit_min > 0 || addshit_sec > 0);

  function accept_delete() {
    shit_entries.del(deleteshit);
    deleteshit = null;
  }

  function reset_add_modal() {
    addshit_hr = addshit_min = addshit_sec = addshit_dt_hr = addshit_dt_min = 0;
    addshit_date_chosen = false;
    addshit_date_raw = new Date();
  }

  async function accept_add() {
    if (!can_add) return;

    const duration = addshit_hr*3600 + addshit_min*60 + addshit_sec;

    // clone the date from the datepicker, but substitute for the
    // correct hours and minutes passed in by the user
    const when = new Date(addshit_date_raw);
    when.setHours(addshit_dt_hr);
    when.setMinutes(addshit_dt_min);

    try {
      await shit_entries.add(duration, $hourly, when);
    } catch (e) {
      // I don't know what can go wrong, but I assume the promise can reject
      // if the database doesn't work, or whatever
      console.error(e);
    }

    reset_add_modal();

    // close the modal
    addshit = null;
  }

  // the inputs we bind to in the edit shit modal
  let editshit_hour, editshit_min, editshit_sec;

  async function accept_edit() {
    const hr = Number(editshit_hour.value);
    const min = Number(editshit_min.value);
    const sec = Number(editshit_sec.value);

    const new_duration = 3600*hr + 60*min + sec;
    editshit.inner_shit.duration = new_duration;

    await shit_entries.update(editshit);
    editshit = null;
  }
</script>

{#if deleteshit}
  <Modal on:close={() => deleteshit = null}>
    <div class="modal-container" slot="content">
      <h4>Delete entry</h4>

      <p>
        Are you sure you want to delete this shit entry,<br />
        of the shit taken {deleteshit.formatted_date} that lasted {deleteshit.formatted_duration}?
      </p>

      <div class="buttons-container">
        <button on:click={accept_delete}>Yes, delete it</button>
        <button on:click={() => deleteshit = null}>No, abort</button>
      </div>
    </div>
  </Modal>
{/if}

{#if editshit}
  <Modal on:close={() => editshit = null}>
    <div class="modal-container" slot="content">
      <h4>Edit entry</h4>

      <p>
        Edit the duration for the shit taken at<br />
        {editshit.formatted_date}
      </p>

      Duration: {editshit.formatted_duration}
      <br />
      New duration:<br />
      <table>
        <tr>
          <td>Hours</td>
          <td>
            <input type="number"
              bind:this={editshit_hour}
              value={Math.floor(editshit.inner_shit.duration / 3600)}
            />
          </td>
        </tr>
        <tr>
          <td>Minutes</td>
          <td>
            <input type="number"
              bind:this={editshit_min}
              value={Math.floor(editshit.inner_shit.duration / 60)}
            />
          </td>
        </tr>
        <tr>
          <td>Seconds</td>
          <td>
            <input type="number"
              bind:this={editshit_sec}
              value={Math.floor(editshit.inner_shit.duration % 60)}
            />
          </td>
        </tr>
      </table>

      <div class="buttons-container">
        <button on:click={accept_edit}>Save edits</button>
        <button on:click={() => editshit = null}>cancel</button>
      </div>
    </div>
  </Modal>
{/if}

{#if addshit}
  <Modal on:close={() => editshit = null}>
    <div class="modal-container" slot="content">
      <h3>Add forgotten shit</h3>

      <blockquote>
        The pleasure of a shit is sometimes so soothing, you
        forget all about your worries and obligations...<br />
        Add your forgotten shits right here.
      </blockquote>

      <p>When did this beast of nature occur?</p>
      <div class="addshit-when-container">
        <DatePicker
          style="margin: 0; justify-self: center;"
          bind:formattedSelected={addshit_date}
          bind:dateChosen={addshit_date_chosen}
          format={DATE_FORMAT}
          start={new Date('1990-01-01')}
          end={new Date()}
          bind:selected={addshit_date_raw}
          weekStart={1}
          backgroundColor='#352d27'
          textColor='#DD6640'
          dayTextColor='#DD6640'
          dayBorderColor='#DD6640'
          highlightColor='#DD6640'
          dayBackgroundColor='#513F3E'
          dayHighlightedBackgroundColor='#DD6640'
          dayHighlightedTextColor='#fff'
        >
          <button>{#if addshit_date_chosen}{addshit_date}{:else}Select date...{/if}</button>
        </DatePicker>
        <DurationPicker
          showSeconds={false}
          numHours={24}
          bind:hr={addshit_dt_hr}
          bind:min={addshit_dt_min} />
      </div>

      <p>And for how long did it last?</p>
      <div style="margin: 0 auto;">
        <DurationPicker
          bind:hr={addshit_hr}
          bind:min={addshit_min}
          bind:sec={addshit_sec}
        />
      </div>

      (maybe feature: ability to customize salary for this)<br>

      <div class="buttons-container">
        <button disabled={!can_add} on:click={accept_add}>Save</button>
        <button on:click={() => { reset_add_modal(); addshit = null; }}>
          Cancel
        </button>
      </div>
  </Modal>
{/if}


<h2>&nbsp;</h2>

<Counter
  enabled={enabled}
  on:ended={on_timer_ended}
/>

<h2>&nbsp;</h2>

{#if !enabled}
  <p class="error">Configure your salary before beginning</p>
{:else}
  <blockquote class="wide" on:click={nextjoke}>
    {jokes[joke_selector]}
  </blockquote>
{/if}

<h2>Your Latest Shits</h2>
<button style="margin: 1em 0;" on:click={() => addshit = true}>Add Forgotten Shit</button>

<div class="table-container">
  {#if $shit_entries !== undefined}
    {#if $shit_entries.length > 0}
      <table>
        <thead>
          <th>Date</th>
          <th>Duration</th>
          <th>Gross earnings</th>
          <th>Tags</th>
          <th></th>
        </thead>
        <tbody>
          {#each get_latest_shit_entries($shit_entries) as shit, i}
            <tr>
              <td>{shit.formatted_date}</td>
              <td>{shit.formatted_duration}</td>
              <td>{Math.round(shit.earning * 100) / 100} {$currency || ""}</td>
              <td>(no tags)</td>
              <td>
                <span
                  class="more-buttons"
                  use:shit.popper_el
                  on:click={() => actionbuttons_tooltip = i}
                >
                  &#x2022;&#x2022;&#x2022;
                </span>
                {#if actionbuttons_tooltip == i}
                  <div
                    class="popper-buttons-tooltip"
                    use:click_outside={() => actionbuttons_tooltip = -1}
                    use:shit.popper_tooltip={{ placement: 'bottom-start' }}
                  >
                    <button on:click={() => start_edit(shit)}>Edit</button>
                    <button on:click={() => start_delete(shit)}>Delete</button>
                  </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>You have yet to take your first shit. Get to work!</p>
    {/if}
  {/if}
</div>

<style>
  h2 {
    margin-bottom: 0;
  }

  div {
    display: flex;
    justify-content: center;
  }

  div.table-container {
    width: 100%;
  }

  table {
    color: #dd6640;
    width: 98%;
    table-layout: fixed;
  }

  table th {
    text-align: left;
    font-size: 1.1em;
    background-color: #303137;
    padding: 0.3em 0 0.3em 0.5em;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  table th:last-of-type {
    background-color: initial;
  }

  thead th:nth-child(1) { width: 30%; }
  thead th:nth-child(2) { width: 30%; }
  thead th:nth-child(3) { width: 20%; }
  thead th:nth-child(4) { width: 15%; }
  thead th:nth-child(5) { width: 3%; }

  table tr {
    background-color: #2d2925;
  }

  table tr:nth-of-type(2n) {
    background-color: #2d2c24;
  }

  table td {
    padding: 0.4em;
  }

  table td span.more-buttons {
    cursor: pointer;
    font-size: 12px;
    display: inline-block;
    transform: rotate(90deg);
  }

  div.addshit-when-container {
    display: flex;
    flex-direction: row;
    /*justify-content: space-evenly;*/
    align-items: center;
  }

  div.modal-container {
    border-radius: 5%;
    display: flex;
    flex-direction: column;
    padding: 2em;
    background-color: #352b2a;
  }

  div.buttons-container {
    display: flex;
    justify-content: space-evenly;
  }

  div.popper-buttons-tooltip {
    z-index: 60;
    display: flex;
    flex-direction: column;
    border: 2px solid #ff3e00;
    border-radius: 4px;
  }

  div.popper-buttons-tooltip button {
    color: #e93a03;
    width: 100%;
    font-size: 16px;
    padding: 0.5em 1.8em;
    border: 0;
    background-color: #3c251c;
    /*box-shadow: 0 0 6px 6px rgba(0, 0, 0, 0.2);*/
  }

  div.popper-buttons-tooltip button:not(:last-child) {
    border-bottom: 1px solid #ff3e00;
  }

  blockquote {
    text-align: center;
    font-style: italic;
    padding: 1em 1em 1em 3em;
    border-left: 0.5em solid #844430;
    background-color: #372f26;
    border-radius: 3px;
  }

  blockquote.wide {
    width: 90vw;
  }

  p.error {
    font-size: 1.1em;
    color: #1f2533;
    padding: 1.3em;
    background-color: #d7b758;
    font-weight: bold;
    border: 3px dashed #c10000;
    border-radius: 5px;
  }

  p.error::before {
    content: '\26A0';
  }
</style>
