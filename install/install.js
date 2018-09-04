/***********************************************************
 * The STEP_ constants are defined in the following files: *
 *                                                         *
 * lib/installer.php                                       *
 * install/install.js                                      *
 *                                                         *
 * All files must be updated to match for the installation *
 * process to work properly                                *
 ***********************************************************/

const STEP_NONE = 0;
const STEP_WELCOME = 1;
const STEP_CHECK_DEPENDENCIES = 2;
const STEP_INSTALL_TYPE = 3;
const STEP_PERMISSION_CHECK = 4;
const STEP_BINARY_LOCATIONS = 5;
const STEP_PROFILE_AND_AUTOMATION = 6;
const STEP_TEMPLATE_INSTALL = 7;
const STEP_CHECK_TABLES = 8;
const STEP_INSTALL_CONFIRM = 9;
const STEP_INSTALL_OLDVERSION = 11;
const STEP_INSTALL = 97;
const STEP_COMPLETE = 98;
const STEP_ERROR = 99;

const DB_STATUS_ERROR = 0;
const DB_STATUS_WARNING = 1;
const DB_STATUS_SUCCESS = 2;
const DB_STATUS_SKIPPED = 3;

const FIELDS_WELCOME = {
	accept:                { type: 'checkbox',  name: 'Eula'              },
	theme:                 { type: 'dropdown', name: 'Theme'              },
	language:              { type: 'dropdown', name: 'Language'           },
}

const FIELDS_INSTALL_TYPE = {
	install_type:          { type: 'dropdown', name: 'Mode'               },
}

const FIELDS_BINARY_OPTIONS = {
	selected_theme:        { type: 'dropdown', name: 'Theme'              },
	rrdtool_version:       { type: 'dropdown', name: 'RRDVersion'         },
}

const FIELDS_BINARY_LOCATIONS = {
	paths:                 { type: 'textbox',  prefix: 'path_'            },
	settings_sendmail_path:{ type: 'textbox',  name: 'settings_sendmail_path' },
}

const FIELDS_PROFILE = {
	default_profile:       { type: 'dropdown', name: 'Profile'            },
	cron_interval:         { type: 'textbox',  name: 'CronInterval'       },
	automation_mode:       { type: 'checkbox', name: 'AutomationMode'     },
	automation_range:      { type: 'textbox',  name: 'AutomationRange'    },
	automation_override:   { type: 'checkbox', name: 'AutomationOverride' },
}

const FIELDS_SNMP = {
	snmp_version:          { type: 'dropdown', name: 'SnmpVersion'        },
	snmp_community:        { type: 'textbox',  name: 'SnmpCommunity'      },
	snmp_security_level:   { type: 'dropdown', name: 'SnmpSecurityLevel'  },
	snmp_username:         { type: 'textbox',  name: 'SnmpUsername'       },
	snmp_auth_protocol:    { type: 'dropdown', name: 'SnmpAuthProtocol'   },
	snmp_password:         { type: 'textbox',  name: 'SnmpPassword'       },
	snmp_priv_protocol:    { type: 'dropdown', name: 'SnmpPrivProtocol'   },
	snmp_priv_passphrase:  { type: 'textbox',  name: 'SnmpPrivPassphrase' },
	snmp_context:          { type: 'textbox',  name: 'SnmpContext'        },
	snmp_engine_id:        { type: 'textbox',  name: 'SnmpEngineId'       },
	snmp_port:             { type: 'textbox',  name: 'SnmpPort'           },
	snmp_timeout:          { type: 'textbox',  name: 'SnmpTimeout'        },
	max_oids:              { type: 'textbox',  name: 'SnmpMaxOids'        },
	snmp_retries:          { type: 'textbox',  name: 'SnmpRetries'        },
};

const FIELDS_CHECK_TABLES = {
	tables:                { type: 'checkbox'                             },
}

const FIELDS_TEMPLATES = {
	templates:             { type: 'checkbox'                             },
}

function setSNMPOverride() {
	element = $('#automation_override');
	if (element != null && element.length > 0) {
		enabled = ($(element[0]).is(':checked'));
		toggleSection('#automation_snmp_options', enabled);
	}
}

