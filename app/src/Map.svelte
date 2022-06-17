<script>
    import { getContext } from 'svelte';

    import BaseMap from './svelte-geo/BaseMap.svelte';
    import FeatureLayer from './svelte-geo/FeatureLayer.svelte';

    import { geoMercator } from 'd3-geo';

    export let communes, communes_coordinates, colors;

    // Bind la sélection de la carte
    let selection_active = getContext('communes-actives');
    let hovered_selection = getContext('commune-hovered');

	let textElement;
    console.log(communes_coordinates);

	$: textBoxWidth = textElement ? textElement.getComputedTextLength()+10 : 0;
</script>

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
                'stroke-width': selected ? 2 : 1,
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

    <FeatureLayer geojson={communes_coordinates} />
</BaseMap>


<style>

</style>