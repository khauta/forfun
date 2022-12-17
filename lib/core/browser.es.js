import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import dotty from 'dotty';
import _typeof from 'babel-runtime/helpers/typeof';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import ExtendableError from 'es6-error';
import shajs from 'sha.js';
import promiseFinally from 'promise.prototype.finally';
import _extends from 'babel-runtime/helpers/extends';
import NodeRSA from 'node-rsa';
import xml2js from 'xml2js';
import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import moment from 'moment';

var ApiConfig = function () {
  /**
   * @typedef ApiConfigOptions
   * @property {function} [map]
   * @property {function} [converter]
   */

  /**
   * @param {string} url
   * @param {ApiConfigOptions} options
   */
  function ApiConfig(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ApiConfig);

    this.url = url;
    this.options = options;
  }

  _createClass(ApiConfig, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var data, processed, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return getAjaxData({ url: this.url });

              case 2:
                data = _context.sent;
                processed = data;

                if (!this.options.map) {
                  _context.next = 25;
                  break;
                }

                processed = {};
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 9;
                for (_iterator = Object.keys(data)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  key = _step.value;

                  processed[key] = this.options.map(data[key]);
                }
                _context.next = 17;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](9);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 17:
                _context.prev = 17;
                _context.prev = 18;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 20:
                _context.prev = 20;

                if (!_didIteratorError) {
                  _context.next = 23;
                  break;
                }

                throw _iteratorError;

              case 23:
                return _context.finish(20);

              case 24:
                return _context.finish(17);

              case 25:
                if (this.options.converter) {
                  processed = this.options.converter(processed);
                }
                return _context.abrupt('return', processed);

              case 27:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 13, 17, 25], [18,, 20, 24]]);
      }));

      function get() {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }]);

  return ApiConfig;
}();

// TODO: Add config checks and throw errors

var apiConfigs = {
  module: new ApiConfig('api/global/module-switch', { map: function map(item) {
      return item === '1';
    } }),
  sms: new ApiConfig('config/sms/config.xml', {
    converter: function converter(data) {
      var processed = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          if (key.toLowerCase() !== 'cbschannellist') {
            processed[key] = parseInt(data[key], 10);
          } else {
            processed[key] = data[key];
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return processed;
    }
  }),
  ussd: {
    prepaid: new ApiConfig('config/ussd/prepaidussd.xml'),
    postpaid: new ApiConfig('config/ussd/postpaidussd.xml')
  },
  enc: new ApiConfig('api/webserver/publickey', {
    converter: function converter(data) {
      return { publicKey: { n: data.encpubkeyn, e: data.encpubkeye } };
    }
  }),
  dialup: {
    connection: new ApiConfig('api/dialup/connection', {
      converter: function converter(data) {
        return {
          RoamAutoConnectEnable: data.RoamAutoConnectEnable === '1',
          MaxIdelTime: parseInt(data.MaxIdelTime, 10),
          ConnectMode: parseInt(data.ConnectMode, 10),
          MTU: parseInt(data.MTU, 10),
          auto_dial_switch: data.auto_dial_switch === '1',
          pdp_always_on: data.pdp_always_on === '1'
        };
      }
    }),
    profiles: new ApiConfig('api/dialup/profiles', {
      converter: function converter(data) {
        var profiles = [];
        // TODO: Make sure this doesn't break when there is more than one profile
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Object.keys(data.Profiles)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            var profile = data.Profiles[key];
            profiles.push({
              Index: parseInt(profile.Index, 10),
              IsValid: profile.IsValid === '1',
              Name: profile.Name,
              ApnIsStatic: profile.ApnIsStatic === '1',
              ApnName: profile.ApnName,
              DialupNum: profile.DialupNum,
              Username: profile.Username,
              Password: profile.Password,
              AuthMode: parseInt(profile.AuthMode, 10),
              IpIsStatic: profile.IpIsStatic === '1',
              IpAddress: profile.IpAddress,
              Ipv6Address: profile.Ipv6Address,
              DnsIsStatic: profile.DnsIsStatic === '1',
              PrimaryDns: profile.PrimaryDns,
              SecondaryDns: profile.SecondaryDns,
              PrimaryIpv6Dns: profile.PrimaryIpv6Dns,
              SecondaryIpv6Dns: profile.SecondaryIpv6Dns,
              ReadOnly: parseInt(profile.ReadOnly, 10),
              iptype: parseInt(profile.iptype, 10)
            });
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return {
          CurrentProfile: parseInt(data.CurrentProfile, 10),
          Profiles: profiles
        };
      }
    }),
    featureSwitch: new ApiConfig('api/dialup/dialup-feature-switch', {
      map: function map(item) {
        return item === '1';
      }
    }),
    connectMode: new ApiConfig('config/dialup/connectmode.xml', {
      converter: function converter(data) {
        return {
          ConnectMode: {
            Auto: data.ConnectMode.Auto === '1',
            Manual: data.ConnectMode.Manual === '1'
          },
          idle_time_enabled: parseInt(data.idle_time_enabled, 10)
        };
      }
    })
  }
};

/*
These were missing from ConfigModuleSwitch when testing:

'autoapn_enabled': g_feature.autoapn_enabled === '1',
'checklogin_enabled': g_feature.login === '1',
'ap_station_enabled': g_feature.ap_station_enabled === '1',
'voip_adcance_enable': voiceadvancesetting === '1',
*/

/**
 * @typedef ConfigModuleSwitch
 * @property {boolean} ussd_enabled
 * @property {boolean} bbou_enabled
 * @property {boolean} sms_enabled
 * @property {boolean} sdcard_enabled
 * @property {boolean} wifi_enabled
 * @property {boolean} statistic_enabled
 * @property {boolean} help_enabled
 * @property {boolean} stk_enabled
 * @property {boolean} pb_enabled
 * @property {boolean} dlna_enabled
 * @property {boolean} ota_enabled
 * @property {boolean} wifioffload_enabled
 * @property {boolean} cradle_enabled
 * @property {boolean} multssid_enable
 * @property {boolean} ipv6_enabled
 * @property {boolean} monthly_volume_enabled
 * @property {boolean} powersave_enabled
 * @property {boolean} sntp_enabled
 * @property {boolean} encrypt_enabled
 * @property {boolean} dataswitch_enabled
 * @property {boolean} ddns_enabled
 * @property {boolean} sambashare_enabled
 * @property {boolean} poweroff_enabled
 * @property {boolean} fw_macfilter_enabled
 * @property {boolean} ecomode_enabled
 * @property {boolean} zonetime_enabled
 * @property {boolean} diagnosis_enabled
 * @property {boolean} localupdate_enabled
 * @property {boolean} cbs_enabled
 * @property {boolean} voip_enabled
 * @property {boolean} qrcode_enabled
 * @property {boolean} charger_enbaled
 * @property {boolean} vpn_enabled
 * @property {boolean} cs_enable
 * @property {boolean} tr069_enabled
 * @property {boolean} antenna_enabled
 * @property {boolean} aclui_enabled
 * @property {boolean} static_route_enabled
 * @property {boolean} static_route6_enabled
 * @property {boolean} loginusername_enable
 */

/**
 * @typedef PublicKey
 * @property {string} n
 * @property {string} e
 */

/**
 * @typedef EncryptionConfig
 * @property {PublicKey} publicKey Public RSA keys
 */

// TODO: Investigate what cbschannellist contains in SmsConfig. It's probably an array
/**
 * @typedef SmsConfig
 * @property {any} cbschannellist
 * @property {number} cbsenable
 * @property {number} cdma_enabled
 * @property {number} enable
 * @property {number} getcontactenable
 * @property {number} import_enabled
 * @property {number} localmax
 * @property {number} maxphone
 * @property {number} pagesize
 * @property {number} session_sms_enabled
 * @property {number} sms_center_enabled
 * @property {number} sms_priority_enabled
 * @property {number} sms_validity_enabled
 * @property {number} smscharlang
 * @property {number} smscharmap
 * @property {number} smsfulltype
 * @property {number} url_enabled
 * @property {number} validity
 */

/**
 * @typedef UssdConfigMenuItem
 * @property {string} Name
 * @property {string} Command
 */

/**
 * @typedef UssdConfigMenu
 * @property {UssdConfigMenuItem[]} MenuItem
 */

/**
 * @typedef UssdConfigGeneral
 * @property {string} Action
 * @property {string} Description
 * @property {string} LimitText
 * @property {UssdConfigMenu} Menu
 * @property {string} Title
 */

/**
 * @typedef UssdConfig
 * @property {UssdConfigGeneral} General
 */

/**
 * @typedef DialupProfile
 * @property {number} Index 1
 * @property {boolean} IsValid 1
 * @property {string} Name PLAY
 * @property {boolean} ApnIsStatic 1
 * @property {string} ApnName internet
 * @property {string} DialupNum *99#
 * @property {string} Username
 * @property {string} Password
 * @property {number} AuthMode 2
 * @property {boolean} IpIsStatic 0
 * @property {string} IpAddress
 * @property {string} Ipv6Address
 * @property {boolean} DnsIsStatic 0
 * @property {string} PrimaryDns
 * @property {string} SecondaryDns
 * @property {string} PrimaryIpv6Dns
 * @property {string} SecondaryIpv6Dns
 * @property {number} ReadOnly 2
 * @property {number} iptype 2
 */

/**
 * @typedef DialupProfiles
 * @property {number} CurrentProfile
 * @property {DialupProfile[]} Profiles
 */

/**
 * @typedef DialupConnection
 * @property {boolean} RoamAutoConnectEnable
 * @property {number} MaxIdelTime e.g 600
 * @property {0|1|2} ConnectMode 0-auto, 1-manual, 2-combining on demand
 * @property {number} MTU e.g 1500, 1450
 * @property {boolean} auto_dial_switch
 * @property {boolean} pdp_always_on
 */

/**
 * @typedef DialupFeatureSwitch
 * @property {boolean} iptype_enabled
 * @property {boolean} auto_dial_enabled
 * @property {boolean} show_dns_setting
 */

/**
 * @typedef ConnectMode
 * @property {boolean} Auto
 * @property {boolean} Manual
 */

/**
 * @typedef ConnectModeConfig
 * @property {ConnectMode} ConnectMode
 * @property {number} idle_time_enabled
 */

var config = {
  username: null,
  password: null,
  url: null,
  parsedUrl: null,
  ussdWaitInterval: 1000,
  ussdTimeout: 20000,
  requestTimeout: 10000, // 10s
  api: {
    /** @type {ConfigModuleSwitch} */
    module: null,
    /** @type {EncryptionConfig} */
    encryption: {
      publicKey: null
    },
    /** @type {SmsConfig} */
    sms: null,
    ussd: {
      /** @type {UssdConfig} */
      prepaid: null,
      /** @type {UssdConfig} */
      postpaid: null
    },
    dialup: {
      /** @type {DialupConnection} */
      connection: null,
      /** @type {DialupProfiles} */
      profiles: null,
      /** @type {DialupFeatureSwitch} */
      featureSwitch: null,
      /** @type {ConnectModeConfig} */
      connectMode: null
    }
  },

  setUrl: function setUrl(_url) {
    this.url = _url;
    this.parsedUrl = parseRouterUrl(this.url);
  },
  setUsername: function setUsername(_username) {
    this.username = _username;
  },
  setPassword: function setPassword(_password) {
    this.password = _password;
  },
  getUsername: function getUsername() {
    return this.username;
  },
  getPassword: function getPassword() {
    return this.password;
  },
  getLoginDetails: function getLoginDetails() {
    return {
      username: this.username,
      password: this.password
    };
  },
  getUrl: function getUrl() {
    return this.url;
  },
  getParsedUrl: function getParsedUrl() {
    return this.parsedUrl;
  },
  setConfig: function setConfig(path, value) {
    dotty.put(this.api, path, value);
  },


  /**
   * @param {string} path The path of the config to retrieve. E.g. 'ussd.prepaid'
   * @param {boolean} fresh Set to true to refresh cached values
   * @return {Promise<any>}
   */
  getConfig: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(path) {
      var fresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!dotty.exists(this.api, path) || dotty.get(this.api, path) === null || fresh)) {
                _context2.next = 7;
                break;
              }

              _context2.t0 = this;
              _context2.t1 = path;
              _context2.next = 5;
              return dotty.get(apiConfigs, path).get();

            case 5:
              _context2.t2 = _context2.sent;

              _context2.t0.setConfig.call(_context2.t0, _context2.t1, _context2.t2);

            case 7:
              return _context2.abrupt('return', dotty.get(this.api, path));

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getConfig(_x3) {
      return _ref2.apply(this, arguments);
    }

    return getConfig;
  }(),


  /**
   * @return {Promise<ConfigModuleSwitch>}
   */
  getModuleSwitch: function getModuleSwitch() {
    return this.getConfig('module');
  },


  /**
   * @return {Promise<PublicKey>}
   */
  getPublicEncryptionKey: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.getConfig('enc');

            case 2:
              return _context3.abrupt('return', _context3.sent.publicKey);

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getPublicEncryptionKey() {
      return _ref3.apply(this, arguments);
    }

    return getPublicEncryptionKey;
  }(),


  /**
   * Get's SMS configuration
   * @return {Promise<SmsConfig>}
   */
  getSmsConfig: function getSmsConfig() {
    return this.getConfig('sms');
  },


  /**
   * Get's USSD configuration. Includes USSD commands.
   * @param {boolean} [postpaid=false] Whether to get the postpaid or prepaid config
   * @return {Promise<UssdConfig>}
   */
  getUssdConfig: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      var postpaid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var paidType;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              paidType = postpaid ? 'postpaid' : 'prepaid';
              _context4.next = 3;
              return this.getConfig('ussd.' + paidType);

            case 3:
              return _context4.abrupt('return', _context4.sent.USSD);

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getUssdConfig() {
      return _ref4.apply(this, arguments);
    }

    return getUssdConfig;
  }()
};

