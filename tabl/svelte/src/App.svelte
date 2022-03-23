<!-- Potential fix from: https://svelte.dev/repl/b03981bb98d5411aa807e6857ab2cebb?version=3.31.0 -->

<svelte:window bind:innerHeight />

<script>
    let innerHeight;
    let clientHeight;
</script>

    <!-- This doesn't fill the full screen height as expected -->

    <!-- Embarrassing. It actually does. I'll commit anyway, just in case I need this. -->

    <article style="height: 100%">
        <section>
        <p>Lorem ipsum dolor sit amet.</p>
        </section>
    </article>

    <!-- Here's the fix -->

    <!-- <article style="height: {innerHeight}px;">
        <section>
            <p>Lorem ipsum dolor sit amet.</p>
        </section>
    </article> -->

    <!-- And this fixes and displays relevant info -->

    <!-- <article style="height: {innerHeight}px;">
        <section bind:clientHeight>
            <p>clientHeight: {clientHeight}px</p>	
            <p>expecting: {innerHeight}px</p>
        </section>
    </article>
    -->

  <style>
    article {
      width: 100%;
          background: pink;
    }
      section {
          width: 100%;
          height: 100%;
          box-shadow: 0 0 4px 4px black inset;
      }
      p {
          margin: 0;
          padding: 1em;
      }
  </style>
  
  