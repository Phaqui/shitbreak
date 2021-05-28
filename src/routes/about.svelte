<h2>About</h2>

<p>
  Built with
  <a href="https://svelte.dev">
    <img src="./svelte-logo-horizontal2.svg" alt="Svelte logo" />
  </a>
  and it's awesome
  <a href="https://kit.svelte.dev">
    <img src="./svelte-kit-horizontal2.svg" alt="SvelteKit logo">
  </a>
  and with some
  <a href="https://www.typescriptlang.org/">
    <img src="./ts-logo-512.svg" alt="TypeScript logo" />
    TypeScript
  </a>
  too!
</p>
<p>
  Hosting by
  <a href="https://www.cloudflare.com">
    <img src="./logo-cloudflare-dark2.svg" alt="Cloudflare logo" />
  </a>
  with their sweet
  <a href="https://workers.cloudflare.com/">
    <img src="./logo-cloudflare-workers.svg" alt="Cloudflare Workers logo" />
  </a>
</p>

<p>
  Free and open-source, the source is available on
  <a href="https://github.com/">
    <img id="githubmark" src="./GitHub-Mark-32px.png" alt="GitHub Mark" />
    <img id="githublogo" src="./GitHub_Logo_White.png" alt="GitHub Logo" />
  </a>
</p>

<p id="alsothanks">
  Also thanks to Tan Li Hau (<a href="https://lihautan.com/">site</a>,
  <a href="https://www.youtube.com/channel/UCbmC3HP3FaAFdcZkui8YoMQ">youtube</a>),
  <br />
  among other things for his <a href="https://popper.js.org/">popperjs</a>
  svelte integration <a href="https://www.youtube.com/watch?v=CFj4X0bGOvE">video
  </a>
  (<a href="https://svelte.dev/repl/6ef53f4882324d21a14f49ec68cf60f7?version=3">
    Svelte REPL</a>),
  and the authors of Svelte Calendar (<a href="https://github.com/6eDesign/svelte-calendar">https://github.com/6eDesign/svelte-calendar</a>).
</p>

<p class="small">
  All logos are copyright of their respective owners.
  <br />
  The font color of the logos have been altered to fit better on this site.
</p>


<style>
  p {
    display: table-cell;
    vertical-align: middle;
  }

  p.small {
    font-size: 0.8rem;
  }

  p#alsothanks a {
    text-decoration: underline;
  }

  img {
    display: inline-block;
    height: 2rem;
    vertical-align: bottom;
  }

  img#githubmark {
    /* using clever filter tricks to change the color... */
    filter:
      contrast(300%)     /* gray-ish -> totally black */
      invert(100%)       /* black -> white */
      sepia(1)
      saturate(10000%)   /* now we have a yellow-ish color */
      hue-rotate(-55deg) /* change color to orange-ish */
      saturate(1000%)    /* make it stronger */
      grayscale(20%)     /* well, but a bit more gray */
    ;                    /* ...close enough (it doesn't have to be 100% like the font color anyway) */
  }

  img#githublogo {
    /* same as above, just that we're starting from white */
    filter:
      sepia(1)
      saturate(10000%)
      hue-rotate(-55deg)
      saturate(1000%)
      grayscale(20%)
    ;
  }
</style>
