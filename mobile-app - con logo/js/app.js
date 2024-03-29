var h = preact.h;

var settings = {
  provisionURL: 'https://provision.mdash.net',
    CiControl_found: 'http://cicontrol.com.mx/Devices/api.php?found',
     CiControl_insert: 'http://cicontrol.com.mx/Devices/api.php?insert',
  mdashURL: 'https://mdash.net',
  callTimeoutMilli: 10000,  // 10 seconds
 
};

   sumaclick=0;

var Header = function(props) {
  return h(
      'div', {class: 'p-2 border-bottom bg-light'},
      h('b', {}, props.app.state.title),
      h('div', {class: 'float-right'},
        h('small', {class: 'text-muted mr-2 font-weight-light'},
          'CiControl'),
        h('img', {height: 24, src: 'images/logo-512x512.png'})));
};

var Footer = function(props) {
  var self = this, app = props.app;

  var mkTabButton = function(title, icon, tab, href) {
    var active = (location.hash == '#' + href);
    if (active && app.state.title != title) app.setState({title: title});
    return h(
        'a', {
          href: href,
          class: 'text-center ' +
              (active ? 'font-weight-bold text-primary' : 'text-dark'),
          style: 'flex:1;height:3em;text-decoration:none;' +
              'border-top: 3px solid ' + (active ? '#007bff' : 'transparent'),
        },
        h('div', {class: '', style: 'line-height: 1.4em'},
          h('i', {class: 'mr-0 fa-fw fa ' + icon, style: 'width: 2em;'}),
          h('div', {class: 'small'}, title)));
  };
  return h(
      'footer', {
        class: 'd-flex align-items-stretch border-top',
        style: 'flex-shrink: 0;'
      },
      mkTabButton('My Devices', 'fa-server', Page1, '/'),
      mkTabButton('Add Device', 'fa-plus-circle', Page2, '/add1'),
   mkTabButton('More', 'fa-bug', Page3, '/add2'));
};

var errorHandler = function(e) {
  var msg = (((e.response || {}).data || {}).e || {}).message || e.message || e;
  alert(msg);
};

var SpinButton = function(props) {

  var self = this, state = self.state;
  self.componentDidMount = function() {
    self.setState({spin: false});
  };
  return h(
      'button', {
        class: 'btn ' + (props.class || ''),
        disabled: props.disabled || state.spin,
        style: props.style || '',
        ref: props.ref,
        onClick: function() {
          if (!props.onClick) return;
          self.setState({spin: true});
          props.onClick().catch(errorHandler).then(function() {
            self.setState({spin: false});
          });
        }
      },
      h('i', {
        class: 'mr-1 fa fa-fw ' +
            (state.spin ? 'fa-refresh' : (props.icon || 'fa-save')) +
            (state.spin ? ' fa-spin' : '')
      }),
      props.title || 'submit');
};

var SpinButtonContar = function(props) {
      //sumaclick =0;
  var self = this, state = self.state;
  self.componentDidMount = function() {
    self.setState({spin: false});
  };
  console.log( 'SpinButtonContar');

    console.log( this);
      console.log( props);
     console.log( state);
      console.log( '--------');
       console.log( sumaclick);
      
 
  return h(
      'button', {
        class: 'btn ' + (props.class || ''),
        //disabled: props.disabled || state.spin,
        style: props.style || '',
        ref: props.ref,
       
          /*   onClick: function() {
          var data = JSON.stringify({ssid: 0, pass: 0});
          return axios({
                   method: 'POST',
                   url: settings.aguakan,
                   timeout: settings.callTimeoutMilli,
                   data: data,
                 })
              .then(function(res) {
                if (res.data.result) {
                  self.setState({sumaclick:sumaclick++});
                   self.setState({spin: true});
                } else {
                  alert('Error: ' + res.data.error);
                   self.setState({sumaclick:sumaclick++});
                   self.setState({spin: true});
                }
              });
        },
*/
        onClick: function() {
                  self.setState({sumaclick:sumaclick++});
                   self.setState({spin: true});
          if (!props.onClick) return;
           self.setState({sumaclick:sumaclick++});
         
          console.log( '----onClick----');
          props.onClick().catch(errorHandler).then(function() {
            self.setState({spin: false});

          });


        } 
      },
      h('i', {
        class: 'mr-1 fa fa-fw ' +     (state.spin ? 'fa-refresh' : (props.icon || 'fa-play')) +  (state.spin ? ' fa-spin' : '')
      }),
      props.title || 'Count++ ' + (state.sumaclick==undefined?sumaclick:state.sumaclick));
};


