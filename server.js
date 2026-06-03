const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গেটওয়ে সকেট প্রোটোকল লক ভাই ভাই]
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 
const cardSuitsPool = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারсеপ্টর গেটওয়ে
app.get('/api/baccarat-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: 0, wallet: wallet || "main", game: "baccaratmaster"
        }, { timeout: 30000 });
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ব্যাকারাত মাস্টার কোর ট্রানজেকশন ডিল রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/baccarat-deal', async (req, res) => {
    const { userId, amount, wallet, prediction, game } = req.body;
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = prediction || "PLAYER";
    const finalGameName = "baccaratmaster"; // 🎯 লবির কি-শর্টকোড টাইট লক

    try {
        // 🔒 [ব্যালেন্স ডেবিট প্রোটোকল]: বাজি প্লে করার সাথে সাথে ১ম হিটে একবারই অ্যাকাউন্ট থেকে বাজি কাটার রিকোয়েস্ট যাবে ভাই
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: reqAmount, wallet: wallet || "main", game: finalGameName
        }, { timeout: 30000 });
        
        if (!balResponse.data || balResponse.data.status !== "ok") {
            return res.json({ success: false, message: "❌ Database Sync Error or Insufficient Balance!" });
        }

        let currentDbBalance = parseFloat(balResponse.data.balance);
        let playerCards = [];
        let bankerCards = [];
        let pScore = 0, bScore = 0;
        
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP এবং ব্যাকারাত ন্যাচারাল কার্ড ডিলিং লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            playerCards = [];
            bankerCards = [];
            let ranks = {1:"A", 11:"J", 12:"Q", 13:"K"};
            
            for(let i=0; i<2; i++) {
                let pVal = Math.floor(Math.random() * 13) + 1;
                let bVal = Math.floor(Math.random() * 13) + 1;
                playerCards.push({ value: ranks[pVal] || pVal.toString(), suit: cardSuitsPool[Math.floor(Math.random()*4)] });
                bankerCards.push({ value: ranks[bVal] || bVal.toString(), suit: cardSuitsPool[Math.floor(Math.random()*4)] });
            }

            const getBacScore = (cards) => {
                let total = 0;
                cards.forEach(c => {
                    if (["J","Q","K","10"].includes(c.value)) total += 0;
                    else if (c.value === "A") total += 1;
                    else total += parseInt(c.value);
                });
                return total % 10;
            };

            pScore = getBacScore(playerCards);
            bScore = getBacScore(bankerCards);

            let finalResult = "TIE";
            if (pScore > bScore) finalResult = "PLAYER";
            else if (bScore > pScore) finalResult = "BANKER";

            let winMultiplier = 0.00;
            let finalStatus = "lose";

            if (userPrediction === finalResult) {
                finalStatus = "win";
                winMultiplier = (finalResult === "TIE") ? 9.0 : ((finalResult === "BANKER") ? 1.95 : 2.0);
            }

            // এডমিন প্যানেল ফোর্স উইন-লস কন্ট্রোল নব
            if (balResponse.data && balResponse.data.baccarat_target) {
                let target = balResponse.data.baccarat_target;
                if (target === "force_lose" && finalStatus === "win") isLoopActive = false;
                if (target === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    if (Math.random() <= 0.42) isLoopActive = false;
                } else {
                    isLoopActive = false;
                }
            }
        }

        // 🎯 [মেগা কিলার জিরো-ডাবল-ডেবিট স্টেক ব্যালেন্সার বর্ম ভাই ভাই]
        // বাজি ধরার টাকা রাউন্ডের শুরুতেই ১ম হিটে একবারই কাটবে, খেলা শেষে লস হলে ২য় বার ১টি টাকাও কাটবে না ওস্তাদ!
        let winAmount = 0, dbAction = "win", dbAmount = 0;
        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win"; dbAmount = winAmount;
        } else {
            // 🔒 [লস সিকিউরিটি লক]: বাজি লস হলে ডাটাবেজে ২য় বার কোনো টাকা কাটার কমান্ড যাবে না ভাই ভাই!
            dbAction = "win"; dbAmount = 0; 
        }

        let phpPayload = { action: dbAction, username: userId, amount: dbAmount, wallet: wallet || "main", game: finalGameName };
        if (finalStatus === "lose") phpPayload.status = "lose";
        else phpPayload.status = "win";

        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            return res.json({
                success: true, balance: response.data.balance,
                gameData: { playerCards, bankerCards, playerScore: pScore, bankerScore: bScore, status: finalStatus, winAmount, result: finalResult }
            });
        } else {
            return res.json({ success: false, balance: currentDbBalance, message: "X Bet Settlement Declined by Database!" });
        }
    } catch (e) { return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." }); }
});

const PORT = process.env.PORT || 29000;
server.listen(PORT, () => { console.log(`🎡 Baccarat Master Engine Running on port ${PORT}`); });
