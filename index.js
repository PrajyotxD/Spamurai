const { default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

let isLoggingIn = false;

// Helper to determine WhatsApp message type based on file extension
const getFileType = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return 'image';
    if (['.mp4', '.m4v', '.mov'].includes(ext)) return 'video';
    return 'document'; // Default for APK, PDF, ZIP, etc.
};

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Mac OS", "Chrome", "10.15.7"]
    });

    if (!sock.authState.creds.registered && !isLoggingIn) {
        isLoggingIn = true;
        console.clear();
        console.log("Spamurai");
        console.log("1. QR Code | 2. OTP Code");
        const choice = await question("Select (1/2): ");
        if (choice === '1') {
            sock.ev.on('connection.update', (u) => { if (u.qr) qrcode.generate(u.qr, { small: true }); });
        } else if (choice === '2') {
            const num = await question("📞 Number: ");
            const code = await sock.requestPairingCode(num.trim());
            console.log(`\n🔑 CODE: ${code}`);
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (u) => {
        if (u.connection === 'open') {
            console.log('\n✅ READY!');
            await runUniversalTask(sock);
        } else if (u.connection === 'close') {
            if (u.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) startWhatsApp();
        }
    });
}

async function runUniversalTask(sock) {
    const filePath = './send.apk'; // <-- CHANGE THIS to your file (send.jpg, send.pdf, etc.)
    const csvPath = 'contacts.csv';

    if (!fs.existsSync(csvPath) || !fs.existsSync(filePath)) {
        console.log("❌ Missing files. Ensure contacts.csv and your attachment exist.");
        process.exit();
    }

    const fileType = getFileType(filePath);
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.toLowerCase().includes('phone')) continue;

        // Dynamic CSV Handling: Detects "Phone" or "Phone,Name"
        let [phone, name] = line.split(',');
        phone = phone.trim().replace('+', '');
        name = name ? name.trim() : "Friend"; // Default name if not provided

        const chatId = `${phone}@s.whatsapp.net`;
        console.log(`🚀 [${i+1}] Sending ${fileType} to ${name} (${phone})...`);

        try {
            const messageOptions = { caption: `Hello ${name}!` };
            messageOptions[fileType] = { url: filePath };

            // Add extra metadata if it's a document (like APK/PDF)
            if (fileType === 'document') {
                messageOptions.fileName = path.basename(filePath);
                messageOptions.mimetype = filePath.endsWith('.apk') ? 
                    'application/vnd.android.package-archive' : 'application/octet-stream';
            }

            await sock.sendMessage(chatId, messageOptions);
            console.log("✅ Sent. 6s gap...");
            await delay(6000);
        } catch (e) { console.log(`❌ Error: ${e.message}`); }
    }
    console.log("🏁 Done!");
    process.exit();
}

startWhatsApp();
