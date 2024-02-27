# TechnoRMMV
Technomancer's RPG Maker MV utilities <br>
<br>
A collection of utilities and scripts for RPG Maker MV development. <br>
Each feature is optional and is not required to be used, so if anyone finds any specific part useful, they can just use that part and ignore the rest. <br>
More features will likely be added over time. <br>

## Keybinds
Create custom inputs for the standard input manager. <br>
This is more limited than advanced keybinds as it's essentially just for rebinding the default inputs. <br>
 <br>
Format: <keycode> <command> <br>
Example: 65 left - Will bind keycode 65 (A key) to "left", so A will move the player left. <br>
 <br>
 <br>
## Advanced Keybinds
The advanced keybinds settings lets you bind practically any key to do basically anything you want. <br>
First, you want to define at least one of the Trigger values. <br>
Then define at least one of the Execute values. <br>
 <br>
Example, opening notepad plugin when `b` is pressed: <br>
 Trigger on Key = b <br>
 Execute Plugin Command = notepad open <br>
 
Example, running arbitrary code when `v` is pressed: <br>
 Trigger on Key = v <br>
 Evaluate Script = console.log("hello!") <br>
 

## Abilities
Create an ability that calls to a common event which calls the following scripts; <br>
Technomancer.Abilities.doSteal() <br>
 <br>
Steals are defined by tags in the enemy note tags <br>
<steal:i4> says the enemy has the ITEM at ID 4 <br>
<steal:w2> is for the WEAPON at ID 2 <br>
<steal:a9> is for the ARMORS at ID 9 <br>
<steal:g1000> says the player will steal 1000 gold <TODO add some variance to the random amount range around the defined number> <br>
 <br>
Note: Due to how RMMV abilities work, you probably want to make the attack have some other effect, like doing a bit of damage, or adding a status effect, otherwise 
the battle will display a message saying the ability had no effect, even if steal was successful. <br>
 <br>

## Cheats
Technomancer.Cheats.giveAll() // Give all items and equipment to inventory
