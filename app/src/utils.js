import { rollup, sum } from 'd3-array';

///////////////////////////////////////////////////////////////////////
//  Construire le dictionnaire dynamiquement à partir des résultats  //
///////////////////////////////////////////////////////////////////////

function colorParNuance(nuance) {
    let color;
    if (nuance == "REM") {
        color = "#EFCB68";
    } else if (nuance == "FI") {
        color = '#5F0A87';
    } else if (nuance == "ECO") {
        color = '#ADD6A7';
    } else if (nuance == "LR") {
        color = '#7AA2DF';
    } else if (nuance == "FN") {
        color = '#1B2CC1';
    } else if (nuance == "COM") {
        color = '#CE6C47';
    } else if (nuance == "EXG") {
        color = '#A4508B';
    } else if (nuance == "SOC") {
        color = '#EFA8B8';
    } else {
        color = "#000000";
    }
    return color;

}
export function getCandidats (resultats) {
    let first_cp = Array.from(resultats.keys())[0];
    let candidats = Object.fromEntries(
            Array.from(resultats.get(first_cp).keys()).map(id => [id, {
                nuance: resultats.get(first_cp).get(id).nuance,
                nom: resultats.get(first_cp).get(id).nom,
                color: colorParNuance(resultats.get(first_cp).get(id).nuance),
                total_voix: 0}])
        );
    return candidats;
}

export function candidatParNuance (nuance, candidats) {
    var candidat;

    Object.keys(candidats).forEach(cand => {
        if (candidats[cand].nuance == nuance) {
            candidat = cand;
        }
    });
    return candidat;
}

export function getGroupesPolitiques(type, candidats) {
    let groupes_politiques;
    if (type == "pres_2017") {
        groupes_politiques = {
            non_candidat: ['abstention', 'blancs', 'nuls'],
            macron: ['MACRON'],
            droite: ['FILLON'],
            gauche: ['MÉLENCHON', 'HAMON', 'POUTOU', 'ARTHAUD'],
            extreme_droite: ['LE PEN', 'DUPONT-AIGNAN'],
            autre: ['LASSALLE', 'ASSELINEAU', 'CHEMINADE']
        }
    } else if (type == "pres_2022") {
        groupes_politiques = {
            non_candidat: ['abstention', 'blancs', 'nuls'],
            macron: ['MACRON'],
            droite: ['PÉCRESSE'],
            gauche: ['MÉLENCHON', 'JADOT', 'ROUSSEL', 'HIDALGO', 'POUTOU', 'ARTHAUD'],
            extreme_droite: ['LE PEN', 'ZEMMOUR', 'DUPONT-AIGNAN'],
            autre: ['LASSALLE']
        }
    } else {
        groupes_politiques = {
            non_candidat: ['abstention', 'blancs', 'nuls'],
            macron: ['REM'].map( nuance => candidatParNuance(nuance, candidats) ).filter(e => e !== undefined),
            droite: ['LR'].map( nuance => candidatParNuance(nuance, candidats) ).filter(e => e !== undefined),
            gauche: ['FI', 'RDG', 'ECO', 'EXG'].map( nuance => candidatParNuance(nuance, candidats) ).filter(e => e !== undefined),
            extreme_droite: ['FN', 'DVD'].map( nuance => candidatParNuance(nuance, candidats) ).filter(e => e !== undefined),
            autre: ['DVG', 'DIV', 'DVD'].map( nuance => candidatParNuance(nuance, candidats) ).filter(e => e !== undefined)
        }
    }
    return groupes_politiques;
}

export function correspondancePresidentielleLegislative (candidats_pres, candidats_leg) {
    let correspondances = {};
    let nuance, candidat_pres;

    for(let candidat_leg of Object.keys(candidats_leg)) {
        // D'abord on récupère la couleur politique du candidat aux législatives
        nuance = candidats_leg[candidat_leg].nuance

        // Ensuite on récupère le candidat à la présidentielle qui a la même étiquette
        candidat_pres = candidatParNuance(nuance, candidats_pres);
        if (candidat_pres != undefined) {
            correspondances[candidat_leg] = candidat_pres
        }
    }

    return correspondances;
}

/////////////////////////////////////////////////////
//  FILTRER LES DONNEES EN FONCTION DU DPT / CIRCO //
/////////////////////////////////////////////////////

export function filtrerResultats(resultats, dpt, circo) {
    return resultats.filter(d => (+d.code_dpt == dpt) & (+d.code_circ == circo))
}

// Data blending

export function scoreParCommune(resultats) {
    let resultats_cp_nom = rollup(resultats, v => ({
        nuance: v[0].nuance,
        nom: v[0].nom + ' ' + v[0].prenom,
        total_voix: sum(v, d => d.voix),
        total_inscrits: sum(v, d => d.inscrits)
    }), d => d.cp, d => d.nom);

    return resultats_cp_nom;
}

export function scoreParBureau(resultats) {
    let resultats_cp_bureau_nom = rollup(resultats, v => ({
        nuance: v[0].nuance,
        nom: v[0].nom + ' ' + v[0].prenom,
        total_voix: sum(v, d => d.voix),
        total_inscrits: sum(v, d => d.inscrits)
    }), d => d.id_b_vote, d => d.nom);

    return resultats_cp_bureau_nom;
}

// Fonction pour récupérer les élements unique d'un array avec filter
// Utile pour récupérer les numéros des circos par département
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Les circonscriptions dans le département
export function circosDansDepartement (dpt, resultats) { 
    let circos_dpt = resultats
        .filter(d => +d.code_dpt == dpt)
        .map(d => +d.code_circ)
        .filter(onlyUnique);

    return circos_dpt;
}

export function communesDansCirco (dpt, circo, resultats) {
    let codes_communes = resultats
        .filter(d => (d.code_dpt == dpt) & (d.code_circ == circo) )
        .map(d => d.code_commune)
        .filter(onlyUnique);

    return codes_communes;
}