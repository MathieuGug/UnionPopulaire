import { csv, json } from 'd3-fetch';
import { cp_circo_5 } from './candidats.js';

export async function loadResults(path) {
    // One node for each voter
    let nodes = [];
    let action, nom;
    let elector_bureau;

    var response = await csv(path, d => {
        
        nodes.push( {
            code_dpt: d.code_dpt,
            dpt: d.dpt,
            code_circ: d.code_circ,
            code_commune: d.code_dpt.padStart(2, '0') + d.code_commune.padStart(3, '0'),
            commune: d.commune,
            cp: d.cp,
            code_b_vote: d.code_b_vote,
            id_b_vote: d.cp + '-' + d.code_b_vote,
            nom: d.nom,
            prenom: d.prenom,
            nuance: d.nuance,
            voix: +d.voix,
            p_voix_ins: +d['p_voix/ins'],
            p_voix_exp: +d['p_voix/exp'],
            votants: +d.votants,
            blancs: +d.blancs,
            nuls: +d.nuls, 
            inscrits: +d.inscrits
        } );
    })
    return nodes;
}


export async function loadMap() {
    var features = [];
    
    var communes = await json('./data/communes.json');
    for (let feature of communes.features) {
        if (cp_circo_5.includes(feature.properties.code)) {
            features.push(feature);
        }
    }
    return {type:"FeatureCollection", features };
}

export async function loadBureaux() {
    let features = [];
    let feature = {};

    var bureaux = await csv('./data/geo_bureaux_de_vote.csv');
    bureaux = bureaux.filter(d => cp_circo_5.includes(d.commune_code));

    for (let bureau of bureaux) {
        feature = {
            ville: bureau.ville,
            cp: bureau.code_postal,
            code_bureau: bureau.code,
            code_commune: bureau.commune_code,
            id_b_vote: bureau.commune_code + "-" + parseInt(bureau.code),
            adresse: bureau.libelle + " " + bureau.voie,
            coordinates: [+bureau.longitude, +bureau.latitude]
        };

        features.push(feature)
    }
    return features;
}