// svg wordt toegekend aan svg en globale marges worden meegegeven
var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 100
    },

    //e grootte van de SVG wordt hier aangeduid
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// Schaling van de X en Y as
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Data van de .TSV file wordt ingeladen
d3.tsv("languages.tsv", function (d) {
    d.speakers = +d.speakers;
    return d;
}, function (error, data) {
    if (error) throw error;

    //Zet op de X as de aantal languages
    x.domain(data.map(function (d) {
        return d.language;
    }));
    
    //Zet op de Y as de waardes van speakers
    y.domain([0, d3.max(data, function (d) {
        return d.speakers;
    })]);

    //De X AS wordt hier getekend
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

        //http://bl.ocks.org/d3noob/ccdcb7673cdb3a796e13
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-1.2em")
        .attr("dy", "-.3em")
        .attr("dy", "0em")
        .attr("transform", "rotate(-65)");

    //De Y AS wordt hier getekend
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(0)")
        .attr("y", 0)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Speakers");

    //Hier worden de grafieken (bars) ingeladen
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.language);
        })
        .attr("y", function (d) {
            return y(d.speakers);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.speakers);
        });
});