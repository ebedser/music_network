// music_network by ebedser
// custom data structure starts here
class Network {
    constructor() {
        this.nodeList = []; // a list of all nodes in the network
        //this.nodes = [];
        this.links = [];
        this.lastNodeId = 0;
    }

    add_category(name, x, y) {
        var a = new Category(this.lastNodeId++, name, x, y);
        this.nodeList.push(a);
    }
    exists(nodeA) {
        return (this.nodeList.indexOf(nodeA) != -1);
    }
    connect(nodeA, nodeB) {
        /*
          make nodeA contain nodeB
          sources can't contain anything
          nodeA: Category
          nodeB: Category or Source
        */
        if (this.exists(nodeA) && this.exists(nodeB)) {
            nodeA.contains.push(nodeB);
        }2
    }
    is_connected(nodeA, nodeB) {
        return (nodeA.contains.indexOf(nodeB) != -1);
    }
    delete_connection(nodeA, nodeB) {
        if (this.is_connected(nodeA, nodeB)) {
            var index = nodeA.contains.indexOf(nodeB);
            nodeA.contains.splice(index, 1);
        }
    }
    swap_connection(nodeA, nodeB) {
        var index = 0;
        if (this.is_connected(nodeA, nodeB)) {
            this.delete_connection(nodeA, nodeB);
            this.connect(nodeB, nodeA);
        } else if (this.is_connected(nodeB, nodeA)) {
            this.delete_connection(nodeB, nodeA);
            this.connect(nodeA, nodeB);
        } else {
            console.log("not connected");
        }

    }
    log_network() {
        var text = "";
        for (var i = 0; i < this.nodeList.length; i++) {
            text = "";
            text += (this.nodeList[i].id + " : ");
            for(var x=0; x<this.nodeList[i].contains.length; x++)
                text += (this.nodeList[i].contains[x].id + " ");
            console.log(text);
        }
    }
    delete_catagory(nodeA) {
        if (!this.exists(nodeA)) {
            return;
        }
        var index = -1;
        for (var i = 0; i < this.nodeList.length; i++) {
            index = this.nodeList[i].contains.indexOf(nodeA);
            if (index != -1) {
                this.nodeList[i].contains.splice(index, 1);
            }
        }
        index = this.nodeList.indexOf(nodeA);
        this.nodeList.splice(index, 1);
    }
}
var network = new Network();
class Node {
    constructor(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

class Category extends Node {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
        this.description = "";
        this.contains = [];
        this.blackList = [];
    }
}

class Source extends Node {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
        this.description = "";
        this.blacklist = [];
    }
}
//testing for data structure


// set up SVG for D3
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    colors = d3.scale.category10();

var svg = d3.select('body')
    .append('svg')
    .attr('oncontextmenu', 'return false;')
    //.attr('width', width)
    .attr('height', height);

//  - nodes are known by 'id', not by index in array.
//  - links are always source < target; edge directions are set by 'left' and 'right'.
//var nodes = [];
//var links = [];
//var lastNodeId = -1;

// init D3 force layout
var force = d3.layout.force()
    .nodes(network.nodeList) //network.
    .links(network.links) //network.
    .size([width, height])
    .linkDistance(100)
    .charge(-300)
    .on('tick', tick);

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', function(d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 17 : 12,
            targetPadding = d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    circle.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });
}

