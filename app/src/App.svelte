<script>

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { loadResults } from './load_data.js';

	import Presentation from './Presentation.svelte';

	export let app;

	///////////////////////////////////////////////
	//               FILES PATHS                 //
	///////////////////////////////////////////////

	const paths = {
		pres_2017: 'data/2017_pres_PACA_BV.csv',
		leg_2017: 'data/2017_leg_PACA_BV.csv',
		pres_2022: 'data/2022_pres_PACA_BV.csv',
		leg_2022: 'data/2022_leg_PACA_BV.csv'
	}

	///////////////////////////////////////////////
	//           CONTEXT AT APP LEVEL            // 
	///////////////////////////////////////////////

	// On peut sélectionner le département et la circonscription
	let dpt = writable(84);
	let circo = writable(5);

	setContext('commune-hovered', writable('')); // La commune qu'on survole
	setContext('departement', dpt); // Le département sélectionné
	setContext('circonscription', circo); // La circonscription sélectionnée

	// Load results

    let pres_2017 = loadResults(paths.pres_2017);
    let leg_2017 = loadResults(paths.leg_2017);
    let pres_2022 = loadResults(paths.pres_2022);
	let leg_2022 = loadResults(paths.leg_2022)

</script>


<svelte:head>
	<title>{app.name}</title>
</svelte:head>

{#await pres_2017 then resultats_presidentielles_2017}
{#await leg_2017 then resultats_legislatives_2017}
{#await pres_2022 then resultats_presidentielles_2022}
{#await leg_2022 then resultats_legislatives_2022}


<div class="app">
	<Presentation
		{resultats_presidentielles_2017}
		{resultats_legislatives_2017}
		{resultats_presidentielles_2022}
		{resultats_legislatives_2022} />
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
		border: 2px solid #5F0A87;
		width: 96%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
</style>