function setButtonData(buttonName, buttonData) {
	button = $('#button'+buttonName);
	if (button != null) {
		button.button();
		button.data('buttonData', buttonData);
		if (buttonData != null) {
			buttonCheck = button.data('buttonData');
			if (buttonData.Enabled) {
				button.button('enable');
			} else {
				button.button('disable');
			}

			if (buttonData.Visible) {
				button.show();
			} else {
				button.hide();
			}
			button.val(buttonData.Text);
		}

	}
}

function setFieldData(fields, fieldData) {
	if (fieldData === null) {
		return;
	}

	for (var fieldId in fields) {
		if (!fields.hasOwnProperty(fieldId)) {
			continue;
		}

		var field = fields[fieldId];

		if (field.type == "checkbox") {
			for (var propName in fieldData) {
				if (fieldData.hasOwnProperty(propName)) {
					propValue = fieldData[propName];
					if (propValue !== undefined) {
						element = $('#' + propName);
						if (element != null && element.length > 0) {
							element.prop('checked', propValue != 0);
						}
					}
				}
			}
		} else if (fieldData[field.name]) {
			element = $("#" + fieldId);
			if (element != null && element.length > 0) {
				if (field.type == 'textbox') {
					element[0].value = fieldData[field.name];
				} else if (field.type == 'dropdown' ) {
					element[0].value = fieldData[field.name];
				}
			}
		}
	};
}

function getFieldData(fields, fieldData) {
	if (fieldData === null) {
		return;
	}

	for (var fieldId in fields) {
		if (!fields.hasOwnProperty(fieldId)) {
			continue;
		}

		var field = fields[fieldId];

		if (field.type == 'checkbox') {
			if (field.name) {
				fieldData[field.name] = $("#" + fieldId).is(':checked');
			} else {
				prefix="chk_";
				if (field.prefix) {
					prefix = field.prefix;
				}

				$('input[name^="' + prefix + '"]').each(function(index,element) {
					fieldData[element.id] =$(element).is(':checked');
				});
			}
		} else {
			if (field.prefix) {
				$('input[name^="' + field.prefix + '"]').each(function(index, element) {
					fieldData[element.id] = element.value;
				});
			} else {
				element = $('#' + fieldId);
				if (element != null && element.length > 0) {
					if (field.type == 'textbox') {
						fieldData[field.name] = element[0].value;
					} else if (field.type == 'dropdown') {
						fieldData[field.name] = element[0].value;
					}
				}
			}
		}
	};
}

function getDefaultInstallData() {
	return { Step: STEP_WELCOME, Eula: 0 };
}

function toggleHeader(key, initial = null) {
	if (key != null) {
		header = $(key);
		if (header != null && header.length > 0) {
			firstSibling = header.next();

			if (initial != null) {
				firstSibling.hide();
			} else {
				if (firstSibling.is(':visible')) {
					firstSibling.slideUp();
				} else {
					firstSibling.slideDown();
				}
			}
		}
	}
}

function toggleSection(key, initial = null) {
	if (key != null) {
		header = $(key);
		if (header != null && header.length > 0) {

			if (initial == null) {
				initial = !header.visible;
			}

			firstSibling = header.next();
			if (!initial) {
				firstSibling.hide();
				header.hide();
			} else {
				header.show();
				firstSibling.show();
			}
		}
	}
}

function disableButton(buttonName) {
	button = $('#button'+buttonName);
	if (button != null) {
		button.button();
		button.button('disable');
	}
}

function collapseHeadings(headingStates) {
	for (var key in headingStates) {
		// skip loop if the property is from prototype
		if (!headingStates.hasOwnProperty(key)) continue;

		var enabled = headingStates[key];
		var element = $('#' + key);
		if (element != null && element.length > 0) {
			fa_icon = 'fa fa-exclamation-triangle';
			if (enabled == DB_STATUS_ERROR) {
				fa_icon = 'fa fa-thumbs-down cactiInstallSqlFailure';
			} else if (enabled == DB_STATUS_WARNING) {
				fa_icon = 'fa fa-exclamation-triangle cactiInstallSqlWarning';
			} else if (enabled == DB_STATUS_SUCCESS) {
				fa_icon = 'fa fa-thumbs-up cactiInstallSqlSuccess';
				toggleHeader(element, false);
			} else if (enabled) {
				fa_icon = 'fa fa-check-circle cactiInstallSqlSkipped';
				toggleHeader(element, false);
			}

			element.append('<div class="cactiInstallValid"><i class="' + fa_icon + '"></i></div>');

			element.click(function(e) {
				toggleHeader(e.currentTarget);
			});
		} else {
			window.alert('missing section "' + key + '"');
		}
	}
}

