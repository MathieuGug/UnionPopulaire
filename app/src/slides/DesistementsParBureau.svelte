<script>
    import { getContext } from 'svelte';
    import { derived } from 'svelte/store';

    
    export let bureaux;
    
    let selection = getContext('communes-actives');
    let presidentielle_2017_bureau = getContext('presidentielle-2017-bureau');
    let legislatives_2017_bureau = getContext('legislatives-2017-bureau');
    let correspondance_leg_pres = getContext("correspondance-presidentielle-legislatives");
    let display_score = getContext("display-score");

    let bureaux_filtered = derived(selection, ($selection) =>
      bureaux
        .filter(d => ($selection).includes(d.code_commune) && Array.from($legislatives_2017_bureau.keys()).includes(d.id_b_vote))
        .sort((a, b) => a.code_commune - b.code_commune || a.code_bureau - b.code_bureau)
    );

    let differencePresidentielleLegislativesBureau;
    $: {
      differencePresidentielleLegislativesBureau = function (id_b_vote) {
            let score_pres = $presidentielle_2017_bureau.get(id_b_vote).get($correspondance_leg_pres[$display_score]).total_voix;
            let score_leg = $legislatives_2017_bureau.get(id_b_vote).get($display_score).total_voix;

            return score_leg - score_pres;
      }
    }
    

    $: {
      console.log("LES BUREAUX DE VOTE:");
      console.log($bureaux_filtered);

      console.log("LES RESULTATS LEGISLATIVES:");
      console.log($legislatives_2017_bureau);

      console.log("LES RESULTATS PRESIDENTIELLES:")
      console.log($presidentielle_2017_bureau);
    }
    
</script>

<div class="resultats-par-bureau">
    <table>
        <thead>
          <tr>
            <th on:click={() => console.log('pouet')}>Bureau</th>
            <th>Ville</th> 
            <th>Code Postal</th> 
            <th>Adresse</th> 

            <th>Inscrits (P2017)</th>
            <!--<th>Inscrits (L2017))</th>-->
            <th>Votes (P2017)</th> 
            <th>Votes (L2017)</th> 

            <th>Gain de voix</th> 
            <th>% de votants gagnés</th>
          </tr>
        </thead>
        <tbody>
        {#each $bureaux_filtered as bureau, i}
          <tr>
            <td>{bureau.code_bureau}</td>
            <td>{bureau.ville}</td>
            <td>{bureau.cp}</td>
            <td>{bureau.adresse}</td>

            <!-- Les résultats -->
            <td>{$presidentielle_2017_bureau.get(bureau.id_b_vote).get('abstention').total_inscrits}</td>
            <!--<td>{$legislatives_2017_bureau.get(bureau.id_b_vote).get('abstention').total_inscrits}</td>-->

            <td>{$presidentielle_2017_bureau.get(bureau.id_b_vote).get($correspondance_leg_pres[$display_score]).total_voix}</td>
            <td>{$legislatives_2017_bureau.get(bureau.id_b_vote).get($display_score).total_voix}</td>

            <td>{differencePresidentielleLegislativesBureau(bureau.id_b_vote)}</td>

            <td>{-Math.round(100*(1 -
              $legislatives_2017_bureau.get(bureau.id_b_vote).get($display_score).total_voix / 
              $presidentielle_2017_bureau.get(bureau.id_b_vote).get($correspondance_leg_pres[$display_score]).total_voix), 2)}%</td>
            
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

@media only screen and (max-width: 800px) {
    table {
        font-size: 10px;
    }
}
</style>