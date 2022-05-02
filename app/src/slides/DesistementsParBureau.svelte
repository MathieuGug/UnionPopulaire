<script>
    import { getContext } from 'svelte';
    import { derived } from 'svelte/store';
    let selection = getContext('communes-actives');
    let hovered_selection = getContext('communes-hovered');
    
    export let bureaux, differencePresidentielleLegislativesBureau;
    
    let resultats = getContext('resultats-legislatives-2017');

    let bureaux_filtered = derived(selection, $selection => bureaux
        .filter(d => ($selection).includes(d.code_commune))
        .sort((a, b) => a.code_commune - b.code_commune || a.code_bureau - b.code_bureau));

    $: console.log($bureaux_filtered);
    

</script>

<div class="resultats-par-bureau">
    <table>
        <thead>
          <tr><th>Bureau</th> <th>Ville</th> <th>Code Postal</th> <th>Adresse</th> <th>Inscrits</th> <th>Pertes de voix</th> <th>%</th> </tr>
        </thead>
        <tbody>
        {#each $bureaux_filtered as bureau, i}
        
          <tr>
            <td>{bureau.code_bureau}</td>
            <td>{bureau.ville}</td>
            <td>{bureau.cp}</td>
            <td>{bureau.adresse}</td>

            <td>{$resultats.get(bureau.id_b_code).get('abstention').total_inscrits}</td>
            <td></td>
            <td></td>
            <!--<td>{differencePresidentielleLegislativesBureau(Array.from(resultats.keys())[i])}</td>
            <td>{Math.round( differencePresidentielleLegislativesBureau(Array.from(resultats.keys())[i])/ resultats.get(Array.from(resultats.keys())[i]).get('abstention').total_inscrits *100)}%</td>-->
          </tr>
        {/each}

        </tbody>
      </table>
</div>

<style>
th, td {
    border-bottom: 1px solid #ddd;
}

tr:nth-child(even) {background-color: #f2f2f2;}
tr:hover {background-color: coral;}

</style>