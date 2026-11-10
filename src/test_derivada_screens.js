const http = require('http');

async function run() {
  const wsUrl = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        resolve(list[0].webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let idCounter = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = idCounter++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  // Scroll down to 1800px (Laboratorio Interactivo)
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 1800);
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  await new Promise(r => setTimeout(r, 400));

  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const fs = require('fs');
  fs.writeFileSync('/Users/xavier/.gemini/antigravity/brain/96fc8dd9-3d5b-4188-82cc-d04e22dbaa40/derivada_lab_scrolled.png', Buffer.from(screenshotRes.data, 'base64'));

  // Scroll down to 3600px (Deducciones Paso a Paso)
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo(0, 3600);
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  await new Promise(r => setTimeout(r, 400));

  const screenshotRes2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/xavier/.gemini/antigravity/brain/96fc8dd9-3d5b-4188-82cc-d04e22dbaa40/derivada_proofs_scrolled.png', Buffer.from(screenshotRes2.data, 'base64'));

  ws.close();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
