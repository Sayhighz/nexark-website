-- Overwrite servers.details with full JSON content sourced from frontend mocks
-- Server 1: x25 values as-is
UPDATE servers SET details = CAST('{
  "settings": [
    {"title": "XP Multiplier", "subtitle": "Experience gain multiplier", "value": "x25"},
    {"title": "Harvest Multiplier", "subtitle": "Resource gathering multiplier", "value": "x25"},
    {"title": "Egg Hatch Speed", "subtitle": "Egg hatching speed multiplier", "value": "x25"},
    {"title": "Beacon Loot Quality", "subtitle": "Supply drop loot quality multiplier", "value": "x1"},
    {"title": "Fishing Loot Quality", "subtitle": "Fishing loot quality multiplier", "value": "x1"},
    {"title": "Fuel Consumption Interval", "subtitle": "Fuel consumption rate multiplier", "value": "x3"},
    {"title": "PVP Cryopod Cooldown", "subtitle": "Cooldown time for cryopods in PVP", "value": "60 Sec"},
    {"title": "Unlimited Mindwipe Respecs", "subtitle": "Unlimited character stat respecification", "value": "True"},
    {"title": "Max Tribe Limit", "subtitle": "Maximum members per tribe", "value": "8"},
    {"title": "Alliances", "subtitle": "Tribe alliance system", "value": "False"}
  ],
  "structures": [
    {"title": "Turrets in Range Limit", "subtitle": "Maximum turrets within foundation radius", "value": "33"},
    {"title": "Total Turret Limit", "subtitle": "Maximum number of turrets allowed", "value": "125"},
    {"title": "Structure Limit", "subtitle": "Maximum structures per tribe", "value": "35,000"},
    {"title": "Snap Point Limit", "subtitle": "Maximum snap points allowed", "value": "6,500"},
    {"title": "Propagator Limit", "subtitle": "Maximum propagators allowed", "value": "10"},
    {"title": "Propagator Inventory", "subtitle": "Propagator inventory slot capacity", "value": "200"},
    {"title": "Propagator Change Gender", "subtitle": "Ability to change creature gender", "value": "Disabled"},
    {"title": "Propagator Mutator", "subtitle": "Propagator mutation system", "value": "Disabled"},
    {"title": "Hatchery Limit", "subtitle": "Maximum hatcheries allowed", "value": "5"},
    {"title": "Hatchery Inventory", "subtitle": "Hatchery inventory slot capacity", "value": "200"}
  ],
  "dinos": {
    "defaultSettings": {
      "title": "Default Dino Settings",
      "subtitle": "Basic dino configuration parameters",
      "items": [
        "Max Level Wild Dino: 150 + 100",
        "Max Level Tamed Dino: 450",
        "Dino Limit per Tribe: 400",
        "Breed Cooldown: 4-6 hr (meaning 4 - 10 hr)",
        "Turret Damage: x1",
        "Baby Mature Speed: x40",
        "Weight: x200",
        "Taming Speed: x50",
        "MutationRateMultiplier: 20%",
        "Disable Level Speed For Flyer"
      ]
    },
    "bossContent": {
      "title": "Boss & Content",
      "subtitle": "Boss and special content modifications",
      "items": [
        "Boss: Nerf 80%",
        "Corrupt Dinos: Nerf 50%"
      ]
    },
    "buffNerf": {
      "title": "Buff & Nerf Details",
      "subtitle": "Include Tek & Aberrant & X & R variants",
      "items": [
        "Arthropleura: DMG x3",
        "Andrewsarchus: Resistance 0.8x, 1.5x",
        "Astrocetus: DMG x1.3",
        "Astrodelphis: DMG x0.3",
        "Baryonyx: DMG x0.1",
        "Basiliq: Resistance x1.5",
        "Bloodstalker: DMG x2, Resistance x1.5 - Disable Net",
        "Carbo: Resistance x1.25",
        "Caseoon: Resistance x0.6",
        "Desmo: DMG x0.4, Resistance x0.8",
        "Deino: Resistance x2",
        "Diplo: Resistance x1.6",
        "Equus/Unicorn: Resistance x1.5",
        "Fjoardhawk: Resistance x0.1",
        "Giga: DMG x1.3, Resistance x1.1",
        "Karkinos: Resistance x0.5",
        "Maewing: Resistance x0.4",
        "Mammoth: DMG x0.1",
        "Managarmr: DMG x1.5 - Disable Net",
        "Mantis: Resistance x0.7",
        "Mek: DMG x2.5 - Dmg Structure & Dinos",
        "Megachelon: Resistance x1.5",
        "Paracer: Resistance x2.5",
        "Pteranodon: Resistance x1.4",
        "Quetzal: Resistance x2",
        "Rex: Resistance x1.2",
        "Stego: Resistance x1.2",
        "Spino: DMG x2",
        "Tape: DMG x1.7, Resistance x2 - Can Level Speed and Cap 160%",
        "Theri: DMG x2.2",
        "Woolly Rhino: DMG x2",
        "Velonasaur: DMG x3"
      ]
    },
    "removedDinos": {
      "title": "Removed Dinos",
      "subtitle": "Include Tek & Aberrant & X & R variants",
      "items": [
        "Ammonite", "Araneo", "Archaeopteryx", "Coelacanth", "Dimetrodon",
        "Dimorphodon", "Eurypterid", "Glowbug", "Giant Bee", "Hyaenodon",
        "Queen Bee", "Ichthyornis", "Lamprey", "Leech", "Manta",
        "Mesophage Swarm", "Megapiranha", "Oil Jug", "Onyc", "Pegomastax",
        "Scout", "Seeker", "Subterranean Reaper King", "Troodon", "Vulture"
      ]
    },
    "propagatorSettings": {
      "title": "Propagator Settings",
      "subtitle": "Breeding and mutation system configuration",
      "items": [
        "Propagator Mutation Chance: 7%",
        "Not Respect Global Mutation Multiplier",
        "Propagator Change Gender: Disabled",
        "Propagator Mutator: Disabled"
      ]
    }
  },
  "environment": [
    {
      "title": "PvP Timeline Season 9",
      "subtitle": "September - October 2025 (Thailand Local Time GMT+7)",
      "calendar": true,
      "items": [
        "🟢 PVE DAY - No PvP allowed",
        "🟠 PVP ONLY 18:00-23:59 - Limited PvP hours",
        "🔴 PVP 24HRS - Full PvP all day",
        "🚀 START PVP 24HRS AT 18:00 - PvP begins at 6 PM"
      ]
    },
    {
      "title": "Week 1 (Sep 1-6)",
      "subtitle": "Season Opening Week",
      "items": [
        "Fri 05: 🚀 PVP START 18:00",
        "Sat 06: 🔴 PVP END 06:00"
      ]
    },
    {
      "title": "Week 2 (Sep 7-13)",
      "subtitle": "Regular Schedule Begins",
      "items": [
        "Sun 07: 🟢 PVE DAY",
        "Mon 08: 🟢 PVE DAY",
        "Tue 09: 🟢 PVE DAY",
        "Wed 10: 🟢 PVE DAY",
        "Thu 11: 🟢 PVE DAY",
        "Fri 12: 🟠 PVP ONLY 18:00-23:59",
        "Sat 13: 🟠 PVP ONLY 18:00-23:59"
      ]
    },
    {
      "title": "Week 3 (Sep 14-20)",
      "subtitle": "Mid-Season Schedule",
      "items": [
        "Sun 14: 🟠 PVP ONLY 18:00-23:59",
        "Mon 15: 🟢 PVE DAY",
        "Tue 16: 🟢 PVE DAY",
        "Wed 17: 🟢 PVE DAY",
        "Thu 18: 🟢 PVE DAY",
        "Fri 19: 🟠 PVP ONLY 18:00-23:59",
        "Sat 20: 🟠 PVP ONLY 18:00-23:59"
      ]
    },
    {
      "title": "Week 4 (Sep 21-27)",
      "subtitle": "Pre-Finals Intensive",
      "items": [
        "Sun 21: 🟠 PVP ONLY 18:00-23:59",
        "Mon 22: 🟠 PVP ONLY 18:00-23:59",
        "Tue 23: 🟠 PVP ONLY 18:00-23:59",
        "Wed 24: 🟠 PVP ONLY 18:00-23:59",
        "Thu 25: 🟠 PVP ONLY 18:00-23:59",
        "Fri 26: 🟢 PVE DAY",
        "Sat 27: 🚀 START PVP 24HRS AT 18:00"
      ]
    },
    {
      "title": "Final Week (Sep 28 - Oct 2)",
      "subtitle": "Season 9 Finale - Full PvP",
      "items": [
        "Sun 28: 🔴 PVP 24HRS",
        "Mon 29: 🔴 PVP 24HRS",
        "Tue 30: 🔴 PVP 24HRS",
        "Wed 01 Oct: 🔴 PVP 24HRS",
        "Thu 02 Oct: 🔴 PVP 24HRS"
      ]
    }
  ],
  "commands": [
    {
      "title": "Shop & Economy",
      "subtitle": "In-game shop and data transfer commands",
      "commands": [
        {"cmd": "/shop", "desc": "Open in game shop."},
        {"cmd": "/upload", "desc": "Upload Element(and non Transferable) to ark data"},
        {"cmd": "/download", "desc": "Download Element(and non Transferable) to ark data"}
      ]
    },
    {
      "title": "Character & Limits",
      "subtitle": "Character management and limit checking",
      "commands": [
        {"cmd": "/suicide", "desc": "Kill your self"},
        {"cmd": "/dinolimits", "desc": "Check your dino limits"},
        {"cmd": "/showlimits", "desc": "Check your Global Structure limits"}
      ]
    },
    {
      "title": "Turret Management",
      "subtitle": "Turret control and configuration",
      "commands": [
        {"cmd": "/fill", "desc": "[ use 5 Points ] — fill all turrets in range with ammo from your inventory"},
        {"cmd": "/turrets on", "desc": "Turn on all turrets in range."},
        {"cmd": "/turrets high", "desc": "Make all turrets in range to high settings."}
      ]
    },
    {
      "title": "Utility Commands",
      "subtitle": "Various utility and management commands",
      "commands": [
        {"cmd": "/tlr", "desc": "Link In game Tribe log to discord via Webhook."},
        {"cmd": "/getbody", "desc": "[ use 5 Points ] — get your bags body."},
        {"cmd": "/transfergun", "desc": "Make Fabricated pistol become tranfer tools."},
        {"cmd": "/countStructures", "desc": "Check Snappoint Limit."}
      ]
    },
    {
      "title": "Cryopod Commands",
      "subtitle": "Cryopod and dino management",
      "commands": [
        {"cmd": "/pod", "desc": "Force dino to cryopod(looking)."},
        {"cmd": "/pods", "desc": "Force dino to cryopod(in your area)."}
      ]
    },
    {
      "title": "Token Commands",
      "subtitle": "Commands requiring tokens",
      "commands": [
        {"cmd": "/cg", "desc": "[ use Token ] — Change dino gengder."},
        {"cmd": "/givebirth", "desc": "[ use Token ] — Force dino birth."},
        {"cmd": "/hatch", "desc": "[ use Token ] — Force dino egg to be hatch. (Need Perfect Temp)"},
        {"cmd": "/wake", "desc": "[ use Token ] — Force Knocked dino to be wake. (Remove Torpor)"},
        {"cmd": "/finishclone", "desc": "[ use Token ] — Force Clonning Chamber to finish clone."}
      ]
    },
    {
      "title": "VIP Only Commands",
      "subtitle": "Exclusive commands for VIP members",
      "commands": [
        {"cmd": "/sdc 0 1", "desc": "[ VIP ONLY ] — Change dino color."},
        {"cmd": "/claimbabies", "desc": "[ VIP ONLY ] — Claim baby with 100% imprint and force to cryo in your area."}
      ]
    },
    {
      "title": "Discord Channel Commands",
      "subtitle": "Can use this command in # ⚡ x25-use-cmd ONLY",
      "commands": [
        {"cmd": "/verify", "desc": "link discord acc to ark acc."},
        {"cmd": "/kickme", "desc": "kick your character in game"}
      ],
      "special": true
    }
  ],
  "rules": [
    {
      "title": "แนะนำทั่วไป",
      "subtitle": "คำแนะนำสำหรับการเล่นบนเซิฟเวอร์",
      "items": [
        "ใช้วิจารณญาณ คิด วิเคราะห์ แล้วก็ แยกแยะว่าอะไรควรไม่ควร",
        "การตัดสินใจของ แอดมิน ถือเป็นที่สิ้นสุด",
        "อย่าโกง เล่นกันแฟร์ ๆ",
        "ถ้าดราม่ามา เรื่องของพวกคุณ แอดไม่เกี่ยวข้องทุกกรณี",
        "อย่าใช้จุดบั๊กในแผนที่เพื่ออยู่ ทางเข้าบ้านต้อง เดินเข้า , ย่อเข้า , บินเข้าแบบปกติ ได้",
        "PVE ก็เล่นชิล ๆ ไป PVP ก็ตีกันไป เซิร์ฟเราคือ PVPVE — อยู่โหมดไหนก็รู้จักแยกแยะและใช้สมองหน่อย",
        "ว่าด้วยเรื่องของการยิงแม่นทั้งหลาย , ใครที่รู้ตัวว่ายิงแม่นได้โปรดอัดคลิป",
        "แอดจะรับพิจารนาเรื่องของ Aimbot ก็ต่อเมื่อมีหลักฐานมากเพียงพอ เกมนี้มัน 10 ปีแล้วครับ เล่นเก่งๆก็มีเยอะ และ โปรก็มีเยอะเหมือนกัน"
      ]
    },
    {
      "title": "General Rules",
      "subtitle": "กฎทั่วไปสำหรับเซิฟเวอร์",
      "items": [
        "หากต้องการจะแจ้งอะไร ต้องมีหลักฐานที่ชัดเจนมากๆ แอดจะให้ความสำคัญตามลำดับนี้คือ คลิปวีดีโอ ➞ รูปภาพ ➞ พิมพ์แจ้ง ไม่งั้นไม่รับแก้ปัญหาให้ทุกกรณี",
        "1. ห้ามใช้บัคหรือข้อบกพร่องของเกมหรือระบบและโปรแกรมช่วยเล่นทุกกรณี โดยเฉพาะบัคที่ส่งผลหนักต่อการ PvP (Dupe, Cheats, Hitbox Damage)",
        "2. ห้ามนำสัตว์ทิ้งไว้นอกบริเวณบ้านในช่วงเวลา PvE รวมถึงการทิ้งไข่ใกล้บริเวณรัง Rock Drake, Wyvern กรณีไม่เอาให้กิน",
        "3. ห้ามป่วนไม่ว่ากรณีใดๆก็ตามทุกกรณีขณะ PVE รวมถึงการเข้าบริเวณบ้านผู้อื่นไม่ว่าด้วยจุดประสงค์ใดก็ตาม",
        "3.1 - ห้ามเข้าบ้านหรือบริเวณบ้านของเผ่าอื่นก่อนเวลา PVP เพื่อการ RAID หรือลากสัตว์เข้าบ้านคนอื่น",
        "3.2 - ห้ามทำการบล็อคทางเข้า Boss Lava Golem ขณะ PVE ไม่ว่าด้วยวิธีใดก็ตาม",
        "3.3 ห้ามทำการป่วนผู้เล่นฟาร์ม Element Node , Orbital Supply Drop ใน Extinction ขณะ PVE",
        "3.4 - ผู้เล่นที่ขอ PVE สามารถโดนป้อมยิงได้โปรดระวังข้อนี้"
      ]
    },
    {
      "title": "Building Rules",
      "subtitle": "กฎการสร้างสิ่งปลูกสร้าง",
      "items": [
        "1. สำหรับที่สร้างบ้านให้สร้างในจุดที่คนสามารถเดินเข้า,ย่อ,บินได้ปกติเท่านั้น ห้ามใช้บัคหรือช่องโหว่หรือข้อบกพร่องของตัวเกม",
        "2. ห้ามวางสิ่งปลูกกสร้างนอกอาณาเขตบริเวณบ้าน รวมไปถึงการสุ่มวาง สิ่งปลูกสร้างนอกอาณาเขตบริเวณบ้าน",
        "2.1 - การวางสิ่งปลูกสร้างกั๊กพื้นที่สามารถทำได้ แต่ต้องอยู่ในระยะจากภายในบ้าน",
        "2.2 - ห้ามสแปมสิ่งก่อสร้างนอกระยะแสดงผลของสิ่งก่อสร้างบริเวณอาณาเขตบ้านขณะเวลา PVP",
        "3. ห้ามสร้างหรือวางสิ่งปลูกสร้างบริเวณจุดเกิดผู้เล่นใหม่ทั้งหมดและแหล่งทรัพยากร",
        "4. ห้ามสร้างสิ่งปลุกสร้างทะลุฉากหรือจมดินหรือลอยฟ้าทุกกรณี",
        "4.1 สามารถสร้าง ป้อมลอยกลาง Giant Hatchframe , เสา Transmitter ลอยกลาง Giant Hatchframe",
        "5. การสร้างบน Platform Saddle สามารถสร้างได้ทุกรูปแบบ ยกเว้นการวาง TekReplicator หรือ KAV TekReplicator ห้ามวางบน Quetzal"
      ]
    },
    {
      "title": "Raid & PVP Rules",
      "subtitle": "กฎการ Raid และ PVP - ไม่มีกฏ 1v1 สามารถ 3rd party ได้หมด",
      "items": [
        "1. หลังจากจบ PVP ต้องออกจากพื้นที่ภายใน 20 นาทีและต้องเก็บสิ่งปลูกสร้างทั้งหมดหลังจากจบ PVP ภายใน 24 ชม",
        "1.2 - ไม่สามารถ Donate ขอ PVE ได้ยกเว้นกรณีที่ไม่ได้โดนตั้ง FOB ค้างไว้สามารถ Donate ขอ PVE ได้",
        "1.3 - สามารถขังผู้เล่นได้เฉพาะเวลา PVP เท่านั่น",
        "1.4 - ห้ามต่อเติม FOB หลังจากเวลา PVP ไม่ว่ากรณีใดๆทั้งสิ้น อนุญาติได้แค่เก็บสัตว์",
        "1.5 - สำหรับบ้านที่โดนตี ห้าม ต่อเติมบริเวณที่โดนตีโดยเด็ดขาดเช่นกัน เช่น โดนพัง Dead Wall ก็ห้ามซ่อมหรือต่อเติม",
        "2. ห้ามทำการ RAID หรือตั้ง FOB กักพื้นที่สำหรับเผ่าที่ได้รับ PVE ไม่ว่ากรณีใดๆทั้งสิ้น",
        "3. ห้ามทำการตั้ง FOB หน้าบ้านคนอื่นรวมถึงสัตว์ในเกมทุกชนิดก่อนเวลา PVP",
        "4. คุณสามารถยึด/จับ/เอาไปซ่อน ไดโนของเผ่าอื่นได้ในระหว่างช่วงเวลา PvP แต่จะต้องปล่อยคืนเมื่อเข้าสู่โหมด PvE ภายใน 2 ชั่วโมง",
        "5. ห้าม /suicide ตอนโดน Noglin สิง หรือตอนโดนใส่กุญแจมือ แบนทันที 1 วันหากทำ"
      ]
    }
  ],
  "items": {
    "itemStackSize": {
      "title": "Item Stack & Weight",
      "subtitle": "Stack size and weight modifications",
      "items": ["Stack Items: x10", "Item Weight Reduction: 80%"]
    },
    "weapons": {
      "title": "Weapons",
      "subtitle": "Weapon durability and damage caps",
      "items": [
        "Fabricated Sniper Rifle - Durability: 1000%, Damage: 350%, Auto Silencer, 12 AMMO/MAG",
        "Tek Bow - Durability: 1000%, Damage: 298%, Nerf: 100% → 70%, Tranq: Cannot use with tamed dinos",
        "Tek Pistol - Durability: 1000%, Damage: 159.4%",
        "Tek Sniper Rifle - Durability: 1000%, Damage: 159.4%",
        "Tek Rifle - Durability: 1000%, Damage: 159.4%",
        "Tek Sword - Durability: 1000%, Damage: 180%",
        "Tek Grenade Launcher - Durability: 1000%, Damage: 159.4%",
        "Assault Rifle - Durability: 1000%, Damage: 298%",
        "Bow - Durability: 1000%, Damage: 298%",
        "Compound Bow - Durability: 1000%, Damage: 398%",
        "Flamethrower - Durability: 1000%, Damage: 298%",
        "Harpoon Launcher - Durability: 1000%, Damage: 298%",
        "Longneck Rifle - Durability: 1000%, Damage: 298%",
        "Pump-Action Shotgun - Durability: 1000%, Damage: 298%",
        "Sword - Durability: 1000%, Damage: 298%",
        "Club - Durability: 1000%, Damage: 298%"
      ]
    },
    "armor": {
      "title": "Armor Sets",
      "subtitle": "Armor durability and protection caps",
      "items": [
        "Cloth Armor - Durability: 250%, Armor: 49.6",
        "Hide Armor - Durability: 450%, Armor: 99.2",
        "Chitin Armor - Durability: 500%, Armor: 248",
        "Metal (Flak) Armor - Durability: 1300%, Armor: 500",
        "Fur Armor - Durability: 1200%, Armor: 198.4",
        "Riot Armor - Durability: 1200%, Armor: 570.4",
        "Ghillie Armor - Durability: 450%, Armor: 194.8",
        "Desert Cloth Armor - Durability: 450%, Armor: 194.8",
        "Hazard Suit - Durability: 855%, Armor: 322.4",
        "Tek Armor - Durability: 1500%, Armor: 720",
        "SCUBA Gear - Durability: 450%"
      ]
    },
    "shields": {
      "title": "Shields & Saddles",
      "subtitle": "Shield durability and saddle armor caps",
      "items": [
        "Wooden Shield - Durability: 7000%",
        "Metal Shield - Durability: 12500%",
        "Riot Shield - Durability: 23000%",
        "Tek Shield - Durability: 23000%",
        "Standard Saddles - Armor: 124",
        "Tek Saddles - Armor: 223.2",
        "Platform Saddles - Armor: 60-100 (varies by creature)",
        "Rock Golem Saddle - Armor: 74.5"
      ]
    },
    "customCrafting": {
      "title": "Custom Crafting",
      "subtitle": "Modified crafting recipes",
      "items": [
        "Advance Rifle Bullets = 5x Gunpowder, 1x Metal Ingot",
        "Tranquilizer Arrow = 2x Stone Arrow",
        "Grappling Hook = 30x Fiber, 10x Metal Ingot",
        "Shocking Dart = 3x Bio Toxin, 2x Metal Ingot",
        "RPG Ammo = 20x Cementing Paste, 40x Gunpowder, 10x Metal Ingot, 10x Polymer",
        "Shotgun Ammo = 3x Gunpowder, 1x Metal Ingot",
        "C4 Charge = 5x Electronics, 60x Gunpowder, 5x Polymer",
        "Heavy Auto Turret = 150x Cementing Paste, 200x Electronics, 400x Metal Ingot, 50x Polymer",
        "Cryopod = 10x Metal Ingot"
      ]
    },
    "customRecipes": {
      "title": "Custom Recipes",
      "subtitle": "Modified food and consumable recipes",
      "items": [
        "Lesser Antidote = 10x Rare Flower, 10x Rare Mushroom, 1x Narcotic",
        "Shadow Steak = 10x Cooked Prime Meat",
        "Mindwipe = 20x Rare Flower, 20x Rare Mushroom, 20x Stimulant, 20x Narcotic",
        "Cactus Broth = 10x Amarberry, 5x Cactus Sap",
        "Focal Chili = 3x Citronal, 10x Tintoberry",
        "Lazarus Chowder = 5x Longrass, 10x Mejoberry",
        "Cake = 20x Fiber, 10x Rockarrot",
        "Medical Brew = 20x Tintoberry",
        "Energy Brew = 20x Azulberry"
      ]
    },
    "removedEngrams": {
      "title": "Removed Engrams",
      "subtitle": "MOST OS S+ Engrams & Structure",
      "items": [
        "Lv5: Wooden Sign, Salt, Preserving Salt",
        "Lv7: Single Panel Flag, Tent, Standing Torch",
        "Lv8: Multi-Panel Flag, Compass",
        "Lv9: Boomerang, Training Dummy",
        "Lv10: Glow Stick",
        "Lv11: Stone Pipe All",
        "Lv12: Pressure Plate",
        "Lv13: Vessel",
        "Lv15: Water Well, Flare Gun, All Adobe Structure",
        "Lv16: Gravestone, Delivery Crate",
        "Lv17: Rope Ladder, All Stone pipe, Water Reservoir",
        "Lv20: All Elevator Structure except Elevator Track",
        "Lv21: Wall Torch",
        "Lv22: Tripwire Alarm Trap",
        "Lv25: Artifact Pedestal",
        "Lv28: StoneFireplace, Hanta Saddle",
        "Lv29: Tripwire Narcotic Trap, AmmoBox",
        "Lv31: Zip-Line Anchor",
        "Lv33: Mirror, Lance",
        "Lv34: Climbing pick",
        "Lv38: Re-Fertilizer",
        "Lv45: Pliers",
        "Lv50: Metal Sign, Camera, Industrial Grill",
        "Lv51: Radio",
        "Lv54: ZIP-line Motor attachment",
        "Lv59: Laser Attachment",
        "Lv60: Transponder Tracker, Transponder Node"
      ]
    }
  }
}' AS JSON)
WHERE server_id = 1;

