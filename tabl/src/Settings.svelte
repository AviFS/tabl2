{#if show}
    <nav>
    <button id="close" on:click={() => show = false}>close</button>
    </nav>
    <div id="s"></div>
{:else}
    <button on:click={() => show = !show}>settings</button>
{/if}


<script>
import { fly } from 'svelte/transition';
let show=!false;
</script>
      
<style>
nav {
position: fixed;
top: 0;
left: 0;
height: 100%;
padding: 2rem 1rem 0.6rem;
border-left: 1px solid #aaa;
background: #fff;
overflow-y: auto;
}


nav, #s {
    width: 12rem;
}
#s { width: 15rem; }

</style>