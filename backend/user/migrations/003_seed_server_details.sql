-- Seed initial JSON details for servers x25 (id:1) and x100 (id:2)
UPDATE servers SET details = CAST('{
  "settings": [
    {"title":"XP Multiplier","value":"x25"},
    {"title":"Harvest Multiplier","value":"x25"},
    {"title":"Egg Hatch Speed","value":"x25"}
  ],
  "structures": [],
  "dinos": {},
  "items": {},
  "environment": [],
  "commands": [],
  "rules": []
}' AS JSON) WHERE server_id = 1;

UPDATE servers SET details = CAST('{
  "settings": [
    {"title":"XP Multiplier","value":"x100"},
    {"title":"Harvest Multiplier","value":"x100"},
    {"title":"Egg Hatch Speed","value":"x100"}
  ],
  "structures": [],
  "dinos": {},
  "items": {},
  "environment": [],
  "commands": [],
  "rules": []
}' AS JSON) WHERE server_id = 2;