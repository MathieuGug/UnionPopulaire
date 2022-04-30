<script>
    import { getContext } from 'svelte';
    import { get, writable } from 'svelte/store';

    import { BaseMap, FeatureLayer } from 'svelte-geo';
    import { csv } from 'd3-fetch';
    import { rollup, sum, index } from 'd3-array';

    import { scaleLinear, scaleSequential, scaleOrdinal } from 'd3-scale';
    import { schemeGreys, interpolatePiYG } from 'd3-scale-chromatic';

    export let communes, revenus;
    let textElement;

    let selection = getContext('communes-actives');
    let display_revenus = getContext('display-revenus');

    let categories = ['SNHM19', 'SNHM1819', 'SNHM2619', 'SNHM5019', 'SNHMC19', 'SNHME19', 'SNHMF19', 'SNHMF1819',
        'SNHMF2619', 'SNHMF5019', 'SNHMFC19', 'SNHMFE19', 'SNHMFO19', 'SNHMFP19', 'SNHMH19', 'SNHMH1819', 'SNHMH2619',
        'SNHMH5019', 'SNHMHC19', 'SNHMHE19', 'SNHMHO19', 'SNHMHP19', 'SNHMO19', 'SNHMP19'];

    $: revenu_par_commune = rollup(revenus, v => sum(v, d => d[$display_revenus]), d => d.CODGEO);
    $: console.log(revenu_par_commune);


    let colorScaleRevenus = scaleSequential(interpolatePiYG).domain([15, 10]);

    $: textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0;

    function colorFromCp (feature, _) {
        var color;

        let revenu = revenu_par_commune.get(feature.properties.code);
        console.log(revenu);
        color = colorScaleRevenus(revenu);
        
        return color;
    }
</script>


<div class="map-container">
    <div class="map-widgets">
        <select bind:value={$display_revenus}>
            {#each categories as categorie}
                {#if $display_revenus == categorie}
                    <option value={categorie} checked="true">{categorie}</option>
                {:else}
                    <option value={categorie}>{categorie}</option>
                {/if}
            {/each}
        </select>
    </div>

    <div class="basemap">
        <BaseMap>
            <FeatureLayer bind:selection={$selection} geojson={communes} idAccessor={ feature => feature.properties.code} 
                let:hoveredFeature
                selectMode={5}
                styleAccessor={(feature, selected) => {
                    return {
                        'fill': colorFromCp(feature, $display_revenus),
                        'stroke': 'grey',
                        'stroke-width': selected ? 5 : 1,
                        'vector-effect': 'non-scaling-stroke'
                }
                }} >
            <rect 
                width={textBoxWidth} 
                height = 21 
                x={-0.5*textBoxWidth} 
                y = -15	
                rx = 10  
                fill="white" 
                opacity=0.8/>
            <text text-anchor="middle" bind:this={textElement} >
                {hoveredFeature?.properties.nom}
            </text>
            </FeatureLayer>
        
        </BaseMap>
    </div>
</div>

<style>
    .basemap {
        width: 500px;
        height: 500px;
    }
</style>