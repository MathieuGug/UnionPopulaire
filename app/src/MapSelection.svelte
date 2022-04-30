<script>
    import { getContext } from "svelte";
    import { cp_circo_5 } from './candidats.js';

    let selection = getContext('communes-actives');

</script>

<div class="map-selection">

    <div class="select-all" style="width: 50%;">
        <button on:click={() => $selection = cp_circo_5}>Tout sélectionner</button>
    </div>

    <div class="reset" style="width: 50%;">
        <button on:click={() => $selection = []}>Tout désélectionner</button>
    </div>
</div>

<style>
    .map-selection {
        display: flex;
        flex-direction: row; 
        align-items: center;
        justify-content: space-evenly;
    }
</style>