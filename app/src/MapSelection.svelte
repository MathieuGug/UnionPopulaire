<script>
    import { getContext } from "svelte";

    let selection = getContext('communes-actives');
    let codes_communes = getContext('codes-communes');
    console.log($codes_communes);
</script>

<div class="map-selection">

    <div class="select-all" style="width: 50%;">
        <button on:click={() => $selection = $codes_communes}>Tout sélectionner</button>
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