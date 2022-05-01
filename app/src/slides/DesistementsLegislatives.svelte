<script>
    import { getContext, onMount } from 'svelte';

    import { scaleLinear, scaleSequential, scaleOrdinal } from 'd3-scale';

    import Map from '../Map.svelte';
    import MapSelection from '../MapSelection.svelte';
	import Legend from '../legend/Legend.svelte';    
    import DesistementsParBureau from './DesistementsParBureau.svelte';

    import { candidats_pres_2017, candidats_leg_2017, candidats_pres_2022 } from '../candidats.js';


    export let communes, bureaux, pres_2017, pres_2017_bureau, leg_2017, leg_2017_bureau;

    let selection = getContext('communes-actives');

    let display_score = "CHOTARD";

    let group_size_pres_2017 = [0, 80, 110, 150, 290, 350];
	let group_size_leg_2017 = [0, 80, 110, 150, 290, 370];

    // Progression de l'abstention
    let correspondance_leg_pres = {
        'VIARD': 'MACRON',
        'AUBERT': 'FILLON',
        'CHOTARD': 'MÉLENCHON',
        'THOMAS DE MALEVILLE': 'LE PEN'
    };

    let colorScaleResults = scaleSequential(["blue", "red"])
        .domain([-200, 200]);

    // En fonction d'un CP et d'un candidat, check la perte de voix entre la présidentielle et les législatives
    let differencePresidentielleLegislatives, differencePresidentielleLegislativesBureau;

    $: {
        differencePresidentielleLegislatives = function(cp) {
            let score_pres = pres_2017.get(cp).get(correspondance_leg_pres[display_score]).total_voix;
            let score_leg = leg_2017.get(cp).get(display_score).total_voix;

            return score_pres - score_leg;
        }
    }

    $: {
        differencePresidentielleLegislativesBureau = function(id_b_vote) {
            let score_pres = pres_2017_bureau.get(id_b_vote).get(correspondance_leg_pres[display_score]).total_voix;
            let score_leg = leg_2017_bureau.get(id_b_vote).get(display_score).total_voix;

            return score_pres - score_leg;
        }
    }

</script>

<div class="analyse">
    <h1>Démobilisation de l'électorat entre la présidentielle et les législatives de 2017</h1>

    <p>La moitié des électeurs ne s'est pas déplacée, ce qui représente 40.000 personnes. Il manquait pourtant seulement 3.475 voix à la FI pour être qualifiée au second tour. Analyse.</p>

    <h2>Mobilisation exceptionnelle de l'électorat macroniste...</h2>

    <p>Jean VIARD, candidat LREM bat le score de Macron dans 38 communes ! Au niveau de la circonscription il fait mieux que M. MACRON à la présidentielle (13.291, 16.2% des inscrits vs 12.954, 15.8% des inscrits.</p>

    <p>Comment s'explique cette mobilisation ? La célébrité du sociologue ? L'engouement post-élection pour le nouveau parti présidentiel ? A comparer, a minima, avec les circonscriptions alentours pour en tirer des enseignements.</p>

    <h2>...mais démobilisation générale de tous les autres partis</h2>

    <h3>Par l'exemple</h3>

    <p>À Apt, la FI perd 803 voix, le FN perd 983 voix, LR perd (uniquement) 205, et LREM perd le nombre ridicule de 42 voix.</p>

    <h3>Qu'est-ce que cela signifie pour la stratégie de la gauche ?</h3>

    <p>Le candidat FI Stéphane CHOTARD, perd en moyenne 10 points de ses électeurs par commune. La démobilisation des électeurs de Mélenchon, et plus généralement des partis traditionnels (LR ou le FN), a conduit a une participation de seulement 50%. Ce sont 40k électeurs sur la circonscription qui n'ont pas fait le déplacement.</p>


    <p>Julien AUBERT (LR), arrivé en 2è position, est qualifié pour le second tour avec 8.367 voix, 3.475 voix d'avance sur Stéphane Chotard. Or, il y a 7.352 électeurs de Mélenchon qui n'ont pas fait le déplacement. C'est-à-dire que convaincre 50% des abstentionnistes précédemment électeurs de Mélenchon à la présidentielle aurait suffit à se qualifier pour le second tour.</p>
</div>

<div id="desistements-legislatives">

    <div class="map-navigation">
        <div class="map-widgets">
            <!--
            <div class="election-selection">
                <input bind:group={election} type="radio" name="election" id="electionChoixLegislatives" value="legislatives">
                <label for="electionChoixLegislatives">Législatives 2017</label>
            
                <input bind:group={election} type="radio" name="election" id="electionChoixPresidentielle" value="presidentielle">
                <label for="electionChoixPresidentielle">Présidentielles 2017</label>

                <input bind:group={election} type="radio" name="election" id="electionDifferent" value="differentiel">
                <label for="electionDifferent">Différentiel</label>

            </div>
            -->

            <div class="candidat-selection">
                <select bind:value={display_score} style="width: 100%;">
                    {#each ['VIARD', 'AUBERT', 'CHOTARD', 'THOMAS DE MALEVILLE'] as candidat}
                        <option value={candidat} >{candidats_leg_2017[candidat].nom}</option>
                    {/each}

                </select>
            </div>

            <MapSelection />
           
            
        </div>

        <!--
        {#if election == "presidentielle"}
            <Map communes={communes}
                candidats={candidats_pres_2017} 
                results={res_pres_2017} 
                color={} />
        {:else}
        -->
        <Map communes={communes} 
            bureaux={bureaux}
            colors={(code_commune) => colorScaleResults(differencePresidentielleLegislatives(code_commune))} />
        
    </div>

    <div class="resultats">
        <Legend 
            type="pres_2017"
            group_size={group_size_pres_2017} 
            resultats_election={pres_2017} />
    </div>

    <div class="resultats">
        <Legend 
            type="leg_2017"
            group_size={group_size_leg_2017} 
            resultats_election={leg_2017} />
    </div>
</div>

<div id="desistements-par-bureau">
    <DesistementsParBureau 
        resultats={leg_2017_bureau} 
        {bureaux} 
        {differencePresidentielleLegislativesBureau} />
</div>

<style>
#desistements-legislatives {
    display: flex;
    flex-direction: row;
    height: auto;
}

.resultats {
    width: 100%;
}
</style>