// update graph (called when needed)
function restart() {
    //aNetwork.log_network();
    // path (link) group
    path = path.data(network.links);

    // update existing links
    path.classed('selected', function(d) {
            return d === selected_link;
        })
        .style('marker-start', function(d) {
            return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function(d) {
            return d.right ? 'url(#end-arrow)' : '';
        });


    // add new links
    path.enter().append('svg:path')
        .attr('class', 'link')
        .classed('selected', function(d) {
            return d === selected_link;
        })
        .style('marker-start', function(d) {
            return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function(d) {
            return d.right ? 'url(#end-arrow)' : '';
        })
        .on('mousedown', function(d) {
            if (d3.event.ctrlKey) return;

            // select link
            mousedown_link = d;
            if (mousedown_link === selected_link) selected_link = null;
            else selected_link = mousedown_link;
            selected_node = null;
            restart();
        });

    // remove old links
    path.exit().remove();


    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(network.nodeList, function(d) {
        return d.id;
    });

    // update existing nodes (selected visual state)
    circle.selectAll('circle')
        .style('fill', function(d) {
           // return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);
            return (d === selected_node) ? d3.rgb(132,189,0).brighter().toString() : d3.rgb(132,189,0);
        })
    ;

    // add new nodes
    var g = circle.enter().append('svg:g');
    g.append('svg:circle')
        .attr('class', 'node')
        .attr('r', 12)
        .style('fill', function(d) {
            return d3.rgb(132,189,0).toString();
        })
        .style('stroke', function(d) {
            return d3.rgb(132,189,0).darker().toString();
        })
        /* mouseover resizing doesn't seem to work currently (from template code)
          .on('mouseover', function(d) {
            if (!mousedown_node || d === mousedown_node) return;
            // enlarge target node
            d3.select(this).attr('transform', 'scale(1.1)');
        })
        .on('mouseout', function(d) {
            if (!mousedown_node || d === mousedown_node) return;
            // unenlarge target node
            d3.select(this).attr('transform', '');
            })*/
        .on('mousedown', function(d) {
            if (d3.event.ctrlKey) return; //default drag behavior when holding down ctrl key
            // select node
            mousedown_node = d;
            if (mousedown_node === selected_node){
                selected_node = null;
                //closeNav();
            }
            else{
                selected_node = mousedown_node;
                //openNav();
                }
            selected_link = null;

            // reposition drag line
            drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', false)
                .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

            restart();
        })
        .on('mouseup', function(d) {
            if (!mousedown_node) return;

            // needed by FF
            drag_line
                .classed('hidden', true)
                .style('marker-end', '');

            // check for drag-to-self
            mouseup_node = d;
            if (mouseup_node === mousedown_node) {
                resetMouseVars();
                return;
            }

            // unenlarge target node
            //d3.select(this).attr('transform', '');

            // add link to graph (update if exists)
            // NB: links are strictly source < target; arrows separately specified by booleans
            var source, target, direction;
            if (mousedown_node.x < mouseup_node.x) { //need to fix
                source = mousedown_node;
                target = mouseup_node;
                direction = 'right';
            } else {
                source = mouseup_node;
                target = mousedown_node;
                direction = 'left';
            }

            var link;
            link = network.links.filter(function(l) {
                return (l.source === source && l.target === target);
            })[0];

            if (link) {
                link[direction] = true;
            } else {
                link = {
                    source: source,
                    target: target,
                    left: false,
                    right: false
                };
                link[direction] = true;
                network.links.push(link);
                //add connection to network
                var a = network.nodeList[network.nodeList.indexOf(link.source)];
                var b = network.nodeList[network.nodeList.indexOf(link.target)];
                if(direction == 'right'){network.connect(b, a);}
                else{network.connect(a,b);}
            }

            // select new link
            selected_link = link;
            selected_node = null;
            restart();
        });

    // show node IDs
    g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text(function(d) {
            return d.id;
        });

    // remove old nodes
    circle.exit().remove();

    // set the graph in motion
    force.start();
}

function mousedown() {
    // prevent I-bar on drag
    //d3.event.preventDefault();

    // because :active only works in WebKit?
    svg.classed('active', true);

    if (d3.event.ctrlKey || mousedown_node || mousedown_link) return;
/*
    // insert new node at point
    var point = d3.mouse(this);
    var node = {
        id: ++lastNodeId
    };
    node.x = point[0];
    node.y = point[1];
    nodes.push(node);
    aNetwork.add_category(node.id);
    restart();*/
}

function mousemove() {
    if (!mousedown_node) return;

    // update drag line
    drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

    restart();
}

function mouseup() {
    if (mousedown_node) {
        // hide drag line
        drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
}

function spliceLinksForNode(node) {
    var toSplice = links.filter(function(l) {
        return (l.source === node || l.target === node);
    });
    toSplice.map(function(l) {
        network.links.splice(network.links.indexOf(l), 1);
    });
}
/*
// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
    d3.event.preventDefault();

    if (lastKeyDown !== -1) return;
    lastKeyDown = d3.event.keyCode;

    // ctrl
    if (d3.event.keyCode === 17) {
        circle.call(force.drag);
        svg.classed('ctrl', true);
    }

    if (!selected_node && !selected_link) return;
    switch (d3.event.keyCode) {
        case 8: // backspace
        case 46: // delete
            if (selected_node) {
                network.delete_catagory(network.nodeList[network.nodeList.indexOf(selected_node)]); //
                network.nodeList.splice(network.nodeList.indexOf(selected_node), 1);
                spliceLinksForNode(selected_node);
            } else if (selected_link) {
                network.links.splice(network.links.indexOf(selected_link), 1);
                var l = selected_link;
                var a = network.nodeList[network.nodeList.indexOf(l.source)];
                var b = network.nodeList[network.nodeList.indexOf(l.target)];
                console.log(a);
                console.log(b);
                network.delete_connection(a, b);
            }
            selected_link = null;
            selected_node = null;
            restart();
            break;

        case 66: // B
            //toggle direction
            if (selected_link) {
                selected_link.left = !selected_link.left;
                selected_link.right = !selected_link.right;
                var a = network.nodeList[network.nodeList.indexOf(selected_link.source)];
                var b = network.nodeList[network.nodeList.indexOf(selected_link.target)];
                network.swap_connection(a, b);
            }

            restart();
            break;
    }
}*/

function keyup() {
    lastKeyDown = -1;

    // ctrl
    if (d3.event.keyCode === 17) {
        circle
            .on('mousedown.drag', null)
            .on('touchstart.drag', null);
        svg.classed('ctrl', false);
    }
}
function nodeButton(x,y,name){
    // insert new node at point
    network.add_category(name, x, y);
    restart();
}
var middleX=width/2;
var middleY=height/2;
document.getElementById("log_button").onclick = function(){
    network.log_network();
};
document.getElementById("add_node").onclick = function() {
    nodeButton(middleX,middleY,'');
};
// app starts here
svg.on('mousedown', mousedown)
    .on('mousemove', mousemove)
    .on('mouseup', mouseup);
d3.select(window)
    //.on('keydown', keydown)
    .on('keyup', keyup);
restart();

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}
