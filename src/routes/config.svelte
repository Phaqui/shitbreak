<script lang="ts">
  import Language from './_config_lang.svelte';
  import Salary from './_config_salary.svelte';
</script>

<h2>
  Configuration
</h2>

<main>
  <Language />

  <!-- spacer -->
  <div style="margin-top: 1.5em;"></div>

  <Salary />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 40vw;
  }
</style>
