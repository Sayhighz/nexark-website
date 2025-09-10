import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServers } from '../hooks/useServers';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import StarBackground from '../components/site/StarBackground';
import Navbar from '../components/site/Navbar';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Table,
  List,
  Badge,
  Divider,
  Statistic,
  Tag,
  Space,
  Alert,
  BackTop,
  Affix,
  Button,
  Spin
} from 'antd';
import {
  SettingOutlined,
  TeamOutlined,
  BookOutlined,
  GlobalOutlined,
  GiftOutlined,
  BugOutlined,
  WarningOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  CodeOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const ServerDetails = () => {
  const { serverId } = useParams();
  const { getServerByID, getServerDisplayInfo, loading, error } = useServers();
  const [server, setServer] = useState(null);
  const [displayInfos, setDisplayInfos] = useState({});
  const [activeTab, setActiveTab] = useState('settings');
  const [sectionLoading, setSectionLoading] = useState(false);

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      key: 'structures',
      icon: <DatabaseOutlined />,
      label: 'Structures'
    },
    {
      key: 'dinos',
      icon: <BugOutlined />,
      label: 'Dinos'
    },
    {
      key: 'items',
      icon: <GiftOutlined />,
      label: 'Items'
    },
    {
      key: 'environment',
      icon: <EnvironmentOutlined />,
      label: 'Environment'
    },
    {
      key: 'commands',
      icon: <CodeOutlined />,
      label: 'Commands'
    },
    {
      key: 'donation',
      icon: <HeartOutlined />,
      label: 'Donation Commands'
    }
  ];

  // Mock data for server settings matching the HTML structure
  const mockServerConfig = [
    {
      title: "Harvest Amount",
      subtitle: "Harvest Amount Multiplier",
      value: "100x"
    },
    {
      title: "XP Multiplier",
      subtitle: "XP Amount Multiplier",
      value: "100x"
    },
    {
      title: "Taming Speed",
      subtitle: "Taming Speed Multiplier",
      value: "100x"
    },
    {
      title: "Max Tribe Members",
      subtitle: "Max Amount of Tribe Members in one Tribe",
      value: "6 Man"
    },
    {
      title: "No Alliances",
      subtitle: "You are not able to make any Alliance",
      value: ""
    },
    {
      title: "Auto Unlock Engrams",
      subtitle: "Auto Unlock Engrams",
      value: "True",
      extra: "Excluding Tekgramms for the first 3 days"
    },
    {
      title: "Character Skill",
      subtitle: "",
      value: "",
      items: ["800 max HP", "0.75x Melee DMG"]
    },
    {
      title: "Crafting speed",
      subtitle: "Crafting Speed inside of Structures (like Replicator, Smithy, etc..)",
      value: "300%",
      items: ["Chemistry Bench: 400%", "Beer Barrel: 500%"]
    },
    {
      title: "Forges speed",
      subtitle: "Smelting Speed Multiplier inside of all Forges",
      value: "x3"
    },
    {
      title: "ORP Settings",
      subtitle: "Settings for the Offline Raid Protection (ORP)",
      value: "",
      items: ["Active after Logout: 45min", "Active after PvP Logout: 3h", "1.75 Turret Damage", "30% less ORP damage"]
    },
    {
      title: "Tribeslot Cooldown",
      subtitle: "Cooldown has been removed",
      value: "0 hours"
    },
    {
      title: "Character Despawn",
      subtitle: "Character stored in upload",
      value: "after 76h"
    }
  ];

  // Mock data for structures section
  const mockStructuresConfig = [
    {
      title: "Turret limit",
      subtitle: "Max amount of Turrets in a specific range",
      value: "150"
    },
    {
      title: "Turret Damage",
      subtitle: "Turret Damage Multiplier",
      value: "1.5"
    },
    {
      title: "Always Structure Pickup",
      subtitle: "Are you able to always pickup Structures",
      value: "True"
    },
    {
      title: "Structure Collision",
      subtitle: "Are your Strcutures getting blocked by Walls etc.",
      value: "False | Unoffi"
    },
    {
      title: "Structure HP",
      subtitle: "Structures that have changed Hp and the new Amount of HP",
      items: [
        "Tek Turret 7.5K HP",
        "Vacuums: 20K HP",
        "Cliff Plat: 40K HP",
        "Tree Plat: 30k HP",
        "Ocean Plat: 42k HP"
      ]
    },
    {
      title: "Structure Limit",
      subtitle: "",
      items: [
        "7K Local Limit",
        "200K Global Limit",
        "1K max amount of snapped structures",
        "1K Cliff Plat",
        "150 Tree Plat",
        "500 Spike",
        "10 Cage",
        "30 Campfire",
        "10 Cooking Pot",
        "30 Chem Bench",
        "30 Fabricator",
        "100 Behemoth Gate",
        "5 000 Vacuum Compartment"
      ]
    },
    {
      title: "Chem Bench / Fabricator limit",
      subtitle: "Max amount of Chem Bench and Fabricator",
      value: "30"
    }
  ];

  // Mock data for updated dinos section
  const mockDinosConfig = [
    {
      title: "Tame limit",
      subtitle: "Max Amount of Dinos you can have on one Map",
      value: "600"
    },
    {
      title: "Wild Dino Max Level",
      subtitle: "Max Level a Wild Dino can spawn with",
      value: "150\nTek 180"
    },
    {
      title: "Egg Hatch Speed",
      subtitle: "Egg Hatch Speed Multiplier",
      value: "35x"
    },
    {
      title: "Baby Grow Speed",
      subtitle: "Baby Grow Speed Multiplier",
      value: "40x"
    },
    {
      title: "Enabled after 1h",
      subtitle: "Can not be tamed",
      value: "- Crystal Wyvern"
    },
    {
      title: "Enabled after 12h",
      subtitle: "Can not be tamed",
      value: "- Managarmr"
    },
    {
      title: "Enabled after 24h",
      subtitle: "Can not be tamed before",
      value: "- Desmodus"
    },
    {
      title: "Enabled after 48h",
      subtitle: "Can not be tamed",
      value: "- Shadowmane\n- Voidvyrm\n- Fenrir\n- Andrewsarchus"
    },
    {
      title: "Breeding cooldown",
      subtitle: "Reduction of dino breeding cooldown",
      items: ["40% Breeding cooldown"]
    },
    {
      title: "Disabled Dinos",
      subtitle: "Dinos that are Permanently disabled",
      items: [
        "Armagasaurus", "Fjordhawk", "Ovis", "Iguanodon", "Oviraptor",
        "Rhyniognatha", "Ravager", "Megalania", "Enforcer", "Araneo", "Scout Drone"
      ]
    },
    {
      title: "Dino Buffs",
      subtitle: "List of dinos with a buffed stats",
      items: [
        "Arthropleura 300% DMG", "Carbonenmys 200% HP", "Daeodon 200% Food",
        "Fire Wyvern 200% DMG", "Gasbag 500% HP", "Giganotosaurus 180% DMG",
        "Megachelon 200% HP", "Paracer 300% HP", "Plesio 200% DMG & 240% HP",
        "Mosasaurus 130% HP", "Equus 130% DMG", "Rhino 500% DMG",
        "Spino 200% DMG", "Tapejara 300% HP", "Titan 250% DMG & 450% HP",
        "Terrorbird 350% DMG & HP", "Tropeognathus 150% DMG & HP",
        "Velosaurus 250% DMG", "Daeodon Infinite Food", "Brontosaurus 750% HP",
        "Managarmr 250% DMG & 150% HP", "Mek 160% DMG", "Raptor 400% DMG & HP",
        "Carcha 110% DMG", "Diplodocus 290% HP", "Poison Wyvern 115% DMG"
      ]
    },
    {
      title: "Dino Nerfs",
      subtitle: "List of dinos with a nerfed stats",
      items: [
        "Shadowmane 50% DMG", "Desmodus 50% DMG and HP", "Voidvyrm 75% HP and 50% DMG",
        "Astrodelphis 20% HP and 15% DMG", "Andrewsarchus 50% HP", "Griffin to 60% HP",
        "Astrocetus 90% HP"
      ]
    },
    {
      title: "Flyers Aberration",
      subtitle: "Flying is not possible",
      value: "Flyers are disabled on Aberration"
    },
    {
      title: "Flyers Valguero",
      subtitle: "Flying is possible",
      value: "Cave Flyers are enabled on Valguero"
    }
  ];

  // Mock data for environment section
  const mockEnvironmentConfig = [
    {
      title: "Night duration",
      subtitle: "One night lasts for:",
      value: "15min"
    },
    {
      title: "Day duration",
      subtitle: "One day lasts for:",
      value: "45min"
    },
    {
      title: "Auto Restart",
      subtitle: "Times when the server automatically restarts",
      value: "5am and 3pm [CET realtime]"
    },
    {
      title: "Genesis Missions Points",
      subtitle: "Multiplier of Genesis mission point rewards",
      value: "20x"
    },
    {
      title: "Crop Growth Speed",
      subtitle: "Crop Growth Speed Multiplier",
      value: "50x"
    },
    {
      title: "Infinite Water",
      subtitle: "On the whole map",
      value: "You have water in the ground everywhere"
    },
    {
      title: "Tek Powers",
      subtitle: "allows the usage of Tek Armor (as vanilla except for:)",
      value: "Teksuit enabled on Genesis Part 1"
    },
    {
      title: "Structure repair cooldown",
      subtitle: "",
      value: "120 seconds"
    },
    {
      title: "Oxygen swim speed",
      subtitle: "",
      value: "15x"
    },
    {
      title: "C4 Damage",
      subtitle: "",
      value: "1.25x"
    }
  ];

  // Mock data for commands section
  const mockCommandsConfig = [
    {
      title: "Element Travel",
      subtitle: "Near a upload Terminal like a Transmitter you can use /upload or /download to transfer (Hard Element, Attributes and Artifacts ...)",
      value: "/upload [number]\n/download [same number as upload]"
    },
    {
      title: "Engram Unlocker",
      subtitle: "Unlocks all Engrams [except Tekengrams in the first Week]",
      value: "/engrams"
    },
    {
      title: "Distribute",
      subtitle: "Distribute metal, wood and all other resources",
      value: "/dist 'forge' 'metal'\n/dist 'forge' 'wood'",
      extra: "Make sure to write it correctly (ARK Item ID Name)"
    },
    {
      title: "Pull",
      subtitle: "Pull items into a structure/inventory",
      value: "/pull structure 'resource name' amountToPull\n/pull inv 'resource name' amountToPull",
      extra: "Make sure to write it correctly (ARK Item ID Name)"
    },
    {
      title: "Auto Repair",
      subtitle: "Automatically get your items repaired",
      value: "Add the item to the \"Repair\" folder and make sure you have all the items for it. Every few seconds the items will be repaired."
    },
    {
      title: "Fill",
      subtitle: "Fills your Turrets with ammunition out of your Inventory",
      value: "/Fill\nFills your Turrets with ammo"
    },
    {
      title: "Discord Link",
      subtitle: "Links your Tribelog to a Discord Channel of your choice",
      value: "/linklog <Discord WebHook>"
    },
    {
      title: "Lootboxes",
      subtitle: "A Lootbox system with 2 Commands, with one to see how many you have and another to open one",
      value: "/lootboxes\nShows you the Amount of Lootboxes you have\n\n/loot name\nOpens a lootbox, replace name with the Lootbox name: Box, Star, Galaxy, Event, EventLarge"
    },
    {
      title: "DinoStats",
      subtitle: "Shows you the stats of your Dinos",
      value: "/dinostats\nDisplays you the Stats of the Dino you are looking at in the Chat"
    },
    {
      title: "Limits",
      subtitle: "Shows you your Limits. Use /ShowLimits to see your Structure Limit or /Dinolimit to see your Dino Limit",
      value: "/Showlimit\nShows the structure Limit\n\n/Dinolimit"
    },
    {
      title: "Connected Structures",
      subtitle: "How many structures are connected to the one I am looking at?",
      value: "/countStructures\nLook at a structure"
    },
    {
      title: "Show Structures in Mesh",
      subtitle: "Maximum 10 structures",
      value: "/CheckStructures"
    },
    {
      title: "ORP",
      subtitle: "The ORP is active after 20 Minutes when you are in PvP it takes 45 Minutes (ORP means Offliine Raid Protection)",
      value: "/setorp\nSet the ORP Location\n\n/removeorp\nRemoves the ORP"
    },
    {
      title: "Suicide",
      subtitle: "Can help you in some Situations, like when you are Stuck then you can use /suicide to kill yourself and respawn somewhere else",
      value: "/suicide"
    },
    {
      title: "Astro Antimesh",
      subtitle: "Helps improving your Safety through detecting People trying to mesh faster better",
      value: "So that no one can mesh your base"
    },
    {
      title: "Turret configurator",
      subtitle: "Changes your turret settings, use /turrets to see all available Commands",
      value: "/turret"
    },
    {
      title: "PvPcooldown",
      subtitle: "PvP cooldown restrains some Actions like the /fiill or /upload commands",
      value: ""
    },
    {
      title: "Point Limiter",
      subtitle: "Limits the stats",
      value: "Playerlive limit 800HP\nPlayer movement limit 170%"
    },
    {
      title: "Item Collector",
      subtitle: "collect various items into different structures",
      value: "/collecteggsfert\ncollect fertilized eggs (in front of a Refrigerator / Tek Trough)\n\n/collecteggs\ncollect dropped eggs (in front of a Refrigerator / Tek Trough)\n\n/collectcrystals\ncollect Gacha crystals (in front of a Vault)\n\n/collectpoop\ncollect poop (in front of a Vault)"
    },
    {
      title: "Dino / structure limit",
      subtitle: "helps you count your structures and dinos",
      value: "/structurelimits\nDisplays the structures limit\n\n/dinolimits\nDisplays the dino limit"
    },
    {
      title: "Baby dino settings",
      subtitle: "changes dino settings",
      value: "- Auto 100% imprint\n- Auto No Ally Look\n- Auto Passive\n- Auto Unfollow\n- Auto Stats Point Name"
    },
    {
      title: "Private DMG Numbers",
      subtitle: "displays the amount of damage you deal",
      value: ""
    },
    {
      title: "Spyglass with points",
      subtitle: "displays the stats of dinos",
      value: ""
    },
    {
      title: "Global Tribe Manager",
      subtitle: "Your tribe and it's logs will be synchronized across all maps.",
      value: ""
    },
    {
      title: "Tribe Damage",
      subtitle: "A leaderboard with the tribes that have destroyed the most structures in raids.",
      value: ""
    },
    {
      title: "Geforce Now / VPN not supported",
      subtitle: "you are going to get banned as soon as you try to join via Geforce Now / VPN",
      value: ""
    },
    {
      title: "Cryo Command",
      subtitle: "Cryo the tame your looking at or tames near you with a simple command",
      value: "/cryo\ncryos the Tame your currently looking at\n\n/cryoall\ncryos Tames around you in a small range\n\n/cryoall Giga\ncryos all gigas\n\n/cryoall Navo\ncryos all tames named Navo\n\nYou need Cryos in your inventory."
    }
  ];

  // Mock data for donation commands
  const mockDonationCommandsConfig = [
    {
      title: "Kit",
      subtitle: "Gives you a Kit",
      value: "/kit\nList of all available kits\n\n/kit \"kitname\"\nReplace \"kitname\" with the name from /kit"
    },
    {
      title: "InGame Shop",
      subtitle: "Buy Kits or Lootboxes",
      value: "/shop shows you all kits ingame and the ID\n/buy ID replace ID with the name of the kit\nExample: /buy pvp or /buy lootbox"
    },
    {
      title: "Lootboxes",
      subtitle: "Open and buy Lootboxes",
      value: "/loot Box / Star / Galaxy\nTo open a Lootbox\n\n/buy lootbox 1\n/buy starbox 1\n/buy galaxybox 1\nBuy a box for points. With /points you can see how many points you have\n\n/lootboxes\nCheck how many boxes you have"
    },
    {
      title: "Tek-Engrams",
      subtitle: "Only gives you Tek-Engrams",
      value: "/engrams tek [Basic Tek-Engrams]\n\n/engrams alltek [All Tek-Engrams]"
    },
    {
      title: "Dino Color",
      subtitle: "Changes the Color of your Dino Permanently",
      value: "/sdc <Region> <Colour>\n/cdc <DinoName> <Region> <Colour>\n\n[Region Name List: Body = 0, Face = 1, Side = 2, Legs = 3, Top = 4, Under = 5]"
    }
  ];

  // Mock data สำหรับ player settings
  const mockPlayerConfig = {
    "max_player_level": "105 + Ascension",
    "health_multiplier": "x1",
    "health_cap": "1000",
    "stamina_multiplier": "x1",
    "oxygen_multiplier": "x1",
    "food_multiplier": "x1",
    "weight_multiplier": "x5000",
    "damage_multiplier": "x1",
    "speed_multiplier": "x2",
    "fortitude_multiplier": "x2",
    "crafting_multiplier": "x1",
    "speed_limit": "180",
    "health_limit": "1000",
    "crafting_skill_limit": "3600",
    "fortitude_limit": "200"
  };

  // Mock data สำหรับ dino settings
  const mockDinoConfig = {
    "max_level_wild_dino": "150 + 100",
    "max_level_tamed_dino": "450",
    "dino_limit_per_tribe": "400",
    "breed_cooldown": "4-6 hr (meaning 4 - 10 hr)",
    "turret_damage": "x1",
    "baby_mature_speed": "x40",
    "weight": "x200",
    "taming_speed": "x50",
    "mutation_rate_multiplier": "20%",
    "disable_level_speed_for_flyer": "True"
  };

  const mockBossContent = {
    "boss_nerf": "80%",
    "corrupt_dinos_nerf": "50%"
  };

  const mockDinoBuffNerf = [
    { name: "Arthropleura", damage: "+dmg 3", resistance: "", extra: "" },
    { name: "Andrewsarchus", damage: "", resistance: "+res 0.8", extra: "" },
    { name: "Astrocetus", damage: "+dmg 1.3", resistance: "+res 1.5", extra: "" },
    { name: "Astrodelphis", damage: "+dmg 0.3", resistance: "", extra: "" },
    { name: "Baryonyx", damage: "+dmg 0.1", resistance: "", extra: "" },
    { name: "Basilo", damage: "", resistance: "+res 1.5", extra: "" },
    { name: "Bloodstalker", damage: "+dmg 2", resistance: "+res 1.5", extra: "Disable Net" },
    { name: "Carcha", damage: "", resistance: "+res 1.25", extra: "" },
    { name: "Daeodon", damage: "", resistance: "+res 0.6", extra: "" },
    { name: "Desmo", damage: "+dmg 0.4", resistance: "+res 0.8", extra: "" },
    { name: "Deino", damage: "", resistance: "+res 2", extra: "" },
    { name: "Diplo", damage: "", resistance: "+res 1.6", extra: "" },
    { name: "Equus/Unicorn", damage: "", resistance: "+res 1.5", extra: "" },
    { name: "Fjordhawk", damage: "", resistance: "+res 0.1", extra: "" },
    { name: "Giga", damage: "+dmg 1.3", resistance: "+res 1.1", extra: "" },
    { name: "Karkinos", damage: "", resistance: "+res 0.5", extra: "" },
    { name: "Maewing", damage: "", resistance: "+res 0.4", extra: "" },
    { name: "Mammoth", damage: "+dmg 0.1", resistance: "", extra: "" },
    { name: "Managarmr", damage: "+dmg 1.5", resistance: "", extra: "Disable Net" },
    { name: "Mantis", damage: "", resistance: "+res 0.7", extra: "" },
    { name: "Mek", damage: "+dmg 2.5", resistance: "", extra: "xDmg Structure & Dinos" },
    { name: "Megachelon", damage: "", resistance: "+res 1.5", extra: "" },
    { name: "Paracer", damage: "", resistance: "+res 2.5", extra: "" },
    { name: "Pteranodon", damage: "", resistance: "+res 1.4", extra: "" },
    { name: "Quetzal", damage: "", resistance: "+res 2", extra: "" },
    { name: "Rex", damage: "", resistance: "+res 1.2", extra: "" },
    { name: "Stego", damage: "", resistance: "+res 1.2", extra: "" },
    { name: "Spino", damage: "+dmg 2", resistance: "", extra: "" },
    { name: "Tape", damage: "+dmg 1.7", resistance: "+res 2", extra: "Can Level Speed and Cap 160%" },
    { name: "Theri", damage: "+dmg 2.2", resistance: "", extra: "" },
    { name: "Woolly Rhino", damage: "+dmg 2", resistance: "", extra: "" },
    { name: "Velonasaur", damage: "+dmg 3", resistance: "", extra: "" }
  ];

  const mockDinoRemoved = [
    "Ammonite", "Araneo", "Archaeopteryx", "Coelacanth", "Dimetrodon",
    "Dimorphodon", "Eurypterid", "Glowbug", "Giant Bee", "Hyaenodon",
    "Queen Bee", "Ichthyornis", "Lamprey", "Leech", "Manta",
    "MicroraptorSwarm", "Megapiranha", "Oil bug", "Onyc", "Pegomastax",
    "Scout", "Seeker", "Subterranean Reaper King", "Troodon", "Vulture"
  ];

  // Mock data สำหรับ loot/items settings
  const mockLootConfig = {
    itemStackSize: {
      title: "Item Stack Size",
      subtitle: "Item Stack size changes",
      description: "Basic Resources stack to 2.5k",
      items: [
        "Adv = 100",
        "Mutagel = 100",
        "Mutagen = 100",
        "Element = 1000",
        "Shards = 500",
        "Beer = 10",
        "Tartar = 10",
        "Medbrews = 100"
      ]
    },
    lootQuality: {
      title: "Loot Quality",
      subtitle: "Supply Crate Loot Quality",
      description: "Supply Drops are modified. You can find a full overview below:",
      link: "More Info →"
    },
    removedItems: {
      title: "Removed Items",
      subtitle: "Items you are not able to craft or use",
      items: [
        "Enforcer farming disabled",
        "Sleeping Bags",
        "Raft",
        "Chair",
        "Zip-Line",
        "Spray Painter"
      ]
    },
    modifiedItems: {
      title: "Modified Items",
      subtitle: "These items have been buffed / nerfed for balance.",
      items: [
        "Flamethrower: 70% DMG",
        "Tek Bow: 50% DMG",
        "Tek Hoversail: 1K HP",
        "5k HP but resistance nerfed"
      ]
    },
    customizedRecipes: {
      title: "Customized Recipes",
      items: [
        { name: "Enforcer", detail: "3000 Element extra" },
        { name: "Heavy Turret:", detail: "no Autoturret" },
        { name: "Awesome Spyglass:", detail: "1x Fiber" }
      ]
    }
  };

  // Mock data สำหรับ rules
  const mockRulesConfig = {
    generalRules: {
      title: "Generals Rules",
      subtitle: "หากต้องการจะแจ้งละไว้ ต้องมีหลักฐานชัดเจนพร้อมาก และจะไม่ความส่าคลุมาคลางนิมหลือ คลิปวีดีไอ → รูปภาพ → พิมพ์เล่าไว้ ไม่รับไว้ไปริมหหมือปูก ทำห่โทษทคนตื่",
      rules: [
        "ห้ามใช้โปรแกรมที่ช่วยเพิ่มพลังของทุกทรหร่วมและะไปยูคอนท่วยเจียแห่ยนกกดิ โดยเฉพาะทีจดื่องพลพักด่อการ PvP (Dupe, Cheats, HitBox Damage) หากเนิม่ทดล่องร้ายร่างหาไล่งหลอาการ PvP, มากจะทาโดส เน้น ราง่โส กลาง Giant hatframe ยีอ ปิดมึการ Vacuum และีนียวสอการขเมแหระบ่า",
        "ห้ามกลส่อรดืการหามเห่กพลงา PvE รายไดจานสส่เห่ห่ออ Rock Drake, Wyvern กรดี่โบลา โฝ้กีก",
        "ห้ามโดบใสไก้รเศสโดดาที่นตามอียะ PVE รามหังการมี่หัวปหมุบไม่ายวาตุแอ่ะไสลองโลโดาม",
        "3.1 - ห้ามเซ่าหากหตัามร่อผมีโามส่เหาอียหลมอเจา PVP เพื่อการ RAID ซีลิตส่าส้อโมะนาหห่อนืิน",
        "3.2 - ห้ามกการยส่ลอค่หเซล Boss Lava Golem ขณะ PVE ใช้กาเดียิรันโคาะม เข่าระไปรา ส้องียไรากาทอาก ระเส่ Golem ชะโต (ใจ/เจฟนัท) organisational หยหดโตง Sub(การJA) เสก เส เยีสเก่อง Boss อมียหาน",
        "3.3 ห้ามหาการการแยเสสแห่ม Element Node , Orbital Supply Drop ใน Extinction ขณะ PVE โดีตลบ ขะโส่มิสใดการณใหมารเหาส Drop นีน",
        "3.4 ผู้ส่แห่ือง PVE สานสร่โสบญปอม่มฟังเจโประะโรส่อีย",
        "หากผู่เสึอมีการ Toxic ไก้โหส้วีส หาโกส่งีมยีะน หรือาหาโหดเนียราม หากมัจีบุาหดง ตารเอิหะโมบิมึาแนระาโนส่อูซ กรษีย",
        "หีบูราง C4 ในโพรานาหีบนากแบโห้อปอสายการ RAID มาน",
        "กษมีนิสตามสุดบทราอรหรืะะไจโสามแส่กโคราคื่มบนหรือผู่เสาชง (หากเมู่สีธแนหลกกิหาโชงพสโส้อแีสามโส่เทืองาโห ใซยกรคดมี)",
        "หากผู่เสึอบโหพาหีคลูนใยาร่ะะอูไทม่าใสหีคสาอะะาอรง่อายเสือสเสและะหาร่นง่ะะดิงรเบดิตตอบวามเหิงหางหม่อ"
      ]
    },
    buildingRules: {
      title: "Building Rules",
      rules: [
        "สำหรับที่สร้างมาโห้สร้างนิยจคโรบสมากรายเดิมหย่า,ยื่อ,รีหาไดยำคีหรศีห ห้ามโยื่ย้อรหร่อแอโหาหรือะอมหรืองของคำ เคยโขมารชา์เจอการยคาง่โรเสโกขาโขเกฟหยหี่อ",
        "ห้ามาสรึการเสนฟหารื่อโลหนั้มการบสา รามไดในการสูยราง สึ่งเสอคสร่างเดาขาจาเขณํเนิากห หรือ ราง่ส้อ ของสร่างกราความหรืดกผู่เสีบเบื่น (ระบบไขส่นไม่ใจากรืงการม่งการก่อส่งการณห่านธารเบส Wipe)",
        "2.1 - การาประบับบนารส่บีกเหยหส่เสารคกไส และัสูจะญละะจาการโข่าโสหากมีเนมโหาโขงส่บีหการโกเลียเช้เอคาร เคหอคเปดแสโรการหส่เรางโสอแครบราสี่อาน เอเคโยื่ารไส่",
        "2.2 - ห้ามเสนบแส่งอาร่างการะะเสา้อยองค่ล่องสร่างรน่าเอาบเาขเอเห่านะเจา PVP"
      ]
    },
    raidPvpRules: {
      title: "Raid & PVP Rules",
      subtitle: "ไม่มีดิง 1v1 สามารถ 3rd party ได้จีนด",
      rules: [
        "หสังคนา PVP มคระอการจักเพื่อมึาใน 20 นาทีและะด้องกีมำีรปอสร่างโห้งหมดมจักจากขด PVP ภายใน 24 ขั่ม ห้ามเขฟาโในดีนเด ้าการหบข้อ FOB หดพดีชมัาการใครียวขดรื่อไครีบได้อบยกรษีย โดดเฉพาะะภาหกีเส่หกา",
        "1.2 - ไม่สามารถ Donate ขข PVE โดดกีหแหมายี้กีโใโสใสบดง FOB ต่างโด้สามารถ Donate ขข PVE ได เน้น ราำ่ไก้กีด",
        "1.3 - ห้ามลาห์ขยบชาสยบเดาก PVP ห้ามคึงออบเชาง่ำโยงสึง",
        "1.4 - ห้ามอ่อเส่น FOB หด้งจาเงจา PVP โกาห้าไดเสโดยโก้ดืน ภายใต้โดยแบโดื้อ และหากมีเมาร์ไส่สามารถนาา ป่าอพมระก่ม FOB ใจห์หดบ ก้อาค่อ บีนิษบฟีเหร์ออน จะหาโบบไส่ดื่อราง PvP โบมเหาพ่นิ และะกรบหาทขสุร/สส่เล็ติ้อ หดกิกเดือนอธุมแีอเหื่นาส",
        "1.5 - สำหรับภาหกีโรึด ห้าม อมเส่มทำีมร์าโฮเด่อโอยดื่อการเดมเห้น เช่น โรยฟึ Dead Wall กีห้ายดี้อมหร่ออมเส่ม โอยโก้ดืน โมดัดจาก Dead wall ประมาถ 5-10 foundation จะหาอะไรห์ร้องพองถูด ดำืนริหาและะทรีดังกีกาย ห้ายบซะทาอังหหอาได ญานากาห หากโอเใดแทค่นารามาโดื้นืิองหมดแกีเนื้อรันั ห้ามหองทำม การภาโสโฝื เนียดื่อมื่กีให่าองขดร้่เไฝิ่ดส่ส เสีเก่าได **",
        "2. ห้ามดารา RAID หร่อตสอ่ FOB ห้าราการก โดยโก้ดืน PVE โกาห้าการโดยโก้ดืน",
        "3. หากการอิ่อง FOB หฟ่ามำาหดรึหดคื่อในการยสํ คิดการณาม PVP (รามดึบด้อ FOB ขณะมิม PVE ตำาว)",
        "4. เมื่อจากกีการจำากยำการเด่มหงท์ดีด (เช่น Daeodon) ติมส่มาภูษื้อ/จีป/โอใบโบดด โอเมื่อจวจา่มเดาะไบะทำาง สำงเดา PvP และะด้องเนื่อมีดนีมเส่าโยเงภด PVP. *โสพสดื่อโล Dินอนาหหกียการณจสม เนาเดามโห้หปโส่างพองร่อเจา**",
        "5. ห้าม /suicide ขณะโบม Noglin ลิ่ง หร่ือดมพึบโรยโดื้กียเบื่อง (บางทีม่อดจำาหาที /suicide ได) แบบพี่หที 1 ห้ากาภาก"
      ]
    },
    penaltySystem: {
      title: "Penalty System",
      pointSystem: [
        "ครั้งที่ 1 หัก Point ภายในเกม 1,000 - 5,000",
        "ครั้งที่ 2 หัก Point ภายในเกม 5,000 - 10,000 / แบน 3/5/7 วัน",
        "ครั้งที่ 3 หัก Point ภายในเกม 10,000 - 15,000 / แบน 7 วัน"
      ],
      violations: [
        "หากมีปัมความผิดซ้ำอยูป่าง เช่น Dupe / Cheats และอื่นๆ",
        "Dupe = ลบดื่งปอสร่าง/ดื่องกายครั่ง/ข้อมูลคำาลอร",
        "Cheats และอื่นๆจะถูกแบนถาวร ดั่วเคื่อดียชำน"
      ],
      penaltyDetails: [
        "First Violation: Deduct 1,000 - 5,000 points in-game.",
        "Second Violation: Deduct 5,000 - 10,000 points in-game / Temporary ban for 3/5/7 days.",
        "Third Violation: Deduct 10,000 - 15,000 points in-game / Temporary ban for 7 days.",
        "For severe violations,",
        "Duping = remove char/dino/base (DevWipe)",
        "Cheats and Other will be permanent ban will be enforced starting from the first violation."
      ]
    }
  };

  const mockEngramsRemoved = {
    "engrams_removed": [
      { "level": 5, "items": ["Wooden Sign", "Salt", "Preserving Salt"] },
      { "level": 7, "items": ["Single Panel Flag", "Tent", "Standing Torch"] },
      { "level": 8, "items": ["Multi-Panel Flag", "Compass"] },
      { "level": 9, "items": ["Boomerang", "Training Dummy"] },
      { "level": 10, "items": ["Glow Stick"] },
      { "level": 11, "items": ["Stone Pipe All"] },
      { "level": 12, "items": ["Pressure Plate"] },
      { "level": 13, "items": ["Vessel"] },
      { "level": 15, "items": ["Water Well", "Flare Gun", "All Adobe Structure"] },
      { "level": 16, "items": ["Gravestone", "Delivery Crate"] },
      { "level": 17, "items": ["Rope Ladder", "All Stone pipe", "Water Reservoir"] },
      { "level": 20, "items": ["All Elevator Structure except Elevator Track"] },
      { "level": 21, "items": ["Wall Torch"] },
      { "level": 22, "items": ["Tripwire Alarm Trap"] },
      { "level": 25, "items": ["Artifact Pedestal"] },
      { "level": 28, "items": ["StoneFireplace", "Manta Saddle"] },
      { "level": 29, "items": ["Tripwire Narcotic Trap", "AmmoBox"] },
      { "level": 30, "items": ["Zip-Line Anchor"] },
      { "level": 32, "items": ["Mirror,Lance"] },
      { "level": 34, "items": ["Climbing pick"] },
      { "level": 38, "items": ["Re-Fertilizer"] },
      { "level": 45, "items": ["Pliers"] },
      { "level": 50, "items": ["Metal Sign", "Camera", "Industrial Grill"] },
      { "level": 51, "items": ["Radio"] },
      { "level": 54, "items": ["ZIP-line Motor attachment"] },
      { "level": 59, "items": ["Laser Attachment"] },
      { "level": 60, "items": ["Transponder Tracker", "Transponder Node"] }
    ]
  };

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setSectionLoading(true);
        const serverData = await getServerByID(serverId);
        setServer(serverData);

        const infos = {};
        for (const item of menuItems) {
          try {
            if (item.key === 'settings') {
              infos[item.key] = mockServerConfig;
            } else if (item.key === 'structures') {
              infos[item.key] = mockStructuresConfig;
            } else if (item.key === 'dinos') {
              infos[item.key] = mockDinosConfig;
            } else if (item.key === 'items') {
              infos[item.key] = mockLootConfig;
            } else if (item.key === 'environment') {
              infos[item.key] = mockEnvironmentConfig;
            } else if (item.key === 'commands') {
              infos[item.key] = mockCommandsConfig;
            } else if (item.key === 'donation') {
              infos[item.key] = mockDonationCommandsConfig;
            } else {
              const info = await getServerDisplayInfo(serverId, item.key);
              infos[item.key] = info;
            }
          } catch {
            infos[item.key] = { error: `Failed to load ${item.label}` };
          }
        }
        setDisplayInfos(infos);
      } catch {
        // error handled by hook
      } finally {
        setSectionLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId, getServerByID, getServerDisplayInfo]);

  if (loading || sectionLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <StarBackground />
        <Loading size="lg" message="Loading server details..." />
      </div>
    );
  }
  
  if (error && !server) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <StarBackground />
        <ErrorMessage error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      <StarBackground />
      
      {/* Hero Section with Ant Design */}
      <div className="relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black z-10"></div>
        <div
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')`
          }}
        >
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center px-4">
              <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
                Settings for Astro PvP x100
              </Title>
              <Paragraph style={{ color: '#d1d5db', fontSize: '1.25rem', maxWidth: '672px', margin: '0 auto' }}>
                Astro consists of many settings and modifications from the normal game.
              </Paragraph>
              <Paragraph strong style={{ color: '#d1d5db', fontSize: '1.25rem', marginTop: '0.5rem' }}>
                You should find the most important ones in this list.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
  
      {/* Navigation and Content with Ant Design Layout */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          {/* Back Navigation */}
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            href="/servers"
            style={{ color: '#d1d5db', padding: 0, marginBottom: '1.5rem' }}
          >
            Back to Servers
          </Button>
  
          <Layout style={{ background: 'transparent' }}>
            {/* Sider for Desktop */}
            <Affix offsetTop={32}>
              <Sider
                width={300}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  padding: '24px 0'
                }}
                className="hidden md:block"
              >
                <Title level={4} style={{ color: 'white', marginLeft: '24px', marginBottom: '16px' }}>
                  Categories
                </Title>
                <Menu
                  mode="vertical"
                  selectedKeys={[activeTab]}
                  onClick={({ key }) => setActiveTab(key)}
                  style={{ background: 'transparent', border: 'none' }}
                  items={menuItems}
                  theme="dark"
                />
                
                {/* Server Status Card */}
                {server && (
                  <Card
                    size="small"
                    title="Server Status"
                    style={{
                      margin: '24px 16px 0',
                      background: 'rgba(55, 65, 81, 0.5)',
                      border: '1px solid #4b5563'
                    }}
                    headStyle={{ color: 'white', borderBottom: '1px solid #4b5563' }}
                    bodyStyle={{ color: 'white' }}
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9ca3af' }}>Status:</Text>
                        <Badge
                          status={server.is_online ? 'success' : 'error'}
                          text={server.is_online ? 'Online' : 'Offline'}
                          style={{ color: server.is_online ? '#10b981' : '#ef4444' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9ca3af' }}>Players:</Text>
                        <Text style={{ color: '#d1d5db' }}>{server.current_players}/{server.max_players}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9ca3af' }}>Rate:</Text>
                        <Text style={{ color: '#3b82f6' }}>{server.rate || 'x1'}</Text>
                      </div>
                    </Space>
                  </Card>
                )}
              </Sider>
            </Affix>
  
            {/* Mobile Menu */}
            <div className="md:hidden mb-8">
              <Row gutter={[16, 16]}>
                {menuItems.map((item) => (
                  <Col span={12} key={item.key}>
                    <Button
                      type={activeTab === item.key ? 'primary' : 'default'}
                      onClick={() => setActiveTab(item.key)}
                      icon={item.icon}
                      style={{
                        width: '100%',
                        height: 'auto',
                        padding: '16px',
                        background: activeTab === item.key ? '#1890ff' : 'rgba(55, 65, 81, 0.5)',
                        border: activeTab === item.key ? '1px solid #1890ff' : '1px solid #4b5563',
                        color: activeTab === item.key ? 'white' : '#d1d5db'
                      }}
                    >
                      <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                        {item.label}
                      </div>
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
  
            {/* Main Content */}
            <Content className="md:ml-[324px]" style={{ background: 'transparent' }}>
              <div className="mb-6">
                <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
                  {menuItems.find(c => c.key === activeTab)?.label}
                </Title>
                <div className="h-1 w-20 bg-blue-500 rounded"></div>
              </div>
  
              {displayInfos[activeTab] && !displayInfos[activeTab].error ? (
                activeTab === 'settings' ? (
                  <div>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Settings</Title>
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '16px'
                      }}
                      bodyStyle={{ background: 'transparent', color: 'white', padding: '24px' }}
                      hoverable
                    >
                      <Row gutter={[24, 24]}>
                        {mockServerConfig.map((config, index) => (
                          <Col xs={24} sm={12} lg={6} key={index}>
                            <div style={{
                              background: 'rgba(17, 24, 39, 0.35)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              padding: '16px',
                              height: '100%'
                            }}>
                              <div>
                                <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                                  {config.title}
                                </Title>
                                {config.subtitle && (
                                  <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                                    {config.subtitle}
                                  </Text>
                                )}
                              </div>

                              {config.value && (
                                <Text
                                  style={{
                                    color: '#3b82f6',
                                    fontFamily: 'monospace',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {config.value}
                                </Text>
                              )}

                              {config.extra && (
                                <Text italic style={{ color: '#d1d5db', fontSize: '14px' }}>
                                  {config.extra}
                                </Text>
                              )}

                              {config.items && (
                                <List
                                  size="small"
                                  dataSource={config.items}
                                  renderItem={(item) => (
                                    <List.Item style={{ padding: '4px 0', border: 'none' }}>
                                      <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: '6px',
                                          height: '6px',
                                          backgroundColor: '#3b82f6',
                                          borderRadius: '50%',
                                          marginRight: '8px'
                                        }}></span>
                                        {item}
                                      </Text>
                                    </List.Item>
                                  )}
                                />
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </div>
                ) : activeTab === 'players' ? (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Player Settings */}
                    <div>
                      <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                        <TeamOutlined style={{ color: '#3b82f6', marginRight: '8px' }} />
                        Player Settings
                      </Title>
                      <Row gutter={[16, 16]}>
                        {Object.entries(mockPlayerConfig).map(([key, value]) => (
                          <Col xs={24} sm={12} md={8} lg={6} key={key}>
                            <Card
                              size="small"
                              style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid #374151',
                                borderRadius: '12px',
                                height: '100%'
                              }}
                              bodyStyle={{
                                background: 'transparent',
                                color: 'white'
                              }}
                              hoverable
                            >
                              <Space direction="vertical" size="small">
                                <Title level={5} style={{ color: 'white', textTransform: 'capitalize', margin: 0 }}>
                                  {key.replace(/_/g, ' ')}
                                </Title>
                                <Text style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '18px' }}>
                                  {String(value)}
                                </Text>
                              </Space>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>

                    {/* Removed Engrams */}
                    <div>
                      <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                        <WarningOutlined style={{ color: '#ef4444', marginRight: '8px' }} />
                        Removed Engrams
                      </Title>
                      <Card
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #374151',
                          borderRadius: '12px'
                        }}
                        bodyStyle={{ padding: 0 }}
                      >
                        <Table
                          dataSource={mockEngramsRemoved.engrams_removed}
                          rowKey={(record, index) => index}
                          pagination={false}
                          style={{
                            background: 'transparent'
                          }}
                          rowClassName="hover:bg-gray-800/20"
                          columns={[
                            {
                              title: <Text strong style={{ color: 'white' }}>Level</Text>,
                              dataIndex: 'level',
                              key: 'level',
                              width: '20%',
                              render: (level) => (
                                <Text style={{ color: '#3b82f6', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '18px' }}>
                                  {level}
                                </Text>
                              )
                            },
                            {
                              title: <Text strong style={{ color: 'white' }}>Removed Engrams & Structures</Text>,
                              dataIndex: 'items',
                              key: 'items',
                              render: (items) => (
                                <Text style={{ color: '#d1d5db' }}>
                                  {items.join(', ')}
                                </Text>
                              )
                            }
                          ]}
                        />
                      </Card>
                    </div>
                  </Space>
                ) : activeTab === 'dinos' ? (
                  <div>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Dinos</Title>
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '16px'
                      }}
                      bodyStyle={{ background: 'transparent', color: 'white', padding: '24px' }}
                      hoverable
                    >
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Default Dinos */}
                        <div>
                          <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                            <BugOutlined style={{ color: '#10b981', marginRight: '8px' }} />
                            Default Dinos
                          </Title>
                          <Row gutter={[16, 16]}>
                            {Object.entries(mockDinoConfig).map(([key, value]) => (
                              <Col xs={24} sm={12} md={8} lg={6} key={key}>
                                <div style={{
                                  background: 'rgba(17, 24, 39, 0.35)',
                                  border: '1px solid #374151',
                                  borderRadius: '12px',
                                  padding: '12px',
                                  height: '100%'
                                }}>
                                  <Title level={5} style={{ color: 'white', textTransform: 'capitalize', margin: 0 }}>
                                    {key.replace(/_/g, ' ')}
                                  </Title>
                                  <Text style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '18px' }}>
                                    {String(value)}
                                  </Text>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>

                        {/* Boss & Content */}
                        <div>
                          <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                            <GiftOutlined style={{ color: '#8b5cf6', marginRight: '8px' }} />
                            Boss & Content
                          </Title>
                          <Row gutter={[16, 16]}>
                            {Object.entries(mockBossContent).map(([key, value]) => (
                              <Col xs={24} sm={12} key={key}>
                                <div style={{
                                  background: 'rgba(17, 24, 39, 0.35)',
                                  border: '1px solid #374151',
                                  borderRadius: '12px',
                                  padding: '12px',
                                  height: '100%'
                                }}>
                                  <Title level={5} style={{ color: 'white', textTransform: 'capitalize', margin: 0 }}>
                                    {key.replace(/_/g, ' ')}
                                  </Title>
                                  <Text style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '18px' }}>
                                    {String(value)}
                                  </Text>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>

                        {/* Buff & Nerf */}
                        <div>
                          <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                            <WarningOutlined style={{ color: '#f97316', marginRight: '8px' }} />
                            Buff & Nerf Include Tek & Aberrant & X & R variant
                          </Title>
                          <Table
                            dataSource={mockDinoBuffNerf}
                            rowKey={(record, index) => index}
                            pagination={false}
                            scroll={{ x: 800 }}
                            columns={[
                              {
                                title: <Text strong style={{ color: 'white' }}>Name</Text>,
                                dataIndex: 'name',
                                key: 'name',
                                render: (name) => <Text strong style={{ color: 'white' }}>{name}</Text>
                              },
                              {
                                title: <Text strong style={{ color: 'white' }}>Damage</Text>,
                                dataIndex: 'damage',
                                key: 'damage',
                                render: (damage) => (
                                  <Text style={{ color: '#eab308', fontFamily: 'monospace' }}>
                                    {damage || '-'}
                                  </Text>
                                )
                              },
                              {
                                title: <Text strong style={{ color: 'white' }}>Resistance</Text>,
                                dataIndex: 'resistance',
                                key: 'resistance',
                                render: (resistance) => (
                                  <Text style={{ color: '#10b981', fontFamily: 'monospace' }}>
                                    {resistance || '-'}
                                  </Text>
                                )
                              },
                              {
                                title: <Text strong style={{ color: 'white' }}>Extra</Text>,
                                dataIndex: 'extra',
                                key: 'extra',
                                render: (extra) => (
                                  <Text style={{ color: '#06b6d4' }}>
                                    {extra || '-'}
                                  </Text>
                                )
                              }
                            ]}
                          />
                        </div>

                        {/* Dino Remove */}
                        <div>
                          <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                            <WarningOutlined style={{ color: '#ef4444', marginRight: '8px' }} />
                            Dino Remove
                          </Title>
                          <Paragraph style={{ color: '#d1d5db', marginBottom: '16px' }}>
                            Include Tek & Aberrant & X & R variant
                          </Paragraph>
                          <Row gutter={[16, 16]}>
                            {mockDinoRemoved.map((dino, index) => (
                              <Col xs={12} sm={8} md={6} key={index}>
                                <div
                                  style={{
                                    background: 'rgba(127, 29, 29, 0.2)',
                                    border: '1px solid #991b1b',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    padding: '12px'
                                  }}
                                >
                                  <Text style={{ color: '#fca5a5', fontWeight: '500' }}>{dino}</Text>
                                  <br />
                                  <Text style={{ color: '#ef4444', fontSize: '12px' }}>Remove</Text>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      </Space>
                    </Card>
                  </div>
                ) : activeTab === 'loot' ? (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Items</Title>
                    
                    {/* Top Row - 4 Columns */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '2rem' }}>
                      {/* Item Stack Size */}
                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.itemStackSize.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.itemStackSize.subtitle}
                            </Text>
                            <Text strong style={{ color: 'white' }}>
                              {mockLootConfig.itemStackSize.description}
                            </Text>
                            <List
                              size="small"
                              dataSource={mockLootConfig.itemStackSize.items}
                              renderItem={(item) => (
                                <List.Item style={{ padding: '2px 0', border: 'none' }}>
                                  <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                    <span style={{
                                      display: 'inline-block',
                                      width: '8px',
                                      height: '8px',
                                      backgroundColor: '#3b82f6',
                                      borderRadius: '50%',
                                      marginRight: '8px'
                                    }}></span>
                                    {item}
                                  </Text>
                                </List.Item>
                              )}
                            />
                          </Space>
                        </Card>
                      </Col>

                      {/* Loot Quality */}
                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.lootQuality.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.lootQuality.subtitle}
                            </Text>
                            <Text style={{ color: '#d1d5db' }}>
                              {mockLootConfig.lootQuality.description}
                            </Text>
                            <Button type="link" style={{ color: '#3b82f6', padding: 0 }}>
                              {mockLootConfig.lootQuality.link}
                            </Button>
                          </Space>
                        </Card>
                      </Col>

                      {/* Removed Items */}
                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.removedItems.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.removedItems.subtitle}
                            </Text>
                            <List
                              size="small"
                              dataSource={mockLootConfig.removedItems.items}
                              renderItem={(item) => (
                                <List.Item style={{ padding: '2px 0', border: 'none' }}>
                                  <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                    <span style={{
                                      display: 'inline-block',
                                      width: '8px',
                                      height: '8px',
                                      backgroundColor: '#ef4444',
                                      borderRadius: '50%',
                                      marginRight: '8px'
                                    }}></span>
                                    {item}
                                  </Text>
                                </List.Item>
                              )}
                            />
                          </Space>
                        </Card>
                      </Col>

                      {/* Modified Items */}
                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.modifiedItems.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.modifiedItems.subtitle}
                            </Text>
                            <List
                              size="small"
                              dataSource={mockLootConfig.modifiedItems.items}
                              renderItem={(item) => (
                                <List.Item style={{ padding: '2px 0', border: 'none' }}>
                                  <Text style={{ color: '#eab308', fontSize: '14px', fontWeight: 'medium' }}>
                                    {item}
                                  </Text>
                                </List.Item>
                              )}
                            />
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    {/* Bottom Row - Customized Recipes */}
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '12px'
                      }}
                      bodyStyle={{
                        background: 'transparent',
                        color: 'white'
                      }}
                      hoverable
                    >
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                          {mockLootConfig.customizedRecipes.title}
                        </Title>
                        <List
                          dataSource={mockLootConfig.customizedRecipes.items}
                          renderItem={(recipe) => (
                            <List.Item style={{ border: 'none', padding: '8px 0' }}>
                              <Space direction="vertical" size="small">
                                <Text style={{ color: 'white' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: '#10b981',
                                    borderRadius: '50%',
                                    marginRight: '12px'
                                  }}></span>
                                  <Text strong style={{ color: 'white' }}>{recipe.name}</Text>
                                </Text>
                                <Text style={{ color: '#9ca3af', marginLeft: '20px' }}>
                                  {recipe.detail}
                                </Text>
                              </Space>
                            </List.Item>
                          )}
                        />
                      </Space>
                    </Card>
                  </Space>
                ) : activeTab === 'rules' ? (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* General Rules */}
                    <div>
                      <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
                        {mockRulesConfig.generalRules.title}
                      </Title>
                      <Paragraph style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '24px' }}>
                        {mockRulesConfig.generalRules.subtitle}
                      </Paragraph>
                      <Card
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #374151',
                          borderRadius: '12px'
                        }}
                        bodyStyle={{
                          background: 'transparent',
                          color: 'white'
                        }}
                        hoverable
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>[Generals Rules]</Text>
                          <List
                            dataSource={mockRulesConfig.generalRules.rules}
                            renderItem={(rule, index) => (
                              <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                  <Text style={{ color: '#3b82f6', marginRight: '12px' }}>{index + 1}.</Text>
                                  {rule}
                                </Text>
                              </List.Item>
                            )}
                          />
                        </Space>
                      </Card>
                    </div>

                    {/* Building Rules */}
                    <div>
                      <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                        {mockRulesConfig.buildingRules.title}
                      </Title>
                      <Card
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #374151',
                          borderRadius: '12px'
                        }}
                        bodyStyle={{
                          background: 'transparent',
                          color: 'white'
                        }}
                        hoverable
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>[Building Rules]</Text>
                          <List
                            dataSource={mockRulesConfig.buildingRules.rules}
                            renderItem={(rule, index) => (
                              <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                  <Text style={{ color: '#3b82f6', marginRight: '12px' }}>{index + 1}.</Text>
                                  {rule}
                                </Text>
                              </List.Item>
                            )}
                          />
                        </Space>
                      </Card>
                    </div>

                    {/* Raid & PVP Rules */}
                    <div>
                      <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
                        {mockRulesConfig.raidPvpRules.title}
                      </Title>
                      <Paragraph style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '16px' }}>
                        {mockRulesConfig.raidPvpRules.subtitle}
                      </Paragraph>
                      <Card
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #374151',
                          borderRadius: '12px'
                        }}
                        bodyStyle={{
                          background: 'transparent',
                          color: 'white'
                        }}
                        hoverable
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>[Raid & PVP Rules]</Text>
                          <List
                            dataSource={mockRulesConfig.raidPvpRules.rules}
                            renderItem={(rule, index) => (
                              <List.Item style={{ border: 'none', padding: '8px 0' }}>
                                <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                  <Text style={{ color: '#3b82f6', marginRight: '12px' }}>{index + 1}.</Text>
                                  {rule}
                                </Text>
                              </List.Item>
                            )}
                          />
                        </Space>
                      </Card>
                    </div>

                    {/* Penalty System */}
                    <div>
                      <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                        Penalty System
                      </Title>
                      <Row gutter={[24, 24]}>
                        {/* Point System */}
                        <Col xs={24} lg={12}>
                          <Card
                            style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(4px)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              height: '100%'
                            }}
                            bodyStyle={{
                              background: 'transparent',
                              color: 'white'
                            }}
                            hoverable
                          >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                              <Title level={4} style={{ color: 'white', margin: 0 }}>[บทลงโทษ]</Title>
                              <List
                                size="small"
                                dataSource={mockRulesConfig.penaltySystem.pointSystem}
                                renderItem={(item) => (
                                  <List.Item style={{ border: 'none', padding: '4px 0' }}>
                                    <Text style={{ color: '#d1d5db', fontSize: '14px' }}>{item}</Text>
                                  </List.Item>
                                )}
                              />
                              <Divider style={{ borderColor: '#374151', margin: '16px 0' }} />
                              <List
                                size="small"
                                dataSource={mockRulesConfig.penaltySystem.violations}
                                renderItem={(item) => (
                                  <List.Item style={{ border: 'none', padding: '4px 0' }}>
                                    <Text style={{ color: '#d1d5db', fontSize: '14px' }}>{item}</Text>
                                  </List.Item>
                                )}
                              />
                            </Space>
                          </Card>
                        </Col>

                        {/* English Penalty Details */}
                        <Col xs={24} lg={12}>
                          <Card
                            style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(4px)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              height: '100%'
                            }}
                            bodyStyle={{
                              background: 'transparent',
                              color: 'white'
                            }}
                            hoverable
                          >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                              <Title level={4} style={{ color: 'white', margin: 0 }}>[Penalty System]</Title>
                              <List
                                size="small"
                                dataSource={mockRulesConfig.penaltySystem.penaltyDetails}
                                renderItem={(item) => (
                                  <List.Item style={{ border: 'none', padding: '4px 0' }}>
                                    <Text style={{ color: '#d1d5db', fontSize: '14px' }}>{item}</Text>
                                  </List.Item>
                                )}
                              />
                            </Space>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Space>
                ) : activeTab === 'structures' ? (
                  <div>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Structures</Title>
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '16px'
                      }}
                      bodyStyle={{ background: 'transparent', color: 'white', padding: '24px' }}
                      hoverable
                    >
                      <Row gutter={[32, 32]}>
                        {mockStructuresConfig.map((config, index) => (
                          <Col xs={24} sm={12} lg={6} key={index}>
                            <div style={{
                              background: 'rgba(17, 24, 39, 0.35)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              padding: '16px',
                              height: '100%'
                            }}>
                              <div>
                                <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                                  {config.title}
                                </Title>
                                {config.subtitle && (
                                  <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                                    {config.subtitle}
                                  </Text>
                                )}
                              </div>
                              
                              {config.value && (
                                <Text
                                  style={{
                                    color: '#3b82f6',
                                    fontFamily: 'monospace',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {config.value}
                                </Text>
                              )}
                              
                              {config.items && (
                                <List
                                  size="small"
                                  dataSource={config.items}
                                  renderItem={(item) => (
                                    <List.Item style={{ padding: '2px 0', border: 'none' }}>
                                      <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                        <span style={{
                                          display: 'inline-block',
                                          width: '6px',
                                          height: '6px',
                                          backgroundColor: '#3b82f6',
                                          borderRadius: '50%',
                                          marginRight: '8px'
                                        }}></span>
                                        {item}
                                      </Text>
                                    </List.Item>
                                  )}
                                />
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </div>
                ) : activeTab === 'dinos' ? (
                  <div>
                    <h3 className="text-3xl font-bold text-orange-500 mb-8">Dinos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {mockDinosConfig.map((config, index) => (
                        <SpotlightCard
                          key={index}
                          hsl
                          hslMin={120}
                          hslMax={180}
                          className="w-full rounded-xl bg-white/10 p-6 shadow-xl shadow-white/2.5 hover:bg-white/15 transition-all duration-300"
                        >
                          <div className="absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-zinc-800/50"></div>
                          <div className="relative">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-white mb-1 text-lg">
                                  {config.title}
                                </h4>
                                {config.subtitle && (
                                  <div className="text-xs text-gray-400 leading-relaxed mb-3">
                                    {config.subtitle}
                                  </div>
                                )}
                              </div>
                              
                              {config.value && (
                                <div className="text-blue-400 font-mono text-2xl font-bold mb-2">
                                  {config.value}
                                </div>
                              )}
                              
                              {config.items && (
                                <ul className="space-y-1">
                                  {config.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-gray-300 text-sm flex items-center">
                                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </SpotlightCard>
                      ))}
                    </div>
                  </div>
                ) : activeTab === 'items' ? (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Items</Title>
                    
                    {/* Top Row - 4 Columns */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '2rem' }}>
                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.itemStackSize.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.itemStackSize.subtitle}
                            </Text>
                            <Text strong style={{ color: 'white' }}>100K</Text>
                            <Text italic style={{ color: '#d1d5db', fontSize: '14px' }}>
                              Bullets and other items are customized
                            </Text>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.lootQuality.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.lootQuality.subtitle}
                            </Text>
                            <div>
                              <Text style={{ color: '#d1d5db', display: 'block' }}>Loot Drop Quality: 4x</Text>
                              <Text style={{ color: '#d1d5db', display: 'block' }}>Fishing Loot Quality: 4x</Text>
                              <Text style={{ color: '#d1d5db', display: 'block' }}>Extinction OSD Quality: massively buffed</Text>
                            </div>
                            <Button type="link" style={{ color: '#3b82f6', padding: 0 }}>
                              More Info
                            </Button>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.removedItems.title}
                            </Title>
                            <Text style={{ color: '#9ca3af', fontSize: '14px' }}>
                              {mockLootConfig.removedItems.subtitle}
                            </Text>
                            <List
                              size="small"
                              dataSource={mockLootConfig.removedItems.items}
                              renderItem={(item) => (
                                <List.Item style={{ padding: '2px 0', border: 'none' }}>
                                  <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                                    <span style={{
                                      display: 'inline-block',
                                      width: '8px',
                                      height: '8px',
                                      backgroundColor: '#ef4444',
                                      borderRadius: '50%',
                                      marginRight: '8px'
                                    }}></span>
                                    {item}
                                  </Text>
                                </List.Item>
                              )}
                            />
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4} style={{ color: 'white', margin: 0 }}>
                              {mockLootConfig.modifiedItems.title}
                            </Title>
                            <div>
                              <Text style={{ color: '#d1d5db', display: 'block', marginBottom: '8px' }}>
                                Tek-Bow: 50% DMG on Players<br />
                                tranq-mode does not damage players and tamed dinos<br />
                                explosive-mode does not damage structures
                              </Text>
                              <Text style={{ color: '#d1d5db', display: 'block' }}>Flamethrower: 75% DMG</Text>
                              <Text style={{ color: '#d1d5db', display: 'block' }}>Compound Bow: 175% DMG</Text>
                              <Text style={{ color: '#d1d5db', display: 'block' }}>
                                Tek Hoversail: 1K HP<br />
                                5k HP but resistance nerfed
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    {/* Bottom Row - Customized Recipes */}
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '12px'
                      }}
                      bodyStyle={{
                        background: 'transparent',
                        color: 'white'
                      }}
                      hoverable
                    >
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                          {mockLootConfig.customizedRecipes.title}
                        </Title>
                        <div>
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            {[
                              { name: "Shadow Steak:", detail: "no Mushrooms and Rockarrot" },
                              { name: "Vegetable Cake:", detail: "no Sap and Honey." },
                              { name: "Heavy Turret:", detail: "no Autoturret" },
                              { name: "Grappling Hook:", detail: "no Arrow" },
                              { name: "Narcotics:", detail: "no spoiled Meat" },
                              { name: "Awesome Spyglass:", detail: "1x Fiber" }
                            ].map((recipe, index) => (
                              <div key={index}>
                                <Text style={{ color: 'white' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: '#10b981',
                                    borderRadius: '50%',
                                    marginRight: '12px'
                                  }}></span>
                                  <Text strong style={{ color: 'white' }}>{recipe.name}</Text>
                                </Text>
                                <Text style={{ color: '#9ca3af', marginLeft: '20px', display: 'block' }}>
                                  {recipe.detail}
                                </Text>
                              </div>
                            ))}
                          </Space>
                        </div>
                      </Space>
                    </Card>
                  </Space>
                ) : activeTab === 'environment' ? (
                  <div>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Environment</Title>
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '16px'
                      }}
                      bodyStyle={{ background: 'transparent', color: 'white', padding: '24px' }}
                      hoverable
                    >
                      <Row gutter={[32, 32]}>
                        {mockEnvironmentConfig.map((config, index) => (
                          <Col xs={24} sm={12} lg={6} key={index}>
                            <div style={{
                              background: 'rgba(17, 24, 39, 0.35)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              padding: '16px',
                              height: '100%'
                            }}>
                              <div>
                                <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                                  {config.title}
                                </Title>
                                {config.subtitle && (
                                  <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                                    {config.subtitle}
                                  </Text>
                                )}
                              </div>
                              
                              {config.value && (
                                <Text
                                  style={{
                                    color: '#3b82f6',
                                    fontFamily: 'monospace',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {config.value}
                                </Text>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </div>
                ) : activeTab === 'commands' ? (
                  <div>
                    <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Commands</Title>
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '16px'
                      }}
                      bodyStyle={{ background: 'transparent', color: 'white', padding: '24px' }}
                      hoverable
                    >
                      <Row gutter={[32, 32]}>
                        {mockCommandsConfig.map((config, index) => (
                          <Col xs={24} md={12} lg={8} key={index}>
                            <div style={{
                              background: 'rgba(17, 24, 39, 0.35)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              padding: '16px',
                              height: '100%'
                            }}>
                              <div>
                                <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                                  {config.title}
                                </Title>
                                {config.subtitle && (
                                  <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                                    {config.subtitle}
                                  </Text>
                                )}
                              </div>
                              
                              {config.value && (
                                <Text
                                  style={{
                                    color: '#10b981',
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    whiteSpace: 'pre-line'
                                  }}
                                >
                                  {config.value}
                                </Text>
                              )}
                              
                              {config.extra && (
                                <Text italic style={{ color: '#d1d5db', fontSize: '14px' }}>
                                  {config.extra}
                                </Text>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </div>
                ) : activeTab === 'donation' ? (
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <Text style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '8px', display: 'block' }}>
                        Donators only - <Button type="link" href="https://donate.astro-pvp.com" style={{ color: '#3b82f6', padding: 0 }}>Donation Shop</Button>
                      </Text>
                      <Title level={3} style={{ color: '#f97316', marginBottom: '2rem' }}>Donation Commands</Title>
                    </div>
                    <Card
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #374151',
                        borderRadius: '16px'
                      }}
                      bodyStyle={{ background: 'transparent', color: 'white', padding: '24px' }}
                      hoverable
                    >
                      <Row gutter={[32, 32]}>
                        {mockDonationCommandsConfig.map((config, index) => (
                          <Col xs={24} md={12} lg={8} key={index}>
                            <div style={{
                              background: 'rgba(17, 24, 39, 0.35)',
                              border: '1px solid #374151',
                              borderRadius: '12px',
                              padding: '16px',
                              height: '100%'
                            }}>
                              <div>
                                <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                                  {config.title}
                                </Title>
                                {config.subtitle && (
                                  <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                                    {config.subtitle}
                                  </Text>
                                )}
                              </div>
                              
                              {config.value && (
                                <Text
                                  style={{
                                    color: '#eab308',
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    whiteSpace: 'pre-line'
                                  }}
                                >
                                  {config.value}
                                </Text>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </div>
                ) : (
                  <Row gutter={[24, 24]}>
                    {displayInfos[activeTab] && Object.entries(displayInfos[activeTab]).map(([key, value]) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={key}>
                        <Card
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                            height: '100%'
                          }}
                          bodyStyle={{
                            background: 'transparent',
                            color: 'white',
                            padding: '24px'
                          }}
                          hoverable
                        >
                          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                              <Title level={5} style={{ color: 'white', textTransform: 'capitalize', marginBottom: '4px' }}>
                                {key.replace(/_/g, ' ')}
                              </Title>
                              <Text style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Configuration Value
                              </Text>
                            </div>
                            <Text style={{ color: '#d1d5db', fontSize: '16px' }}>
                              {String(value)}
                            </Text>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )
              ) : displayInfos[activeTab]?.error ? (
                <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 text-center">
                  <WarningOutlined className="text-red-400 text-3xl mb-2 block" />
                  <p className="text-red-300 text-lg">Failed to load {menuItems.find(c => c.key === activeTab)?.label}</p>
                  <p className="text-red-400 text-sm mt-2">Please try refreshing the page</p>
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-xl p-8 text-center">
                  <BarChartOutlined className="text-gray-400 text-3xl mb-2 block" />
                  <p className="text-gray-300 text-lg">Loading {menuItems.find(c => c.key === activeTab)?.label}...</p>
                </div>
              )}
            </Content>
          </Layout>
        </div>
      </div>
  
      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
      
      <BackTop />
    </div>
  );
};

export default ServerDetails;