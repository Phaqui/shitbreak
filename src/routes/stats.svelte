<script lang="ts">
  import { onMount } from 'svelte';
  import * as Pancake from '@sveltejs/pancake';
  import { format_duration } from '$lib/dt_utils';

  let shit_entries;
  let currency;

  onMount(async () => {
    let shits_mod = await import('$lib/stores/shit_entries');
    let salary_module = await import('$lib/stores/salary');
    shit_entries = shits_mod.shit_entries;
    currency = salary_module.currency;
  });


  async function get_data() {
    // wait for database
    if (!shit_entries) throw Error('get_data(): no shit_entries');
    const db = await shit_entries.getdb();
    if (db === null) throw Error('get_data(): db was rejected');

    let datapoints = [];
    let x1 = (new Date()).valueOf() * 2;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;

    function f(shit_array: any) {
      for (let shit of shit_array) {
        let date = shit.date.valueOf();
        if (date < x1) x1 = date;
        if (date > x2) x2 = date;
        if (shit.duration > y2) y2 = shit.duration;
        datapoints.push({
          x: date, y: shit.duration
        });
      }
    }
    shit_entries.subscribe(f)();

    const ticks = [0, 5, 10, 15, 20].map(x => x*60);
    const ndays = Math.ceil((x2 - x1) / (1000 * 1000 * 60 * 60 * 24)) + 1;
    const width = 100 * 60 * 60 * 24;
    let res = { x1, x2, y1, y2, datapoints, width, ticks, ndays };
    console.log(res);
    return res;
  }

  let current_year = (new Date(Date.now())).getFullYear();
</script>

{#if !shit_entries}
  <p>Wait a second while we make some graphs from your data...</p>
{:else}
  <p>Shit by day</p>

  <div class="chart">
    {#await get_data()}
      waiting for shit entries
    {:then { x1, x2, y1, y2, width, datapoints, ticks, ndays }}
      <Pancake.Chart {x1} {x2} {y1} {y2}>
        <Pancake.Columns data={datapoints} {width}>
          <div class="column"></div>
        </Pancake.Columns>

        <!-- Horizontal grid lines and y-labels -->
        <Pancake.Grid horizontal {ticks} let:value>
          <div class="grid-line horizontal"></div>
          <span class="y-label">{Math.floor(value / 60)}m</span>
        </Pancake.Grid>

        <!-- x labels (the days at the bottom) -->
        <Pancake.Grid vertical count={ndays} let:value>
          <span class="x-label">{value}</span>
        </Pancake.Grid>
      </Pancake.Chart>
    {:catch}
      Error!
    {/await}
  </div>

  <p>Summary so far for {current_year}</p>
  {#await shit_entries.get_yearly_total(current_year)}
    <p>...</p>
  {:then yearly_total}
    <p>Time spent on the head: {format_duration(yearly_total.duration)}</p>
    <p>Total earnings: {yearly_total.earnings} {$currency !== null ? $currency : ''}</p>
  {:catch err}
    <p>{err}</p>
  {/await}

  <p>Idea here: stats of shits per day (e.g. best average day)</p>
{/if}

<style>
  div.chart {
    position: relative;
    height: 100px;
    width: 80vw;
  }

  .column {
    background-color: red;
    position: absolute;
    width: 100%;
    left: 0;
    height: 100%;
  }
	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: 100%;
		left: 0;
		border-bottom: 1px solid rgb(189, 89, 16);
	}
  .y-label {
		left: calc(100% + 1em);
		bottom: -0.5em;
		line-height: 1;
	}
  .x-label {
    width: 4em;
		left: -2em;
		bottom: 5px;
		text-align: center;
  }
</style>
