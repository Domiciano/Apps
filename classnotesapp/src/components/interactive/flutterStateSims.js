// Interactive simulators for Flutter state (StatefulWidget, setState, lifecycle) and,
// in Móviles, the sign up flow of Lab 5 across its layers.
// Plain DOM, no React: the same file is copied into the session decks, so it must
// not import anything. Every simulator is `mount(element, args) => destroy`.

const STYLE_ID = 'fsim-style';

const CSS = `
.fsim{--fs-bg:#FBFBFD;--fs-ink:#1C1B1F;--fs-muted:#5F6368;--fs-line:#E3E3EA;--fs-accent:#6750A4;
  --fs-accent-soft:#EADDFF;--fs-appbar:#D0BCFF;--fs-flash:#FFE082;--fs-ok:#2E7D32;--fs-err:#C62828;
  background:var(--fs-bg);color:var(--fs-ink);border:1px solid var(--fs-line);border-radius:16px;
  padding:16px;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:1.4;
  display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;box-sizing:border-box;max-width:960px;margin:0 auto;overflow:hidden;
  container-type:inline-size}
.fsim *{box-sizing:border-box}
.fsim .fs-col{display:flex;flex-direction:column;gap:12px;align-items:center;flex:0 1 280px;min-width:0;max-width:100%;margin:0 auto}
.fsim .fs-side{flex:1 1 300px;min-width:0;max-width:100%;display:flex;flex-direction:column;gap:12px}
.fsim .fs-phone{width:260px;max-width:100%;height:470px;border:10px solid #1C1B1F;border-radius:32px;background:#FEF7FF;
  overflow:hidden;display:flex;flex-direction:column;position:relative;box-shadow:0 6px 18px rgba(0,0,0,.18)}
.fsim .fs-status{height:20px;font-size:11px;color:#1C1B1F;display:flex;justify-content:space-between;padding:2px 14px 0}
.fsim .fs-appbar{background:var(--fs-appbar);padding:12px 14px;font-size:17px;font-weight:500;min-height:48px;
  display:flex;align-items:center;justify-content:space-between;gap:8px}
.fsim .fs-appbar small{font-size:12px;font-weight:400;color:#49454F}
.fsim .fs-body{flex:1;overflow-y:auto;padding:14px;position:relative}
.fsim .fs-center{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;gap:8px;color:#49454F}
.fsim .fs-big{font-size:44px;color:var(--fs-ink);font-weight:400}
.fsim .fs-fab{position:absolute;right:14px;bottom:14px;width:52px;height:52px;border-radius:16px;border:0;
  background:var(--fs-accent-soft);color:#21005D;font-size:28px;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.25);
  display:flex;align-items:center;justify-content:center}
.fsim .fs-fab:active{transform:scale(.94)}
.fsim .fs-panel{background:#fff;border:1px solid var(--fs-line);border-radius:12px;padding:10px 12px}
.fsim .fs-panel h4{margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--fs-muted)}
.fsim .fs-row{display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 12px;padding:3px 6px;border-radius:6px;
  font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:13px}
.fsim .fs-row span:last-child{text-align:right;overflow-wrap:anywhere}
.fsim .fs-dark{background:#1E1E2E;color:#CDD6F4;border-radius:12px;padding:10px 0;
  font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:12.5px;overflow-x:auto}
.fsim .fs-dark h4{margin:0 12px 6px;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#7F849C;font-family:Roboto,Arial,sans-serif}
.fsim .fs-code-line{white-space:pre;padding:0 12px;border-left:3px solid transparent;transition:background .4s}
.fsim .fs-code-line.fs-on{background:rgba(249,226,175,.18);border-left-color:#F9E2AF}
.fsim .fs-kw{color:#CBA6F7}.fsim .fs-str{color:#A6E3A1}.fsim .fs-num{color:#FAB387}.fsim .fs-type{color:#89DCEB}
.fsim .fs-ann{color:#F38BA8}
.fsim .fs-log{min-height:96px;max-height:150px;overflow-y:auto;padding:0 12px}
.fsim .fs-log div{white-space:pre-wrap;color:#A6ADC8}
.fsim .fs-log div:last-child{color:#fff}
.fsim .fs-log .fs-log-err{color:#F38BA8!important}
.fsim .fs-log .fs-log-ok{color:#A6E3A1!important}
.fsim .fs-flash{animation:fsimFlash 1s ease-out}
@keyframes fsimFlash{0%{background:var(--fs-flash)}100%{background:transparent}}
.fsim .fs-controls{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.fsim .fs-btn{border:1px solid var(--fs-accent);background:#fff;color:var(--fs-accent);border-radius:20px;
  padding:6px 14px;font:500 13px Roboto,Arial,sans-serif;cursor:pointer}
.fsim .fs-btn:hover{background:#F6F0FF}
.fsim .fs-btn.fs-solid{background:var(--fs-accent);color:#fff}
.fsim .fs-btn:disabled{opacity:.45;cursor:default}
.fsim .fs-switch{display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;user-select:none}
.fsim .fs-switch input{accent-color:var(--fs-accent);width:16px;height:16px}
.fsim .fs-note{font-size:13px;color:var(--fs-muted);min-height:36px;text-align:center;max-width:300px}
.fsim .fs-note.fs-warn{color:var(--fs-err)}
.fsim .fs-field{width:100%;border:1px solid #79747E;border-radius:4px;padding:8px 10px;font:14px Roboto,Arial,sans-serif;
  background:transparent;margin-bottom:8px;color:var(--fs-ink)}
.fsim .fs-field:focus{outline:2px solid var(--fs-accent);border-color:transparent}
.fsim .fs-label{font-size:11px;color:#49454F;margin:0 0 2px 2px}
.fsim .fs-filled{width:100%;border:0;border-radius:20px;padding:10px;background:var(--fs-accent);color:#fff;
  font:500 14px Roboto,Arial,sans-serif;cursor:pointer;margin-bottom:12px}
.fsim .fs-text-item{font-size:14px;padding:2px 0;color:var(--fs-ink)}
.fsim .fs-empty{font-size:13px;color:#79747E;text-align:center;padding:12px 0}
.fsim .fs-card{display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:10px;margin-bottom:10px;
  box-shadow:0 2px 8px rgba(103,80,164,.16)}
.fsim .fs-cover{width:56px;height:56px;border-radius:12px;overflow:hidden;flex:0 0 56px;
  background:linear-gradient(135deg,#B69DF8,#6750A4)}
.fsim .fs-cover img{width:100%;height:100%;object-fit:cover;display:block}
.fsim .fs-card-text{flex:1;min-width:0}
.fsim .fs-card-title{font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fsim .fs-card-artist{font-size:12px;color:#625B71;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fsim .fs-card-icon{color:var(--fs-accent);font-size:20px}
.fsim .fs-tree{list-style:none;margin:0;padding:0 0 0 14px;border-left:1px dashed #C9C5D0}
.fsim .fs-tree-root{border-left:0;padding-left:0}
.fsim .fs-node{display:inline-flex;align-items:center;gap:8px;margin:3px 0;padding:3px 8px;border-radius:8px;
  border:1px solid var(--fs-line);background:#fff;font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:12.5px}
.fsim .fs-node b{font-weight:600}
.fsim .fs-node.fs-stateful{border-color:var(--fs-accent)}
.fsim .fs-node.fs-state{background:var(--fs-accent-soft);border-color:var(--fs-accent)}
.fsim .fs-id{font-size:11px;color:#fff;background:#625B71;border-radius:10px;padding:0 7px}
.fsim .fs-node.fs-state .fs-id{background:var(--fs-accent)}
.fsim .fs-pair{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.fsim .fs-link{font-size:11px;color:var(--fs-muted)}
.fsim .fs-rel{position:relative}
.fsim .fs-lines{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:2}
.fsim .fs-lines .fs-read{fill:none;stroke:#9061DB;stroke-width:2;stroke-dasharray:5 5;opacity:.5;transition:opacity .3s}
.fsim .fs-lines .fs-read.fs-active{stroke-dasharray:none;opacity:1;stroke-width:2.5}
.fsim .fs-lines .fs-write{fill:none;stroke:#D08A12;stroke-width:2.5;opacity:0;transition:opacity .3s}
.fsim .fs-lines .fs-write.fs-active{opacity:1}
.fsim .fs-node.fs-reads{border-color:#7439B8;border-style:dashed}
.fsim .fs-node.fs-hot{box-shadow:0 0 0 3px #F2C069;border-color:#A96C05}
.fsim .fs-state-box{background:#F4EBFF;border-color:#C9A6EE}
.fsim .fs-state-head{display:flex;align-items:center;gap:10px}
.fsim .fs-state-head h4{margin:0;color:#7439B8}
.fsim .fs-state-foot{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-top:8px}
.fsim .fs-state-of{font-size:12px;color:var(--fs-muted);margin:0;font-family:'JetBrains Mono',Menlo,Consolas,monospace}
.fsim .fs-var{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:14px;margin:4px 0}
.fsim .fs-var-type{color:#7439B8}
.fsim .fs-var-name{font-weight:600}
.fsim .fs-var-val{min-width:64px;text-align:center;font-size:22px;font-weight:600;background:#fff;border:2px solid #7439B8;
  border-radius:10px;padding:2px 12px;display:inline-block}
.fsim .fs-pop{animation:fsimPop .7s ease-out}
@keyframes fsimPop{0%{transform:scale(1)}35%{transform:scale(1.25);background:#FFE082}100%{transform:scale(1)}}
.fsim .fs-press{animation:fsimPress .6s ease-out}
@keyframes fsimPress{0%{box-shadow:0 0 0 0 rgba(169,108,5,.7)}100%{box-shadow:0 0 0 18px rgba(169,108,5,0)}}
.fsim .fs-tag{font-size:12px;padding:2px 10px;border-radius:10px;background:#E8F6E3;color:#3A8235;font-weight:500}
.fsim .fs-tag.fs-dirty{background:#FFF3DC;color:#A96C05}
.fsim .fs-tag.fs-lost{background:#FFEBEF;color:#C2354F}
.fsim .fs-stepbar{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.fsim .fs-sp{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;padding:3px 10px 3px 4px;border-radius:14px;
  border:1px solid var(--fs-line);color:#79747E;background:#fff}
.fsim .fs-sp b{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9px;
  background:#E7E0EC;color:#49454F;font-size:11px}
.fsim .fs-sp.fs-past{color:var(--fs-ink);border-color:#C9A6EE}
.fsim .fs-sp.fs-past b{background:#C9A6EE;color:#fff}
.fsim .fs-sp.fs-cur{background:var(--fs-accent);border-color:var(--fs-accent);color:#fff}
.fsim .fs-sp.fs-cur b{background:#fff;color:var(--fs-accent)}
.fsim .fs-view{align-self:flex-start}
.fsim .fs-trig{background:rgba(242,192,105,.22);border-radius:3px;padding:0 2px}
.fsim .fs-row2{flex:1 1 100%;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;min-width:0}
.fsim .fs-row2 > .fs-dark{flex:1 1 420px;min-width:0}
.fsim .fs-row2 > .fs-panel{flex:1 1 240px;min-width:0}
.fsim .fs-sv{color:#E9D5FF;font-weight:700;background:rgba(201,166,238,.22);border-radius:3px;padding:0 2px}
.fsim .fs-code-line.fs-bind{border-left-color:rgba(201,166,238,.7)}
.fsim .fs-code-line.fs-bind.fs-on{border-left-color:#F9E2AF}
.fsim .fs-caption{font-size:14px;min-height:42px;color:var(--fs-ink)}
.fsim .fs-steps{display:flex;flex-wrap:wrap;gap:6px}
.fsim .fs-step{font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:12px;padding:3px 9px;border-radius:12px;
  border:1px solid var(--fs-line);color:#9E9AA7;background:#fff}
.fsim .fs-step.fs-done{color:var(--fs-ink);border-color:var(--fs-accent);background:var(--fs-accent-soft)}
.fsim .fs-step.fs-dead{color:#fff;border-color:#625B71;background:#625B71}
.fsim .fs-list-title{font-size:13px;font-weight:600;color:#49454F;margin:2px 0 6px}
.fsim .fs-seg{display:inline-flex;border:1px solid var(--fs-accent);border-radius:20px;overflow:hidden}
.fsim .fs-seg button{border:0;background:#fff;color:var(--fs-accent);padding:6px 14px;font:500 13px Roboto,Arial,sans-serif;cursor:pointer}
.fsim .fs-seg button.fs-sel{background:var(--fs-accent);color:#fff}
@container (max-width:780px){.fsim .fs-code-line{font-size:11px}}
@media (max-width:480px){.fsim{padding:12px;gap:12px}.fsim .fs-tree{padding-left:7px}.fsim .fs-node{font-size:11px;padding:2px 6px;gap:5px}.fsim .fs-panel{padding:10px 8px}.fsim .fs-code-line{font-size:9.5px;padding:0 6px}}
`;

const ensureStyle = () => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
};

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  });
  children.flat().forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
};

const flash = (node) => {
  if (!node) return;
  node.classList.remove('fs-flash');
  void node.offsetWidth;
  node.classList.add('fs-flash');
};

