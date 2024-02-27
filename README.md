# TechnoRMMV
Technomancer's RPG Maker MV utilities

A collection of utilities and scripts for RPG Maker MV development.
Each feature is optional and is not required to be used, so if anyone finds any specific part useful, they can just use that part and ignore the rest.


== Keybinds ==
Create custom inputs for the standard input manager.
This is more limited than advanced keybinds as it's essentially just for rebinding the default inputs.

Format: <keycode> <command>
Example: 65 left - Will bind keycode 65 (A key) to "left", so A will move the player left.


== Advanced Keybinds ==
The advanced keybinds settings lets you bind practically any key to do basically anything you want.
First, you want to define at least one of the Trigger values.
Then define at least one of the Execute values.

Example, opening notepad plugin when `b` is pressed:
 Trigger on Key = b
 Execute Plugin Command = notepad open
 
Example, running arbitrary code when `v` is pressed:
 Trigger on Key = v
 Evaluate Script = console.log("hello!")
 

== Abilities ==
Create an ability that calls to a common event which calls the following scripts;

Technomancer.Abilities.doSteal()


Steals are defined by tags in the enemy note tags
<steal:i4> says the enemy has the ITEM at ID 4
<steal:w2> is for the WEAPON at ID 2
<steal:a9> is for the ARMORS at ID 9
<steal:g1000> says the player will steal 1000 gold <TODO add some variance to the random amount range around the defined number>

Note: Due to how RMMV abilities work, you probably want to make the attack have some other effect, like doing a bit of damage, or adding a status effect, otherwise 
the battle will display a message saying the ability had no effect, even if steal was successful.


== Cheats ==
Technomancer.Cheats.giveAll() // Give all items and equipment to inventory

== Utilities ==
