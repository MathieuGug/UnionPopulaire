<script>
    import { getContext, setContext } from 'svelte';
    import { writable, derived } from 'svelte/store';
    import { scaleSequential } from 'd3-scale';

    import { loadMap, loadBureaux, loadCommunes } from './load_data.js';

    import ComparaisonPresidentielles from './slides/ComparaisonPresidentielles.svelte';
    import DesistementsLegislatives from './slides/DesistementsLegislatives.svelte';
    import MapSelection from './MapSelection.svelte';
    import Map from './Map.svelte';

    import { getCandidats, getGroupesPolitiques, scoreParCommune, scoreParBureau } from './utils.js';
    import { filtrerResultats } from './utils.js';
    import { circosDansDepartement, communesDansCirco } from './utils.js';
    import { correspondancePresidentielleLegislative } from './utils.js';

    /////////////////////////////////////////////////
    //       PROPS : RESULTATS DES ELECTIONS       //
    /////////////////////////////////////////////////

    // Ce sont les résultats complets, on va les filtrer ensuite en fonction des stores
    // pour le département et la circo

    export let resultats_presidentielles_2017, resultats_legislatives_2017, resultats_presidentielles_2022, resultats_legislatives_2022;

    /////////////////////////////////////////////////
    //       LES STORES DYNAMIQUES UTILISÉS        //
    /////////////////////////////////////////////////
    let desistement = 2022;

    let dpt = getContext('departement'); // Initialement 84
    let circo = getContext('circonscription'); // Initialement 5
    let dpt_circo_choisis = true; // Quand on change le département

    // Les départements en région PACA
    let dpt_paca = [
        {code_dpt: 4, nom_dpt: "Alpes de Hautes-Provences"},
        // {code_dpt: 5, nom_dpt: "Hautes-Alpes"},
        // {code_dpt: 6, nom_dpt: "Alpes-Maritimes"},
        // {code_dpt: 13, nom_dpt: "Bouches-du-Rhône"},
        {code_dpt: 83, nom_dpt: "Var"},
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
    let map_communes_coordinates = derived(codes_communes, $codes_communes => loadCommunes([$codes_communes]));
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

    let legislatives_2022_circo = derived([dpt, circo], ([$dpt, $circo]) => 
        filtrerResultats(resultats_legislatives_2022, $dpt, $circo));

    let presidentielle_2022_circo = derived([dpt, circo], ([$dpt, $circo]) => 
        filtrerResultats(resultats_presidentielles_2022, $dpt, $circo));

    // Key en fonction du CODE POSTAL { cp: {'abstention': ..., 'candidat': ...} }
    let presidentielle_2017_cp = derived(presidentielle_2017_circo, $presidentielle_2017_circo =>
        scoreParCommune($presidentielle_2017_circo));

    let legislatives_2017_cp = derived(legislatives_2017_circo, $legislatives_2017_circo =>
        scoreParCommune($legislatives_2017_circo));    

    let legislatives_2022_cp = derived(legislatives_2022_circo, $legislatives_2022_circo =>
        scoreParCommune($legislatives_2022_circo));    

    let presidentielle_2022_cp = derived(presidentielle_2022_circo, $presidentielle_2022_circo =>
        scoreParCommune($presidentielle_2022_circo));

    // Key en fonction du BUREAU DE VOTE { id_b_vote: {'abstention': ..., 'candidat': ...} }
    let presidentielle_2017_bureau = derived(presidentielle_2017_circo, $presidentielle_2017_circo =>
        scoreParBureau($presidentielle_2017_circo));

    let legislatives_2017_bureau = derived(legislatives_2017_circo, $legislatives_2017_circo =>
        scoreParBureau($legislatives_2017_circo));

    let legislatives_2022_bureau = derived(legislatives_2022_circo, $legislatives_2022_circo =>
        scoreParBureau($legislatives_2022_circo));        

    let presidentielle_2022_bureau = derived(presidentielle_2017_circo, $presidentielle_2017_circo =>
        scoreParBureau($presidentielle_2017_circo));

    ////////////////////////////////////
    //   LES CANDIDATS / GROUPES      //
    ////////////////////////////////////

    let candidats_pres_2017 = getCandidats($presidentielle_2017_cp);
    let candidats_pres_2022 = getCandidats($presidentielle_2022_cp);
    let candidats_leg_2017 = derived(legislatives_2017_cp,
        ($legislatives_2017_cp) => getCandidats($legislatives_2017_cp) );
    let candidats_leg_2022 = derived(legislatives_2022_cp,
        ($legislatives_2022_cp) => getCandidats($legislatives_2022_cp) );

    let candidats_leg_display;
    $: if (desistement == 2022) {
        candidats_leg_display = candidats_leg_2022;
    } else {
        candidats_leg_display = candidats_leg_2017;
    }

    let groupes_politiques_pres_2017 = getGroupesPolitiques('pres_2017', candidats_pres_2017);
    let groupes_politiques_pres_2022 = getGroupesPolitiques('pres_2022', candidats_pres_2022);

    let groupes_politiques_leg_2017 = derived(candidats_leg_2017, 
        $candidats_leg_2017 => getGroupesPolitiques('leg_2017', $candidats_leg_2017));

    let groupes_politiques_leg_2022 = derived(candidats_leg_2022, 
        $candidats_leg_2022 => getGroupesPolitiques('leg_2022', $candidats_leg_2022));
    
    ////////////////////////////////////////////////
    //  CONTEXTES APRES AVOIR CHARGÉ LES DONNEES  //
    ////////////////////////////////////////////////

    // Le candidat dont on affiche la perte de voix
    let display_score = writable(''); 
    setContext("display-score", display_score);

    // Afficher les résultats du candidat FI
    $: Object.keys($candidats_leg_display).forEach(id => {
        if ($candidats_leg_display[id].nuance == "NUP" || $candidats_leg_display[id].nuance == "FI") {
            $display_score = id;
        }
    });

    let colorScaleResults = scaleSequential(["blue", "red"])
        .domain([-200, 200]);

    // La sélection active, bind avec la carte, à la base tout est sélectionné
	let selection = writable($codes_communes); 

    setContext('codes-communes', codes_communes); // Les communes dans la circo du département sélectionné
    setContext('communes-actives', selection);

    // Les candidats
    setContext('candidats-presidentielle-2017', candidats_pres_2017);
    setContext('candidats-presidentielle-2022', candidats_pres_2022);
    setContext('candidats-legislatives-2017', candidats_leg_2017);
    setContext('candidats-legislatives-2022', candidats_leg_2022);

    setContext('groupes-politiques-presidentielles-2017', groupes_politiques_pres_2017);
    setContext('groupes-politiques-presidentielles-2022', groupes_politiques_pres_2022);
    setContext('groupes-politiques-legislatives-2017', groupes_politiques_leg_2017);
    setContext('groupes-politiques-legislatives-2022', groupes_politiques_leg_2022);

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

    setContext('legislatives-2022', legislatives_2022_circo);
    setContext('legislatives-2022-cp', legislatives_2022_cp);
    setContext('legislatives-2022-bureau', legislatives_2022_bureau);


    ////////////////////////////////////////////////////////////////////////////
    //  LA DIFFERENCE ENTRE LE SCORE A LA PRESIDENTIELLE ET AUX LEGISLATIVES  //
    ////////////////////////////////////////////////////////////////////////////

    // A quel candidat de l'élection présidentielle correspond les candidats de l'élection législatives
    let correspondance_leg_pres;

    $: if (desistement == 2022) {
        correspondance_leg_pres = derived(candidats_leg_2022,
            $candidats_leg_2022 => correspondancePresidentielleLegislative(candidats_pres_2022, $candidats_leg_2022));
    } else {
        correspondance_leg_pres = derived(candidats_leg_2017,
            $candidats_leg_2017 => correspondancePresidentielleLegislative(candidats_pres_2017, $candidats_leg_2017));
    }
    setContext("correspondance-presidentielle-legislatives", correspondance_leg_pres);

    // En fonction d'un CP et d'un candidat, check la perte de voix entre la présidentielle et les législatives
    let differencePresidentielleLegislatives;

    $: {
        differencePresidentielleLegislatives = function(cp) {
            // display_score: le nom du candidat dont on observe l'évolution
            // Il faut la correspondance pour la présidentielle.
            let score_pres;
            let score_leg;

            if (desistement == 2022) {
                score_pres = $presidentielle_2022_cp.get(cp).get($correspondance_leg_pres[$display_score]).total_voix;
                score_leg = $legislatives_2022_cp.get(cp).get($display_score).total_voix;
            } else {
                score_pres = $presidentielle_2017_cp.get(cp).get($correspondance_leg_pres[$display_score]).total_voix;
                score_leg = $legislatives_2017_cp.get(cp).get($display_score).total_voix;
            }
            
            return score_pres - score_leg;
        }
    }


    //////////////////////////////////////////////
    //          CHECK SI TOUT VA BIEN           //
    //////////////////////////////////////////////

    $: console.log(`Département: ${$dpt}, circo: ${$circo}`);
    $: console.log(`Afficher le score de ${$display_score}`);
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
        console.log("CANDIDATS LÉGISLATIVES 2022");
        console.log($candidats_leg_2022);

        console.log("GROUPES POLITIQUES LEGISLATIVES 2022");
        console.log($groupes_politiques_leg_2022);

        console.log("PRÉSIDENTIELLE 2017");
        console.log($presidentielle_2017_circo);

        console.log("LÉGISLATIVES 2022");
        console.log($legislatives_2022_circo);

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

        console.log("LÉGISLATIVES 2022 BUREAU");
        console.log($legislatives_2022_bureau);

        console.log("LÉGISLATIVES 2022 CP");
        console.log($legislatives_2022_cp);

        // Réselectionner les communes quand on change de circo
        $selection = $codes_communes;
        $dpt = $dpt;
    }

    function handleDepartementChange () {
        $circo = 1;
    }
    
    function handleCircoChange() {
        $selection = [];
        dpt_circo_choisis = true;
    }

