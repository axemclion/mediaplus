if (typeof PixasticController === "undefined") {
	var PixasticController = function(configChanged) {
		var $ = jQuery;
		this.config = {
			"action" : "sharpen",
			"args" : {
				"amount" : 0
			}
		};
		var me = this;

		function changeConfig(config) {
			me.config = config;
			if (typeof configChanged === "function") {
				configChanged(config);
			}
		}
		;

		var controls = $("#flashPlus-pixastic-controls");
		if (controls.length !== 0) {
			return;
		}

		// Start Drawing the controls
		controls = $("<div></div>", {
			"id" : "flashPlus-pixastic-controls"
		}).draggable().appendTo("body");

		me.header = $("<div></div>").appendTo(controls);

		var accordion = $("<div></div>").css({
			"font-size" : "11px",
			"margin" : "2%",
			"width" : "96%"
		}).appendTo(controls);

		// Brightness and Contrast
		$("<h3><a href = '#'>Brightness/Contrast</a></h3>").appendTo(accordion);
		var accordionContent = $("<div></div>").appendTo(accordion);
		$("<div>Brightness</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-brightness'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 150,
			"value" : 0,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "brightness",
					args : {
						"brightness" : $("#flashPlus-pixastic-action-brightness").slider("value"),
						"contrast" : $("#flashPlus-pixastic-action-contrast").slider("value")
					}
				});
			}
		}).appendTo(accordionContent);
		$("<div>Contrast</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-contrast'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : -1,
			"max" : 3,
			"step" : 0.1,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "brightness",
					args : {
						"brightness" : $("#flashPlus-pixastic-action-brightness").slider("value"),
						"contrast" : $("#flashPlus-pixastic-action-contrast").slider("value")
					}
				});
			}
		}).appendTo(accordionContent);

		// Flip and rotate
		$("<h3><a href = '#'>Flip & Rotate</a></h3>").appendTo(accordion);
		var accordionContent = $("<div></div>").appendTo(accordion);
		$("<input type = 'radio' name = 'misc'>Flip Left-Right</input>").change(function() {
			changeConfig({
				"action" : "fliph",
				"args" : {}
			});
		}).appendTo(accordionContent);
		$("<input type = 'radio' name = 'misc'>Flip Top-Down</input>").change(function() {
			changeConfig({
				"action" : "flipv",
				"args" : {
					"average" : false
				}
			});
		}).appendTo(accordionContent);

		// Blur
		$("<h3><a href = '#'>Blur/Sharpen</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").appendTo(accordion);
		$("<div>Blur</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 1,
			"step" : 0.1,
			"value" : 0,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "blurfast",
					args : {
						"amount" : $(this).slider("value")
					}
				});
			}
		}).appendTo(accordionContent);
		$("<div>Sharpen</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 1,
			"step" : 0.1,
			"value" : 0,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "sharpen",
					args : {
						"amount" : $(this).slider("value")
					}
				});
			}
		}).appendTo(accordionContent);

		// Mosiac
		$("<h3><a href = '#'>Pixelate</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").appendTo(accordion);
		$("<div>Block</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 5,
			"max" : 25,
			"value" : 0,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "mosaic",
					args : {
						"blockSize" : $(this).slider("value")
					}
				});
			}
		}).appendTo(accordionContent);

		// Noise
		$("<h3><a href = '#'>Noise</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").appendTo(accordion);
		var noiseChange = function(event, ui) {
			changeConfig({
				"action" : "noise",
				args : {
					"amount" : $("#flashPlus-pixastic-action-noiseAmount").slider("value"),
					"strength" : $("#flashPlus-pixastic-action-noiseStrength").slider("value"),
					"mono" : $("#flashPlus-pixastic-action-noiseMono").attr("checked")
				}
			});
		}
		$("<div>Amount</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-noiseAmount'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 1,
			"step" : 0.1,
			"value" : 0,
			"change" : noiseChange
		}).appendTo(accordionContent);
		$("<div>Strength</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-noiseStrength'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 1,
			"step" : 0.1,
			"value" : 0,
			"change" : noiseChange
		}).appendTo(accordionContent);
		$("<div style = 'clear:both; display: block'></div>").appendTo(accordionContent);
		$("<input type = 'checkbox' name = 'misc' id = 'flashPlus-pixastic-action-noiseMono'>Monochromatic</input>").appendTo(accordionContent)
				.change(noiseChange);
		$("<button>Remove Noise</button>").appendTo(accordionContent).click(function() {
			changeConfig({
				"action" : "removenoise",
				"args" : {}
			});
		});

		// Color Adjustment
		$("<h3><a href = '#'>Color Adjust</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").appendTo(accordion);

		$("<span>Red</span>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-colorRed'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : -1,
			"max" : 1,
			"step" : 0.1,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "coloradjust",
					args : {
						"red" : $("#flashPlus-pixastic-action-colorRed").slider("value"),
						"blue" : $("#flashPlus-pixastic-action-colorBlue").slider("value"),
						"green" : $("#flashPlus-pixastic-action-colorGreen").slider("value")
					}
				});
			}
		}).appendTo(accordionContent);
		$("<span>Blue</span>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-colorBlue'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : -1,
			"max" : 1,
			"step" : 0.1,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "coloradjust",
					args : {
						"red" : $("#flashPlus-pixastic-action-colorRed").slider("value"),
						"blue" : $("#flashPlus-pixastic-action-colorBlue").slider("value"),
						"green" : $("#flashPlus-pixastic-action-colorGreen").slider("value")
					}
				});
			}
		}).appendTo(accordionContent);
		$("<span>Green</span>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-colorGreen'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : -1,
			"max" : 1,
			"step" : 0.1,
			"change" : function(event, ui) {
				changeConfig({
					"action" : "coloradjust",
					args : {
						"red" : $("#flashPlus-pixastic-action-colorRed").slider("value"),
						"blue" : $("#flashPlus-pixastic-action-colorBlue").slider("value"),
						"green" : $("#flashPlus-pixastic-action-colorGreen").slider("value")
					}
				});
			}
		}).appendTo(accordionContent);

		$("<h3><a href = '#'>Emboss</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").appendTo(accordion);
		var embossChange = function() {
			changeConfig({
				"action" : "emboss",
				args : {
					"strength" : $("#flashPlus-pixastic-action-embossStrength").slider("value"),
					"greyLevel " : $("#flashPlus-pixastic-action-embossgreyLevel").slider("value"),
					"blend" : $("#flashPlus-pixastic-action-embossblend").prop("checked")
				}
			});
		}
		$("<div>Strength</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-embossStrength'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 10,
			"value" : 0,
			"change" : embossChange
		}).appendTo(accordionContent);
		$("<div>Gray Level</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-embossgreyLevel'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 255,
			"value" : 0,
			"change" : embossChange
		}).appendTo(accordionContent);
		$("<div>Blend</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<input type = 'checkbox' id = 'flashPlus-pixastic-action-embossblend' value = 'true'/>").addClass("flashPlus-pixastic-value").change(
				embossChange).appendTo(accordionContent);

		// Glow
		$("<h3><a href = '#'>Glow</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").appendTo(accordion);
		var glowChange = function() {
			changeConfig({
				"action" : "glow",
				args : {
					"amount" : $("#flashPlus-pixastic-action-glowAmount").slider("value"),
					// TODO : Glow Radius is not working
					"radius " : $("#flashPlus-pixastic-action-glowRadius").slider("value")
				}
			});
		}
		$("<div>Amount</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-glowAmount'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 1,
			"step" : 0.01,
			"value" : 0,
			"change" : glowChange
		}).appendTo(accordionContent);
		$("<div>Radius</div>").addClass("flashPlus-pixastic-key").appendTo(accordionContent);
		$("<div id = 'flashPlus-pixastic-action-glowRadius'></div>").addClass("flashPlus-pixastic-value").slider({
			"min" : 0,
			"max" : 1,
			"step" : 0.01,
			"value" : 0,
			"change" : glowChange
		}).appendTo(accordionContent);

		// Misc
		$("<h3><a href = '#'>Misc</a></h3>").appendTo(accordion);
		accordionContent = $("<div></div>").css("text-align", "left").appendTo(accordion);
		$("<input type = 'radio' name = 'misc'>Sepia</input>").appendTo(accordionContent).change(function() {
			changeConfig({
				"action" : "sepia",
				"args" : {}
			});
		});
		$("<input type = 'radio' name = 'misc'>Invert</input>").appendTo(accordionContent).change(function() {
			changeConfig({
				"action" : "invert",
				"args" : {}
			});
		});
		$("<input type = 'radio' name = 'misc'>Desaturate</input>").appendTo(accordionContent).change(function() {
			changeConfig({
				"action" : "desaturate",
				"args" : {
					"average" : false
				}
			});
		});

		$("<br/>").appendTo(accordionContent);
		$("<input type = 'radio' name = 'misc'>Solarize</input>").appendTo(accordionContent).change(function() {
			changeConfig({
				"action" : "solarize",
				"args" : {}
			});
		});
		$("<input type = 'radio' name = 'misc'>Edges</input>").appendTo(accordionContent).change(function() {
			changeConfig({
				"action" : "edges2",
				"args" : {}
			});
		});
		$("<br/>").appendTo(accordionContent);

		accordion.accordion({
			autoHeight : false,
			navigation : true
		});

		controls.css({
			"top" : window.scrollY || document.documentElement.scrollTop,
			"position" : "absolute"
		});

		this.controls = controls;
		var messageBox = $("<div></div>").css({
			"color" : "red",
			"padding" : "0.3em",
			"font-size" : "0.8em"
		}).appendTo(controls);
		var messageBoxTimer = null;
		this.message = function(message) {
			messageBoxTimer && (window.clearTimeout(messageBoxTimer));
			messageBox.html(message + "").show();
			messageBoxTimer = window.setTimeout(function() {
				messageBox.slideToggle();
				messageBoxTimer = null;
			}, 3000);
		}
	};
}
