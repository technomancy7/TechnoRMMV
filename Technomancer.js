//=============================================================================
// Technomancer.js
//=============================================================================

/*:
 * @plugindesc Various utilities and functions.
 * @author Technomancer
 * 
 * @param Steal Default Odds
 * @desc Default chance of stealing.
 * @default 100
 * 
 * @param Keybind Debug 
 * @desc Show key press debug info in the console.
 * @type boolean
 * @default false
 * 
 * @param Custom Keybinds
 * @text Keybinds
 * @desc Insert new keybinds. Format <keycode> <command>
 * @type text[]
 * @default []
 * 
 * @param Advanced Keybinds
 * @text Advanced Keybinds
 * @desc Insert new keybinds. 
 * @type struct<AdvKeybinds>[]
 * 
 * @help 
 * 
 * == Keybinds ==
 * Create custom inputs for the standard input manager.
 * This is more limited than advanced keybinds as it's essentially just for rebinding the default inputs.
 * 
 * Format: <keycode> <command>
 * Example: 65 left - Will bind keycode 65 (A key) to "left", so A will move the player left.
 * 
 * 
 * == Advanced Keybinds ==
 * The advanced keybinds settings lets you bind practically any key to do basically anything you want.
 * First, you want to define at least one of the Trigger values.
 * Then define at least one of the Execute values.
 * 
 * Example, opening notepad plugin when `b` is pressed:
 *  Trigger on Key = b
 *  Execute Plugin Command = notepad open
 *  
 * Example, running arbitrary code when `v` is pressed:
 *  Trigger on Key = v
 *  Evaluate Script = console.log("hello!")
 *  
 * 
 * == Abilities ==
 * Create an ability that calls to a common event which calls the following scripts;
 * 
 * Technomancer.Abilities.doSteal()
 * 
 * 
 * Steals are defined by tags in the enemy note tags
 * <steal:i4> says the enemy has the ITEM at ID 4
 * <steal:w2> is for the WEAPON at ID 2
 * <steal:a9> is for the ARMORS at ID 9
 * <steal:g1000> says the player will steal 1000 gold <TODO add some variance to the random amount range around the defined number>
 * 
 * == Cheats ==
 * 
 * Technomancer.Cheats.giveAll()
 * 
 * == Utilities ==
 *
 */
/*~struct~AdvKeybinds:
* @param TriggerCode
* @text Trigger on Code
* @type text
* @desc Trigger this block when a key matching is pressed. E.g. F12, KeyA.
* 
* @param TriggerKey
* @text Trigger on Key
* @type text
* @desc Trigger this block when key is pressed. E.g. F12, a
* 
* @param TriggerKeycode
* @text Trigger on Keycode
* @type number
* @desc Trigger this block when keycode is pressed. E.g. 123, 65
* 
* @param ExecutePluginCommand
* @text Execute Plugin Command
* @type text
* @desc Insert another plugin command that will run when this key is pressed.
* 
* 
* @param ExecuteScript
* @text Evaluate javascript code
* @type note
* @desc The code will be executed when the key is pressed.
* 
* @param ExecuteCommonEvent
* @text Run Common Event
* @type number
* @desc The Common Event matching ID # will be executed when key is pressed.
* @default 0
*/
var Technomancer = Technomancer || {};  
Technomancer.Abilities = Technomancer.Abilities || {};  
Technomancer.Cheats = Technomancer.Cheats || {};   
Technomancer.Utils = Technomancer.Utils || {};


