<script>
    import { getContext, setContext } from "svelte";
    import { rollup, sum } from 'd3-array';

    import LegendGroup from './LegendGroup.svelte';

    import { candidats_pres_2017, candidats_leg_2017, candidats_pres_2022 } from '../candidats.js';

    import { groupes_politiques_pres_2017, groupes_politiques_leg_2017, groupes_politiques_pres_2022 } from '../candidats.js';
    import { writable } from "svelte/store";

    export let resultats_election;
    export let type, group_size;

    let candidats = writable({});
    let groupes_politiques = writable({});

    // CP de la commune survolée    
    let hovered_selection = getContext('commune-hovered');
    let selection = getContext('communes-actives')
    
    if (type == "pres_2017") {
        $candidats = candidats_pres_2017;
        $groupes_politiques = groupes_politiques_pres_2017;
    } else if ( type == "leg_2017") {
        $candidats = candidats_leg_2017;
        $groupes_politiques = groupes_politiques_leg_2017;
    
    } else if (type == "pres_2022") {
        $candidats = candidats_pres_2022;
        $groupes_politiques = groupes_politiques_pres_2022;
    }

    setContext('candidats', candidats);
    setContext('groupes-politiques', groupes_politiques);

    $candidats = resetScores($candidats);

    // Transform the "candidats" object with the score values to be updated based on selection
    let score_par_candidat = {};
    
    function resetScores(candidats) {
        Object.keys(candidats).forEach( d => (
            candidats[d] = {total_voix: 0, color: candidats[d].color}
        ) );

        candidats['abstention'] = {total_voix: 0, color: '#000411'};
        candidats['blancs'] = {total_voix: 0, color: '#AEB7B3'};
        candidats['nuls'] = {total_voix: 0, color: '#E1EFE6'};
        return candidats;
    }
    
    $: if ($selection == []) {
        $candidats = resetScores($candidats);
    }

    let total_inscrits = 0;

    $: {
            $candidats = resetScores($candidats);
            // Si on survole la carte, alors on affiche les statistiques pour la commune
            if ($hovered_selection != '') {
                total_inscrits = resultats_election.get($hovered_selection).get('abstention').total_inscrits;

                Object.keys($candidats).forEach( d => {
                    $candidats[d].total_voix = resultats_election.get($hovered_selection).get(d).total_voix;
                })
            } // Sinon, on affiche la somme de la sélection active (plusieurs communes)
            else {

                for (let cp of $selection) {

                    Object.keys($candidats).forEach( d => {
                        $candidats[d].total_voix = $candidats[d].total_voix + resultats_election.get(cp).get(d).total_voix;
                    })
                }

            }

            total_inscrits = sum(Object.keys($candidats), d => $candidats[d].total_voix);

    }
</script>

<svg height="550px" width="450px">
    <g transform="translate(0, 20)">
        <g class="total" transform="translate(10, 0)">
            <text>INSCRITS</text>
            <text transform="translate(200, 0)">{total_inscrits}</text>
        </g>

        
        {#each [...Object.keys($groupes_politiques)] as groupe, k}
            <LegendGroup {groupe} {resultats_election} {score_par_candidat} {total_inscrits} transform="translate(10, {30 + group_size[k]})"/>
        {/each}
        
    </g>
</svg>