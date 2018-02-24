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
                       color: "rgb(232, 232, 232)"}
    
  var time = timeParse("02. 07. 2017 13:51");
  var nap2angles=function(nap, daydata){
  	var t1=timeParse(nap.start);
    var t2=timeParse(nap.end);
    var t1r=(t1.getHours()*60 + t1.getMinutes()) / (24*60)
    var t2r=(t2.getHours()*60 + t2.getMinutes()) / (24*60)
    if (t1r>t2r) {t1r=t1r-1}
    return {start:t1r*2*Math.PI, end:t2r*2*Math.PI} 
    
  }
  console.log(nap2angles({"id": "1518209146430", "start": "10. 02. 2018 2:15", "end": "10. 02. 2018 9:15", "hours": "7.000"}))
  
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
        		var angles=nap2angles(nap)
        		svg.append('path')
                .datum({
                    startAngle:angles.start,
                    endAngle:angles.end
                })
                .attr({d:arcForeground})
                .style({fill:nap.color, opacity:0.9});
				};
        
        for (var i = 0, size = circledata.naps.length; i < size ; i++){
        		nap = circledata.naps[i]
        		console.log(nap);
        		addpathForeground(nap);
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
        				.attr("x", 0)
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
      var days= svg.selectAll(".day")
          .data(weekdata)
      days.enter()
          .append("g").attr("id",function(d,i){return "day"+i})
          .attr("class", "day");
    
      days.each(function(daydata,dayindex){
            var dayinnerRadius=innerRadius+dayindex*(width+gap)
            var dayouterRadius=dayinnerRadius+width
            dayCircleGroup=d3.select(this)
            createCircle(dayCircleGroup,dayinnerRadius,dayouterRadius, daydata)
          })
      days.exit().remove()
      return days
  };

  var width=522;
  var height=522;
  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", 1.2*height) //extra height for navbar
  var chronos =d3.select("svg").append("g")
    .attr("id","chronos")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  var navbar = d3.select("svg").append("g")
    .attr("id","chrono-nav")
  
//Add the SVG Text Element to the svgContainer
//https://www.dashingd3js.com/svg-text-element
var buttonData = [{glyph: "<<", intent: "prevWeek", xratio: 0.125},
                  {glyph: "<" , intent: "prevDay" , xratio: 0.375},
                  {glyph: ">" , intent: "nextDay" , xratio: 0.625},
                  {glyph: ">>", intent: "nextWeek", xratio: 0.875}
                 ]
var navbartext = navbar.selectAll("text")
                        .data(buttonData)
                        .enter()
                        .append("text");
navbartext = navbartext
              .attr("x", function(d) { return width*d.xratio; })
              .attr("y", function(d) { return height*1.1; })
              .attr("id", function(d){return d.intent})
              .text( function (d) { return d.glyph; })
              .attr("font-family", "sans-serif")
              .attr("text-anchor","middle")
              .attr("font-size", "32px")
              .attr("cursor", "pointer")
              .attr("fill", "grey");

d3.select("#prevDay").on("click",function(){
  console.log("prevDay")
  currentDay=addDays(currentDay,-1) || Date()
  console.log(currentDay)
  daysDisplay.remove()
  daysDisplay=create7Circle(chronos,160,256,0.05, getNdaysDataUpto(currentDay, 7))
  
})

d3.select("#nextDay").on("click",function(){
  console.log("nextDay")
  currentDay=addDays(currentDay,1) || Date()
  daysDisplay.remove()
  daysDisplay=create7Circle(chronos,160,256,0.05, getNdaysDataUpto(currentDay, 7))
  
})

d3.select("#prevWeek").on("click",function(){
  console.log("prevDay")
  currentDay=addDays(currentDay,-7) || Date()
  console.log(currentDay)
  daysDisplay.remove()
  daysDisplay=create7Circle(chronos,160,256,0.05, getNdaysDataUpto(currentDay, 7))
  
})

d3.select("#nextWeek").on("click",function(){
  console.log("nextDay")
  currentDay=addDays(currentDay,7) || Date()
  daysDisplay.remove()
  daysDisplay=create7Circle(chronos,160,256,0.05, getNdaysDataUpto(currentDay, 7))
  
})


  //Test WeekView
  //createCircle(svg,180,200,  {weekday:'Thu',naps:[{start:"23:23", end:"09:47", color:'#2020FF'}] ,quality:"blue", color:'#C0C0FF'}); 
  //console.log(weekdata);
  //create7Circle(svg, 64,250,0.2,weekdata);
  //createCircle(svg,250,256,daydataticks)
  console.log("AllData")
  console.log(allnapsdata)
  var currentDay = Date()
  var daysDisplay=create7Circle(chronos,160,256,0.05, getNdaysDataUpto(currentDay, 7))
  //create7Circle(chronos,164,250,0.2, getNdaysDataUpto("2018-02-03", 7))
  //console.log("7days",days)
  createCircle(chronos,256,261,daydataticks)
  //days.data(getNdaysDataUpto("2018-01-03", 7))

  
  //days.remove()

  
  
  