var timeParse = d3.timeParse("%d. %m. %Y %H:%M");
var dateParse = d3.timeParse("%Y-%m-%d")
var formatDate = d3.timeFormat("%Y-%m-%d")
var formatWeekday = d3.timeFormat("%a")
var date2weekday=function(date){return formatWeekday(dateParse(date))}
//Test date&time
console.log(timeParse("03. 02. 2018 7:20"))
console.log(timeParse("05. 02. 2018 23:30"))
console.log(formatDate(timeParse("05. 02. 2018 23:30")))
console.log(date2weekday("2018-02-05"))

var groupByDate=function(allnapsdata, f) {
	//groupByDate function will define how naps are seggregated into days. An example problem: 
  //How to determine day of naps which are across date boundaries. ex (26th 23:38 - 27th 6:05)
  //
  //This particular implementation sets the day of the nap as the end-day of the nap.
  //optionally provide f: f( nap ) ==> date-of-nap
  if (typeof f === 'undefined') {
  	f = function( nap ) { return formatDate(timeParse(nap.end)) }
  }
  var days={};
  allnapsdata.forEach( function( nap )
  {
    var date = f(nap) ;
    days[date] = days[date] || {naps:[], weekday:date2weekday(date)};
    days[date].naps.push( nap );  
  });  
  
  for (var date in days ){
      dailyhours=0
      for (var nap of days[date].naps ) {
        dailyhours=dailyhours+parseFloat(nap.hours);
      }
      days[date].totalhours=dailyhours
      days[date].date=date
  }
  return days
}

//var result = groupBy(allnapsdata,function( nap ) { return formatDate(timeParse(nap.end))} ) 
var alldaysdata = groupByDate(allnapsdata)
var alldataKeys = Object.keys(alldaysdata)
console.log(alldaysdata)
console.log(alldataKeys)

var napQuality=function(nap){
  if (nap.quality !== undefined) {return parseFloat(nap.quality)}
  else {return 1}

};

//test napQuality
nq1=napQuality({"id": "1518148821592", "start": "09. 02. 2018 9:30", "end": "09. 02. 2018 15:50", "hours": "6.330"})
nq2=napQuality({"id": "1518148821592", "start": "09. 02. 2018 9:30", "end": "09. 02. 2018 15:50", "hours": "6.330", "quality":0.8})
console.log(nq1)
console.log(nq2)

var dayQuality=function(daydata,qf){
  //dayQuality determines the quality of sleeep for a particular day (dquality)
  //The quality is an aggregate measure combining information about the 
  //number of naps, nap-quality, nap-durations, etc. through some complex 
  //or simple function. 
  //An optional function qf can be passed in for computing the same and the 
  //evaluation of quality and the range of quality-values and interpretation 
  //of those values is left open to the author(s) of the quality function qf.
  //For simplicity and practical utility though a simpler classification is needed 
  //and chronodoze requires the interpretation of given quality in a ternary system
  //  ie (inadequate/ optimal / surplus)
  //  or ( the-bad / the-good/ the-ugly) ,if you will.
  //  as (   -1   /    0    /    1     )
  //
  //So optionally provide qf: df( daydata ) ==> dquality-object
  //where dquality.value ~ anything
  //			dquality.interpret ~ -1/0/1	
  if (daydata.dquality !== undefined) {
  		return daydata.dqualit
  }else {
  // T
  		if (typeof qf == "function") {
      	return qf(daydata);
      }else{
      	qf=function(daydata,effDailyTotalIdeal){
        	//This takes a  weighted sum of nap durations in day as the
          //effective-total-sleep where weight ~ {nap-quality}.This is normalised 
          //to an ideal effective-total to get score. 
          //efftotal within one hour of deviation from ideal is considered optimal(0).
          //Lesser is inadequate(-1) and more is surplus(+1).
          effDailyTotalIdeal = effDailyTotalIdeal || 8
          efftotal=0
          for (var i=0; i<daydata.naps.length; i++) {
            nap=daydata.naps[i]
            efftotal=efftotal+parseFloat(nap.hours)*parseFloat(napQuality(nap));
          }
          var dquality = {};
          dquality.value=efftotal/effDailyTotalIdeal;
          if (efftotal<effDailyTotalIdeal-1){dquality.interpret=-1}
          else if(efftotal>effDailyTotalIdeal+1){dquality.interpret=1}
          else {dquality.interpret=0}
          return dquality
       	}
      return qf(daydata)
      }
  }
};

//test napQuality
dq1=dayQuality(alldaysdata["2017-07-04"])
dq2=dayQuality(alldaysdata["2017-07-05"])
console.log(dq1)
console.log(dq2)

var dateRange = function(startDate, endDate) {
  if (typeof startDate === 'string'){
    startDate=dateParse(startDate)
  }
  if (typeof endDate === 'string'){
    endDate=dateParse(endDate)
  }
  var dates = [];
  var currentDate=startDate;
  dates.push(new Date(currentDate));
  while( currentDate < endDate ){
    currentDate.setDate(currentDate.getDate() + 1);
    dates.push(new Date(currentDate));
  }
  return dates

}

// Test dateRange
dates1=dateRange("2017-07-04", "2017-08-04")
dates2=dateRange(new Date( 2017, 06, 04), new Date( 2017, 07, 04))
console.log(dates1)
console.log(dates2)

var colorMyDays=function(days){
	//Applies chronodoze color-scheme according to dquality.interpret
  //Input: A collection of daydata objects . Ie. alldaysdata like object.
  chronodoze_color={
  	red:"rgb(255, 32, 32)",
    green:"rgb(32, 255, 32)",
    blue:"rgb(32, 32, 255)",
    gray:"rgb(32, 32, 32)",
    palered:"rgb(255, 192, 192)",
    palegreen:"rgb(192, 255, 192)",
    paleblue:"rgb(192, 192, 255)",
    palegray:"rgb(192, 192, 192)"
  }
  for (var date in days ){
  	var dcolor, ncolor
  	var dquality=dayQuality(days[date])
    switch(dquality.interpret) {
        case -1:
            dcolor=chronodoze_color['palered']
            ncolor=chronodoze_color['red']
            break;
        case 0:
            dcolor=chronodoze_color['palegreen']
            ncolor=chronodoze_color['green']
            break;
        case 1:
            dcolor=chronodoze_color['paleblue']
            ncolor=chronodoze_color['blue']
            break;
        default:
            dcolor=chronodoze_color['palegray']
            ncolor=chronodoze_color['gray']
    }
    days[date].color=dcolor
    days[date].naps.forEach( function(nap) {nap.color=ncolor});
  }
  return days
}

//Test colorMyDays
alldaysdata=colorMyDays(alldaysdata)
console.log(alldaysdata)