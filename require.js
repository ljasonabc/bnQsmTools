/*
 * Basic Mashup template with absolute positioning
 * @owner Enter you name here Thomas Lindackers
 
	BETA STATE

 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
// Get Path for this Mashup
mashupPath = window.location.pathname.split('/');
thisMashupPath = 'app/'+mashupPath[1]+'/'+mashupPath[2];

require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources",
	paths: { app: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") }
} );

require( [	"js/qlik", 
			thisMashupPath + "/inc/d3.min" ,
			"underscore",  
			"jquery", "jqueryui", 
			"angular",
			thisMashupPath + "/inc/bnQsmTools.jquery",
			thisMashupPath + "/inc/bnGrid.jquery"
		 ], function ( qlik, d3, _ , $, angular) {
	
	qlik.setOnError( function ( error ) { 
	
		console.log( error.message ); 
	
	} );
	
	//callbacks -- inserted here --

	//open apps -- inserted here --
	var app = qlik.openApp('QSMaster.qvf', config); 
	var app1 = qlik.openApp('Automotive.qvf', config); 
	
	//get objects -- inserted here --
	app.getObject('QV06','aKvQpg');
	app.getObject('QV05','mhDWuve');
	app1.getObject('QV04','PHKjx');
	app.getObject('QV03','TawbZdb');
	app1.getObject('QV02','utuwT');
	app.getObject('QV01','JYyWhh');
	
	//create cubes and lists -- inserted here --
	
/*
		//bnGrid v 1.0
		*****************************************************
		create absolute Boxes
		can 
		- be responsnive or static
		- dragg and dropable
		- nested Grids (see below)
		- can be used to build dashbaords or standard Layouts
		
		not finsihed
	*/
	//pass Click Resize to ResizeGrid
	var qlikResize = qlik.resize;
	
	var grid = $('#gridcontainer').bnGrid( { 
		matrix: { cols: 3, rows: 5 },
		pad:{ cols:7, rows:7},
		complete: function(){ // InlineGrid 
			$('#inLineGrid').bnGrid( { matrix:{cols: 2, rows: 2 }, complete: function(){} });
		},
		customResizeEvent: qlikResize //pass Click Resize to ResizeGrid
	});
	
	var grid2 = $('#gridcontainer2').bnGrid( { 
		matrix: { cols: 5, rows: 1 }, 
		pad:{ cols:7, rows:7}, 
		customResizeEvent: qlikResize
	});
	
	/*
		// bnPages v 1.0
		*****************************************************
		Preview Function
	*/
	
	$('#A4 h1').on('click',function(){ 
		$('#gridcontainer2').show(); 
		$('#gridcontainer').hide(); 
		$('#gridcontainer2').bnGrid( 'resizeGrid');
	}).parent().addClass('bnPage');
	$('#page1-A1 h1').on('click',function(){ 
		$('#gridcontainer').show(); 
		$('#gridcontainer2').hide(); 
		$('#gridcontainer, #inLineGrid').bnGrid( 'resizeGrid');
	});
	

	/*
		bnQsmTools V 1.0 - "bnQSToolBox"
		*****************************************************
		enables Cross Apps Navigation (clear foreward back bookmarks current selection)
		
	*/
	$('#headerMenu').bnQSToolBox(
		{app: 	[
					{app: app, appName: 'QSMaster'} , 
					{app: app1, appName: 'Automotive'} 
		], 
		// extend the ToolBar with own Links see below (SideBar DemoCode)
		addLinks:[
			{	linkName: '<i class="fa fa-filter" aria-hidden="true"></i>',
				linkUrl: '#',
				linkId: 'sidbarSwitch' }
			],
		config: {
			asDialog: false, 
			addBoxToSideBarId: 'sideBarRight',
			toggleSideBar: true,
			resizeElementsByToggle: '.bnGridContainer',
			getWidthFrom: '#gridcontainer'
		}
	});
	
	// SideBar DemoCode for bnGrid
	var oldWidth = '';
	$('#sidbarSwitch').on('click',function(){
		if( $('#sideBar').is(':visible') == true){ 
			$('#sideBar').hide();
			$('.bnGridContainer').css({"width": oldWidth + '%'});
	
		} else { $('#sideBar').show();
			oldWidth = $('#gridcontainer').percWidth();
			console.log($('#gridcontainer').percWidth() - $('#sideBar').percWidth())
			$('.bnGridContainer').css("width", Math.round($('#gridcontainer').percWidth() - $('#sideBar').percWidth()) + '%');
		}
	});
	
	/*
		bnQsmTools V 1.0 - "bnQSRessourceBrowser" Samples
		*****************************************************
	*/
	$('#logo').bnResourceBrowser(
			
	);

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
	
	$('body').bnQSExpression({app: [
		{app: app, appName: 'QSMaster'} , 
		{app: app1, appName: 'Automotive'} ],
		// use complete Function to fade out Preloader
		complete: function(){ $('#bnLoadingOverlay').delay( 2000 ).fadeOut( "slow", function() { }); }
	}); 
	

	/*
		bnQsmTools V 1.0 - "bnQSHtmlSelect" Samples
		*****************************************************
		in work - Cross Select
	*/
	
	$('#bnQSHtmlSelect').bnQSHtmlSelect({ 
		app: app1, 
		appField: "Year", 
		labelForField: "Jahr", 
		qHeight: 15, 
		alwaysOneSelected: false,  
		emptyValue: '---', 
		showLabelRow: true,  
		multiple:true 
		
	});
	
	$('#bnQSHtmlSelect2').bnQSHtmlSelect({  
		app: app, 
		appField: "Year", 
		labelForField: "Year", 
		qHeight: 15, 
		alwaysOneSelected: false,  
		emptyValue: '---', 
		showLabelRow: true
	});
	
	$('#bnQSHtmlSelect3').bnQSHtmlSelect({ 
		app: app, 
		appField: "Quarter", 
		labelForField: "Quarter", 
		qHeight: 4, 
		emptyValue: '---', 
		showLabelRow: true, 
		multiple:true 
	});
	
	// Cross Select Sample
	$('#bnQSHtmlSelect4').bnQSHtmlSelect({
		app: [{app: app}, {app: app1}], 
		appField: "Year", 
		labelForField: "Year", 
		qHeight: 15, 
		alwaysOneSelected: false,  
		emptyValue: '---', 
		showLabelRow: true,  
		multiple:true 
		
	});
	
	/*
		bnQsmTools V 1.0 - "bnQSListbox" Samples
		*****************************************************
		using Sliders for Field or Variables (fieldOrVar option)
		
	*/
	$('#bnQSListbox').bnQSListbox({
		app: app, 
		appField: "CompanyName", 
		labelForField: "Kunde(n)", 
		qHeight: 1000, 
		alwaysOneSelected: false, 
		showLabelRow: true,  
		type: 'menu',
		menuOpenOn: 'mouseover',
		showFrequencies:true,
		ownExpression: true,
		shadow: true,
		roundedCorners:true,
		useExpression: "num(sum({$ <+/bnp+/>} LineSalesAmount),'$(MoneyFormat)')",
		showCountInLabel: true,
		showTotalInLabel: false
	}); 
	
	$('#bnQSListbox2').bnQSListbox({
		app: app, 
		appField: "ProductName", 
		labelForField: "Produkt(e)", 
		qHeight: 1000, 
		showFrequencies:true,
		alwaysOneSelected: false, 
		showLabelRow: true,  
		type: 'menu',
		menuOpenOn: 'click',
		showCountInLabel: true,
		showTotalInLabel: false
	});
	
	$('#bnQSListbox3').bnQSListbox({
		app: app, 
		appField: "Year", 
		labelForField: "Jahr", 
		qHeight: 1000, 
		alwaysOneSelected: false, 
		showLabelRow: true,  
		type: 'horizontal',
		ownExpression: true,
		shadow: true,
		roundedCorners:true,
		useExpression: "num(sum({$ <+/bnp+/>} LineSalesAmount),'$(MoneyFormat)')"
	});
	
	$('#bnQSListbox4').bnQSListbox({
		app: app, 
		appField: "Quarter", 
		labelForField: "Quartal", 
		qHeight: 4, 
		alwaysOneSelected: false, 
		showLabelRow: false,  
		type: 'horizontal'
	});
	
