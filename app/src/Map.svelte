<script>
    import { getContext } from 'svelte';
    import { get, writable } from 'svelte/store';

    import BaseMap from './svelte-geo/BaseMap.svelte';
    import FeatureLayer from './svelte-geo/FeatureLayer.svelte';

    import { geoMercator, geoPath } from 'd3-geo';

    import { rollup, sum, index } from 'd3-array';

    export let communes, bureaux, colors;

    // Bind la sélection de la carte
    let selection = [];
    $: console.log(selection);

    let selection_active = getContext('communes-actives');
    console.log(selection_active);

    let selection_bureaux = getContext('bureaux-actifs');
    let hovered_selection = getContext('commune-hovered');
    let display_score = getContext('display-score');

	let textElement;

	$: textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0;

    console.log(communes);
    console.log(bureaux);
</script>

<div class="map-container">
    <div class="basemap">
        <BaseMap projection={geoMercator}>
            
            <FeatureLayer bind:selection={$selection_active}
                geojson={communes} 
                idAccessor={ feature => feature.properties.code} 
                let:hoveredFeature
                on:mouseenter={(e) => $hovered_selection = e.detail.feature.properties.code}
                on:mouseleave={() => $hovered_selection = ''}
                selectMode={Infinity}
                styleAccessor={(feature, selected) => {
                    return {
                        'fill': colors(feature.properties.code),
                        'stroke': selected ? 'black' : 'white',
                        'stroke-width': selected ? 3 : 1,
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
            
            <!--
            <FeatureLayer 
                geojson={bureaux}
                let:hoveredFeature
                radius={0.05}
                styleAccessor={(FeatureLayer, selected) => {
                    return {}
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
                {hoveredFeature?.properties.cp + ' ' + hoveredFeature?.properties.ville}
            </text>
            </FeatureLayer>
            -->

        </BaseMap>

    </div>
</div>

<style>
    .map-container {
        display: flex;
        flex-direction: column;
}
</style>