var RouterError = function (_ExtendableError) {
  _inherits(RouterError, _ExtendableError);

  function RouterError(code, message) {
    _classCallCheck(this, RouterError);

    var _this = _possibleConstructorReturn(this, (RouterError.__proto__ || Object.getPrototypeOf(RouterError)).call(this, typeof message !== 'undefined' ? message : code));

    _this.code = code;
    return _this;
  }

  _createClass(RouterError, [{
    key: 'toString',
    value: function toString() {
      return this.code + ': ' + this.message;
    }
  }]);

  return RouterError;
}(ExtendableError);

var RouterApiError = function (_RouterError) {
  _inherits(RouterApiError, _RouterError);

  function RouterApiError(code, message) {
    _classCallCheck(this, RouterApiError);

    return _possibleConstructorReturn(this, (RouterApiError.__proto__ || Object.getPrototypeOf(RouterApiError)).call(this, 'api_' + code, message));
  }

  return RouterApiError;
}(RouterError);

var RequestError = function (_RouterError2) {
  _inherits(RequestError, _RouterError2);

  function RequestError(code, message) {
    _classCallCheck(this, RequestError);

    return _possibleConstructorReturn(this, (RequestError.__proto__ || Object.getPrototypeOf(RequestError)).call(this, 'http_request_' + code, message));
  }

  return RequestError;
}(RouterError);

var apiErrorCodes = {
  '-1': 'default',
  '-2': 'no_device',
  '1': 'first_send',
  '100001': 'unknown',
  '100002': 'system_no_support',
  '100003': 'system_no_rights',
  '100004': 'system_busy',
  '100005': 'format_error',
  '100006': 'parameter_error',
  '100007': 'save_config_file_error',
  '100008': 'get_config_file_error',
  '101001': 'no_sim_card_or_invalid_sim_card',
  '101002': 'check_sim_card_pin_lock',
  '101003': 'check_sim_card_pun_lock',
  '101004': 'check_sim_card_can_unusable',
  '101005': 'enable_pin_failed',
  '101006': 'disable_pin_failed',
  '101007': 'unlock_pin_failed',
  '101008': 'disable_auto_pin_failed',
  '101009': 'enable_auto_pin_failed',
  '102001': 'get_net_type_failed',
  '102002': 'get_service_status_failed',
  '102003': 'get_roam_status_failed',
  '102004': 'get_connect_status_failed',
  '103001': 'device_at_execute_failed',
  '103002': 'device_pin_validate_failed',
  '103003': 'device_pin_modify_failed',
  '103004': 'device_puk_modify_failed',
  '103005': 'device_get_autorun_version_failed',
  '103006': 'device_get_api_version_failed',
  '103007': 'device_get_product_information_failed',
  '103008': 'device_sim_card_busy',
  '103009': 'device_sim_lock_input_error',
  '103010': 'device_not_support_remote_operate',
  '103011': 'device_puk_dead_lock',
  '103012': 'device_get_pc_assist_information_failed',
  '103013': 'device_set_log_information_level_failed',
  '103014': 'device_get_log_information_level_failed',
  '103015': 'device_compress_log_file_failed',
  '103016': 'device_restore_file_decrypt_failed',
  '103017': 'device_restore_file_version_match_failed',
  '103018': 'device_restore_file_failed',
  '103101': 'device_set_time_failed',
  '103102': 'compress_log_file_failed',
  '104001': 'dhcp_error',
  '106001': 'safe_error',
  '107720': 'dialup_get_connect_file_error',
  '107721': 'dialup_set_connect_file_error',
  '107722': 'dialup_dialup_management_parse_error',
  '107724': 'dialup_add_profile_error',
  '107725': 'dialup_modify_profile_error',
  '107726': 'dialup_set_default_profile_error',
  '107727': 'dialup_get_profile_list_error',
  '107728': 'dialup_get_auto_apn_match_error',
  '107729': 'dialup_set_auto_apn_match_error',
  '108001': 'login_username_wrong',
  '108002': 'login_password_wrong',
  '108003': 'login_already_login',
  '108004': 'login_modify_password_failed',
  '108005': 'login_too_many_users_logged_in',
  '108006': 'login_username_pwd_wrong',
  '108007': 'login_username_pwd_orerrun',
  '109001': 'language_get_failed',
  '109002': 'language_set_failed',
  '110001': 'online_update_server_not_accessed',
  '110002': 'online_update_already_booted',
  '110003': 'online_update_get_device_information_failed',
  '110004': 'online_update_get_local_group_component_information_failed',
  '110005': 'online_update_not_find_file_on_server',
  '110006': 'online_update_need_reconnect_server',
  '110007': 'online_update_cancel_downloading',
  '110008': 'online_update_same_file_list',
  '110009': 'online_update_connect_error',
  '110021': 'online_update_invalid_url_list',
  '110022': 'online_update_not_support_url_list',
  '110023': 'online_update_not_boot',
  '110024': 'online_update_low_battery',
  '11019': 'ussd_net_no_return',
  '111001': 'ussd_error',
  '111012': 'ussd_function_return_error',
  '111013': 'ussd_in_ussd_session',
  '111014': 'ussd_too_long_content',
  '111016': 'ussd_empty_command',
  '111017': 'ussd_coding_error',
  '111018': 'ussd_at_send_failed',
  '111019': 'ussd_processing',
  '111020': 'ussd_timeout',
  '111021': 'ussd_xml_special_character_transfer_failed',
  '111022': 'ussd_net_not_support_ussd',
  '112001': 'set_net_mode_and_band_when_dialup_failed',
  '112002': 'set_net_search_mode_when_dialup_failed',
  '112003': 'set_net_mode_and_band_failed',
  '112004': 'set_net_search_mode_failed',
  '112005': 'net_register_net_failed',
  '112006': 'net_net_connected_order_not_match',
  '112007': 'net_current_net_mode_not_support',
  '112008': 'net_sim_card_not_ready_status',
  '112009': 'net_memory_alloc_failed',
  '113017': 'sms_null_argument_or_illegal_argument',
  '113018': 'sms_system_busy',
  '113020': 'sms_query_sms_index_list_error',
  '113031': 'sms_set_sms_center_number_failed',
  '113036': 'sms_delete_sms_failed',
  '113047': 'sms_save_config_file_failed',
  '113053': 'sms_not_enough_space',
  '113054': 'sms_telephone_number_too_long',
  '114001': 'sd_file_exist',
  '114002': 'sd_directory_exist',
  '114004': 'sd_file_or_directory_not_exist',
  // TODO: Find out the correct code of this error
  // '114004': 'sd_is_operated_by_another_user',
  '114005': 'sd_file_name_too_long',
  '114006': 'sd_no_right',
  '114007': 'sd_file_is_uploading',
  '115001': 'pb_null_argument_or_illegal_argument',
  '115002': 'pb_overtime',
  '115003': 'pb_call_system_function_error',
  '115004': 'pb_write_file_error',
  '115005': 'pb_read_file_error',
  '115199': 'pb_local_telephone_full_error',
  '116001': 'stk_null_argument_or_illegal_argument',
  '116002': 'stk_overtime',
  '116003': 'stk_call_system_function_error',
  '116004': 'stk_write_file_error',
  '116005': 'stk_read_file_error',
  '117001': 'wifi_station_connect_ap_password_error',
  '117002': 'wifi_web_password_or_dhcp_overtime_error',
  '117003': 'wifi_pbc_connect_failed',
  '117004': 'wifi_station_connect_ap_wispr_password_error',
  '118001': 'cradle_get_current_connected_user_ip_failed',
  '118002': 'cradle_get_current_connected_user_mac_failed',
  '118003': 'cradle_set_mac_failed',
  '118004': 'cradle_get_wan_information_failed',
  '118005': 'cradle_coding_failed',
  '118006': 'cradle_update_profile_failed',
  '120001': 'voice_busy',
  '125001': 'wrong_token',
  '125002': 'wrong_session',
  '125003': 'wrong_session_token'
};

