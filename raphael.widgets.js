/**
NOTE THAT
(1)The checkbox was inspired by another contributor
(2)It is referenced as <paper>.factory.widgets.checkbox in this incarnation
* raphael.checkbox plugin
* Copyright (c) 2012 @author: top-flight
*
* Original code provided by Ilkka Syrj?ri and I just converted it into a reusable plugin
* See http://groups.google.com/group/raphaeljs/browse_thread/thread/c19baf037e266e87 for more info
* Licensed under the MIT license
*
Raphael Widgets plugin version 1.1 / March 2012
Contains initial widgets for data input and user interaction using Raphael
Button
Checkbox
Slider
Dropdown (1.1~options object included to modify class at run time)+
* Copyright (c) 2012 @author: irunmywebsite
* "IRUNMYWEBSITE"-All other code defaults to MIT licensing
*/
(function() {
	Raphael.fn.widgets = {
		button: function (paper,xpos, ypos, r, labeltext, textStroke, buttonFill, font_size, onclick) {
		this.buttonSet = paper.set();
		if(!(textStroke&&buttonFill)){ textStroke="#000";buttonFill="#FFF"; }
		if(!font_size)font_size=18;
		stroke_width=5;
		
		/*Back layer*/
		this.backLayerAttrs		= { fill: buttonFill, 'fill-opacity': 0  , stroke: textStroke,'stroke-width':stroke_width, 'stroke-opacity':0};
		this.backLayer = 	paper.circle(xpos, ypos, r).attr(this.backLayerAttrs);
		this.buttonSet.push(this.backLayer);
    
		/*The text automatically centres itself as this is the default text positioning for Raphael text*/
		this.labelAttrs 		= {fill:textStroke, 'font-size':font_size};	
		this.label = 	paper.text(xpos, ypos, labeltext).attr(this.labelAttrs);
		this.buttonSet.push(this.label);
	
		/*Now we make a copy for the front layer and we also make the back layer opaque. So that you can see it's fill*/
		this.frontLayer = this.backLayer.clone();
		this.backLayer.attr( { 'fill-opacity': 1, 'stroke-opacity':1 });
    
		/*Now make the back layer and the text referencable for the mouseover, mouseout and click event of the front layer*/ 
		this.frontLayer.backLayer=this.backLayer;
		this.frontLayer.label =this.label;
		this.buttonSet.push(this.frontLayer);
    
		/*Add a preferred cursor by referencing the underlying DOM object of the frontLayer*/
		this.frontLayer.node.style.cursor = 'pointer';

		/*Now you can interact with the lower layesrs behind the invisible covering layer ( frontLayer ) in it's event methods*/
		this.frontLayer.mouseover(
		function (e) 
		{
			this.backLayer.animate({ fill: textStroke, stroke: buttonFill }, 1000);
			this.label.animate({ fill: buttonFill }, 1000);
		}
	);	
	this.frontLayer.mouseout(
	function (e) {
		this.backLayer.animate({ fill: buttonFill, stroke: textStroke }, 1000);
		this.label.animate({ fill: textStroke }, 1000);
		}
	);	

    this.frontLayer.click( onclick );

	return this.buttonSet;	    
	},
	dropdown: function (paper, xpos, ypos, cellHeight, visibleValues, keyValues, onSelect, options) 
	{
 		this.label=[];
 		this.frontLayer=[];
 		this.frontLayer.opened=false;
 		this.maxWidth=0;
 		this.frontLayer.cellHeight=cellHeight;
 		this.frontLayer.visibleValues=visibleValues;
		var dropdownset= paper.set();
		var vmlWidth=null;
		var backColour="#FFFF00";
		var colour='#FF0000';
		var fontSize=16;
		/*Options colour is text colour, background colour should be different to destinguish the text*/
		if(options)
		{
			if(options.backColour)backColour=options.backColour;
			if(options.colour)colour=options.colour;
			if(options.vmlWidth)vmlWidth=options.vmlWidth;
			if(options.fontSize)fontSize=options.fontSize;
			
		}
		/******************************************************************************/
		/*CONSTRUCTOR******************************************************************/
		/******************************************************************************/
		for (i = visibleValues.length-1; i >-1 ; i--) 
		{
	    	/*Construct label*/
	    	this.label[i] 			=paper.text(xpos, ypos+(cellHeight/2), visibleValues[i]).attr({fill:colour, 'font-size':fontSize, 'text-anchor':'start'});
	    	this.width				=this.label[i].getBBox().width;
	    	if(this.width > this.maxWidth)this.maxWidth=this.width;
	    
	    	/*Construct front and back layers that will sandwich label*/
	    	this.frontLayer[i]	= paper.rect(xpos, ypos, this.width, cellHeight, 3);
	    	this.frontLayer[i].attr({ fill: backColour,stroke: colour, 'fill-opacity': 0 , 'stroke-opacity':0 , 'stroke-width':0});
	    	this.frontLayer[i].backLayer=this.frontLayer[i].clone();
	    	this.frontLayer[i].backLayer.attr( { 'fill-opacity': 1, 'stroke-opacity': 1, 'stroke-width':1 });
	    
	    	/*Now make the text referencable for the mouseover, mouseout and click event of the front layer*/ 
	    	this.frontLayer[i].label=this.label[i];
	    
	    	/*Associate key/value with cell*/
	    	this.frontLayer[i].key		=keyValues[i];
	    	this.frontLayer[i].value	=visibleValues[i];
	    
	    	/*Add a preferred cursor by referencing the underlying DOM object of the frontLayer*/
	    	this.frontLayer[i].node.style.cursor = 'pointer';
		
	    	/*Now you can interact with the lower layers behind the invisible covering layer ( frontLayer ) in it's event methods*/
	    	this.frontLayer[i].mouseover(
			function (e) {
	    		this.backLayer.animate({ fill: colour, stroke: backColour }, 1000);
	    		this.label.animate({ fill: backColour }, 1000);
	    	}
	    	);	
	    	this.frontLayer[i].mouseout(
	    	function (e) {
	    		this.backLayer.animate({ fill: backColour, stroke: colour }, 1000);
	    		this.label.animate({ fill: colour }, 1000);
	    	}
	    	);
	    	this.frontLayer[i].click(
	    	function (e) {
	    		this.frontLayer.opened=openClose(this.frontLayer.cellHeight,this.dropArrow,this.frontLayer.opened);
	    		this.backLayer.toFront();
	    		this.label.toFront();
	    		this.toFront();
	    		/*Store current selection*/
	    		this.frontLayer.selectedkey		=this.key;
	    		this.frontLayer.selectedvalue	=this.value;	    		
	    		if(!onSelect)
	    		{
	    			alert("Please include a function to run in your parameters list:\n\nRecieved Key="+this.key+"\nRecieved Value="+this.value);
	    		}
	    		else
	    		{
	    			onSelect(this.key,this.value);
	    		}
	    	}
	    	);	
	    	this.frontLayer[i].backLayer.insertBefore(this.frontLayer[i].label);
	    	this.frontLayer[i].label.insertBefore(this.frontLayer[i]);
	    	this.frontLayer[i].frontLayer=this.frontLayer;
	    	dropdownset.push(this.frontLayer[i].backLayer,this.label[i], this.frontLayer[i]);
    	}
    	/*Detect vml-Manually alter width*/
    	if(vmlWidth&&Raphael.vml)
    	{
    		this.maxWidth=vmlWidth;
    	}
    	else if(Raphael.vml)
    	{
    		this.maxWidth=150;
    	}
    	/*Extend the front and back layer to hide longer cells*/
    	for (i = visibleValues.length-1; i >-1 ; i--) { this.frontLayer[i].backLayer.attr({ width:this.maxWidth });
    	this.frontLayer[i].attr({ width:this.maxWidth }); }
        
    	/*Draws square drop down arrow-Position this when drop down width calculated*/
    	this.arrowX=xpos+this.maxWidth+(cellHeight/2);
    	arrowpath='M'+this.arrowX+" "+ ypos+" "+ "h"+(cellHeight/2)+"v"+cellHeight+"h-"+cellHeight+"v-"+cellHeight+"h"+(cellHeight/2)+"v"+cellHeight;
    	this.dropArrow = paper.path(arrowpath);
    	this.dropArrow.attr({stroke:colour,fill:backColour, 'stroke-width': 3 ,'arrow-end': 'classic-wide-long'});
    	this.dropArrow.click(
    	function (e) {
    		this.frontLayer.opened=openClose(this.frontLayer.cellHeight,this,this.frontLayer.opened);
    	}
		);
	
		for (i = visibleValues.length-1; i >-1 ; i--) { this.frontLayer[i].dropArrow=this.dropArrow; }

		dropdownset.push(this.dropArrow);
		setCells=function (frontLayer, visibleValues, cellHeight, direction)
		{
			for (i = visibleValues.length-1; i >-1 ; i--) 
    		{
	  			currentY=frontLayer[i].attr("y");newY=currentY+(i * cellHeight * direction);
	    		frontLayer[i].animate( {y: newY },500 );
	    		currentY=frontLayer[i].label.attr("y");newY=currentY+(i * cellHeight * direction);
	    		frontLayer[i].label.animate( {y:newY},500   );
	    		currentY=frontLayer[i].backLayer.attr("y");newY=currentY+(i * cellHeight * direction);
	    		frontLayer[i].backLayer.animate( {y:newY},500 );
			}
		}
		openClose=function (cellHeight,dropArrow,opened)
 		{
			if(opened)
	 		{
				setCells(dropArrow.frontLayer,dropArrow.frontLayer.visibleValues,cellHeight, -1);
				opened=false;		 	
	 		}
	 		else
	 		{
	 			setCells(dropArrow.frontLayer,dropArrow.frontLayer.visibleValues,cellHeight, 1);
				opened=true;
			}
			dropArrow.rotate(180);
			return opened;
		}
		this.dropArrow.frontLayer=this.frontLayer;
    
    	return dropdownset;
    
    },
		slider: 	function (paper, x1, y1, pathString, colour, pathWidth,percentageMax,sliderOutput,initialPercentage) {
		var slider = paper.set();
		var sliderOut=function(pcOut){ if(sliderOutput){ sliderOutput(pcOut); } };
		var position=0;
		var percentageMax=percentageMax?percentageMax:100;
		slider.push(paper.path("M"+x1+" "+y1+pathString)).attr( {stroke:colour,"stroke-width": pathWidth } );
		slider.PathLength		= slider[0].getTotalLength();
		if(initialPercentage)
		{
			position=(initialPercentage/100)*slider.PathLength;
		}
		else
		{
			initialPercentage=0;
		}
		slider.PathPointOne 	= slider[0].getPointAtLength(position);
		slider.PathPointTwo 	= slider[0].getPointAtLength(slider.PathLength);
		slider.PathBox			= slider[0].getBBox();
		slider.PathBoxWidth		= slider.PathBox.width;
		slider.push(paper.circle(slider.PathPointOne.x, slider.PathPointOne.y, pathWidth/2).attr( 	{fill:colour,	"stroke-width": 0,"stroke-opacity": 0 }) );					
		slider.push(paper.circle(slider.PathPointTwo.x, slider.PathPointTwo.y, pathWidth/2).attr( 	{fill:colour,	"stroke-width": 0,"stroke-opacity": 0 }) );
		/*Slider Button*/
		sButtonBack=paper.circle(slider.PathPointOne.x, slider.PathPointOne.y, pathWidth);
		sButtonBack.attr({ fill: "#00f","stroke-width": 1,"fill-opacity": 1, stroke: "#00f"  } );
		slider.push(sButtonBack);		
		sliderText=paper.text(slider.PathPointOne.x,slider.PathPointOne.y,initialPercentage ).attr({fill:'#FFF', 'font-size':16, 'stroke-width':0 });
		slider.push(sliderText);
		sButton=paper.circle(slider.PathPointOne.x, slider.PathPointOne.y, pathWidth);
		sButton.attr({    fill: "#00f","stroke-width": 1,"fill-opacity": 0.1, stroke: "#00f"  } );
		sButton.mouseout(function (e) { this.attr({"fill-opacity": 0.1, "stroke-width":1}); });
		sButton.mouseover(function (e){ this.attr({"fill-opacity": 0.3, "stroke-width":3}); });		
		var start = function ()
		{
			this.ox = this.attr("cx");
		},
		move = function (dx, dy)
		{
			pcAlongLine=(this.ox+dx-x1)/slider.PathBoxWidth;
			slider.PathPointOne = slider[0].getPointAtLength(pcAlongLine*slider.PathLength);
			att = {cx: slider.PathPointOne.x, cy: slider.PathPointOne.y};
			this.attr(att);sButtonBack.attr(att);
			slider.currentValue=Math.round(((this.attr("cx")-slider.PathBox.x)/slider.PathBox.width)*percentageMax);
			sliderText.attr({text:slider.currentValue,x: slider.PathPointOne.x, y: slider.PathPointOne.y});
			bbox=sliderText.getBBox();
			sButton.attr({r:(bbox.width/2)});
			sButtonBack.attr({r:(bbox.width/2)});
			sliderOut(slider.currentValue);
		},
		up = function () 
		{
			// 
		};	
		sButton.drag(move, start, up);
		slider.push(sButton);											
        return slider;
    },
	checkbox: 	function (paper, x1, y1, w, h, r, oncheck) 
	{
        var checkbox = paper.set();
        checkbox.push(paper.rect(x1 - 1, y1 - 1, w + 2, h + 2, r).attr({"stroke": "#ff0000", "stroke-width": "2", "opacity": "0"}));
        checkbox.push(paper.rect(x1, y1, w, h, r).attr({"stroke": "#000", "stroke-width": "2", "fill": "#fff"}));
        checkbox.push(paper.path("M2.379,14.729 5.208,11.899 12.958,19.648 25.877,6.733 28.707,9.561 12.958,25.308z"));
        checkbox[2].attr({"fill": "#000", "stroke": "none", "opacity" : "0"}).translate(x1, y1);
        checkbox[2].selected=false;
        checkbox.hover(
            function () {
                checkbox[0].animate({"opacity" : "1"}, 200);
              
            },
            function () {
                checkbox[0].animate({"opacity" : "0"}, 200);
                
            }
        );
        checkbox.click(
            function () {
	            checkbox[2].selected=checkbox[2].selected?false:true;
	            if(!oncheck)
	            {
		            /*Default oncheck function if this parameter is excluded*/
	            	oncheck=function () {alert("Please Specify a function for oncheck action");}; 
            	}
            	else
            	{
	            	checkbox[2].animate({"opacity" : (checkbox[2].attr("opacity") == 0) ? "1" : "0"}, 200, oncheck(checkbox[2].selected));
            	}
            }
        );
        return checkbox;
    }
};    

})();