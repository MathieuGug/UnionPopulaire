<script>

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { cp_circo_5 } from './candidats.js';
	import { loadMap, loadBureaux, loadResults } from './load_data.js';

	import Presentation from './Presentation.svelte';

	export let app;

	// On peut sélectionner le département et la circonscription
	let dpt = writable(84);
	let circo = writable(5);

	let selection = writable(cp_circo_5);
	let display_score = writable('abstention');
	
    setContext('communes-actives', selection);
	setContext('display-score', display_score);
	setContext('commune-hovered', writable([]));
	setContext('departement', dpt);
	setContext('circonscription', circo);

	/*
	const paths = {
		pres_2017: 'data/2017_pres_84_5_BV.csv',
		leg_2017: 'data/2017_leg_84_5_BV.csv',
		pres_2022: 'data/2022_pres_84_5_BV.csv'
	}
	*/

	const paths = {
		pres_2017: 'data/2017_pres_PACA_BV.csv',
		leg_2017: 'data/2017_leg_PACA_BV.csv',
		pres_2022: 'data/2022_pres_PACA_BV.csv'
	}


	// Load results
    let map_communes = loadMap();
	let map_bureaux = loadBureaux();

    let pres_2017 = loadResults(paths.pres_2017);
    let leg_2017 = loadResults(paths.leg_2017);
    let pres_2022 = loadResults(paths.pres_2022);

</script>


<svelte:head>
	<title>{app.name}</title>
</svelte:head>

{#await map_communes then communes}
{#await map_bureaux then bureaux}
{#await pres_2017 then all_pres_2017}
{#await leg_2017 then all_leg_2017}
{#await pres_2022 then all_pres_2022}


<div class="app">
	<Presentation {communes} {bureaux} {all_pres_2017} {all_leg_2017} {all_pres_2022} />
</div>

{/await}
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