var Device = function(props) {
  var self = this, state = self.state;
  var refresh = function() {
    var url =
        settings.mdashURL + '/api/v2/m/device?access_token=' + props.accesskey;
    return axios.get(url).then(function(res) {
      self.setState({device: res.data});
    });
  };
  self.componentDidMount = function() {
    self.setState({device: null});
    refresh();
  };
  if (!state.device)
    return h(
        'div', {class: 'py-2 border-bottom'},
        h('div', {class: 'h-100 d-flex align-items-center'},
          h('div', {class: 'text-center w-100 text-muted'},
            h('i', {class: 'fa fa-refresh fa-spin'}), h('br'),
            'Initialising device...')));

  var shadow = state.device.shadow || {};
  var reported = (shadow.state || {}).reported || {};
  var ar = reported.app || {};
  var online = reported.online || false;
  var cbid = 'toggle-' + state.device.id;
  var checked = ar.on || false;
  return h(
      'div', {class: 'py-2 border-bottom d-flex flex-row'},
      h('div', {class: ''}, state.device.id,
        h('div', {},
          h('b', {class: 'small ' + (online ? 'text-success' : 'text-danger')},
            online ? 'online' : 'offline'))),
      h('div', {class: 'flex-grow-1 d-flex justify-content-end'},
        h('small', {class: 'mr-2 my-auto text-muted'}, 'ON/OFF:'),
        h('span', {class: 'toggle my-auto'}, h('input', {
            type: 'checkbox',
            id: cbid,
            disabled: !online,
            checked: checked,
            onChange: function(ev) {
              var body = {shadow: {state: {desired: {app: {}}}}};
              body.shadow.state.desired.app.on = ev.target.checked;
              var url = settings.mdashURL +
                  '/api/v2/m/device?access_token=' + props.accesskey;
              axios.post(url, body).catch(errorHandler);
            },
          }),
          h('label', {'for': cbid}, h('span')))));
};

