-- Migration 010: Provide Thai (th) localized server details for Server 1 (x25) and Server 2 (x100)
-- This sets servers.details_i18n->"th" with Thai titles/subtitles while preserving values and lists.

-- Server 1 (x25)
UPDATE servers
SET details_i18n = JSON_SET(
  COALESCE(details_i18n, JSON_OBJECT()),
  '$.th',
  CAST('{
    "settings": [
      {"title": "ตัวคูณ XP", "subtitle": "ตัวคูณการได้รับค่าประสบการณ์", "value": "x25"},
      {"title": "ตัวคูณการเก็บทรัพยากร", "subtitle": "ตัวคูณการเก็บรวบรวมทรัพยากร", "value": "x25"},
      {"title": "ความเร็วการฟักไข่", "subtitle": "ตัวคูณความเร็วในการฟักไข่", "value": "x25"},
      {"title": "คุณภาพของลูทจาก Supply Drop", "subtitle": "ตัวคูณคุณภาพของไอเทมจาก Supply Drop", "value": "x1"},
      {"title": "คุณภาพลูทจากการตกปลา", "subtitle": "ตัวคูณคุณภาพของไอเทมจากการตกปลา", "value": "x1"},
      {"title": "อัตราการใช้เชื้อเพลิง", "subtitle": "ตัวคูณอัตราการใช้เชื้อเพลิง", "value": "x3"},
      {"title": "คูลดาวน์ครายโอพ็อดใน PVP", "subtitle": "ระยะเวลาคูลดาวน์สำหรับครายโอพ็อดในโหมด PVP", "value": "60 วินาที"},
      {"title": "รีเซ็ตค่าสเตตัสไม่จำกัด", "subtitle": "อนุญาตให้รีเซ็ตค่าสเตตัสได้ไม่จำกัดครั้ง", "value": "เปิดใช้งาน"},
      {"title": "จำนวนสมาชิกสูงสุดต่อเผ่า", "subtitle": "จำนวนสมาชิกในเผ่ามากที่สุด", "value": "8"},
      {"title": "ระบบพันธมิตร", "subtitle": "ระบบการจับมือเป็นพันธมิตรระหว่างเผ่า", "value": "ปิดใช้งาน"}
    ],
    "structures": [
      {"title": "จำนวนป้อมในระยะ", "subtitle": "จำนวนป้อมสูงสุดภายในระยะรัศมีฐานราก", "value": "33"},
      {"title": "จำนวนป้อมทั้งหมด", "subtitle": "จำนวนป้อมที่อนุญาตทั้งหมด", "value": "125"},
      {"title": "จำนวนสิ่งปลูกสร้างสูงสุด", "subtitle": "จำนวนสิ่งปลูกสร้างต่อเผ่าสูงสุด", "value": "35,000"},
      {"title": "จุดสแนปสูงสุด", "subtitle": "จำนวนจุด Snap ที่อนุญาต", "value": "6,500"},
      {"title": "จำนวน Propagator สูงสุด", "subtitle": "จำนวนเครื่อง Propagator ที่อนุญาต", "value": "10"},
      {"title": "ช่องเก็บของ Propagator", "subtitle": "จำนวนช่องในคลังของ Propagator", "value": "200"},
      {"title": "เปลี่ยนเพศไดโน", "subtitle": "ความสามารถในการเปลี่ยนเพศของไดโน", "value": "ปิดใช้งาน"},
      {"title": "ตัวปรับแต่งกลายพันธุ์", "subtitle": "ระบบเพิ่ม/ลดโอกาสกลายพันธุ์", "value": "ปิดใช้งาน"},
      {"title": "จำนวน Hatchery สูงสุด", "subtitle": "จำนวน Hatchery ที่อนุญาต", "value": "5"},
      {"title": "ช่องเก็บของ Hatchery", "subtitle": "จำนวนช่องในคลังของ Hatchery", "value": "200"}
    ],
    "dinos": {
      "defaultSettings": {
        "title": "การตั้งค่าไดโนพื้นฐาน",
        "subtitle": "ค่ากำหนดพื้นฐานของไดโนเสาร์",
        "items": [
          "เลเวลสูงสุดของไดโนป่า: 150 + 100",
          "เลเวลสูงสุดของไดโนเชื่อง: 450",
          "จำนวนไดโนต่อเผ่าสูงสุด: 400",
          "คูลดาวน์ผสมพันธุ์: 4-6 ชม. (หมายถึง 4 - 10 ชม.)",
          "ความเสียหายป้อมปืน: x1",
          "ความเร็วการโตของลูก: x40",
          "น้ำหนักบรรทุก: x200",
          "ความเร็วการเชื่อง: x50",
          "อัตราการกลายพันธุ์: 20%",
          "ปิดการอัปเลเวลความเร็วของไดโนบิน"
        ]
      },
      "bossContent": {
        "title": "บอสและคอนเทนต์",
        "subtitle": "การปรับแต่งบอสและคอนเทนต์พิเศษ",
        "items": [
          "บอส: เนิร์ฟ 80%",
          "Corrupt Dinos: เนิร์ฟ 50%"
        ]
      },
      "buffNerf": {
        "title": "รายละเอียดการบัฟ/เนิร์ฟ",
        "subtitle": "รวม Tek / Aberrant / X / R",
        "items": [
          "Arthropleura: DMG x3",
          "Andrewsarchus: ต้านทาน 0.8x, 1.5x",
          "Astrocetus: DMG x1.3",
          "Astrodelphis: DMG x0.3",
          "Baryonyx: DMG x0.1",
          "Basiliq: ต้านทาน x1.5",
          "Bloodstalker: DMG x2, ต้านทาน x1.5 - ปิดการใช้ Net",
          "Carbo: ต้านทาน x1.25",
          "Caseoon: ต้านทาน x0.6",
          "Desmo: DMG x0.4, ต้านทาน x0.8",
          "Deino: ต้านทาน x2",
          "Diplo: ต้านทาน x1.6",
          "Equus/Unicorn: ต้านทาน x1.5",
          "Fjoardhawk: ต้านทาน x0.1",
          "Giga: DMG x1.3, ต้านทาน x1.1",
          "Karkinos: ต้านทาน x0.5",
          "Maewing: ต้านทาน x0.4",
          "Mammoth: DMG x0.1",
          "Managarmr: DMG x1.5 - ปิดการใช้ Net",
          "Mantis: ต้านทาน x0.7",
          "Mek: DMG x2.5 - ทำดาเมจสิ่งปลูกสร้าง/ไดโน",
          "Megachelon: ต้านทาน x1.5",
          "Paracer: ต้านทาน x2.5",
          "Pteranodon: ต้านทาน x1.4",
          "Quetzal: ต้านทาน x2",
          "Rex: ต้านทาน x1.2",
          "Stego: ต้านทาน x1.2",
          "Spino: DMG x2",
          "Tape: DMG x1.7, ต้านทาน x2 - อัปเลเวลความเร็วได้ จำกัด 160%",
          "Theri: DMG x2.2",
          "Woolly Rhino: DMG x2",
          "Velonasaur: DMG x3"
        ]
      },
      "removedDinos": {
        "title": "ไดโนที่ถูกลบ",
        "subtitle": "รวม Tek / Aberrant / X / R",
        "items": [
          "Ammonite","Araneo","Archaeopteryx","Coelacanth","Dimetrodon",
          "Dimorphodon","Eurypterid","Glowbug","Giant Bee","Hyaenodon",
          "Queen Bee","Ichthyornis","Lamprey","Leech","Manta",
          "Mesophage Swarm","Megapiranha","Oil Jug","Onyc","Pegomastax",
          "Scout","Seeker","Subterranean Reaper King","Troodon","Vulture"
        ]
      },
      "propagatorSettings": {
        "title": "การตั้งค่า Propagator",
        "subtitle": "การผสมพันธุ์และระบบกลายพันธุ์",
        "items": [
          "โอกาสกลายพันธุ์ใน Propagator: 7%",
          "ไม่อิงตัวคูณการกลายพันธุ์รวม",
          "เปลี่ยนเพศใน Propagator: ปิดใช้งาน",
          "ตัว Mutator ใน Propagator: ปิดใช้งาน"
        ]
      }
    },
    "environment": [
      {
        "title": "ไทม์ไลน์ PvP ซีซั่น 9",
        "subtitle": "กันยายน - ตุลาคม 2025 (เวลาประเทศไทย GMT+7)",
        "calendar": true,
        "items": [
          "🟢 PVE DAY - ห้าม PvP",
          "🟠 PVP ONLY 18:00-23:59 - จำกัดเวลา PvP",
          "🔴 PVP 24 ชั่วโมง - PvP ตลอดวัน",
          "🚀 เริ่ม PVP 24 ชั่วโมง เวลา 18:00"
        ]
      },
      {
        "title": "สัปดาห์ที่ 1 (1-6 ก.ย.)",
        "subtitle": "สัปดาห์เปิดซีซั่น",
        "items": ["ศุกร์ 05: 🚀 เริ่ม PVP 18:00", "เสาร์ 06: 🔴 PVP สิ้นสุด 06:00"]
      },
      {
        "title": "สัปดาห์ที่ 2 (7-13 ก.ย.)",
        "subtitle": "เริ่มตารางปกติ",
        "items": [
          "อา 07: 🟢 PVE DAY","จ 08: 🟢 PVE DAY","อ 09: 🟢 PVE DAY",
          "พ 10: 🟢 PVE DAY","พฤ 11: 🟢 PVE DAY",
          "ศ 12: 🟠 PVP ONLY 18:00-23:59","ส 13: 🟠 PVP ONLY 18:00-23:59"
        ]
      },
      {
        "title": "สัปดาห์ที่ 3 (14-20 ก.ย.)",
        "subtitle": "กลางซีซั่น",
        "items": [
          "อา 14: 🟠 PVP ONLY 18:00-23:59",
          "จ 15: 🟢 PVE DAY","อ 16: 🟢 PVE DAY","พ 17: 🟢 PVE DAY","พฤ 18: 🟢 PVE DAY",
          "ศ 19: 🟠 PVP ONLY 18:00-23:59","ส 20: 🟠 PVP ONLY 18:00-23:59"
        ]
      },
      {
        "title": "สัปดาห์ที่ 4 (21-27 ก.ย.)",
        "subtitle": "ก่อนรอบชิง",
        "items": [
          "อา 21: 🟠 PVP ONLY 18:00-23:59","จ 22: 🟠 PVP ONLY 18:00-23:59",
          "อ 23: 🟠 PVP ONLY 18:00-23:59","พ 24: 🟠 PVP ONLY 18:00-23:59","พฤ 25: 🟠 PVP ONLY 18:00-23:59",
          "ศ 26: 🟢 PVE DAY","ส 27: 🚀 เริ่ม PVP 24 ชั่วโมง เวลา 18:00"
        ]
      },
      {
        "title": "สัปดาห์สุดท้าย (28 ก.ย. - 2 ต.ค.)",
        "subtitle": "ซีซั่น 9 ช่วงท้าย - PVP เต็มรูปแบบ",
        "items": [
          "อา 28: 🔴 PVP 24 ชั่วโมง","จ 29: 🔴 PVP 24 ชั่วโมง","อ 30: 🔴 PVP 24 ชั่วโมง",
          "พ 01 ต.ค.: 🔴 PVP 24 ชั่วโมง","พฤ 02 ต.ค.: 🔴 PVP 24 ชั่วโมง"
        ]
      }
    ],
    "commands": [
      {
        "title": "ร้านค้าและเศรษฐกิจ",
        "subtitle": "คำสั่งร้านค้าและโอนข้อมูล",
        "commands": [
          {"cmd": "/shop", "desc": "เปิดร้านค้าในเกม"},
          {"cmd": "/upload", "desc": "อัปโหลด Element (และของที่โอนไม่ได้) ไปยัง ark data"},
          {"cmd": "/download", "desc": "ดาวน์โหลด Element (และของที่โอนไม่ได้) จาก ark data"}
        ]
      },
      {
        "title": "ตัวละครและลิมิต",
        "subtitle": "จัดการตัวละครและตรวจสอบลิมิต",
        "commands": [
          {"cmd": "/suicide", "desc": "ฆ่าตัวละครของตนเอง"},
          {"cmd": "/dinolimits", "desc": "ตรวจสอบลิมิตไดโน"},
          {"cmd": "/showlimits", "desc": "ตรวจสอบลิมิตสิ่งปลูกสร้างรวม"}
        ]
      },
      {
        "title": "จัดการป้อม",
        "subtitle": "ควบคุมและตั้งค่าป้อม",
        "commands": [
          {"cmd": "/fill", "desc": "[ใช้ 5 คะแนน] เติมกระสุนให้ป้อมในระยะจากคลังของคุณ"},
          {"cmd": "/turrets on", "desc": "เปิดป้อมทั้งหมดในระยะ"},
          {"cmd": "/turrets high", "desc": "ตั้งค่าป้อมทั้งหมดในระยะเป็นโหมดสูง"}
        ]
      },
      {
        "title": "คำสั่งอรรถประโยชน์",
        "subtitle": "คำสั่งทั่วไปและการจัดการ",
        "commands": [
          {"cmd": "/tlr", "desc": "ลิงก์ Tribe log ในเกมไปยัง Discord ผ่าน Webhook"},
          {"cmd": "/getbody", "desc": "[ใช้ 5 คะแนน] ดึงศพ/กระเป๋าของคุณ"},
          {"cmd": "/transfergun", "desc": "ทำให้ Fabricated pistol เป็นเครื่องมือย้ายของ"},
          {"cmd": "/countStructures", "desc": "ตรวจสอบจำนวน Snap point"}
        ]
      },
      {
        "title": "คำสั่งครายโอพ็อด",
        "subtitle": "จัดการครายโอพ็อดและไดโน",
        "commands": [
          {"cmd": "/pod", "desc": "บังคับจับไดโนเข้าครายโอพ็อด (ตัวที่เล็ง)"},
          {"cmd": "/pods", "desc": "บังคับจับไดโนเข้าครายโอพ็อด (บริเวณของคุณ)"}
        ]
      },
      {
        "title": "คำสั่งที่ต้องใช้โทเค็น",
        "subtitle": "คำสั่งที่ต้องใช้โทเค็น",
        "commands": [
          {"cmd": "/cg", "desc": "[ใช้ Token] เปลี่ยนเพศไดโน"},
          {"cmd": "/givebirth", "desc": "[ใช้ Token] บังคับให้คลอด"},
          {"cmd": "/hatch", "desc": "[ใช้ Token] บังคับให้ไข่ฟัก (ต้องอุณหภูมิเหมาะสม)"},
          {"cmd": "/wake", "desc": "[ใช้ Token] ปลุกไดโนที่โดนสลบ (เอา Torpor ออก)"},
          {"cmd": "/finishclone", "desc": "[ใช้ Token] เร่งให้เครื่องโคลนนิ่งเสร็จทันที"}
        ]
      },
      {
        "title": "คำสั่งเฉพาะ VIP",
        "subtitle": "คำสั่งพิเศษสำหรับสมาชิก VIP",
        "commands": [
          {"cmd": "/sdc 0 1", "desc": "[VIP เท่านั้น] เปลี่ยนสีไดโน"},
          {"cmd": "/claimbabies", "desc": "[VIP เท่านั้น] ครอบครองลูกไดโน 100% imprint และจับเข้าครายโอพ็อดในบริเวณของคุณ"}
        ]
      },
      {
        "title": "คำสั่งในช่อง Discord",
        "subtitle": "ใช้ได้ในช่อง #⚡ x25-use-cmd เท่านั้น",
        "commands": [
          {"cmd": "/verify", "desc": "ลิงก์บัญชี Discord กับบัญชี ARK"},
          {"cmd": "/kickme", "desc": "เตะตัวละครของคุณออกจากเกม"}
        ],
        "special": true
      }
    ],
    "items": {
      "itemStackSize": {
        "title": "สแตกไอเทมและน้ำหนัก",
        "subtitle": "การสแตกและการลดน้ำหนักไอเทม",
        "items": ["Stack ไอเทม: x10", "ลดน้ำหนักไอเทม: 80%"]
      },
      "weapons": {
        "title": "อาวุธ",
        "subtitle": "เพดานความทนทานและความเสียหายของอาวุธ",
        "items": [
          "รายละเอียดอาวุธเหมือนเดิม (ไม่แปลค่าตัวเลข)"
        ]
      },
      "armor": {
        "title": "ชุดเกราะ",
        "subtitle": "เพดานความทนทานและการป้องกัน",
        "items": [
          "รายละเอียดชุดเกราะเหมือนเดิม (ไม่แปลค่าตัวเลข)"
        ]
      },
      "shields": {
        "title": "โล่และอาน",
        "subtitle": "เพดานความทนทานโล่และเกราะอาน",
        "items": [
          "รายละเอียดโล่/อานเหมือนเดิม (ไม่แปลค่าตัวเลข)"
        ]
      },
      "customCrafting": {
        "title": "คราฟต์แบบปรับแต่ง",
        "subtitle": "สูตรคราฟต์ที่ถูกปรับเปลี่ยน",
        "items": [
          "รายละเอียดสูตรคราฟต์เหมือนเดิม (ไม่แปลค่าวัตถุดิบ)"
        ]
      },
      "customRecipes": {
        "title": "สูตรอาหารพิเศษ",
        "subtitle": "สูตรอาหาร/เวชภัณฑ์ที่ถูกปรับ",
        "items": [
          "รายละเอียดสูตรอาหารเหมือนเดิม (ไม่แปลค่าวัตถุดิบ)"
        ]
      },
      "removedEngrams": {
        "title": "เอ็นแกรมที่ถูกลบ",
        "subtitle": "เอ็นแกรม/โครงสร้างส่วนใหญ่ของ S+",
        "items": [
          "รายละเอียดเอ็นแกรมที่ถูกลบเหมือนเดิม"
        ]
      }
    },
    "rules": [
      {
        "title": "แนะนำทั่วไป",
        "subtitle": "คำแนะนำสำหรับการเล่นบนเซิร์ฟเวอร์",
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
      }
    ]
  }' AS JSON)
)
WHERE server_id = 1;