function hideHeadings(headingStates) {
	for (var key in headingStates) {
		// skip loop if the property is from prototype
		if (!headingStates.hasOwnProperty(key)) {
			continue;
		}

		var enabled = headingStates[key];
		var element = $('#' + key);
		if (element != null && element.length > 0) {
			if (!enabled) {
				element.hide();
				toggleHeader(element, true);
			} else {
				element.show();
				toggleHeader(element, false);
			}
		} else {
			window.alert('missing section "' + key + '"');
		}
	}
}

function processStepWelcome(StepData) {
	setFieldData(FIELDS_WELCOME, StepData);

//	if (StepData.Eula == 1) {
//		$('#accept').prop('checked',true);
//	}

	if (StepData.Theme != 'classic') {
		$('select#theme').selectmenu({
			change: function() {
				document.location = location.pathname + '?theme='+$('#theme').val();
			}
		});

		$.widget( "custom.iconselectmenu", $.ui.selectmenu, {
			_renderItem: function( ul, item ) {
				var li = $( "<li>" ), wrapper = $( "<div>", { text: item.label } );
				if ( item.disabled ) {
					li.addClass( "ui-state-disabled" );
				}

				$( "<span>", {
					style: item.element.attr( "data-style" ),
					"class": "flag-icon flag-icon-squared " + item.element.attr( "data-class" )
				}).appendTo( wrapper );

				return li.append( wrapper ).appendTo( ul );
			}
		});

		$("select#language").selectmenu('destroy').iconselectmenu({
			change: function() {
				document.location = location.pathname + '?language='+$('#language').val();
			}
		}).iconselectmenu( "menuWidget" ).addClass( "ui-menu-icons customicons" );
	} else {
		$('#theme').change(function() {
			document.location = location.pathname + '?theme='+$('#theme').val();
		});
		$('#language').change(function() {
			document.location = location.pathname + '?language='+$('#language').val();
		});
	}

	if ($('#accept').length) {
		$('#accept').click(function() {
			setAddressBar(StepData, true);
			if ($(this).is(':checked')) {
				$('#buttonNext').button('enable');
			} else {
				$('#buttonNext').button('disable');
			}
		});

		if ($('#accept').is(':checked')) {
			$('#buttonNext').button('enable');
		} else {
			$('#buttonNext').button('disable');
		}
	}
}

function processStepCheckDependencies(StepData) {
	collapseHeadings(StepData.Sections);
}

function processStepInstallType(StepData) {
	var sections = StepData.Sections;
	hideHeadings(sections);

	$('.cactiInstallSectionTitle').each(function() {
		if ($(this).is(':visible')) {
			$(this).next().show();
		}
	});

	if (sections.connection_remote) {
		if (sections.error_file || sections.error_poller) {
			$('#buttonTest').button('disable');
		}
	}

	if (StepData.Theme != 'classic') {
		$('select#install_type').selectmenu({
			change: function() {
				performStep(3);
			}
		});
	} else {
		$('#install_type').change(function() {
			performStep(3);
		});
	}
}

function processStepPermissionCheck(StepData) {
	collapseHeadings(StepData.Sections);
}

function processStepBinaryLocations(StepData) {
	setFieldData(FIELDS_BINARY_OPTIONS, StepData);
	setFieldData(FIELDS_BINARY_LOCATIONS, StepData);
}

function processStepProfileAndAutomation(StepData) {
	setFieldData(FIELDS_PROFILE, StepData);
	setFieldData(FIELDS_SNMP, StepData);

	setSNMP();
	applySkin();

	element = $('#automation_override');
	if (element != null && element.length > 0) {
		element.change(function() {
			setSNMPOverride();
		});
	}

	setSNMPOverride();
}

function processStepTemplateInstall(StepData) {
	var templates = StepData.Templates;
	if (templates.all) {
		element = $('#selectall');
		if (element != null && element.length > 0) {
			element.click();
		}
	} else {
		setFieldData(FIELDS_TEMPLATES, StepData.Templates);
	}

}

function processStepCheckTables(StepData) {
	var tables = StepData.Tables;
	if (tables.all) {
		element = $('#selectall');
		if (element != null && element.length > 0) {
			element.click();
		}
	} else {
		setFieldData(FIELDS_CHECK_TABLES, StepData.Tables);
	}

}

