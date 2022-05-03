<script>
    import { getContext, setContext } from 'svelte';
    import { writable, derived } from 'svelte/store';

    import { loadMap, loadBureaux } from './load_data.js';

    import ComparaisonPresidentielles from './slides/ComparaisonPresidentielles.svelte';
    import DesistementsLegislatives from './slides/DesistementsLegislatives.svelte';

    import { getCandidats, getGroupesPolitiques, scoreParCommune, scoreParBureau } from './utils.js';
    import { filtrerResultats } from './utils.js';
    import { circosDansDepartement, communesDansCirco } from './utils.js';

    /////////////////////////////////////////////////
    //       PROPS : RESULTATS DES ELECTIONS       //
    /////////////////////////////////////////////////

    // Ce sont les résultats complets, on va les filtrer ensuite en fonction des stores
    // pour le département et la circo

    export let resultats_presidentielles_2017, resultats_legislatives_2017, resultats_presidentielles_2022;

    /////////////////////////////////////////////////
    //       LES STORES DYNAMIQUES UTILISÉS        //
    /////////////////////////////////////////////////
    let dpt = getContext('departement'); // Initialement 84
    let circo = getContext('circonscription'); // Initialement 5
    let dpt_circo_choisis = true; // Quand on change le département

    // Les départements en région PACA
    let dpt_paca = [
        // {code_dpt: 4, nom_dpt: "Alpes de Hautes-Provences"},
        // {code_dpt: 5, nom_dpt: "Hautes-Alpes"},
        // {code_dpt: 6, nom_dpt: "Alpes-Maritimes"},
        // {code_dpt: 13, nom_dpt: "Bouches-du-Rhône"},
        // {code_dpt: 83, nom_dpt: "Var"},
        {code_dpt: 84, nom_dpt: "Vaucluse"}
]

	let circos_dpt = derived(dpt,
        ($dpt) => circosDansDepartement($dpt, resultats_presidentielles_2017));

    // Les codes des communes dépend du département et des circo
    let codes_communes = derived([dpt, circo],
        ([$dpt, $circo]) => (communesDansCirco($dpt, $circo, resultats_presidentielles_2017)));

    //////////////////////////////////////////////
    //  LIRE LA CARTE DES COMMUNES DE LA CIRCO  //
    //////////////////////////////////////////////

    let map_communes = derived(codes_communes, $codes_communes => loadMap($codes_communes));
    let map_bureaux = derived(codes_communes, $codes_communes => loadBureaux($codes_communes));

    //////////////////////////////////////////////////////
    //  LES DONNÉES FILTRÉES EN FONCTION DU DPT / CIRCO //
    //////////////////////////////////////////////////////

    // Array: [ {code_dpt (83), dpt, code_circ (5), code_commune (83001), code_b_vote (1), id_b_vote (83001-1),
    // nom, prenom, nuance, voix, votants, inscrits, p_voix_exp, p_voix_ins}...]

    let presidentielle_2017_circo = derived([dpt, circo], ([$dpt, $circo]) => 
        filtrerResultats(resultats_presidentielles_2017, $dpt, $circo));

    let legislatives_2017_circo = derived([dpt, circo], ([$dpt, $circo]) => 
        filtrerResultats(resultats_legislatives_2017, $dpt, $circo));

    let presidentielle_2022_circo = derived([dpt, circo], ([$dpt, $circo]) => 
        filtrerResultats(resultats_presidentielles_2022, $dpt, $circo));

    // Key en fonction du CODE POSTAL { cp: {'abstention': ..., 'candidat': ...} }
    let presidentielle_2017_cp = derived(presidentielle_2017_circo, $presidentielle_2017_circo =>
        scoreParCommune($presidentielle_2017_circo));

    let legislatives_2017_cp = derived(legislatives_2017_circo, $legislatives_2017_circo =>
        scoreParCommune($legislatives_2017_circo));    

    let presidentielle_2022_cp = derived(presidentielle_2022_circo, $presidentielle_2022_circo =>
        scoreParCommune($presidentielle_2022_circo));

    // Key en fonction du BUREAU DE VOTE { id_b_vote: {'abstention': ..., 'candidat': ...} }
    let presidentielle_2017_bureau = derived(presidentielle_2017_circo, $presidentielle_2017_circo =>
        scoreParBureau($presidentielle_2017_circo));

    let legislatives_2017_bureau = derived(legislatives_2017_circo, $legislatives_2017_circo =>
        scoreParBureau($legislatives_2017_circo));    

    let presidentielle_2022_bureau = derived(presidentielle_2017_circo, $presidentielle_2017_circo =>
        scoreParBureau($presidentielle_2017_circo));

    ////////////////////////////////////
    //   LES CANDIDATS / GROUPES      //
    ////////////////////////////////////

    let candidats_pres_2017 = getCandidats($presidentielle_2017_cp);
    let candidats_pres_2022 = getCandidats($presidentielle_2022_cp);
    let candidats_leg_2017 = derived(legislatives_2017_cp,
        ($legislatives_2017_cp) => getCandidats($legislatives_2017_cp) );

    let groupes_politiques_pres_2017 = getGroupesPolitiques('pres_2017', candidats_pres_2017);
    let groupes_politiques_pres_2022 = getGroupesPolitiques('pres_2022', candidats_pres_2022);

    let groupes_politiques_leg_2017 = derived(candidats_leg_2017, 
        $candidats_leg_2017 => getGroupesPolitiques('leg_2017', $candidats_leg_2017));
    
    ////////////////////////////////////////////////
    //  CONTEXTES APRES AVOIR CHARGÉ LES DONNEES  //
    ////////////////////////////////////////////////

    // La sélection active, bind avec la carte, à la base tout est sélectionné
	let selection = writable($codes_communes); 

    setContext('codes-communes', codes_communes); // Les communes dans la circo du département sélectionné
    setContext('communes-actives', selection);

    // Les candidats
    setContext('candidats-presidentielle-2017', candidats_pres_2017);
    setContext('candidats-presidentielle-2022', candidats_pres_2022);
    setContext('candidats-legislatives-2017', candidats_leg_2017);

    setContext('groupes-politiques-presidentielles-2017', groupes_politiques_pres_2017);
    setContext('groupes-politiques-presidentielles-2022', groupes_politiques_pres_2022);
    setContext('groupes-politiques-legislatives-2017', groupes_politiques_leg_2017);

    // Les données
    setContext('presidentielle-2017', presidentielle_2017_circo);
    setContext('presidentielle-2017-cp', presidentielle_2017_cp);
    setContext('presidentielle-2017-bureau', presidentielle_2017_bureau);

    setContext('presidentielle-2022', presidentielle_2022_circo);
    setContext('presidentielle-2022-cp', presidentielle_2022_cp);
    setContext('presidentielle-2022-bureau', presidentielle_2022_bureau);

    setContext('legislatives-2017', legislatives_2017_circo);
    setContext('legislatives-2017-cp', legislatives_2017_cp);
    setContext('legislatives-2017-bureau', legislatives_2017_bureau);

    //////////////////////////////////////////////
    //          CHECK SI TOUT VA BIEN           //
    //////////////////////////////////////////////

    $: console.log(`Département: ${$dpt}, circo: ${$circo}`);
    $: console.log(`Sélection active: ${$selection}`);
    $: console.log($circos_dpt); // [1,2,3,4,5] initialement

    console.log("CANDIDATS PRÉSIDENTIELLE 2017");
    console.log(candidats_pres_2017);

    console.log("GROUPES POLITIQUES PRÉSIDENTIELLE 2017");
    console.log(groupes_politiques_pres_2017);

    console.log("CANDIDATS PRÉSIDENTIELLE 2022");
    console.log(candidats_pres_2022);

    console.log("GROUPES POLITIQUES PRÉSIDENTIELLE 2017");
    console.log(groupes_politiques_pres_2022);


    $: {
        console.log("CANDIDATS LÉGISLATIVES 2017");
        console.log($candidats_leg_2017);

        console.log("GROUPES POLITIQUES LEGISLATIVES 2017");
        console.log($groupes_politiques_leg_2017);

        console.log("PRÉSIDENTIELLE 2017");
        console.log($presidentielle_2017_circo);

        console.log("LÉGISLATIVES 2017");
        console.log($legislatives_2017_circo);

        console.log("PRÉSIDENTIELLE 2022");
        console.log($presidentielle_2022_circo);

        console.log("PRÉSIDENTIELLE 2017 CP");
        console.log($presidentielle_2017_cp);

        console.log("PRÉSIDENTIELLE 2017 BUREAU");
        console.log($presidentielle_2017_bureau);

        console.log("PRÉSIDENTIELLE 2022 CP");
        console.log($presidentielle_2022_cp);
        
        console.log("PRÉSIDENTIELLE 2022 BUREAU");
        console.log($presidentielle_2022_bureau);

        console.log("LÉGISLATIVES 2017 BUREAU");
        console.log($legislatives_2017_bureau);

        console.log("LÉGISLATIVES 2017 CP");
        console.log($legislatives_2017_cp);
    }

    function handleDepartementChange () {
        dpt_circo_choisis = false;
    }
    
    function handleCircoChange() {
        if ($circo != '') {
            $selection = $codes_communes;
            dpt_circo_choisis = true;
        }
    }

