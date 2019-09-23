import  Ractive  from 'ractive'
import ractiveTap from 'ractive-events-tap'
//import ractiveEventsHover from 'ractive-events-hover'
//import ractiveFade from 'ractive-transitions-fade'
import template from '../../templates/template.html'
import geo from '../data/NRM_sub_clusters.json'
import climate from '../data/climate.json'
import * as d3 from 'd3'
import * as topojson from "topojson"

export class Climitizer {

	constructor(postcodes) {

        this.database = {}

        this.climate = climate.climate

        postcodes.forEach(function(value, index) {

            value.latitude = +value.latitude
            value.longitude = +value.longitude
            value["meta"] = value.postcode + ' | ' + value.place_name;

        });

        this.database.postcodes = postcodes

        this.database.results = false

        this.database.cluster = null

        this.database.isApp = (window.location.origin === "file://" || window.location.origin === null) ? true : false ;

        this.ractivate()

	}

    ractivate() {

        var self = this

        this.ractive = new Ractive({
            events: { 
                tap: ractiveTap
            },
            el: '#app',
            data: self.database,
            template: template,
        })

        this.ractive.observe('user_input', ( input ) => {

            if (input && input.length > 2) {

               self.database.list = true

                self.database.postcodeShortlist = self.database.postcodes.filter(function(item) {

                    if (item.meta.includes(input)) {

                        return item

                    }

                });

                console.log(self.database.postcodeShortlist.length)

            } else {

               self.database.list = false

            }

            self.ractive.set(self.database)

        });
        //2880 12

        this.ractive.on( 'keydown', function ( event ) {

            if (event.original.keyCode===13) {

                if (self.database.postcodeShortlist.length > 0 && self.database.list) {

                    var lat = self.database.postcodeShortlist[0].latitude
                    var lng = self.database.postcodeShortlist[0].longitude
                    var place_name = self.database.postcodeShortlist[0].place_name
                    var cluster_id = self.database.postcodeShortlist[0].cluster_id

                    self.database.user_input = ""
                    self.database.list = false
                    self.database.results = true
                    
                    self.render(cluster_id, lat, lng)

                }

                event.original.preventDefault()

            }
           

        });

        this.ractive.on('postcode', (context, lat, lng, place_name, cluster_id) => {

            self.database.user_input = ""
            self.database.list = false
            self.database.results = true
            
            self.render(cluster_id, lat, lng)

        })

        this.createMap()

        this.resize()

    }

    createMap() {

        var self = this

        var latitude = -28.5

        var longitude = 133

        var widthMap = document.querySelector("#map").getBoundingClientRect().width

        d3.select("#map svg").remove()
        
        var heightMap = widthMap * 0.8

        var marginMap = {top: 0, right: 0, bottom: 0, left:0}

        this.projection = d3.geoMercator()
                        .center([longitude, latitude])
                        .scale(widthMap * 1.15)
                        .translate([widthMap / 2, heightMap / 2])

        var pathMap = d3.geoPath().projection(self.projection);

        var svgMap = d3.select("#map").append("svg")
                    .attr("width", widthMap)
                    .attr("height", heightMap)
                    .attr("overflow", "hidden")

        svgMap.append("g")
            .selectAll("path")
            .data(topojson.feature(geo,geo.objects.NRM_sub_clusters).features)
            .enter()
            .append("path")
            .attr("class", "sub_clusters")
            .attr("d", pathMap)
            .style("stroke-width","1")
            .style("stroke","darkgrey")
            .style("fill","lightgrey")
            .on("click", function (d) { 
                self.render(d.properties.code) 
            });

            svgMap.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 0)
                .style("opacity", 0) 


    }

    climitize() {

        var self = this

        self.ractive.set(self.database)

    }

    render(id, lat=null, lng=null) {

        var self = this

        self.database.results = true

        this.database.cluster = this.climate.find( (item) => item.cluster_id === id)

        d3.selectAll('.sub_clusters').style("fill", function(d){
            return (d.properties.code === id) ? 'red' : 'lightgrey';
        });

        if (lat!=null && lng != null) {

            d3.selectAll("circle")
                .attr("cx", function(d) {
                    return self.projection([lng, lat])[0];
                })
                .attr("cy", function(d) {
                    return self.projection([lng, lat])[1];
                })
                .attr("r", 5)
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .style("fill", "none")    
                .style("opacity", 1) 

        } else {

            d3.selectAll("circle").style("opacity",0) 

        }

        self.ractive.set(self.database)

    }

    resize() {

        var self = this

        // Detect when a user has stopped resizing the browser window and trigger the appropriate action

        window.addEventListener("resize", function() {

            clearTimeout(document.body.data)

            document.body.data = setTimeout( function() { 

                self.createMap()

            }, 200);

        });

    }

}