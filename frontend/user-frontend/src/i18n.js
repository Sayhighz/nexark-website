import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        brand: 'NEXARK',
        currencySymbol: '฿',
        error: 'Error',
        tryAgain: 'Try Again',
        loading: 'Loading...'
      },
      auth: {
        signIn: 'Sign in',
        logout: 'Logout',
        loginToBuy: 'Sign in to buy',
        loginToGift: 'Please sign in before sending a gift',
      },
      navbar: {
        x25: 'X25',
        x100: 'X100',
        store: 'Store',
        subscribe: 'Subscribe',
        account: 'Account',
        x25Server: 'X25 Server',
        x100Server: 'X100 Server',
      },
      server: {
        sections: {
          settings: 'Settings',
          structures: 'Structures',
          dinos: 'Dinos',
          items: 'Items',
          environment: 'Environment',
          commands: 'Commands',
          rules: 'Server Rules',
        },
      },
      profile: {
        topUp: 'Top Up Credits',
        transactions: 'Top-up History',
      },
      home: {
        marquee: {
          line1: 'EPIC PVP BATTLES AWAIT - JOIN THE ULTIMATE COMBAT EXPERIENCE',
          line2: 'COMPETE AGAINST THE BEST - CLIMB THE LEADERBOARDS',
          line3: 'MASTER YOUR SKILLS - BECOME A PVP LEGEND',
          line4: 'FAST-PACED ACTION - NON-STOP ADRENALINE RUSH',
          line5: 'DOMINATE THE BATTLEFIELD - PROVE YOUR WORTH',
          line6: 'INTENSE PVP MODES - X25 & X100 SERVERS',
          r1: 'BUILD YOUR EMPIRE - CRAFT, SURVIVE, CONQUER',
          r2: 'EXPLORE VAST WORLDS - DISCOVER HIDDEN TREASURES',
          r3: 'TEAM UP WITH FRIENDS - CREATE LASTING ALLIANCES',
          r4: 'CUSTOMIZE YOUR BASE - DEFEND YOUR TERRITORY',
          r5: 'EVOLVE YOUR STRATEGY - ADAPT AND OVERCOME',
          r6: 'NEXARK AWAITS - YOUR ADVENTURE BEGINS NOW',
        }
      },
      serverModes: {
        title: 'Choose Your Server',
        subtitle: 'Select the server that matches your playstyle and join the ultimate gaming experience',
        cta: {
          joinX25: 'Join X25 Server',
          joinX100: 'Join X100 Server'
        },
        x25: {
          title: 'X25 Server',
          desc: 'Perfect for players who enjoy balanced, relaxed gameplay and building a friendly community',
          features: {
            balanced: { title: 'Balanced Gameplay', body: 'Ideal for a healthy balance between gaming and real life' },
            community: { title: 'Community Focus', body: 'Emphasis on group play and a strong community' },
            steady: { title: 'Steady Progress', body: 'Progress at a steady pace without stress' }
          }
        },
        x100: {
          title: 'X100 Server',
          desc: 'For players who love speed, challenge, and high competition to reach the top',
          features: {
            hardcore: { title: 'Hardcore Experience', body: 'Designed for those seeking the highest challenge' },
            competitive: { title: 'Competitive Edge', body: 'Intense competition with worthwhile rewards' },
            fast: { title: 'Fast-Paced Action', body: 'Rapid gameplay and quick decision making' }
          }
        }
      },
      serverShowcase: {
        title: 'Choose Your Galaxy',
        subtitle: 'Select a server realm and start your adventure',
        rateLabels: {
          taming: 'Taming',
          harvest: 'Harvest',
          breeding: 'Breeding',
          xp: 'XP'
        },
        x25Title: 'X25 Galaxy',
        x100Title: 'X100 Nebula',
        exploreAll: 'Explore all servers',
        enter: 'Enter {{title}}'
      },
      shop: {
        title: 'Shop',
        subtitle: 'Buy items and boosters for your ARK adventure',
        searchPlaceholder: 'Search items...',
        allCategories: 'All Categories',
        categories: {
          weapons: 'Weapons',
          armor: 'Armor',
          dinos: 'Dinosaurs',
          resources: 'Resources',
          tools: 'Tools',
          food: 'Food',
        },
        rarity: {
          legendary: 'Legendary',
          epic: 'Epic',
          rare: 'Rare',
          common: 'Common',
        },
        featured: 'Featured',
        left: 'Left {{count}}',
        empty: {
          title: 'No items found',
          subtitle: 'Try adjusting your search or category filters',
        },
        tips: {
          header: '💡 Shopping Tips',
          t1: 'All purchases are processed immediately',
          t2: 'Items are delivered directly to your selected server',
          t3: 'Payment is deducted from your account credits',
          t4: 'Need help? Contact an admin',
        },
        buttons: {
          buy: 'Buy',
          buying: 'Buying...',
          gift: 'Gift',
        },
        loginToBuy: 'Sign in to buy',
        confirm: {
          title: 'Confirm Purchase',
          content: 'Do you want to buy {{item}} for {{currency}}{{price}}?',
          ok: 'Confirm',
          cancel: 'Cancel',
        },
        purchase: {
          successTitle: 'Purchase Successful',
          successDesc: 'Bought {{item}} successfully',
          successModal: 'Purchased {{item}}. The item will be sent to the server.',
        },
        errors: {
          insufficientCreditsTitle: 'Insufficient Credits',
          insufficientCreditsDesc: 'Please top up credits before purchasing items',
          outOfStockTitle: 'Purchase Failed',
          outOfStockDesc: 'This item is out of stock',
          notFoundTitle: 'Purchase Failed',
          notFoundDesc: 'Item not found',
          genericTitle: 'Purchase Failed',
          genericDesc: 'An error occurred while purchasing the item',
          loginRequiredBuy: 'Please sign in before buying',
          loginRequiredGift: 'Please sign in before sending a gift',
        },
        labels: {
          category: 'Category',
          stock: 'Stock',
          inStock: 'In stock',
          stockLeft: 'Left {{count}} pcs',
        }
      },
      item: {
        backToShop: '← Back to Shop',
        detailsTitle: 'Item Details',
        featured: 'Featured',
        description: 'Description',
        noDescription: 'No description available for this item',
        category: 'Category',
        stockStatus: 'Stock Status',
        stockLeft: 'Left {{count}} pcs',
        inStock: 'In stock',
        additionalInfo: {
          header: '💡 Additional Information',
          i1: 'Purchases are processed immediately',
          i2: 'Items are sent directly to your selected server',
          i3: 'Credits are used from your account balance',
        },
        buttons: {
          buy: 'Buy - {{currency}}{{price}}',
          buying: 'Buying...',
          gift: 'Send Gift',
          loginToBuy: 'Sign in to buy',
        },
        confirm: {
          title: 'Confirm Purchase',
          content: 'Do you want to buy {{item}} for {{currency}}{{price}}?',
          ok: 'Confirm',
          cancel: 'Cancel',
        },
        purchase: {
          successTitle: 'Purchase Successful',
          successDesc: 'Bought {{item}} successfully',
          successModal: 'Purchased {{item}}. The item will be sent to the server.',
        },
        errors: {
          insufficientCreditsTitle: 'Insufficient Credits',
          insufficientCreditsDesc: 'Please top up credits before purchasing items',
          outOfStockTitle: 'Purchase Failed',
          outOfStockDesc: 'This item is out of stock',
          notFoundTitle: 'Purchase Failed',
          notFoundDesc: 'Item not found',
          genericTitle: 'Purchase Failed',
          genericDesc: 'An error occurred while purchasing the item',
          loginRequiredBuy: 'Please sign in before buying',
          loginRequiredGift: 'Please sign in before sending a gift',
          invalidSteamId: 'Invalid Steam ID',
          giftSuccess: 'Gifted {{item}} to SteamID: {{steamId}} successfully!',
        }
      },
      dashboard: {
        welcomeBack: 'Welcome back, {{name}}! 🚀',
        ready: 'Ready to explore ARK Survival Evolved servers?',
        cards: {
          credits: 'Credits',
          servers: 'Servers',
          online: '({{count}} online)',
        },
        quickActions: 'Quick Actions',
        actions: {
          browseServers: 'Browse Servers',
          shopItems: 'Shop Items',
          playGames: 'Play Games',
          topUpCredits: 'Top Up Credits',
        },
        recentActivity: 'Recent Activity',
        activityWelcomeTitle: 'Welcome to NexARK!',
        activityWelcomeDesc: 'Start exploring our ARK servers',
      },
      games: {
        title: 'Games & Rewards',
        subtitle: 'Earn credits and have fun with our gamification features',
        spinWheel: '🎡 Spin Wheel',
        spinDesc: 'Spin the wheel to win credits! Available once every 24 hours.',
        spinCenter: 'Spin to Win!',
        spinning: 'Spinning...',
        spin: 'Spin the Wheel!',
        comeBackTomorrow: 'Come back tomorrow',
        nextSpin: 'Next spin available: {{time}}',
        dailyRewards: '📅 Daily Rewards',
        dailyDesc: 'Claim your daily reward to maintain your streak!',
        streak: '{{count}} Day Streak',
        keepItUp: 'Keep it up for bigger rewards!',
        todaysReward: "Today's Reward",
        claim: 'Claim Daily Reward',
        claiming: 'Claiming...',
        alreadyClaimed: 'Already claimed today',
        rules: {
          title: '🎮 Game Rules',
          spinWheel: 'Spin Wheel:',
          spinRules: [
            'Spin once every 24 hours',
            'Chance to win credits',
            'Higher stakes, higher rewards'
          ],
          dailyRewards: 'Daily Rewards:',
          dailyRules: [
            'Claim once per day',
            'Build your streak for bonuses',
            'Never miss a day!'
          ]
        }
      },
      credits: {
        title: 'Top Up Credits',
        subtitle: 'Choose the right top-up package for you with special bonuses',
        selectPackage: 'Select Package',
        bonus: '+ {{currency}}{{amount}} bonus',
        topUpButton: 'Top Up',
        bestValue: 'Best Value',
        successTitle: 'Payment Successful!',
        successDesc: 'Your credits have been updated.',
        processing: 'Processing...',
        pleaseWait: 'Please wait a moment',
        acceptTermsLabel: 'I have read and accept the',
        terms: 'Terms',
        conditions: 'Conditions',
        avoidTransferWindow: 'Avoid transfers between 23:00 and 00:10.',
        warnings: {
          title: 'Warnings',
          contactAdmin: 'Contact admin',
          w1: 'After transferring, it may take 1 - 5 minutes.',
          w2: 'Banks undergo maintenance between 23:00 and 00:10. Avoid transferring during this time.',
          w3: 'If your slip is correct but credits are not added, please contact admin.'
        }
      },
      transactions: {
        title: 'Transaction History',
        subtitle: 'Check your top-up and spending history',
        filters: {
          all: 'All',
          topup: 'Top-ups',
          spend: 'Spending'
        },
        sort: {
          newest: 'Newest first',
          oldest: 'Oldest first'
        },
        refresh: 'Refresh',
        loading: 'Loading transactions...',
        noDescription: 'No description',
        creditsUnit: 'credits',
        balanceAfter: 'Balance:',
        empty: {
          title: 'No transactions yet',
          subtitle: 'When you top up or purchase items, your history will appear here'
        },
        summary: {
          totalTitle: 'Total Transactions',
          itemsLabel: 'items',
          topupTotal: 'Total Top-ups',
          spendTotal: 'Total Spending',
          credits: 'credits'
        }
      },
      authCallback: {
        signingIn: 'Signing in with Steam...',
        failedTitle: 'Login Failed',
        backHome: 'Back to Home',
        authFailedFallback: 'Authentication failed'
      },
      giftModal: {
        title: 'Send Gift',
        howToTitle: 'How to find your SteamID',
        instructions: {
          i1: 'Open ARK and press F1 to open the Console',
          i2: 'Type: showmyadminmanager',
          i3: 'Your SteamID will appear in the Admin Manager',
          i4: 'Or visit: steamid.io'
        },
        recipientLabel: 'Recipient SteamID',
        confirmLabel: 'Confirm SteamID',
        placeholderId: 'e.g. 76561198000000000',
        idHint: 'SteamID must be a 17-digit number',
        errors: {
          idRequired: 'Please enter recipient SteamID',
          confirmRequired: 'Please confirm SteamID',
          idMismatch: 'SteamID does not match. Please check again.',
          idFormat: 'Invalid SteamID format (must be a 17-digit number)'
        },
        warningTitle: 'Warning:',
        warnings: {
          w1: 'Verify the SteamID before sending',
          w2: 'Items will be sent to the selected server',
          w3: 'Gifts cannot be cancelled'
        },
        cancel: 'Cancel',
        send: 'Send Gift',
        sending: 'Sending...'
      }
    },
  },
  th: {
    translation: {
      common: {
        brand: 'NEXARK',
        currencySymbol: '฿',
        error: 'ข้อผิดพลาด',
        tryAgain: 'ลองอีกครั้ง',
        loading: 'กำลังโหลด...'
      },
      auth: {
        signIn: 'เข้าสู่ระบบ',
        logout: 'ออกจากระบบ',
        loginToBuy: 'เข้าสู่ระบบเพื่อซื้อ',
        loginToGift: 'กรุณาเข้าสู่ระบบก่อนส่งของขวัญ',
      },
      navbar: {
        x25: 'X25',
        x100: 'X100',
        store: 'ร้านค้า',
        subscribe: 'สมัครสมาชิก',
        account: 'บัญชี',
        x25Server: 'X25 Server',
        x100Server: 'X100 Server',
      },
      server: {
        sections: {
          settings: 'การตั้งค่า',
          structures: 'สิ่งปลูกสร้าง',
          dinos: 'ไดโนเสาร์',
          items: 'ไอเทม',
          environment: 'สภาพแวดล้อม',
          commands: 'คำสั่ง',
          rules: 'กฎของเซิร์ฟเวอร์',
        },
      },
      profile: {
        topUp: 'เติมเครดิต',
        transactions: 'ประวัติการเติมเงิน',
      },
      home: {
        marquee: {
          line1: 'การต่อสู้ PVP สุดมันส์ - เข้าร่วมประสบการณ์การรบขั้นสุด',
          line2: 'ท้าชนผู้เล่นระดับท็อป - ไต่แรงก์สู่จุดสูงสุด',
          line3: 'พัฒนาฝีมือ - ก้าวสู่ตำนาน PVP',
          line4: 'แอคชันรวดเร็ว - อะดรีนาลีนพุ่งไม่หยุด',
          line5: 'ยึดครองสนามรบ - พิสูจน์ความสามารถของคุณ',
          line6: 'โหมด PVP เข้มข้น - เซิร์ฟเวอร์ X25 & X100',
          r1: 'สร้างอาณาจักร - คราฟต์ อยู่รอด พิชิต',
          r2: 'สำรวจโลกกว้าง - ค้นพบสมบัติที่ซ่อนอยู่',
          r3: 'รวมพลังกับเพื่อน - สร้างพันธมิตรอันแข็งแกร่ง',
          r4: 'ปรับแต่งฐาน - ปกป้องอาณาเขตของคุณ',
          r5: 'พัฒนากลยุทธ์ - ปรับตัวและเอาชนะ',
          r6: 'NEXARK รอคุณอยู่ - การผจญภัยของคุณเริ่มต้นแล้ว',
        }
      },
      serverModes: {
        title: 'เลือกเซิร์ฟเวอร์ของคุณ',
        subtitle: 'เลือกเซิร์ฟเวอร์ที่เหมาะกับสไตล์การเล่นของคุณ และเข้าร่วมประสบการณ์เกมมิ่งขั้นสุด',
        cta: {
          joinX25: 'เข้าร่วม X25 Server',
          joinX100: 'เข้าร่วม X100 Server'
        },
        x25: {
          title: 'X25 Server',
          desc: 'เหมาะสำหรับผู้เล่นที่ชอบการเล่นแบบสมดุล ผ่อนคลาย และสร้างชุมชนที่เป็นมิตร',
          features: {
            balanced: { title: 'การเล่นที่สมดุล', body: 'เหมาะสำหรับการสร้างสมดุลระหว่างการเล่นเกมและชีวิตจริง' },
            community: { title: 'เน้นชุมชน', body: 'เน้นการเล่นเป็นกลุ่มและชุมชนที่แข็งแกร่ง' },
            steady: { title: 'ความก้าวหน้าที่มั่นคง', body: 'ก้าวหน้าในจังหวะที่มั่นคงโดยไม่เครียด' }
          }
        },
        x100: {
          title: 'X100 Server',
          desc: 'สำหรับผู้เล่นที่รักความเร็ว ความท้าทาย และการแข่งขันสูงเพื่อไปสู่จุดสูงสุด',
          features: {
            hardcore: { title: 'ประสบการณ์ฮาร์ดคอร์', body: 'ออกแบบสำหรับผู้ที่แสวงหาความท้าทายสูงสุด' },
            competitive: { title: 'ความได้เปรียบในการแข่งขัน', body: 'การแข่งขันที่เข้มข้นพร้อมรางวัลที่คุ้มค่า' },
            fast: { title: 'แอคชันรวดเร็ว', body: 'การเล่นที่รวดเร็วและการตัดสินใจอย่างฉับไว' }
          }
        }
      },
      serverShowcase: {
        title: 'เลือกกาแล็กซี่ของคุณ',
        subtitle: 'เลือกเซิร์ฟเวอร์และเริ่มต้นการผจญภัยของคุณ',
        rateLabels: {
          taming: 'เทม',
          harvest: 'เก็บเกี่ยว',
          breeding: 'ผสมพันธุ์',
          xp: 'XP'
        },
        x25Title: 'X25 Galaxy',
        x100Title: 'X100 Nebula',
        exploreAll: 'สำรวจเซิร์ฟเวอร์ทั้งหมด',
        enter: 'เข้าสู่ {{title}}'
      },
      shop: {
        title: 'ร้านค้า',
        subtitle: 'ซื้อไอเทมและบูสเตอร์สำหรับการผจญภัยใน ARK ของคุณ',
        searchPlaceholder: 'ค้นหาไอเทม...',
        allCategories: 'หมวดหมู่ทั้งหมด',
        categories: {
          weapons: 'อาวุธ',
          armor: 'เกราะป้องกัน',
          dinos: 'ไดโนเสาร์',
          resources: 'ทรัพยากร',
          tools: 'เครื่องมือ',
          food: 'อาหาร',
        },
        rarity: {
          legendary: 'ตำนาน',
          epic: 'มหากาพย์',
          rare: 'หายาก',
          common: 'ธรรมดา',
        },
        featured: 'แนะนำ',
        left: 'เหลือ {{count}}',
        empty: {
          title: 'ไม่พบไอเทม',
          subtitle: 'ลองปรับการค้นหาหรือตัวกรองหมวดหมู่ของคุณ',
        },
        tips: {
          header: '💡 เคล็ดลับการซื้อสินค้า',
          t1: 'การซื้อทั้งหมดจะได้รับการประมวลผลทันที',
          t2: 'ไอเทมจะถูกส่งตรงไปยังเซิร์ฟเวอร์ที่เลือกของคุณ',
          t3: 'ใช้เครดิตจากยอดเงินในบัญชีของคุณ',
          t4: 'หากต้องการความช่วยเหลือ ติดต่อแอดมิน',
        },
        buttons: {
          buy: 'ซื้อ',
          buying: 'กำลังซื้อ...',
          gift: 'ของขวัญ',
        },
        loginToBuy: 'เข้าสู่ระบบเพื่อซื้อ',
        confirm: {
          title: 'ยืนยันการซื้อ',
          content: 'คุณต้องการซื้อ {{item}} ราคา {{currency}}{{price}} ใช่หรือไม่?',
          ok: 'ยืนยัน',
          cancel: 'ยกเลิก',
        },
        purchase: {
          successTitle: 'สั่งซื้อสำเร็จ',
          successDesc: 'ซื้อ {{item}} สำเร็จ',
          successModal: 'ซื้อ {{item}} เรียบร้อย ไอเทมจะถูกส่งไปยังเซิร์ฟเวอร์',
        },
        errors: {
          insufficientCreditsTitle: 'เครดิตไม่เพียงพอ',
          insufficientCreditsDesc: 'กรุณาเติมเครดิตก่อนทำการซื้อไอเทม',
          outOfStockTitle: 'ซื้อไม่สำเร็จ',
          outOfStockDesc: 'ไอเทมนี้หมดสต๊อกแล้ว',
          notFoundTitle: 'ซื้อไม่สำเร็จ',
          notFoundDesc: 'ไม่พบไอเทมนี้',
          genericTitle: 'ซื้อไม่สำเร็จ',
          genericDesc: 'เกิดข้อผิดพลาดในการซื้อไอเทม',
          loginRequiredBuy: 'กรุณาเข้าสู่ระบบก่อนทำการซื้อ',
          loginRequiredGift: 'กรุณาเข้าสู่ระบบก่อนส่งของขวัญ',
        },
        labels: {
          category: 'หมวดหมู่',
          stock: 'สถานะสต็อก',
          inStock: 'มีสินค้าคงเหลือ',
          stockLeft: 'เหลือ {{count}} ชิ้น',
        }
      },
      item: {
        backToShop: '← กลับไปร้านค้า',
        detailsTitle: 'รายละเอียดไอเทม',
        featured: 'แนะนำ',
        description: 'คำอธิบาย',
        noDescription: 'ไม่มีคำอธิบายสำหรับไอเทมนี้',
        category: 'หมวดหมู่',
        stockStatus: 'สถานะสต็อก',
        stockLeft: 'เหลือ {{count}} ชิ้น',
        inStock: 'มีสินค้าคงเหลือ',
        additionalInfo: {
          header: '💡 ข้อมูลเพิ่มเติม',
          i1: 'การซื้อจะได้รับการประมวลผลทันที',
          i2: 'ไอเทมจะถูกส่งตรงไปยังเซิร์ฟเวอร์ที่เลือก',
          i3: 'ใช้เครดิตจากยอดเงินในบัญชีของคุณ',
        },
        buttons: {
          buy: 'ซื้อ - {{currency}}{{price}}',
          buying: 'กำลังซื้อ...',
          gift: 'ส่งของขวัญ',
          loginToBuy: 'เข้าสู่ระบบเพื่อซื้อ',
        },
        confirm: {
          title: 'ยืนยันการซื้อ',
          content: 'คุณต้องการซื้อ {{item}} ราคา {{currency}}{{price}} ใช่หรือไม่?',
          ok: 'ยืนยัน',
          cancel: 'ยกเลิก',
        },
        purchase: {
          successTitle: 'สั่งซื้อสำเร็จ',
          successDesc: 'ซื้อ {{item}} สำเร็จ',
          successModal: 'ซื้อ {{item}} เรียบร้อย ไอเทมจะถูกส่งไปยังเซิร์ฟเวอร์',
        },
        errors: {
          insufficientCreditsTitle: 'เครดิตไม่เพียงพอ',
          insufficientCreditsDesc: 'กรุณาเติมเครดิตก่อนทำการซื้อไอเทม',
          outOfStockTitle: 'ซื้อไม่สำเร็จ',
          outOfStockDesc: 'ไอเทมนี้หมดสต๊อกแล้ว',
          notFoundTitle: 'ซื้อไม่สำเร็จ',
          notFoundDesc: 'ไม่พบไอเทมนี้',
          genericTitle: 'ซื้อไม่สำเร็จ',
          genericDesc: 'เกิดข้อผิดพลาดในการซื้อไอเทม',
          loginRequiredBuy: 'กรุณาเข้าสู่ระบบก่อนทำการซื้อ',
          loginRequiredGift: 'กรุณาเข้าสู่ระบบก่อนส่งของขวัญ',
          invalidSteamId: 'Steam ID ไม่ถูกต้อง',
          giftSuccess: 'ส่งของขวัญ {{item}} ให้ SteamID: {{steamId}} สำเร็จ!',
        }
      },
      dashboard: {
        welcomeBack: 'ยินดีต้อนรับกลับ, {{name}}! 🚀',
        ready: 'พร้อมสำรวจเซิร์ฟเวอร์ ARK Survival Evolved หรือยัง?',
        cards: {
          credits: 'เครดิต',
          servers: 'เซิร์ฟเวอร์',
          online: '({{count}} ออนไลน์)',
        },
        quickActions: 'เมนูลัด',
        actions: {
          browseServers: 'ดูเซิร์ฟเวอร์',
          shopItems: 'ซื้อสินค้า',
          playGames: 'เล่นเกม',
          topUpCredits: 'เติมเครดิต',
        },
        recentActivity: 'กิจกรรมล่าสุด',
        activityWelcomeTitle: 'ยินดีต้อนรับสู่ NexARK!',
        activityWelcomeDesc: 'เริ่มต้นสำรวจเซิร์ฟเวอร์ ARK ของเราได้เลย',
      },
      games: {
        title: 'เกมและรางวัล',
        subtitle: 'รับเครดิตและสนุกไปกับฟีเจอร์เกมมิฟิเคชันของเรา',
        spinWheel: '🎡 วงล้อสุ่มรางวัล',
        spinDesc: 'หมุนวงล้อเพื่อลุ้นรับเครดิต! เล่นได้ทุกๆ 24 ชั่วโมง',
        spinCenter: 'หมุนเพื่อลุ้น!',
        spinning: 'กำลังหมุน...',
        spin: 'หมุนวงล้อ!',
        comeBackTomorrow: 'กลับมาใหม่พรุ่งนี้',
        nextSpin: 'หมุนได้อีกครั้ง: {{time}}',
        dailyRewards: '📅 รางวัลรายวัน',
        dailyDesc: 'รับรางวัลรายวันเพื่อรักษาคอมโบของคุณ!',
        streak: '{{count}} วันติดต่อกัน',
        keepItUp: 'ทำต่อไปเพื่อรับรางวัลที่มากขึ้น!',
        todaysReward: 'รางวัลวันนี้',
        claim: 'รับรางวัลรายวัน',
        claiming: 'กำลังรับรางวัล...',
        alreadyClaimed: 'รับรางวัลวันนี้แล้ว',
        rules: {
          title: '🎮 กติกาการเล่น',
          spinWheel: 'วงล้อสุ่มรางวัล:',
          spinRules: [
            'หมุนได้ทุก 24 ชั่วโมง',
            'มีโอกาสได้รับเครดิต',
            'เสี่ยงมาก ยิ่งได้มาก'
          ],
          dailyRewards: 'รางวัลรายวัน:',
          dailyRules: [
            'รับได้วันละครั้ง',
            'สะสมสตรีคเพื่อรับโบนัส',
            'ห้ามพลาดสักวัน!'
          ]
        }
      },
      credits: {
        title: 'เติมเครดิต',
        subtitle: 'เลือกแพ็คเกจเติมเครดิตที่เหมาะสมกับคุณ พร้อมโบนัสพิเศษ',
        selectPackage: 'เลือกแพ็คเกจ',
        bonus: '+ {{currency}}{{amount}} โบนัส',
        topUpButton: 'เติมเงิน',
        bestValue: 'คุ้มที่สุด',
        successTitle: 'การชำระเงินสำเร็จ!',
        successDesc: 'เครดิตของคุณได้รับการอัปเดตแล้ว',
        processing: 'กำลังดำเนินการ...',
        pleaseWait: 'กรุณารอสักครู่',
        acceptTermsLabel: 'ฉันได้อ่านและยอมรับ',
        terms: 'ข้อตกลง',
        conditions: 'เงื่อนไข',
        avoidTransferWindow: 'หลีกเลี่ยงการโอนย้ายระหว่างเวลา 23:00 ถึง 00:10 น.',
        warnings: {
          title: 'ข้อควรระวัง',
          contactAdmin: 'ติดต่อแอดมิน',
          w1: 'หลังโอนอาจใช้เวลา 1 - 5 นาที',
          w2: 'ธนาคารปิดปรับปรุงช่วงเวลา 23:00 ถึง 00:10 ควรหลีกเลี่ยงการโอนช่วงนี้',
          w3: 'หากสลิปถูกต้องแต่ยอดเงินไม่เข้า โปรดติดต่อแอดมิน'
        }
      },
      transactions: {
        title: 'ประวัติการทำรายการ',
        subtitle: 'ตรวจสอบประวัติการเติมเงินและการใช้จ่ายเครดิตของคุณ',
        filters: {
          all: 'ทั้งหมด',
          topup: 'เติมเงิน',
          spend: 'การใช้จ่าย'
        },
        sort: {
          newest: 'ใหม่สุดก่อน',
          oldest: 'เก่าสุดก่อน'
        },
        refresh: 'รีเฟรช',
        loading: 'กำลังโหลดประวัติการทำรายการ...',
        noDescription: 'ไม่มีรายละเอียด',
        creditsUnit: 'เครดิต',
        balanceAfter: 'ยอดคงเหลือ:',
        empty: {
          title: 'ยังไม่มีประวัติการทำรายการ',
          subtitle: 'เมื่อคุณทำรายการเติมเงินหรือซื้อสินค้า ประวัติจะแสดงที่นี่'
        },
        summary: {
          totalTitle: 'รายการทั้งหมด',
          itemsLabel: 'รายการ',
          topupTotal: 'เติมเงินทั้งหมด',
          spendTotal: 'ใช้จ่ายทั้งหมด',
          credits: 'เครดิต'
        }
      },
      authCallback: {
        signingIn: 'กำลังเข้าสู่ระบบด้วย Steam...',
        failedTitle: 'การเข้าสู่ระบบล้มเหลว',
        backHome: 'กลับหน้าหลัก',
        authFailedFallback: 'การยืนยันตัวตนล้มเหลว'
      },
      giftModal: {
        title: 'ส่งของขวัญ',
        howToTitle: 'วิธีการหา SteamID',
        instructions: {
          i1: 'เข้าเกม ARK แล้วกด F1 เพื่อเปิด Console',
          i2: 'พิมพ์คำสั่ง: showmyadminmanager',
          i3: 'SteamID จะแสดงอยู่ในส่วน Admin Manager',
          i4: 'หรือเข้าเว็บ: steamid.io'
        },
        recipientLabel: 'SteamID ของผู้รับ',
        confirmLabel: 'ยืนยัน SteamID',
        placeholderId: 'เช่น: 76561198000000000',
        idHint: 'SteamID ต้องเป็นตัวเลข 17 หลัก',
        errors: {
          idRequired: 'กรุณากรอก SteamID ของผู้รับ',
          confirmRequired: 'กรุณายืนยัน SteamID',
          idMismatch: 'SteamID ไม่ตรงกัน กรุณาตรวจสอบ',
          idFormat: 'รูปแบบ SteamID ไม่ถูกต้อง (ต้องเป็นตัวเลข 17 หลัก)'
        },
        warningTitle: 'คำเตือน:',
        warnings: {
          w1: 'ตรวจสอบ SteamID ให้ถูกต้องก่อนส่ง',
          w2: 'ไอเทมจะถูกส่งไปยังเซิร์ฟเวอร์ที่เลือก',
          w3: 'การส่งของขวัญไม่สามารถยกเลิกได้'
        },
        cancel: 'ยกเลิก',
        send: 'ส่งของขวัญ',
        sending: 'กำลังส่ง...'
      }
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'th'],
    detection: {
      order: ['localStorage', 'querystring', 'navigator', 'htmlTag', 'cookie'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;