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
            code_commune: d.code_commune,
            commune: d.commune,
            cp: d.cp,
            code_b_vote: d.code_b_vote,
            id_b_vote: d.id_b_vote,
            nom: d.nom,
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
    
    var communes = await json('./communes.json');
    for (let feature of communes.features) {
        if (cp_circo_5.includes(feature.properties.code)) {
            features.push(feature);
        }
    }
    return {type:"FeatureCollection", features };
}