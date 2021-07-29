<script lang="ts">
  export let title;
  export let expanded = true;
</script>

<section>
  {#if expanded}
    <fieldset>
      <legend on:click={() => expanded = false}>{title}</legend>
      <slot></slot>
    </fieldset>
  {:else}
    <div class="closedview" on:click={() => expanded = true}>{title}</div>
  {/if}
</section>

<style>
  fieldset {
    display: block;
    border: 1px solid #6a311f;
    border-radius: 4px;
    margin-bottom: 1.5em;
    background: linear-gradient(120deg, #26231f 40%, #1d2126 85%, #26231f);
  }

  fieldset > legend {
    font-size: 20px;
  }

  div.closedview {
    border: 1px solid #6a311f;
    border-radius: 4px;
    padding: 0.7em;
    background: linear-gradient(120deg, #26231f 40%, #1d2126 85%, #26231f);
  }
</style>
