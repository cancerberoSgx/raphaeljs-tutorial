//javascript for the raphael tut 
//author: sgurin
(function(){
		
	window.rt={};
	rt.raphaelRefUrl="raphael-ref/index.html";// "http://raphaeljs.com/reference.html";
	
	
	
	
	
	rt.showReference_visited=false;
	rt.showReference_ = function(ref) {
		$("#refererenceDialogFrame").attr("src", rt.raphaelRefUrl+"#"+ref);
		if(!rt.showReference_visited) {
			rt.showReference_visited=true;
			rt.showRefTimer = setTimeout("rt.showReference_('"+ref+"')", 1000);
		}
	}
	rt.showReference = function(ref) {
		if(rt.showRefTimer)
			clearTimeout(rt.showRefTimer);
		rt.showReference_visited=false;
		$("#refererenceDialog").show();
		rt.showReference_(ref);
	}
	
	
	
	// doc init
	$(window).load(function(){
		
		raphaeltutCoreRunPaper = Raphael("exampleDialogContent", 500,500);
		
		$("#refererenceDialogContent").append(
			'<iframe id="refererenceDialogFrame" src="'+rt.raphaelRefUrl+'"></iframe>');
			
		$(".note").before('<div class="note-icon">!</div>')
		$(".note").next().css({clear: "both"})
		
// $("#generated-toc>p").hide();
		
		
		// code - run -dialog
		
		$(".code-run").each(function(){
			$(this).addClass("prettyprint");
			$(this).after('<div class="code-run-button">Run</div>')
			$(this).next().click(function(){
				var code = "var paper = raphaeltutCoreRunPaper;paper.clear();"+$(this).prev().text();
				eval(code);
				$("#exampleDialog").show();
			});
		});
		
		$(".code-run, .code").each(function(){
			if($(this).attr("href")) {
				var target = null; 
				try {
					target = $("#"+$(this).attr("href"));
				} catch (e) {
					// TODO: handle exception
				}
				
				if(target!=null&&target.size()>0) {				
					var codeEl = target.clone(true, true);			
					$(this).after(codeEl);
					codeEl.addClass("prettyprint");
					$(this).remove();
				}
				
			}
		});
		
		$(".raphael-ref").each(function(){
			var onclick = 'rt.showReference(\''+
					$(this).attr("href")+'\');';
			$(this).after('<span class="raphael-ref-link" onclick="'+onclick+'">'+$(this).text()+'</span>');
		});
				
		// index
		
		if($("#generated-index").size()>0) {
			rt.indexCounter=0;
			rt.indexTerms={};
			$(".index").each(function(){				
				if(!$(this).attr("id")) {
					$(this).attr("id", "index-term-"+rt.indexCounter);
					rt.indexCounter++;
				}
				var text = $(this).text().toLowerCase();
				if(!rt.indexTerms[text]) 
					rt.indexTerms[text]=[];
				rt.indexTerms[text].push($(this).attr("id"));
			});
			var sb = [];
			sb.push("<ul>");
			var names = [];
			for(var i in rt.indexTerms) {
				names.push(i);
			}
			names.sort();
			for(var i = 0; i < names.length; i++) {
				sb.push("<li><b>"+names[i]+"</b>: ");
				for (var j = 0; j < rt.indexTerms[names[i]].length; j++) {
					sb.push("<a href=\"#"+rt.indexTerms[names[i]][j]+"\">"+j+"</a>");
				}
				sb.push("</li>");
			}
			sb.push("</ul>");
			
			$("#generated-index").after(sb.join(""));
		}
		
		/*
		 * code-method-doc: method signature documentation like javadoc
		 * formatting. tags: @return @param @signature, use like this and please
		 * respect the order of annotations:
		 * 
		 * <p class="code-method-doc"> @signature paper.rect(x, y, width,
		 * height) @param x the x coord (number) @param y the y coord (number)
		 * @return a new rectangle shape </p>
		 * 
		 * will generate
		 * 
		 * <p class="code-method-doc"> <span class="signature">paper.rect(x, y,
		 * width, height)</span> <span class="param">x - the x cood (number)
		 * </span> <span class="param">y - the y cood (number) </span> <span
		 * class="return">a new rectangle shape</span> </p>
		 */
		$(".code-method-doc").each(function(){
			var t = $(this).text(), returnStr="", signatureStr=null, params=[];
			if(t.indexOf("@return")!=-1) {
				t=t.split("@return");
				if(t.length >= 2)
					returnStr = t[1];
				t=t[0];
			}
			if(t.indexOf("@param")!=-1) {
				t=t.split("@param");
				if(t.length >= 2) {
					for ( var i = 1; i < t.length; i++) {
						params.push(t[i]);
					}
				}
				t=t[0];
			}
			if(t.indexOf("@signature")!=-1) {
				t=t.split("@signature");
				if(t.length >= 2) {
					signatureStr=t[1];
				}
				t=t[0];
			}
			var sb = [];
			if(signatureStr)
				sb.push('Signature: <span class="signature">'+signatureStr+'</span> ');
			if(params.length>0)
				sb.push('Parameters: ');
			for ( var i = 0; i < params.length; i++) 
				sb.push('<span class="param">'+params[i]+'</span>')
			if(returnStr)
				sb.push('Returns: <span class="return">'+returnStr+'</span>');
			
			var s = sb.join("");
// alert(s);
			$(this).prop("innerHTML", s);// .html(s);
			
		});
		
		prettyPrint();
		
//		if(window.raphaeltutTimer1)
//			alert("Tutorial loaded in "+(new Date().getTime()-window.raphaeltutTimer1));
		
	});
	
	
	// code-run test convenient utils
	rt.randomNumber = function(minVal,maxVal,floatVal)	{
	  var randVal = minVal+(Math.random()*(maxVal-minVal));
	  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
	};
	rt.dumpPathObj = function(po) {
		var sb = ["Path{"]; 
		if(po && po.length) for ( var i = 0; i < po.length; i++) {
			sb.push("["); 
			rt.dumpPathCmdObj(sb, po[i])
			sb.push("]");  
		}
		sb.push("}"); 
		return sb.join(""); 
	}; 
	rt.dumpPathCmdObj = function(sb, pco) {
		if(pco && pco.length) for ( var i = 0; i < pco.length; i++) {
			sb.push(pco[i]+" ");
		}		
	}
	rt.randomColor = function() {
		return "rgb("+rt.randomNumber(0,255)+","+rt.randomNumber(0, 255)+", "+rt.randomNumber(0,255)+")";
	};
	
	rt.dump = function(o) {
		var s = "{";
		for(var i in o) {
			s+=i+", ";
		}
		return s+"}";
	};
	
	
	/**
	 * inBetween resolves the problem of being notified when a function is
	 * called N times in in between a time lapsus of T ms. When this state is
	 * detected, the internal counter is reseted, so n+1 won't fire the event,
	 * only when x % n == 0 the listener will be notified.
	 * 
	 * @param n
	 *            the amount of times.
	 * @param t
	 *            the time lapsus in ms
	 * @param callback -
	 *            the function to be called when the returned fcuntion is called
	 *            at least n times in a lapsus of n ms.
	 * @return a new function - when that function is called n times in a lapsus
	 *         of t ms, then callback function will be called using the context
	 *         object as the callback context.
	 */
	rt.inBetween = function(n, t, callback, context) {    
	    var sb = [];
	    sb.push("var that = arguments.callee; ")
	    sb.push("var thisTime = new Date().getTime(); ")
	    sb.push("var arr = that['ARR'];");
	    sb.push("if(!arr){");
	    sb.push("    arr = []; ");
	    sb.push("    for(var i = 0; i < that['N']; i++) arr.push(thisTime); ");
	    sb.push("    that['ARR'] = arr;");
	    sb.push("    that['COUNT']=0");
	    sb.push("}");
	    
	    sb.push("that['COUNT']++; ");;
	    sb.push("arr.push(thisTime);");
	    sb.push("var lastTime = arr.shift();");
	        
	    sb.push("if(that['COUNT'] >= that['N']) {");
	    sb.push("    that['COUNT']=1; ");
	    sb.push("    for(var i = 0; i < that['N']; i++) arr[i] = thisTime; ");
	    sb.push("    if(thisTime-lastTime < that['T']) ");          
	    sb.push("        that['CB'].apply(that['CTX'] ? that['CTX'] : this, arguments); ");
	    sb.push("}");
	        
	    var fn = new Function(sb.join(""));    
	    fn['N']=n;
	    fn['T']=t;
	    fn['CB']=callback;
	    fn['CTX']=context;
	    return fn;        
	}; 
	
	
})();






