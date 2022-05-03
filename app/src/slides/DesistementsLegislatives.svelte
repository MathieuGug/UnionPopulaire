<script>
    import { getContext, setContext, onMount } from 'svelte';
    import { writable, derived } from 'svelte/store';

    import Map from '../Map.svelte';
    import MapSelection from '../MapSelection.svelte';
	import Legend from '../legend/Legend.svelte';    
    import DesistementsParBureau from './DesistementsParBureau.svelte';
    
    export let bureaux;

    let group_size = [100, 30, 40, 180, 110, 90];

    let display_score = getContext("display-score");

    ///////////////////////////////////////////////
    //     GET THE CONTEXT FROM PRESENTATION     //
    ///////////////////////////////////////////////
    let presidentielle_2017 = getContext('presidentielle-2017');
    let presidentielle_2017_cp = getContext('presidentielle-2017-cp');
    let presidentielle_2017_bureau = getContext('presidentielle-2017-bureau');

    let presidentielle_2022 = getContext('presidentielle-2022');
    let presidentielle_2022_cp = getContext('presidentielle-2022-cp');
    let presidentielle_2022_bureau = getContext('presidentielle-2022-bureau');

    let legislatives_2017 = getContext('legislatives-2017');
    let legislatives_2017_cp = getContext('legislatives-2017-cp');
    let legislatives_2017_bureau = getContext('legislatives-2017-bureau');

    // Les candidats et les groupes politiques auxquels il appartiennent
    let candidats_leg_2017 = getContext('candidats-legislatives-2017');
    let candidats_pres_2017 = getContext('candidats-presidentielle-2017');
    let candidats_pres_2022 = getContext('candidats-presidentielle-2022');

    let groupes_politiques_pres_2017 = getContext('groupes-politiques-presidentielles-2017');
    let groupes_politiques_pres_2022 = getContext('groupes-politiques-presidentielles-2022');
    let groupes_politiques_leg_2017 = getContext('groupes-politiques-legislatives-2017');
    

    //////////////////////////////////////////////
    //          CHECK SI TOUT VA BIEN           //
    //////////////////////////////////////////////

</script>

<!--
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

-->
<div id="desistements-legislatives">
    <p>Résultats du 1er tour.</p>
    <div id="resultats-container">
        <div class="resultats">
            <p>Présidentielle 2017</p>
            <Legend 
                group_size={group_size} 
                candidats={candidats_pres_2017}
                groupes_politiques={groupes_politiques_pres_2017}
                resultats_election={$presidentielle_2017_cp} />
        </div>

        <div class="resultats">
            <p>Législatives 2017</p>
            <Legend 
                group_size={group_size} 
                candidats={$candidats_leg_2017}
                groupes_politiques={$groupes_politiques_leg_2017}
                resultats_election={$legislatives_2017_cp} />
        </div>

        <div class="resultats">
            <p>Présidentielle 2022</p>
            <Legend 
                group_size={group_size} 
                candidats={candidats_pres_2022}
                groupes_politiques={groupes_politiques_pres_2022}
                resultats_election={$presidentielle_2022_cp} />
        </div>

    </div>
</div>


<div id="desistements-par-bureau">
    <DesistementsParBureau 
        {bureaux} />
</div>

<style>
#desistements-legislatives {
    display: flex;
    flex-direction: column;
    height: auto;
}

#resultats-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: auto;
    justify-content: space-between;
}

.resultats {
    width: 100%;
}

.resultats p {
    font-style: italic;
    text-align: center;
    text-decoration: underline;
}

@media only screen and (max-width: 800px) {
    #resultats-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>
