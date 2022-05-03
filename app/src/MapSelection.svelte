<script>
    import { getContext } from "svelte";

    let selection = getContext('communes-actives');
    let codes_communes = getContext('codes-communes');
    console.log($codes_communes);
</script>

<div class="map-selection">
    <div class="select-all">
       
    </div>

    <div class="reset">
        
    </div>
</div>

<style>
    .map-selection {
        width: 200px;
    }
</style>