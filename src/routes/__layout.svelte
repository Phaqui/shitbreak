<script lang="ts">
	import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let config_ok;

  onMount(async () => {
    let salary_module = await import('$lib/stores/salary');
    config_ok = salary_module.config_ok;
  });

  $: active_page = $page.path;

  let deferred_install_prompt;

  function show_install_promotion() {
    console.debug("app is ready to be installed");
  }

  function on_before_install_prompt(ev: any) {
    ev.preventDefault();
    deferred_install_prompt = ev;
    show_install_promotion();
  }
</script>

<svelte:window on:beforeinstallprompt={on_before_install_prompt} />

<nav>
  <a class:active={active_page === "/"} href=".">Shitbreak!</a>
  <a class:active={active_page === "/stats"} href="stats">Statistics</a>
  <a class="config" class:highlighted={!$config_ok}
    class:active={active_page === "/config"} href="config">&#x1f527;</a>
</nav>

<main>
  <slot />
</main>

<footer>
  <hr />
  Made with &#x1f4a9; by Phaqui - 
  <a href="about">about</a> | <a href="privacy">privacy</a>
</footer>

<style>
  hr {
    border: 0;
    height: 1px;
    background: linear-gradient(to left, transparent, #b0692b, transparent);
    width: 50%;
  }
  footer {
    margin-top: 2em;
    text-align: center;
  }

  nav {
    display: flex;
    align-items: center;
    background: linear-gradient(to bottom, #3c332c, #26231f);
    border-bottom: 1px solid #3c342b;
    height: 8vh;
    padding: 1vmin;
  }

  nav a {
    font-size: 1.4rem;
    margin: 0 1vw;
  }

  nav a.config {
    margin-left: auto;
    color: black;
  }

  a.active {
    color: #ea8933;
    /*color: #ee7750;*/
  }

  a.highlighted {
    color: #ffc63e;
    text-decoration: underline;
    font-weight: bold;
  }

	main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
	}

	h1 {
		color: #dd6640;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		max-width: 14rem;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
  }
</style>