//small raphael extensions by the author


(function() {
	/**
	 * internal - 
	 */
	var _printLetterOnItsPath = function(letter) {
		var parent = letter._printOnPathParent, p = parent._rm_topathPath; 
		var bb = letter.getBBox();
		var newP = p.getPointAtLength(bb.x);
		var newTransformation = letter.transform() + "T"
				+ (newP.x - bb.x) + ","
				+ (newP.y - bb.y - bb.height);
		// also rotate the letter to correspond the path angle of derivative
//		newTransformation += "R"+newP.alpha; 
//				+ (newP.alpha < 360 ? 180 + newP.alpha : newP.alpha);
		letter.transform(newTransformation);
	}
	/**
	 * internal - do the job of putting all letters in a set returned bu printLetters in a
	 * path. 
	 * 
	 * @param text - a set of shapes 
	 * @param p -
	 *            can be a rpahael path obejct or string
	 */
	var _printOnPath = function(aSet, paper, p) {
		if (typeof (p) == "string")
			p = paper.path(p).attr({
				stroke : "none"
			});
		aSet._rm_topathPath = p;
		aSet.forEach(function(letter, letterIndex){
			if(!letter._printOnPathParent) {
				letter._printOnPathParent=aSet;
			}
			letter.transform(null); 
			_printLetterOnItsPath(letter); 
			
		}); 
	};

	/**
	 * print letter by letter, and return the set of letters (paths), just like
	 * the old raphael print() method did.
	 */
	Raphael.fn.printLetters = function(x, y, str, font, size, letter_spacing,
			line_height, onpath) {
		if(!this.customAttributes.printOnPath) {
			this.customAttributes.printOnPath = function(p) {
				
				var parent = this._printOnPathParent; 
				if(parent &&  parent.paper) {
					alert(p);
//					alert(this+" - "+this.type+" - "+p+" - "+parent.paper);
					if (typeof (p) == "string")
						p = parent.paper.path(p).attr({
							stroke : "none"
						});
					parent._rm_topathPath = p;
					_printLetterOnItsPath(this);
				}
			}
		}
		letter_spacing = letter_spacing || size / 1.5;
		line_height = line_height || size;
		this.setStart();
		var x_ = x, y_ = y;
		for ( var i = 0; i < str.length; i++) {
			if (str.charAt(i) != '\n') {
				var letter = this.print(x_, y_, str.charAt(i), font, size);
				x_ += letter_spacing;
			} else {
				x_ = x;
				y_ += line_height;
			}
		}
		var set = this.setFinish();
		if (onpath) {
			_printOnPath(set, this, onpath);
		}
		if(!set.paper)set.paper=this; 
		return set;
	};

})();

