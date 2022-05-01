<script>
    import { getContext, setContext } from "svelte";
    import { sum } from 'd3-array';
    import LegendGroup from './LegendGroup.svelte';
    
    export let resultats_election, candidats, groupes_politiques;
    export let group_size;

    // CP de la commune survolée    
    let hovered_selection = getContext('commune-hovered');
    let selection = getContext('communes-actives')
    
    // Remettre à zéro le score des candidats lors de la désélection
    function resetScores(candidats) {
        Object.keys(candidats).forEach( d => {
            candidats[d].total_voix = 0
         } );

        candidats['abstention'].total_voix = 0
        candidats['abstention'].color = '#000411';
        candidats['blancs'].total_voix = 0
        candidats['blancs'].color = '#AEB7B3';
        candidats['nuls'].total_voix = 0
        candidats['nuls'].color = '#E1EFE6';
        return candidats;
    }

    console.log($candidats);
    console.log(groupes_politiques);

    

    setContext('candidats', $candidats);
    setContext('groupes-politiques', groupes_politiques);

    
    $: if ($selection == []) {
        candidats = resetScores(candidats);
    }
    

    let total_inscrits = 0;
    console.log(resultats_election);

    /////////////////////////////////////////////////
    //  ACTUALISATION EN FONCTION DE LA SELECTION  //
    /////////////////////////////////////////////////

    // Soit on survole une commune, et on affiche les résultats de cette commune uniquement
    // Sinon, on affiche la somme de la sélection
    $: {
        $candidats = resetScores($candidats);
        if ($hovered_selection != '') {
            console.log($hovered_selection);
            total_inscrits = resultats_election.get($hovered_selection).get('abstention').total_inscrits;

            Object.keys($candidats).forEach( nom => {
                $candidats[nom].total_voix = resultats_election.get($hovered_selection).get(nom).total_voix;
            })

        } else {
            for (let cp of $selection) {
                Object.keys($candidats).forEach( nom => {
                    $candidats[nom].total_voix = $candidats[nom].total_voix + resultats_election.get(cp).get(nom).total_voix;
                })
            }
        }

        total_inscrits = sum(Object.keys($candidats), nom => $candidats[nom].total_voix);
    }
</script>

<svg height="550px" width="450px">
    <g transform="translate(0, 20)">
        <g class="total" transform="translate(10, 0)">
            <text>INSCRITS</text>
            <text transform="translate(200, 0)">{total_inscrits}</text>
        </g>

        
        {#each [...Object.keys(groupes_politiques)] as groupe, k}
            <LegendGroup {candidats} {groupes_politiques} {groupe} {total_inscrits} transform="translate(10, {30 + group_size[k]})"/>
        {/each}
        
    </g>
</svg>