/**
 * @enum {string}
 */


var errors = {
  'http_request_error': ['connection'],
  'http_request_invalid_xml': ['connection'],
  'http_request_invalid_status': ['connection'],
  'http_request_timeout': ['connection'],
  'http_request_no_response': ['connection'],
  'xml_response_not_ok': [],
  'invalid_router_url': [],
  'ussd_timeout': ['ussd'],
  'ussd_cancelled': ['ussd'],
  'ussd_release_fail': ['ussd'],
  'ajax_no_tokens': ['ajax'],
  'sms_import_disabled': ['sms'],
  'sms_import_invalid_response': ['sms'],
  'sms_import_sim_empty': ['sms'],
  // TODO: Check if this ever clashes with RouterApiError
  'sms_not_enough_space': ['sms']
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = Object.values(apiErrorCodes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var error = _step.value;

    errors[error] = ['api'];
  }

  /**
   * @param {string} code
   * @return {string}
   */
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

function getRouterApiErrorName(code) {
  if (typeof code !== 'string') {
    throw new Error('expected router API error code to be of type string, got ' + (typeof code === 'undefined' ? 'undefined' : _typeof(code)) + ' instead.');
  }
  return apiErrorCodes[code];
}

/**
 * Throws a RouterApiError using a code and or message.
 * @param {*} retCode The error code of the API error
 * @param {string} [retMessage=null] The error message, if any
 * @throws {RouterApiError}
 */
function throwApiError(retCode) {
  var retMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var errorName = getRouterApiErrorName(retCode);
  var code = errorName ? errorName.toLowerCase() : retCode;
  var message = code;
  if (retMessage) message += ' : ' + retMessage;
  throw new RouterApiError(code, message);
}

function isErrorInCategory(errorCode, category) {
  return errors[errorCode].includes(category);
}

/**
 *
 * @param {string} url
 * @return {URL}
 */
function parseRouterUrl(url) {
  var parsedUrl = null;
  try {
    parsedUrl = new URL(url);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new RouterError('invalid_router_url', 'Invalid router page url: ' + url);
    } else {
      throw e;
    }
  }
  return parsedUrl;
}

/**
 *
 * @param {string} str
 * @return {string}
 */
function base64encode(str) {
  return btoa(str);
}

/**
 * A promise based queue
 */
var Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this.list = [];
  }
  /**
   * Runs a particular item in the queue
   * @param {number} idx
   */


  _createClass(Queue, [{
    key: '_runItem',
    value: function _runItem(idx) {
      var _this = this;

      promiseFinally(this.list[idx](), function () {
        _this._onComplete();
      });
    }
    /**
     * Called when a promise in the queue is complete
     */

  }, {
    key: '_onComplete',
    value: function _onComplete() {
      // Remove the completed item from the queue
      if (this.list.length > 0) {
        this.list.splice(0, 1);
      }
      // If there are is another item in the queue, run it
      if (this.list.length > 0) {
        this._runItem(0);
      }
    }
    /**
     * Adds a new promise to the queue
     * @param {function} func A function which returns a promise
     */

  }, {
    key: 'add',
    value: function add(func) {
      this.list.push(func);
      if (this.list.length === 1) {
        this._runItem(0);
      }
    }
  }]);

  return Queue;
}();

/**
 * Promise version of setTimeout
 * @param {number} t
 * @return {Promise}
 */
function delay(t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}

/**
 * Sends a request for the router's global config
 * to determine if there is a connection
 * @param {string} [routerUrl='']
 * @return {Promise}
 */
function ping() {
  var routerUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var parsedUrl = void 0;
  if (routerUrl) {
    parsedUrl = parseRouterUrl(routerUrl);
  } else {
    parsedUrl = config.getParsedUrl();
  }
  return ping$1(parsedUrl.origin);
}

function sha256(str) {
  return shajs('sha256').update(str).digest('hex');
}

/**
 * Converts an XML string to JSON
 * @param {string} str
 * @returns {Promise<Object>}
 */
var parseXml = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(str) {
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', new Promise(function (resolve, reject) {
              xmlParser.parseString(str, function (err, result) {
                if (err) {
                  reject(err);
                }
                resolve(result);
              });
            }));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function parseXml(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 *
 * @param {xmlRequestOptions} options
 * @return {Promise<any>}
 */


var jar = new CookieJar();

axiosCookieJarSupport(axios);

/**
 * @typedef requestOptions
 * @property {string} url
 * @property {string} [method]
 * @property {object} [data]
 * @property {Object.<string, string>} [headers]
 * @property {string} [accepts]
 * @property {string} [responseType]
 */

/**
 *
 * @param {requestOptions} options
 * @return {Promise<import('axios').AxiosResponse>}
 */
var request = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(options) {
    var response, requestErrorCode, requestErrorMessage, axiosErrorCode;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = Object.assign({
              method: 'GET'
            }, options);
            if (options.accepts) {
              options.headers = Object.assign({
                'Accept': options.accepts
              }, options.headers);
            }

            _context.prev = 2;
            _context.next = 5;
            return axios(_extends({
              withCredentials: true,
              jar: jar,
              timeout: config.requestTimeout,
              validateStatus: function validateStatus(status) {
                return status >= 200 && status < 400;
              }
            }, options));

          case 5:
            response = _context.sent;
            return _context.abrupt('return', response);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](2);
            requestErrorCode = '';
            requestErrorMessage = '';

            if (_context.t0.response) {
              if (_context.t0.response.status === 408 || _context.t0.code === 'ECONNABORTED') {
                requestErrorCode = 'timeout';
                requestErrorMessage = 'HTTP request timed out.';
              } else {
                requestErrorCode = 'invalid_status';
                requestErrorMessage = 'HTTP request response status invalid; ' + _context.t0.response.status;
              }
            } else if (_context.t0.request) {
              requestErrorCode = 'no_response';
              requestErrorMessage = 'HTTP request was made but no response was received.';
            } else {
              requestErrorCode = 'error';
              requestErrorMessage = 'Unknown HTTP request error; ' + _context.t0.message;
            }
            axiosErrorCode = '';

            if (_context.t0.code) {
              requestErrorMessage += '; Error code: ' + axiosErrorCode + '.';
            }
            throw new RequestError(requestErrorCode, requestErrorMessage);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 9]]);
  }));

  return function request(_x) {
    return _ref.apply(this, arguments);
  };
}();

