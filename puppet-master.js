
var PuppetMaster = function PuppetMaster( ){
	//Clear things that are not required
	this.clearAudience( );
};

PuppetMaster.prototype.stringOverrideList = [ ];

PuppetMaster.prototype.stringSet = null;

PuppetMaster.prototype.clearAudience = function clearAudience( ){
	$( "body" ).ready( function onReady( ){
		//$( "head" ).remove( ":not([required])" );
		//$( "body" ).remove( ":not([required])" );
	} );

	return this;
};

PuppetMaster.prototype.attachStringSet = function attachStringSet( stringSet ){
	/*:
		@meta-configuration:
			{
				"stringSet:required": "object"
			}
		@end-meta-configuration
	*/

	this.stringSet = stringSet;

	return this;
};

PuppetMaster.prototype.addStringOverride = function addStringOverride( stringOverride ){
	/*:
		@meta-configuration:
			{
				"stringOverride:required": "function"
			}
		@end-meta-configuration
	*/

	if( typeof stringOverride != "function" ){
		var error = new Error( "invalid string override" );
		console.error( error );
		throw error;
	}

	var stringOverrideListLength = this.stringOverrideList.length;
	for( var index = 0; index < stringOverrideListLength; index++ ){
		if( this.stringOverrideList[ index ] === stringOverride ){
			console.warn( "string override is already in the list" );
			console.log( "addStringOverride will not do anything further" );

			return this;
		}
	}

	this.stringOverrideList.push( stringOverride );

	return this;
};

PuppetMaster.prototype.determinePuppetString = function determinePuppetString( ){
	if( !this.stringSet ){
		var error = new Error( "determining puppet string without string set" );
		console.error( error );
		throw error;
	}

	var self = this;
	var puppetString = puppetry( this.stringSet, function stringOverrideEngine( failingCondition ){
		var truth = true;

		var stringOverrideList = self.stringOverrideList;
		var stringOverrideListLength = stringOverrideList.length;
		for( var index = 0; index < stringOverrideListLength; index++ ){
			truth = truth && stringOverrideList[ index ]( failingCondition );
		}

		return truth;
	} );

	return puppetString;
};

PuppetMaster.prototype.createPuppet = function createPuppet( puppetString ){
	/*:
		@meta-configuration:
			{
				"puppetString:required": "string"
			}
		@end-meta-configuration
	*/

	var puppet = $( "<iframe>" )
		.attr( "required", "" )
		.attr( "src", puppetString )
		.attr( "height", "100%" )
		.attr( "width", "100%" )
		.css( {
			"margin": "0px",
			"overflow": "hidden",
			"border": "none",
			"padding": "0px",
			"height": "100%",
			"width": "100%"
		} );

	return puppet;
};

PuppetMaster.prototype.attachPuppet = function attachPuppet( puppet ){
	/*:
		@meta-configuration:
			{
				"puppet": "jQuery"
			}
		@end-meta-configuration
	*/

	$( "body" ).ready( function onReady( ){
		$( "body" ).append( puppet );
	} );

	return this;
};

PuppetMaster.prototype.startPuppetShow = function startPuppetShow( ){
	var puppetString = this.determinePuppetString( );
	var puppet = this.createPuppet( puppetString );
	this.attachPuppet( puppet );

	return this;
};