</script>

<div id="credits">
    <p>Une application pour la Nouvelle union populaire, écologique et sociale, par Mathieu Guglielmino (<a href="https://twitter.com/guglimat/">Twitter</a>, <a href="https://cygraph.tech/">CyGraph</a>). Données tirées de <a href="https://www.data.gouv.fr/fr/">data.gouv.fr</a>.</p>
</div>

{#await $map_bureaux then bureaux}

<div id="header">
    <div id="map-navigation" style="width: 300px;">
        <div id="geo-select">
            <div id="map_year" style="display: flex; width:100%; flex-direction: row; justify-content: space-evenly;">
                <input type="radio" bind:group={desistement} value={2017} >
                <label for="desistement_2017">2017</label>
    
                <input type="radio" bind:group={desistement} value={2022} ckecked>
                <label for="desistement_2022">2022</label>
    
            </div>
            
            <label for="dpt-select">Sélectionnez un département:</label>
        
            <select name="dpt" id="dpt-select" bind:value={$dpt} on:input={() => ($circo = 1)}>
                <option value="">--choisissez un département--</option>
                {#each dpt_paca as departement}
                    {#if departement == $dpt}
                        <option value={departement.code_dpt} selected>{departement.code_dpt} - {departement.nom_dpt}</option>
                    {:else}
                    <option value={departement.code_dpt}>{departement.code_dpt} - {departement.nom_dpt}</option>
                    {/if}
                {/each}
            </select>
        
            <label for="circo-select">Sélectionnez une circo:</label>
        
            <select name="dpt" id="circo-select" bind:value={$circo} >
                <option value="">--choisissez une circonscription--</option>
        
                {#each $circos_dpt as circ}
                    <option value={circ}>{circ}ème circonscription</option>
                {/each}
                
            </select>
        </div>

        <div id="candidat-selection">
            <select bind:value={$display_score}>
                <option value="" selected>--choisissez un candidat--</option>
                {#each Object.keys($correspondance_leg_pres) as candidat}
                    <option value={candidat} >{$candidats_leg_display[candidat].nom} - {$candidats_leg_display[candidat].nuance}</option>
                {/each}

            </select>

            <button on:click={() => $selection = $codes_communes}>Tout sélectionner</button>
            <button on:click={() => $selection = []}>Tout désélectionner</button>
        </div>

    </div>


    {#await $map_communes then communes}
    {#await $map_communes_coordinates then communes_coordinates}
    <div class="small-map-container">
        <Map {communes_coordinates} communes={communes} 
            colors={(code_commune) => colorScaleResults(differencePresidentielleLegislatives(code_commune))} />
    </div>
    {/await}
    {/await}
</div>


<DesistementsLegislatives
        {bureaux} />

{/await}


<!-- Les électeurs de Mélenchon qui sont restés chez eux -->

<style>

#credits {
    padding: 10px;
    font-size: 12px;
}

#header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#map-navigation {
    display: flex;
    flex-direction: column;
    align-items: stretch;

}

#geo-select {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

#geo-select option {
    width: 150px;
}

#candidat-selection {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

#candidat-selection option {
    width: 150px;
}

.small-map-container {
    width: 250px;
    height: 250px;
}

@media only screen and (max-width: 800px) {
    #header {
        display: flex;
        flex-direction: column;
    }
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