var basicRequest = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(url) {
    var _ref3, data;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return request({ url: url });

          case 2:
            _ref3 = _context2.sent;
            data = _ref3.data;
            return _context2.abrupt('return', data);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function basicRequest(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @typedef xmlRequestOptions
 * @property {string} url
 * @property {string} [method]
 * @property {object} [data]
 * @property {Object.<string, string>} [headers]
 */

var xmlParser = new xml2js.Parser({ explicitArray: false });var xmlRequest = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(options) {
    var response, data;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return request(_extends({
              accepts: 'application/xml'
            }, options));

          case 2:
            response = _context4.sent;
            _context4.prev = 3;
            _context4.next = 6;
            return parseXml(response.data);

          case 6:
            data = _context4.sent;
            return _context4.abrupt('return', { data: data, headers: response.headers });

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4['catch'](3);
            throw new RequestError('invalid_xml', _context4.t0);

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[3, 10]]);
  }));

  return function xmlRequest(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Checks if an ajax return is valid by checking if the response is 'ok'
 * @private
 * @param   {object}  ret The AJAX return
 * @return {boolean} if the response is ok
 */
function isAjaxReturnOk(ret) {
  return typeof ret === 'string' && ret.toLowerCase() === 'ok';
}

/**
 *
 * @param {any} ret
 * @param {boolean} responseMustBeOk
 * @return {Promise<any>}
 */
var processXmlResponse = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(ret) {
    var responseMustBeOk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var root, rootValue;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            root = Object.keys(ret)[0];
            rootValue = ret[root];

            if (!(root !== 'error')) {
              _context5.next = 14;
              break;
            }

            if (!responseMustBeOk) {
              _context5.next = 11;
              break;
            }

            if (!isAjaxReturnOk(rootValue)) {
              _context5.next = 8;
              break;
            }

            return _context5.abrupt('return', rootValue);

          case 8:
            throw new RouterError('xml_response_not_ok', ret);

          case 9:
            _context5.next = 12;
            break;

          case 11:
            return _context5.abrupt('return', rootValue);

          case 12:
            _context5.next = 15;
            break;

          case 14:
            throwApiError(rootValue.code, rootValue.message);

          case 15:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function processXmlResponse(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var doRSAEncrypt = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(str) {
    var publicKey, key;
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(str === '')) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt('return', '');

          case 2:
            _context6.next = 4;
            return config.getPublicEncryptionKey();

          case 4:
            publicKey = _context6.sent;
            key = new NodeRSA();

            key.importKey({
              n: new Buffer(publicKey.n),
              e: parseInt(publicKey.e, 16)
            }, 'components-public');
            return _context6.abrupt('return', key.encrypt(str, 'hex'));

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function doRSAEncrypt(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

var xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: false }
});

/**
 *
 * @param {object} obj
 * @return {string}
 */
function objectToXml(obj) {
  return xmlBuilder.buildObject(obj);
}

/**
 * Gets a page
 * @param {string} url
 * @return {Promise<Document>}
 */
var getPage = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(url) {
    var _ref2, data;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return request({
              url: url,
              responseType: 'document'
            });

          case 2:
            _ref2 = _context.sent;
            data = _ref2.data;
            return _context.abrupt('return', data);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getPage(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Gets verification tokens required for making admin requests and logging in
 * @param {string} url
 * @return {Promise<string[]>}
 */


var getTokensFromPage = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(url) {
    var doc, meta, requestVerificationTokens, i;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getPage(url);

          case 2:
            doc = _context2.sent;
            meta = doc.querySelectorAll('meta[name=csrf_token]');
            requestVerificationTokens = [];

            for (i = 0; i < meta.length; i++) {
              requestVerificationTokens.push(meta[i].content);
            }
            return _context2.abrupt('return', requestVerificationTokens);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getTokensFromPage(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Gets verification tokens required for making admin requests and logging in
 * @return {Promise<string[]>}
 */
var getRequestVerificationTokens = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var homeUrl, tokens, data;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            homeUrl = config.getParsedUrl().origin + '/' + 'html/home.html';
            _context2.next = 3;
            return getTokensFromPage(homeUrl);

          case 3:
            tokens = _context2.sent;

            if (!(tokens.length > 0)) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt('return', tokens);

          case 8:
            _context2.next = 10;
            return getAjaxData({ url: 'api/webserver/token' });

          case 10:
            data = _context2.sent;
            return _context2.abrupt('return', [data.token]);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getRequestVerificationTokens() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @typedef ResponseProcessorOptions
 * @property {function} [map]
 * @property {function} [converter]
 */

/**
 * Applies common conversions to AJAX responses
 * @param {object} response
 * @param {ResponseProcessorOptions} options
 * @return {object}
 */
function convertResponse(response, options) {
  var processed = response;
  if (options.map) {
    processed = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(response)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        processed[key] = options.map(response[key]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  if (options.converter) {
    processed = options.converter(processed);
  }
  return processed;
}

/**
 * @typedef GetAjaxDataOptions
 * @property {string} url The url to get ajax data from
 * @property {boolean} [responseMustBeOk]
 * @property {string} [routerUrl] The url of the router. E.g. http://192.168.8.1
 * @property {function} [converter]
 * @property {function} [map]
 */

/**
 *
 * @param {GetAjaxDataOptions} options
 * @return {Promise<any>}
 */
var getAjaxData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(options) {
    var parsedUrl, _tokens, headers, ret, processed;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parsedUrl = void 0;

            if (options.routerUrl) {
              parsedUrl = parseRouterUrl(options.routerUrl);
            } else {
              parsedUrl = config.getParsedUrl();
            }
            _context.next = 4;
            return getTokens();

          case 4:
            _tokens = _context.sent;
            headers = {};

            if (_tokens.length > 0) {
              headers['__RequestVerificationToken'] = _tokens[0];
            }
            _context.next = 9;
            return xmlRequest({
              url: parsedUrl.origin + '/' + options.url,
              headers: headers
            });

          case 9:
            ret = _context.sent;
            _context.prev = 10;
            _context.next = 13;
            return processXmlResponse(ret.data, options.responseMustBeOk);

          case 13:
            processed = _context.sent;
            return _context.abrupt('return', convertResponse(processed, options));

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](10);

            if (!(_context.t0 instanceof RouterError && _context.t0.code === 'api_wrong_token')) {
              _context.next = 25;
              break;
            }

            _context.next = 22;
            return refreshTokens();

          case 22:
            return _context.abrupt('return', getAjaxData(options));

          case 25:
            throw _context.t0;

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[10, 17]]);
  }));

  return function getAjaxData(_x) {
    return _ref.apply(this, arguments);
  };
}();

// TODO: Improve token storage
var tokens = null;

var refreshTokens = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var _tokens;

    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getRequestVerificationTokens();

          case 2:
            _tokens = _context3.sent;

            tokens = _tokens;

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function refreshTokens() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 *
 * @param {boolean} fresh Set to true to force getting new tokens instead of using cached ones
 * @return {Promise<string[]>}
 */
var getTokens = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
    var fresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(!tokens || fresh)) {
              _context4.next = 3;
              break;
            }

            _context4.next = 3;
            return refreshTokens();

          case 3:
            return _context4.abrupt('return', tokens);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getTokens() {
    return _ref4.apply(this, arguments);
  };
}();

function updateTokens(newTokens) {
  tokens = newTokens;
}

/**
 * Converts headers keys to lower case
 * @param {Object.<string, string>} headers
 * @return {Object.<string, string>}
 */
function headersToLowerCase(headers) {
  var lowerCaseHeaders = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(headers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var header = _step2.value;

      lowerCaseHeaders[header.toLowerCase()] = headers[header];
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return lowerCaseHeaders;
}

var ajaxQueue = new Queue();

/**
 * @typedef SaveAjaxDataOptions
 * @property {string} url The url to get ajax data from
 * @property {object} request The POST data to be sent as xml
 * @property {boolean} [responseMustBeOk]
 * @property {boolean} [enc] Whether the request should be encrypted
 * @property {boolean} [enp]
 * @property {function} [converter]
 * @property {function} [map]
 */

/**
 *
 * @param {SaveAjaxDataOptions} options
 * @return {Promise<any>}
 */
// TODO: Simplify this by splitting up
function saveAjaxData(options) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    ajaxQueue.add(_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
      var _tokens2, moduleSwitch, xmlString, headers, ret, processed, lowerCaseHeaders, token, token1, token2;

      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return getTokens();

            case 3:
              _tokens2 = _context5.sent;

              // get copy of tokens to work with
              _tokens2 = _tokens2.slice();
              _context5.next = 7;
              return config.getModuleSwitch();

            case 7:
              moduleSwitch = _context5.sent;
              xmlString = objectToXml({ request: options.request });
              headers = {};

              // TODO: Fix encryption

              if (!(options.enc && moduleSwitch.encrypt_enabled)) {
                _context5.next = 15;
                break;
              }

              headers['encrypt_transmit'] = 'encrypt_transmit';
              _context5.next = 14;
              return doRSAEncrypt(xmlString);

            case 14:
              xmlString = _context5.sent;

            case 15:

              // TODO: Add 'part_encrypt_transmit' header using data.enpstring

              if (_tokens2.length > 0) {
                headers['__RequestVerificationToken'] = _tokens2[0];
                _tokens2.splice(0, 1);
                updateTokens(_tokens2);
              }

              _context5.next = 18;
              return xmlRequest({
                url: config.getParsedUrl().origin + '/' + options.url,
                method: 'POST',
                data: xmlString,
                headers: headers
              });

            case 18:
              ret = _context5.sent;
              _context5.prev = 19;
              _context5.next = 22;
              return processXmlResponse(ret.data, options.responseMustBeOk);

            case 22:
              processed = _context5.sent;

              if (options.url === 'api/user/login' && _tokens2.length > 0) {
                // login success, empty token list
                _tokens2 = [];
                updateTokens(_tokens2);
              }
              resolve(convertResponse(processed, options));
              _context5.next = 36;
              break;

            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5['catch'](19);

              if (!(_context5.t0 instanceof RouterError && _context5.t0.code === 'api_wrong_token')) {
                _context5.next = 35;
                break;
              }

              _context5.next = 32;
              return refreshTokens();

            case 32:
              saveAjaxData(options).then(resolve, reject);
              _context5.next = 36;
              break;

            case 35:
              reject(_context5.t0);

            case 36:
              _context5.prev = 36;

              // get new tokens
              lowerCaseHeaders = headersToLowerCase(ret.headers);
              token = lowerCaseHeaders['__requestverificationtoken'];
              token1 = lowerCaseHeaders['__requestverificationtokenone'];
              token2 = lowerCaseHeaders['__requestverificationtokentwo'];

              if (token1) {
                _tokens2.push(token1);
                if (token2) {
                  _tokens2.push(token2);
                }
              } else if (token) {
                _tokens2.push(token);
              } else {
                reject(new RouterError('ajax_no_tokens', 'Can not get response token'));
              }
              updateTokens(_tokens2);
              return _context5.finish(36);

            case 44:
              _context5.next = 49;
              break;

            case 46:
              _context5.prev = 46;
              _context5.t1 = _context5['catch'](0);

              reject(_context5.t1);

            case 49:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this, [[0, 46], [19, 27, 36, 44]]);
    })));
  });
}