const DART_KEYWORDS = new Set(['class', 'extends', 'void', 'return', 'final', 'const', 'if', 'for', 'in', 'this', 'super', 'late', 'true', 'false', 'try', 'on', 'catch', 'async', 'await', 'is']);
const DART_TYPES = new Set(['int', 'String', 'List', 'Widget', 'State', 'StatefulWidget', 'StatelessWidget', 'BuildContext', 'Scaffold', 'Text', 'TextEditingController', 'Column', 'Song', 'SongCard', 'FloatingActionButton', 'TextField', 'MyHomePage', 'GreetingScreen', 'Future', 'AuthResponse', 'Supabase', 'Emitter', 'Exception', 'Navigator',
  'RegisterBloc', 'RegisterState', 'OnRegisterSubmittedEvent', 'RegisterLoadingState', 'RegisterSuccessState', 'RegisterErrorState',
  'BlocListener', 'BlocBuilder']);
const DART_TOKEN = /('[^']*')|(@\w+)|(\b\d+\b)|(\b[A-Za-z_]\w*\b)/g;

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlightDart = (line) => {
  let html = '';
  let last = 0;
  line.replace(DART_TOKEN, (match, str, ann, num, word, offset) => {
    html += escapeHtml(line.slice(last, offset));
    last = offset + match.length;
    const kind = str ? 'fs-str' : ann ? 'fs-ann' : num ? 'fs-num' : DART_KEYWORDS.has(word) ? 'fs-kw' : DART_TYPES.has(word) ? 'fs-type' : '';
    html += kind ? `<span class="${kind}">${escapeHtml(match)}</span>` : escapeHtml(match);
    return match;
  });
  return html + escapeHtml(line.slice(last));
};

const codePanel = (title) => {
  const box = el('div', { class: 'fs-dark' }, el('h4', { text: title }));
  const body = el('div');
  box.appendChild(body);
  let lines = [];
  const setCode = (source) => {
    body.replaceChildren();
    lines = source.split('\n').map((line) => {
      const node = el('div', { class: 'fs-code-line' });
      node.innerHTML = highlightDart(line) || ' ';
      body.appendChild(node);
      return node;
    });
  };
  const mark = (...marked) => {
    lines.forEach((node, index) => node.classList.toggle('fs-on', marked.includes(index)));
  };
  return { box, setCode, mark, lineNodes: () => lines };
};

const consolePanel = (title = 'Consola de depuración') => {
  const log = el('div', { class: 'fs-log' });
  const box = el('div', { class: 'fs-dark' }, el('h4', { text: title }), log);
  const print = (text, kind) => {
    log.appendChild(el('div', { class: kind ? `fs-log-${kind}` : undefined, text }));
    while (log.childNodes.length > 40) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  };
  const clear = () => log.replaceChildren();
  return { box, print, clear };
};

const statePanel = (title) => {
  const heading = el('h4', { text: title });
  const rows = el('div');
  const box = el('div', { class: 'fs-panel' }, heading, rows);
  const known = new Map();
  const set = (entries) => {
    rows.replaceChildren();
    entries.forEach(([name, value]) => {
      const row = el('div', { class: 'fs-row' }, el('span', { text: name }), el('span', { text: value }));
      rows.appendChild(row);
      if (known.has(name) && known.get(name) !== value) flash(row);
      known.set(name, value);
    });
  };
  const setTitle = (text) => {
    heading.textContent = text;
  };
  return { box, set, setTitle };
};

const phone = (title) => {
  const titleNode = el('span', { text: title });
  const extra = el('small');
  const appbar = el('div', { class: 'fs-appbar' }, titleNode, extra);
  const body = el('div', { class: 'fs-body' });
  const frame = el(
    'div',
    { class: 'fs-phone' },
    el('div', { class: 'fs-status' }, el('span', { text: '9:41' }), el('span', { text: '5G' })),
    appbar,
    body
  );
  return {
    frame,
    body,
    appbar,
    setTitle: (text) => {
      titleNode.textContent = text;
    },
    setExtra: (text) => {
      extra.textContent = text;
    },
  };
};

const switchControl = (label, onChange) => {
  const input = el('input', { type: 'checkbox', onchange: (e) => onChange(e.target.checked) });
  return { node: el('label', { class: 'fs-switch' }, input, label), input };
};

const card = (root) => {
  ensureStyle();
  const container = el('div', { class: 'fsim' });
  root.replaceChildren(container);
  return container;
};

// ───────────────────────── state-counter / hot-reload ─────────────────────────

const COUNTER_CODE = `class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    print('build() con _counter = $_counter');
    return Scaffold(
      body: Text('$_counter'),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
      ),
    );
  }
}`;

const COUNTER_CODE_FORGOT = `class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    _counter++;
  }

  @override
  Widget build(BuildContext context) {
    print('build() con _counter = $_counter');
    return Scaffold(
      body: Text('$_counter'),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
      ),
    );
  }
}`;

const mountCounter = (root, args = []) => {
  const withReload = args.includes('reload');
  const withForget = !withReload || args.includes('forget');
  const container = card(root);
  const timers = [];

  let counter = 0;
  let shown = 0;
  let builds = 0;
  let forgot = false;
  let stateId = 1;

  const screen = phone('Flutter Demo Home Page');
  const big = el('div', { class: 'fs-big', 'data-testid': 'counter-text', text: '0' });
  screen.body.appendChild(
    el('div', { class: 'fs-center' }, el('div', { text: 'You have pushed the button this many times:' }), big)
  );
  const fab = el('button', { class: 'fs-fab', 'aria-label': 'Incrementar', text: '+' });
  screen.body.appendChild(fab);

  const note = el('div', { class: 'fs-note' });
  const code = codePanel('lib/main.dart');
  const state = statePanel('Objeto State');
  const logs = consolePanel();

  const renderState = () => {
    state.setTitle(`Objeto State · _MyHomePageState #${stateId}`);
    state.set([
      ['_counter', String(counter)],
      ['en pantalla', String(shown)],
      ['veces que corrió build()', String(builds)],
    ]);
  };

  const build = (reason) => {
    builds += 1;
    shown = counter;
    big.textContent = String(shown);
    flash(big);
    logs.print(`[${reason}] build() con _counter = ${counter}`);
    renderState();
  };

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  fab.addEventListener('click', () => {
    if (forgot) {
      counter += 1;
      code.mark(3, 4);
      note.textContent = 'El valor cambió en el objeto State, pero nadie pidió reconstruir: la pantalla sigue igual.';
      note.className = 'fs-note fs-warn';
      renderState();
      return;
    }
    code.mark(4, 5);
    counter += 1;
    note.textContent = 'setState marca el State como sucio y Flutter vuelve a llamar a build().';
    note.className = 'fs-note';
    renderState();
    later(() => {
      code.mark(10, 11, 13);
      build('setState');
    }, 350);
  });

  const controls = el('div', { class: 'fs-controls' });
  if (withForget) {
    const toggle = switchControl('Olvidar setState', (checked) => {
      forgot = checked;
      code.setCode(checked ? COUNTER_CODE_FORGOT : COUNTER_CODE);
      note.textContent = checked
        ? 'Ahora _incrementCounter solo suma. Pulsa + y mira el panel y la pantalla.'
        : '';
      note.className = 'fs-note';
    });
    controls.appendChild(toggle.node);
  }
  if (withReload) {
    controls.appendChild(
      el('button', {
        class: 'fs-btn',
        text: 'Hot reload',
        onclick: () => {
          logs.print('Reloaded 1 of 612 libraries in 210ms.', 'ok');
          code.mark(10, 11);
          note.textContent = 'Hot reload vuelve a correr build() con el mismo objeto State: el contador se conserva.';
          note.className = 'fs-note';
          build('hot reload');
        },
      })
    );
    controls.appendChild(
      el('button', {
        class: 'fs-btn',
        text: 'Hot restart',
        onclick: () => {
          logs.print('Restarted application in 900ms.', 'ok');
          stateId += 1;
          counter = 0;
          code.mark(1);
          note.textContent = 'Hot restart crea la app desde cero: un State nuevo, y _counter vuelve a 0.';
          note.className = 'fs-note';
          build('hot restart');
        },
      })
    );
  }

  code.setCode(COUNTER_CODE);
  container.append(
    el('div', { class: 'fs-col' }, screen.frame, controls, note),
    el('div', { class: 'fs-side' }, state.box, code.box, logs.box)
  );
  build('primer build');

  return () => {
    timers.forEach(clearTimeout);
    root.replaceChildren();
  };
};

// ───────────────────────────────── state-tree ─────────────────────────────────

// The widget tree next to the State's variables, joined by lines from each variable
// to the widgets that read it. A tap plays the steps of setState one by one.

const STEP_MS = 1100;
const DOT_MS = 700;
let treeUid = 0;

const raf = (fn) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : setTimeout(fn, 16));
const cancelRaf = (id) => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id));
const SVG_NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
};
const showValue = (value) => (typeof value === 'string' ? `'${value}'` : String(value));

const bulbIcon = (on) => {
  const icon = svgEl('svg', { viewBox: '0 0 24 24', width: '96', height: '96' });
  icon.appendChild(svgEl('path', {
    d: 'M9 21h6v-1H9v1zm3-19a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z',
    fill: on ? '#F5B800' : 'none',
    stroke: on ? '#B78900' : '#9E9AA7',
    'stroke-width': '1.6',
  }));
  return icon;
};

const TREE_SCENARIOS = {
  counter: {
    app: 'MyApp',
    widget: 'MyHomePage',
    state: '_MyHomePageState',
    vars: [{ name: '_counter', type: 'int', initial: 0 }],
    fn: '_incrementCounter()',
    next: (v) => ({ _counter: v._counter + 1 }),
    nodes: [
      { key: 'scaffold', depth: 0, label: () => 'Scaffold' },
      { key: 'appbar', depth: 1, label: () => 'AppBar' },
      { key: 'text', depth: 1, label: (v) => `Text('${v._counter}')`, reads: '_counter' },
      { key: 'fab', depth: 1, label: () => 'FloatingActionButton', trigger: true },
    ],
    code: `class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Contador')),
      body: Text('$_counter'),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _incrementCounter(),
        child: Icon(Icons.add),
      ),
    );
  }
}`,
    file: 'lib/main.dart',
    forgetCode: `class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    _counter++;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Contador')),
      body: Text('$_counter'),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _incrementCounter(),
        child: Icon(Icons.add),
      ),
    );
  }
}`,
    triggerName: () => '+',
    idle: 'Pulsa + y sigue los pasos: primero cambia el estado y al final la pantalla.',
    read: (v) => `Mientras construye, build() lee _counter: el Text nuevo recibe '${v._counter}'.`,
    paint: (v) => `Flutter pinta los widgets nuevos: la pantalla por fin muestra ${v._counter}.`,
    phone: (screen, onTrigger) => {
      screen.setTitle('Contador');
      const big = el('div', { class: 'fs-big', 'data-testid': 'tree-counter' });
      const fab = el('button', { class: 'fs-fab', 'aria-label': 'Incrementar', text: '+', onclick: onTrigger });
      screen.body.append(el('div', { class: 'fs-center' }, big), fab);
      return {
        trigger: fab,
        paint: (v) => {
          big.textContent = String(v._counter);
          flash(big);
        },
      };
    },
  },
  bulb: {
    app: 'App',
    widget: 'HomeScreen',
    state: '_HomeScreenState',
    vars: [{ name: '_isOn', type: 'bool', initial: false }],
    fn: '_toggle()',
    next: (v) => ({ _isOn: !v._isOn }),
    rebuild: true,
    nodes: [
      { key: 'scaffold', depth: 0, label: () => 'Scaffold' },
      { key: 'appbar', depth: 1, label: () => 'AppBar' },
      { key: 'center', depth: 1, label: () => 'Center' },
      { key: 'column', depth: 2, label: () => 'Column' },
      { key: 'icon', depth: 3, label: (v) => (v._isOn ? 'Icon(lightbulb)' : 'Icon(lightbulb_outline)'), reads: '_isOn' },
      { key: 'text', depth: 3, label: (v) => `Text('${v._isOn ? 'Encendido' : 'Apagado'}')`, reads: '_isOn' },
      { key: 'button', depth: 3, label: (v) => `FilledButton('${v._isOn ? 'Apagar' : 'Encender'}')`, reads: '_isOn', trigger: true },
    ],
    code: `class _HomeScreenState extends State<HomeScreen> {
  bool _isOn = false;

  void _toggle() {
    setState(() {
      _isOn = !_isOn;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Bombillo')),
      body: Center(
        child: Column(
          children: [
            Icon(_isOn
                ? Icons.lightbulb
                : Icons.lightbulb_outline),
            Text(_isOn ? 'Encendido' : 'Apagado'),
            FilledButton(
              onPressed: () => _toggle(),
              child: Text(
                _isOn ? 'Apagar' : 'Encender',
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
    file: 'lib/screens/home_screen.dart',
    triggerName: (v) => (v._isOn ? 'Apagar' : 'Encender'),
    idle: 'Pulsa Encender y sigue los pasos. Después prueba Reconstruir App.',
    read: () => 'Mientras construye, build() lee _isOn: el Icon, el Text y el FilledButton nuevos lo usan.',
    paint: (v) => `Flutter pinta los widgets nuevos: el bombillo queda ${v._isOn ? 'encendido' : 'apagado'}.`,
    phone: (screen, onTrigger) => {
      screen.setTitle('Bombillo');
      const iconBox = el('div');
      const label = el('div', { 'data-testid': 'bulb-text' });
      const button = el('button', { class: 'fs-btn fs-solid', onclick: onTrigger });
      screen.body.append(el('div', { class: 'fs-center' }, iconBox, label, button));
      return {
        trigger: button,
        paint: (v) => {
          iconBox.replaceChildren(bulbIcon(v._isOn));
          label.textContent = v._isOn ? 'Encendido' : 'Apagado';
          button.textContent = v._isOn ? 'Apagar' : 'Encender';
          flash(iconBox);
        },
      };
    },
  },
};

const mountTree = (root, args = []) => {
  const sc = TREE_SCENARIOS[args.includes('bulb') ? 'bulb' : 'counter'];
  const uid = ++treeUid;
  const container = card(root);
  const timers = [];
  const frames = new Set();
  let nextId = 1;
  const newId = () => nextId++;

  const initial = Object.fromEntries(sc.vars.map((v) => [v.name, v.initial]));
  const model = { vars: { ...initial }, built: { ...initial }, painted: { ...initial }, dirty: false };
  const appId = newId();
  let widgetId = newId();
  const stateId = newId();
  const ids = {};
  const renewIds = () => sc.nodes.forEach((n) => {
    ids[n.key] = newId();
  });
  renewIds();

  const screen = phone('');
  const phoneView = sc.phone(screen, () => start(toggleSteps));

  const treePanel = el('div', { class: 'fs-panel' });
  const varBoxes = {};
  const dirtyTag = el('span', { class: 'fs-tag' });
  const stateTitle = el('div', { class: 'fs-state-of' });
  const varRows = sc.vars.map((v) => {
    varBoxes[v.name] = el('span', { class: 'fs-var-val', 'data-testid': `var-${v.name}` });
    return el('div', { class: 'fs-var' },
      el('span', { class: 'fs-var-type', text: v.type }),
      el('span', { class: 'fs-var-name', text: v.name }),
      varBoxes[v.name]);
  });
  const statePanel = el('div', { class: 'fs-panel fs-state-box' },
    el('div', { class: 'fs-state-head' }, el('h4', { text: 'Estado' })),
    ...varRows,
    el('div', { class: 'fs-state-foot' }, stateTitle, dirtyTag));
  const stepBar = el('div', { class: 'fs-stepbar' });
  const caption = el('div', { class: 'fs-caption', 'data-testid': 'tree-caption' });
  const stepsPanel = el('div', { class: 'fs-panel' }, stepBar, caption);

  const code = codePanel(sc.file);
  const varNames = sc.vars.map((v) => v.name);
  const codeLines = {};
  const applyCode = (text) => {
    code.setCode(text);
    const source = text.split('\n');
    const buildAt = source.findIndex((l) => l.includes('Widget build('));
    const findLines = (test) => source.map((l, i) => (test(l, i) ? i : -1)).filter((i) => i >= 0);
    Object.assign(codeLines, {
      trigger: findLines((l) => l.includes('onPressed')),
      set: findLines((l, i) => i < buildAt && (l.includes('setState(') || varNames.some((n) => l.trim().startsWith(n)))),
      build: [buildAt],
      reads: findLines((l, i) => i > buildAt && varNames.some((n) => l.includes(n))),
    });
    decorateCode();
  };
  const decorateCode = () => code.lineNodes().forEach((line, i) => {
    varNames.forEach((n) => {
      line.innerHTML = line.innerHTML.replace(new RegExp(`\\b${n}\\b`, 'g'), `<span class="fs-sv">${n}</span>`);
    });
    if (codeLines.reads.includes(i)) line.classList.add('fs-bind');
    if (codeLines.trigger.includes(i)) {
      line.innerHTML = line.innerHTML.replace('onPressed', '<span class="fs-trig">onPressed</span>');
    }
  });
  applyCode(sc.code);

  const codeAt = (key) => code.mark(...(codeLines[key] || []));

  const lines = svgEl('svg', { class: 'fs-lines', 'aria-hidden': 'true' });
  let view = 'tree';
  const treeTab = el('button', { text: 'Árbol de widgets', class: 'fs-sel' });
  const codeTab = el('button', { text: 'Código' });
  const showView = (next) => {
    view = next;
    treeTab.className = next === 'tree' ? 'fs-sel' : '';
    codeTab.className = next === 'code' ? 'fs-sel' : '';
    treePanel.hidden = next !== 'tree';
    code.box.hidden = next !== 'code';
    scheduleLines();
  };
  treeTab.addEventListener('click', () => showView('tree'));
  codeTab.addEventListener('click', () => showView('code'));
  const viewSwitch = el('div', { class: 'fs-seg fs-view', role: 'group', 'aria-label': 'Vista' }, treeTab, codeTab);
  code.box.hidden = true;
  const side = el('div', { class: 'fs-side fs-rel' }, viewSwitch, treePanel, code.box, statePanel, stepsPanel);
  side.appendChild(lines);

  const nodeEls = {};
  const node = (key, label, id, kind) => {
    const n = el('span', { class: `fs-node ${kind || ''}`, 'data-node': key },
      el('b', { text: label }), el('span', { class: 'fs-id', text: `#${id}` }));
    nodeEls[key] = n;
    return n;
  };

  const nest = (items) => {
    const rootList = el('ul', { class: 'fs-tree' });
    const stack = [{ depth: -1, list: rootList }];
    items.forEach(({ depth, content }) => {
      while (stack[stack.length - 1].depth >= depth) stack.pop();
      const item = el('li', {}, content);
      stack[stack.length - 1].list.appendChild(item);
      const sub = el('ul', { class: 'fs-tree' });
      item.appendChild(sub);
      stack.push({ depth, list: sub });
    });
    rootList.querySelectorAll('ul').forEach((u) => {
      if (!u.childNodes.length) u.remove();
    });
    return rootList;
  };

  const renderTree = () => {
    const pageRow = el('div', { class: 'fs-pair' },
      node('widget', sc.widget, widgetId, 'fs-stateful'),
      el('span', { class: 'fs-link', text: 'createState() →' }),
      node('state', sc.state, stateId, 'fs-state'));
    const children = nest(sc.nodes.map((n) => ({
      depth: n.depth,
      content: node(n.key, n.label(model.built), ids[n.key], n.reads ? 'fs-reads' : ''),
    })));
    treePanel.replaceChildren(
      el('h4', { text: 'Árbol de widgets · #n = número de objeto' }),
      el('ul', { class: 'fs-tree fs-tree-root' },
        el('li', {}, node('app', sc.app, appId), el('ul', { class: 'fs-tree' }, el('li', {}, pageRow, children)))));
    scheduleLines();
  };

  const renderState = () => {
    stateTitle.textContent = `vive en ${sc.state} #${stateId}`;
    sc.vars.forEach((v) => {
      varBoxes[v.name].textContent = showValue(model.vars[v.name]);
    });
    const stale = sc.vars.some((v) => model.vars[v.name] !== model.painted[v.name]);
    dirtyTag.textContent = model.dirty ? 'sucio: pide build()' : stale ? 'Flutter no se enteró' : 'al día';
    dirtyTag.className = model.dirty ? 'fs-tag fs-dirty' : stale ? 'fs-tag fs-lost' : 'fs-tag';
    scheduleLines();
  };

  // Lines: each variable to every widget that reads it, plus the transient write path.
  const paths = {};
  const markerId = (name) => `fsim-tree${uid}-${name}`;
  const defs = svgEl('defs');
  [['read', '#9061DB'], ['write', '#D08A12']].forEach(([name, color]) => {
    const marker = svgEl('marker', {
      id: markerId(name), viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse',
    });
    marker.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 L2.4,5 Z', fill: color }));
    defs.appendChild(marker);
  });
  lines.appendChild(defs);
  const readers = sc.nodes.filter((n) => n.reads);
  readers.forEach((n) => {
    paths[n.key] = svgEl('path', { class: 'fs-read', 'marker-end': `url(#${markerId('read')})` });
    lines.appendChild(paths[n.key]);
  });
  const triggerNode = sc.nodes.find((n) => n.trigger);
  paths.write = svgEl('path', { class: 'fs-write', 'marker-end': `url(#${markerId('write')})` });
  lines.appendChild(paths.write);

  const box = (target, base) => {
    const r = target.getBoundingClientRect();
    return { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top,
      cx: (r.left + r.right) / 2 - base.left, cy: (r.top + r.bottom) / 2 - base.top };
  };

  // Every reader of a variable hangs from one vertical trunk placed right of the widest
  // node it passes by, so the branches never cross each other or a node.
  const drawLines = () => {
    const base = side.getBoundingClientRect();
    const inCode = view === 'code';
    const textBox = (line) => {
      const range = typeof document.createRange === 'function' ? document.createRange() : null;
      if (!range || typeof range.getBoundingClientRect !== 'function') return box(line, base);
      range.selectNodeContents(line);
      const r = range.getBoundingClientRect();
      const lineBox = box(line, base);
      return { ...lineBox, l: r.left - base.left, r: r.right - base.left + 6 };
    };
    const all = inCode
      ? code.lineNodes().map(textBox)
      : Object.values(nodeEls).map((n) => box(n, base));
    const bindLine = (n) => code.lineNodes()[codeLines.reads[readers.indexOf(n)] ?? codeLines.reads[0]];
    sc.vars.forEach((v) => {
      const from = box(varBoxes[v.name], base);
      const mine = readers.filter((n) => n.reads === v.name);
      if (!mine.length) return;
      const targets = mine.map((n) => (inCode ? textBox(bindLine(n)) : box(nodeEls[n.key], base)));
      const top = Math.min(...targets.map((t) => t.cy));
      const passed = all.filter((b) => b.b >= top - 2 && b.t <= from.cy);
      const room = base.width - 6;
      const trunk = Math.min(room, Math.max(from.r, ...passed.map((b) => b.r)) + (room > 520 ? 36 : 14));
      mine.forEach((n, i) => {
        const to = targets[i];
        const r = Math.min(10, Math.abs(from.cy - to.cy) / 2);
        paths[n.key].setAttribute('d',
          `M${from.r},${from.cy} H${trunk - r} Q${trunk},${from.cy} ${trunk},${from.cy - r} `
          + `V${to.cy + r} Q${trunk},${to.cy} ${trunk - r},${to.cy} H${to.r + 4}`);
      });
    });
    const to = box(varBoxes[sc.vars[0].name], base);
    if (inCode) {
      const from = textBox(code.lineNodes()[codeLines.trigger[0]]);
      const out = Math.min(base.width - 4, Math.max(...all.map((b) => b.r)) + 24);
      paths.write.setAttribute('d',
        `M${from.r},${from.cy} H${out} V${to.t - 22} H${to.cx} V${to.t - 4}`);
      return;
    }
    const from = box(nodeEls[triggerNode.key], base);
    paths.write.setAttribute('d',
      `M${from.cx},${from.b} C${from.cx},${from.b + 40} ${to.cx},${to.t - 40} ${to.cx},${to.t - 4}`);
  };

  let linesQueued = false;
  const scheduleLines = () => {
    if (linesQueued) return;
    linesQueued = true;
    const id = raf(() => {
      frames.delete(id);
      linesQueued = false;
      drawLines();
    });
    frames.add(id);
  };

  const travel = (path, color) => {
    if (typeof path.getTotalLength !== 'function') return;
    const dot = svgEl('circle', { r: '6', fill: color, class: 'fs-dot' });
    lines.appendChild(dot);
    const total = path.getTotalLength();
    const begin = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - begin) / DOT_MS);
      const p = path.getPointAtLength(total * k);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      if (k < 1) {
        const id = raf(tick);
        frames.add(id);
      } else {
        dot.remove();
      }
    };
    const id = raf(tick);
    frames.add(id);
  };

  const hot = (...keys) => {
    Object.values(nodeEls).forEach((n) => n.classList.remove('fs-hot'));
    keys.forEach((k) => nodeEls[k]?.classList.add('fs-hot'));
  };
  const activeLines = (keys) => {
    Object.entries(paths).forEach(([k, p]) => p.classList.toggle('fs-active', keys.includes(k)));
  };
  const pop = (target, kind = 'fs-pop') => {
    target.classList.remove(kind);
    void target.offsetWidth;
    target.classList.add(kind);
  };

  let forgot = false;
  const forgottenSteps = () => {
    const before = { ...model.vars };
    const after = sc.next(before);
    const v = sc.vars[0].name;
    return {
      names: ['Toque', `${v} cambia`, 'Sin build()'],
      steps: [
        {
          caption: `Pulsaste ${sc.triggerName(model.painted)}: onPressed llama a ${sc.fn}.`,
          fx: () => {
            pop(phoneView.trigger, 'fs-press');
            hot(triggerNode.key);
            codeAt('trigger');
            activeLines(['write']);
            travel(paths.write, '#D08A12');
          },
        },
        {
          caption: `${sc.fn} cambia ${v} de ${showValue(before[v])} a ${showValue(after[v])}, pero no llama a setState.`,
          apply: () => {
            model.vars = after;
            renderState();
          },
          fx: () => {
            Object.values(varBoxes).forEach(pop);
            hot('state');
            codeAt('set');
          },
        },
        {
          caption: `Flutter no se enteró: build() no corre y la pantalla sigue en ${showValue(model.painted[v])}. Sin error, sin aviso.`,
          fx: () => {
            hot();
            codeAt('none');
            activeLines([]);
          },
        },
      ],
    };
  };

  const toggleSteps = () => {
    if (forgot) return forgottenSteps();
    const before = { ...model.vars };
    const after = sc.next(before);
    const v = sc.vars[0].name;
    return {
      names: ['Toque', 'setState', 'build()', 'Leer el estado', 'Pantalla'],
      steps: [
        {
          caption: `Pulsaste ${sc.triggerName(model.painted)}: onPressed llama a ${sc.fn}.`,
          fx: () => {
            pop(phoneView.trigger, 'fs-press');
            hot(triggerNode.key);
            codeAt('trigger');
            activeLines(['write']);
            travel(paths.write, '#D08A12');
          },
        },
        {
          caption: `Dentro de setState, ${v} pasa de ${showValue(before[v])} a ${showValue(after[v])} y el State queda sucio. La pantalla todavía no cambia.`,
          apply: () => {
            model.vars = after;
            model.dirty = true;
            renderState();
          },
          fx: () => {
            Object.values(varBoxes).forEach(pop);
            hot('state');
            codeAt('set');
          },
        },
        {
          caption: `Flutter llama build() de ${sc.state}: los widgets se crean otra vez, como objetos nuevos (mira los #). El State es el mismo, #${stateId}.`,
          apply: () => {
            renewIds();
            renderTree();
          },
          fx: () => {
            activeLines([]);
            hot('state');
            codeAt('build');
            sc.nodes.forEach((n, i) => timers.push(setTimeout(() => flash(nodeEls[n.key]), i * 90)));
          },
        },
        {
          caption: sc.read(after),
          apply: () => {
            model.built = { ...model.vars };
            renderTree();
          },
          fx: () => {
            hot(...readers.map((n) => n.key));
            codeAt('reads');
            activeLines(readers.map((n) => n.key));
            readers.forEach((n) => travel(paths[n.key], '#9061DB'));
          },
        },
        {
          caption: sc.paint(after),
          apply: () => {
            model.painted = { ...model.built };
            model.dirty = false;
            phoneView.paint(model.painted);
            renderState();
          },
          fx: () => {
            hot();
            codeAt('none');
            activeLines([]);
          },
        },
      ],
    };
  };

  const rebuildSteps = () => ({
    names: [`${sc.app}.build()`, 'Mismo State', 'build()', 'Leer el estado', 'Pantalla'],
    steps: [
      {
        caption: `${sc.app} se reconstruye y crea un ${sc.widget} nuevo: el objeto viejo se descarta.`,
        apply: () => {
          widgetId = newId();
          renderTree();
        },
        fx: () => {
          hot('app', 'widget');
          codeAt('none');
          flash(nodeEls.widget);
        },
      },
      {
        caption: `Flutter le conecta al widget nuevo el mismo ${sc.state} #${stateId}, con el estado intacto.`,
        fx: () => {
          hot('widget', 'state');
          codeAt('none');
          Object.values(varBoxes).forEach(pop);
        },
      },
      {
        caption: `build() de ${sc.state} vuelve a correr y crea widgets nuevos.`,
        apply: () => {
          renewIds();
          renderTree();
        },
        fx: () => {
          hot('state');
          codeAt('build');
          sc.nodes.forEach((n, i) => timers.push(setTimeout(() => flash(nodeEls[n.key]), i * 90)));
        },
      },
      {
        caption: sc.read(model.vars),
        fx: () => {
          hot(...readers.map((n) => n.key));
          codeAt('reads');
          activeLines(readers.map((n) => n.key));
          readers.forEach((n) => travel(paths[n.key], '#9061DB'));
        },
      },
      {
        caption: 'La pantalla queda igual: el estado no se perdió con el widget viejo.',
        apply: () => phoneView.paint(model.painted),
        fx: () => {
          hot();
          codeAt('none');
          activeLines([]);
        },
      },
    ],
  });

  let run = null;
  let stepMode = false;
  const nextButton = el('button', { class: 'fs-btn', text: 'Siguiente paso', disabled: true });

  const drawBar = (names, current) => {
    stepBar.replaceChildren(...names.map((name, i) => {
      const kind = i === current ? 'fs-cur' : i < current ? 'fs-past' : '';
      return el('span', { class: `fs-sp ${kind}` }, el('b', { text: String(i + 1) }), name);
    }));
  };

  const clearTimers = () => {
    timers.splice(0).forEach(clearTimeout);
    frames.forEach(cancelRaf);
    frames.clear();
    linesQueued = false;
    lines.querySelectorAll('.fs-dot').forEach((d) => d.remove());
  };

  const settle = () => {
    run = null;
    nextButton.disabled = true;
    hot();
    codeAt('none');
    activeLines([]);
    phoneView.trigger.classList.remove('fs-press');
    scheduleLines();
  };

  const finishNow = () => {
    if (!run) return;
    clearTimers();
    run.plan.steps.slice(run.index + 1).forEach((s) => s.apply?.());
    drawBar(run.plan.names, run.plan.names.length);
    settle();
  };

  const play = (index) => {
    run.index = index;
    const step = run.plan.steps[index];
    drawBar(run.plan.names, index);
    caption.textContent = step.caption;
    step.apply?.();
    step.fx?.();
    const last = index === run.plan.steps.length - 1;
    if (last) {
      timers.push(setTimeout(() => {
        drawBar(run.plan.names, run.plan.names.length);
        settle();
      }, STEP_MS));
      return;
    }
    if (stepMode) {
      nextButton.disabled = false;
      return;
    }
    timers.push(setTimeout(() => play(index + 1), STEP_MS));
  };

  function start(makePlan) {
    finishNow();
    run = { plan: makePlan(), index: -1 };
    play(0);
  }

  nextButton.addEventListener('click', () => {
    if (!run || run.index >= run.plan.steps.length - 1) return;
    nextButton.disabled = true;
    play(run.index + 1);
  });

  const stepToggle = switchControl('Paso a paso', (checked) => {
    stepMode = checked;
    if (!checked && run && !nextButton.disabled) {
      nextButton.disabled = true;
      play(run.index + 1);
    }
  });

  const controls = el('div', { class: 'fs-controls' }, stepToggle.node, nextButton);
  if (sc.forgetCode && args.includes('forget')) {
    const forgetToggle = switchControl('Olvidar setState', (checked) => {
      finishNow();
      forgot = checked;
      applyCode(checked ? sc.forgetCode : sc.code);
      drawBar(toggleSteps().names, -1);
      caption.textContent = checked
        ? `Ahora ${sc.fn} no llama a setState. Pulsa ${sc.triggerName(model.painted)} varias veces.`
        : sc.idle;
      scheduleLines();
    });
    controls.prepend(forgetToggle.node);
  }
  if (sc.rebuild) {
    controls.prepend(el('button', { class: 'fs-btn', text: `Reconstruir ${sc.app}`, onclick: () => start(rebuildSteps) }));
  }

  container.append(el('div', { class: 'fs-col' }, screen.frame, controls), side);
  code.box.addEventListener('scroll', () => scheduleLines());
  phoneView.paint(model.painted);
  renderTree();
  renderState();
  drawBar(toggleSteps().names, -1);
  caption.textContent = sc.idle;

  const onResize = () => scheduleLines();
  window.addEventListener('resize', onResize);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
  observer?.observe(side);

  return () => {
    clearTimers();
    observer?.disconnect();
    window.removeEventListener('resize', onResize);
    root.replaceChildren();
  };
};

// ────────────────────────────── state-lifecycle ──────────────────────────────

const LIFECYCLE_CODE = `class _GreetingScreenState extends State<GreetingScreen> {
  late TextEditingController _nameController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _nameController,
      onChanged: (value) => setState(() {}),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }
}`;

const LIFECYCLE_STEPS = ['createState', 'initState', 'build', 'setState', 'dispose'];

const mountLifecycle = (root) => {
  const container = card(root);
  const timers = [];
  let open = false;
  let stateId = 0;
  let controllerId = 0;
  let controllerAlive = false;
  let builds = 0;
  let text = '';
  const done = new Set();

  const screen = phone('Inicio');
  const note = el('div', { class: 'fs-note' });
  const code = codePanel('lib/screens/greeting_screen.dart');
  const state = statePanel('Objeto State');
  const logs = consolePanel();
  const steps = el('div', { class: 'fs-steps' });
  const stepsPanel = el('div', { class: 'fs-panel' }, el('h4', { text: 'Ciclo de vida' }), steps);

  const drawSteps = () => {
    steps.replaceChildren(
      ...LIFECYCLE_STEPS.map((name) => {
        const kind = name === 'dispose' && done.has(name) ? 'fs-dead' : done.has(name) ? 'fs-done' : '';
        return el('span', { class: `fs-step ${kind}`, text: name });
      })
    );
  };

  const renderState = () => {
    if (!stateId) {
      state.setTitle('Objeto State · todavía no existe');
      state.set([['_nameController', '—']]);
      return;
    }
    state.setTitle(`Objeto State · _GreetingScreenState #${stateId}${open ? '' : ' (desmontado)'}`);
    state.set([
      ['_nameController', controllerAlive ? `#${controllerId} activo` : `#${controllerId} liberado`],
      ['_nameController.text', `'${text}'`],
      ['mounted', String(open)],
      ['veces que corrió build()', String(builds)],
    ]);
  };

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const drawHome = () => {
    screen.setTitle('Inicio');
    screen.body.replaceChildren(
      el(
        'div',
        { class: 'fs-center' },
        el('div', { text: 'Pantalla de inicio' }),
        el('button', { class: 'fs-btn fs-solid', text: 'Abrir saludo', onclick: openScreen })
      )
    );
  };

  const greeting = el('div', { class: 'fs-big', style: 'font-size:22px' });
  const field = el('input', { class: 'fs-field', placeholder: 'Escribe tu nombre', 'aria-label': 'Nombre' });

  const build = () => {
    builds += 1;
    greeting.textContent = text ? `Hola, ${text}` : 'Hola';
    done.add('build');
    drawSteps();
    renderState();
  };

  const drawGreeting = () => {
    screen.setTitle('Saludo');
    field.value = '';
    screen.body.replaceChildren(
      el('div', { class: 'fs-label', text: 'Nombre' }),
      field,
      greeting,
      el('div', { style: 'height:16px' }),
      el('button', { class: 'fs-btn', text: 'Guardar (tarda 2 s)', onclick: saveLater }),
      el('div', { style: 'height:8px' }),
      el('button', { class: 'fs-btn fs-solid', text: 'Volver', onclick: closeScreen })
    );
  };

  function openScreen() {
    open = true;
    stateId += 1;
    text = '';
    done.clear();
    done.add('createState');
    logs.print(`createState() → _GreetingScreenState #${stateId}`);
    code.mark(0);
    drawGreeting();
    later(() => {
      controllerId += 1;
      controllerAlive = true;
      done.add('initState');
      code.mark(4, 6);
      logs.print(`initState(): se crea TextEditingController #${controllerId}`);
      renderState();
      drawSteps();
    }, 300);
    later(() => {
      code.mark(10, 11);
      logs.print('build()');
      build();
      note.textContent = 'Escribe en el campo: cada letra llama a setState y vuelve a correr build().';
    }, 700);
    renderState();
    drawSteps();
  }

  function closeScreen() {
    if (!open) return;
    open = false;
    controllerAlive = false;
    done.add('dispose');
    code.mark(18, 19);
    logs.print(`dispose(): se libera TextEditingController #${controllerId}`, 'ok');
    note.textContent = 'La pantalla se cerró: el State se descarta y el controller se libera en dispose().';
    drawHome();
    renderState();
    drawSteps();
  }

  function saveLater() {
    const savedFrom = stateId;
    logs.print('Guardando… en 2 s se llama setState para mostrar «Guardado».');
    later(() => {
      if (open && stateId === savedFrom) {
        code.mark(13);
        logs.print('setState(): Guardado', 'ok');
        build();
        greeting.textContent = `${greeting.textContent} · Guardado`;
        return;
      }
      logs.print(`setState() called after dispose(): _GreetingScreenState#${savedFrom}`, 'err');
      note.textContent = 'El State ya no existe. Antes de llamar a setState tras una espera: if (!mounted) return;';
      note.className = 'fs-note fs-warn';
    }, 2000);
  }

  field.addEventListener('input', () => {
    text = field.value;
    done.add('setState');
    code.mark(13);
    logs.print(`setState() → build() con text = '${text}'`);
    build();
  });

  code.setCode(LIFECYCLE_CODE);
  drawHome();
  drawSteps();
  renderState();
  container.append(
    el('div', { class: 'fs-col' }, screen.frame, note),
    el('div', { class: 'fs-side' }, stepsPanel, state.box, code.box, logs.box)
  );
  note.textContent = 'Abre la pantalla de saludo, escribe y vuelve.';

  return () => {
    timers.forEach(clearTimeout);
    root.replaceChildren();
  };
};

// ───────────────────────────────── playlist ─────────────────────────────────

const DEFAULT_IMAGE = 'https://picsum.photos/400';

const PLAYLIST_ADD = `void _addSong() {
  setState(() {
    _songs.add(Song(
      title: _titleController.text,
      artist: _artistController.text,
      imageUrl: _imageUrlController.text,
    ));
  });
}`;

const PLAYLIST_TEXT_VIEW = `

Column(
  children: [
    for (final song in _songs) Text('\${song.title} · \${song.artist}'),
  ],
)`;

const PLAYLIST_CARD_VIEW = `

Column(
  children: [
    for (final song in _songs) SongCard(song: song),
  ],
)`;

const mountPlaylist = (root, args = []) => {
  const withCards = args.includes('cards');
  let view = withCards ? 'cards' : 'text';
  const container = card(root);
  const songs = [];

  const screen = phone('Mi playlist');
  const note = el('div', { class: 'fs-note' });
  const code = codePanel('lib/screens/playlist_screen.dart');
  const state = statePanel('Objeto State · _PlaylistScreenState');
  const logs = consolePanel();

  const titleField = el('input', { class: 'fs-field', placeholder: 'Nombre de la canción', 'aria-label': 'Nombre de la canción' });
  const artistField = el('input', { class: 'fs-field', placeholder: 'Artista', 'aria-label': 'Artista' });
  const imageField = el('input', { class: 'fs-field', 'aria-label': 'URL de la imagen', placeholder: DEFAULT_IMAGE });
  const addButton = el('button', { class: 'fs-filled', text: 'Agregar' });
  const list = el('div', { 'data-testid': 'playlist-list' });

  const songCard = (song) => {
    const cover = el('div', { class: 'fs-cover' });
    if (song.imageUrl) {
      const img = el('img', { src: song.imageUrl, alt: '' });
      img.addEventListener('error', () => img.remove());
      cover.appendChild(img);
    }
    return el(
      'div',
      { class: 'fs-card' },
      cover,
      el(
        'div',
        { class: 'fs-card-text' },
        el('div', { class: 'fs-card-title', text: song.title }),
        el('div', { class: 'fs-card-artist', text: song.artist })
      ),
      el('span', { class: 'fs-card-icon', text: '♪' })
    );
  };

  const renderState = () => {
    const entries = [
      ['_titleController.text', `'${titleField.value}'`],
      ['_artistController.text', `'${artistField.value}'`],
      ['_imageUrlController.text', `'${imageField.value}'`],
      ['_songs.length', String(songs.length)],
    ];
    songs.slice(-4).forEach((song, index) => {
      const position = songs.length - Math.min(4, songs.length) + index;
      entries.push([`_songs[${position}]`, `Song('${song.title}', '${song.artist}')`]);
    });
    state.set(entries);
  };

  const build = () => {
    list.replaceChildren();
    songs.forEach((song) => {
      list.appendChild(
        view === 'cards' ? songCard(song) : el('div', { class: 'fs-text-item', text: `${song.title} · ${song.artist}` })
      );
    });
    renderState();
  };

  const setView = (next) => {
    view = next;
    code.setCode(PLAYLIST_ADD + (view === 'cards' ? PLAYLIST_CARD_VIEW : PLAYLIST_TEXT_VIEW));
    logs.print(`build() con la vista ${view === 'cards' ? 'SongCard' : 'Text'}: el estado (_songs) es el mismo.`);
    build();
  };

  const addSong = () => {
    const title = titleField.value;
    const artist = artistField.value;
    songs.push({ title, artist, imageUrl: imageField.value });
    code.mark(1, 2);
    logs.print(`setState(): _songs.add(Song('${title}', '${artist}')) → build() con ${songs.length} canciones`);
    if (!title && !artist) {
      note.textContent = 'Con los campos vacíos también se agrega: una canción vacía. Se arregla en el taller.';
      note.className = 'fs-note fs-warn';
    } else {
      note.textContent = 'La lista del estado creció y build() la volvió a pintar completa.';
      note.className = 'fs-note';
    }
    build();
    const last = list.lastChild;
    flash(last);
    if (last && typeof last.scrollIntoView === 'function') last.scrollIntoView({ block: 'nearest' });
  };

  addButton.addEventListener('click', addSong);
  [titleField, artistField, imageField].forEach((field) => {
    field.addEventListener('input', renderState);
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addSong();
    });
  });

  screen.body.append(
    el('div', { class: 'fs-label', text: 'Nombre de la canción' }),
    titleField,
    el('div', { class: 'fs-label', text: 'Artista' }),
    artistField,
    el('div', { class: 'fs-label', text: 'URL de la imagen' }),
    imageField,
    addButton,
    list
  );

  const controls = el('div', { class: 'fs-controls' });
  if (withCards) {
    const textButton = el('button', { text: 'Text' });
    const cardsButton = el('button', { text: 'SongCard', class: 'fs-sel' });
    const select = (next) => {
      textButton.className = next === 'text' ? 'fs-sel' : '';
      cardsButton.className = next === 'cards' ? 'fs-sel' : '';
      setView(next);
    };
    textButton.addEventListener('click', () => select('text'));
    cardsButton.addEventListener('click', () => select('cards'));
    controls.appendChild(el('div', { class: 'fs-seg', role: 'group', 'aria-label': 'Vista' }, textButton, cardsButton));
  }

  container.append(
    el('div', { class: 'fs-col' }, screen.frame, controls, note),
    el('div', { class: 'fs-side' }, state.box, code.box, logs.box)
  );
  code.setCode(PLAYLIST_ADD + (view === 'cards' ? PLAYLIST_CARD_VIEW : PLAYLIST_TEXT_VIEW));
  note.textContent = 'Escribe una canción y su artista, y pulsa Agregar.';
  build();

  return () => {
    root.replaceChildren();
  };
};

// ───────────────────────── register-layers / register-clean ─────────────────────────
// Lab 5 (Móviles, 262App3): the sign up screen on the left and, on the right, the
// layers the request goes through. register-layers is the lab as it stands (view,
// Bloc, Supabase SDK); register-clean is how it should end (presentation, domain, data).

const REG_STYLE_ID = 'fsim-reg-style';

const REG_CSS = `
.fsim .fr-phone{background:#F7F8FA;height:590px}
.fsim .fr-phone .fs-body{background:#F7F8FA}
.fsim .fr-phone .fs-appbar{background:#F7F8FA;color:#161A26;justify-content:center;font-weight:600}
.fsim .fr-h1{font-size:19px;font-weight:700;color:#161A26;margin:0 0 2px}
.fsim .fr-sub{font-size:12px;color:#79809A;margin:0 0 12px}
.fsim .fr-input{width:100%;border:1px solid #DDE1E8;border-radius:10px;background:#fff;padding:8px 10px;
  font:13px Roboto,Arial,sans-serif;margin-bottom:8px;color:#161A26}
.fsim .fr-input:focus{outline:2px solid #1F9D68;border-color:transparent}
.fsim .fr-btn{width:100%;height:40px;border:0;border-radius:10px;background:#1F9D68;color:#fff;
  font:600 14px Roboto,Arial,sans-serif;cursor:pointer;margin-top:4px}
.fsim .fr-btn:disabled{opacity:.5;cursor:default}
.fsim .fr-err{background:rgba(214,69,69,.08);color:#D64545;border-radius:10px;padding:8px 10px;font-size:12.5px;margin:4px 0 8px}
.fsim .fr-link{text-align:center;font-size:12px;color:#1F9D68;margin-top:10px}
.fsim .fr-center{display:flex;flex-direction:column;align-items:center;gap:10px;padding-top:24px;color:#161A26;font-size:13px}
.fsim .fr-spin{width:30px;height:30px;border:3px solid #CDEFE0;border-top-color:#1F9D68;border-radius:50%;animation:frSpin .9s linear infinite}
@keyframes frSpin{to{transform:rotate(360deg)}}
.fsim .fr-errtext{font-size:13px;color:#161A26;overflow-wrap:anywhere}
.fsim .fr-avatar{width:64px;height:64px;border-radius:50%;background:#3ECF8E;color:#fff;font-size:28px;font-weight:700;
  display:flex;align-items:center;justify-content:center;margin:4px auto 8px}
.fsim .fr-name{text-align:center;font-weight:700;font-size:16px;color:#161A26}
.fsim .fr-handle{text-align:center;font-size:12px;color:#79809A;margin-bottom:12px}
.fsim .fr-pf{background:#fff;border:1px solid #DDE1E8;border-radius:10px;padding:7px 10px;margin-bottom:6px}
.fsim .fr-pf small{display:block;font-size:10.5px;color:#79809A}
.fsim .fr-pf div{font-size:13px;color:#161A26;overflow-wrap:anywhere}
.fsim .fr-band{--b:#C4CBD8;--bg:#EFF1F5;--ink:#556074;border-radius:12px;border:1.5px solid var(--b);
  background:var(--bg);padding:8px 12px;transition:box-shadow .3s,opacity .3s;opacity:.72}
.fsim .fr-band.fr-on{opacity:1;box-shadow:0 0 0 3px #F2C069}
.fsim .fr-band.fr-view{--b:#C9A6EE;--bg:#F4EBFF;--ink:#7439B8}
.fsim .fr-band.fr-bloc{--b:#9DB8F2;--bg:#E8EFFE;--ink:#2F5BC4}
.fsim .fr-band.fr-sdk{--b:#86D3CA;--bg:#E3F6F3;--ink:#0F8478}
.fsim .fr-band.fr-ext{border-style:dashed}
.fsim .fr-band.fr-dom{--b:#F0C572;--bg:#FFF3DC;--ink:#A96C05}
.fsim .fr-band.fr-data{--b:#86D3CA;--bg:#E3F6F3;--ink:#0F8478}
.fsim .fr-band-body.fr-stack{flex-direction:column;align-items:stretch}
.fsim .fr-node.fr-hot{box-shadow:0 0 0 3px #F2C069}
.fsim .fr-node.fr-contract{border-style:dashed}
.fsim .fr-cols{display:flex;gap:8px;width:100%}
.fsim .fr-colb{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px}
.fsim .fr-colb .fr-node{max-width:100%;overflow-wrap:break-word;text-align:center}
.fsim .fr-center-row{width:100%;display:flex;justify-content:center;flex-wrap:wrap;gap:6px 10px;align-items:center}
.fsim .fr-down{font-size:11px;color:#556074;line-height:1}
.fsim .fr-strip{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 6px;margin-top:10px}
.fsim .fr-st{--b:#C4CBD8;--bg:#EFF1F5;--ink:#556074;font-size:12px;padding:3px 10px;border-radius:12px;border:1px solid var(--b);
  background:#fff;color:#9AA1B2;transition:background .3s,color .3s,box-shadow .3s}
.fsim .fr-st.fr-view{--b:#C9A6EE;--bg:#F4EBFF;--ink:#7439B8}
.fsim .fr-st.fr-bloc{--b:#9DB8F2;--bg:#E8EFFE;--ink:#2F5BC4}
.fsim .fr-st.fr-sdk,.fsim .fr-st.fr-data{--b:#86D3CA;--bg:#E3F6F3;--ink:#0F8478}
.fsim .fr-st.fr-dom{--b:#F0C572;--bg:#FFF3DC;--ink:#A96C05}
.fsim .fr-st.fr-on{background:var(--bg);color:var(--ink);font-weight:700;box-shadow:0 0 0 2px #F2C069}
.fsim .fr-st-sep{color:#C4CBD8;font-size:11px}
@container (max-width:560px){.fsim .fr-node{font-size:11px;padding:3px 6px}.fsim .fr-msg{font-size:10.5px}}
.fsim .fr-band-head{display:flex;justify-content:space-between;align-items:baseline;gap:4px 10px;flex-wrap:wrap}
.fsim .fr-band-name{font-size:11.5px;font-weight:700;letter-spacing:.08em;color:var(--ink)}
.fsim .fr-band-role{font-size:11.5px;color:#556074}
.fsim .fr-band-body{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin-top:6px}
.fsim .fr-node{font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:12.5px;font-weight:700;color:var(--ink);
  background:#fff;border:1.5px solid var(--b);border-radius:8px;padding:3px 8px}
.fsim .fr-chip{font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:11.5px;padding:2px 8px;border-radius:10px;
  background:#fff;border:1px dashed var(--b);color:#454C61;overflow-wrap:anywhere}
.fsim .fr-chip:empty{display:none}
.fsim .fr-gap{display:flex;gap:8px}
.fsim .fr-slot{flex:1 1 0;min-width:0;min-height:34px;display:flex;align-items:center;justify-content:center;padding:4px 0;position:relative}
.fsim .fr-slot::before{content:'';position:absolute;top:0;bottom:0;left:50%;border-left:1.5px dashed #C4CBD8}
.fsim .fr-gap-idle{position:relative;z-index:1;font-size:11px;color:#9AA1B2;background:#FBFBFD;padding:0 6px}
.fsim .fr-msg{position:relative;z-index:1;font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:11.5px;
  background:#fff;border:1.5px solid #556074;color:#161A26;border-radius:12px;padding:2px 10px;max-width:94%;
  overflow-wrap:anywhere;text-align:center;animation:frIn .45s ease-out}
.fsim .fr-msg.fr-up{border-color:#1F9D68;color:#14724B}
.fsim .fr-msg.fr-fail{border-color:#D64545;color:#B23434}
@keyframes frIn{0%{opacity:0;transform:translateY(var(--from,-8px))}100%{opacity:1;transform:none}}
.fsim .fr-msg.fr-up,.fsim .fr-msg.fr-fail{--from:8px}
.fsim .fr-db{display:flex;flex-wrap:wrap;gap:8px;width:100%}
.fsim .fr-table{flex:1 1 150px;min-width:0;background:#fff;border:1px solid #C4CBD8;border-radius:8px;padding:6px 8px}
.fsim .fr-table b{font-size:11.5px;font-family:'JetBrains Mono',Menlo,Consolas,monospace;color:#556074;display:block;margin-bottom:4px}
.fsim .fr-rowdb{font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:11px;padding:5px 8px;border-radius:6px;
  overflow-wrap:anywhere;color:#245C21;background:#D9F2D0;border:1px solid #7CC56A;margin-top:4px;font-weight:600}
.fsim .fr-rowdb.fs-flash{animation:frRowIn .9s ease-out}
@keyframes frRowIn{0%{transform:scale(.94);box-shadow:0 0 0 0 rgba(58,130,53,.5)}
  60%{transform:scale(1.03)}100%{transform:none;box-shadow:0 0 0 8px rgba(58,130,53,0)}}
.fsim .fr-none{font-size:11px;color:#9AA1B2}
.fsim .fr-later{font-size:11.5px;color:#79809A;border:1px dashed #C4CBD8;border-radius:8px;padding:4px 8px;text-align:center;margin-top:8px}
`;

const ensureRegStyle = () => {
  if (typeof document === 'undefined' || document.getElementById(REG_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = REG_STYLE_ID;
  style.textContent = REG_CSS;
  document.head.appendChild(style);
};

const REG_SCREEN_CODE = `void _submit() {
  if (username.isEmpty || fullName.isEmpty ||
      email.isEmpty || password.isEmpty) {
    _showError('Completa todos los campos');
    return;
  }
  if (password != _confirmPasswordController.text) {
    _showError('Las contraseñas no coinciden');
    return;
  }
  context.read<RegisterBloc>().add(
    OnRegisterSubmittedEvent(
      fullName: fullName, username: username,
      email: email, password: password),
  );
}

BlocListener<RegisterBloc, RegisterState>(
  listener: (context, state) {
    if (state is RegisterSuccessState) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  },
  child: BlocBuilder<RegisterBloc, RegisterState>(
    builder: (context, state) {
      if (state is RegisterIdleState) return registerForm();
      if (state is RegisterLoadingState) return Column(...);
      if (state is RegisterSuccessState) return SizedBox.shrink();
      if (state is RegisterErrorState) {
        return Text('Error \${state.errorMessage}');
      }
      return registerForm();
    },
  ),
)`;

const REG_BLOC_CODE = `Future<void> register(
  OnRegisterSubmittedEvent event,
  Emitter<RegisterState> emit,
) async {
  emit(RegisterLoadingState());
  try {
    AuthResponse response =
        await Supabase.instance.client.auth.signUp(
      email: event.email,
      password: event.password,
    );
    await Supabase.instance.client
        .from('profiles').insert({
      'id': response.user?.id,
      'username': event.username,
      'full_name': event.fullName,
      'email': event.email,
    });
    emit(RegisterSuccessState());
  } on Exception catch (e) {
    emit(RegisterErrorState(
      errorMessage: e.toString(),
    ));
  }
}`;

const REG_DEFAULTS = {
  username: 'ana',
  fullName: 'Ana Gómez',
  email: 'ana@icesi.edu.co',
  password: '123456',
  confirm: '123456',
};

const REG_FIELDS = [
  ['username', 'Nombre de usuario', 'text'],
  ['fullName', 'Nombre completo', 'text'],
  ['email', 'Correo', 'email'],
  ['password', 'Contraseña', 'password'],
  ['confirm', 'Confirmar contraseña', 'password'],
];

const fakeUuid = () => {
  const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`;
};

const authFailure = (users, email, password) => {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return {
      status: '400 · validation_failed',
      error: 'AuthApiException(message: Unable to validate email address: invalid format, statusCode: 400, code: validation_failed)',
    };
  }
  if (password.length < 6) {
    return {
      status: '422 · weak_password',
      error: 'AuthWeakPasswordException(message: Password should be at least 6 characters., statusCode: 422, code: weak_password)',
    };
  }
  if (users.some((user) => user.email === email)) {
    return {
      status: '422 · user_already_exists',
      error: 'AuthApiException(message: User already registered, statusCode: 422, code: user_already_exists)',
    };
  }
  return null;
};

// Shared shell of the two sign up simulators: the phone, the fake Supabase, the code
// panel and the step player. Each simulator brings its layers, its code files and its steps.
const createRegisterSim = (root, config) => {
  ensureRegStyle();
  const container = card(root);
  const timers = [];
  const values = { ...REG_DEFAULTS };
  const db = { users: [], profiles: [] };
  let steps = [];
  let stepIndex = 0;
  let running = false;
  let manual = false;
  let formError = null;
  let phoneView = 'form';

  const screen = phone('Crear cuenta');
  screen.frame.classList.add('fr-phone');
  screen.body.setAttribute('data-testid', 'register-phone');

  const nodes = {};
  const bandOf = {};
  const bands = {};
  const gaps = {};
  const chips = {};

  const node = (key, text, extra = '') => {
    const words = text.split(/(?=[A-Z][a-z])/).flatMap((part, index) => (index ? [el('wbr'), part] : [part]));
    const item = el('span', { class: `fr-node${extra ? ` ${extra}` : ''}` }, ...words);
    nodes[key] = item;
    return item;
  };
  const chip = (key, testId) => {
    const item = el('span', { class: 'fr-chip', 'data-testid': testId });
    chips[key] = item;
    return item;
  };
  const usersBox = el('div', { 'data-testid': 'auth-users' });
  const profilesBox = el('div', { 'data-testid': 'profiles-table' });
  const tables = {
    users: el('div', { class: 'fr-table' }, el('b', { text: 'Auth · auth.users' }), usersBox),
    profiles: el('div', { class: 'fr-table' }, el('b', { text: 'Tabla profiles' }), profilesBox),
  };
  const kinds = {};
  const band = (key, kind, name, role, body, bodyClass = '') => {
    kinds[key] = kind;
    const item = el(
      'div',
      { class: `fr-band fr-${kind}` },
      el('div', { class: 'fr-band-head' }, el('span', { class: 'fr-band-name', text: name }), el('span', { class: 'fr-band-role', text: role })),
      el('div', { class: `fr-band-body${bodyClass ? ` ${bodyClass}` : ''}` }, ...body)
    );
    bands[key] = item;
    body.forEach((child) => {
      if (!child || !child.querySelectorAll) return;
      Object.entries(nodes).forEach(([nodeKey, nodeEl]) => {
        if (child === nodeEl || child.contains(nodeEl)) bandOf[nodeKey] = key;
      });
    });
    return item;
  };
  const gap = (key, slotCount = 1, idleText = '') => {
    const slots = Array.from({ length: slotCount }, () => el('div', { class: 'fr-slot' }));
    const item = el('div', { class: 'fr-gap' }, ...slots);
    const idle = () =>
      slots.forEach((slot) => slot.replaceChildren(idleText ? el('span', { class: 'fr-gap-idle', text: idleText }) : ''));
    idle();
    gaps[key] = { item, slots, idle };
    return item;
  };

  const kit = { node, chip, band, gap, tables };
  const { title, footer } = config.layers(kit);
  const layers = el(
    'div',
    { class: 'fs-panel' },
    el('h4', { text: title }),
    el('div', {}, ...config.order.map((key) => bands[key] || gaps[key].item)),
    footer ? el('div', { class: 'fr-later', text: footer }) : null
  );

  const code = codePanel('');
  const codeTitle = code.box.querySelector('h4');
  const stripItems = config.strip.map(([key, label]) => [key, el('span', { class: `fr-st fr-${kinds[key]}`, text: label })]);
  const strip = el(
    'div',
    { class: 'fr-strip', 'aria-label': 'Capa actual' },
    ...stripItems.flatMap(([, item], index) => (index ? [el('span', { class: 'fr-st-sep', text: '›' }), item] : [item]))
  );
  const codeView = el('div', {}, code.box, strip);
  const layersTab = el('button', { type: 'button', text: 'Capas', class: 'fs-sel' });
  const codeTab = el('button', { type: 'button', text: 'Código' });
  const showTab = (next) => {
    layersTab.className = next === 'layers' ? 'fs-sel' : '';
    codeTab.className = next === 'code' ? 'fs-sel' : '';
    layers.hidden = next !== 'layers';
    codeView.hidden = next !== 'code';
  };
  layersTab.addEventListener('click', () => showTab('layers'));
  codeTab.addEventListener('click', () => showTab('code'));
  const tabs = el('div', { class: 'fs-seg fs-view', role: 'group', 'aria-label': 'Vista' }, layersTab, codeTab);
  codeView.hidden = true;
  const note = el('div', { class: 'fs-note' });

  let currentFile = null;
  const setFile = (file) => {
    if (!file || currentFile === file) return;
    currentFile = file;
    const [name, source] = config.files[file];
    codeTitle.textContent = name;
    code.setCode(source);
  };

  const renderUsers = (fresh) => {
    usersBox.replaceChildren();
    if (!db.users.length) usersBox.appendChild(el('div', { class: 'fr-none', text: 'sin cuentas' }));
    db.users.forEach((user) => {
      const row = el('div', { class: 'fr-rowdb', text: `${user.id.slice(0, 8)}… · ${user.email}` });
      usersBox.appendChild(row);
      if (user === fresh) flash(row);
    });
  };
  const renderProfiles = (fresh) => {
    profilesBox.replaceChildren();
    if (!db.profiles.length) profilesBox.appendChild(el('div', { class: 'fr-none', text: 'sin filas' }));
    db.profiles.forEach((profile) => {
      const row = el('div', { class: 'fr-rowdb', text: `${profile.id.slice(0, 8)}… · ${profile.username} · ${profile.full_name}` });
      profilesBox.appendChild(row);
      if (profile === fresh) flash(row);
    });
  };

  const setChip = (key, text) => {
    if (!chips[key]) return;
    chips[key].textContent = text;
    if (text) flash(chips[key]);
  };

  const renderForm = () => {
    phoneView = 'form';
    screen.setTitle('Crear cuenta');
    setChip('view', 'registerForm()');
    const fields = REG_FIELDS.map(([key, label, kind]) => [
      el('div', { class: 'fs-label', text: label }),
      el('input', {
        class: 'fr-input',
        type: kind,
        value: values[key],
        'aria-label': label,
        autocomplete: 'off',
        disabled: running,
        oninput: (event) => {
          values[key] = event.target.value;
        },
      }),
    ]);
    screen.body.replaceChildren(
      el('div', { class: 'fr-h1', text: 'Crea tu cuenta' }),
      el('div', { class: 'fr-sub', text: 'Completa tus datos para registrarte' }),
      ...fields.flat(),
      ...(formError ? [el('div', { class: 'fr-err', text: formError })] : []),
      el('button', { class: 'fr-btn', type: 'button', text: 'Registrarme', disabled: running, onclick: submit }),
      el('div', { class: 'fr-link', text: '¿Ya tienes cuenta? Inicia sesión' })
    );
  };
  const renderLoading = () => {
    phoneView = 'loading';
    setChip('view', 'cargando');
    screen.body.replaceChildren(el('div', { class: 'fr-center' }, el('div', { text: 'Espere mientras tanto' }), el('div', { class: 'fr-spin' })));
  };
  const renderBlank = () => {
    phoneView = 'blank';
    setChip('view', 'SizedBox.shrink()');
    screen.body.replaceChildren();
  };
  const renderErrorText = (message) => {
    phoneView = 'error';
    setChip('view', 'Text("Error …")');
    screen.body.replaceChildren(el('div', { class: 'fr-errtext', text: `Error ${message}` }));
  };
  const showFormError = (message) => {
    formError = message;
    renderForm();
    setChip('view', 'registerForm() + ErrorMessage');
    screen.body.scrollTop = screen.body.scrollHeight;
  };
  const renderHome = (profile) => {
    phoneView = 'home';
    screen.setTitle('Perfil');
    setChip('view', '/home');
    const shown = profile || { username: 'usuario', fullName: 'Nombre Apellido', email: 'correo@ejemplo.com' };
    const field = (label, value) => el('div', { class: 'fr-pf' }, el('small', { text: label }), el('div', { text: value }));
    screen.body.replaceChildren(
      el('div', { class: 'fr-avatar', text: shown.fullName ? shown.fullName[0].toUpperCase() : '?' }),
      el('div', { class: 'fr-name', text: shown.fullName }),
      el('div', { class: 'fr-handle', text: `@${shown.username}` }),
      field('Nombre de usuario', shown.username),
      field('Nombre completo', shown.fullName),
      field('Correo', shown.email),
      el('button', { class: 'fr-btn', type: 'button', text: 'Cerrar sesión', onclick: reopen })
    );
  };

  const highlight = (keys = []) => {
    const hotBands = new Set();
    Object.entries(nodes).forEach(([key, item]) => {
      const hot = keys.includes(key);
      item.classList.toggle('fr-hot', hot);
      if (hot) hotBands.add(bandOf[key]);
    });
    keys.forEach((key) => {
      if (bands[key]) hotBands.add(key);
    });
    Object.entries(bands).forEach(([key, item]) => item.classList.toggle('fr-on', hotBands.has(key)));
    return hotBands;
  };
  const showGaps = (list = []) => {
    Object.values(gaps).forEach((g) => g.idle());
    list.forEach(([where, dir, text, side]) => {
      const { slots } = gaps[where];
      const slot = slots[side === 'r' ? slots.length - 1 : 0];
      slot.replaceChildren(
        el('span', { class: `fr-msg${dir === 'up' ? ' fr-up' : dir === 'fail' ? ' fr-fail' : ''}`, text: `${dir === 'down' ? '↓' : '↑'} ${text}` })
      );
    });
  };

  const controls = el('div', { class: 'fs-controls' });
  const nextButton = el('button', { class: 'fs-btn fs-solid', type: 'button', text: 'Siguiente paso', onclick: () => advance() });
  const reopenButton = el('button', { class: 'fs-btn', type: 'button', text: 'Volver a /register', onclick: () => reopen() });
  const wipeButton = el('button', {
    class: 'fs-btn',
    type: 'button',
    text: 'Vaciar Supabase',
    onclick: () => {
      db.users = [];
      db.profiles = [];
      renderUsers();
      renderProfiles();
      note.textContent = 'Supabase vacío: sin cuentas ni perfiles.';
      note.classList.remove('fs-warn');
    },
  });
  const manualSwitch = switchControl('Paso a paso', (checked) => {
    manual = checked;
    syncControls();
    if (!manual && running) schedule();
  });
  controls.append(nextButton, reopenButton, wipeButton);

  const syncControls = () => {
    nextButton.style.display = manual && running ? '' : 'none';
    reopenButton.disabled = running;
    wipeButton.disabled = running;
  };

  const ctx = {
    db,
    setChip,
    renderUsers,
    renderProfiles,
    renderLoading,
    renderBlank,
    renderErrorText,
    showFormError,
    renderHome,
  };

  const markStrip = (keys) => stripItems.forEach(([key, item]) => item.classList.toggle('fr-on', keys.has(key)));

  const runStep = (step) => {
    const hotBands = highlight(step.hot);
    const fileLayer = config.fileLayer && step.lines && step.lines.length ? config.fileLayer[step.file] : null;
    markStrip(fileLayer ? new Set([fileLayer]) : hotBands);
    setFile(step.file);
    code.mark(...(step.lines || []));
    showGaps(step.gaps);
    if (step.apply) step.apply(ctx);
    note.textContent = step.caption;
    note.classList.toggle('fs-warn', Boolean(step.warn));
  };

  const finish = () => {
    running = false;
    syncControls();
    if (phoneView === 'form') renderForm();
  };

  const advance = () => {
    if (!running) return;
    runStep(steps[stepIndex]);
    stepIndex += 1;
    if (stepIndex >= steps.length) finish();
    else if (!manual) schedule();
  };

  const schedule = () => {
    timers.forEach(clearTimeout);
    timers.length = 0;
    timers.push(setTimeout(advance, 1400));
  };

  function submit() {
    if (running) return;
    const data = {
      username: values.username.trim(),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
    };
    markStrip(highlight(config.viewKeys));
    showGaps();
    const validation = config.validation;
    if (!data.username || !data.fullName || !data.email || !data.password) {
      formError = 'Completa todos los campos';
      setFile(validation.file);
      code.mark(...validation.empty);
    } else if (data.password !== values.confirm) {
      formError = 'Las contraseñas no coinciden';
      setFile(validation.file);
      code.mark(...validation.mismatch);
    } else {
      formError = null;
    }
    if (formError) {
      renderForm();
      note.textContent = 'La vista detuvo el registro. Ningún evento salió hacia el Bloc.';
      note.classList.add('fs-warn');
      return;
    }
    const failure = authFailure(db.users, data.email, data.password);
    steps = config.buildSteps({ data, failure });
    stepIndex = 0;
    running = true;
    formError = null;
    syncControls();
    if (phoneView === 'form') renderForm();
    advance();
  }

  function reopen() {
    if (running) return;
    timers.forEach(clearTimeout);
    formError = null;
    markStrip(highlight());
    showGaps();
    config.chipsReset(setChip);
    setFile(config.initialFile);
    code.mark();
    renderForm();
    note.textContent = `Pantalla nueva y Bloc nuevo en ${config.idleState}. Lo que quedó en Supabase sigue ahí.`;
    note.classList.remove('fs-warn');
  }

  container.append(
    el('div', { class: 'fs-col' }, screen.frame, el('div', { class: 'fs-controls' }, manualSwitch.node), controls, note),
    el('div', { class: 'fs-side' }, tabs, layers, codeView)
  );
  setFile(config.initialFile);
  config.chipsReset(setChip);
  renderUsers();
  renderProfiles();
  renderForm();
  syncControls();
  note.textContent = config.intro;

  return () => {
    timers.forEach(clearTimeout);
    root.replaceChildren();
  };
};

const fakeUser = (db, email) => {
  const user = { id: fakeUuid(), email };
  db.users.push(user);
  return user;
};

const fakeProfile = (db, user, data) => {
  const profile = { id: user.id, username: data.username, full_name: data.fullName };
  db.profiles.push(profile);
  return profile;
};

// The lab as it stands: the Bloc talks to the Supabase SDK directly.
const mountRegisterLayers = (root) =>
  createRegisterSim(root, {
    order: ['view', 'vb', 'bloc', 'bs', 'sdk', 'se', 'ext'],
    strip: [
      ['view', 'Vista'],
      ['bloc', 'Bloc'],
      ['sdk', 'SDK'],
      ['ext', 'Supabase'],
    ],
    viewKeys: ['screen'],
    initialFile: 'bloc',
    idleState: 'RegisterIdleState',
    files: {
      screen: ['register_screen.dart', REG_SCREEN_CODE],
      bloc: ['register_bloc.dart', REG_BLOC_CODE],
    },
    validation: { file: 'screen', empty: [1, 2, 3, 4], mismatch: [6, 7, 8, 9] },
    intro: 'Revisa los datos y pulsa Registrarme. Registrar dos veces el mismo correo también enseña algo.',
    chipsReset: (setChip) => {
      setChip('bloc', 'RegisterIdleState');
      setChip('sdk', '');
    },
    layers: ({ node, chip, band, gap, tables }) => {
      const viewBody = [node('screen', 'RegisterScreen'), chip('view')];
      band('view', 'view', 'VISTA', 'Muestra y avisa', viewBody);
      band('bloc', 'bloc', 'BLOC', 'Recibe eventos, emite estados', [node('bloc', 'RegisterBloc'), chip('bloc', 'bloc-state')]);
      band('sdk', 'sdk', 'SDK DE SUPABASE', 'Traduce a HTTP', [node('sdk', 'Supabase.instance.client'), chip('sdk')]);
      band('ext', 'ext', 'EXTERIOR · SUPABASE', 'Fuera del teléfono', [el('div', { class: 'fr-db' }, tables.users, tables.profiles)]);
      gap('vb');
      gap('bs');
      gap('se', 1, 'internet');
      return {
        title: 'Capas que recorre el registro',
        footer: 'Todavía no hay UseCase ni Repository: el Bloc llama directo al SDK.',
      };
    },
    buildSteps: ({ data, failure }) => {
      let user = null;
      const head = [
        {
          hot: ['screen'],
          file: 'screen',
          lines: [10, 11, 12, 13, 14],
          gaps: [['vb', 'down', 'add(OnRegisterSubmittedEvent)']],
          caption: 'La vista validó los campos y le manda un evento al Bloc. No sabe que existe Supabase.',
        },
        {
          hot: ['bloc'],
          file: 'bloc',
          lines: [4],
          gaps: [['vb', 'up', 'emit(RegisterLoadingState())']],
          apply: (ctx) => ctx.setChip('bloc', 'RegisterLoadingState'),
          caption: 'El Bloc recibe el evento y emite un estado nuevo: Loading viaja hacia la vista.',
        },
        {
          hot: ['screen'],
          file: 'screen',
          lines: [26],
          apply: (ctx) => ctx.renderLoading(),
          caption: 'El estado llega a la vista. El BlocBuilder se reconstruye y dibuja el indicador de carga.',
        },
        {
          hot: ['sdk'],
          file: 'bloc',
          lines: [6, 7, 8, 9, 10],
          gaps: [['bs', 'down', 'auth.signUp(email, password)']],
          apply: (ctx) => ctx.setChip('sdk', 'auth.signUp(…)'),
          caption: 'Paso 1, la cuenta. El Bloc no habla con internet: le pide al SDK que lo haga.',
        },
        {
          hot: ['ext'],
          file: 'bloc',
          lines: [6, 7, 8, 9, 10],
          gaps: [['se', 'down', 'POST /auth/v1/signup']],
          caption: 'El SDK convierte la llamada en una petición HTTP. Esto ya sale del teléfono.',
        },
        {
          hot: ['ext'],
          apply: (ctx) => {
            if (failure) return;
            user = fakeUser(ctx.db, data.email);
            ctx.renderUsers(user);
          },
          caption: failure
            ? 'Supabase Auth revisa la petición y la rechaza. No crea ninguna cuenta.'
            : 'Supabase Auth crea la cuenta y le asigna un id.',
          warn: Boolean(failure),
        },
      ];
      if (failure) {
        return [
          ...head,
          {
            hot: ['sdk'],
            file: 'bloc',
            lines: [6, 7, 8, 9, 10],
            gaps: [['se', 'fail', failure.status]],
            caption: 'La respuesta vuelve al SDK con un error.',
            warn: true,
          },
          {
            hot: ['bloc'],
            file: 'bloc',
            lines: [19],
            gaps: [['bs', 'fail', 'lanza AuthException']],
            apply: (ctx) => ctx.setChip('sdk', ''),
            caption: 'signUp no devuelve el error: lanza una excepción. El Bloc salta al catch y el insert nunca corre.',
            warn: true,
          },
          {
            hot: ['bloc'],
            file: 'bloc',
            lines: [20, 21, 22],
            gaps: [['vb', 'fail', 'emit(RegisterErrorState(errorMessage))']],
            apply: (ctx) => ctx.setChip('bloc', 'RegisterErrorState'),
            caption: 'El catch emite el estado de error hacia la vista.',
            warn: true,
          },
          {
            hot: ['screen'],
            file: 'screen',
            lines: [28, 29, 30],
            apply: (ctx) => ctx.renderErrorText(failure.error),
            caption: 'La vista solo muestra el texto del error: ese estado no vuelve a dibujar el formulario.',
            warn: true,
          },
        ];
      }
      return [
        ...head,
        {
          hot: ['sdk'],
          file: 'bloc',
          lines: [6, 7, 8, 9, 10],
          gaps: [['se', 'up', '200 · usuario creado']],
          caption: 'Supabase responde al SDK que la cuenta quedó creada.',
        },
        {
          hot: ['bloc'],
          file: 'bloc',
          lines: [6],
          gaps: [['bs', 'up', 'AuthResponse(user.id)']],
          apply: (ctx) => ctx.setChip('sdk', ''),
          caption: 'El SDK le entrega la respuesta al Bloc, que guarda en response el id de la cuenta nueva.',
        },
        {
          hot: ['sdk'],
          file: 'bloc',
          lines: [11, 12, 13, 14, 15, 16, 17],
          gaps: [['bs', 'down', "from('profiles').insert({…})"]],
          apply: (ctx) => ctx.setChip('sdk', "from('profiles').insert(…)"),
          caption: 'Paso 2, el perfil. Mismo SDK, otro servicio: ahora la base de datos.',
        },
        {
          hot: ['ext'],
          file: 'bloc',
          lines: [11, 12, 13, 14, 15, 16, 17],
          gaps: [['se', 'down', 'POST /rest/v1/profiles']],
          caption: 'Otra petición HTTP sale del teléfono, esta vez hacia la tabla profiles.',
        },
        {
          hot: ['ext'],
          apply: (ctx) => ctx.renderProfiles(fakeProfile(ctx.db, user, data)),
          caption: 'La fila llega a profiles con el mismo id de la cuenta. Así se unen las dos tablas.',
        },
        {
          hot: ['sdk'],
          file: 'bloc',
          lines: [11, 12],
          gaps: [['se', 'up', '201 · Created']],
          caption: 'Supabase confirma al SDK que guardó la fila.',
        },
        {
          hot: ['bloc'],
          file: 'bloc',
          lines: [11, 12],
          gaps: [['bs', 'up', 'insert completo']],
          apply: (ctx) => ctx.setChip('sdk', ''),
          caption: 'El await termina en el Bloc: los dos pasos salieron bien.',
        },
        {
          hot: ['bloc'],
          file: 'bloc',
          lines: [18],
          gaps: [['vb', 'up', 'emit(RegisterSuccessState())']],
          apply: (ctx) => ctx.setChip('bloc', 'RegisterSuccessState'),
          caption: 'El Bloc emite Success hacia la vista.',
        },
        {
          hot: ['screen'],
          file: 'screen',
          lines: [18, 19, 20, 21],
          apply: (ctx) => ctx.renderHome(null),
          caption: 'Success llega a la vista y el BlocListener navega a /home. HomeScreen aún muestra sus valores por defecto: nadie le pasa el perfil.',
        },
      ];
    },
  });

const CLEAN_BLOC_CODE = `Future<void> _onSubmitted(
  RegisterSubmitted event,
  Emitter<RegisterState> emit,
) async {
  emit(state.copyWith(
    status: RegisterStatus.loading,
  ));
  try {
    final profile = await _signUp(
      username: event.username,
      fullName: event.fullName,
      email: event.email,
      password: event.password,
    );
    emit(state.copyWith(
      status: RegisterStatus.success,
      profile: profile,
    ));
  } on Exception catch (e) {
    emit(state.copyWith(
      status: RegisterStatus.failure,
      errorMessage: '$e',
    ));
  }
}`;

const CLEAN_USECASE_CODE = `Future<Profile> call({
  required String username,
  required String fullName,
  required String email,
  required String password,
}) async {
  final user = await _auth.signUp(
      email: email, password: password);
  final profile = Profile(
    id: user.id,
    username: username,
    fullName: fullName,
  );
  try {
    await _profiles.createProfile(profile);
  } on Exception {
    await _auth.signOut();
    throw SignUpException(
        'No se pudo guardar tu perfil');
  }
  return profile;
}`;

const CLEAN_AUTH_CODE = `class AuthRepositoryImpl implements AuthRepository {
  Future<AuthUser> signUp({
    required String email,
    required String password,
  }) {
    return _dataSource.signUp(
        email: email, password: password);
  }
}

class SupabaseAuthDataSource {
  Future<AuthUser> signUp({
    required String email,
    required String password,
  }) async {
    final response = await _client.auth.signUp(
        email: email, password: password);
    final user = response.user;
    if (user == null) throw Exception('Sin usuario');
    return AuthUser(id: user.id, email: email);
  }
}`;

const CLEAN_PROFILE_CODE = `class ProfileRepositoryImpl
    implements ProfileRepository {
  Future<void> createProfile(Profile profile) {
    return _dataSource.createProfile(profile);
  }
}

class SupabaseProfileDataSource {
  Future<void> createProfile(Profile profile) async {
    await _client.from('profiles').insert({
      'id': profile.id,
      'username': profile.username,
      'full_name': profile.fullName,
    });
  }
}`;

// How Lab 5 should end up: presentation, domain and data, with one branch per service.
const mountRegisterClean = (root) =>
  createRegisterSim(root, {
    order: ['view', 'vb', 'bloc', 'bd', 'dom', 'dd', 'data', 'ds', 'ext'],
    strip: [
      ['view', 'Vista'],
      ['bloc', 'Bloc'],
      ['dom', 'Dominio'],
      ['data', 'Datos'],
      ['ext', 'Supabase'],
    ],
    fileLayer: { bloc: 'bloc', usecase: 'dom', auth: 'data', profile: 'data' },
    viewKeys: ['screen'],
    initialFile: 'bloc',
    idleState: 'RegisterStatus.initial',
    files: {
      bloc: ['register_bloc.dart', CLEAN_BLOC_CODE],
      usecase: ['sign_up_usecase.dart', CLEAN_USECASE_CODE],
      auth: ['auth_repository_impl.dart · supabase_auth_data_source.dart', CLEAN_AUTH_CODE],
      profile: ['profile_repository_impl.dart · supabase_profile_data_source.dart', CLEAN_PROFILE_CODE],
    },
    validation: { file: 'bloc', empty: [], mismatch: [] },
    intro: 'El mismo formulario con arquitectura limpia. Pulsa Registrarme y mira cuántas piezas participan.',
    chipsReset: (setChip) => setChip('bloc', 'RegisterStatus.initial'),
    layers: ({ node, chip, band, gap, tables }) => {
      const col = (...items) => el('div', { class: 'fr-colb' }, ...items);
      band('view', 'view', 'PRESENTACIÓN · VISTA', 'Muestra y avisa', [node('screen', 'RegisterScreen'), chip('view')]);
      band('bloc', 'view', 'PRESENTACIÓN · BLOC', 'Convierte resultados en estados', [
        node('bloc', 'RegisterBloc'),
        chip('bloc', 'bloc-state'),
      ]);
      band(
        'dom',
        'dom',
        'DOMINIO',
        'Decide el orden · no conoce Supabase',
        [
          el('div', { class: 'fr-center-row' }, node('usecase', 'SignUpUseCase')),
          el(
            'div',
            { class: 'fr-cols' },
            col(node('authRepo', 'AuthRepository', 'fr-contract'), el('span', { class: 'fr-chip', text: 'AuthUser' })),
            col(node('profileRepo', 'ProfileRepository', 'fr-contract'), el('span', { class: 'fr-chip', text: 'Profile' }))
          ),
        ],
        'fr-stack'
      );
      band(
        'data',
        'data',
        'DATOS',
        'Habla con Supabase',
        [
          el(
            'div',
            { class: 'fr-cols' },
            col(node('authImpl', 'AuthRepositoryImpl'), el('span', { class: 'fr-down', text: '↓' }), node('authDs', 'SupabaseAuthDataSource')),
            col(
              node('profileImpl', 'ProfileRepositoryImpl'),
              el('span', { class: 'fr-down', text: '↓' }),
              node('profileDs', 'SupabaseProfileDataSource')
            )
          ),
        ],
        'fr-stack'
      );
      band('ext', 'ext', 'EXTERIOR · SUPABASE', 'Fuera del teléfono', [el('div', { class: 'fr-db' }, tables.users, tables.profiles)]);
      gap('vb');
      gap('bd');
      gap('dd', 2);
      gap('ds', 2, 'internet');
      return {
        title: 'El registro con arquitectura limpia',
        footer: 'Los recuadros punteados son contratos: el dominio los declara y los datos los implementan.',
      };
    },
    buildSteps: ({ data, failure }) => {
      let user = null;
      const profileOf = () => ({ username: data.username, fullName: data.fullName, email: data.email });
      const head = [
        {
          hot: ['screen'],
          gaps: [['vb', 'down', 'add(RegisterSubmitted)']],
          caption: 'La vista valida los campos y manda el evento al Bloc. Esta parte no cambia.',
        },
        {
          hot: ['bloc'],
          file: 'bloc',
          lines: [4, 5, 6],
          gaps: [['vb', 'up', 'status: loading']],
          apply: (ctx) => ctx.setChip('bloc', 'RegisterStatus.loading'),
          caption: 'El Bloc recibe el evento y emite loading con copyWith. El estado viaja hacia la vista.',
        },
        {
          hot: ['screen'],
          apply: (ctx) => ctx.renderLoading(),
          caption: 'El estado llega a la vista y la pantalla muestra la carga.',
        },
        {
          hot: ['usecase'],
          file: 'bloc',
          lines: [8, 9, 10, 11, 12, 13],
          gaps: [['bd', 'down', '_signUp(username, fullName, email, password)']],
          caption: 'El Bloc hace una sola llamada al UseCase. No sabe que registrar son dos pasos ni que existe Supabase.',
        },
        {
          hot: ['usecase', 'authRepo'],
          file: 'usecase',
          lines: [6, 7],
          caption: 'Paso 1, la cuenta. Dentro del dominio, el UseCase llama al contrato AuthRepository, no a Supabase.',
        },
        {
          hot: ['authImpl'],
          file: 'auth',
          lines: [0, 1, 2, 3, 4],
          gaps: [['dd', 'down', 'signUp(email, password)', 'l']],
          caption: 'La llamada cruza a la capa de datos: AuthRepositoryImpl es quien cumple el contrato.',
        },
        {
          hot: ['authImpl', 'authDs'],
          file: 'auth',
          lines: [5, 6],
          caption: 'AuthRepositoryImpl delega en SupabaseAuthDataSource, el único que usa el SDK de Auth.',
        },
        {
          hot: ['authDs'],
          file: 'auth',
          lines: [15, 16],
          gaps: [['ds', 'down', 'POST /auth/v1/signup', 'l']],
          caption: 'El data source llama al SDK y la petición sale del teléfono.',
        },
        {
          hot: ['ext'],
          apply: (ctx) => {
            if (failure) return;
            user = fakeUser(ctx.db, data.email);
            ctx.renderUsers(user);
          },
          caption: failure
            ? 'Supabase Auth revisa la petición y la rechaza. No crea ninguna cuenta.'
            : 'Supabase Auth crea la cuenta y le asigna un id.',
          warn: Boolean(failure),
        },
      ];
      if (failure) {
        return [
          ...head,
          {
            hot: ['authDs'],
            file: 'auth',
            lines: [15, 16],
            gaps: [['ds', 'fail', failure.status, 'l']],
            caption: 'La respuesta vuelve con un error y el SDK lanza una excepción en el data source.',
            warn: true,
          },
          {
            hot: ['usecase', 'authRepo'],
            file: 'usecase',
            lines: [6, 7],
            gaps: [['dd', 'fail', 'lanza AuthException', 'l']],
            caption: 'La excepción sube al dominio. El UseCase no la atrapa: si no hay cuenta, el perfil ni se intenta.',
            warn: true,
          },
          {
            hot: ['bloc'],
            file: 'bloc',
            lines: [18],
            gaps: [['bd', 'fail', 'lanza AuthException']],
            caption: 'La excepción sigue subiendo hasta el catch del Bloc.',
            warn: true,
          },
          {
            hot: ['bloc'],
            file: 'bloc',
            lines: [19, 20, 21, 22],
            gaps: [['vb', 'fail', 'status: failure']],
            apply: (ctx) => ctx.setChip('bloc', 'RegisterStatus.failure'),
            caption: 'El Bloc emite failure con el mensaje hacia la vista.',
            warn: true,
          },
          {
            hot: ['screen'],
            apply: (ctx) => ctx.showFormError(failure.error),
            caption: 'La vista vuelve a mostrar el formulario, con el mensaje debajo.',
            warn: true,
          },
        ];
      }
      return [
        ...head,
        {
          hot: ['authDs'],
          file: 'auth',
          lines: [15, 16],
          gaps: [['ds', 'up', '200 · usuario creado', 'l']],
          caption: 'Supabase responde al data source que la cuenta quedó creada.',
        },
        {
          hot: ['authDs'],
          file: 'auth',
          lines: [17, 18, 19],
          caption: 'El data source convierte la respuesta en AuthUser. De aquí para arriba nadie ve una clase de Supabase.',
        },
        {
          hot: ['usecase', 'authRepo'],
          file: 'usecase',
          lines: [6, 7],
          gaps: [['dd', 'up', 'AuthUser(id, email)', 'l']],
          caption: 'El AuthUser sube al dominio y el UseCase lo recibe.',
        },
        {
          hot: ['usecase'],
          file: 'usecase',
          lines: [8, 9, 10, 11, 12],
          caption: 'La regla del registro: con el id de la cuenta se arma el Profile. Por eso la cuenta va primero.',
        },
        {
          hot: ['usecase', 'profileRepo'],
          file: 'usecase',
          lines: [13, 14],
          caption: 'Paso 2, el perfil. El UseCase usa el otro contrato, ProfileRepository.',
        },
        {
          hot: ['profileImpl'],
          file: 'profile',
          lines: [0, 1, 2],
          gaps: [['dd', 'down', 'createProfile(profile)', 'r']],
          caption: 'La llamada cruza a la otra rama de datos: ProfileRepositoryImpl cumple ese contrato.',
        },
        {
          hot: ['profileImpl', 'profileDs'],
          file: 'profile',
          lines: [3],
          caption: 'ProfileRepositoryImpl delega en SupabaseProfileDataSource.',
        },
        {
          hot: ['profileDs'],
          file: 'profile',
          lines: [9, 10, 11, 12, 13],
          gaps: [['ds', 'down', 'POST /rest/v1/profiles', 'r']],
          caption: 'El data source hace el insert y la petición sale del teléfono.',
        },
        {
          hot: ['ext'],
          apply: (ctx) => ctx.renderProfiles(fakeProfile(ctx.db, user, data)),
          caption: 'La fila llega a profiles con el mismo id de la cuenta.',
        },
        {
          hot: ['profileDs'],
          file: 'profile',
          lines: [9],
          gaps: [['ds', 'up', '201 · Created', 'r']],
          caption: 'Supabase confirma al data source que guardó la fila.',
        },
        {
          hot: ['usecase', 'profileRepo'],
          file: 'usecase',
          lines: [14],
          gaps: [['dd', 'up', 'createProfile completo', 'r']],
          caption: 'La confirmación sube al dominio: el await del UseCase termina.',
        },
        {
          hot: ['bloc'],
          file: 'usecase',
          lines: [20],
          gaps: [['bd', 'up', 'Profile']],
          caption: 'Los dos pasos salieron bien. El UseCase le devuelve el Profile al Bloc.',
        },
        {
          hot: ['bloc'],
          file: 'bloc',
          lines: [14, 15, 16, 17],
          gaps: [['vb', 'up', 'status: success, profile']],
          apply: (ctx) => ctx.setChip('bloc', 'RegisterStatus.success'),
          caption: 'El Bloc emite success, con el perfil dentro del estado, hacia la vista.',
        },
        {
          hot: ['screen'],
          apply: (ctx) => ctx.renderHome(profileOf()),
          caption: 'El estado llega a la vista, que navega a /home con state.profile: ahora sí aparecen los datos de quien se registró.',
        },
      ];
    },
  });

export const SIMS = Object.freeze({
  'state-counter': mountCounter,
  'hot-reload': (root, args = []) => mountCounter(root, ['reload', ...args]),
  'state-tree': mountTree,
  'state-lifecycle': mountLifecycle,
  playlist: mountPlaylist,
  'register-layers': mountRegisterLayers,
  'register-clean': mountRegisterClean,
});

export const parseSpec = (spec) => {
  const [name = '', ...args] = String(spec || '').trim().split(/\s+/);
  return { name, args };
};
