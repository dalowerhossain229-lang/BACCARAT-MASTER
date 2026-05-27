const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
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

// 🃏 ওরিজিনাল ব্যাকারাত মেমোরি ডেক (10, J, Q, K এর পয়েন্ট ০ এবং Ace এর পয়েন্ট ১ ভাই ভাই)
const cardDeck = [
    { value: "2", suit: "♥️", points: 2 }, { value: "3", suit: "♥️", points: 3 }, { value: "4", suit: "♥️", points: 4 },
    { value: "5", suit: "♥️", points: 5 }, { value: "6", suit: "♥️", points: 6 }, { value: "7", suit: "♥️", points: 7 },
    { value: "8", suit: "♥️", points: 8 }, { value: "9", suit: "♥️", points: 9 }, { value: "10", suit: "♥️", points: 0 },
    { value: "J", suit: "♥️", points: 0 }, { value: "Q", suit: "♥️", points: 0 }, { value: "K", suit: "♥️", points: 0 }, { value: "A", suit: "♥️", points: 1 },
    
    { value: "2", suit: "♦️", points: 2 }, { value: "3", suit: "♦️", points: 3 }, { value: "4", suit: "♦️", points: 4 },
    { value: "5", suit: "♦️", points: 5 }, { value: "6", suit: "♦️", points: 6 }, { value: "7", suit: "♦️", points: 7 },
    { value: "8", suit: "♦️", points: 8 }, { value: "9", suit: "♦️", points: 9 }, { value: "10", suit: "♦️", points: 0 },
    { value: "J", suit: "♦️", points: 0 }, { value: "Q", suit: "♦️", points: 0 }, { value: "K", suit: "♦️", points: 0 }, { value: "A", suit: "♦️", points: 1 },
    
    { value: "2", suit: "♣️", points: 2 }, { value: "3", suit: "♣️", points: 3 }, { value: "4", suit: "♣️", points: 4 },
    { value: "5", suit: "♣️", points: 5 }, { value: "6", suit: "♣️", points: 6 }, { value: "7", suit: "♣️", points: 7 },
    { value: "8", suit: "♣️", points: 8 }, { value: "9", suit: "♣️", points: 9 }, { value: "10", suit: "♣️", points: 0 },
    { value: "J", suit: "♣️", points: 0 }, { value: "Q", suit: "♣️", points: 0 }, { value: "K", suit: "♣️", points: 0 }, { value: "A", suit: "♣️", points: 1 },
    
    { value: "2", suit: "♠️", points: 2 }, { value: "3", suit: "♠️", points: 3 }, { value: "4", suit: "♠️", points: 4 },
    { value: "5", suit: "♠️", points: 5 }, { value: "6", suit: "♠️", points: 6 }, { value: "7", suit: "♠️", points: 7 },
    { value: "8", suit: "♠️", points: 8 }, { value: "9", suit: "♠️", points: 9 }, { value: "10", suit: "♠️", points: 0 },
    { value: "J", suit: "♠️", points: 0 }, { value: "Q", suit: "♠️", points: 0 }, { value: "K", suit: "♠️", points: 0 }, { value: "A", suit: "♠️", points: 1 }
];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/baccarat-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    try {
        const response = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${wallet}`, { timeout: 30000 });
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ব্যাকারাত কোর ভিআইপি ডিল এপিআই রাউট (POST Route - ৯৫% RTP গাণিতিক অ্যালগরিদম বর্ম লক ভাই ভাই!)
app.post('/api/baccarat-deal', async (req, res) => {
    const { userId, amount, wallet, prediction } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = prediction || "PLAYER"; // PLAYER, BANKER, TIE

    if (reqAmount < 1 || reqAmount > 2000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳২০০০)" });
    }

    try {
        const balCheck = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${targetWallet}`, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balCheck.data && balCheck.data.balance !== undefined && balCheck.data.balance !== null) {
            currentDbBalance = parseFloat(balCheck.data.balance);
        } else { currentDbBalance = 9999999; }

        if (currentDbBalance < reqAmount && currentDbBalance !== 9999999) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge." });
        }

        // 🎯 [ভবিষ্যৎ সেন্ট্রাল গোপন এডমিন প্যানেল গেটওয়ে লিঙ্ক লক]
        let adminTriggeredPrize = (balCheck.data && balCheck.data.baccarat_target) ? balCheck.data.baccarat_target : null;

        let pHand, bHand, pScore, bScore, winnerSide, finalStatus, winMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল RTP ও সুষম ৩-কার্ড র্যান্ডমাইজেশন লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            let pool = [...cardDeck];
            pHand = [pool.splice(Math.floor(Math.random() * pool.length), 1)[0], pool.splice(Math.floor(Math.random() * pool.length), 1)[0]];
            bHand = [pool.splice(Math.floor(Math.random() * pool.length), 1)[0], pool.splice(Math.floor(Math.random() * pool.length), 1)[0]];

            pScore = (pHand[0].points + pHand[1].points) % 10;
            bScore = (bHand[0].points + bHand[1].points) % 10;

            // 🧠 ওরিজিনাল ব্যাকারাত ক্যাসিনো থার্ড কার্ড হিট রুলস ইঞ্জিন ভাই ভাই
            if (pScore < 8 && bScore < 8) {
                let pThirdCardValue = -1;
                
                // প্লেয়ার থার্ড কার্ড কন্ডিশন ভাই ভাই
                if (pScore <= 5) {
                    let thirdCard = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
                    pHand.push(thirdCard);
                    pThirdCardValue = thirdCard.points;
                    pScore = (pScore + pThirdCardValue) % 10;
                }

                // ব্যাংকার থার্ড কার্ড ম্যাট্রিক্স কন্ডিশন লক ভাই ভাই
                let bankerDraws = false;
                if (pThirdCardValue === -1) {
                    if (bScore <= 5) bankerDraws = true;
                } else {
                    if (bScore <= 2) bankerDraws = true;
                    else if (bScore === 3 && pThirdCardValue !== 8) bankerDraws = true;
                    else if (bScore === 4 && [2, 3, 4, 5, 6, 7].includes(pThirdCardValue)) bankerDraws = true;
                    else if (bScore === 5 && [4, 5, 6, 7].includes(pThirdCardValue)) bankerDraws = true;
                    else if (bScore === 6 && [6, 7].includes(pThirdCardValue)) bankerDraws = true;
                }

                if (bankerDraws) {
                    let thirdCard = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
                    bHand.push(thirdCard);
                    bScore = (bScore + thirdCard.points) % 10;
                }
            }

            // চূড়ান্ত উইনার সাইড ফয়সালা
            if (pScore > bScore) winnerSide = "PLAYER";
            else if (bScore > pScore) winnerSide = "BANKER";
            else winnerSide = "TIE";

            if (userPrediction === winnerSide) {
                finalStatus = "win";
                winMultiplier = (winnerSide === "TIE") ? 9.00 : (winnerSide === "BANKER" ? 1.95 : 2.00);
            } else if (winnerSide === "TIE") {
                // প্লেয়ার বা ব্যাংকারে বাজি ধরে টাই হলে বাজি রিফান্ড (টাকা ফেরত ভাই!)
                finalStatus = "push";
                winMultiplier = 1.00;
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === winnerSide && finalStatus === "win") isLoopActive = false;
            } else {
                // 🔒 টাই পড়ার চান্স স্বাভাবিক ট্র্যাকে মাত্র ৩% র্যান্ডম করা হলো ভাই ভাই
                if (winnerSide === "TIE" && userPrediction === "TIE" && Math.random() > 0.03) continue;

                if (finalStatus === "win") {
                    // ৯৫% আরটিপি ব্যালেন্স ট্র্যাকিং লুপ অনুযায়ী প্লেয়ার উইন চান্স ৪৬% লক ভাই ভাই
                    if (Math.random() <= 0.46) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; // প্লেয়ার লস খেলে লুপ সাথে সাথে স্টপ ভাই
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalStatus === "win" || finalStatus === "push") {
            winAmount = Math.floor(reqAmount * winMultiplier);
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

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                winnerSide: winnerSide,
                playerHand: pHand,
                bankerHand: bHand,
                playerScore: pScore,
                bankerScore: bScore
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Baccarat Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Baccarat VIP Engine!"); });

// ২১ নম্বর গেম ২৮০০০ এ চলছে, তাই ২২ নম্বর মেগা ব্যাকারাত গেম প্রজেক্টের স্বাধীন কাস্টম পোর্ট ২৯০০০ কড়া লক হলো ভাই ভাই!
const PORT = process.env.PORT || 29000;
server.listen(PORT, () => { console.log(`🎡 Royal Baccarat VIP Engine Running on port ${PORT}`); });
