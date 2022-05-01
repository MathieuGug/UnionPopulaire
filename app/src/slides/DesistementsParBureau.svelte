<script>
    import { getContext } from 'svelte';

    let selection = getContext('communes-actives');
    let hovered_selection = getContext('communes-hovered');
    
    export let resultats, bureaux, differencePresidentielleLegislativesBureau;
    
    $: bureaux_filtered = bureaux
        .filter(d => ($selection).includes(d.code_commune))
        .sort((a, b) => a.code_commune - b.code_commune || a.code_bureau - b.code_bureau);

    
</script>

<div class="resultats-par-bureau">
    <table>
        <thead>
          <tr><th>Bureau</th> <th>Ville</th> <th>Code Postal</th> <th>Adresse</th> <th>Inscrits</th> <th>Pertes de voix</th> <th>%</th> </tr>
        </thead>
        <tbody>
        {#each bureaux_filtered as bureau, i}
        
          <tr>
            <td>{bureau.code_bureau}</td>
            <td>{bureau.ville}</td>
            <td>{bureau.cp}</td>
            <td>{bureau.adresse}</td>

            <!-- Les résultats -->
            <td>{resultats.get(bureau.id_b_vote).get('abstention').total_inscrits}</td>
            <td>{differencePresidentielleLegislativesBureau(bureau.id_b_vote)}</td>
            <td>{Math.round( differencePresidentielleLegislativesBureau(bureau.id_b_vote)/ resultats.get(bureau.id_b_vote).get('abstention').total_inscrits *100)}%</td>
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