</script>

<div id="credits">
    <p>Une application pour l'Union Populaire Ecologique et Sociale, par Mathieu Guglielmino. Données tirées de <a href="https://www.data.gouv.fr/fr/">data.gouv.fr</a>.</p>
</div>

<div class="geo-select">
    <label for="dpt-select">Sélectionnez un département:</label>

    <select name="dpt" id="dpt-select" bind:value={$dpt} on:change={handleDepartementChange}>
        <option value="">--choisissez un département--</option>
        {#each dpt_paca as dpt}
        <option value={dpt.code_dpt}>{dpt.code_dpt} - {dpt.nom_dpt}</option>
        {/each}
    </select>

    <label for="circo-select">Sélectionnez une circo:</label>

    <select name="dpt" id="circo-select" bind:value={$circo} on:change={handleCircoChange} >
        {#if !dpt_circo_choisis}
            <option value="" selected>--choisissez une circonscription--</option>
        {/if}

        {#each $circos_dpt as circ}
            <option value={circ}>{circ}ème circonscription</option>
        {/each}
        
    </select>
</div>

{#await $map_communes then communes}
{#await $map_bureaux then bureaux}

<!-- Le taux de conviction des abstentionnistes sur les 5 dernières années

<ComparaisonPresidentielles
    {communes}
    {bureaux}
    {score_par_commune}
    {candidats_pres_2017}
    {pres_2017}
    {candidats_pres_2022}
    {pres_2022} />   -->

{#if dpt_circo_choisis}
    <DesistementsLegislatives
        {communes}
        {bureaux} />
{/if}

{/await}
{/await}


<!-- Les électeurs de Mélenchon qui sont restés chez eux -->

<style>

#credits {
    font-size: 12px;
}

.geo-select {
    padding: 20px;
}
</style>
<!--
			
<div class="panel">
					<Map {communes} candidats={candidats_pres_2022} results={res_pres_2022} />
					<Legend group_size={group_size_pres_2022} results={res_pres_2022} groupes_politiques={groupes_politiques_pres_2022} candidats={candidats_pres_2022} />
				</div>

			{#await leg_2017}
				<p>Loading...</p>
			{:then res_leg_2017}

			{#await pres_2022}
				<p>Loading...</p>
			{:then res_pres_2022}

			<section>
				<div class="panel">
					<Map {communes} candidats={candidats_pres_2017} results={res_pres_2017} />
					<Legend group_size={group_size_pres_2017} results={res_pres_2017} groupes_politiques={groupes_politiques_pres_2017} candidats={candidats_pres_2017} />
				</div>
		
				<div class="panel">
					<Map {communes} candidats={candidats_pres_2022} results={res_pres_2022} />
					<Legend group_size={group_size_pres_2022} results={res_pres_2022} groupes_politiques={groupes_politiques_pres_2022} candidats={candidats_pres_2022} />
				</div>
		
				<div class="panel">
					<Map {communes} candidats={candidats_leg_2017} results={res_leg_2017} />
					<Legend group_size={group_size_leg_2017} results={res_leg_2017} groupes_politiques={groupes_politiques_leg_2017} candidats={candidats_leg_2017} />
				</div>
		
				
				</section>

			{:catch error}
				<p class="error">{error.message}</p>
			{/await}
			
			{:catch error}
				<p class="error">{error.message}</p>
			{/await}
		
			
			-->