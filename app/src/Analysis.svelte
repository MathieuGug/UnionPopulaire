<script>
    import { forceSimulation, forceCollide, forceCenter, forceManyBody, forceX, forceY } from 'd3-force';
    import { getContext } from 'svelte';
    import { rollup, rollups, sum } from 'd3-array';
    import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
    import { axisLeft } from 'd3-axis';
    import { select, selectAll } from 'd3-selection';
    import { zoom } from 'd3-zoom';

    export let data, margins;

    let width, height;
    let display_result = false;
    let electeurs, pane;
    let axis;
    
    let selection = getContext('communes-actives');
    let display_score = getContext('display-score');
    let candidats = getContext('candidats');
    let groupes_politiques = getContext('groupes-politiques');

    let data_filtered = [];
    let nodes_data = [];
    let nodes = [];
    
    let candidats_ordered = {...candidats};

    let axisCandidats;


    $: data_filtered = data.filter(d => $selection.includes(d.cp))
    $: score_par_candidat = rollup(data_filtered, v => ({
        total_voix: sum(v, d => d.voix),
        total_inscrits: sum(v, d => d.votants)
    }), d => d.nom);
    $: candidats_liste = [...score_par_candidat.keys()];


    $: console.log(score_par_candidat);
    $: console.log(candidats_liste);

    // Ranger les candidats par ordre de voix. On modifie l'id du store candidats pour avoir l'ordre en cours
    
    $: {
        let res;
        res = candidats_liste
            .map(d => [d, score_par_candidat.get(d)['total_voix']])
            .sort((a,b) => b[1] - a[1])
            .map((d, i) => { 
                candidats_ordered[d[0]] = i;
                return d[0]; } );

    }

    // Les points pour représenter les électeurs
    $: { 
        // On découpe l'écran en 3 bandes pour répartir les blocs
        let n_vertical_bands = 4;
        let n_horizontal_bands = 4;

        let xScale = scaleBand()
            .domain([...Array(n_horizontal_bands).keys()])
            .range([ 0, width ]);

        let yScale = scaleBand()
            .domain([...Array(n_vertical_bands).keys()])
            .range([ 0, height ]);

        let radialScale = scaleCircle([ width/2, height/2 ], 3, 350);

        let candidatScale = function (candidat) {
            
            const x = xScale(candidats_ordered[candidat] % n_vertical_bands);
            const y = yScale(Math.floor(candidats_ordered[candidat] / n_vertical_bands));
            return {x, y};
        }

        let buffer = [];
        let electeurs_candidat = [];

        for (let [index, candidat] of candidats_liste.entries() ) {
            console.log(candidat);
            let coords = {};
            const res = score_par_candidat.get(candidat);

            // Check le groupe politique
            if ( groupes_politiques.gauche.includes(candidat) ) {
                coords = radialScale(2);
                if ( candidat == "JADOT") {
                    coords.y = coords.y - 250; 
                } else if ( candidat == "ARTHAUD" || candidat == "POUTOU") {
                    coords.x = coords.x + 200;
                } else if ( candidat == "ROUSSEL") {
                    coords.y = coords.y + 200;
                    coords.x = coords.x + 200;
                } else if ( candidat == "HIDALGO") {
                    coords.y = coords.y + 200;
                    coords.x = coords.x - 200;
                }

            } else if ( groupes_politiques.droite.includes(candidat) ) {
                coords = radialScale(1);
                if (candidat == "ZEMMOUR") {
                    coords.x = coords.x + 150;
                    coords.y = coords.y + 150;
                } else if (candidat == "DUPONT-AIGNAN") {
                    coords.x = coords.x + 150;
                    coords.y = coords.y - 150;
                }
            } else if ( groupes_politiques.macron.includes(candidat) ){
                coords = radialScale(0);
                if (candidat == "PÉCRESSE") {
                    coords.x = coords.x + 100;
                    coords.y = coords.y + 100;
                }
            } else if ( groupes_politiques.non_candidat.includes(candidat) ){
                coords = { x: width/2, y: height/2 }
                if ( candidat == "blancs") {
                    coords.y = coords.y - 150;
                } else if ( candidat == "nuls") {
                    coords.x = coords.x + 100;
                    coords.y = coords.y - 150;
                }
            } else {
                coords = { x: 50, y: 50 }
            }

            electeurs_candidat = Array.from([...Array(res.total_voix).keys()], d => {
                return {
                    nom: candidat,
                    x:  coords.x,
                    y:  coords.y,
                    r: 3
                }  
            })
            buffer = buffer.concat(electeurs_candidat);
        }
        nodes = buffer;
        console.log(nodes)
    }

    // Axe pour les candidats
    /*
    $: {
        axisCandidats = axisLeft(yScale).tickSizeOuter(0);
        select(axis).call(axisCandidats);
    }
    */
    

        /* WORKING */
    $: {
        forceSimulation(nodes)
            .force('collide', forceCollide(8).strength(0.7))
            .force('x', forceX( width / 2 ).strength(0.01))
            .force('y', forceY( height / 2).strength(0.01))
            .force('charge', forceManyBody().strength(0.5))
            .force('cluster', forceCluster(100))
            .alpha(0.05)
            .alphaDecay(0.2)
            .velocityDecay(0.4)
            .on('tick', () => { nodes_data = nodes })   
    }
    
    // Zoom
    function zoomed(e) {
        select(electeurs)
            .attr("transform", e.transform);
    }

    $: select(pane)
        .call(zoom().on('zoom', zoomed));

