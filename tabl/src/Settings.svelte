{#if show}
    <nav in:fly={{x: -100, duration: 300}}>
    <!-- <nav> -->
    <button id="close" on:click={() => show = false}>
        <object data="settings.svg" width="30" alt="settings"> </object>
    </button>


    <!-- <label><input type="checkbox" id="cbox1"> -->


    </nav>
    <div id="s"></div>
{:else}
    <button on:click={() => show = true}>
        <object data="settings.svg" width="30" alt="settings"> </object>
    </button>
{/if}


<script>
import { fly } from 'svelte/transition';
let show=false;
</script>
      
<style>
nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    padding: 24px 10px;
    /* border-left: 1px solid #aaa; */
    border-right: 1px solid hsla(224, 10%, 70%, 1);
    background: #fff;
    overflow-y: auto;
    background-color: hsla(224, 19%, 14%, 1);
}



button {
    pointer-events: all;
    float:right;
    padding: 4px;
    padding-top: 5px;
    padding-left: 7px;
    padding-right: 7px;
    margin-right: 6px;
    margin-top: -9px;
    background-color: hsla(224, 19%, 18%, 1);
    fill: hsla(0, 0%, 100%, .4);
    border: 1px solid hsla(0, 0%, 90%, .1);
    /* border: none; */
    border-radius: 4px;
}
object {
    pointer-events: none;
}
nav, #s {
    width: 17rem;
}
#s { width: 21rem; }

</style>