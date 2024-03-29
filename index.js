var svg = d3.select("svg"),
                margin = {top: 20, right: 80, bottom: 30, left: 50},
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var parseTime = d3.timeParse("%d/%m/%Y");
            var x = d3.scaleTime().range([0, width]),
                y = d3.scaleLinear().range([height, 0]),
                z = d3.scaleOrdinal(d3.schemeCategory10);
            var line = d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.temperature); });
            
            // gridlines in x axis function
            function make_x_gridlines() {		
                return d3.axisBottom(x)
                    .ticks(5)
            }

            // gridlines in y axis function
            function make_y_gridlines() {		
                return d3.axisLeft(y)
                        .ticks(5)
            }


            d3.csv("BRICSdata.csv", type, function(error, data) {
              if (error) throw error;

                //var data=[];

                //Do the generation of data here, between these two points.
                //Start
                /*
                var years =[01012000, 01012001, 01012002, 01012003, 01012004, 01012005, 01012006, 01012007, 01012008, 01012009, 01012010];

                            for (var i = 0; i<11;i++){

                                var year = years[i];

                                for (var j=0; j<25;j++){    
                                    var brazil = data1[0];
                                    var china = data1[1];
                                    var india = data1[2];
                                    var russia = data1[3];
                                    var south = data1[4];
                                    var usa = data1[5];

                                    data[i] ={    
                                        date: years[i],
                                        "USA": usa[year],
                                        "Brazil": brazil[year],
                                        "China": china[year],
                                        "India": india[year],
                                        "Russia": russia[year],
                                        "South Africa": south[year]                    
                                    }   
                                }           
                            }
                */
                console.log(data);
                //here it should store final value in data

                //End

              var cities = data.columns.slice(1).map(function(id) {
                return {
                  id: id,
                  values: data.map(function(d) {
                    return {date: d.date, temperature: d[id]};
                  })
                };
              });
              x.domain(d3.extent(data, function(d) { return d.date; }));
              y.domain([
                d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
                d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature + 50; }); })
              ]);
              z.domain(cities.map(function(c) { return c.id; }));
              g.append("g")
                  .attr("class", "axis axis--x")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x))
                .append("text")
                  .attr("x",(width/2))
                  .attr("y", 20)
                  .attr("dy", "0.71em")
                  .attr("fill", "darkblue")
                  .text("Year").attr("font-size","12px").attr("font-weight","bold").attr("letter-spacing","2px");

              g.append("g")
                  .attr("class", "axis axis--y")
                  .call(d3.axisLeft(y))
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("x",0 - height/3)
                  .attr("y", -width/15-margin.left/10)
                  .attr("dy", "0.71em")
                  .attr("fill", "darkblue")
                  .text("Million BTUs per Person").attr("letter-spacing","2px").attr("font-size","11px");
              var city = g.selectAll(".city")
                .data(cities)
                .enter().append("g")
                  .attr("class", "city").append("path")
                  .attr("class", "line")
                  .attr("d", function(d) { return line(d.values); })
                  .style("stroke", function(d) { return z(d.id); });
                
                var totalLength = city.node().getTotalLength();    
                
                city.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0); 
                
              g.selectAll(".city").append("text")
                  .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
                  .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
                  .attr("x", 3)
                  .attr("dy", "0.35em")
                .transition().duration(500).delay(1500).ease(d3.easeLinear)
                  .style("font", "10px sans-serif")
                  .text(function(d) { return d.id; });
            
                //add the X gridlines    
                 svg.append("g")			
                    .attr("class", "grid")
                    .attr("transform", "translate(184," + (height+20) + ")")
                    .call(make_x_gridlines()
                    .tickSize(-height-10)
                    .tickFormat(""))

                // add the Y gridlines
                svg.append("g")			
                    .attr("class", "grid")
                    .attr("transform", "translate(50,20)")
                    .call(make_y_gridlines().tickSize(-width-10).tickFormat(""))    
                
            });
            function type(d, _, columns) {
              d.date = parseTime(d.date);
              for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
              return d;
            }