const { default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

let isLoggingIn = false;

const getFileType = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return 'image';
    if (['.mp4', '.m4v', '.mov'].includes(ext)) return 'video';
    return 'document'; 
};

async function startSpamurai() {
    const authPath = path.join(__dirname, 'auth_session');
    
    // Ensure the directory exists
    if (!fs.existsSync(authPath)) {
        fs.mkdirSync(authPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Mac OS", "Chrome", "10.15.7"],
        printQRInTerminal: false // We handle this manually
    });

    // --- SESSION VALIDATOR ---
    // This prevents the menu from showing if creds already exist in the folder
    const hasCreds = fs.existsSync(path.join(authPath, 'creds.json'));

    if (!hasCreds && !isLoggingIn) {
        isLoggingIn = true;
        console.clear();
        console.log("SPAMURAI");
        console.log("1. QR Code | 2. Pairing Code (OTP)");
        const choice = await question("Selection: ");

        if (choice === '1') {
            sock.ev.on('connection.update', (u) => { 
                if (u.qr) qrcode.generate(u.qr, { small: true }); 
            });
        } else if (choice === '2') {
            const num = await question("📞 Number: ");
            try {
                const code = await sock.requestPairingCode(num.trim());
                console.log(`\n🔑 YOUR CODE: ${code}`);
            } catch (e) {
                console.log("❌ Error requesting code. Try QR.");
            }
        }
    }

    // Force save credentials to disk
    sock.ev.on('creds.update', async () => {
        await saveCreds();
    });

    sock.ev.on('connection.update', async (u) => {
        const { connection, lastDisconnect } = u;

        if (connection === 'open') {
            console.log('\n✅ Logged In! Session Authenticated.');
            isLoggingIn = false;
            await runSpamuraiTask(sock);
        } else if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log("🔄 Reconnecting...");
                startSpamurai();
            } else {
                console.log("❌ Logged out. Delete 'auth_session' to reset.");
                process.exit();
            }
        }
    });
}

async function runSpamuraiTask(sock) {
    const fileName = await question("📄 Enter filename with extention (e.g. send.apk): ");
    const filePath = `./${fileName.trim()}`;
    const csvPath = 'contacts.csv';

    if (!fs.existsSync(filePath) || !fs.existsSync(csvPath)) {
        console.log("❌ Files missing. Check your directory.");
        process.exit();
    }

    const fileType = getFileType(filePath);
    const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.toLowerCase().includes('phone')) continue;

        let [phone, name] = line.split(',');
        phone = phone.trim().replace('+', '');
        name = name ? name.trim() : "User";

        console.log(`⚔️  [${i+1}/${lines.length}] Slashing through to ${name}...`);

        try {
            const msgBody = { caption: `Sent via Spamurai.` };
            msgBody[fileType] = { url: filePath };

            if (fileType === 'document') {
                msgBody.fileName = path.basename(filePath);
                msgBody.mimetype = filePath.endsWith('.apk') ? 
                    'application/vnd.android.package-archive' : 'application/octet-stream';
            }

            await sock.sendMessage(`${phone}@s.whatsapp.net`, msgBody);
            console.log("✅ Success. 6s gap...");
            await delay(6000);
        } catch (e) { console.log(`❌ Strike missed: ${e.message}`); }
    }
    console.log("🏁 Mission Complete.");
    process.exit();
}

startSpamurai();