var ping$1 = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return basicRequest(url);

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function ping$$1() {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * @typedef StateLogin
 * @property {number} State
 * @property {string} Username
 * @property {number} password_type
 */

/**
 * @return {Promise<StateLogin>}
 */
var getLoginState = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var data;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getAjaxData({ url: 'api/user/state-login' });

          case 2:
            data = _context.sent;
            return _context.abrupt('return', {
              State: parseInt(data.State, 10),
              Username: data.Username,
              password_type: parseInt(data.password_type, 10)
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getLoginState() {
    return _ref.apply(this, arguments);
  };
}();

var isLoggedIn = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var ret;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getLoginState();

          case 2:
            ret = _context2.sent;

            if (!(ret.State === 0)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', true);

          case 7:
            return _context2.abrupt('return', false);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function isLoggedIn() {
    return _ref2.apply(this, arguments);
  };
}();

var login = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var tokens$$1, loginState, loginDetails, processedPassword;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getTokens(true);

          case 2:
            tokens$$1 = _context3.sent;
            _context3.next = 5;
            return getLoginState();

          case 5:
            loginState = _context3.sent;
            loginDetails = config.getLoginDetails();
            processedPassword = void 0;

            if (tokens$$1.length > 0 && loginState.password_type === 4) {
              processedPassword = base64encode(sha256(loginDetails.username + base64encode(sha256(loginDetails.password)) + tokens$$1[0]));
            } else {
              processedPassword = base64encode(loginDetails.password);
            }
            return _context3.abrupt('return', saveAjaxData({
              url: 'api/user/login',
              request: {
                Username: loginDetails.username,
                Password: processedPassword,
                password_type: loginState.password_type
              },
              responseMustBeOk: true,
              enc: false
            }));

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function login() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * @typedef FullSmsListOptions
 * @property {number} total
 * @property {FilterSmsListOption} [filter]
 */

/**
 *
 * @param {FullSmsListOptions} options
 * @param {SmsListOptions} smsListOptions
 * @param {Message[]} list
 * @param {number} perPage
 * @param {number} total
 * @param {number} [page=1]
 * @return {Promise<Message[]>}
 */
var getFullSmsListRecursive = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(options, smsListOptions, list, perPage, total) {
    var page = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    var currentList, processedList, done, remaining, dateFilteredList;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            smsListOptions.perPage = perPage;
            smsListOptions.page = page;
            _context3.next = 4;
            return getSmsList(smsListOptions);

          case 4:
            currentList = _context3.sent;

            page++;

            processedList = [];

            if (options.filter) {
              processedList = filterSmsList(options.filter, currentList);
            } else {
              processedList = currentList;
            }

            done = list.length;
            remaining = total - done;

            processedList = processedList.slice(0, remaining);

            list = list.concat(processedList);

            // If a minimum date is given and the order is descending
            // then we can be efficient and stop queries once the date is
            // larger than the minimum date

            if (!(options.filter && options.filter.minDate && smsListOptions.sortOrder === 'desc')) {
              _context3.next = 16;
              break;
            }

            dateFilteredList = filterSmsList({ minDate: options.filter.minDate }, processedList);
            // If the date filtered list does not match the list then
            // this is the last page we should check as anything later
            // will be older than the minimum date

            if (!(dateFilteredList.length !== processedList.length)) {
              _context3.next = 16;
              break;
            }

            return _context3.abrupt('return', list);

          case 16:
            if (!(list.length < total && currentList.length > 0)) {
              _context3.next = 20;
              break;
            }

            return _context3.abrupt('return', getFullSmsListRecursive(options, smsListOptions, list, perPage, total, page));

          case 20:
            return _context3.abrupt('return', list);

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getFullSmsListRecursive(_x4, _x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 *
 * @param {FullSmsListOptions} options
 * @param {SmsListOptions} [smsListOptions]
 * @return {Promise<Message[]>}
 */


/**
 * @enum {string}
 */
var types = {
  RECHARGE: 'recharge',
  DATA: 'data',
  DATA_PERCENT: 'data_percent',
  ACTIVATED: 'activated',
  DEPLETED: 'depleted',
  AD: 'ad'
};

/**
 * @enum {number}
 */
var boxTypes = {
  INBOX: 1,
  SENT: 2,
  DRAFT: 3,
  TRASH: 4,
  SIM_INBOX: 5,
  SIM_SENT: 6,
  SIM_DRAFT: 7,
  MIX_INBOX: 8,
  MIX_SENT: 9,
  MIX_DRAFT: 10
};

function arrayMatch(message, regExpMatch, mapFunc) {
  var data = message.match(regExpMatch);
  if (data) {
    return data.map(mapFunc);
  } else {
    return [];
  }
}
/**
 * @typedef SmsDataUsage
 * @property {number} amount
 * @property {string} unit
 */
/**
 * Get's data usage strings in the message
 * @param {string} message
 * @return {SmsDataUsage[]}
 */
function getDataUsage(message) {
  return arrayMatch(message, /(\d*)(\.*)(\d*)( *)mb/gi, function (element) {
    return {
      amount: parseFloat(element.replace(/( *)mb/i, '')),
      unit: 'MB'
    };
  });
}
function getExpiryDate(message) {
  return arrayMatch(message, /(\d+)-(\d+)-(\d+) (\d{2}):(\d{2}):(\d{2})/g, function (date) {
    return moment(date).valueOf();
  });
}
function getMoney(message) {
  return arrayMatch(message, /(\d*)(\.*)(\d*)( *)kwacha/gi, function (element) {
    return parseFloat(element.replace(/( *)kwacha/i, ''));
  });
}

function getPercent(message) {
  return arrayMatch(message, /\d+%/gi, function (element) {
    return parseFloat(element.replace(/%/, ''));
  });
}

/**
 *
 * @param {object} info
 * @param {string} message
 * @return {types}
 */
function getType(info, message) {
  var adPhrases = ['spaka', 'bonus', 'congratulations', 'songs', 'tunes', 'music', 'subscribe', 'enjoy', 'watch tv', 'mtn tv plus', 'mtn tv+', 'download', 'call across all networks', 'youtube', 'borrow', 'laugh', 'app', 'sport'];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = adPhrases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var phrase = _step.value;

      if (message.toLowerCase().search(phrase) > -1) {
        
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var ml = message.toLowerCase();
  /**
   * Examples:
   * - The recharged amount is 50.000 kwacha.Your current balance is 250.522 kwacha..With MTN everyone is a winner, Earn more Ni Zee points by RECHARGING NOW! Dial *1212#!
   */
  if (info.money.length >= 2 && ml.includes('recharged') && ml.includes('balance')) {
    return types.RECHARGE;
  }
  if (info.data.length > 0) {
    /**
     * Examples:
     * - Y'ello, you have used up 90% of your 10240 MB Data Bundle.
     */
    if (ml.search(/\d+%/) > 0) {
      return types.DATA_PERCENT;
    }
    /**
     * Examples:
     * - You have Data 6.78 MB Home Data Valid until 2017-01-27 00:00:00.CONGRATS! You have a chance to win a CAR! SMS WIN to 669! Cost K0.50. TCs apply
     * - Y'ello! You have 4559.28 MB MTN Home Day Data.
     */
    if (info.expires.length > 0 || ml.includes('have') && ml.includes('data')) {
      return types.DATA;
    }
  }
  /**
   * Examples:
   * - Y'ello! Your 10GB MTN Home Internet Bundle (Once-Off) has been activated successfully.
   */
  if (ml.includes('activated') && (ml.includes('bundle') || ml.includes('activated successfully'))) {
    return types.ACTIVATED;
  }
  /**
   * Examples:
   * - Dear Customer, You have depleted your 10240 MB data bundle. Your main balance is K 0.6154. Dial *335# to buy another pack.
   * - You have used all your Data Bundle.Your main balance is K 10.5228.Dial *335# to purchase a Bundle Now.
   */
  if ((ml.includes('depleted') || ml.includes('used all')) && ml.includes('bundle')) {
    return types.DEPLETED;
  }
  return types.AD;
}
function parse(message) {
  var info = {
    data: getDataUsage(message),
    expires: getExpiryDate(message),
    money: getMoney(message),
    percent: getPercent(message)
  };

  return Object.assign(info, {
    type: getType(info, message)
  });
}

// Separate

/**
 * @typedef SmsCount
 * @property {number} LocalUnread
 * @property {number} LocalInbox
 * @property {number} LocalOutbox
 * @property {number} LocalDraft
 * @property {number} LocalDeleted
 * @property {number} LocalTotal computed value
 * @property {number} SimUnread
 * @property {number} SimInbox
 * @property {number} SimOutbox
 * @property {number} SimDraft
 * @property {number} LocalMax
 * @property {number} SimMax
 * @property {number} [SimUsed]
 * @property {number} SimTotal equal to SimUsed if it exists, otherwise computed
 * @property {number} NewMsg
 */

/**
 * Gets the number of read and unread messages
 * @param {boolean} [includeComputed=true]
 * @return {Promise<SmsCount>}
 */
var getSmsCount = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var includeComputed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var data, processed, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, key, simTotal, localTotal;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getAjaxData({ url: 'api/sms/sms-count' });

          case 2:
            data = _context.sent;
            processed = {};
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 7;

            for (_iterator2 = Object.keys(data)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              key = _step2.value;

              processed[key] = parseInt(data[key], 10);
            }
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](7);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 15:
            _context.prev = 15;
            _context.prev = 16;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 18:
            _context.prev = 18;

            if (!_didIteratorError2) {
              _context.next = 21;
              break;
            }

            throw _iteratorError2;

          case 21:
            return _context.finish(18);

          case 22:
            return _context.finish(15);

          case 23:
            if (includeComputed) {
              simTotal = void 0;

              if ('SimUsed' in processed) {
                simTotal = processed.SimUsed;
              } else {
                simTotal = processed.SimInbox + processed.SimOutbox + processed.SimDraft;
              }
              processed.SimTotal = simTotal;
              localTotal = processed.LocalInbox + processed.LocalOutbox + processed.LocalDraft + processed.LocalDeleted;

              processed.LocalTotal = localTotal;
            }
            return _context.abrupt('return', processed);

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));

  return function getSmsCount() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @enum {number}
 */


/**
 * @typedef Message
 * @property {number} Smstat Sms type, see SmstatTypes
 * @property {number} Index
 * @property {string|number} Phone The phone number from which the SMS was sent
 * @property {string} Content The actual content of the SMS
 * @property {string} Date The date the SMS was received
 * @property {any} Sca
 * @property {number} SaveType
 * @property {number} Priority
 * @property {number} SmsType
 * @see SmstatTypes
 */

// TODO: Fix SmsBoxTypes JSDoc
/**
 * @typedef SmsListOptions
 * @property {number} [page=1]
 * @property {number} [perPage=20]
 * @property {number} [boxType=1] Which box to retreive. Can be Inbox(1), sent(2) or draft(3)
 * @property {('desc'|'asc')} [sortOrder=desc]
*/

/**
 * Get's the list of SMSs from the router
 * @param {SmsListOptions} options Options
 * @return {Promise<Message[]>}
 */
var getSmsList = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(options) {
    var data;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = Object.assign({
              page: 1,
              perPage: 20,
              boxType: 1,
              sortOrder: 'desc'
            }, options);
            _context2.next = 3;
            return saveAjaxData({
              url: 'api/sms/sms-list',
              request: {
                PageIndex: options.page,
                ReadCount: options.perPage,
                BoxType: options.boxType,
                SortType: 0,
                Ascending: options.sortOrder === 'desc' ? 0 : 1,
                UnreadPreferred: 0
              }
            });

          case 3:
            data = _context2.sent;

            if (!(data.Count > 1)) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt('return', data.Messages.Message);

          case 8:
            if (!(data.Count > 0)) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', [data.Messages.Message]);

          case 12:
            return _context2.abrupt('return', []);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getSmsList(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @typedef FilterSmsListOption
 * @property {number} [minDate]
 * @property {boolean} [read]
 */

/**
 *
 * @param {FilterSmsListOption} options
 * @param {Message[]} list
 * @return {Message[]}
 */
function filterSmsList(options, list) {
  var filteredList = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var message = _step3.value;

      if (options && 'minDate' in options) {
        if (moment(message.Date).valueOf() > options.minDate) {
          filteredList.push(message);
        }
      } else if (options && 'read' in options) {
        var state = parseInt(message.Smstat, 10);
        if (options.read && state === 1 || !options.read && state === 0) {
          filteredList.push(message);
        }
      } else {
        filteredList.push(message);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return filteredList;
}var getFullSmsList = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(options) {
    var smsListOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var smsConfig, list;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            smsListOptions = Object.assign({
              sortOrder: 'desc'
            }, smsListOptions);

            options = Object.assign({
              total: 0,
              filter: null
            }, options);

            if (!(options.total > 0)) {
              _context4.next = 12;
              break;
            }

            _context4.next = 5;
            return config.getSmsConfig();

          case 5:
            smsConfig = _context4.sent;
            _context4.next = 8;
            return getFullSmsListRecursive(options, smsListOptions, [], smsConfig.pagesize, options.total);

          case 8:
            list = _context4.sent;
            return _context4.abrupt('return', list);

          case 12:
            return _context4.abrupt('return', []);

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getFullSmsList(_x10) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 *
 * @param {number} idx The index of the SMS
 * @return {Promise<any>}
 */
function setSmsAsRead(idx) {
  return saveAjaxData({
    url: 'api/sms/set-read',
    request: {
      Index: idx
    },
    responseMustBeOk: true
  });
}

/**
 * @typedef CreateSmsRequestOptions
 * @property {number} index The index of the message. Only used for sending drafts
 * @property {string[]} numbers An array of numbers to send the sms to
 * @property {string} content The SMS body
 */
function createSmsRequest(options) {
  options = Object.assign({
    index: -1,
    numbers: [],
    content: ''
  }, options);

  return {
    Index: options.index,
    Phones: {
      Phone: options.numbers
    },
    Sca: '',
    Content: options.content,
    Length: options.content.length,
    // TODO: Add different text modes
    // SMS_TEXT_MODE_UCS2 = 0
    // SMS_TEXT_MODE_7BIT = 1
    // SMS_TEXT_MODE_8BIT = 2
    Reserved: 1,
    Date: moment(Date.now()).format('Y-M-D HH:mm:ss')
  };
}

/**
 * @typedef SaveSmsOptions
 * @property {number} index The index of the messsage. Only used for sending drafts
 * @property {string[]} numbers An array of numbers to send the sms to
 * @property {string} content The SMS body
 */

/**
 * Sends an sms or saves a draft
 * @param {SaveSmsOptions} options
 * @return {Promise<any>}
 */
// TODO: Find out what pb and cancelSendSms is in original router
function saveSms(options) {
  return saveAjaxData({
    url: 'api/sms/save-sms',
    request: createSmsRequest(options),
    responseMustBeOk: true
  });
}

/**
 * @typedef SmsSendStatus
 * @property {string} TotalCount
 * @property {string} CurIndex
 * @property {string} Phone
 * @property {string} SucPhone
 * @property {string} FailPhone
 */

/**
 * @return {Promise<SmsSendStatus>}
 */
function getSmsSendStatus() {
  return getAjaxData({
    url: 'api/sms/send-status'
  });
}

/**
 * @typedef SendSmsOptions
 * @property {string[]} numbers An array of numbers to send the sms to
 * @property {string} content The SMS body
 */

/**
 * @param {SendSmsOptions} options
 * @return {Promise<SmsSendStatus>}
 */
var sendSms = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(options) {
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return saveAjaxData({
              url: 'api/sms/send-sms',
              request: createSmsRequest(options),
              responseMustBeOk: true
            });

          case 2:
            return _context5.abrupt('return', getSmsSendStatus());

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function sendSms(_x11) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * @return {Promise<SmsSendStatus>}
 */
var cancelSendSms = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return saveAjaxData({
              url: 'api/sms/cancel-send',
              request: 1,
              responseMustBeOk: true
            });

          case 2:
            return _context6.abrupt('return', getSmsSendStatus());

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function cancelSendSms() {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * Delete's all messages with the given indices
 * @param {number[]} indices An array of indices of messages
 * @return {Promise<any>}
 */
function deleteSms(indices) {
  var request = { Index: indices };
  return saveAjaxData({
    url: 'api/sms/delete-sms',
    request: request,
    responseMustBeOk: true
  });
}

/**
 * Checks if:
 * - importing is a feature of this router
 * - there are any messages to import
 * - there is enough space
 * @return {Promise<boolean>}
 * @throws {RouterError}
 */
var readyToImport = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
    var smsConfig, smsCount;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return config.getSmsConfig();

          case 2:
            smsConfig = _context7.sent;

            if (smsConfig.import_enabled) {
              _context7.next = 5;
              break;
            }

            throw new RouterError('sms_import_disabled');

          case 5:
            _context7.next = 7;
            return getSmsCount();

          case 7:
            smsCount = _context7.sent;

            if (!(smsCount.SimTotal == 0)) {
              _context7.next = 10;
              break;
            }

            throw new RouterError('sms_import_sim_empty');

          case 10:
            if (!(smsCount.LocalTotal >= smsCount.LocalMax)) {
              _context7.next = 12;
              break;
            }

            throw new RouterError('sms_not_enough_space');

          case 12:
            return _context7.abrupt('return', true);

          case 13:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function readyToImport() {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * @typedef importMessagesResponse
 * @property {number} successNumber
 * @property {number} failNumber
 */

/**
 * Import's messages from the sim card
 * @param {boolean} checkIfReady Whether to call readyToImport. Set this to false if you want to check if importing is ready on your own
 * @return {Promise<importMessagesResponse>}
 * @throws {RouterError}
 */
var importMessages = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
    var checkIfReady = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var data, successNumber, failNumber;
    return _regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!checkIfReady) {
              _context8.next = 3;
              break;
            }

            _context8.next = 3;
            return readyToImport();

          case 3:
            _context8.next = 5;
            return saveAjaxData({
              url: 'api/sms/backup-sim',
              request: {
                IsMove: 0,
                Date: moment(Date.now()).format('Y-M-D HH:mm:ss')
              }
            });

          case 5:
            data = _context8.sent;

            if (!('SucNumber' in data && data.SucNumber !== '' && 'FailNumber' in data && data.FailNumber !== '')) {
              _context8.next = 16;
              break;
            }

            successNumber = parseInt(data.SucNumber, 10);
            failNumber = parseInt(data.FailNumber, 10);

            if (!(data.Code.toLowerCase() === 'ok' || successNumber > 0)) {
              _context8.next = 13;
              break;
            }

            return _context8.abrupt('return', { successNumber: successNumber, failNumber: failNumber });

          case 13:
            throwApiError(data.Code);

          case 14:
            _context8.next = 17;
            break;

          case 16:
            throw new RouterError('sms_import_invalid_response', 'Number succeeded and failed were empty. Response was: ' + JSON.stringify(data));

          case 17:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function importMessages() {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * Get's USSD options from a message string.
 * E.g
 * 1. WhatsApp pack
 * 2. Facebook pack
 * 3. Nightly bundle
 * @param {string} message
 * @return {Object.<string, string>}
 */
function getOptions(message) {
  var foundOptions = message.match(/(^.|\n.)+\. (.+)/gi);
  var options = {};
  if (foundOptions) {
    foundOptions.map(function (element) {
      var regExp = /((^.|\n.)+)\. /;
      var match = regExp.exec(element);
      var key = match[1].replace(/\n/, '');
      options[key] = element.replace(/(^.|\n.)+\. /i, '');
    });
  }
  return options;
}

function parse$1(message) {
  var options = getOptions(message);
  var content = message;
  if (options) {
    content = content.replace(/(^.|\n.)+\.((.|\n)+)/i, '');
  }
  return {
    content: content,
    options: options
  };
}

/**
 * Releases previous USSD result. Must be called after getting a USSD result.
 * @return {Promise<boolean>}
 */
var releaseUssd = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var ret;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getAjaxData({ url: 'api/ussd/release' });

          case 2:
            ret = _context.sent;

            if (!isAjaxReturnOk(ret)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', true);

          case 7:
            throw new RouterError('ussd_release_fail');

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function releaseUssd() {
    return _ref.apply(this, arguments);
  };
}();

var UssdResultRequest = function () {
  function UssdResultRequest() {
    _classCallCheck(this, UssdResultRequest);

    this._elapsedTime = 0;
    this._cancelled = false;
  }

  _createClass(UssdResultRequest, [{
    key: 'cancel',
    value: function cancel() {
      this._cancelled = true;
    }
  }, {
    key: '_query',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var ret;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return getAjaxData({
                  url: 'api/ussd/get'
                });

              case 3:
                ret = _context2.sent;
                return _context2.abrupt('return', ret);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](0);

                if (!(_context2.t0 instanceof RouterApiError)) {
                  _context2.next = 29;
                  break;
                }

                if (!(_context2.t0.code === 'api_ussd_processing')) {
                  _context2.next = 23;
                  break;
                }

                if (!(this._elapsedTime >= config.ussdTimeout)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 14;
                return releaseUssd();

              case 14:
                throw new RouterError('ussd_timeout');

              case 15:
                if (!this._cancelled) {
                  _context2.next = 17;
                  break;
                }

                throw new RouterError('ussd_cancelled');

              case 17:
                _context2.next = 19;
                return delay(config.ussdWaitInterval);

              case 19:
                this._elapsedTime += config.ussdWaitInterval;
                return _context2.abrupt('return', this._query());

              case 23:
                if (!(_context2.t0.code == 'api_ussd_timeout')) {
                  _context2.next = 27;
                  break;
                }

                _context2.next = 26;
                return releaseUssd();

              case 26:
                throw _context2.t0;

              case 27:
                _context2.next = 30;
                break;

              case 29:
                throw _context2.t0;

              case 30:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function _query() {
        return _ref2.apply(this, arguments);
      }

      return _query;
    }()
    /**
     * @typedef UssdResult
     * @property {string} content
     */

    /**
     * Get's the result of a USSD command. Waits for result
     * @return {Promise<UssdResult>}
     */

  }, {
    key: 'send',
    value: function send() {
      return this._query();
    }
  }]);

  return UssdResultRequest;
}();

/**
 * Sends a USSD command to the router
 * @param {string}   command  the command to send
 * @return {Promise<any>}
 */
function sendUssdCommand(command) {
  return saveAjaxData({
    url: 'api/ussd/send',
    request: {
      content: command,
      codeType: 'CodeType',
      timeout: ''
    },
    responseMustBeOk: true
  });
}

/**
 * Checks if a USSD request is in progress
 * @return {Promise<boolean>}
 */
function getUssdStatus() {
  return getAjaxData({
    url: 'api/ussd/status',
    converter: function converter(data) {
      return data.result === '1';
    }
  });
}

/**
 * @typedef TrafficStatistics
 * @property {number} CurrentConnectTime
 * @property {number} CurrentDownload
 * @property {number} CurrentDownloadRate
 * @property {number} CurrentUpload
 * @property {number} CurrentUploadRate
 *
 * @property {number} TotalConnectTime
 * @property {number} TotalDownload
 * @property {number} TotalUpload
 * @property {number} TotalDownload
 * @property {number} showtraffic
 */

/**
 * @return {Promise<TrafficStatistics>}
 */
function getTrafficStatistics() {
  return getAjaxData({
    url: 'api/monitoring/traffic-statistics',
    map: function map(item) {
      return parseInt(item, 10);
    }
  });
}

/**
 * @typedef Notifications
 * @property {number} UnreadMessage
 * @property {boolean} SmsStorageFull
 * @property {number} OnlineUpdateStatus
*/

/**
 * @return {Promise<Notifications>}
 */
var checkNotifications = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var ret;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getAjaxData({
              url: 'api/monitoring/check-notifications'
            });

          case 2:
            ret = _context.sent;
            return _context.abrupt('return', {
              UnreadMessage: parseInt(ret.UnreadMessage, 10),
              SmsStorageFull: ret.SmsStorageFull === '1',
              OnlineUpdateStatus: parseInt(ret.OnlineUpdateStatus, 10)
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function checkNotifications() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Resets network traffic statistics
 * @return {Promise<any>}
 */
function resetStatistics() {
  return saveAjaxData({
    url: 'api/monitoring/clear-traffic',
    request: {
      ClearTraffic: 1
    },
    responseMustBeOk: true
  });
}

/**
 * @typedef DataUsageSettings
 * @property {number} StartDay
 * @property {number} DataLimit
 * @property {string} DataLimitUnit
 * @property {number} DataLimitAwoke
 * @property {number} MonthThreshold
 * @property {number} SetMonthData
 * @property {number} trafficmaxlimit
 * @property {boolean} turnoffdataenable
 * @property {boolean} turnoffdataswitch
 * @property {boolean} turnoffdataflag
 */

/**
 * Get's data usage related settings. E.g. start date, data limit, threshold
 * @return {Promise<DataUsageSettings>}
 */
var getDataUsageSettings = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var data, len, dataLimit, dataLimitUnit;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getAjaxData({
              url: 'api/monitoring/start_date'
            });

          case 2:
            data = _context2.sent;
            len = data.DataLimit.length;
            dataLimit = data.DataLimit.substring(0, len - 2);
            dataLimitUnit = data.DataLimit.substring(len - 2, len);
            return _context2.abrupt('return', {
              StartDay: parseInt(data.StartDay, 10),
              DataLimit: parseInt(dataLimit, 10),
              DataLimitUnit: dataLimitUnit,
              DataLimitAwoke: parseInt(data.DataLimitAwoke, 10),
              MonthThreshold: parseInt(data.MonthThreshold, 10),
              SetMonthData: parseInt(data.SetMonthData, 10),
              trafficmaxlimit: parseInt(data.trafficmaxlimit, 10),
              turnoffdataenable: data.turnoffdataenable === '1',
              turnoffdataswitch: data.turnoffdataswitch === '1',
              turnoffdataflag: data.turnoffdataflag === '1'
            });

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getDataUsageSettings() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @typedef DataUsageSettingsSet
 * @property {number} startDay
 * @property {number} dataLimit
 * @property {string} dataLimitUnit
 * @property {number} dataLimitAwoke
 * @property {number} monthThreshold
 * @property {number} setMonthData
 * @property {number} trafficMaxLimit
 * @property {boolean} turnOffDataEnable
 * @property {boolean} turnOffDataSwitch
 * @property {boolean} turnOffDataFlag
 */

/**
 * @param {DataUsageSettingsSet} options
 * @return {Promise<any>}
 */
function setDataUsageSettings(options) {
  return saveAjaxData({
    url: 'api/monitoring/start_date',
    request: {
      StartDay: options.startDay,
      DataLimit: options.dataLimit.toString() + options.dataLimitUnit,
      DataLimitAwoke: options.dataLimitAwoke,
      MonthThreshold: options.monthThreshold,
      SetMonthData: options.setMonthData,
      trafficmaxlimit: options.trafficMaxLimit,
      turnoffdataenable: options.turnOffDataEnable ? 1 : 0,
      turnoffdataswitch: options.turnOffDataSwitch ? 1 : 0,
      turnoffdataflag: options.turnOffDataFlag ? 1 : 0
    },
    responseMustBeOk: true
  });
}

var connectionStatuses = {
  COMBINING: [900],
  CONNECTED: [901],
  CONNECTION_ERROR_DENIED_NETWORK_ACCESS: [7, 11, 14, 37, 131079, 131080, 131081, 131082, 131083, 131084, 131085, 131086, 131087, 131088, 131089],
  CONNECTION_ERROR_WRONG_PROFILE: [2, 3, 5, 8, 20, 21, 23, 27, 28, 29, 30, 31, 32, 33, 65538, 65539, 65567, 65568, 131073, 131074, 131076, 131078],
  CONNECTION_ERROR: [906],
  CONNECTION_FAILED: [904],
  DATA_TRANSMISSION_LIMIT_EXCEEDED: [201],
  DISCONNECTED: [902],
  DISCONNECTION: [903],
  NO_AUTOMATIC_CONNECTION_ESTABLISHED: [112],
  NO_AUTOMATIC_ROAMING_CONNECTION_ESTABLISHED: [113],
  NO_CONNECTION_NO_ROAMING: [12, 13],
  NO_CONNECTION_WEAK_SIGNAL: [905],
  NO_RECONNECTION: [114],
  NO_ROAMING_CALL_AGAIN: [115]
};

/**
 * Compares a connection status group to a single status
 * @param {Array} compare
 * @param {number} status
 * @see connectionStatuses
 * @return {boolean}
 */
function compareConnectionStatus(compare, status) {
  return compare.includes(status);
}

var networkTypes = {
  0: 'no service',
  1: 'GSM',
  2: 'GPRS',
  3: 'EDGE',
  4: 'WCDMA',
  5: 'HSDPA',
  6: 'HSUPA',
  7: 'HSPA',
  8: 'TDSCDMA',
  9: 'HSPA +',
  10: 'EVDO rev. 0',
  11: 'EVDO rev. AND',
  12: 'EVDO rev. B',
  13: '1xRTT',
  14: 'UMB',
  15: '1xEVDV',
  16: '3xRTT',
  17: 'HSPA + 64QAM',
  18: 'HSPA + MIMO',
  19: 'LTE',
  21: 'IS95A',
  22: 'IS95B',
  23: 'CDMA1x',
  24: 'EVDO rev. 0',
  25: 'EVDO rev. AND',
  26: 'EVDO rev. B',
  27: 'Hybrid CDMA1x',
  28: 'Hybrid EVDO rev. 0',
  29: 'Hybrid EVDO rev. AND',
  30: 'Hybrid EVDO rev. B',
  31: 'EHRPD rev. 0',
  32: 'EHRPD rev. AND',
  33: 'EHRPD rev. B',
  34: 'Hybrid EHRPD rev. 0',
  35: 'Hybrid EHRPD rev. AND',
  36: 'Hybrid EHRPD rev. B',
  41: 'WCDMA',
  42: 'HSDPA',
  43: 'HSUPA',
  44: 'HSPA',
  45: 'HSPA +',
  46: 'DC HSPA +',
  61: 'TD SCDMA',
  62: 'TD HSDPA',
  63: 'TD HSUPA',
  64: 'TD HSPA',
  65: 'TD HSPA +',
  81: '802.16E',
  101: 'LTE'
};

/**
 * Gets the name of a network type ID
 * @param {number} value
 * @return {string}
 * @see networkTypes
 */
function getNetworkType(value) {
  return networkTypes[value];
}

var simStatuses = {
  NO_SIM_OR_INCORRECT: 0,
  VALID_SIM: 1,
  /** Incorrect SIM card for link switching case (CS) */
  INCORRECT_SIM_LINK_SWITCHING_CASE: 2,
  /** Incorrect SIM card for case of packet switching (PS) */
  INCORRECT_SIM_PACKET_SWITCHING_CASE: 3,
  /** Incorrect SIM card for link and packet switching (PS + CS) */
  INCORRECT_SIM_LINK_AND_PACKET_SWITCHING_CASE: 4,
  ROMSIM: 240,
  NO_SIM: 255
};

var batteryStatuses = {
  NORMAL: 0,
  CHARGING: 1,
  LOW: -1,
  NO_BATTERY: 2
};

// TODO: Add more service statuses
var serviceStatuses = {
  AVAILABLE: 2
};

var wifiStatuses = {
  DISABLED: '0',
  ENABLED: '1',
  INCLUDES_5G: '5G'
};

var roamingStatuses = {
  DISABLED: 0,
  ENABLED: 1,
  NO_CHANGE: 2
};

/**
 * FIXME: Change 'see x' to proper JSDoc links
 * @typedef Status
 * @property {number} ConnectionStatus see connectionStatuses
 * @property {number} WifiConnectionStatus
 * @property {string} SignalStrength
 * @property {number} SignalIcon
 * @property {number} CurrentNetworkType see networkTypes
 * @property {number} CurrentServiceDomain
 * @property {number} RoamingStatus see roamingStatuses
 * @property {number} BatteryStatus see batteryStatuses
 * @property {string} BatteryLevel
 * @property {string} BatteryPercent
 * @property {number} simlockStatus
 * @property {string} WanIPAddress
 * @property {string} WanIPv6Address
 * @property {string} PrimaryDns
 * @property {string} SecondaryDns
 * @property {string} PrimaryIPv6Dns
 * @property {string} SecondaryIPv6Dns
 * @property {number} CurrentWifiUser
 * @property {number} TotalWifiUser
 * @property {number} currenttotalwifiuser
 * @property {number} ServiceStatus see serviceStatuses
 * @property {number} SimStatus see simStatuses
 * @property {string} WifiStatus see wifiStatuses
 * @property {number} CurrentNetworkTypeEx see networkTypes
 * @property {number} maxsignal
 * @property {string} wifiindooronly
 * @property {string} wififrequence
 * @property {string} classify
 * @property {string} flymode
 * @property {string} cellroam
 * @property {string} voice_busy
 */

/**
* @return {Promise<Status>}
*/
var getStatus = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var data, numbers, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getAjaxData({
              url: 'api/monitoring/status'
            });

          case 2:
            data = _context3.sent;
            numbers = ['ConnectionStatus', 'WifiConnectionStatus', 'SignalIcon', 'CurrentNetworkType', 'CurrentServiceDomain', 'RoamingStatus', 'BatteryStatus', 'simlockStatus', 'CurrentWifiUser', 'TotalWifiUser', 'currenttotalwifiuser', 'ServiceStatus', 'SimStatus', 'CurrentNetworkTypeEx', 'maxsignal'];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 7;

            for (_iterator = Object.keys(data)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              key = _step.value;

              if (numbers.includes(key)) {
                data[key] = parseInt(data[key], 10);
              }
            }
            _context3.next = 15;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context3.t0;

          case 15:
            _context3.prev = 15;
            _context3.prev = 16;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 18:
            _context3.prev = 18;

            if (!_didIteratorError) {
              _context3.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context3.finish(18);

          case 22:
            return _context3.finish(15);

          case 23:
            return _context3.abrupt('return', data);

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));

  return function getStatus() {
    return _ref3.apply(this, arguments);
  };
}();

var monitoring = Object.freeze({
	getTrafficStatistics: getTrafficStatistics,
	checkNotifications: checkNotifications,
	resetStatistics: resetStatistics,
	getDataUsageSettings: getDataUsageSettings,
	setDataUsageSettings: setDataUsageSettings,
	connectionStatuses: connectionStatuses,
	compareConnectionStatus: compareConnectionStatus,
	networkTypes: networkTypes,
	getNetworkType: getNetworkType,
	simStatuses: simStatuses,
	batteryStatuses: batteryStatuses,
	serviceStatuses: serviceStatuses,
	wifiStatuses: wifiStatuses,
	roamingStatuses: roamingStatuses,
	getStatus: getStatus
});

/**
 *
 * @return {Promise<boolean>}
 */
// TODO: Test on a router where api/dialup/auto-apn exists
function getAutoApn() {
  return getAjaxData({
    url: 'api/dialup/auto-apn',
    converter: function converter(data) {
      return data.AutoAPN === '1';
    }
  });
}

/**
 * Set the status of automatic APN selection
 * @param {boolean} state
 * @return {Promise<any>}
 */
// TODO: Test on a router where api/dialup/auto-apn exists
function setAutoApn(state) {
  return saveAjaxData({
    url: 'api/dialup/auto-apn',
    request: { AutoAPN: state ? 1 : 0 }
  });
}

/**
 *
 * @return {Promise<boolean>}
 */
function getMobileDataSwitch() {
  return getAjaxData({
    url: 'api/dialup/mobile-dataswitch',
    converter: function converter(data) {
      return data.dataswitch === '1';
    }
  });
}

/**
 * Turns mobile data on or off
 * @param {boolean} state
 * @return {Promise<any>}
 */
var setMobileDataSwitch = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', saveAjaxData({
              url: 'api/dialup/mobile-dataswitch',
              request: { dataswitch: state ? 1 : 0 },
              responseMustBeOk: true
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function setMobileDataSwitch(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @param {boolean} [fresh=false]
 * @return {Promise<any>}
 */
function getConnection() {
  var fresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  return config.getConfig('dialup.connection', fresh);
}

/**
 * @typedef ConnectionOptions
 * @property {boolean} roamAutoConnectEnable
 * @property {number} maxIdleTime
 * @property {number} connectMode
 * @property {number} mtu
 * @property {boolean} autoDialSwitch
 * @property {boolean} pdpAlwaysOn
 */

/**
 * Set settings for automatic connection establishment
 * @param {ConnectionOptions} options
 * @return {Promise<any>}
 */
// TODO: test setting connection config
// `auto_dial_switch` and `pdp_always_on` may not be needed
function setConnection(options) {
  return saveAjaxData({
    url: 'api/dialup/connection',
    request: {
      RoamAutoConnectEnable: options.roamAutoConnectEnable,
      MaxIdelTime: options.maxIdleTime,
      ConnectMode: options.connectMode,
      MTU: options.mtu,
      auto_dial_switch: options.autoDialSwitch,
      pdp_always_on: options.pdpAlwaysOn
    },
    responseMustBeOk: true
  });
}

function getProfiles() {
  var fresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  return config.getConfig('dialup.profiles', fresh);
}

/**
 * @typedef ProfileApn
 * @property {boolean} isStatic
 * @property {string} name
 */

/**
 * @typedef Profile
 * @property {number} [idx]
 * @property {boolean} isValid 1
 * @property {string} name PLAY
 * @property {ProfileApn} apn
 * @property {string} dialupNum *99#
 * @property {string} username
 * @property {string} password
 * @property {number} authMode 2
 * @property {boolean} dnsIsStatic 0
 * @property {string} primaryDns
 * @property {string} secondaryDns
 * @property {number} readOnly 2
 * @property {number} ipType 2
 */

/**
 * Generic function to help with modifying profiles
 * @param {number} deleteIdx What index to delete
 * @param {number} defaultIndex Index to set as the default
 * @param {0|1|2} modify The type of change; 0-delete, 1-add, 2-change
 * @param {Profile} [profile=null]
 * @return {Promise<any>}
 */
function saveProfile(deleteIdx, defaultIndex, modify) {
  var profile = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var request = {
    Delete: deleteIdx,
    SetDefault: defaultIndex,
    Modify: modify
  };
  if (profile) {
    request.Profile = {
      Index: profile.idx,
      IsValid: profile.isValid ? 1 : 0,
      Name: profile.name,
      ApnIsStatic: profile.apn.isStatic ? 1 : 0,
      ApnName: profile.apn.name,
      DialupNum: profile.dialupNum,
      Username: profile.username,
      Password: profile.password,
      AuthMode: profile.authMode,
      DnsIsStatic: profile.dnsIsStatic,
      PrimaryDns: profile.primaryDns,
      SecondaryDns: profile.secondaryDns,
      ReadOnly: 0,
      iptype: profile.ipType
    };
  }
  return saveAjaxData({
    url: 'api/dialup/profiles',
    request: request,
    responseMustBeOk: true
  });
}

/**
 * Deletes the profile with the specified index
 * @param {number} idx Index to delete
 * @param {number} defaultIndex Index to set as the default
 * @return {Promise<any>}
 */
function deleteProfile(idx, defaultIndex) {
  return saveProfile(idx, defaultIndex, 0);
}

/**
 * Adds a new profile
 * @param {number} defaultIndex Index to set as the default
 * @param {Profile} profile
 * @return {Promise<any>}
 */
function addProfile(defaultIndex, profile) {
  profile.idx = '';
  profile.isValid = 1;
  return saveProfile(0, defaultIndex, 1, profile);
}

/**
 * Modifies the profile with the specified index
 * @param {Profile} profile
 * @return {Promise<any>}
 */
function editProfile(profile) {
  return saveProfile(0, profile.idx, 2, profile);
}

/**
 * Establishing and disconnecting a connection
 * @param {0|1} action 0-Disconnect, 1-Establish a connection
 * @return {Promise<any>}
 */
function dial(action) {
  return saveAjaxData({
    url: 'api/dialup/dial',
    request: {
      Action: action
    },
    responseMustBeOk: true
  });
}

/**
 * Downloading the switch settings for the dialup module
 * @param {boolean} [fresh=false]
 * @return {Promise<any>}
 */
function getFeatureSwitch() {
  var fresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  return config.getConfig('dialup.featureSwitch', fresh);
}

/**
 *
 * @param {boolean} [fresh=false]
 * @return {Promise<any>}
 */
function getConnectMode() {
  var fresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  return config.getConfig('dialup.connectMode', fresh);
}

/**
 * Controls access to the router
 */
var index = {
  admin: {
    getLoginState: getLoginState,
    isLoggedIn: isLoggedIn,
    login: login
  },
  config: config,
  sms: {
    types: types,
    boxTypes: boxTypes,
    parse: parse,
    getSmsCount: getSmsCount,
    getSmsList: getSmsList,
    getFullSmsList: getFullSmsList,
    setSmsAsRead: setSmsAsRead,
    createSmsRequest: createSmsRequest,
    saveSms: saveSms,
    getSmsSendStatus: getSmsSendStatus,
    sendSms: sendSms,
    cancelSendSms: cancelSendSms,
    deleteSms: deleteSms,
    importMessages: importMessages
  },
  ussd: {
    parse: parse$1,
    releaseUssd: releaseUssd,
    UssdResultRequest: UssdResultRequest,
    sendUssdCommand: sendUssdCommand,
    getUssdStatus: getUssdStatus
  },
  monitoring: monitoring,
  utils: {
    ping: ping
  },
  errors: {
    RouterError: RouterError,
    RouterApiError: RouterApiError,
    RequestError: RequestError,
    isErrorInCategory: isErrorInCategory
  },
  dialup: {
    getAutoApn: getAutoApn,
    setAutoApn: setAutoApn,
    getMobileDataSwitch: getMobileDataSwitch,
    setMobileDataSwitch: setMobileDataSwitch,
    getConnection: getConnection,
    setConnection: setConnection,
    getProfiles: getProfiles,
    deleteProfile: deleteProfile,
    addProfile: addProfile,
    editProfile: editProfile,
    dial: dial,
    getFeatureSwitch: getFeatureSwitch,
    getConnectMode: getConnectMode
  }
};

export default index;
