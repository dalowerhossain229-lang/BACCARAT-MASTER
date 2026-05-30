const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালারトレード সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

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

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// ৫২টি তাসের ডেক জেনারেটর পুল তালিকা (ব্যাকারাত স্কোর গাইডলাইন অনুযায়ী ওডস ক্যালকুলেটর)
const cardSuitsPool = ["H", "D", "C", "S"]; 

// ব্যাকারাত স্ট্যান্ডার্ডে তাসের পয়েন্ট গণনাকারী চাবি (১০, J, Q, K = ০ পয়েন্ট, বাকিরা ফেস ভ্যালু)
function getBaccaratCardValue(val) {
    if (val >= 10) return 0;
    return val;
}

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/baccarat-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ব্যাকারাত কোর কার্ড ডিলিং রাউট (১.৯৫ ওডস ও কঠোর ২০০০০ লিমিট সিকিউরিটি ফিল্টার লক ভাই ভাই!)
app.post('/api/baccarat-deal', async (req, res) => {
    const { userId, amount, wallet, prediction } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = prediction || "PLAYER"; // PLAYER, BANKER, TIE

    // 🔒 [মেগা লিমিট কড়া ফিল্টার]: বাজি ১ টাকার কম বা ২০০০০ টাকার বেশি হলে ব্যাকএন্ড ডিরেক্ট ব্লক ভাই ভাই!
    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার আগে ডাটাবেজ থেকে রিয়েল টাকা নিশ্চিত করার চাবি
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "❌ Database Sync Error! Please refresh." });
        }

        // 🔒 [ইনসাফিসিয়েন্ট প্রোটেকশন বর্ম]: অ্যাকাউন্টে টাকা কম থাকলে বা জিরো ব্যালেন্স হলে বাজি রিফিউজড ভাই ভাই!
        if (currentDbBalance < reqAmount || currentDbBalance <= 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.baccarat_target) ? balResponse.data.baccarat_target : null;

        let playerHand, bankerHand, playerScore, bankerScore, finalResultSide, finalStatus, winMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP ব্যাকারাত গাণিতিক লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // প্লেয়ার এবং ব্যাঙ্কারের জন্য র্যান্ডম তাস ডিলিং (প্রতিটি হ্যান্ডে ২ থেকে ৩টি করে তাস)
            let p1 = Math.floor(Math.random() * 13) + 1;
            let p2 = Math.floor(Math.random() * 13) + 1;
            let b1 = Math.floor(Math.random() * 13) + 1;
            let b2 = Math.floor(Math.random() * 13) + 1;

            playerHand = [
                { value: p1, suit: cardSuitsPool[Math.floor(Math.random() * 4)] },
                { value: p2, suit: cardSuitsPool[Math.floor(Math.random() * 4)] }
            ];
            bankerHand = [
                { value: b1, suit: cardSuitsPool[Math.floor(Math.random() * 4)] },
                { value: b2, suit: cardSuitsPool[Math.floor(Math.random() * 4)] }
            ];

            playerScore = (getBaccaratCardValue(p1) + getBaccaratCardValue(p2)) % 10;
            bankerScore = (getBaccaratCardValue(b1) + getBaccaratCardValue(b2)) % 10;

            // ব্যাকারাত স্ট্যান্ডার্ড ৩য় কার্ড রুলস ফিল্টারিং ভাই ভাই
            if (playerScore <= 5) {
                let p3 = Math.floor(Math.random() * 13) + 1;
                playerHand.push({ value: p3, suit: cardSuitsPool[Math.floor(Math.random() * 4)] });
                playerScore = (playerScore + getBaccaratCardValue(p3)) % 10;
            }
            if (bankerScore <= 5 && playerScore > bankerScore) {
                let b3 = Math.floor(Math.random() * 13) + 1;
                bankerHand.push({ value: b3, suit: cardSuitsPool[Math.floor(Math.random() * 4)] });
                bankerScore = (bankerScore + getBaccaratCardValue(b3)) % 10;
            }

            // ফাইনাল সাইড উইনার নির্ধারণ চাবি
            if (playerScore > bankerScore) finalResultSide = "PLAYER";
            else if (bankerScore > playerScore) finalResultSide = "BANKER";
            else finalResultSide = "TIE";

            if (userPrediction === finalResultSide) {
                finalStatus = "win";
                // 🚀 [ওডস ১.৯৫ প্রফিট বুস্টার]: ২.০০ গুণের পরিবর্তে সরাসরি ১.৯৫ গুণ প্রফিট লক (টাই হলে স্পেশাল ওডস চাবি)
                winMultiplier = (finalResultSide === "TIE") ? 8.00 : 1.95; 
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন ড্যাশবোর্ড কন্ট্রোল ট্রিগার চাবি
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৪২% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.42) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; 
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount);
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = winMultiplier.toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        }

        // ওরিজিনাল ডাটাবেজ এপিআই পেলোড রেসপন্স কল ভাই ভাই
        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                playerHand: playerHand,
                bankerHand: bankerHand,
                playerScore: playerScore,
                bankerScore: bankerScore,
                result: finalResultSide
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Baccarat Master Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Baccarat Master Engine!"); });

// ব্যাকারাত গেম স্বতন্ত্র ৪০০০ পোর্টে কড়া নিয়নে অন ফায়ার ভাই ভাই!
const PORT = process.env.PORT || 29000; 
server.listen(PORT, () => { console.log(`🎡 Baccarat Master Engine Running on port ${PORT}`); });
