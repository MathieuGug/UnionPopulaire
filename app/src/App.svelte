<script>

	import { onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import Reveal from 'reveal.js';
	
	import { BaseMap, FeatureLayer } from 'svelte-geo';

	//import circo from './circonscriptions-legislatives.json';
	//import communes from './communes.json';
	import { candidats_pres_2017, candidats_leg_2017, candidats_pres_2022 } from './candidats.js';
	import { groupes_politiques_pres_2017, groupes_politiques_leg_2017, groupes_politiques_pres_2022 } from './candidats.js';
	import { cp_circo_5 } from './candidats.js';

	import { loadMap, loadResults } from './load_data.js';

	import Presentation from './Presentation.svelte';

	import Map from './Map.svelte';
	import MapRevenus from './MapRevenus.svelte';
	import Analysis from './Analysis.svelte';
	import Legend from './legend/Legend.svelte';

	export let app;


	let selection = writable(cp_circo_5);
	let display_score = writable('abstention');
	
    setContext('communes-actives', selection);
	setContext('display-score', display_score);
	
	//setContext('candidats', candidats);
	//setContext('groupes-politiques', groupes_politiques);

	setContext('commune-hovered', writable([]));

	let width, height;
	let margins = {top: 20, bottom: 20, left: 20, right:20, axisx: 100};

	let group_size_pres_2017 = [0, 80, 110, 150, 290, 350];
	let group_size_pres_2022 = [0, 80, 110, 150, 290, 370];
	let group_size_leg_2017 = [0, 80, 110, 150, 290, 370];

	const paths = {
		pres_2017: 'data/2017_pres_84_5_BV.csv',
		leg_2017: 'data/2017_leg_84_5_BV.csv',
		pres_2022: 'data/2022_pres_84_5_BV.csv'
	}


    let map = loadMap();
    let pres_2017 = loadResults(paths.pres_2017);
    let leg_2017 = loadResults(paths.leg_2017);
    let pres_2022 = loadResults(paths.pres_2022);

</script>


<!--<div id="app" bind:clientWidth={width} bind:clientHeight={height} >-->
<svelte:head>
	<title>{app.name}</title>
</svelte:head>

{#await map then communes}
{#await pres_2017 then res_pres_2017}
{#await leg_2017 then res_leg_2017}
{#await pres_2022 then res_pres_2022}

<div class="app">
	<Presentation {communes} {res_pres_2017} {res_leg_2017} {res_pres_2022} />
</div>

{/await}
{/await}
{/await}
{/await}

<!--<Analysis data={res_leg_2017} {margins} />-->

<!--</div>-->

<style> 
	.app {
		position: absolute;
		border: black solid thin;
		background-color:#f9f9ff;
		width: 100%;
		height: auto;

		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
</style>