  var arcTween=function(transition, newAngle,arc) {
        transition.attrTween("d", function (d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);

            return function (t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });
    };
  
  // For this demo we are going to use only 2 levels for sleep state
  // (Asleep, Not Asleep). 
  // Only the asleep state needs to be represented. The input data structure of
  // sleep unit, a tuple (start-time, end-time). Daily sleep, a list of sleep units.
  // sleep quality {"inadequate":red, "optimal":"green", "surplus":"blue"}
    var weekdata=[
        {weekday:'Mon',naps:[{start:"10. 02. 2018 00:34", end:"10. 02. 2018 08:04", color:"rgb(32, 255, 32)"}] ,quality:"green", color:"rgb(192, 255, 192)"},
        {weekday:'Tue',naps:[{start:"11. 02. 2018 00:44", end:"11. 02. 2018 08:51", color:"rgb(32, 255, 32)"}] ,quality:"green", color:"rgb(192, 255, 192)"},
        {weekday:'Wed',naps:[{start:"12. 02. 2018 00:10", end:"12. 02. 2018 08:22", color:"rgb(32, 255, 32)"}] ,quality:"green", color:"rgb(192, 255, 192)"},
        {weekday:'Thu',naps:[{start:"12. 02. 2018 23:23", end:"13. 02. 2018 09:47", color:"rgb(32, 32, 255)"}] ,quality:"blue", color:"rgb(192, 192, 255)"},
        {weekday:'Fri',naps:[{start:"14. 02. 2018 02:18", end:"14. 02. 2018 06:15", color:"rgb(255, 32, 32)"},
        								 {start:"14. 02. 2018 14:04", end:"14. 02. 2018 15:10", color:"rgb(255, 32, 32)"}] ,quality:"red", color:"rgb(255, 192, 192)"},
        {weekday:'Sat',naps:[{start:"15. 02. 2018 00:31", end:"15. 02. 2018 08:32", color:"rgb(32, 255, 32)"}] ,quality:"green", color:"rgb(192, 255, 192)"},
        {weekday:'Sun',naps:[] ,quality:"green", color:"rgb(192, 192, 192)"}
        
    ];
    var daydataticks={naps: [
        {id: "0", start: "01. 01. 0101 23:59", end: "01. 01. 0101 00:01", hours: "0.033", color: "rgb(32, 32, 32)"},
        {id: "0", start: "01. 01. 0101 5:59", end: "01. 01. 0101 6:01", hours: "0.033", color: "rgb(32, 32, 32)"},
        {id: "0", start: "01. 01. 0101 11:59", end: "01. 01. 0101 12:01", hours: "0.033", color: "rgb(32, 32, 32)"},
        {id: "0", start: "01. 01. 0101 17:59", end: "01. 01. 0101 18:01", hours: "0.033", color: "rgb(32, 32, 32)"}], 
                       weekday: "", 
                       totalhours: 0, 
                       date: "0101-01-01", 
                       color: "rgb(192, 192, 192)"}
    
  var time = timeParse("02. 07. 2017 13:51");
  var dayratio = function(time) {
      // Returns value in (-0.5,0.5)
  		var unbalanced =  ((time.getHours()*60 + time.getMinutes()) / (24*60)) 
      if ( unbalanced<0.5 ) {
      		balanced = unbalanced;
      } else {
      		balanced = -(1-unbalanced);
      }
      return balanced;
  };
  console.log(dayratio(time));
  
  var createCircle=function(svg,innerRadius,outerRadius,circledata){
  			
				var arcBackground=d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .startAngle(0)
                .endAngle(2*Math.PI);
                
        var pathBackground=svg.append('path')
                .attr("d",arcBackground)
                .style( {fill:circledata.color, opacity:0.6} )
        
        var arcForeground=d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .cornerRadius(5);

        var addpathForeground=function(nap) {
        		svg.append('path')
                .datum({
                		startAngle:dayratio(timeParse(nap.start))*(2*Math.PI),
                    endAngle:dayratio(timeParse(nap.end))*(2*Math.PI)
                })
                .attr({d:arcForeground})
                .style({fill:nap.color, opacity:0.9});
				};
        
        for (var i = 0, size = circledata.naps.length; i < size ; i++){
        		nap = circledata.naps[i]
        		console.log(nap);
        		addpathForeground(nap);
                console.log(dayratio(timeParse(nap.start))*360)
                console.log(dayratio(timeParse(nap.end))*360)
        };
        
    // Invisible arc (zer0-thickness) at center of ring for text-label.
        var carcBackground=d3.svg.arc() //center arc
                .innerRadius( (innerRadius+outerRadius)/2 )
                .outerRadius( (innerRadius+outerRadius)/2 )
                .startAngle(0)
                .endAngle(2*Math.PI);
        
        var cpathBackground=svg.append('path')
                .attr("d",carcBackground)
								.attr("id", circledata.weekday)
        
        var ctextBackground=svg.append("text")
        				.attr("x", -1)
        				.attr("dy", (outerRadius-innerRadius)/4)
                .attr("transform","rotate(180)")
                .append("textPath") //append a textPath to the text element
                .attr("xlink:href", "#"+circledata.weekday)
                .attr("startOffset","0%")
                .text(circledata.weekday);

  };
  
  var create7Circle=function(svg,innerRadius,outerRadius,gapRatio,weekdata){
  		var width = (outerRadius - innerRadius) / (7 + 6*gapRatio);
      var gap = width * gapRatio;
      for (var day = 0; day < 7 ; day++){
      		outerRadius=innerRadius+width;
          //console.log(weekdata)
          console.log(weekdata[day].weekday);          
          createCircle(svg,innerRadius,outerRadius, weekdata[day]); 
          innerRadius = outerRadius+gap;
      }
  
  };
  var width=512;
  var height=512;
  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
  //createCircle(svg,180,200,  {weekday:'Thu',naps:[{start:"23:23", end:"09:47", color:'#2020FF'}] ,quality:"blue", color:'#C0C0FF'}); 
  console.log(weekdata);
  create7Circle(svg, 64,250,0.2,weekdata);
  console.log("AllData")
  console.log(allnapsdata)
  createCircle(svg,250,256,daydataticks)
  //create7Circle(svg, 64,250,0.2, getNdaysDataUpto("2018-02-16", 7))
  
  
  