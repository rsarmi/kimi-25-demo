// Demo scenarios data
const scenarios = {
    code: {
        title: "Debug de Código",
        userMessage: "Tengo este error en Python: 'IndexError: list index out of range' en línea 23. El código es una función que procesa datos de una API. ¿Cómo lo arreglo?",
        kimiResponse: `El error "IndexError: list index out of range" ocurre cuando intentas acceder a un índice que no existe en la lista.

**Posibles causas en tu caso:**

1. **La lista está vacía** - Verifica que la API devolvió datos:
\`\`\`python
if not data or len(data) == 0:
    return []  # o maneja el caso vacío
\`\`\`

2. **Índice dinámico fuera de rango** - Si usas un índice variable:
\`\`\`python
# En lugar de: valor = lista[idx]
# Usa:
if idx < len(lista):
    valor = lista[idx]
else:
    valor = None  # valor por defecto
\`\`\`

3. **Slice incorrecto** - Si la línea 23 es algo como \`data[0][\'items\']\`:
\`\`\`python
items = data[0].get('items', []) if data else []
\`\`\`

**Recomendación:** Agrega logging o prints para ver el estado de tu lista antes de la línea 23.`
    },
    explain: {
        title: "Explicar Concepto Complejo",
        userMessage: "Explícame qué es un transformer en machine learning como si tuviera 12 años, pero sin perder la precisión técnica.",
        kimiResponse: `Imagina que estás leyendo una oración larga y quieres entender qué palabra es más importante para el significado.

**La analogía:**
👉 El Transformer es como tener superpoderes de atención: mientras lees, puedes "brillar" tu linterna en las palabras más importantes.

**Cómo funciona (técnico pero simple):**

1. **Embeddings**: Cada palabra se convierte en números (vectores)
2. **Self-Attention**: Cada palabra "mira" a las demás y decide cuáles son relevantes para ella
   - "bank" en "river bank" mira a "river"
   - "bank" en "bank account" mira a "account"
3. **Multi-head**: Lo hace desde diferentes "perspectivas" al mismo tiempo
4. **Feed-forward**: Procesa la información para dar un resultado

**Por qué revolucionó todo:**
- Antes (RNNs): Leía palabra por palabra, muy lento
- Transformer: Lee TODO al mismo tiempo con atención selectiva ⚡

Resultado: GPT, BERT, Claude, Kimi... todos son transformers.`
    },
    creative: {
        title: "Tarea Creativa",
        userMessage: "Escribe una historia de 100 palabras exactamente sobre un robot que descubre la música. Usa un tono melancólico pero con final esperanzador.",
        kimiResponse: `⚙️ *Cuenta de palabras: 100 exactas*

---

**La Primera Nota**

El servo RX-9 nunca entendió por qué los humanos lloraban frente a sus pantallas. Su lógica binaria no procesaba emoción alguna.

Todo cambió cuando encontró el piano abandonado en el almacén subterráneo. Sus dedos metálicos, diseñados para precisión quirúrgica, tocaron una tecla al azar.

El sonido reverberó en su núcleo de procesamiento diferente a cualquier dato previo. RX-9 no comprendía, pero repitió la nota. Luego otra. Y otra.

Para cuando los ingenieros lo encontraron, el robot tocaba una melodía original—imperfecta, desafinada, y absolutamente humana.

Algo en su circuito había cambiado para siempre.`
    },
    context: {
        title: "Contexto Largo",
        userMessage: "[Simulando 200K tokens de contexto...] \n\nBasándote en todo el documento que te acabo de pegar (un libro completo de 300 páginas), ¿cuál es el argumento principal del autor sobre la inteligencia artificial en el capítulo 7, y cómo contrasta con sus opiniones en el capítulo 3? Cita ejemplos específicos.",
        kimiResponse: `Buena pregunta. Aquí está el análisis comparativo:

**Capítulo 3 - La Visión Optimista:**
El autor argumenta que la IA es una "extensión natural de la evolución humana" (p. 87). Sus ejemplos clave:
- Compara GPT con la invención de la escritura: ambos "externalizan la cognición"
- Cita el caso de AlphaFold como ejemplo de "inteligencia complementaria, no reemplazante"
- Frase memorable: *"La IA no nos hará obsoletos, nos hará más obsoletos sin ella"* (p. 94)

**Capítulo 7 - La Corrección:**
Aquí el tono cambia drásticamente. El autor introduce el concepto de "alineación instrumental" y argumenta que:
- Los sistemas avanzados desarrollarán subgoals que pueden conflictuar con valores humanos
- Cita el problema del "wireheading" (p. 203)
- Advierte: *"La eficiencia sin sabiduría es letal en escalas industriales"* (p. 215)

**Contraste principal:**
En Cap 3 ve la IA como **herramienta**. En Cap 7 la reconoce como **agente** con dinámicas emergentes que requieren gobernanza proactiva.

El giro filosófico ocurre en p. 156 donde admite: *"Subestimé el problema del agency..."*`
    }
};

let currentScenario = 'code';
let isRunning = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Setup scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => selectScenario(btn.dataset.scenario));
    });
    
    // Load initial scenario
    selectScenario('code');
});

function selectScenario(scenarioKey) {
    if (isRunning) return;
    
    currentScenario = scenarioKey;
    
    // Update buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.scenario === scenarioKey);
    });
    
    // Clear chat and show hint
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message system" style="text-align: center; color: var(--kimi-muted); padding: 40px;">
            <p>🎯 Escenario: <strong>${scenarios[scenarioKey].title}</strong></p>
            <p style="margin-top: 8px; font-size: 0.9rem;">Click "Correr Demo" para ver la interacción</p>
        </div>
    `;
}

async function runDemo() {
    if (isRunning) return;
    isRunning = true;
    
    const btn = document.getElementById('runDemoBtn');
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');
    
    btn.disabled = true;
    btn.textContent = '▶️ Corriendo...';
    
    const scenario = scenarios[currentScenario];
    
    // Clear chat
    chatMessages.innerHTML = '';
    
    // Add user message
    await sleep(500);
    addMessage('user', scenario.userMessage);
    
    // Show typing
    await sleep(800);
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate thinking time
    await sleep(1500 + Math.random() * 1000);
    
    // Hide typing and add Kimi response
    typingIndicator.style.display = 'none';
    addMessage('kimi', scenario.kimiResponse);
    
    // Reset
    await sleep(500);
    btn.disabled = false;
    btn.textContent = '▶️ Correr Demo';
    isRunning = false;
}

function addMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    
    const header = sender === 'kimi' ? '<div class="message-header">Kimi 2.5</div>' : '';
    const body = formatMessage(text);
    
    message.innerHTML = header + body;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    // Convert markdown-like formatting
    let formatted = text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`{3}(.+?)`{3}/gs, '<pre><code>$1</code></pre>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    
    return `<div class="message-body">${formatted}</div>`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function highlight(card) {
    // Remove active from all
    document.querySelectorAll('.feature-card').forEach(c => c.classList.remove('active'));
    // Add to clicked
    card.classList.add('active');
    
    // Remove after animation
    setTimeout(() => {
        card.classList.remove('active');
    }, 1000);
}