function processStepInstallConfirm(StepData) {
	if ($('#confirm').length) {
		$('#confirm').click(function() {
			if ($(this).is(':checked')) {
				$('#buttonNext').button('enable');
			} else {
				$('#buttonNext').button('disable');
			}
		});

		if ($('#confirm').is(':checked')) {
			$('#buttonNext').button('enable');
		} else {
			$('#buttonNext').button('disable');
		}
	}
}

function processStepInstallRefresh() {
	performStep(STEP_INSTALL);
}

function processStepInstallStatus(current, total) {
	return '';
}

function processStepInstall(StepData) {
	progress(0.0, 1.0, $('#cactiInstallProgressCountdown'), processStepInstallRefresh, processStepInstallStatus);
	setProgressBar(StepData.Current, StepData.Total, $('#cactiInstallProgressBar'), 0.0);
}

function processStepComplete(Step, StepData) {
	if (StepData !== null) {
		collapseHeadings(StepData.Sections);
	}
}

function setProgressBar(current, total, element, updatetime, fnStatus) {
	var progressBarWidth = element.width() * (current / total);
	if (fnStatus != null) {
		status = fnStatus(current, total);
	} else {
		status = (current * 100) / total + '&nbsp;%';
	}
	element.find('div').animate({ width: progressBarWidth }, updatetime).html(status);
}

function progress(timeleft, timetotal, $element, fnComplete, fnStatus) {
	setProgressBar(timetotal, timetotal, $element, 0, fnStatus);
	setProgressBar(timeleft, timetotal, $element, 1000, fnStatus);
	setTimeout(function() {
		fnComplete();
	}, 1000);
}

function prepareInstallData(installStep) {
	installData = $('#installData').data('installData');
	if (typeof installData == 'undefined' || installData == null) {
		installData = getDefaultInstallData();
	}

	newData = getDefaultInstallData();

	props = [ 'Step' , 'Eula' ];
	for (i = 0; i < props.length; i++) {
		propName = props[i];
		if (installData.hasOwnProperty(propName)) {
			newData[propName] = installData[propName];
		}
	}

	step = installData.Step;
	if (step == STEP_WELCOME) prepareStepWelcome(newData);

	if (typeof installStep != 'undefined') {
		if (step == STEP_INSTALL_TYPE) prepareStepInstallType(newData);
		else if (step == STEP_BINARY_LOCATIONS) prepareStepBinaryLocations(newData);
		else if (step == STEP_PROFILE_AND_AUTOMATION) prepareStepProfileAndAutomation(newData);
		else if (step == STEP_TEMPLATE_INSTALL) prepareStepTemplateInstall(newData);
		else if (step == STEP_CHECK_TABLES) prepareStepCheckTables(newData);

		newData.Step = installStep;
	}

	return JSON.stringify(newData);
}

function prepareStepWelcome(installData) {
	getFieldData(FIELDS_WELCOME, installData);
}

function prepareStepInstallType(installData) {
	getFieldData(FIELDS_INSTALL_TYPE, installData);
}

function prepareStepBinaryLocations(installData) {
	installData.Paths = {};

	getFieldData(FIELDS_BINARY_OPTIONS, installData);
	getFieldData(FIELDS_BINARY_LOCATIONS, installData.Paths);
}

function prepareStepProfileAndAutomation(installData) {
	installData.SnmpOptions = {};

	getFieldData(FIELDS_PROFILE, installData);
	getFieldData(FIELDS_SNMP, installData.SnmpOptions);
}

function prepareStepCheckTables(installData) {
	installData.Tables = {}

	getFieldData(FIELDS_CHECK_TABLES, installData.Tables);
}

function prepareStepTemplateInstall(installData) {
	installData.Templates = {}

	getFieldData(FIELDS_TEMPLATES, installData.Templates);
}

function setAddressBar(data, replace) {
	if (replace) {
		window.history.replaceState('' , 'Cacti Installation - Step ' + data.Step, 'install.php?data=' + prepareInstallData());
	} else {
		window.history.pushState('' , 'Cacti Installation - Step ' + data.Step, 'install.php?data=' + prepareInstallData());
	}
}

