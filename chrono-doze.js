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
        {day:'Mon',naps:[{start:"00:34", end:"08:04", color:'#20FF20'}] ,quality:"green", color:'#C0FFC0'},
        {day:'Tue',naps:[{start:"00:44", end:"08:51", color:'#20FF20'}] ,quality:"green", color:'#C0FFC0'},
        {day:'Wed',naps:[{start:"00:10", end:"08:22", color:'#20FF20'}] ,quality:"green", color:'#C0FFC0'},
        {day:'Thu',naps:[{start:"23:23", end:"09:47", color:'#2020FF'}] ,quality:"blue", color:'#C0C0FF'},
        {day:'Fri',naps:[{start:"02:18", end:"06:15", color:'#FF2020'},
        								 {start:"14:04", end:"15:10", color:'#FF2020'}] ,quality:"red", color:'#FFC0C0'},
        {day:'Sat',naps:[{start:"00:31", end:"08:32", color:'#20FF20'}] ,quality:"green", color:'#C0FFC0'},
        {day:'Sun',naps:[] ,quality:"green", color:'#DCDCDC'}
        
    ];
  //var timeparser = d3.timeParse("%I:%M%p");
  var timeParse =d3.timeParse("%H:%M");
  var time = timeParse("12:34");
  var dayratio = function(time) { 
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
                .style({fill:nap.color});
				};
        
        for (var i = 0, size = circledata.naps.length; i < size ; i++){
        		nap = circledata.naps[i]
        		console.log(nap);
        		addpathForeground(nap);
        };

  };
  
  var create7Circle=function(svg,innerRadius,outerRadius,gapRatio,weekdata){
  		var width = (outerRadius - innerRadius) / (7 + 6*gapRatio);
      var gap = width * gapRatio;
      for (var day = 0; day < 7 ; day++){
      		outerRadius=innerRadius+width;
          console.log(weekdata)
          createCircle(svg,innerRadius,outerRadius, weekdata[day]); 
          console.log(weekdata[day].day);
          innerRadius = outerRadius+gap;
      }
  
  };
  var width=400;
  var height=400;
  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
  //createCircle(svg,180,200,  {day:'Thu',naps:[{start:"23:23", end:"09:47", color:'#2020FF'}] ,quality:"blue", color:'#C0C0FF'}); 
  console.log(weekdata);
  create7Circle(svg, 40,200,0.2,weekdata);
  
  
  