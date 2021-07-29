<script lang="ts">
  import Language from './_config_lang.svelte';
  import Salary from './_config_salary.svelte';
</script>

<h2>
  Configuration
</h2>

<p>(Note: All configuration is automatically saved when edited.)</p>

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

  @media (max-width: 600px) {
    main {
      width: 90vw;
    }
  }

  p {
    font-style: italic;
  }
</style>
