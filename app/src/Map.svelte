<script>
    import { getContext } from 'svelte';
    import { get, writable } from 'svelte/store';

    import { BaseMap, FeatureLayer } from 'svelte-geo';
    import { csv } from 'd3-fetch';
    import { rollup, sum, index } from 'd3-array';

    export let communes, colors;

    console.log(colors);

    let selection = getContext('communes-actives');
    let hovered_selection = getContext('commune-hovered');
    let display_score = getContext('display-score');

	let textElement;


	$: textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0;

</script>

<div class="map-container">
    <div class="basemap">
        <BaseMap>
            <FeatureLayer bind:selection={$selection}
                geojson={communes} 
                idAccessor={ feature => feature.properties.code} 
                let:hoveredFeature
                on:mouseenter={(e) => $hovered_selection = e.detail.feature.properties.code}
                on:mouseleave={() => $hovered_selection = ''}
                selectMode={60}
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
        </BaseMap>

    </div>
</div>

<style>
    .map-container {
        display: flex;
        flex-direction: column;
}
</style>