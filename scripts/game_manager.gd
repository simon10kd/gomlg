extends Node

var cash: int = 0

func add_cash(amount: int) -> void:
	cash += amount
	_update_hud()

func _update_hud() -> void:
	var hud := get_node_or_null("/root/Main/UI/HUD")
	if hud:
		var player := get_node_or_null("/root/Main/Player")
		var carried := 0
		if player and player.has_variable("carried_grass"):
			carried = int(player.carried_grass)
		hud.text = "Grass: %d | Cash: %d" % [carried, cash]


