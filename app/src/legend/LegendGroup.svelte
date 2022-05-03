<script>
    import { getContext } from "svelte";
    import { scaleLinear } from 'd3-scale';

    export let groupe, transform;


    export let total_inscrits, candidats, groupes_politiques;

    console.log(candidats);
    
    let hovered_selection = getContext('commune-hovered')
    let selection = getContext('communes-actives');

    let xScale = scaleLinear()
        .domain([0, 1])
        .range([0, 380]);

</script>


<g class="{groupe.toLowerCase()}-legend" {transform} >
    {#each groupes_politiques[groupe] as candidat, i}
        <text transform="translate(0, {22*i})">{candidat}</text>

        
        <rect x="300" y={22*i-15} width={xScale(candidats[candidat].total_voix / total_inscrits)} height="20" fill={candidats[candidat].color} />
        <text text-anchor="right" transform="translate(200, {22*i})">{candidats[candidat].total_voix}</text>
        {#if candidats[candidat].total_voix != 0}
            <text text-anchor="right" transform="translate(250, {22*i})">{Math.round(candidats[candidat].total_voix / total_inscrits * 1000)/10}%</text>
        {/if}
    
    {/each}
</g>