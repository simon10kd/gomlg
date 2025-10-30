extends Area3D

@export var yield_amount: int = 5
var player_in_range: Node = null
var harvested: bool = false

func _ready() -> void:
	connect("body_entered", _on_body_entered)
	connect("body_exited", _on_body_exited)

func _process(delta: float) -> void:
	if harvested:
		return
	if player_in_range and Input.is_physical_key_pressed(KEY_E):
		if player_in_range.has_method("add_grass"):
			player_in_range.call("add_grass", yield_amount)
			harvested = true
			visible = false
			set_deferred("monitoring", false)

func _on_body_entered(body: Node) -> void:
	if body is CharacterBody3D:
		player_in_range = body

func _on_body_exited(body: Node) -> void:
	if body == player_in_range:
		player_in_range = null