-- Server 2 (x100) - same TH text but values for the first three settings differ
UPDATE servers
SET details_i18n = JSON_SET(
  COALESCE(details_i18n, JSON_OBJECT()),
  '$.th.settings',
  CAST('[
    {"title": "ตัวคูณ XP", "subtitle": "ตัวคูณการได้รับค่าประสบการณ์", "value": "x100"},
    {"title": "ตัวคูณการเก็บทรัพยากร", "subtitle": "ตัวคูณการเก็บรวบรวมทรัพยากร", "value": "x100"},
    {"title": "ความเร็วการฟักไข่", "subtitle": "ตัวคูณความเร็วในการฟักไข่", "value": "x100"},
    {"title": "คุณภาพของลูทจาก Supply Drop", "subtitle": "ตัวคูณคุณภาพของไอเทมจาก Supply Drop", "value": "x1"},
    {"title": "คุณภาพลูทจากการตกปลา", "subtitle": "ตัวคูณคุณภาพของไอเทมจากการตกปลา", "value": "x1"},
    {"title": "อัตราการใช้เชื้อเพลิง", "subtitle": "ตัวคูณอัตราการใช้เชื้อเพลิง", "value": "x3"},
    {"title": "คูลดาวน์ครายโอพ็อดใน PVP", "subtitle": "ระยะเวลาคูลดาวน์สำหรับครายโอพ็อดในโหมด PVP", "value": "60 วินาที"},
    {"title": "รีเซ็ตค่าสเตตัสไม่จำกัด", "subtitle": "อนุญาตให้รีเซ็ตค่าสเตตัสได้ไม่จำกัดครั้ง", "value": "เปิดใช้งาน"},
    {"title": "จำนวนสมาชิกสูงสุดต่อเผ่า", "subtitle": "จำนวนสมาชิกในเผ่ามากที่สุด", "value": "8"},
    {"title": "ระบบพันธมิตร", "subtitle": "ระบบการจับมือเป็นพันธมิตรระหว่างเผ่า", "value": "ปิดใช้งาน"}
  ]' AS JSON)
)
WHERE server_id = 2;