function performStep(installStep) {
	$.ajaxQ.abortAll();

	installData = prepareInstallData(installStep);
	url = 'step_json.php?data=' + installData;

	$.get(url)
		.done(function(data) {
			checkForLogout(data);

			$('#installData').data('installData', data);

			setAddressBar(data, false);

			$('#installContent').empty().hide();
			$('div[class^="ui-"]').remove();
			$('#installContent').html(data.Html);
			$('#installContent').show();

			if (typeof $('#installData').data('debug') != 'undefined') {
				debugData = data;
				debugData.Html = '';
				debug = $('#installDebug');
				debug.empty();
				debug.html('<h5 style="border: 1px dashed grey">' + JSON.stringify(debugData) + '</h5>');
 			}

			setButtonData('Previous',data.Prev);
			setButtonData('Next',data.Next);
			setButtonData('Test',data.Test);

			$('buttonTest').button('enable');
			$('buttonTest').val(data);
			$('buttonTest').show();

			$('input[type=\"text\"], input[type=\"password\"], input[type=\"checkbox\"], textarea').not('image').addClass('ui-state-default ui-corner-all');
			if (data.Theme != 'classic') {
				$('select').selectmenu();
			}

			if (data.Step == STEP_WELCOME) {
				processStepWelcome(data.StepData);
			} else if (data.Step == STEP_CHECK_DEPENDENCIES) {
				processStepCheckDependencies(data.StepData);
			} else if (data.Step == STEP_INSTALL_TYPE) {
				processStepInstallType(data.StepData);
			} else if (data.Step == STEP_PERMISSION_CHECK) {
				processStepPermissionCheck(data.StepData);
			} else if (data.Step == STEP_BINARY_LOCATIONS) {
				processStepBinaryLocations(data.StepData);
			} else if (data.Step == STEP_PROFILE_AND_AUTOMATION) {
				processStepProfileAndAutomation(data.StepData);
			} else if (data.Step == STEP_TEMPLATE_INSTALL) {
				processStepTemplateInstall(data.StepData);
			} else if (data.Step == STEP_CHECK_TABLES) {
				processStepCheckTables(data.StepData);
			} else if (data.Step == STEP_INSTALL_CONFIRM) {
				processStepInstallConfirm(data.StepData);
			} else if (data.Step == STEP_INSTALL) {
				processStepInstall(data.StepData);
			} else if (data.Step >= STEP_COMPLETE) {
				processStepComplete(data.Step, data.StepData);
			}

			$(function () {
				var focusedElement;
				$(document).on('focus', 'input', function () {
					if (focusedElement == this) {
						// already focused, return so user can now place cursor
						// at specific point in input.
						return;
					}
					focusedElement = this;

					// select all text in any field on focus for easy re-entry.
					// delay sightly to allow focus to "stick" before selecting.
					setTimeout(function () { focusedElement.select(); }, 50);
				});

				/* Focus on first error */
				var errors = data.Errors;
				for (var propIndex in errors) {
					if (errors.hasOwnProperty(propIndex)) {
						propArray = errors[propIndex];
						if (propArray) {
							for (var propName in propArray) {
								if (propArray.hasOwnProperty(propName)) {
									propValue = propArray[propName];
									element = $("#" + propName);
									if (element != null && element.length > 0) {
										element.focus();
										break;
									}
								}
							}
						}
					}
				}
			});
		})
		.fail(function(data) {
			getPresentHTTPError(data);
		}
	);
}

function createItemSelectMenu() {
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

install_step = 0;

$(function() {
	disableButton('Previous');
	disableButton('Next');
	disableButton('Test');

	installData = $.urlParam('data');
	if (installData != null && installData != 0) {
		try {
			installData = JSON.parse(installData);
		} catch (ex) {
			installData = getDefaultInstallData();
		}
	}
	$('#installData').data('installData', installData);

	installDebug = $.urlParam('debug');
	if (installDebug != null && installDebug != 0) {
		$('#installData').data('debug', true);
	}

	$('.installButton').click(function(e) {
		button = $(e.currentTarget);
		if (button != null) {
			buttonData = button.data('buttonData');
			if (buttonData != null) {
				if (buttonData.Step == -1) {
					window.location.assign('../');
				} else if (buttonData.Step == -2) {
					var win = window.open('https://forums.cacti.net/');
					win.focus;
				} else if (buttonData.Step == -3) {
					var win = window.open('https://github.com/cacti/cacti/issues/');
					win.focus;
				} else {
					performStep(buttonData.Step);
				}
				return;
			}
		}
		getPresentHTTPError('');
	});

	setTimeout(function() {
		performStep();
	}, 1000);
});
