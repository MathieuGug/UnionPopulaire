<script>
    import { getContext, setContext } from "svelte";
    import { sum } from 'd3-array';    
    import { scaleLinear } from 'd3-scale';
    
    export let resultats_election, candidats, groupes_politiques;
    export let group_size;

    let width;
    $: console.log(width);

    $: xScale = scaleLinear()
        .domain([0, 1])
        .range([0, width/3]);

    // CP de la commune survolée
    let hovered_selection = getContext('commune-hovered');
    let selection = getContext('communes-actives');

    $: console.log($selection);
    
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
    
    $: if ($selection == []) {
        candidats = resetScores(candidats);
    }

    let total_inscrits = 0;

    /////////////////////////////////////////////////
    //  ACTUALISATION EN FONCTION DE LA SELECTION  //
    /////////////////////////////////////////////////

    // Soit on survole une commune, et on affiche les résultats de cette commune uniquement
    // Sinon, on affiche la somme de la sélection
    $: {
        candidats = resetScores(candidats);

        if ($hovered_selection != '') {
            total_inscrits = resultats_election.get($hovered_selection).get('abstention').total_inscrits;

            Object.keys(candidats).forEach( nom => {
                candidats[nom].total_voix = resultats_election.get($hovered_selection).get(nom).total_voix;
            })

        } else {
            console.log(candidats);
            console.log(resultats_election);

            for (let cp of $selection) {
                
                Object.keys(candidats).forEach( nom => {
                    candidats[nom].total_voix = candidats[nom].total_voix + resultats_election.get(cp).get(nom).total_voix;
                })
            }
        }

        total_inscrits = sum(Object.keys(candidats), nom => candidats[nom].total_voix);
    }
</script>

<table bind:clientWidth={width} >
    <tbody>
        <tr>
            <td class="candidat-col">INSCRITS</td>
            <td class="total-voix-col">{total_inscrits}</td>
            <td class="pourcentage-inscrits-col"></td>
            <td class="svg-col"></td>
        </tr>
    </tbody>

    {#each [...Object.keys(groupes_politiques)] as groupe, k}
        <tbody style="height: {group_size[k]}px;">
        {#each groupes_politiques[groupe] as candidat, i}
        <tr>
            <td class="candidat-col">{candidat}</td>
            <td class="total-voix-col">{candidats[candidat].total_voix}</td>
            {#if candidats[candidat].total_voix != 0}
            <td class="pourcentage-inscrits-col">{Math.round(candidats[candidat].total_voix / total_inscrits * 1000)/10}%</td>
            {/if}
            <td class="svg-col"><svg width="100" height="20"><rect x=0 y=0 width={xScale(candidats[candidat].total_voix / total_inscrits)} height="20" fill={candidats[candidat].color} /></svg></td>
        </tr>
        {/each}

        </tbody>
    {/each}
</table>

<style>
tbody {
    display: flex;
    flex-direction: column;
}

tbody td.candidat-col{
  width: 100px;
}

tbody td.total-voix-col{
  width: 60px;
}

tbody td.pourcentage-inscrits-col{
  width: 50px;
}

tbody td.svg-col{
  width: 50px;
}


</style>
<!--
<svg height="550px" width="450px">
    <g transform="translate(0, 20)">
        <g class="total" transform="translate(10, 0)">
            <text>INSCRITS</text>
            <text transform="translate(200, 0)"></text>
        </g>

        
        
        
    </g>
</svg>
-->