var Page1 = function(props) {
  console.log('Page1');
  
  console.log(sumaclick);
  var content =
      h('div', {class: 'h-100 d-flex align-items-center'},
        h('div', {class: 'text-center w-100 text-muted font-weight-light'},
          h('i', {class: 'fa fa-bell-o fa-2x'}), h('br'), 'No devices yet'),
       // h('div', {class: 'text-center w-100 text-muted font-weight-light'},h(SpinButtonContar))
        );


  if (props.app.state.keys && props.app.state.keys.length) {
    content =
        h('div', {class: 'h-100'},  // JSON.stringify(props.app.state),
          props.app.state.keys.map(function(k) {
            return h(Device, {accesskey: k, app: props.app});
          }));
  }
  return h('div', {class: 'overflow-auto p-2'}, content);
};
var Page2 = function(props) {
  var self = this, state = self.state;
  self.componentDidMount = function() {
    self.setState({step: 0, ssid: '', pass: ''});
  };
  var alertClass = 'p-2 small text-muted font-weight-light';
  var Step0 =
      h('div', {},
        h('div', {class: alertClass}, 'Go to your phone settings', h('br'),
          'Join WiFi network SmartLight-XXXX', h('br'),
          'Return to this screen and press the Scan button'),
        h(SpinButton, {
          class: 'btn-block btn-primary border font-weight-light',
          title: 'Scan',
          icon: 'fa-search',
          onClick: function() {
            return axios({
                     url: settings.provisionURL + '/GetKey',
                     timeout: settings.callTimeoutMilli,
                   })
                .then(function(res) {
                  var key = res.data.result;
                  if (key) {
                    for (;;) {
                      var i = props.app.state.keys.indexOf(key);
                      if (i < 0) break;
                      props.app.state.keys.splice(i, 1);
                    }
                    props.app.state.keys.push(key);
                    props.app.setState(props.app.state);
                    setStateToLocalStorage(props.app.state);
                    self.setState({step: 1});
                  } else {
                    alert('Error: ' + res.data.error);
                  }
                });
          },
        }));


  var Step1 = h(
      'div', {},
      h('a', {
        href: location.href,
        class: 'link text-decoration-none',
        onClick: function() {
          self.setState({step: 0});
        }
      },
        '\u2190', ' back'),
      h('div', {class: alertClass + ' mt-2'}, 'Found new device!'), h('input', {
        class: 'form-control mb-2',
        type: 'text',
        placeholder: 'WiFi network name',
        onInput: function(ev) {
          self.setState({ssid: ev.target.value});
        },
      }),
      h('input', {
        class: 'form-control mb-2',
        type: 'text',
        placeholder: 'WiFi password',
        onInput: function(ev) {
          self.setState({pass: ev.target.value});
        },
      }),
      h(SpinButton, {
        class: 'btn-block btn-primary font-weight-light',
        title: 'Configure device WiFi',
        icon: 'fa-save',
        disabled: !state.ssid,
        onClick: function() {
          var data = JSON.stringify({ssid: state.ssid, pass: state.pass});
          return axios({
                   method: 'POST',
                   url: settings.provisionURL + '/setup',
                   timeout: settings.callTimeoutMilli,
                   data: data,
                 })
              .then(function(res) {
                if (res.data.result) {
                  self.setState({step: 2});
                } else {
                  alert('Error: ' + res.data.error);
                }
              });
        },
      }));


  var Step2 =
      h('div', {},
        h('a', {
          href: location.href,
          class: 'link text-decoration-none',
          onClick: function() {
            self.setState({step: 1});
          }
        },
          '\u2190', ' back'),
        h('div', {class: alertClass + ' mt-2'}, 'Device setup complete! ',
          'Go to your phone settings. Join back to your WiFi network. ',
          'Return to this screen and press on My Devices.'));
  var steps = [Step0, Step1, Step2];
  return h('div', {class: 'overflow-auto p-2'}, steps[state.step]);
};



