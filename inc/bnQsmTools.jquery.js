/**************************************************************************************
*						Binom (bn) QlikSense Mashup Toolkit	(jquery)				  *
***************************************************************************************
*		@Author:		Thomas Lindackers (tlr@qlik.com) [t.l@binom-network.org]
*		@Version:		2.0.3
*
*		
*		@Copyright:		
*
*		
*
*
****************************************************************************************/

// Global variablen auslesen / reseten ...
// Selected Color muss komplett dynamisch erfolgen
// ansonsten Probleme mit dem dynamischen Ändern der Farbe





;(function ( $, window, document, undefined ) {
	
	'use strict'
	
	// Array Helper --------------------------------------------------------------------------
	Array.prototype.remove = function() {
		let what, a = arguments, L = a.length, ax;
		while (L && this.length) { what = a[--L]; while ((ax = this.indexOf(what)) !== -1) { 
			this.splice(ax, 1); 
		}} 	return this;
	}
	// Session vars stored here used for e.g. alwaysOneSelectedValue
	let bnQSession = { sliders:[] };
	
	// Helper Function used in different widgets
	let bnHelper = {	
		is_int:function(value){ 
			if(parseFloat(value) == parseInt(value) && !isNaN(value))  return true; else return false;
		},
		checkMobile: function(){
			let checkMobile = false;
			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
				|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) checkMobile = true;
			return checkMobile;
		},
		chunk: function(str, n) {
			let ret = []; let i; let len;
			for(i = 0, len = str.length; i < len; i += n) { ret.push(str.substr(i, n)) }
			return ret
		},
		copyText: function(){
			let copyval; try{ copyval = document.execCommand("copy"); } catch(e){copyval = false; }
			return copyval
		},
		copyInputToClipboard: function (element){
			let field = document.getElementById(element);
			field.focus(); field.setSelectionRange(0, field.value.length); this.copyText();
		},
		restoreAlwaysOneSelected: function (app){
			for (let key in bnQSession.alwaysOneSelectedFields) {
				if (!bbnQSession.alwaysOneSelectedFields.hasOwnProperty(key)) continue;
				app.field(key).selectValues([bnQSession.alwaysOneSelectedFieldsValues[key]], true, true);
			} 
		},
		makeSelection: function (app, element, appField, alwaysOneSelected, stype){
			let temp = '[', toogleField=true;
			
			if($.isArray()){
				 app.field(appField).clear(); toogleField = false;
			} else {
				if( alwaysOneSelected == true){ 
					app.field(appField).clear(); toogleField = false; 
				}
			}
		
			if(stype == 'option'){ vals = $(element).val();
				if($.isArray(vals)) {
					if(vals.length > 1){
						for (i=0; i < vals.length; i++){ i > 0 ? temp += ',': temp += '';
							this.is_int(vals[i])? temp += parseInt(vals[i]) : temp += '{"qText": "'+ vals[i] + '"}';
						}
						selectVal = JSON.parse(temp+']');
					} else this.is_int(vals) ? selectVal = parseInt(vals.toString()) : selectVal = vals.toString();
				} else this.is_int(vals) ? selectVal = parseInt(vals) : selectVal = vals;	
			} else this.is_int($(element).data('value')) ? selectVal = parseInt($(element).data('value')) : selectVal = $(element).data('value'); 
			
			if($.isArray(app)){
				for(i=0; i < app.length;i++){
					$.isArray(selectVal) ?  app[i].app.field(appField).selectValues(selectVal,toogleField) : app[i].app.field(appField).selectValues([selectVal],toogleField);
				}
			} else {
				$.isArray(selectVal) ?  app.field(appField).selectValues(selectVal,toogleField) : app.field(appField).selectValues([selectVal],toogleField);
			}
			
		},
		setvariables: function(apps, bnQSvars){
			if($.isArray(apps)){
				for (appc= 0; appc < apps.length; appc++){
					for (vc =0; vc < bnQSvars.length; vc++){
						if(!isNaN(bnQSvars[vc].value))
							apps[appc].app.
						variable.setNumValue(bnQSvars[vc].name, parseInt(bnQSvars[vc].value));
						else 
							apps[appc].app.variable.setStringValue(bnQSvars[vc].name,bnQSvars[vc].value);
					}
				}
			} else {
				for (vc =0; vc < bnQSvars.length; vc++){
					if(!isNaN(bnQSvars[vc].value))
						apps.variable.setNumValue(bnQSvars[vc].name, parseInt(bnQSvars[vc].value));
						apps.variable.setStringValue(bnQSvars[vc].name,bnQSvars[vc].value);
				}
			}
			this.updatevariables(apps,bnQSvars);
			
		},
		updatevariables: function(apps, bnQSvars){
			if($.isArray(apps)){
				for (appc= 0; appc < apps.length; appc++){
					for (vc =0; vc < bnQSvars.length; vc++){
						this.getvariable(apps[appc].app,bnQSvars[vc].name);
					}
				}
			} else {
				for (vc =0; vc < bnQSvars.length; vc++){
					this.getvariable(apps[appc].app,bnQSvars[vc].name);
				}
			}
		},
		getvariable: function(app,letName){
			let vName = letName;
			 app.variable.getContent(vName,function (reply) {
				$('.'+ vName).html(reply.qContent.qString);
			} ); 
		},
		uniqueId: function() {
			function uid() { return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4(); }

			function s4() {
			  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			
			return 'bn-' + uid();
		},
		hex2rgb: function(hex) {
			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16)
			] : null;
		},
		rgb2hex: function (r, g, b) {
			let hex = [ r.toString( 16 ), g.toString( 16 ), b.toString( 16 ) ];
			$.each( hex, function( nr, val ) {
			  if ( val.length === 1 ) { hex[ nr ] = "0" + val; }
			});
			return hex.join( "" ).toUpperCase();
		},
		rgb2hsl: function (r, g, b){
			r /= 255, g /= 255, b /= 255;
			let max = Math.max(r, g, b), min = Math.min(r, g, b);
			let h, s, l = (max + min) / 2;
			if (max == min) { h = s = 0; } 
			else {
				let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break; }
				h /= 6;
			}
			return [(h*100+0.5)|0, ((s*100+0.5)|0) , ((l*100+0.5)|0)];
		},
		hsl2rgb: function (h, s, l) {
			let m1, m2, hue, r, g, b;
			s /=100; l /= 100;
			if (s == 0)	r = g = b = (l * 255);
			else {	if (l <= 0.5) m2 = l * (s + 1);
				else m2 = l + s - l * s;
				m1 = l * 2 - m2;
				hue = h / 360;
				r = this.hue2rgb(m1, m2, hue + 1/3);
				g = this.hue2rgb(m1, m2, hue);
				b = this.hue2rgb(m1, m2, hue - 1/3);
			}
			return [Math.round(r),Math.round(g), Math.round(b)];
		},
		hue2rgb: function (m1, m2, hue) {
			let v;
			if (hue < 0) hue += 1;
			else if (hue > 1) hue -= 1;
			if (6 * hue < 1) v = m1 + (m2 - m1) * hue * 6;
			else if (2 * hue < 1) v = m2;
			else if (3 * hue < 2) v = m1 + (m2 - m1) * (2/3 - hue) * 6;
			else v = m1;
			return 255 * v;
		},
		selectFromArray: function (aId, aArray, selectedValue){
			let str = '<select id="'+ aId +'">';
			let selected = '';
			for(i=0; i < aArray.length; i++){
				aArray[i].value == selectedValue ? selected = ' selected="selected"' : selected = '';
				str += '<option value="'+ aArray[i].value +'">'+ aArray[i].label +'</option>';
			}
			str += '</select>';
			return str;
		},
		radioFromArray: function (aId, name, aArray, selectedValue){
			let str = '';
			for(i=0; i < aArray.length; i++){
				aArray[i].value == selectedValue ? selected = ' checked="checked"' : selected = "";
				str += ' <input id="'+ aId +'" type="radio" name="'+ name +'" value="'+ aArray[i].value +'"'+ selected +'>'+ aArray[i].label +'</option>';
			}
			return str;
		},
		percHeight: function(hm, hh){
			return Math.floor(100 - (hh/hm*100));
		}
	}
	
	
	/*
		bnQsmTools V 1.0 - "bnQSExpression"
		*****************************************************
		$('body').bnQSExpression({app: app});
		use in HTML
		<span class="bnQSExpression" data-bnqsexpr="sum({1 <Year={$(=max(Year))}>}LineSalesAmount)"></span>
		
		Multiple Apps:
		$('body').bnQSExpression({app: [
			{app: app, appName: 'QSMaster'} , 
			{app: app1, appName: 'Automotive'} ]
		}); 
		use in HTML
		<span class="bnQSExpression QSMaster" data-bnqsexpr="sum({1 <Year={$(=max(Year))}>}LineSalesAmount)"></span>
		<span class="bnQSExpression Automotive" data-bnqsexpr="sum([Car sales])"></span>
	*/
    $.widget( "bn.bnQSExpression" , {
        options: {
			app: '',
			appNames: ''
		},vars :{
			exprUniqueId: 'bnQSexpr'
		},
        _create: function () {
			/*
				
			*/
			obj = this;
			// Multiple else Single App
			if( Object.prototype.toString.call( obj.options.app ) === '[object Array]' ) {
				for(i=0; i < obj.options.app.length; i++ ){
					//console.log(obj.options.app[i].appName)
					this._createExpressions(obj.options.app[i].app,obj.options.app[i].appName)	
				}
			} else {
				this._createExpressions(this.options.app,'')
			}
			this._trigger( "complete", null );
			
        },
		/*
			Generate Expressions for app or apps
		*/
		_createExpressions: function(app, appName){
			let exprChache= []; let exprCount = 0; let genericStr= ''; let selector= '';
			if(appName != '') selector = '.' + appName; 
			$('.bnQSExpression'+ selector).each(function(){
				// Check Expression String and Reuse Class for Input
				if(exprChache[$(this).data('bnqsexpr')] == undefined){
					exprChache[$(this).data('bnqsexpr')] = obj.vars.exprUniqueId + appName + exprCount;
					exprCount > 0 ? genericStr += ',': false;
					genericStr +=  '"'+ obj.vars.exprUniqueId + appName + exprCount +'": { "qStringExpression":"=' + $(this).data('bnqsexpr') + '"}';
					$(this).addClass(obj.vars.exprUniqueId + appName + exprCount);
					exprCount++;
				} else {
					$(this).addClass(exprChache[$(this).data('bnqsexpr')]);
				}
			});
			app.createGenericObject(JSON.parse('{' + genericStr + '}'), function ( reply ) {
				for (let key in reply) { $('.' + key ).html(reply[key]); } 
			});
			
		},
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });

	$.widget( "bn.bnQSHtmlSelect" , {
        options: {
			app: {},
			uniqueId: '',
			appField: '',
			fieldOrlet: "field",
			variable: '{name: Name, value:Value}',
			labelForField: "",
			countTotalLabel: 'of',
			qHeight:0,				
			qTop: 0,
			qLeft: 0,
			qWidth: 1,
			showLabelRow: false,
			showSelectedInLabel: false,
			emptyValue: '',
			useEmptyForClear: false,
			useEmptyAsLabel: false,
			alwaysOneSelected: false,
			allowSelection: true,
			showSelectedInEmpty: true,
			multiple: false
			
		},
		
        _create: function () {
			
			let vars = this.options;
			let multiple = '';
			vars.uniqueId = bnHelper.uniqueId();
			this.selected = ' selected="selected"';
			let aFieldName = '';
			
			obj = this;
			obj.str = '';
			
			/* if(vars.alwaysOneSelected == true){
				if(vars.fieldOrlet == 'toField' && bnQSession.alwaysOneSelectedFields[vars.appField] == undefined){
					bnQSession.alwaysOneSelectedFields[vars.appField] = true;
					bnQSession.alwaysOneSelectedFieldsValues[vars.appField] = vars.defaultSelection;
					vars.fieldType == 'int'? selectVal = parseInt(vars.defaultSelection) : selectVal = obj.options.defaultSelection;	
					vars.app.field(vars.appField).selectValues([selectVal], true, true); }
			} */
			
			vars.labelForField == '' || vars.labelForField == undefined ? vars.aFieldName = vars.appField: vars.aFieldName = vars.labelForField;
			vars.multiple == true ? multiple = ' multiple="multiple"' : multiple = '';
			//console.log(vars.aFieldName);
			vars.showLabelRow == true ? this.str += '<label class="label-'+vars.uniqueId+'" for="'+ vars.uniqueId +'">'+vars.aFieldName+': </label> ': false;
			obj.str += '<select id="'+vars.uniqueId+'" '+ multiple +' name="'+ vars.uniqueId +'" data-bnqsapp="'+vars.app.id+'"></select>';
			obj.element.html(obj.str);
			
			//console.log(vars.app);
			if(vars.allowSelection == true){ 
				if(vars.fieldOrlet == 'field' || vars.fieldOrlet == 'both'){
					obj.element.children('select').on( 'change', function () {
						bnHelper.makeSelection(vars.app, this, vars.appField  , false ,'option') 
					}); 
				} 
				if(vars.fieldOrlet == 'let'){
					
				}
			}
			
			if($.isArray(vars.app)){
				vars.str = ''; 
				vars.regValues = [];
				let fCounter = '';
				$('#'+ vars.uniqueId).removeClass('statusS statusX statusL');
				for(i=0;i<vars.app.length;i++){
					vars.app[i].app.createList(
					{ "qDef": { "qFieldDefs": [vars.appField] }
					, "qInitialDataFetch": [{ qTop : vars.qTop, qLeft : vars.qLeft, qHeight : vars.qHeight, qWidth : vars.qWidth }]
					}, function(reply) {
						let selectIt = ''; let state =''; let counter = 0; let scounter = 0; let sname=''; let emptyValue='';
						//console.log(reply.qListObject.qDataPages[0].qMatrix);
						$.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
							value[0].qState == 'S' && state != 'S' ? state = 'S' : false;
							value[0].qState == 'L' && state != 'L' ? state = 'L' : false;
							//console.log(counter +': '+ value[0].qState);
							if(value[0].qState == 'S'){ scounter ++; sname = value[0].qText; }
							let str1 = ' data-fieldkey="'+ value[0].qText+'"';
							vars.regValues[value[0].qText] = value[0].qState;
							if(vars.multiple == false ) $('#'+ vars.uniqueId).addClass('status'+ state );
							counter++; 
						});

						if(vars.showSelectedInEmpty == true){ 
							if(scounter > 1) { fCounter = ' (' + scounter + ' '+ vars.countTotalLabel +' ' + counter +')'; } 
							else { sname != '' ? fCounter = ' (' + sname +')': fCounter =''; }
						}
						vars.str = '';
						//console.log(vars.regValues);
						for(let key in vars.regValues){
							if(key != 'remove')
							vars.str += '<option class="status'+ vars.regValues[key] +'" data-fieldkey="'+ key +'" value="'+key+'"'+selectIt+'>' + key + '</option>';
						}
						
						vars.useEmptyAsLabel == true ? emptyValue = vars.aFieldName: emptyValue = vars.emptyValue;
						fCounter != '' && this.emptyValue == vars.emptyValue ? emptyValue = '':false;
						//if(vars.multiple == false ) sState = 'status'+ state ;
						if(vars.showSelectedInLabel == true ) { 
							$('#label-'+vars.uniqueId).html(vars.appField + fCounter); 
						}
						let strEmpty = '<option class="" value="empty">'+ emptyValue + fCounter +'</option>';
						vars.multiple == true ? strEmpty = '':false;
						$('#' + vars.uniqueId).html( vars.str);	
					});
				}
				
			} else {
				vars.app.createList(
				{ "qDef": { "qFieldDefs": [vars.appField] }
				, "qInitialDataFetch": [{ qTop : vars.qTop, qLeft : vars.qLeft, qHeight : vars.qHeight, qWidth : vars.qWidth }]
				}, function(reply) {
					$('#'+ vars.uniqueId).removeClass('statusS statusX');
					vars.str = ''; 
					let selectIt = ''; 
					let state =''; 
					let counter = 0; 
					let scounter = 0;
					let fCounter = 0;					
					let sname=''; 
					let emptyValue='';
					$.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
						value[0].qState == 'S' && state != 'S' ? state = 'S' : false;
						value[0].qState == 'L' && state != 'L' ? state = 'L' : false;
						if(value[0].qState == 'S'){ scounter ++; sname = value[0].qText; }
						vars.str += '<option class="status'+ value[0].qState +'" data-fieldkey="'+ value[0].qText +'" value="'+value[0].qText+'"'+selectIt+'>' + value[0].qText + '</option>';
						//if(vars.multiple == false ) $('#'+ vars.uniqueId).addClass('status'+ state );
						if(vars.multiple == false ) $('#'+ vars.uniqueId).addClass('status'+ state );
						counter++; 
					});
					if(vars.showSelectedInEmpty == true){ 
						if(scounter > 1) { fCounter = ' (' + scounter + ' '+ vars.countTotalLabel +' ' + counter +')'; } 
						else { sname != '' ? fCounter = ' (' + sname +')': fCounter =''; }
					}
					vars.useEmptyAsLabel == true ? emptyValue = vars.aFieldName: emptyValue = vars.emptyValue;
					fCounter != '' && this.emptyValue == vars.emptyValue ? emptyValue = '':false;
					//if(vars.multiple == false ) sState = 'status'+ state ;
					if(vars.showSelectedInLabel == true ) { 
						$('#label-'+vars.uniqueId).html(vars.appField + fCounter); 
					}
					let strEmpty = '<option class="" value="empty">'+ emptyValue + fCounter +'</option>';
					vars.multiple == true ? strEmpty = '':false;
					$('#' + vars.uniqueId).html(strEmpty + vars.str);
				});
			}
			
			//this._trigger( "complete", null );
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });

	$.widget( "bn.bnQSListbox" , {
        options: {
			app: {},
			appField: '',
			fieldOrlet: "field",
			variableName: "letname to store value(s)",
			labelForField: "",
			showFrequencies:false,
			ownExpression: false,
			useExpression: '',
			type: 'menu',
			menuOpenOn: 'click',
			qHeight: 0,			 
			qTop: 0,
			qLeft: 0,
			qWidth: 1,
			showLabelRow: false,
			showSelectedInLabel: false,
			emptyValue: '',
			emptyOptionValue: 'empty',
			alwaysOneSelected: false,
			allowSelection: true,
			roundedCorners: false,
			shadow: false,
			countTotalLabel: 'of',
			showCountInLabel: false,
			showTotalInLabel: false,
			height: '',
			icons: {
				menuDropdown: '<i class="fa fa-caret-down"></i>'
			}
		},
        _create: function () {
			let vars = this.options;
			vars.uniqueId = bnHelper.uniqueId();
			vars.labelForField == '' ? vars.label = vars.appField : vars.label = vars.labelForField;
			vars.strlist = '<ul id="'+vars.uniqueId+'-listbox-elements">';
			vars.strclose = '</ul></div>';
			let labelStr = '';
			if(vars.showCountInLabel == true){
				labelStr = '<span class="" id="'+ vars.uniqueId +'-count"></span> ';
			}
			if(vars.showTotalInLabel == true){
				if(vars.showCountInLabel == true){
					labelStr = '<span class="" id="'+ vars.uniqueId +'-count"></span> '+ vars.countTotalLabel +' <span class="" id="'+ vars.uniqueId +'-total"></span> ';
				}
			}
			
			switch (vars.type){	
				case 'menu': 
					vars.stropen  = '<div class="bn-listbox-menu" id="'+ vars.uniqueId +'-wrapper">';
					if(vars.showLabelRow == true) vars.stropen += '<span class="bn-listbox-menu-header">' + labelStr + vars.label + ' ' + vars.icons.menuDropdown + '</span>';
					this.element.append(vars.stropen + vars.strlist + vars.strclose);
					this.element.find('ul').hide();
					if(vars.shadow == true) this.element.find('ul').addClass('bnShadow');
					if(vars.roundedCorners == true) this.element.find('ul').addClass('bnCorners');
					$('#'+ vars.uniqueId +'-wrapper').on(vars.menuOpenOn,function(){ $('#'+vars.uniqueId+'-listbox-elements').show(); });	
					$('#'+vars.uniqueId+'-listbox-elements').on('mouseover',function(){ $('#'+vars.uniqueId+'-listbox-elements').show(); });	
					$('#'+ vars.uniqueId +'-wrapper ,#'+vars.uniqueId+'-listbox-elements').on('mouseleave',function(){ $('#'+vars.uniqueId+'-listbox-elements').hide(); });
				break;
				case 'horizontal':
					vars.stropen = '<div class="bn-listbox-horizontal" id="'+ vars.uniqueId +'-wrapper">';
					if(vars.showLabelRow == true) vars.stropen += '<div class="bn-listbox-horizontal-header">'+ labelStr + vars.label + ' </div>' ;
					this.element.append(vars.stropen + vars.strlist + vars.strclose);
					if(vars.shadow == true) this.element.find('div.bn-listbox-horizontal').addClass('bnShadow');
					if(vars.roundedCorners == true) {
						this.element.find('div.bn-listbox-horizontal').addClass('bnCorners');
						this.element.find('div.bn-listbox-horizontal-header').addClass('bnCornersTop');
						this.element.find('ul').addClass('bnCornersBottom');
					}
				break;
				case 'vertical':
					vars.stropen = '<div class="bn-listbox-vertical" id="'+ vars.uniqueId +'-wrapper">';
					if(vars.showLabelRow == true) vars.stropen += '<div class="bn-listbox-vertical-header">'+ labelStr + vars.label + ' </div>' ;
					this.element.append(vars.stropen + vars.strlist + vars.strclose);
					if(vars.shadow == true) this.element.find('div.bn-listbox-vertical').addClass('bnShadow');
					if(vars.height != '') {
						this.element.find('div.bn-listbox-vertical').css('height',vars.height);
					}
					if(vars.showLabelRow == true) 
						this.element.find('ul').css("height",bnHelper.percHeight(
							this.element.find('div.bn-listbox-vertical').height(),
							this.element.find('div.bn-listbox-vertical-header').outerHeight()) + "%");	
					else 
						this.element.find('ul').css("height","100%");
					
					if(vars.roundedCorners == true) {
						if(vars.showLabelRow == true){
							this.element.find('ul').addClass('bnCornersBottom');
							this.element.find('div.bn-listbox-vertical').addClass('bnCorners');
							this.element.find('div.bn-listbox-vertical-header').addClass('bnCornersTop');
						} else {
							this.element.find('ul,div.bn-listbox-vertical').addClass('bnCorners');
						}
					}
					
				break;
			}

			if($.isArray(vars.app)){
				vars.str = ''; 
				vars.regValues = [];
				$('#'+ vars.uniqueId).removeClass('statusS statusX');
				for(i=0;i<vars.app.length;i++){
					vars.app[i].app.createList(
					{ "qDef": { "qFieldDefs": [vars.appField] }
					, "qInitialDataFetch": [{ qTop : vars.qTop, qLeft : vars.qLeft, qHeight : vars.qHeight, qWidth : vars.qWidth }]
					}, function(reply) {
						// Problem Frequencies und eigene Espressions ...
						// entweder Dubletten anzeigen oder Expressions für doppelte Werte anzeigen 
						// ggf. noch mal drüber nachdenken ...
						
					});
				}
			} 
			else {
				vars.app.createList(
				{ "qDef": { "qFieldDefs": [vars.appField] }
				, "qInitialDataFetch": [{ qTop : vars.qTop, qLeft : vars.qLeft, qHeight : vars.qHeight, qWidth : vars.qWidth }]
				}, function(reply) {
					let genericStr = '', selectIt = '', state ='', scounter = 0, counter = 0, sname='', emptyValue='', frequencies='';
					$('#'+ vars.uniqueId).removeClass('statusS statusX');
					vars.str = '';  
					$.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
						counter > 0 ? genericStr +=',' :false;
						let ownexpressions = '';
						let frequencies = '';
						if(vars.showFrequencies == true){
							let expression = JSON.stringify('=count( {$ <['+vars.appField+']={'+'\"'+ value[0].qText + '\"' + '}>' + '} ['+ vars.appField+'])');
							genericStr +=  '"'+vars.uniqueId+'-frequency'+ counter  +'": ' +'{ "qStringExpression":' + expression + '}';
							frequencies = '&nbsp;<span class="bnListbox-freq" id="'+vars.uniqueId+'-frequency'+ counter  +'"></span>';
						}
						if(vars.ownExpression == true){
							vars.showFrequencies == true > 0 ? genericStr +=',' :false;
							let expression = JSON.stringify(vars.useExpression.replace('+/bnp+/','['+ vars.appField+']={'+'\"'+ value[0].qText + '\"' + '}'));
							genericStr +=  '"'+vars.uniqueId+'-expression'+ counter  +'": ' + '{ "qStringExpression":' + expression + '}';
							ownexpressions = '&nbsp;<span class="bnListbox-expr" id="'+vars.uniqueId+'-expression'+ counter  +'"></span>';
						}
						vars.str += '<li class="status'+ value[0].qState +'" data-value="'+value[0].qText+'"><span class="bn-listbox-label">' + value[0].qText + '</span> '+ frequencies+' '+ ownexpressions +'</li>';
						counter++; 
					});
					
					$('#' + vars.uniqueId + '-listbox-elements').html(vars.str);
					
					if(vars.showFrequencies == true || vars.ownExpression == true || vars.showCountInLabel == true || vars.showTotalInLabel == true){
						
						if(vars.showCountInLabel == true){
							if(vars.showFrequencies == true || vars.ownExpression == true) 
								genericStr += ','; 
							let expression = JSON.stringify('=count(['+ vars.appField+'])');
							genericStr +=  '"'+vars.uniqueId+'-count": { "qStringExpression":' + expression + '}';
						}
						if(vars.showTotalInLabel == true){
							if(vars.showFrequencies == true || vars.ownExpression == true || vars.showCountInLabel == true) 
								genericStr += ','; 
							let expression = JSON.stringify('=count( {1} ['+ vars.appField+'])');
							genericStr +=  '"'+vars.uniqueId+'-total": { "qStringExpression":' + expression + '}';
						}
						vars.app.createGenericObject(JSON.parse('{' + genericStr + '}'), function ( reply ) {
							for (let key in reply) { 
								if (!reply.hasOwnProperty(key)) 
									continue; 
									$('#' + key ).html(reply[key]); 
							} 
						});
					}
					
					if(vars.fieldOrlet == 'field' || vars.fieldOrlet == 'both'){
						$('#' + vars.uniqueId + '-listbox-elements li').on( 'click', function () {
							console.log(vars.appField);
							bnHelper.makeSelection(vars.app, this, vars.appField ) 
						}); 
					} 
					if(vars.fieldOrlet == 'let'){
						//bnHelper.setvariables(vars.app, vars.variables);
					}
				});
			}
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });	
	
	$.widget( "bn.bnQSSlider" , {
        options: {
			app: {},
			appField: '',
			fieldOrlet: "field",
			label: '',
			type: 'range',
			variables: "[{name: Name, value:Value},name1: Name1, value1:Value1}]",
			useMinFromField: false,
			useMaxFromField: false,
			showValues: true,
			showLabel: true,
			condition: '',
			resetByZero: false,
			min: 0,
			max: 100,
			step: 1,
			value:0,
			startValues:{
				min: 1,
				max: 10
			}
			
		},
		
        _create: function () {
			
			let vars = this.options;
			vars.uniqueId =  bnHelper.uniqueId();
			
			let readOnly = 'readonly="readonly"';
			let str = '';
			// Store Session vars for Clear All
			 bnQSession.sliders.push( { 
						uniqueId: vars.uniqueId, 
						initialMin: vars.startValues.min,  
						initialMax: vars.startValues.max,
						type: vars.type,
						initialSet: false
					}); 
			
			vars.sliderKey = bnQSession.sliders.length - 1;

			if(vars.label == '') vars.label = vars.appField;
			
			str = '<div class="bnQSSliderValue" style="padding:5px;">';
				if(vars.showLabel == true) { str += '<label for="' + vars.uniqueId + '-value">'+ vars.label +'</label> '; }	
				if(vars.showValues == true){ str += '<input id="' + vars.uniqueId + '-value" style:"border=0" />'; }
			str += '</div>';
			
			if(vars.showLabel == true || vars.showValues) { this.element.append(str); }
			
			this.element.append('<div id="' + vars.uniqueId + '-slider" class="bnQSSlider"></div>');
			
			//vars.startValues.max != 20 ? vars.max = vars.startValues.max : false;
			//console.log( vars.uniqueId);
			if(vars.type == 'range'){ 
				//console.log(vars.max);
				$('#' + vars.uniqueId + '-slider' ).slider( {
					range: true, 
					min: vars.min, 
					max: vars.max, 
					step: vars.step,
					values: [ vars.startValues.min, vars.startValues.max ],
					slide: function( event, ui ) {
						
						$('#' + vars.uniqueId + '-value' ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
						
						if(vars.fieldOrlet == 'field' && vars.appField != ''){
							vars.app.field(vars.appField).selectMatch(">" + ui.values[ 0 ] + "<" + ui.values[ 1 ]);
						} else if (vars.fieldOrlet == 'let' && $.isArray(vars.variables)) {
							vars.variables[0].value = ui.values[ 0 ];
							vars.variables[1].value = ui.values[ 1 ];
							bnHelper.setvariables(vars.app, vars.variables);
						}
						
					}
					
				});
				$( '#' + vars.uniqueId + '-value' ).val( "" + $( '#' + vars.uniqueId + '-slider' ).slider( "values", 0 ) + " - " + $( '#' + vars.uniqueId + '-slider' ).slider( "values", 1 ) );
				let newMin = 0;
				let newMax = 0;
				if((vars.useMinFromField == true || vars.useMaxFromField == true) && vars.appField != ''){
					vars.app.createGenericObject( {
					"min": {qStringExpression: "min({1}"+ vars.appField +")"},"max": {qStringExpression: "max({1}"+ vars.appField +")"}
					}, function ( reply ) {
					
						if(vars.useMinFromField == true){ 
							newMin = Math.floor(reply.min);
							$('#' + vars.uniqueId + '-slider').slider( "option", "min", newMin );
							bnQSession.sliders[vars.sliderKey].initialMax = newMin;
							if(bnQSession.sliders[vars.sliderKey].initialSet == false){
								$('#' + vars.uniqueId + '-slider').slider("values", 0, newMin);	
							}
												
						}
						if(vars.useMaxFromField == true){ 
							newMax = Math.ceil(reply.max);
							$('#' + vars.uniqueId + '-slider').slider( "option", "max", newMax ); 
							bnQSession.sliders[vars.sliderKey].initialMax = newMax;
							if(bnQSession.sliders[vars.sliderKey].initialSet == false){
								$('#' + vars.uniqueId + '-slider').slider( "values", 1, newMax);
							}
					
						}
						bnQSession.sliders[vars.sliderKey].initialSet = true;
						$('#' + vars.uniqueId + '-value').val(newMin+'-'+newMax);
					});
					
				}
				
			} else {
				$( '#' + vars.uniqueId + '-slider' ).slider({
				  value: vars.value,
				  min: vars.min,
				  max: vars.max,
				  step: vars.step,
				  slide: function( event, ui ) {
					$( '#' + vars.uniqueId + '-value' ).val( "" + ui.value );
					//console.log( ui.value);
					if(ui.value == 0 && vars.resetByZero == true) vars.app.field(vars.appField).clear();
					if(vars.fieldOrlet == 'field' && vars.appField != ''){
						vars.app.field(vars.appField).selectMatch(vars.condition + ui.value);
					} else if (vars.fieldOrlet == 'let' && $.isArray(variables)) {
						vars.variables[0].value = ui.values[ 0 ];
						bnHelper.setvariables(vars.app, vars.variables);
					}
					
				  }
				});
				$( '#' + vars.uniqueId + '-value' ).val( "" + $(  '#' + vars.uniqueId + '-slider' ).slider( "value" ) );
			}
			
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });	
	
	$.widget( "bn.bnQSetAnalysisGenerator" , {
        options: {
			functions: [
				{ label: 'sum', value: 'sum(', distinct: true},
				{ label: 'count', value: 'count(', distinct: true },
				{ label: 'min', value: 'min(', distinct: true },
				{ label: 'max', value: 'max(', distinct: true },
				{ label: 'avg', value: 'avg(', distinct: false }
			],
			adHocFunc: [
				{ label: 'sum', value: 'sum(', distinct: true},
				{ label: 'count', value: 'count(', distinct: true },
				{ label: 'min', value: 'min(', distinct: true },
				{ label: 'max', value: 'max(', distinct: true },
				{ label: 'avg', value: 'avg(', distinct: false }
			],
			modifier: [
				{ label: '(1) no selection allowed', value: '1' },
				{ label: '($) selections allowed', value: '$' },
				{ label: '($1) 1 step back', value: '$1' },
				{ label: '($1) 2 step back', value: '$2' },
				{ label: '($1) 3 step back', value: '$3' },
				{ label: '($1) 4 step back', value: '$4' },
				{ label: '($1) 5 step back', value: '$5' } ,
				{ label: '($_1) 1 step foreward', value: '$_1' },
				{ label: '($_2) 2 step foreward', value: '$_2' },
				{ label: '($_3) 3 step foreward', value: '$_3' },
				{ label: '($_4) 4 step foreward', value: '$_4' },
				{ label: '($_5) 5 step foreward', value: '$_5' },
			],
			variants: [
				{ label: 'exclude', value: '1' },
				{ label: 'use $::Field', value: '2' },
				{ label: 'define Values', value: '3' } ],
			labels:{
				part1: "Function and Modifier",
				part2: "add Filter",
				part3: "Result",
				modifier: "Modifier",
				genAdhoc: "Generate Adhoc let",
				addFilter: "add",
				testResult: "Test Result",
				genAdhoc: "generate Adhoc let",
				filterField: "FilterField:",
			},
			tooltips:{
				add: "",
				genAdhoc: "",
				testResult: "",
				trash: "",
			},
			icons:{
				trash: '<i class="fa fa-trash"></i>',
				addFilter: '<i class="fa fa-plus"></i>',
				genAdhoc: '<i class="fa fa-terminal"></i>',
				copyToClipBoard: '<i class="fa fa-clipboard"></i>',
				testResult: '<i class="fa fa-file-code-o"></i>',
			},
			ids:{
				saFunction: "saFunction",
				saModifier: "saModifier",
				saField1: "saField",
				saField2: "saField2",
				saField3: "saField3",
				filterType: "saFilterType",
				filterValues: "saFilterValues",
				saString: "saString",
				genAdhoc: "generateAdhoc",
				addFilter: "addSAFilter",
				clearFilter: "saClearFilter",
				part1: "saPart1",
				part2: "saPart2",
				part3: "saPart3",
				saFilterReset: "",
				copyToClipBoard: "saCopyToClipboard",
				testSaStr: "testSaStr",
				useDistinct: "saUseDistinct",
			}
		},
        _create: function () {
						
			function generateFilterStr(filterStr, inputName, saField, saValues){
				switch ( $("input[type='radio'][name='"+inputName+"']:checked").val() ) {
					case '1': filterStr == '' ? filterStr = $(saField).val() + '=': filterStr += ',' + $(saField).val() + '='; break;
					case '2': filterStr == '' ? filterStr = $(saField).val() + '=$::' + $(saField).val(): filterStr += ',' + $(saField).val() + '=$::' + $(saField).val(); break;
					case '3': let checkValues = $(saValues).val().split(';');
						if( checkValues.length > 0 ){ for (i = 0; i < checkValues.length; i++) { i == 0 ? saFilterValues = "'" + checkValues[i] + "'" : saFilterValues += ",'" + checkValues[i] + "'"; }
						} else if($(saValues).val() != ''){ saFilterValues = "'" + $(saValues).val() + "'"; }
						filterStr == '' ? filterStr = $(saField).val() + '={' + saFilterValues + '}': filterStr += ',' + $(saField).val() + '={' + saFilterValues + '}';
					break; 
				} 
				if(filterStr != '=' ) return filterStr;
				else return '';
			}
			
			str = '<fieldset id="' + saGenerator.ids.part1 +'" class="' + bnConf.classes.pad1 +'"><legend> ' + saGenerator.labels.part1 +' </legend><div class="' + bnConf.classes.pad2 +'">'
			+ selectFromArray(saGenerator.ids.saFunction, saGenerator.functions, 'sum(') + ' <input type="checkbox" name="'+ saGenerator.ids.useDistinct +'" id="'
			+ saGenerator.ids.useDistinct +'" /> distinct' + ' <select name="'+ saGenerator.ids.saField1 +'" id="'+ saGenerator.ids.saField1 +'"></select></div>'
			+ '<div class="'+ bnConf.classes.pad1 +'">' +  saGenerator.labels.modifier + selectFromArray(saGenerator.ids.saModifier, saGenerator.modifier, 1) + '</fieldset>'
			+ '<fieldset id="'+ saGenerator.ids.part2 +'" class="'+ bnConf.classes.pad1 +' '+bnConf.classes.hide+'"><legend> '+ saGenerator.labels.part2 +' </legend>'
			+ '<div id="'+ saGenerator.ids.addFilter +'" class="bnMBButton aRight"> '+ saGenerator.icons.addFilter +' ' + saGenerator.labels.addFilter + '</div>'
			+ '<div class="'+ bnConf.classes.pad2 +'"> '+saGenerator.labels.filterField +' <select name="'+ saGenerator.ids.saField2 +'" id="'+ bnConf.saGenerator.ids.saField2 +'"></select></div>'
			+ '<div class="'+ bnConf.classes.pad2 +'">' + radioFromArray(saGenerator.ids.filterType, saGenerator.ids.filterType, saGenerator.variants, 1) + '</div>'
			+ '<div id="'+ saGenerator.ids.part3 +'" class="'+bnConf.classes.hide+'">'+ '<div class="aLeft w50"><div id="'+ saGenerator.ids.genAdhoc +'" class="bnMBButton"> '
			+ saGenerator.icons.genAdhoc +' '+ saGenerator.labels.genAdhoc +' </div><br />'+ '<textarea type="text" id="'+ saGenerator.ids.filterValues 
			+'" class="aLeft" style="margin-left:0.5vh;width:100%;resize: none; padding:0.5vh;height:7vh"> </textarea></div>'
			+ '<div class="aLeft w50 '+ bnConf.classes.pad1 +'" style="margin-left:0.5vh;width:49%"><select style="margin-left:0.5vh;width:100%" id="'+ saGenerator.ids.saField3 +'" multiple="multiple" class="saSelect"></select></div></div></fieldset>'
			+ '<fieldset class="'+ bnConf.classes.pad1 +'"><legend> '+ saGenerator.labels.part3 +' </legend>'+ '<div id="'+ saGenerator.ids.saFilterReset +'" class="bnMBButton aRight tooltip" title="reset"> '+saGenerator.icons.trash+' </div> '
			+ '<div id="'+ saGenerator.ids.copyToClipBoard +'" class="bnMBButton aRight tooltip" title="Copy to Clipboard"> '+ saGenerator.icons.copyToClipBoard +'</div>'+ '<div id="'
			+ saGenerator.ids.testSaStr +'" class="bnMBButton aRight tooltip" title="Test Result"> '+saGenerator.icons.testResult +' '+saGenerator.labels.testResult+'</div>' 
			+ '<textarea id="'+ saGenerator.ids.saString +'" style="margin-left:0.5vh;width:55%;resize: none;height:10vh; padding:0.5vh"></textarea>'
			+ '</fieldset><br  /><br />';
			
			
			$(saGenerator.appendTo).html(str);
			bnFieldToOption(app,{appendTo: saGenerator.ids.saField1 , appField: "$Field", qHeight: 1000, addEmpty: true, emptyValue: '------------------'});
			bnFieldToOption(app,{appendTo: saGenerator.ids.saField2 , appField: "$Field", qHeight: 1000, addEmpty: true, emptyValue: '------------------'});
			$('#'+ saGenerator.ids.saFilterReset ).on('click',function(){	filter = ''; $('#'+saGenerator.ids.saString + ', #'+ saGenerator.ids.filterValues).html(''); });
			$('#'+ saGenerator.ids.copyToClipBoard).on('click',function(){ $('#'+saGenerator.ids.saString).html() != '' ? copyInputToClipboard(saGenerator.ids.saString) : openSAError('Nothing to copy');  });
			$('#'+ saGenerator.ids.saField1).on('change',function(){ $('#'+ saGenerator.ids.saField1 ).val() != "" ? $('#'+saGenerator.ids.part2).show() : $('#'+saGenerator.ids.part2).hide(); });
			$('#'+ saGenerator.ids.saField2).on('change',function(){ bnFieldToOption(app,{appendTo: saGenerator.ids.saField3 , appField: $('#'+ saGenerator.ids.saField2 ).val(), qHeight: 1000, addEmpty: false}); $("#"+saGenerator.ids.saField2).val() != '' && $("input[type='radio'][name='"+ saGenerator.ids.filterType +"']:checked").val() == 3 ? $('#'+saGenerator.ids.part3).show() : $('#'+saGenerator.ids.part3).hide();});
			$('#'+ saGenerator.ids.saField3 ).change(function(){  $('#'+ saGenerator.ids.filterValues).val($('#'+saGenerator.ids.saField3).val().join( ";" )) });
			$("input[type='radio'][name='"+saGenerator.ids.filterType+"']").on('change',function(){ $("input[type='radio'][name='"+saGenerator.ids.filterType+"']:checked").val() == 3 && $('#'+saGenerator.ids.saField2).val() != "" ? $('#'+saGenerator.ids.part3).show() : $('#'+saGenerator.ids.part3).hide();  });	
			
			let filter = '';
			$('#'+ saGenerator.ids.addFilter).on('click',function(){
				filter += generateFilterStr(filter, saGenerator.ids.filterType, '#'+ saGenerator.ids.saField2, '#'+saGenerator.ids.filterValues);
				filter == ''  ? saFilter = '' : saFilter = '<' + filter + '>';
				$('#'+ saGenerator.ids.useDistinct).attr('checked', true) ? distinctVal = 'distinct ': distinctVal = '';
				saStr = $("#"+ saGenerator.ids.saFunction).val() + distinctVal + '{' + $("#"+ saGenerator.ids.saModifier).val() + saFilter + '} ' +  $("#"+ saGenerator.ids.saField1).val() + ')';
				$('#'+ saGenerator.ids.saString).html(saStr);
			});
		
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });	
	
	$.widget( "bn.bnColorPicker" , {
        options: {
			uniqueId: '',
			copyIcon: '<i class="fa fa-clipboard"></i>',
			useColorToSet: true,
			useColorFor: 'background-color',
			useColorForElelemts: [
				{label: '--------------', value:''},
				{label: 'Box Header', value:'.bnGridContainer > div > h1'},
				{label: 'Selected Color', value:'.statusS'}
			]
			
		},
        _create: function () {
			let vars= {};
			let obj = this;
			//let ;
			vars.uniqueId = bnHelper.uniqueId();
			let cp = '';
			if(obj.options.useColorToSet == true){
				if($.isArray(obj.options.useColorForElelemts)){
					cp += bnHelper.selectFromArray(vars.uniqueId+'-useFor', obj.options.useColorForElelemts, 0)
				}
			}
			
			
			/*
			cp += '<div id="'+ vars.uniqueId +'-colorPicker" class="pad1"><table><tr>'
			+ '<td colspan="4" class="pad2"><div id="'+ vars.uniqueId +'-swatch" class="swatch ui-widget-content ui-corner-all"></div> </td>'
			+ '<td class="pad2"> <div class="pad1">Output: <select id="'+ vars.uniqueId +'-colorFunc"> <option value="rgb" selected="selected">rgb()</option> <option value="rgba">rgba()</option> <option value="hsl">hsl()</option> </select></div>'
			+ '<div class="pad1"><input size="15" value="" id="'+ vars.uniqueId +'-colorFunction" /><span id="'+ vars.uniqueId +'-CopyColorFunctoClipBoard"> '+this.options.copyIcon+'</span></div></td></tr><tr>'
			+ '<td class="pad2">R</td><td class="pad2"><input class="rgbVal" id="'+ vars.uniqueId +'-rValue" size="3" maxlength="3" name="'+ vars.uniqueId +'-rValue" value="" /></td>'
			+ '<td class="pad2">H</td><td class="pad2"><input class="hslVal" id="'+ vars.uniqueId +'-hValue" size="3" maxlength="3" name="'+ vars.uniqueId +'-hValue" value="" /></td>'
			+ '<td class="colorSlider"><div class="red" id="'+ vars.uniqueId +'-r-slider"></div></td></tr><tr>'
			+ '<td class="pad2">G</td><td class="pad2"><input size="3" class="rgbVal" id="'+ vars.uniqueId +'-gValue" maxlength="3" name="'+ vars.uniqueId +'-gValue" value="" /></td>'
			+ '<td class="pad2">S</td><td class="pad2"><input size="3" class="hslVal" id="'+ vars.uniqueId +'-sValue" name="'+ vars.uniqueId +'-sValue" maxlength="3" value="" /></td>'
			+ '<td class="colorSlider"><div class="green"  id="'+ vars.uniqueId +'-g-slider"></div></td></tr><tr>'
			+ '<td class="pad2">B</td><td class="pad2"><input size="3" class="rgbVal" id="'+ vars.uniqueId +'-bValue" maxlength="3" name="'+ vars.uniqueId +'-bValue" value="" /></td>'
			+ '<td class="pad2">L</td><td class="pad2"><input size="3" class="hslVal" id="'+ vars.uniqueId +'-lValue" maxlength="3" name="'+ vars.uniqueId +'-lValue" value="" /></td>'
			+ '<td class="colorSlider"><div class="blue" id="'+ vars.uniqueId +'-b-slider"></div></td></tr><tr>'
			+ '<td class="tRight pad2" colspan="3">Alpha</td><td class="pad2"><input size="5" class="rgbVal" id="'+ vars.uniqueId +'-aValue" maxlength="4" name="'+ vars.uniqueId +'-aValue" value="" /></td>'
			+ '<td class="colorSlider"><div id="'+ vars.uniqueId +'-a-slider"></div></td></tr><tr>'
			+ '<td class="tRight pad2" colspan="3">Hex</td><td colspan="2" class="pad2"><input size="9" class="hexVal" id="'+ vars.uniqueId +'-hexValue" maxlength="7" name="'+ vars.uniqueId +'-hexValue" value="" /></td>'
			+ '</tr></table></div>';
			this.element.append(cp);
			*/
			
			
			this.element.append($('<div>', {
			    id: vars.uniqueId +'-cp-wrapper',
			    class: 'pad1'
			}));
			
			$('#'+ vars.uniqueId +'-cp-wrapper').append(
				$('<select>', {
			    id: vars.uniqueId +'-colorFunc',
				html: '<option value="rgb" selected="selected">rgb()</option> <option value="rgba">rgba()</option> <option value="hsl">hsl()</option>'
			}));
			
			$('#'+ vars.uniqueId +'-cp-wrapper').append( $('<div>', { id: vars.uniqueId +'-colorPicker' }));
			
			$('#'+ vars.uniqueId +'-colorPicker').append(
				$('<div>', {
					id: vars.uniqueId +'-swatch',
					class: 'swatch ui-widget-content ui-corner-all',
					html: 'A'
				})
			);
			$('#'+ vars.uniqueId +'-colorPicker').append(
				$('<input>', {
					id: vars.uniqueId +'-colorFunction', name: vars.uniqueId +'-colorFunction', maxlength: 20,
					class: 'colorPicker-Value15'
			}));
			$('#'+ vars.uniqueId +'-colorPicker').append(
				$('<span>', {
					id: vars.uniqueId +'-CopyColorFunctoClipBoard', html: this.options.copyIcon
			}));
			
			
			$('#'+ vars.uniqueId +'-colorPicker').append( $('<div>', { id: vars.uniqueId +'-colorPicker-r' }));
			$('#'+ vars.uniqueId +'-colorPicker-r').append(
				$('<label>', {
					id: vars.uniqueId +'-r-label', for: vars.uniqueId +'-r-value',
					class: 'colorPicker-label', html: 'R'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-r').append(
				$('<input>', {
					id: vars.uniqueId +'-r-value', name: vars.uniqueId +'-r-value', maxlength: 3,
					class: 'colorPicker-Value3'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-r').append( $('<div>', { id: vars.uniqueId +'-r-slider', class: 'red' }));
			
			$('#'+ vars.uniqueId +'-colorPicker').append( $('<div>', { id: vars.uniqueId +'-colorPicker-g' }));
			$('#'+ vars.uniqueId +'-colorPicker-g').append(
				$('<label>', {
					id: vars.uniqueId +'-g-label', for: vars.uniqueId +'-g-value', class: 'colorPicker-label',
					html: 'G'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-g').append(
				$('<input>', {
					id: vars.uniqueId +'-g-value', name: vars.uniqueId +'-g-value', maxlength: 3, class: 'colorPicker-Value3'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-g').append( $('<div>', { id: vars.uniqueId +'-g-slider', class: 'green' }));
			
			$('#'+ vars.uniqueId +'-colorPicker').append( $('<div>', { id: vars.uniqueId +'-colorPicker-b' }));
			$('#'+ vars.uniqueId +'-colorPicker-b').append(
				$('<label>', {
					id: vars.uniqueId +'-b-label', for: vars.uniqueId +'-b-value', class: 'colorPicker-label', html: 'B'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-b').append(
				$('<input>', {
					id: vars.uniqueId +'-b-value', name: vars.uniqueId +'-b-value', maxlength: 3, class: 'colorPicker-Value3'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-b').append( $('<div>', { id: vars.uniqueId +'-b-slider', class: 'blue' }));

			$('#'+ vars.uniqueId +'-colorPicker').append( $('<div>', { id: vars.uniqueId +'-colorPicker-a' }));
			$('#'+ vars.uniqueId +'-colorPicker-a').append(
				$('<label>', {
					id: vars.uniqueId +'-a-label', for: vars.uniqueId +'-a-value', class: 'colorPicker-label', html: 'A'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-a').append(
				$('<input>', {
					id: vars.uniqueId +'-a-value', name: vars.uniqueId +'-a-value', maxlength: 3, class: 'colorPicker-Value3'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-a').append( $('<div>', { id: vars.uniqueId +'-a-slider', class: 'alpha' }));
			
			
			$('#'+ vars.uniqueId +'-colorPicker').append( $('<div>', { id: vars.uniqueId +'-colorPicker-group2' }));
			$('#'+ vars.uniqueId +'-colorPicker-group2').append(
				$('<label>', {
					id: vars.uniqueId +'-h-label',
					for: vars.uniqueId +'-h-value',
					class: 'colorPicker-label',
					html: 'H'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-group2').append(
				$('<input>', {
					id: vars.uniqueId +'-h-value',
					name: vars.uniqueId +'-h-value',
					maxlength: 3,
					class: 'colorPicker-Value3'
			}));
			
			$('#'+ vars.uniqueId +'-colorPicker-group2').append(
				$('<label>', {
					id: vars.uniqueId +'-s-label',
					for: vars.uniqueId +'-s-value',
					class: 'colorPicker-label',
					html: 'S'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-group2').append(
				$('<input>', {
					id: vars.uniqueId +'-s-value',
					name: vars.uniqueId +'-s-value',
					maxlength: 3,
					class: 'colorPicker-Value3'
			}));
			
			$('#'+ vars.uniqueId +'-colorPicker-group2').append(
				$('<label>', {
					id: vars.uniqueId +'-l-label',
					for: vars.uniqueId +'-l-value',
					class: 'colorPicker-label',
					html: 'L'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-group2').append(
				$('<input>', {
					id: vars.uniqueId +'-l-value',
					name: vars.uniqueId +'-l-value',
					maxlength: 3,
					class: 'colorPicker-Value3'
			}));
			
			$('#'+ vars.uniqueId +'-colorPicker').append( $('<div>', { id: vars.uniqueId +'-colorPicker-group3' }));
			$('#'+ vars.uniqueId +'-colorPicker-group3').append(
				$('<label>', {
					id: vars.uniqueId +'-hex-label',
					for: vars.uniqueId +'-hex-value',
					class: 'colorPicker-label',
					html: 'Hex'
			}));
			$('#'+ vars.uniqueId +'-colorPicker-group3').append(
				$('<input>', {
					id: vars.uniqueId +'-hex-value',
					name: vars.uniqueId +'-hex-value',
					maxlength: 7,
					class: 'colorPicker-Value7'
			}));
			
			$( '#'+ vars.uniqueId +'-r-slider, #'+ vars.uniqueId +'-g-slider, #'+ vars.uniqueId +'-b-slider, #'+ vars.uniqueId +'-a-slider' ).slider({ 
				orientation: "horizontal", 
				range: "min", 
				max: 255,
				value: 127, 
				slide: function(){obj.refreshSwatch(vars,obj)}, 
				change: function(){obj.refreshSwatch(vars,obj)} 
			});
			$( '#'+ vars.uniqueId +'-a-slider' ).slider({ 
				orientation: "horizontal", 
				range: "min", 
				max: 1.01, 
				step: 0.01, 
				value:0.5,  
				slide: function(){obj.refreshSwatch(vars,obj)}, 
				change: function(){obj.refreshSwatch(vars,obj)} 
			});
			$('#'+ vars.uniqueId +'-colorPicker .rgbVal').on('change',function(){ 
				vars.red = $( '#'+ vars.uniqueId +'-r-value' ).val(),
			    vars.green = $( '#'+ vars.uniqueId +'-g-value' ).val(), 
			    vars.blue = $( '#'+ vars.uniqueId +'-b-value' ).val(), 
			    vars.alpha = $( '#'+ vars.uniqueId +'-b-value' ).val(); 
				updateSlider(red,green,blue,alpha); 
			});
			$('#'+ vars.uniqueId +'-colorFunc').on('change',function(){ refreshSwatch(); });
			$('#'+ vars.uniqueId +'-CopyColorFunctoClipBoard').on('click',function(){ 
				$('#'+ vars.uniqueId +'-colorFunction').val() != '' ? bnHelper.copyInputToClipboard(vars.uniqueId +'-colorFunction') : false;  
			});
			$('#'+ vars.uniqueId +'-colorPicker .hexVal').on('change',function(){ 
				vars.hex = bnHelper.hex2rgb($( '#'+ vars.uniqueId +'-hex-value' ).val()),
				vars.red = vars.hex[0], 
				vars.green = vars.hex[1], 
				vars.blue = vars.hex[2]; 
				updateSlider(vars.red,vars.green,vars.blue,""); 
				});
			$('#'+ vars.uniqueId +'-colorPicker .hslVal').on('change',function(){ 
				vars.hsl = hsl2rgb($( '#'+ vars.uniqueId +'-h-value' ).val(), $( '#'+ vars.uniqueId +'-s-value' ).val(), $( '#'+ vars.uniqueId +'-l-value' ).val()), 
				vars.red = vars.hsl[0], 
				vars.green = vars.hsl[1],
				vars.blue = vars.hsl[2]; 
				updateSlider(vars.red,vars.green,vars.blue,""); 
			});
			$( '#'+ vars.uniqueId +'-r-slider' ).slider( "value", 255 ); 
			$( '#'+ vars.uniqueId +'-g-slider' ).slider( "value", 140 ); 
			$( '#'+ vars.uniqueId +'-b-slider' ).slider( "value", 60 );
			$( '#'+ vars.uniqueId +'-a-slider' ).slider( "value", 1 );	
			
			vars.red = $( '#'+ vars.uniqueId +'-r-value' ).val();
			vars.green= $( '#'+ vars.uniqueId +'-g-value' ).val(); 
			vars.blue= $( '#'+ vars.uniqueId +'-b-value' ).val();
			vars.alpha= $( '#'+ vars.uniqueId +'-b-value' ).val();
			vars.hex= bnHelper.hex2rgb($( '#'+ vars.uniqueId +'-hex-value' ).val());
			vars.hsl= bnHelper.hsl2rgb($( '#'+ vars.uniqueId +'-h-value' ).val(), $( '#'+ vars.uniqueId +'-s-value' ).val(), $( '#'+ vars.uniqueId +'-l-value' ).val());
			
			
        },
		updateSlider: function (red,green,blue,alpha){ 
			vars.red != '' ? $( '#'+ vars.options.uniqueId +'-r-slider' ).slider( "value", red ): false;  
			vars.green != '' ? $( '#'+ vars.options.uniqueId +'-g-slider' ).slider( "value", green ): false;  
			vars.blue != '' ? $( '#'+ vars.options.uniqueId +'-b-slider' ).slider( "value", blue ): false; 
			vars.alpha != '' ? $( '#'+ vars.options.uniqueId +'-a-slider' ).slider( "value", alpha ): false; 
		},
		refreshSwatch: function(vars,obj) {
			vars.red = $( '#'+ vars.uniqueId +'-r-slider' ).slider( "value" );
			vars.green = $( '#'+ vars.uniqueId +'-g-slider' ).slider( "value" ); 
			vars.blue = $( '#'+ vars.uniqueId +'-b-slider' ).slider( "value" ); 
			vars.alpha = $( '#'+ vars.uniqueId +'-a-slider' ).slider( "value" ); 
			vars.hex = bnHelper.rgb2hex( vars.red, vars.green, vars.blue ), 
			vars.hsl = bnHelper.rgb2hsl(vars.red, vars.green, vars.blue);
			$( '#'+ vars.uniqueId +'-swatch, #'+ vars.uniqueId +'-a-slider .ui-slider-range, #'
				+ vars.uniqueId +'-a-slider .ui-slider-handle' ).css( "background-color", "rgba(" 
				+ vars.red + "," + vars.green + "," + vars.blue +"," + vars.alpha +")" );
			$( '#'+ vars.uniqueId +'-r-value' ).val(vars.red); 
			$( '#'+ vars.uniqueId +'-g-value' ).val(vars.green); 
			$( '#'+ vars.uniqueId +'-b-value' ).val(vars.blue); 
			$( '#'+ vars.uniqueId +'-a-value' ).val(vars.alpha);
			$( '#'+ vars.uniqueId +'-h-value' ).val(vars.hsl[0]); 
			$( '#'+ vars.uniqueId +'-s-value' ).val(vars.hsl[1]); 
			$( '#'+ vars.uniqueId +'-l-value' ).val(vars.hsl[2]); 
			$( '#'+ vars.uniqueId +'-hex-value' ).val("#" + vars.hex);
			let cpFuncStr = '';
			switch ($('#'+ vars.uniqueId +'-colorFunc').val()){
				case 'rgb': cpFuncStr = 'rgb('+ vars.red +','+ vars.green +','+ vars.blue +')'; break;
				case 'rgba': cpFuncStr = 'rgba('+ vars.red +','+ vars.green +','+ vars.blue +','+ vars.alpha +')'; break;
				case 'hsl': cpFuncStr = 'hsl('+ vars.hsl[0] +','+ vars.hsl[1] +','+ vars.hsl[2] +')'; break;
			}
			
			if(obj.options.useColorToSet == true){
				$($( '#'+ vars.uniqueId +'-useFor' ).val()).css(obj.options.useColorFor,'rgba('+ vars.red +','+ vars.green +','+ vars.blue +','+ vars.alpha +') !important')
			}
			
			$('#'+ vars.uniqueId +'-colorFunction').val(cpFuncStr);
		},
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });	
	
	$.widget( "bn.bnHelp" , {
        options: {
			
		},
        _create: function () {
			
			
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });	
	
	$.widget( "bn.bnResourceBrowser" , {
        options: {
			urls:[
				{	name: "qlik help", url:"http://help.qlik.com" },
				{	name: "branch", url:"http://branch.qlik.com" },
				{	name: "community", url:"http://communtiy.qlik.com" },
				{	name: "qlikblog.at", url:"http://qlikblog.at" },
				{	name: "qlik.binom", url:"http://qlik.binom.net" }
			],
			navLabel: 'Qlik',
			navLabelUrl: "http://qlik.com",
			defaultUrl: "http://qlik.binom.net",
			navSubLabel: 'Resources:',
			iconClose: '<i class="fa fa-times"></i>',
			showLogo: true,
			inlineContent:true,
			iframeName: 'ResourceBrowser',
			ids:{
				wrapper: 'bnResourcesWrapper',
				header: 'bnResourcesHeader',
				iframe: 'bnResourceIframe',
				logo: 'Logo',
				nav: 'bnResourcesNav',
				bClose: 'bnRessourcesClose'
			}
		},
        _create: function () {
			let obj = this;
			let label = '';
			//this.options.inlineContent == true ? inlineContent = this.options.classes.aLeft: inlineContent = '';
			this.options.navLabelUrl != '' ? label = '<a  href="'+this.options.navLabelUrl+'" target="'+this.options.iframeName+'">'+ this.options.navLabel + '</a>&nbsp;': label = this.options.navLabel+'&nbsp;';
			this.options.navSubLabel != '' ? label += this.options.navSubLabel : label += '';
			let html =  '<div id="'+ this.options.ids.wrapper + '"><div id="'+ this.options.ids.header + '"><div id="'
			+ this.options.ids.logo + '" ></div><div id="'+ this.options.ids.nav + '"><h1>'+label+'</h1><ul>';
			for (i = 0; i < this.options.urls.length; i++){ 
				html +=	'<li><a  href="'+this.options.urls[i].url+'" target="'+this.options.iframeName+'">'+ this.options.urls[i].name + '</a></li>';
			}
			html += '</ul><div id="'+this.options.ids.bClose+'">'+this.options.iconClose+'</div></div></div>';
			html += '<iframe id="'+this.options.ids.iframe+'" name="'+this.options.iframeName+'" src="'+this.options.defaultUrl+'" width="90%" height="90%" frameBorder="0" ></iframe></div>';
			this.element.on('click', function(){ $('#'+ obj.options.ids.wrapper).show() });
			$('body').append(html);
			$('#'+this.options.ids.bClose).on('click', function(){ $('#'+ obj.options.ids.wrapper).hide() });
			$('#'+ obj.options.ids.wrapper).hide();
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });	
	
	$.widget( "bn.bnQSToolBox" , {
        options: {
			app: {},
			appField: '',
			addLinks:[],
			config:{
				asDialog:false, // Box as Dialog
				/* 	add to a Sidebar and Toogle the Sidebar
					use resizeElementByToggle to resize the parent Div Size
				*/
				addBoxToSideBarId:'sideBarRight',
				toggleSideBar:true,
				resizeElementsByToggle: ''
			},
			icons: {
				curSelection: '<i class="fa fa-check-square-o"></i>',
				clearAll: '<i class="fa fa-times"></i>',
				back: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
				forward: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
				unlockall: '',
				lockall: '',
				bookmarks: '',
				singleApp: '',
				multiApps: '<i id="bnQSappMasterIcon" class="fa fa-cubes fa-fw" aria-hidden="true"></i>',
				bnTools: '<i class="fa fa-wrench" aria-hidden="true"></i>',
				saGen: '<i class="fa fa-code" aria-hidden="true"></i>',
				vars: '<i class="fa fa-sliders" aria-hidden="true"></i>',
				colorPicker: '<i class="fa fa-eyedropper" aria-hidden="true"></i>',
				help: '<i class="fa fa-question"></i>'
				
			}, actions: []
		},
        _create: function () {
			
			let obj = this;
			this.vars = {};
			this.vars.oldWith ='';
			
			this.options.actions['back'] = '<a href="#" data-bncmd="back">'+ this.options.icons.back +'</a>';
			this.options.actions['clearAll'] = '<a href="#" data-bncmd="clearAll">'+ this.options.icons.clearAll +'</a>';		
			this.options.actions['forward'] = '<a href="#" data-bncmd="forward">'+ this.options.icons.forward +'</a>';
			this.options.actions['curSelection'] = '<a href="#" class="" id="bnOpenCS" data-bncmd="curSelectionBox">'+ this.options.icons.curSelection +'</a>';
			this.options.actions['bnTools'] = '<a href="#">'+ this.options.icons.bnTools +'</a>';
			this.options.actions['saGen'] = '<a href="#">'+ this.options.icons.saGen +' Set Analysis</a>';
			this.options.actions['vars'] = '<a href="#">'+ this.options.icons.vars +' variables</a>';
			this.options.actions['colorPicker'] ='<a href="#">'+ this.options.icons.colorPicker +' ColorPicker</a>';
			this.options.actions['help'] = '<a href="#" data-bncmd="help">'+ this.options.icons.help +'</a>';

			let bnBox = '<div id="bnQSToolBox" class="bnQSToolBox">';
			bnBox += '<h1>'+this.options.icons.curSelection+'  Current Selections';
			bnBox += '</h1>';
			bnBox += '<div class="contet">';
			bnBox += '';
			
			bnBox += '</div>';
			bnBox += '</div>';
			
			
			$('#sideBarRight').append(bnBox);
			let html = '';
			if($.isArray(this.options.app)){
				html = '<ul class="bnQSToolbox">';
				html += '<li><a> ' + this.options.icons.multiApps;
				html += '<select id="appMasterSelect">';
				html += '<option value="all">Global</option>';
				for(i=0; i < this.options.app.length; i++){
					html += '<option value="'+this.options.app[i].app.id+'">'+ this.options.app[i].appName+'</option>';
				}
				html += '</select></a></li>';
			}
			html += '<li>'+ this.options.actions['back'] +'</li>';
			html += '<li>'+ this.options.actions['clearAll'] + '</li>';
			html += '<li>'+ this.options.actions['forward'] +'</li>';
			html += '<li>'+ this.options.actions['curSelection'] +'</li>';

			html += '<li class="bnQSToolsHelper">' + this.options.actions['bnTools'] + '<ul>';
				html += '<li>'+this.options.actions['saGen']+'</li>';
				html += '<li>'+this.options.actions['vars'] +'</li>';
				html += '<li>'+this.options.actions['colorPicker']+'</li>';
			html += '</ul></li>';
	
			html += '<li>'+this.options.actions['help']+'</li>';
			
			for(i=0; i< this.options.addLinks.length;i++){
				html += '<li ><a id="'+this.options.addLinks[i].linkId+'" href="'+this.options.addLinks[i].linkUrl+'">'+this.options.addLinks[i].linkName+'</a></li>';
			}
			
			html += '</ul>';
			this.element.prepend(html);
			
			$('#appMasterSelect').on('change',function(){
				$('#bnQSappMasterIcon').removeClass('fa-cubes fa-cube')
				if( $(this).val() == 'all') {
					$('#bnQSappMasterIcon').addClass('fa-cubes')
				} else $('#bnQSappMasterIcon').addClass('fa-cube')
			});
			
			$( "[data-bncmd]" ).on( 'click', function () {
				let $element = $( this );
				switch ( $element.data( 'bncmd' ) ) {
					case 'back': obj.back(); break;
					case 'forward':	obj.forward(); break;
					case 'lockAll':	obj.lockAll(); break;
					case 'unlockAll': obj.unlockAll(); break;
					case 'clearAll': obj.clearAll(); break;
					case 'help': $('.bnHelp').toggle(); break;
					case 'curSelectionBox': obj.currentSelectionBox(); break;
			}});
			
			if($.isArray(this.options.app)){
				for (let appCount =0; appCount < obj.options.app.length; appCount++){
					$("#bnQSToolBox").append('<h2><i id="bnQSappMasterIcon" class="fa fa-cube fa-fw" aria-hidden="true"></i>'+obj.options.app[appCount].appName+'</h2><div id="'+ obj.options.app[appCount].app.id.replace('.','') + '-curSelection"' + ' class="bnQScurSelection"></div>' );
					obj.options.app[appCount].app.getList("CurrentSelections", function(reply,app) {
						let uniqueId = bnHelper.uniqueId();
						let selectionslist ="";
						let mySelectedFields = reply.qSelectionObject.qSelections;
						let mySelectedFields_arrayLength = mySelectedFields.length;
						$( "#bnOpenCS" ).removeClass( "selectionSet" );
						if(mySelectedFields_arrayLength > 0) $( "#bnOpenCS" ).addClass( "selectionSet" ); 
						for (let j = 0; j < mySelectedFields_arrayLength; j++) {
							mySelectedFields[j].qLocked==true ? icon = 'lock' : icon = 'unlock';
							let str =  "";
							str =  '<div class="bnCurSelectField"><span name="'+ mySelectedFields[j].qField 
							+'" class="deleteSelection"> <i class="fa fa-trash"></i> </span><span name="'
							+ mySelectedFields[j].qField +'" class="'+ icon +'Selection"> <i class="fa fa-'
							+icon+'"></i> </span><span id="'+app.id.replace('.','')+'selectField' + j + '"> </span></div>';
							j==0 ? selectionslist = str : selectionslist += str;
						}
					 
						$('#' + app.id.replace('.','') + '-curSelection').html(selectionslist);
						for (let j = 0; j < mySelectedFields_arrayLength; j++) { 
							$('#'+app.id.replace('.','')+'selectField'+j).bnQSHtmlSelect({  
								app: app, 
								appField: mySelectedFields[j].qField, 
								qHeight: 1000,  
								multiple:false,
								useEmptyAsLabel: true,
								labelForField: mySelectedFields[j].qField
							}); 
						}
						$(".deleteSelection").on( "click", function() { app.field($(this).attr("name")).clear(); });
						$(".lockSelection").on( "click", function() { app.field($(this).attr("name")).unlock(); });
						$(".unlockSelection").on( "click", function() { app.field($(this).attr("name")).lock(); });
					});
				}
			}
			else {
				//$("#bnQSToolBox").append('<h2><i id="bnQSappMasterIcon" class="fa fa-cube fa-fw" aria-hidden="true"></i>'+obj.options.app[appCount].appName+'</h2><div id="'+ obj.options.app[appCount].app.id.replace('.','') + '-curSelection"' + ' class="bnQScurSelection"></div>' );
				obj.options.app.getList("CurrentSelections", function(reply,app) {
					uniqueId = bnHelper.uniqueId();
					selectionslist ="";
					let mySelectedFields = reply.qSelectionObject.qSelections;
					let mySelectedFields_arrayLength = mySelectedFields.length;
					$( "#bnOpenCS" ).removeClass( "selectionSet" );
					if(mySelectedFields_arrayLength > 0) $( "#bnOpenCS" ).addClass( "selectionSet" ); 
					for (let j = 0; j < mySelectedFields_arrayLength; j++) {
						mySelectedFields[j].qLocked==true ? icon = 'lock' : icon = 'unlock';
						let str =  "";
						str =  '<div class="bnCurSelectField"><span name="'+ mySelectedFields[j].qField 
						+'" class="deleteSelection"> <i class="fa fa-trash"></i> </span><span name="'
						+ mySelectedFields[j].qField +'" class="'+ icon +'Selection"> <i class="fa fa-'
						+icon+'"></i> </span><span id="'+app.id.replace('.','')+'selectField' + j + '"> </span></div>';
						j==0 ? selectionslist = str : selectionslist += str;
					}
				 
					$('#' + app.id.replace('.','') + '-curSelection').html(selectionslist);
					for (let j = 0; j < mySelectedFields_arrayLength; j++) { 
						$('#'+app.id.replace('.','')+'selectField'+j).bnQSHtmlSelect({  
							app: app, 
							appField: mySelectedFields[j].qField, 
							qHeight: 1000,  
							multiple:false,
							useEmptyAsLabel: true,
							labelForField: mySelectedFields[j].qField
						}); 
					}
					$(".deleteSelection").on( "click", function() { app.field($(this).attr("name")).clear(); });
					$(".lockSelection").on( "click", function() { app.field($(this).attr("name")).unlock(); });
					$(".unlockSelection").on( "click", function() { app.field($(this).attr("name")).lock(); });
				});
			}
        },
		lockAll: function(){
			if($.isArray(this.options.app)){
				for (i=0; i< this.options.app.length; i++){
					if($('#appMasterSelect option:selected').val() == 'all' || this.options.app[i].app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app[i].app.lockall();
					} 
				}
			} else {
				if($('#appMasterSelect option:selected').val() == 'all' || this.options.app.id == $('#appMasterSelect option:selected').val() ){
					this.options.app.lockall();
				} 
			}
		},
		unlockAll: function(){
			if($.isArray(this.options.app)){
				for (i=0; i< this.options.app.length; i++){
					if($('#appMasterSelect option:selected').val() == 'all' || this.options.app[i].app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app[i].app.unlockall();
					} 
				}
			} else {
				if($('#appMasterSelect option:selected').val() == 'all' || this.options.app.id == $('#appMasterSelect option:selected').val() ){
					this.options.app.unlockall();
				} 
			}
		},
		back: function(){
			if($.isArray(this.options.app)){
				for (i=0; i< this.options.app.length; i++){
					if($('#appMasterSelect option:selected').val() == 'all' || this.options.app[i].app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app[i].app.back();
					} 
				}
			} else {
				if($('#appMasterSelect option:selected').val() == 'all' || this.options.app.id == $('#appMasterSelect option:selected').val() ){
					this.options.app.back();
				} 
			}
		},
		forward: function(){
			if($.isArray(this.options.app)){
				for (i=0; i< this.options.app.length; i++){
					if($('#appMasterSelect option:selected').val() == 'all' || this.options.app[i].app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app[i].app.forward();
					} 
				}
			} else {
				if($('#appMasterSelect option:selected').val() == 'all' || this.options.app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app.forward();
					} 
			}
		},
		clearAll: function(){
			if($.isArray(this.options.app)){
				for (i=0; i < this.options.app.length; i++){
					//console.log($('#appMasterSelect option:selected').val())
					if($('#appMasterSelect option:selected').val() == 'all' || this.options.app[i].app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app[i].app.clearAll();
						$("* select").find("[data-bnqsapp='" + this.options.app[i].app.id + "']").removeClass('statusS statusX');
					} 
				}
			} else {
				if($('#appMasterSelect option:selected').val() == 'all' || this.options.app.id == $('#appMasterSelect option:selected').val() ){
						this.options.app.clearAll();
						$("* select").find("[data-bnqsapp='" + this.options.app.id + "']").removeClass('statusS statusX');
					} 
			}
			
			// Reset Slider Values
			if(bnQSession.sliders.length > 1){
				for(i=0; i < bnQSession.sliders.length;i++){
					if(bnQSession.sliders[i].type == 'range'){
						$("#"+bnQSession.sliders[i].uniqueId+'-slider').slider("values", 0, bnQSession.sliders[i].initialMin);
						$("#"+bnQSession.sliders[i].uniqueId+'-slider').slider("values", 1, bnQSession.sliders[i].initialMax);
						$("#"+bnQSession.sliders[i].uniqueId+'-value').val(bnQSession.sliders[i].initialMin+'-'+bnQSession.sliders[i].initialMax)
					} else {
						$( '#' + bnQSession.sliders[i].uniqueId + '-slider' ).val( bnQSession.sliders[i].initialMax );
						$( '#' + bnQSession.sliders[i].uniqueId + '-value' ).val( bnQSession.sliders[i].initialMax );
						
					}
				}
			}
			
			
		},
		currentSelectionBox: function(){
			
			if(this.options.config.toggleSideBar == true){
				if( $('#'+this.options.config.addBoxToSideBarId).is(':visible') == true){ 
					$('#'+this.options.config.addBoxToSideBarId).hide();
					$(this.options.config.resizeElementsByToggle).css({"width": this.vars.oldWith + '%'}); 
				} else { $('#'+this.options.config.addBoxToSideBarId).show();
					this.vars.oldWith = $(this.options.config.getWidthFrom).percWidth();
					$(this.options.config.resizeElementsByToggle).css("width", Math.round($(this.options.config.getWidthFrom).percWidth() - $('#'+this.options.config.addBoxToSideBarId).percWidth()) + '%'); 
				}
			}
		},
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });	
	
	$.widget( "bn.bnSA_P_and_E" , {
        options: {
			app: {}
		},
        _create: function () {
			
			let id = this.element[0].id;
			this.options.app.visualization.create( 'scatterplot',
				["Year", "=Avg([LineSalesAmount])"],
				{"color": {"auto": false, "mode": "byMeasure", "measureScheme": "sc" }}
			).then( function ( visual ) {
				visual.show( id );
			} );
			
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });
	
	$.widget( "bnQSFullScreen" , {
        options: {
			
		},
        _create: function () {
			
			
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });

	$.widget( "bnQSKpi" , {
        options: {
			
		},
        _create: function () {
			
			
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        }
    });
	
})( jQuery, window, document );