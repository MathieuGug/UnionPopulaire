<script>
    import { getContext } from "svelte";

    let selection = getContext('communes-actives');
    let codes_communes = getContext('codes-communes');
    console.log($codes_communes);
</script>

<div class="map-selection">

    <div class="select-all">
        <button on:click={() => $selection = $codes_communes}>Tout sélectionner</button>
    </div>

    <div class="reset">
        <button on:click={() => $selection = []}>Tout désélectionner</button>
    </div>
</div>

<style>
    .map-selection {
        width: 200px;
    }
</style>