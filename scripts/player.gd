extends CharacterBody3D

const WALK_SPEED := 6.0
const SPRINT_SPEED := 10.0
const JUMP_VELOCITY := 5.0

var carried_grass: int = 0
var gravity: float = ProjectSettings.get_setting("physics/3d/default_gravity")

@onready var spring_arm: SpringArm3D = $SpringArm3D
@onready var camera: Camera3D = $SpringArm3D/Camera3D

func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= gravity * delta

	var move_input := _get_move_input()
	var cam_basis := camera.global_transform.basis
	var forward := -cam_basis.z.normalized()
	var right := cam_basis.x.normalized()
	var direction := (forward * move_input.y + right * move_input.x).normalized()

	var speed := WALK_SPEED
	if Input.is_physical_key_pressed(KEY_SHIFT):
		speed = SPRINT_SPEED

	velocity.x = direction.x * speed
	velocity.z = direction.z * speed

	if Input.is_physical_key_pressed(KEY_SPACE) and is_on_floor():
		velocity.y = JUMP_VELOCITY

	move_and_slide()

func _get_move_input() -> Vector2:
	var input_vec := Vector2.ZERO
	if Input.is_physical_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		input_vec.x -= 1.0
	if Input.is_physical_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		input_vec.x += 1.0
	if Input.is_physical_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		input_vec.y += 1.0
	if Input.is_physical_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		input_vec.y -= 1.0
	return input_vec

func add_grass(amount: int) -> void:
	carried_grass += amount
	_update_hud()

func sell_grass() -> void:
	var game := get_node_or_null("/root/Main/Game")
	if game and carried_grass > 0:
		var sold := carried_grass
		carried_grass = 0
		game.call("add_cash", sold)
		_update_hud()

func _update_hud() -> void:
	var hud := get_node_or_null("/root/Main/UI/HUD")
	var game := get_node_or_null("/root/Main/Game")
	if hud and game:
		var cash := int(game.get("cash"))
		hud.text = "Grass: %d | Cash: %d" % [carried_grass, cash]


