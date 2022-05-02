<script>
    import { rollup, sum } from 'd3-array';
    import { getContext, setContext } from 'svelte';
    import { writable, derived } from 'svelte/store';

    import { loadMap, loadBureaux } from './load_data.js';

    import ComparaisonPresidentielles from './slides/ComparaisonPresidentielles.svelte';
    import DesistementsLegislatives from './slides/DesistementsLegislatives.svelte';

    export let all_pres_2017, all_leg_2017, all_pres_2022;


    // Fonction pour récupérer les élements unique d'un array avec filter
    // Utile pour récupérer les numéros des circos par département
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // Les circonscriptions dans le département
	function circosDansDepartement (dpt) { 
        let circos_dpt = all_pres_2017
            .filter(d => +d.code_dpt == dpt)
            .map(d => +d.code_circ)
            .filter(onlyUnique);

        return circos_dpt;
    }

    function communesDansCirco (dpt, circo) {
        let codes_communes = all_pres_2017
            .filter(d => (d.code_dpt == dpt) & (d.code_circ == circo) )
            .map(d => d.code_commune)
            .filter(onlyUnique);

        return codes_communes;
    }

    /////////////////////////////////////////////////
    //       LES STORES DYNAMIQUES UTILISÉS        //
    /////////////////////////////////////////////////
    // padding de 2
    let dpt = getContext('departement'); // Initialement '84'
    let circo = getContext('circonscription'); // Initialement '05'

    $: console.log(`Département: ${$dpt}, circo: ${$circo}`);

    // Les départements en région PACA
    let dpt_paca = [4, 5, 6, 13, 83, 84];

	$: circos_dpt = circosDansDepartement($dpt);

    let codes_communes = derived([dpt, circo], ([$dpt, $circo]) => (communesDansCirco($dpt, $circo)));
    setContext('codes-communes', codes_communes);

    $: console.log(circos_dpt); // [1,2,3,4,5] initialement

	let selection = writable($codes_communes);
    setContext('communes-actives', selection);
    console.log($selection);


    /////////////////////////////////////////////////////
    //  FILTRER LES DONNEES EN FONCTION DU DPT / CIRCO //
    /////////////////////////////////////////////////////

    function filtrerResultats(resultats, dpt, circo) {
        return resultats.filter(d => (+d.code_dpt == dpt) & (+d.code_circ == circo))
    }

    let res_pres_2017 = derived([dpt, circo], ([$dpt, $circo]) => filtrerResultats(all_pres_2017, $dpt, $circo));
    let res_leg_2017 = derived([dpt, circo], ([$dpt, $circo]) => filtrerResultats(all_leg_2017, $dpt, $circo));
    let res_pres_2022 = derived([dpt, circo], ([$dpt, $circo]) => filtrerResultats(all_pres_2022, $dpt, $circo));


	// Data blending
    function scoreParElection (pres_2017_filtered, leg_2017_filtered, pres_2022_filtered) {
        console.log(leg_2017_filtered);
        return {
            pres_2017: scoreParCommuneParElection(pres_2017_filtered),
            leg_2017: scoreParCommuneParElection(leg_2017_filtered),
            pres_2022: scoreParCommuneParElection(pres_2022_filtered)
        }
    }

    function scoreParCommuneParElection(resultats) {
        let resultats_cp_nom = rollup(resultats, v => ({
            nuance: v[0].nuance,
            nom: v[0].nom + ' ' + v[0].prenom,
            total_voix: sum(v, d => d.voix),
            total_inscrits: sum(v, d => d.votants)
        }), d => d.cp, d => d.nom);

        return resultats_cp_nom;
    }

    function scoreParCommuneParBureauParElection(resultats) {
        let resultats_cp_bureau_nom = rollup(resultats, v => ({
            nuance: v[0].nuance,
            nom: v[0].nom + ' ' + v[0].prenom,
            total_voix: sum(v, d => d.voix),
            total_inscrits: sum(v, d => d.votants)
        }), d => d.id_b_vote, d => d.nom);

        return resultats_cp_bureau_nom;
    }

    function scoreParElectionParBureau (pres_2017_filtered, leg_2017_filtered, pres_2022_filtered) {
        return {
            pres_2017_bureau: scoreParCommuneParBureauParElection(pres_2017_filtered),
            leg_2017_bureau: scoreParCommuneParBureauParElection(leg_2017_filtered),
            pres_2022_bureau: scoreParCommuneParBureauParElection(pres_2022_filtered)
        }
    }

    function scoreParCommune ( { pres_2017, leg_2017, pres_2022 }, circos_dpt ) {
        /* Return an object {cp: {pres_2017, leg_2017, pres_2022} } where the results are a map for each candidate in the election */
		let score_par_commune = circos_dpt.map( cp =>
            [cp, {
                pres_2017: pres_2017.get(cp),
                leg_2017: leg_2017.get(cp),
                pres_2022: pres_2022.get(cp)
            }]);

        return Object.fromEntries(new Map(score_par_commune));
        };

    $: ( { pres_2017, leg_2017, pres_2022 } = scoreParElection($res_pres_2017, $res_leg_2017, $res_pres_2022) );
    $: ( { pres_2017_bureau, leg_2017_bureau } = scoreParElectionParBureau($res_pres_2017, $res_leg_2017, $res_pres_2022) );

    $: console.log(leg_2017_bureau);
    $: score_par_commune = scoreParCommune( { pres_2017, leg_2017, pres_2022 }, circos_dpt );
    /*
    console.log('Score par commune:')
    $: console.log(score_par_commune);
    console.log('Pres_2017');
    $: console.log(pres_2017);
    console.log('Leg_2017');
    $: console.log(leg_2017);
    console.log('Pres_2022');
    $: console.log(pres_2022);
    */

    $: console.log(leg_2017)

    //////////////////////////////////////////////
    //  LIRE LA CARTE DES COMMUNES DE LA CIRCO  //
    //////////////////////////////////////////////

    let map_communes = derived(codes_communes, $codes_communes => loadMap($codes_communes));
    let map_bureaux = derived(codes_communes, $codes_communes => loadBureaux($codes_communes));

</script>

<div class="geo-select">
    <label for="dpt-select">Sélectionnez un département:</label>

    <select name="dpt" id="dpt-select" bind:value={$dpt} on:change={() => $selection = $codes_communes}>
        <option value="">--choisissez un département--</option>
        {#each dpt_paca as dpt}
        <option value={dpt}>{dpt}</option>
        {/each}
    </select>

    <label for="circo-select">Sélectionnez une circo:</label>

    <select name="dpt" id="circo-select" bind:value={$circo} on:change={() => $selection = $codes_communes} >
        <option value="">--choisissez une circonscription--</option>
        {#each circos_dpt as circ}
        <option value={circ}>{circ}</option>
        {/each}
    </select>
</div>

{#await $map_communes then communes}
{#await $map_bureaux then bureaux}
<DesistementsLegislatives {communes} {bureaux} {pres_2017} {pres_2017_bureau} {leg_2017} {leg_2017_bureau} />
{/await}
{/await}


<!--
 Le taux de conviction des abstentionnistes sur les 5 dernières années
<ComparaisonPresidentielles {communes} {bureaux} {score_par_commune} {pres_2017} {pres_2022} />  -->

<!-- Les électeurs de Mélenchon qui sont restés chez eux -->

<style>

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