/*
    $: {
        forceSimulation(nodes)
            .force('collide', forceCollide(5).strength(0.4))
            //.force('x', forceX( width / 2 ).strength(0.03))
            .force('y', forceY( d => yScale(d.nom) + yScale.bandwidth()/2).strength(8))
            .force('charge', forceManyBody().strength(2))
            .alphaDecay(0.1)
            .velocityDecay(0.6)
            .on('tick', () => { nodes_data = nodes })   
    }
     */


    function forceCluster() {
        const strength = 0.2;
        let nodes;

        function force(alpha) {
            const centroids = rollup(nodes, centroid, d => d.nom);
            const l = alpha * strength;
            for (const d of nodes) {
                const {x: cx, y: cy} = centroids.get(d.nom);
                d.vx -= (d.x - cx) * l;
                d.vy -= (d.y - cy) * l;
            }
        }

        force.initialize = _ => nodes = _;

        return force;
    }

    function centroid(nodes) {
        let x = 0;
        let y = 0;
        let z = 0;
        for (const d of nodes) {
            let k = d.r ** 2;
            x += d.x * k;
            y += d.y * k;
            z += k;
        }
        return {x: x / z, y: y / z};
    }

    
    function scaleCircle (center, n, r) {
        var theta = 2*Math.PI/n;

        var x = r*Math.cos(theta);
        var y = r*Math.sin(theta);

        // 0 <= k <= n
        var scaleGenerator = function (k) { return {
            x: center[0] + r*Math.cos(k*theta - Math.PI/2),
            y: center[1] + r*Math.sin(k*theta - Math.PI/2)
        }; };

        return ( scaleGenerator );
    }
</script>

<div class="analyse" bind:clientWidth={width} bind:clientHeight={height}>
    <svg class="analyse" {width} {height} viewBow="[0, 0, {width}, {height}]">
        <text stroke="black" transform="translate(20, 20)">{$selection}</text>

        <g class="resultats-container" transform="translate({margins.left}, {margins.top})">
            <!-- Les axes-->
            <g class="axis-candidats" bind:this={axis} transform="translate({margins.axisx}, 0)">
            
            </g>

            <!-- Pour afficher un point par électeur-->
            <g class="electeurs-container" bind:this={electeurs}>
                {#each nodes_data as node}
                    <circle class="electeur {node.nom}" r={node.r}
                        cy={node.y} 
                        cx={node.x} 
                        fill={$candidats[node.nom]['color']} />
                {/each}
            </g>
    
        </g>
        <rect bind:this={pane} class="pan" width={width} height={height} opacity=0 />
    </svg>
</div>

<style>
    .analyse {
        width: 100%;
        height: 100%;
        border: 1px solid black;
    }
</style>