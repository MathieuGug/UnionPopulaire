import { writable } from 'svelte/store';

// Circo

export let cp_circo_5 = ['84002', '84003', '84004', '84005', '84006', '84009', '84010',
    '84013', '84014', '84017', '84018', '84024', '84030', '84031',
    '84032', '84033', '84041', '84046', '84047', '84048', '84050',
    '84051', '84052', '84057', '84060', '84066', '84067', '84070',
    '84075', '84076', '84077', '84079', '84082', '84084', '84085',
    '84089', '84090', '84102', '84103', '84105', '84107', '84109',
    '84112', '84113', '84114', '84115', '84118', '84120', '84121',
    '84122', '84123', '84133', '84144', '84145', '84148', '84151'];

// Candidats

export let candidats_pres_2017 = [
    ["DUPONT-AIGNAN", {'id': 0, 'nom': 'DUPONT-AIGNAN Nicolas', color: '#4F89E1'} ] ,
    ["LE PEN", {'id': 1, 'nom': 'LE PEN Marine', color: '#1B2CC1'} ] ,
    ["MACRON", {'id': 2, 'nom': 'MACRON Emmanuel', color: '#EFCB68'} ] ,
    ["HAMON", {'id': 3, 'nom': 'HAMON Benoît', color: '#EFA8B8'} ] ,
    ["ARTHAUD", {'id': 4, 'nom': 'ARTHAUD Nathalie', color: '#960200'} ] ,
    ["POUTOU", {'id': 5, 'nom': 'POUTOU Philippe', color: '#A4508B'} ] ,
    ["CHEMINADE", {'id': 6, 'nom': 'CHEMINADE Jacques', color: '#960200'} ] ,
    ["LASSALLE", {'id': 7, 'nom': 'LASSALLE Jean', color: '#BBB09B'} ] ,
    ["MÉLENCHON", {'id': 8, 'nom': 'MÉLENCHON Jean-Luc', color: '#5F0A87'} ] ,
    ["ASSELINEAU", {'id': 9, 'nom': 'ASSELINEAU François', color: '#960200'} ] ,
    ["FILLON", {'id': 10, 'nom': 'FILLON François', color: '#7AA2DF'} ] 
].reduce((acc , v) => ({...acc, [v[0]]: v[1]}), {});

export let groupes_politiques_pres_2017 = {
    non_candidat: ['abstention', 'blancs', 'nuls'],
    macron: ['MACRON'],
    droite: ['FILLON'],
    gauche: ['MÉLENCHON', 'HAMON', 'POUTOU', 'ARTHAUD'],
    extreme_droite: ['LE PEN', 'DUPONT-AIGNAN'],
    autre: ['LASSALLE', 'ASSELINEAU', 'CHEMINADE']
};

export let candidats_leg_2017 = [
    ["PIERINI", {'id': 0, 'nom': "PIERINI Lucien", color: '#A4508B'} ],
    ["CHOTARD", {'id': 1, 'nom': 'CHOTARD Stéphane', color: '#5F0A87'} ],
    ["REYNARD", {'id': 2, 'nom': 'REYNARD Luc', color: '#960200'} ],
    ["LECELLIER", {'id': 3, 'nom': 'LECELLIER Cédric', color: '#CE6C47'} ],
    ["DAURES", {'id': 4, 'nom': 'DAURES Anne', color: '#ADD6A7'} ],
    ["KADLER", {'id': 5, 'nom': 'KADLER Marie-Christine', color: '#ADD6A7'} ],
    ["MOREL", {'id': 6, 'nom': 'MOREL Véronique', color: '#BBB09B'} ],
    ["VIARD", {'id': 7, 'nom': 'VIARD Jean', color: '#EFCB68'} ],
    ["AUBERT", {'id': 8, 'nom': 'AUBERT Julien', color: '#7AA2DF'} ],
    ["CHALENÇON", {'id': 9, 'nom': 'CHALENÇON Christophe', color: '#BBB09B'} ],
    ["KRAFT", {'id': 10, 'nom': 'KRAFT Sandrine', color: '#ABD2FA'} ],
    ["FOREST", {'id': 11, 'nom': 'FOREST Nathalie', color: '#4F89E1'} ],
    ["THOMAS DE MALEVILLE", {'id': 12, 'nom': 'THOMAS DE MALEVILLE Marie', color: '#1B2CC1'} ]
].reduce((acc , v) => ({...acc, [v[0]]: v[1]}), {});

export let groupes_politiques_leg_2017 = {
    non_candidat: ['abstention', 'blancs', 'nuls'],
    macron: ['VIARD'],
    droite: ['AUBERT'],
    gauche: ['CHOTARD', 'REYNARD', 'KADLER', 'DAURES'],
    extreme_droite: ['THOMAS DE MALEVILLE', 'KRAFT'],
    autre: [ 'PIERINI', 'LECELLIER', 'MOREL', 'CHALENÇON', ]
}

export let candidats_pres_2022 = [
    ['ARTHAUD', {id: 0, nom: 'ARTHAUD Nathalie', color: '#960200'} ],
    ['DUPONT-AIGNAN', {id: 1, nom: 'DUPONT-AIGNAN Nicolas', color: '#4F89E1'} ], 
    ['HIDALGO', {id: 2, nom: 'HIDALGO Anne', color: '#EFA8B8'} ],
    ['JADOT', {id: 3, nom: 'JADOT Yannick', color: '#ADD6A7'} ], 
    ['LASSALLE', {id: 4, nom: 'LASSALLE Jean', color: '#BBB09B'} ], 
    ['LE PEN', {id: 5,  nom: 'LE PEN Marine', color: '#1B2CC1'} ],
    ['MACRON', {id: 6,  nom: 'MACRON Emmanuel', color: '#EFCB68'} ], 
    ['MÉLENCHON', {id: 7,  nom: 'MÉLENCHON Jean-Luc', color: '#5F0A87'} ], 
    ['POUTOU', {id: 8, nom: 'POUTOU Philippe', color: '#A4508B'} ],
    ['PÉCRESSE', {id: 9,  nom: 'PÉCRESSE Valérie', color: '#7AA2DF'} ], 
    ['ROUSSEL', {id: 10, nom: 'ROUSSEL Fabien', color: '#CE6C47'} ], 
    ['ZEMMOUR', {id: 11, nom: 'ZEMMOUR Éric', color: '#ABD2FA'} ],
    ['abstention', {id: 12, nom: 'ABSTENTION', color: '#000411'} ], 
    ['blancs', {id: 13, nom: 'BLANCS', color: '#AEB7B3'} ], 
    ['nuls', {id: 14, nom: 'NULS', color: '#E1EFE6'} ]
].reduce((acc , v) => ({...acc, [v[0]]: v[1]}), {});


export let groupes_politiques_pres_2022 = {
    non_candidat: ['abstention', 'blancs', 'nuls'],

    macron: ['MACRON'],
    droite: ['PÉCRESSE'],
    gauche: ['MÉLENCHON', 'JADOT', 'ROUSSEL', 'HIDALGO', 'POUTOU', 'ARTHAUD'],

    extreme_droite: ['LE PEN', 'ZEMMOUR', 'DUPONT-AIGNAN'],
    autre: ['LASSALLE']
}