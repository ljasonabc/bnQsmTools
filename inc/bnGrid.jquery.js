/*
	Element Resize Listener
*/
;(function ( $, window, document, undefined ) {
	
  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);

  var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();
  
  var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
           window.clearTimeout;
    return function(id){ return cancel(id); };
  })();
  
  function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function(fn){
        fn.call(trigger, e);
      });
    });
  }
  
  function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }
  
  window.addResizeListener = function(element, fn){
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      if (attachEvent) {
        element.__resizeTrigger__ = element;
        element.attachEvent('onresize', resizeListener);
      }
      else {
        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
        var obj = element.__resizeTrigger__ = document.createElement('object'); 
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        obj.__resizeElement__ = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.__resizeListeners__.push(fn);
  };
  
  window.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      if (attachEvent) element.detachEvent('onresize', resizeListener);
      else {
        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  }
})( jQuery, window, document );

/*
	bnGrid
*/
;(function ( $, window, document, undefined ) {
		
	$.fn.percWidth = function(){
	  return this.outerWidth() / this.parent().outerWidth() * 100;
	}
	
    $.widget( "bn.bnGrid" , {
        options: {
			matrix: {
				cols: 4,
				rows: 4
			},
			pad: {
				cols: 5,
				rows: 5
			},
			config:{
				mobileGrid:true
			}
        },
		
        _create: function () {
			//$.extend(true,this.options, this.config);
			this.vars = {
				gridTotal:0,
				boxTotal: 0,
				gridWidth: 0,
				gridHeight: 0,
				sBoxHeight: 0,
				sBoxWidth: 0,
				checkCol:0,
				checkRow:0,
				placed: [],
				boxes: [],
				container: {},
				matrix: undefined
				
			}
			//console.log('***** Start BN grid *******');	
			var obj = this;
	
			obj.vars.container = obj.element;
			this.vars.matrix = this._Matrix(obj.options.matrix.rows, obj.options.matrix.cols);	
			obj.vars.gridTotal  = obj.options.matrix.cols * obj.options.matrix.rows;
			//console.log('Total grid cells: ' + obj.vars.gridTotal);
			// Get Boxes and absolute them
			obj.element.children().each(function( index, mvars ) {
				boxRows = $(this).data('rows');
				boxCols = $(this).data('cols');
				boxId = this; // get dom object for elements without id's
				// Correct incorrect sizes larger as the Matrix
				if(boxCols > obj.options.matrix.cols){ boxCols = obj.options.matrix.cols }
				if(boxRows > obj.options.matrix.rows){ boxRows = obj.options.matrix.rows }
				obj.vars.boxes.push({'boxRows': boxRows, 'boxCols': boxCols, 'boxId': boxId, 'boxWidth': 0, 'boxHeight': 0, postop: '', posleft: '' }); 
				//console.log('Index: ' + index + ' cols: ' + boxCols + ' rows: ' + boxRows);
				obj.vars.boxTotal = obj.vars.boxTotal + boxRows * boxCols;
			}).css("position","absolute");
			//console.log('Total box cells: ' + obj.vars.boxTotal);
			//console.log(this.vars.matrix);
			//console.log(this.element);
			this._buildGrid();
			 
			//$(window).resize(function(){ obj.resizeGrid(); }); 

			var myElement = this.element[0],
				myResizeFn = function(){
					obj.resizeGrid();
					obj._trigger('customResizeEvent', null);
				};
			addResizeListener(myElement, myResizeFn);

			//console.log(this.vars.boxes);
			//console.log(this.vars.matrix);
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
			removeResizeListener(this.element, myResizeFn)
        },
		resizeGrid: function(){
			this._resizeBoxes();
			this._placeBoxes();
			this._trigger( "complete", null );
			this._trigger('customResizeEvent', null);
		},
		_buildGrid: function(){
			this.vars.checkRow = 0;
			this.vars.checkCol = 0;
			var exitBreak = 0, exitBreak2 = 0;
			// buffer placed
			for (i=0; i < this.vars.boxes.length;i++){ this.vars.placed[i] = false; }
			while(this.vars.placed.every(this._CheckIfEven) != true && exitBreak < 500){
				exitBreak++;
				this.vars.checkRow = 0;
				this.vars.checkCol = 0;
				el = this.vars.placed.indexOf(false);
				//console.log(el);
				while (this._checkPlace(this.vars.boxes[el].boxRows,this.vars.boxes[el].boxCols, this.vars.checkRow, this.vars.checkCol) != true && exitBreak2 < 2000){
					if(this.vars.checkCol > this.options.matrix.cols){
						this.vars.checkCol = 0;
						this.vars.checkRow++;
					} else { this.vars.checkCol++; }
					exitBreak2++;
					
				} 
				//console.log($(this.vars.boxes[el].boxId).attr('id') + ': ' + this.vars.checkRow + ' ' + this.vars.checkCol);
				this._place(this.vars.boxes[el].boxRows,this.vars.boxes[el].boxCols,this.vars.checkRow,this.vars.checkCol,$(this.vars.boxes[el].boxId).attr('id'));
				this.vars.placed[el] = true;
			}
			//console.log(this.vars.placed);
			this._resizeBoxes();
			this._placeBoxes();
			this._trigger( "complete", null );
		},
		_Matrix: function(length){
			var arr = new Array(length || 0),
				i = length;
			if (arguments.length > 1) {
				var args = Array.prototype.slice.call(arguments, 1);
				while(i--) arr[length-1 - i] = this._Matrix.apply(this, args);
			}
			return arr;
		},
		_checkMatrix: function (row,col){
			try{
			   if(this.vars.matrix[row][col] == undefined) return true;
			   else return false;
			}catch(e){ console.log(e); }
		},
		_CheckIfEven: function (value, index, ar) {
			if (value == true)
				return true;
			else
				return false;
		},
		_checkPlace: function (bRows,bCols,sRow,sCol){
			count = 0;
			check = [];
			for (cr = 0; cr < bRows; cr++){
				for (cc = 0; cc < bCols; cc++){
					if(sCol + bCols > this.options.matrix.cols ){
						return false;
					}
					check[count] = this._checkMatrix (sRow + cr, sCol + cc);
					count++;
				} count++;
			} 
			return check.every(this._CheckIfEven);
		},
		_place: function (bRows,bCols,sRow,sCol,value){
			if (value == undefined) value = '';
			for (cr = 0; cr < bRows; cr++){
				for (cc = 0; cc < bCols; cc++){
					this.vars.matrix[sRow + cr][sCol + cc] = value;
				}
			}
		},
		_placeBoxes: function(){
			// place Boxes 
			var vLeft = this.options.pad.cols;
			var vTop  = this.options.pad.rows;
			var isPlaced = [];
			index =0;
			for (trows = 0; trows < this.options.matrix.rows; trows ++){
				vLeft = this.options.pad.cols;
				for (tcols = 0; tcols < this.options.matrix.cols; tcols ++){
					 if(isPlaced[this.vars.matrix[trows][tcols]] == undefined) {
						$('#'+this.vars.matrix[trows][tcols]).css( {
							"top": vTop + 'px',
							"left": vLeft + 'px'
						} );
						if(this.vars.matrix[trows][tcols] != undefined) isPlaced[this.vars.matrix[trows][tcols]] = true;
						index++;
					} 
					vLeft = vLeft + this.vars.sBoxWidth + this.options.pad.cols;
				}
				vTop = vTop + this.vars.sBoxHeight + this.options.pad.rows;
			}
			//console.log(isPlaced);
		},
		_resizeBoxes: function (){
			obj = this;
			// GridContainer Width
			obj.vars.gridWidth  = obj.vars.container.width() -(1*obj.options.pad.cols );
			obj.vars.gridHeight = obj.vars.container.height()-(1*obj.options.pad.rows );
			// a Single gridBox Width / Height 
			obj.vars.sBoxWidth  = Math.floor(( obj.vars.gridWidth -(obj.options.matrix.cols*obj.options.pad.cols))/obj.options.matrix.cols);
			obj.vars.sBoxHeight = Math.floor(( obj.vars.gridHeight-(obj.options.matrix.rows*obj.options.pad.rows))/obj.options.matrix.rows);
			//console.log("Grid width: "  + obj.vars.gridWidth + " height: " + obj.vars.gridHeight); 
			//console.log("sBox width: "  + obj.vars.sBoxWidth + " height: " + obj.vars.sBoxHeight); 
			// Calc Box Dimesion based on boxRows and boxCols
			obj.vars.boxes.forEach(function(element, index){
				boxHeight = Math.floor((obj.vars.sBoxHeight*obj.vars.boxes[index].boxRows)+obj.options.pad.rows *(-1+obj.vars.boxes[index].boxRows));
				boxWidth  = Math.floor((obj.vars.sBoxWidth *obj.vars.boxes[index].boxCols)+obj.options.pad.cols *(-1+obj.vars.boxes[index].boxCols));
				//console.log(obj.vars.boxes[index].boxId);
				$(obj.vars.boxes[index].boxId).css( {
					"width": boxWidth + 'px',
					"height": boxHeight + 'px'
				} );
			});
		},
        // Respond to any changes the user makes to the
        // option method
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );