let pyodide = null;
async function initPyodide() {
    try {
        if (typeof globalThis.loadPyodide === 'undefined') throw new Error('loadPyodide is not available.')
        pyodide = await globalThis.loadPyodide();
        return true;
    } catch (error) {
        window.screwdriver.log('Error loading Python: \n' + error, 'warn')
        pyodide = pyodide || null;
        return false;
    }
}

class StdinHandler{
	constructor(results, options){
		this.results = results || [];
		this.idx = 0;
		Object.assign(this, options);
	}
	stdin() {
		if (this.idx >= this.results.length) return "";
		return this.results[this.idx++];
	}
}

async function runCode(addOutput, addLine, codeEditor, consoleElement, runButton) {
    const code = codeEditor.value.trim();
    if (!code) {
		addOutput('Please write some code first.', consoleElement, 'error', true);
        return;
    }
    runButton.textContent = 'Ejecutando...';
    runButton.disabled = true;
	if (!pyodide) {
		addOutput("Pyodide isn't loaded yet, please wait.", consoleElement, 'warn', true);
        const initializatorResponse = await initPyodide();
        if(!initializatorResponse) {addOutput('An error occurred while initializating Pyodide. For farther information please check console.', consoleElement); runButton.textContent = 'Ejecutar'; runButton.disabled = false; return}
        addOutput("Pyodide successfuly loaded.", consoleElement, 'success', true);
    }
    addLine(consoleElement);
    try {
        let stdin = []
        try{
            stdin = await JSON.parse(codeEditor.getAttribute('data-stdin'))['stdin']
        } catch (e) {}
		pyodide.setStdin(new StdinHandler(stdin));
        const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO

old_stdout = sys.stdout
old_stderr = sys.stderr
sys.stdout = StringIO()
sys.stderr = StringIO()

try:
    exec("""${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
    output = sys.stdout.getvalue()
    errors = sys.stderr.getvalue()
finally:
    sys.stdout = old_stdout
    sys.stderr = old_stderr

(output, errors)
        `);
        const [stdout, stderr] = result.toJs();
        if (stdout) {stdout.split('\n').forEach(line => {if (line) addOutput(line, consoleElement, 'output');});}
        if (stderr) {stderr.split('\n').forEach(line => {if (line) addOutput(line, consoleElement, 'error');});}
        if (!stdout && !stderr) {addOutput('Code executed without output.', consoleElement, 'info');}
    } catch (error) {
        window.screwdriver.log('Error while executing code: ' + error, "warn");
        addOutput(`An error occurred while executing code. For farther information please check console.`, consoleElement, 'error');
    } finally {
        runButton.textContent = 'Ejecutar';
        runButton.disabled = false;
    }
}

let consoles = [];
class Console {
    constructor(e, r){
        this.codeElement = e.querySelector('.code');
        this.consoleElement = e.querySelector('.console');
        this.codeButton = e.querySelector('.codeButton');
        this.consoleButton = e.querySelector('.consoleButton');
        this.runButton = e.querySelector('.runButton')
        this.selected = 'code';
        this.runner = r;
        this.codeButton.addEventListener('click', (e) => {this.setSelected('code')});
        this.consoleButton.addEventListener('click', (e) => {this.setSelected('console')});
        this.runButton.addEventListener('click', (e) => {this.runCode()})
    }
    setSelected(selected) {
        if(selected == this.selected) return;
        if(selected == 'code') {this.selected = 'code'; this.codeElement.classList.toggle('hidden', false); this.consoleElement.classList.toggle('hidden', true); this.codeButton.classList.toggle('text-primary-foreground', true); this.codeButton.classList.toggle('bg-foreground/95', true); this.codeButton.classList.toggle('hover:bg-foreground/10', false); this.consoleButton.classList.toggle('text-primary-foreground', false); this.consoleButton.classList.toggle('bg-foreground/95', false); this.consoleButton.classList.toggle('hover:bg-foreground/10', true)}
        if(selected == 'console') {this.selected = 'console'; this.codeElement.classList.toggle('hidden', true); this.consoleElement.classList.toggle('hidden', false); this.codeButton.classList.toggle('text-primary-foreground', false); this.codeButton.classList.toggle('bg-foreground/95', false); this.codeButton.classList.toggle('hover:bg-foreground/10', true); this.consoleButton.classList.toggle('text-primary-foreground', true); this.consoleButton.classList.toggle('bg-foreground/95', true); this.consoleButton.classList.toggle('hover:bg-foreground/10', false)}
    }
    addLine(consoleElement){
        const line = document.createElement('div');
        line.className = 'animate-fade-in text-white select-none';
        line.style = 'margin-top:1px; margin-bottom: 2px; transform: translate(0px, -25%);'
        line.textContent = '_'.repeat(50);
        consoleElement.appendChild(line);
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }
    addOutput(text, consoleElement, type = 'output', bold = false) {
        const line = document.createElement('div');
        line.className = 'animate-fade-in';
        const colors = { output: 'text-foreground', error: 'text-color-error', warn: 'text-color-warn', success: 'text-color-success', muted: 'text-foreground/50', info: 'text-color-info' };
        line.className += ` ${colors[type] || colors.output}${bold ? ' font-bold' : ''}`;
        line.textContent = text;
        consoleElement.appendChild(line);
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }
    runCode(){
        this.setSelected('console');
        this.runner(this.addOutput, this.addLine, this.codeElement, this.consoleElement, this.runButton);
    }
}

const elements = Array.from(document.getElementsByClassName('pythonConsole'))
elements.map((e) => {
    const console = new Console(e, runCode);
    console.addOutput('Divulgando Ciencia - Python Interpreter', console.consoleElement, 'info', true)
    console.addOutput('Pyodide Version: v0.28.3', console.consoleElement, 'muted')
    console.addOutput('🛈 This is a demo console, so code editing is disabled.', console.consoleElement, 'muted')
    consoles.push(console);
})