-- Server 2: x100 only for XP/Harvest/Egg Hatch - others identical
UPDATE servers SET details = CAST('{
  "settings": [
    {"title": "XP Multiplier", "subtitle": "Experience gain multiplier", "value": "x100"},
    {"title": "Harvest Multiplier", "subtitle": "Resource gathering multiplier", "value": "x100"},
    {"title": "Egg Hatch Speed", "subtitle": "Egg hatching speed multiplier", "value": "x100"},
    {"title": "Beacon Loot Quality", "subtitle": "Supply drop loot quality multiplier", "value": "x1"},
    {"title": "Fishing Loot Quality", "subtitle": "Fishing loot quality multiplier", "value": "x1"},
    {"title": "Fuel Consumption Interval", "subtitle": "Fuel consumption rate multiplier", "value": "x3"},
    {"title": "PVP Cryopod Cooldown", "subtitle": "Cooldown time for cryopods in PVP", "value": "60 Sec"},
    {"title": "Unlimited Mindwipe Respecs", "subtitle": "Unlimited character stat respecification", "value": "True"},
    {"title": "Max Tribe Limit", "subtitle": "Maximum members per tribe", "value": "8"},
    {"title": "Alliances", "subtitle": "Tribe alliance system", "value": "False"}
  ],
  "structures": [
    {"title": "Turrets in Range Limit", "subtitle": "Maximum turrets within foundation radius", "value": "33"},
    {"title": "Total Turret Limit", "subtitle": "Maximum number of turrets allowed", "value": "125"},
    {"title": "Structure Limit", "subtitle": "Maximum structures per tribe", "value": "35,000"},
    {"title": "Snap Point Limit", "subtitle": "Maximum snap points allowed", "value": "6,500"},
    {"title": "Propagator Limit", "subtitle": "Maximum propagators allowed", "value": "10"},
    {"title": "Propagator Inventory", "subtitle": "Propagator inventory slot capacity", "value": "200"},
    {"title": "Propagator Change Gender", "subtitle": "Ability to change creature gender", "value": "Disabled"},
    {"title": "Propagator Mutator", "subtitle": "Propagator mutation system", "value": "Disabled"},
    {"title": "Hatchery Limit", "subtitle": "Maximum hatcheries allowed", "value": "5"},
    {"title": "Hatchery Inventory", "subtitle": "Hatchery inventory slot capacity", "value": "200"}
  ],
  "dinos": {
    "defaultSettings": {
      "title": "Default Dino Settings",
      "subtitle": "Basic dino configuration parameters",
      "items": [
        "Max Level Wild Dino: 150 + 100",
        "Max Level Tamed Dino: 450",
        "Dino Limit per Tribe: 400",
        "Breed Cooldown: 4-6 hr (meaning 4 - 10 hr)",
        "Turret Damage: x1",
        "Baby Mature Speed: x40",
        "Weight: x200",
        "Taming Speed: x50",
        "MutationRateMultiplier: 20%",
        "Disable Level Speed For Flyer"
      ]
    },
    "bossContent": {
      "title": "Boss & Content",
      "subtitle": "Boss and special content modifications",
      "items": [
        "Boss: Nerf 80%",
        "Corrupt Dinos: Nerf 50%"
      ]
    },
    "buffNerf": {
      "title": "Buff & Nerf Details",
      "subtitle": "Include Tek & Aberrant & X & R variants",
      "items": [
        "Arthropleura: DMG x3",
        "Andrewsarchus: Resistance 0.8x, 1.5x",
        "Astrocetus: DMG x1.3",
        "Astrodelphis: DMG x0.3",
        "Baryonyx: DMG x0.1",
        "Basiliq: Resistance x1.5",
        "Bloodstalker: DMG x2, Resistance x1.5 - Disable Net",
        "Carbo: Resistance x1.25",
        "Caseoon: Resistance x0.6",
        "Desmo: DMG x0.4, Resistance x0.8",
        "Deino: Resistance x2",
        "Diplo: Resistance x1.6",
        "Equus/Unicorn: Resistance x1.5",
        "Fjoardhawk: Resistance x0.1",
        "Giga: DMG x1.3, Resistance x1.1",
        "Karkinos: Resistance x0.5",
        "Maewing: Resistance x0.4",
        "Mammoth: DMG x0.1",
        "Managarmr: DMG x1.5 - Disable Net",
        "Mantis: Resistance x0.7",
        "Mek: DMG x2.5 - Dmg Structure & Dinos",
        "Megachelon: Resistance x1.5",
        "Paracer: Resistance x2.5",
        "Pteranodon: Resistance x1.4",
        "Quetzal: Resistance x2",
        "Rex: Resistance x1.2",
        "Stego: Resistance x1.2",
        "Spino: DMG x2",
        "Tape: DMG x1.7, Resistance x2 - Can Level Speed and Cap 160%",
        "Theri: DMG x2.2",
        "Woolly Rhino: DMG x2",
        "Velonasaur: DMG x3"
      ]
    },
    "removedDinos": {
      "title": "Removed Dinos",
      "subtitle": "Include Tek & Aberrant & X & R variants",
      "items": [
        "Ammonite", "Araneo", "Archaeopteryx", "Coelacanth", "Dimetrodon",
        "Dimorphodon", "Eurypterid", "Glowbug", "Giant Bee", "Hyaenodon",
        "Queen Bee", "Ichthyornis", "Lamprey", "Leech", "Manta",
        "Mesophage Swarm", "Megapiranha", "Oil Jug", "Onyc", "Pegomastax",
        "Scout", "Seeker", "Subterranean Reaper King", "Troodon", "Vulture"
      ]
    },
    "propagatorSettings": {
      "title": "Propagator Settings",
      "subtitle": "Breeding and mutation system configuration",
      "items": [
        "Propagator Mutation Chance: 7%",
        "Not Respect Global Mutation Multiplier",
        "Propagator Change Gender: Disabled",
        "Propagator Mutator: Disabled"
      ]
    }
  },
  "environment": [
    {
      "title": "PvP Timeline Season 9",
      "subtitle": "September - October 2025 (Thailand Local Time GMT+7)",
      "calendar": true,
      "items": [
        "🟢 PVE DAY - No PvP allowed",
        "🟠 PVP ONLY 18:00-23:59 - Limited PvP hours",
        "🔴 PVP 24HRS - Full PvP all day",
        "🚀 START PVP 24HRS AT 18:00 - PvP begins at 6 PM"
      ]
    },
    {
      "title": "Week 1 (Sep 1-6)",
      "subtitle": "Season Opening Week",
      "items": [
        "Fri 05: 🚀 PVP START 18:00",
        "Sat 06: 🔴 PVP END 06:00"
      ]
    },
    {
      "title": "Week 2 (Sep 7-13)",
      "subtitle": "Regular Schedule Begins",
      "items": [
        "Sun 07: 🟢 PVE DAY",
        "Mon 08: 🟢 PVE DAY",
        "Tue 09: 🟢 PVE DAY",
        "Wed 10: 🟢 PVE DAY",
        "Thu 11: 🟢 PVE DAY",
        "Fri 12: 🟠 PVP ONLY 18:00-23:59",
        "Sat 13: 🟠 PVP ONLY 18:00-23:59"
      ]
    },
    {
      "title": "Week 3 (Sep 14-20)",
      "subtitle": "Mid-Season Schedule",
      "items": [
        "Sun 14: 🟠 PVP ONLY 18:00-23:59",
        "Mon 15: 🟢 PVE DAY",
        "Tue 16: 🟢 PVE DAY",
        "Wed 17: 🟢 PVE DAY",
        "Thu 18: 🟢 PVE DAY",
        "Fri 19: 🟠 PVP ONLY 18:00-23:59",
        "Sat 20: 🟠 PVP ONLY 18:00-23:59"
      ]
    },
    {
      "title": "Week 4 (Sep 21-27)",
      "subtitle": "Pre-Finals Intensive",
      "items": [
        "Sun 21: 🟠 PVP ONLY 18:00-23:59",
        "Mon 22: 🟠 PVP ONLY 18:00-23:59",
        "Tue 23: 🟠 PVP ONLY 18:00-23:59",
        "Wed 24: 🟠 PVP ONLY 18:00-23:59",
        "Thu 25: 🟠 PVP ONLY 18:00-23:59",
        "Fri 26: 🟢 PVE DAY",
        "Sat 27: 🚀 START PVP 24HRS AT 18:00"
      ]
    },
    {
      "title": "Final Week (Sep 28 - Oct 2)",
      "subtitle": "Season 9 Finale - Full PvP",
      "items": [
        "Sun 28: 🔴 PVP 24HRS",
        "Mon 29: 🔴 PVP 24HRS",
        "Tue 30: 🔴 PVP 24HRS",
        "Wed 01 Oct: 🔴 PVP 24HRS",
        "Thu 02 Oct: 🔴 PVP 24HRS"
      ]
    }
  ],
  "commands": [
    {
      "title": "Shop & Economy",
      "subtitle": "In-game shop and data transfer commands",
      "commands": [
        {"cmd": "/shop", "desc": "Open in game shop."},
        {"cmd": "/upload", "desc": "Upload Element(and non Transferable) to ark data"},
        {"cmd": "/download", "desc": "Download Element(and non Transferable) to ark data"}
      ]
    },
    {
      "title": "Character & Limits",
      "subtitle": "Character management and limit checking",
      "commands": [
        {"cmd": "/suicide", "desc": "Kill your self"},
        {"cmd": "/dinolimits", "desc": "Check your dino limits"},
        {"cmd": "/showlimits", "desc": "Check your Global Structure limits"}
      ]
    },
    {
      "title": "Turret Management",
      "subtitle": "Turret control and configuration",
      "commands": [
        {"cmd": "/fill", "desc": "[ use 5 Points ] — fill all turrets in range with ammo from your inventory"},
        {"cmd": "/turrets on", "desc": "Turn on all turrets in range."},
        {"cmd": "/turrets high", "desc": "Make all turrets in range to high settings."}
      ]
    },
    {
      "title": "Utility Commands",
      "subtitle": "Various utility and management commands",
      "commands": [
        {"cmd": "/tlr", "desc": "Link In game Tribe log to discord via Webhook."},
        {"cmd": "/getbody", "desc": "[ use 5 Points ] — get your bags body."},
        {"cmd": "/transfergun", "desc": "Make Fabricated pistol become tranfer tools."},
        {"cmd": "/countStructures", "desc": "Check Snappoint Limit."}
      ]
    },
    {
      "title": "Cryopod Commands",
      "subtitle": "Cryopod and dino management",
      "commands": [
        {"cmd": "/pod", "desc": "Force dino to cryopod(looking)."},
        {"cmd": "/pods", "desc": "Force dino to cryopod(in your area)."}
      ]
    },
    {
      "title": "Token Commands",
      "subtitle": "Commands requiring tokens",
      "commands": [
        {"cmd": "/cg", "desc": "[ use Token ] — Change dino gengder."},
        {"cmd": "/givebirth", "desc": "[ use Token ] — Force dino birth."},
        {"cmd": "/hatch", "desc": "[ use Token ] — Force dino egg to be hatch. (Need Perfect Temp)"},
        {"cmd": "/wake", "desc": "[ use Token ] — Force Knocked dino to be wake. (Remove Torpor)"},
        {"cmd": "/finishclone", "desc": "[ use Token ] — Force Clonning Chamber to finish clone."}
      ]
    },
    {
      "title": "VIP Only Commands",
      "subtitle": "Exclusive commands for VIP members",
      "commands": [
        {"cmd": "/sdc 0 1", "desc": "[ VIP ONLY ] — Change dino color."},
        {"cmd": "/claimbabies", "desc": "[ VIP ONLY ] — Claim baby with 100% imprint and force to cryo in your area."}
      ]
    },
    {
      "title": "Discord Channel Commands",
      "subtitle": "Can use this command in # ⚡ x25-use-cmd ONLY",
      "commands": [
        {"cmd": "/verify", "desc": "link discord acc to ark acc."},
        {"cmd": "/kickme", "desc": "kick your character in game"}
      ],
      "special": true
    }
  ],
  "items": {
    "itemStackSize": {
      "title": "Item Stack & Weight",
      "subtitle": "Stack size and weight modifications",
      "items": ["Stack Items: x10", "Item Weight Reduction: 80%"]
    },
    "weapons": {
      "title": "Weapons",
      "subtitle": "Weapon durability and damage caps",
      "items": [
        "Fabricated Sniper Rifle - Durability: 1000%, Damage: 350%, Auto Silencer, 12 AMMO/MAG",
        "Tek Bow - Durability: 1000%, Damage: 298%, Nerf: 100% → 70%, Tranq: Cannot use with tamed dinos",
        "Tek Pistol - Durability: 1000%, Damage: 159.4%",
        "Tek Sniper Rifle - Durability: 1000%, Damage: 159.4%",
        "Tek Rifle - Durability: 1000%, Damage: 159.4%",
        "Tek Sword - Durability: 1000%, Damage: 180%",
        "Tek Grenade Launcher - Durability: 1000%, Damage: 159.4%",
        "Assault Rifle - Durability: 1000%, Damage: 298%",
        "Bow - Durability: 1000%, Damage: 298%",
        "Compound Bow - Durability: 1000%, Damage: 398%",
        "Flamethrower - Durability: 1000%, Damage: 298%",
        "Harpoon Launcher - Durability: 1000%, Damage: 298%",
        "Longneck Rifle - Durability: 1000%, Damage: 298%",
        "Pump-Action Shotgun - Durability: 1000%, Damage: 298%",
        "Sword - Durability: 1000%, Damage: 298%",
        "Club - Durability: 1000%, Damage: 298%"
      ]
    },
    "armor": {
      "title": "Armor Sets",
      "subtitle": "Armor durability and protection caps",
      "items": [
        "Cloth Armor - Durability: 250%, Armor: 49.6",
        "Hide Armor - Durability: 450%, Armor: 99.2",
        "Chitin Armor - Durability: 500%, Armor: 248",
        "Metal (Flak) Armor - Durability: 1300%, Armor: 500",
        "Fur Armor - Durability: 1200%, Armor: 198.4",
        "Riot Armor - Durability: 1200%, Armor: 570.4",
        "Ghillie Armor - Durability: 450%, Armor: 194.8",
        "Desert Cloth Armor - Durability: 450%, Armor: 194.8",
        "Hazard Suit - Durability: 855%, Armor: 322.4",
        "Tek Armor - Durability: 1500%, Armor: 720",
        "SCUBA Gear - Durability: 450%"
      ]
    },
    "shields": {
      "title": "Shields & Saddles",
      "subtitle": "Shield durability and saddle armor caps",
      "items": [
        "Wooden Shield - Durability: 7000%",
        "Metal Shield - Durability: 12500%",
        "Riot Shield - Durability: 23000%",
        "Tek Shield - Durability: 23000%",
        "Standard Saddles - Armor: 124",
        "Tek Saddles - Armor: 223.2",
        "Platform Saddles - Armor: 60-100 (varies by creature)",
        "Rock Golem Saddle - Armor: 74.5"
      ]
    },
    "customCrafting": {
      "title": "Custom Crafting",
      "subtitle": "Modified crafting recipes",
      "items": [
        "Advance Rifle Bullets = 5x Gunpowder, 1x Metal Ingot",
        "Tranquilizer Arrow = 2x Stone Arrow",
        "Grappling Hook = 30x Fiber, 10x Metal Ingot",
        "Shocking Dart = 3x Bio Toxin, 2x Metal Ingot",
        "RPG Ammo = 20x Cementing Paste, 40x Gunpowder, 10x Metal Ingot, 10x Polymer",
        "Shotgun Ammo = 3x Gunpowder, 1x Metal Ingot",
        "C4 Charge = 5x Electronics, 60x Gunpowder, 5x Polymer",
        "Heavy Auto Turret = 150x Cementing Paste, 200x Electronics, 400x Metal Ingot, 50x Polymer",
        "Cryopod = 10x Metal Ingot"
      ]
    },
    "customRecipes": {
      "title": "Custom Recipes",
      "subtitle": "Modified food and consumable recipes",
      "items": [
        "Lesser Antidote = 10x Rare Flower, 10x Rare Mushroom, 1x Narcotic",
        "Shadow Steak = 10x Cooked Prime Meat",
        "Mindwipe = 20x Rare Flower, 20x Rare Mushroom, 20x Stimulant, 20x Narcotic",
        "Cactus Broth = 10x Amarberry, 5x Cactus Sap",
        "Focal Chili = 3x Citronal, 10x Tintoberry",
        "Lazarus Chowder = 5x Longrass, 10x Mejoberry",
        "Cake = 20x Fiber, 10x Rockarrot",
        "Medical Brew = 20x Tintoberry",
        "Energy Brew = 20x Azulberry"
      ]
    },
    "removedEngrams": {
      "title": "Removed Engrams",
      "subtitle": "MOST OS S+ Engrams & Structure",
      "items": [
        "Lv5: Wooden Sign, Salt, Preserving Salt",
        "Lv7: Single Panel Flag, Tent, Standing Torch",
        "Lv8: Multi-Panel Flag, Compass",
        "Lv9: Boomerang, Training Dummy",
        "Lv10: Glow Stick",
        "Lv11: Stone Pipe All",
        "Lv12: Pressure Plate",
        "Lv13: Vessel",
        "Lv15: Water Well, Flare Gun, All Adobe Structure",
        "Lv16: Gravestone, Delivery Crate",
        "Lv17: Rope Ladder, All Stone pipe, Water Reservoir",
        "Lv20: All Elevator Structure except Elevator Track",
        "Lv21: Wall Torch",
        "Lv22: Tripwire Alarm Trap",
        "Lv25: Artifact Pedestal",
        "Lv28: StoneFireplace, Hanta Saddle",
        "Lv29: Tripwire Narcotic Trap, AmmoBox",
        "Lv31: Zip-Line Anchor",
        "Lv33: Mirror, Lance",
        "Lv34: Climbing pick",
        "Lv38: Re-Fertilizer",
        "Lv45: Pliers",
        "Lv50: Metal Sign, Camera, Industrial Grill",
        "Lv51: Radio",
        "Lv54: ZIP-line Motor attachment",
        "Lv59: Laser Attachment",
        "Lv60: Transponder Tracker, Transponder Node"
      ]
    }
  }
}' AS JSON)
WHERE server_id = 2;