var Page3 = function(props) {
  var self = this, state = self.state;
  self.componentDidMount = function() {
    self.setState({step: 0, ssid: '', pass: ''});
 
  };

   var refreshcount = function() {
    var url =
        settings.CiControl_found;
    return axios.get(url).then(function(res) {
      console.log('refreshcount');
       console.log(res.data.length);
      self.setState({sumaclick: res.data.length});
    });
  };

  var e=axios.get(settings.CiControl_found).then(function(res) {
      console.log('refreshcount2');
       console.log(res.data.length);
       sumaclick=res.data.length;
    });
  //sumaclick=22;
  //refreshcount();



  var alertClass = 'p-2 small text-muted font-weight-light';
  var Step0 =
      h('div', {},
        /*h('div', {class: alertClass}, 'Go to your phone settings', h('br'),
          'Join WiFi network SmartLight-XXXX', h('br'),
          'Return to this screen and press the Scan button'),
        */
         // h('div', {class: 'text-center w-100 text-muted font-weight-light'},h(SpinButtonContar)),
        h(SpinButton, {
          class: 'btn-block btn-primary border font-weight-light',
          title: 'Count++ '+sumaclick,
          icon: 'fa-play',
          onClick: function() {
               self.setState({sumaclick:sumaclick++});
            return axios({
                     url: settings.CiControl_insert,
                     timeout: settings.callTimeoutMilli,
                   })
                .then(function(res) {
                  var key = res.data.result;
                  console.log(res.data);

                  /*if (key) {
                    for (;;) {
                      var i = props.app.state.keys.indexOf(key);
                      if (i < 0) break;
                      props.app.state.keys.splice(i, 1);
                    }
                    props.app.state.keys.push(key);
                    props.app.setState(props.app.state);
                    setStateToLocalStorage(props.app.state);
                    self.setState({step: 1});
                  } else {
                    console.log('Error: ' + res.data.error);
                  }
                  */
                });
          },
        }));


  var Step1 = h(
      'div', {},
      h('a', {
        href: location.href,
        class: 'link text-decoration-none',
        onClick: function() {
          self.setState({step: 0});
        }
      },
        '\u2190', ' back'),
      h('div', {class: alertClass + ' mt-2'}, 'Found new device!'), h('input', {
        class: 'form-control mb-2',
        type: 'text',
        placeholder: 'WiFi network name',
        onInput: function(ev) {
          self.setState({ssid: ev.target.value});
        },
      }),
      h('input', {
        class: 'form-control mb-2',
        type: 'text',
        placeholder: 'WiFi password',
        onInput: function(ev) {
          self.setState({pass: ev.target.value});
        },
      }),
      h(SpinButton, {
        class: 'btn-block btn-primary font-weight-light',
        title: 'Configure device WiFi',
        icon: 'fa-save',
        disabled: !state.ssid,
        onClick: function() {
          var data = JSON.stringify({ssid: state.ssid, pass: state.pass});
          return axios({
                   method: 'POST',
                   url: settings.provisionURL + '/setup',
                   timeout: settings.callTimeoutMilli,
                   data: data,
                 })
              .then(function(res) {
                if (res.data.result) {
                  self.setState({step: 2});
                } else {
                  alert('Error: ' + res.data.error);
                }
              });
        },
      }));


  var Step2 =
      h('div', {},
        h('a', {
          href: location.href,
          class: 'link text-decoration-none',
          onClick: function() {
            self.setState({step: 1});
          }
        },
          '\u2190', ' back'),
        h('div', {class: alertClass + ' mt-2'}, 'Device setup complete! ',
          'Go to your phone settings. Join back to your WiFi network. ',
          'Return to this screen and press on My Devices.'));
  var steps = [Step0, Step1, Step2];
  return h('div', {class: 'overflow-auto p-2'}, steps[state.step]);
};

var Content = function(props) {
 
  return h(
      preactRouter.Router, {
        history: History.createHashHistory(),
        onChange: function(ev) {
          props.app.setState({url: ev.url});
        }
      },
      h(Page1, {app: props.app, default: true}),
      h(Page2, {app: props.app, path: 'add1'}),
      h(Page3, {app: props.app, path: 'add2'}));
};

var getStateFromLocalStorage = function() {
  if (!window.localStorage) window.localStorage = {};
  var state = {keys: []};
  if (localStorage.SmartLight) state.keys = localStorage.SmartLight.split(',');
  return state;
};

var setStateToLocalStorage = function(state) {
  localStorage.SmartLight = state.keys.join(',');
};


var App = function(props) {
  var self = this;

 
  self.componentDidMount = function() {
    self.setState(getStateFromLocalStorage());
    //console.log('getStateFromLocalStorage');
      //console.log(getStateFromLocalStorage());
  };

  var p = {app: self};
  return h(
      'div', {
        class: 'main border',
        style: 'max-width: 480px; margin: 0 auto; ' +
            'min-height: 100%; max-height: 100%;' +
            'display:grid;grid-template-rows: auto 1fr auto;' +
            'grid-template-columns: 100%;',
      },
      h(Header, p), h(Content, p), h(Footer, p));
};

window.onload = function() {
  console.log('onload');

  preact.render(h(App), document.body);

  if ('serviceWorker' in navigator)  // for PWA
    navigator.serviceWorker.register('js/service-worker.js')
        .catch(function(err) {});
};
