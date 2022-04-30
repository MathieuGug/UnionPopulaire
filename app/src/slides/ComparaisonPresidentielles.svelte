<script>
    import Map from '../Map.svelte';
	import Legend from '../legend/Legend.svelte';    
    import { getContext, onMount } from 'svelte';

    import { scaleLinear, scaleSequential, scaleOrdinal } from 'd3-scale';

    import { candidats_pres_2017, candidats_leg_2017, candidats_pres_2022 } from '../candidats.js';
    import { groupes_politiques_pres_2017, groupes_politiques_leg_2017, groupes_politiques_pres_2022 } from '../candidats.js';
    import { cp_circo_5 } from '../candidats.js';

    export let communes, score_par_commune, pres_2017, pres_2022;

    let selection = getContext('communes-actives');

    let title, display_score;


    let group_size_pres_2017 = [0, 80, 110, 150, 290, 350];
    let group_size_pres_2022 = [0, 80, 110, 150, 290, 370];

    
    let colorScaleResults = scaleSequential(["blue", "red"])
        .domain([-100, 100]);

    // En fonction d'un CP et d'un candidat, check la perte de voix entre la présidentielle et les législatives
    var abstentionEntrePresidentielles = function(cp) {
       let abstention_pres = pres_2017.get(cp).get('abstention').total_voix;
       let abstention_leg = pres_2022.get(cp).get('abstention').total_voix;

       return colorScaleResults(abstention_leg - abstention_pres);
    }

</script>

<div class="analyse">
    <h1>Analyse des scores entre la présidentielle de 2017 et de 2022</h1>

    <p>Tandis que les voix de la droite traditionnelle se sont majoritairement dirigées vers Mme LE PEN (et dans un rapport d'un sur deux, vers le bloc libéral de M. MACRON et Mme PÉCRESSE), Mélenchon est parvenu à mobiliser son électorat en dépit d'une multiplication des candidatures à gauche.</p>

    <h2>Report des voix du bloc de droite</h2>

    <p>L'effondrement du bloc de droite est acté par l'élection présidentielle de 2022. Le score de Mme PECRESSE (2k) palit en comparaison de celui de M. FILLON (12k). Mais où sont passées les voix de droite ?</p>

    <p>Tout d'abord, M. MACRON semble en avoir récupéré le même nombre que Mme PÉCRESSE, c'est-à-dire 2.000. L'analyse indique qu'un tiers (4k) s'est dirigé vers Mme LE PEN, et marginalement vers M. ZEMMOUR (seulement 500).</p>

    <p>Cela indique que les électeurs de M. FILLON sont les principaux à s'être abstenus, entre 1.500 et 2.000 électeurs n'ont pas fait le déplacerment.</p>

    <h2>Report des voix du bloc de gauche</h2>

    <p>Sur les cinq dernières années, par rapport au report de voix d'Hamon (~3k) vers Hidalgo (~900) et les scores respectifs de Jadot et Roussel (4k à tous les deux), on peut en déduire que Mélenchon a en moyenne convaincu 2.000 abstentionnistes d'aller voter (pour lui). En revanche, la stabilité du score de Mélenchon entre 2017 et 2022 indique qu'à peu près le même nombre s'est désisté en faveur de Jadot ou Roussel.</p>

    <p>Cela témoigne d'une campagne présidentielle efficace pour convaincre le peuple de gauche d'aller se déplacer, ce qui sera l'enjeu majeur pour les prochaines législatives.</p>

</div>

<div id="presidentielles-comparaison">

    <div class="map-navigation">

        <div class="map-widgets">

            <div class="map-selection"  style="display: flex; width: 100%; flex-direction: row; align-items: stretch;">
                <div class="select-all">
                    <button on:click={() => $selection = cp_circo_5}>Tout sélectionner</button>
                </div>
    
                <div class="reset">
                    <button on:click={() => $selection = []}>Tout désélectionner</button>
                </div>
            </div>
        </div>

        <Map {communes} 
            candidats={candidats_pres_2017} 
            results={pres_2017} $
            colors={abstentionEntrePresidentielles} />
    </div>

    <div class="resultats">
        <Legend 
            type="pres_2017"
            group_size={group_size_pres_2017} 
            resultats_election={pres_2017}  />
    </div>

    <div class="resultats">
        <Legend 
            type="pres_2022"
            group_size={group_size_pres_2022} 
            resultats_election={pres_2022}  />
    </div>
    
</div>

    

    <!--
    <div class="presidentielle">
        <Map {communes} candidats={candidats_pres_2022} results={pres_2022} />
        <Legend 
            group_size={group_size_pres_2022} 
            resultats_election={score_par_commune} 
            groupes_politiques={groupes_politiques_pres_2022} 
            candidats={candidats_pres_2022} />
    </div>
-->

<style>

#presidentielles-comparaison {
    display: flex;
    flex-direction: row;
    height: auto;
}

.presidentielle {
    width: 50%;
}
</style>