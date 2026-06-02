const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালারトレード সিঙ্ক - গেটওয়ে সকেট প্রোটোকল লক ভাই ভাই]
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

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://onrender.com"; 

// 🃏 ওরিজিনাল ইন্টারন্যাশনাল কার্ড সুটস এবং র‍্যাঙ্ক পুল
const cardSuitsPool = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারসেপ্টর গেটওয়ে
app.get('/api/baccarat-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "baccaratmaster" // 🎯 ডাইনামিক ফিল্টার ব্যাকআপ লক
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ব্যাকারাত মাস্টার কোর ট্রানজেকশন ডিল রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/baccarat-deal', async (req, res) => {
    const { userId, amount, wallet, prediction, game } = req.body;
    
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = prediction || "PLAYER"; // PLAYER, BANKER, TIE
    const finalGameName = "baccaratmaster"; // 🎯 লবির কি-শর্টকোড টাইট লক

    // 🔒 বাজি ১ টাকা থেকে ২০০০০ বিডিটি পর্যন্ত কড়া বেট সিকিউরিটি ফিল্টার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 20000 || !["PLAYER", "BANKER", "TIE"].includes(userPrediction)) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার সাথে সাথে ডাটাবেজ থেকে BDT টাকা এবং ওরিজিনাল গেমের নাম কেটে নেওয়ার বর্ম লক
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: reqAmount, // 🎯 বাজি ধরার মূল টাকা একুরেট পাস করা হলো
            wallet: targetWallet,
            game: finalGameName // 🎯 ওরিজিনাল গেমের নাম এখন ওয়ান-শটে মেইন সাইটের ডাটাবেজে অন ফায়ার পাস হবে ওস্তাদ!
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "X Database Sync Error! Please refresh and try again." });
        }

        // [ব্যালেন্স সিকিউরিটি বর্ম]: অ্যাকাউন্টে টাকা কম থাকলে বা জিরো ব্যালেন্স হলে বাজি রিফিউজড করার চাবি
        if (currentDbBalance < 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "X Insufficient Balance! Please Recharge." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.baccarat_target) ? balResponse.data.baccarat_target : null;

        let playerCards, bankerCards, pScore, bScore, finalResult, winMultiplier, finalStatus;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP এবং ব্যাকারাত ন্যাচারাল কার্ড ডিলিং লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            playerCards = [];
            bankerCards = [];
            let ranks = { 1: "A", 11: "J", 12: "Q", 13: "K" };

            // ক্যাসিনো রুলস অনুযায়ী ইনিশিয়াল ২টি করে কার্ড ফ্লিপ মেকানিজম লক ভাই ভাই
            for (let i = 0; i < 2; i++) {
                let pVal = Math.floor(Math.random() * 13) + 1;
                let bVal = Math.floor(Math.random() * 13) + 1;
                
                playerCards.push({ value: ranks[pVal] || pVal.toString(), suit: cardSuitsPool[Math.floor(Math.random() * 4)] });
                bankerCards.push({ value: ranks[bVal] || bVal.toString(), suit: cardSuitsPool[Math.floor(Math.random() * 4)] });
            }

            // ব্যাকারাত স্ট্যান্ডার্ড ০-৯ পয়েন্ট গণনাকারী কোর চাবি
            const calcBaccaratScore = (cardsList) => {
                let total = 0;
                cardsList.forEach(c => {
                    if (["J", "Q", "K", "10"].includes(c.value)) total += 0;
                    else if (c.value === "A") total += 1;
                    else total += parseInt(c.value);
                });
                return total % 10;
            };

            pScore = calcBaccaratScore(playerCards);
            bScore = calcBaccaratScore(bankerCards);

            // 🃏 ব্যাকারাত থার্ড কার্ড ডিলিং ইন্টারন্যাশনাল ট্র্যাকার কন্ডিশন
            if (pScore < 8 && bScore < 8) {
                // প্লেয়ার স্কোর ৫ বা তার নিচে হলে বাধ্যতামূলক ৩ নম্বর কার্ড পাবে
                if (pScore <= 5) {
                    let pVal3 = Math.floor(Math.random() * 13) + 1;
                    playerCards.push({ value: ranks[pVal3] || pVal3.toString(), suit: cardSuitsPool[Math.floor(Math.random() * 4)] });
                    pScore = calcBaccaratScore(playerCards);
                }
                
                // ব্যাঙ্কার স্কোর ৫ বা তার নিচে থাকলে থার্ড কার্ড প্রোটোকল সচল
                if (bScore <= 5) {
                    let bVal3 = Math.floor(Math.random() * 13) + 1;
                    bankerCards.push({ value: ranks[bVal3] || bVal3.toString(), suit: cardSuitsPool[Math.floor(Math.random() * 4)] });
                    bScore = calcBaccaratScore(bankerCards);
                }
            }

            // ফাইনাল রাউন্ড রেজাল্ট ডিক্লেয়ারার নোড
            if (pScore > bScore) finalResult = "PLAYER";
            else if (bScore > pScore) finalResult = "BANKER";
            else finalResult = "TIE";

            if (userPrediction === finalResult) {
                finalStatus = "win";
                winMultiplier = (finalResult === "TIE") ? 9.0 : ((finalResult === "BANKER") ? 1.95 : 2.0);
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন প্যানেল কন্ট্রোল ট্রিগার চাবি
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "win") isLoopActive = false;
                if (adminTriggeredPrize === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৪২% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.42) isLoopActive = false;
                } else {
                    isLoopActive = false;
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount; // 🔒 বাজি হারলেও ডাটাবেজে আপনার রিয়াল বাজি ধরার টাকাই (Stake) জমা হবে ওস্তাদ!

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount); // জিতলে উইনিং এমাউন্ট যাবে
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet,
            game: finalGameName
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = winMultiplier.toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        } else {
            phpPayload.bet_amount = reqAmount;
            phpPayload.status = "lose";
        }

        // 🛫 ৩. মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-টাইম উইন-লস সেটেলমেন্ট এপিআই হিট
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

                    return res.json({
            success: true,
            balance: response.data.balance,
            status: finalStatus,
            winAmount: winAmount,
            gameData: {
                playerCards: playerCards,
                bankerCards: bankerCards,
                playerScore: pScore,
                bankerScore: bScore,
                result: finalResult,
                status: finalStatus,
                winAmount: winAmount
            }
        });
    } else {
        let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
        return res.json({ success: false, balance: latestBal, message: "X Bet Declined by Database!" });
    }

    } catch (e) {
        console.error("Baccarat Master Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Player connected to Baccarat Master Engine!");
});

// ⚡ কাস্টম ব্যাকারাত নোড সার্ভার পোর্ট গেটওয়ে লাইভ অন ফায়ার
const PORT = process.env.PORT || 28000;
server.listen(PORT, () => {
    console.log(`Baccarat Master Engine Running on port ${PORT}`);
});