/* 	  $('#bnQSListbox5').bnQSListbox({
		app: app, 
		appField: "CompanyName", 
		labelForField: "Customer", 
		qHeight: 1000, 
		alwaysOneSelected: false, 
		showLabelRow: true,  
		type: 'vertical',
		shadow: false,
		roundedCorners:false,
		height: '80%'
	});  
	 */
	 
	//$('#QV10').bnSA_P_and_E({app: app});
	
	$('#bnQSColorPicker').bnColorPicker();
	$('#bnQSColorPicker2').bnColorPicker({useColorFor: 'color'});

	/*
		bnQsmTools V 1.0 - "bnQSSlider" Samples
		*****************************************************
		using Sliders for Field or Variables (fieldOrVar option)
		
	*/
	$('#slider1').bnQSSlider({
		app: app, 
		appField: "UnitPrice", 
		useMinFromField: true, 
		useMaxFromField: true, 
		type: 'range',
		startValues:{min:0, max: 100}
	});
	
	$('#slider2').bnQSSlider({
		app: app, 
		appField: "LineSalesAmount", 
		label:"Umsatz", 
		useMaxFromField: true, 
		type: 'range',
		startValues:{ max: 2000}
	});
	
	$('#slider3').bnQSSlider({
		app: app, 
		appField: "CustomerRecordCounter", 
		label:"Select a Customer ID", 
		type: 'basic', condition: '^', 
		useMaxFromField: true, 
		resetByZero: true,
		startValues:{ max: 1},
		fieldOrVar: 'field' //default
	});
	
	$('#slider4').bnQSSlider({
		app: [{app: app}, {app: app1}], 
		label:"Set Variables Sample", 
		fieldOrVar: 'var', 
		variables: [{name: 'bnTestVar1', value: 1}, {name: 'bnTestVar2', value: 100} ],
		type: 'range',
		min: 0, 
		max: 100,
		step: 10,		
		startValues:{ min:0, max: 100 }
	});

	
	// Test Space

	
	
	
//----------------------------------------------------- END
} );