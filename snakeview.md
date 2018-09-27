harsgak, [27.09.18 01:06]

So sleep as android etc have a day axis and an hour axis (Y) . The Y axis goes from 0 to 24.  You can see your pattern along days.
Problem is (even with current chronodoze although somewhat less) that this causes discontinuity. If you sleep 11pm to 6 am then it shows 1 h on day one and 6h on day two.
Also you can imagine how the 1h will be on day 1 top and 6h will be on day 2 bottom. Its almost silly but a tough nut to crack.

One trick is to break the days at times such that the sleep will stay in one day column. ie splice at some other hour like 8pm to 7:59 pm
But still it does not solve the problem (only lessens) as you may sleep on the boudry some days.

Spiral is one good way to see this but it has its own issues. In spiral it is very good for seeing location of the sleeps since they are distributed radially. But it suffers when it comes to perception of quantity.

A sleep of some lenght on the inner part of spiral looks smaller than the same sleep radially outward. So while timings are easily perceptible quantities are not easy to compare. Even using labelling does not resolve the issue practically since humans are wired to compare based on linear length and get stumped if forced to use radial intervals

So while spiral is very useful for phase tracking it is not itself perfect.
The snake view combines the linearity of the simple day-columns view and the continuity of the of the spiral view. 
Like the spiral view it can also be sort of tweaked to highlight day/night patterns, In spiral-24 if 0 is at top, upper portion indicates dark hours (night) and bottom portion indicates light hours (day). Similarly placing 6am, 6pm at the snake twists you can make alternaing bars as day/night. 
You can even make it easier by indicating right-moving parts as day and left-moving as night or (vice versa)

[Diagram of snake view (rough)](snakeview.png)

Also the real thing will be much more compact and neat. Not so much space in between.
Also possibly 24-h units may be spaced with slightly more gap than the two 12-h columns (or not)

In this it'll be easier to see if lengths are decreasing with time. If sleep times are becoming more chaotic or not. Also easier to deal with because of nice linear time axes 

Another advantage of this is that you can stretch or strech along each axis without having to bother about the other. 
Contrasting to spiral where you have to keep the aspect ratio same and are limited by the smaller of the 2 dimensions of rectangular screen. 
Another advantage along similar lines is scrolling, While you have to implement custom scrollers for spiral and need time to get used to,  for snake view you could just draw arbitary lengths and user can use the regular page scrolling that they are already familiar with. You dont have to code it sepeartely.


