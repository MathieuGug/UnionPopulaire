<script>
	import { getContext, createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { geoPath } from 'd3-geo';
	export let geojson;
	export let styleAccessor = (feature, selected) => ({
		'vector-effect': 'non-scaling-stroke',
		fill: 'lightgrey',
		stroke: 'black'
	});
	export let selectMode = null;
	export let selection = [];
	export let idAccessor = (feature) => JSON.stringify(feature.properties);
	export let layerName = null;
	export let addExtentsToProjection = true
    export let radius = undefined;

	const dispatch = createEventDispatcher();
	let features = geojson.features;
	let mapGroup
	let { projection, margin, applyCurrentZoom } = getContext('basemap');
	if(addExtentsToProjection){	layerName = projection.addLayer(geojson, layerName)};
  
  onDestroy(()=>{
		if(addExtentsToProjection){projection.clear(layerName)}
		dispatch("destroy",layerName)
	})
	onMount(()=>{
		dispatch("mount",layerName)
	})
    
    let geoPathFn;

	$: if (radius != undefined) {
        geoPathFn = geoPath($projection).pointRadius(radius);
    } else {
        geoPathFn = geoPath($projection);
    }
	let multi = (_selection, feature) => {
		if (_selection.find((d) => d == idAccessor(feature))) {
			_selection = _selection.filter((d) => d != idAccessor(feature));
		} else {
			_selection.push(idAccessor(feature));
		}
		return _selection;
	};
	let nMulti = (n) => {
		if ((Number.isInteger(n) && n > 0) || n == Infinity) {
			return (selection, feature) => {
				selection = multi(selection, feature);
				if (selection.length > n) {
					selection.shift();
				}
				return selection;
			};
		} else {
			return (selection, feature) => [];
		}
	};
	const isSelected = (feature, selection) => !!selection.find((s) => s == idAccessor(feature));
	$: _styleAccessor = (feature, selection) =>
		styleAccessor(feature, isSelected(feature, selection));
	let over = []
	let {offsetX,offsetY}=getContext('offset')
		
	const clickHandler = (feature, event) => {
		selection = nMulti(selectMode)(selection, feature);
		dispatch('click', { feature, event });
	};
	const mousemoveHandler = (feature, event) => {
		dispatch('mousemove', { feature, event })
	};
	const mouseleaveHandler = (feature, event) => {
		over = over.filter((d) => idAccessor(d) != idAccessor(feature))
		dispatch('mouseleave', { feature, event })
	};
	const mouseenterHandler = (feature, event) => {
		over.push(feature)
		over = over
		dispatch('mouseenter', { feature, event })
	};
	$: if (selection.length > selectMode) {
		while (selection.length > selectMode) {
			selection.shift();
		}
		selection = selection;
	}
	$: hoveredFeature = over[0] 
</script>

<g class="map-group" bind:this = {mapGroup}>
	{#each features as feature}
		<path
			class="feature-path"
			{..._styleAccessor(feature, selection)}
			d={geoPathFn(feature)}
			on:click={(e) => clickHandler(feature, e)}
			on:mousemove={(e) => mousemoveHandler(feature,e)}
			on:mouseenter={(e) => mouseenterHandler(feature,e)}
			on:mouseleave={(e) => mouseleaveHandler(feature,e)}
		/>
	{/each}	
</g>

<g class = tooltip>
	{#if hoveredFeature}
		<g style={`transform:translate(${$offsetX-margin.left}px,${$offsetY-margin.top}px)`}>
			<slot {hoveredFeature}/>
		</g>
	{/if}
</g>

<style>
	.tooltip{
		pointer-events:none
	}
</style>