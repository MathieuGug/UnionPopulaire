<script>
    import { rollup, sum } from 'd3-array';

    import { cp_circo_5 } from './candidats.js';

    import ComparaisonPresidentielles from './slides/ComparaisonPresidentielles.svelte';
    import DesistementsLegislatives from './slides/DesistementsLegislatives.svelte';

    export let communes, bureaux, res_pres_2017, res_leg_2017, res_pres_2022;

	// Data blending
    function scoreParCommuneParElection(resultats) {
        let resultats_cp_nom = rollup(resultats, v => ({
            total_voix: sum(v, d => d.voix),
            total_inscrits: sum(v, d => d.votants)
        }), d => d.cp, d => d.nom);

        return resultats_cp_nom;
    }

    function scoreParCommuneParBureauParElection(resultats) {
        let resultats_cp_bureau_nom = rollup(resultats, v => ({
            total_voix: sum(v, d => d.voix),
            total_inscrits: sum(v, d => d.votants)
        }), d => d.id_b_vote, d => d.nom);

        return resultats_cp_bureau_nom;
    }

    function scoreParElection (res_pres_2017, res_leg_2017, res_pres_2022) {
        return {
            pres_2017: scoreParCommuneParElection(res_pres_2017),
            leg_2017: scoreParCommuneParElection(res_leg_2017),
            pres_2022: scoreParCommuneParElection(res_pres_2022)
        }
    }

    function scoreParElectionParBureau (res_pres_2017, res_leg_2017, res_pres_2022) {
        return {
            pres_2017_bureau: scoreParCommuneParBureauParElection(res_pres_2017),
            leg_2017_bureau: scoreParCommuneParBureauParElection(res_leg_2017),
            pres_2022_bureau: scoreParCommuneParBureauParElection(res_pres_2022)
        }
    }

    function scoreParCommune ( { pres_2017, leg_2017, pres_2022 } ) {
        /* Return an object {cp: {pres_2017, leg_2017, pres_2022} } where the results are a map for each candidate in the election */
		let score_par_commune = cp_circo_5.map( cp =>
            [cp, {
                pres_2017: pres_2017.get(cp),
                leg_2017: leg_2017.get(cp),
                pres_2022: pres_2022.get(cp)
            }]);

        return Object.fromEntries(new Map(score_par_commune));
        };

       
    let { pres_2017, leg_2017, pres_2022 } = scoreParElection(res_pres_2017, res_leg_2017, res_pres_2022);
    let { pres_2017_bureau, leg_2017_bureau } = scoreParElectionParBureau(res_pres_2017, res_leg_2017, res_pres_2022);

    let score_par_commune = scoreParCommune( { pres_2017, leg_2017, pres_2022 } );
    console.log('Score par commune:')
    console.log(score_par_commune);
    console.log('Pres_2017');
    console.log(pres_2017);
    console.log('Leg_2017');
    console.log(leg_2017);
    console.log('Pres_2022');
    console.log(pres_2022);

</script>

<!-- Le taux de conviction des abstentionnistes sur les 5 dernières années -->
<ComparaisonPresidentielles {communes} {bureaux} {score_par_commune} {pres_2017} {pres_2022} /> 

<!-- Les électeurs de Mélenchon qui sont restés chez eux -->
<DesistementsLegislatives {communes} {bureaux} {pres_2017} {pres_2017_bureau} {leg_2017} {leg_2017_bureau} />

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