(function() {
Params = PluginManager.parameters('Technomancer')
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

var _Window_Base_ResetFontSettings = Window_Base.prototype.resetFontSettings;
Window_Base.prototype.resetFontSettings = function() {
    _Window_Base_ResetFontSettings.call( this );
    this.contents.outlineWidth = 0;
};

Technomancer.Utils.range = function(low, high){ var arr = []; while(low <= high){ arr.push(low++); } return arr; }

// Example for each match type: code KeyD, key d, keyCode 68
Technomancer.KeyDown = function(event) {
    //console.log(Params["Keybind Debug"])
    if(Params["Keybind Debug"] == true) console.log(event)

    let f = JSON.parse(Params["Advanced Keybinds"])
    
    for(const advkeys of f) {
        advb = JSON.parse(advkeys)
        if(Params["Keybind Debug"] == true) console.log(advb)
        //console.log(`${advb.TriggerKey} and ${event.key}`);
        
        if(advb.TriggerKey == event.key || advb.TriggerCode == event.code || advb.TriggerKeycode == event.keyCode) {            
            if(advb.ExecuteCommonEvent > 0) {
                //console.log("Running common event:");
                $gameTemp.reserveCommonEvent(advb.ExecuteCommonEvent);
                $gameTemp.clearCommonEvent(advb.ExecuteCommonEvent); 
            }
        
            if(advb.ExecutePluginCommand){
                let cmd = advb.ExecutePluginCommand.split(" ")[0]
                let args = advb.ExecutePluginCommand.split(" ").slice(1)
                
                $gameMap._interpreter.pluginCommand(cmd, args);
            }
            if(advb.ExecuteScript) {
                //console.log("Executing eval:")
                let code = JSON.parse( advb.ExecuteScript )
                //console.log(code)
                eval(code)
            } 
        }

    }

};

document.addEventListener('keydown', Technomancer.KeyDown.bind(this));

Technomancer.RefreshCustomKeys = function() {
	let f = Params["Custom Keybinds"]
	f = JSON.parse( f )
	for (const key of f) {
		let id = parseInt(key.split(" ")[0])
		let cmd = key.split(" ")[1]
		
        Input.keyMapper[id] = cmd;
        console.log(`Binding ${id} to ${cmd}.`);
	}
}

Technomancer.RefreshCustomKeys();

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'steal') {
        Technomancer.Abilities.doSteal()
    }

};  
    
Technomancer.Cheats.giveAll = function(){
    $dataItems.forEach(function(item) {$gameParty.gainItem(item,99,false);});
    $dataArmors.forEach(function(armor){ $gameParty.gainItem(armor,1,false);});
    $dataWeapons.forEach(function(weapon){ $gameParty.gainItem(weapon,1,false);});
}

function randRanger(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function getInvName(code){
    if(code == undefined) return []
    var st = code[0];
    var si = Number(code.slice(1))
    if(st == "i"){
        var item = $dataItems[si]
        return [item.iconIndex, item.name]
    }
    
    if(st == "a"){
        var item = $dataArmors[si]
        return [item.iconIndex, item.name]
    }
    
    if(st == "w"){
        var item = $dataWeapons[si]
        return [item.iconIndex, item.name]
    }

}

Technomancer.Abilities.doSteal = function(){
    var odds = Number(PluginManager.parameters('Technomancer')["Steal Default Odds"]);
    //console.log(`def ${odds}`);
    
    var en = $gameTroop._enemies[BattleManager._action._targetIndex]
    var ss = en.enemy().meta["steal"]
    
    var new_odds = en.enemy().meta["steal_odds"]
    if(new_odds != undefined){
        odds = Number(new_odds);
        //console.log(`Updated odds to ${odds}`)
    }

    if(en.stolen || ss == undefined){ $gameMessage.add("Not carrying anything!"); return; }
    let cando = randRanger(0, 100)
    if (cando <= odds){
        var st = ss[0];
        var si = Number(ss.slice(1))
        if(st == "i"){
            var item = $dataItems[si]
            $gameMessage.add("Stole item: \\i["+item.iconIndex+"]"+item.name)
            $gameParty.gainItem(item, 1, false);
            en.stolen = true;
        } //item
        if(st == "a"){
            var item = $dataArmors[si]
            $gameMessage.add("Stole equipment: \\i["+item.iconIndex+"]"+item.name)
            $gameParty.gainItem($dataArmors[si], 1, false);
            en.stolen = true;
        } //armor
        if(st == "w"){
            var item = $dataWeapons[si]
            $gameMessage.add("Stole weapon: \\i["+item.iconIndex+"]"+item.name)
            $gameParty.gainItem($dataWeapons[si], 1, false);
            en.stolen = true;
        } //weapon
        if(st == "g"){
            $gameMessage.add("Stole money: "+si);
            $gameParty.gainGold(si);
            en.stolen = true;
        } //gold
        
    }else{
        $gameMessage.add("Steal missed!")
    }

}
})();

var _Window_Base_ResetFontSettings = Window_Base.prototype.resetFontSettings;
Window_Base.prototype.resetFontSettings = function() {
    _Window_Base_ResetFontSettings.call( this );
    this.contents.outlineWidth = 0;
};
