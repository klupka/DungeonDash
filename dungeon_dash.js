// RUN GAME ONCE EVERYTHING HAS LOADED
window.addEventListener("load", function () {
    // BOOLEAN TOGGLE FOR TITLE SCREEN
    let showTitleScreen = true;

    // FUNCTION CALLED TO RESET GAME UPON PLAYER DEATH, REDEFINES GAME PROPERTIES
    function playGame() {
        // CANVAS PROPERTIES
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        const zoomScale = 1.2; // HIGHER VALUES INCREASE GAME SCALE
        let playerVisibility = 3; // HIGHER VALUE WILL ALLOW PLAYER TO SEE MORE

        canvas.width = 400 * zoomScale;
        canvas.height = 800 * zoomScale;
        const fontFamily = "DotGothic16";

        // GAME PROPERTIES
        let gamePause = false;
        let pauseText = "PAUSED";
        let pauseTextWidth = ctx.measureText(pauseText).width;
        let showDeathScreen = false;
        let blinkingTextAlpha = 1;
        let increaseBlinkingTextAlpha = false;
        let loopGame = true;

        // PLATFORM SPRITE IMAGES
        const SPRITE_PLATFORM_MEDIUM_MOVING = new Image();
        SPRITE_PLATFORM_MEDIUM_MOVING.src =
            "TEXTURES/PLATFORMS/SPRITE_PLATFORM_MEDIUM_MOVING.png";
        const SPRITE_PLATFORM_MEDIUM = new Image();
        SPRITE_PLATFORM_MEDIUM.src =
            "TEXTURES/PLATFORMS/SPRITE_PLATFORM_MEDIUM.png";
        SPRITE_PLATFORM_MEDIUM_COLLAPSABLE = new Image();
        SPRITE_PLATFORM_MEDIUM_COLLAPSABLE.src =
            "TEXTURES/PLATFORMS/SPRITE_PLATFORM_MEDIUM_COLLAPSABLE.png";
        const SPRITE_PLATFORM_LARGE_LEFT = new Image();
        SPRITE_PLATFORM_LARGE_LEFT.src =
            "TEXTURES/PLATFORMS/SPRITE_PLATFORM_LARGE.png";
        const SPRITE_PLATFORM_LARGE_RIGHT = new Image();
        SPRITE_PLATFORM_LARGE_RIGHT.src =
            "TEXTURES/PLATFORMS/SPRITE_PLATFORM_LARGE.png";
        const SPRITE_PLATFORM_LARGE_MIDDLE = new Image();
        SPRITE_PLATFORM_LARGE_MIDDLE.src =
            "TEXTURES/PLATFORMS/SPRITE_PLATFORM_LARGE.png";

        // BACKGROUND PROPERTIES
        let backgrounds = [];
        const backgroundScrollSpeed = 1000; // HIGHER VALUE SLOWS BG SCROLL SPEED

        // PLAYER & ENEMY SPRITE IMAGES
        const SPRITE_SHEET_THIEF = new Image();
        SPRITE_SHEET_THIEF.src = "TEXTURES/SPRITES/SPRITE_SHEET_THIEF.png";
        const SPRITE_SHEET_GHOST_ENTITY = new Image();
        SPRITE_SHEET_GHOST_ENTITY.src =
            "TEXTURES/SPRITES/SPRITE_SHEET_GHOST.png";
        const SPRITE_SHEET_BAT_ENTITY = new Image();
        SPRITE_SHEET_BAT_ENTITY.src =
            "TEXTURES/SPRITES/SPRITE_SHEET_BAT_FLYING.png";

        // UI ELEMENT IMAGES
        const PLAYER_UI_HEARTS_ZERO = new Image();
        PLAYER_UI_HEARTS_ZERO.src = "TEXTURES/UI/PLAYER_UI_HEARTS_0.png";
        const PLAYER_UI_HEARTS_ONE = new Image();
        PLAYER_UI_HEARTS_ONE.src = "TEXTURES/UI/PLAYER_UI_HEARTS_1.png";
        const PLAYER_UI_HEARTS_TWO = new Image();
        PLAYER_UI_HEARTS_TWO.src = "TEXTURES/UI/PLAYER_UI_HEARTS_2.png";
        const PLAYER_UI_HEARTS_THREE = new Image();
        PLAYER_UI_HEARTS_THREE.src = "TEXTURES/UI/PLAYER_UI_HEARTS_3.png";
        const UI_ICONS_ARROW_UP = new Image();
        UI_ICONS_ARROW_UP.src = "TEXTURES/UI/ICONS_ARROW_UP.png";
        const UI_KEYBOARD_LETTERS_SYMBOLS = new Image();
        UI_KEYBOARD_LETTERS_SYMBOLS.src =
            "TEXTURES/UI/KEYBOARD_LETTERS_SYMBOLS.png";

        // ITEM IMAGES
        const SPRITE_SHEET_HEALTH_POTION = new Image();
        SPRITE_SHEET_HEALTH_POTION.src =
            "https://klupka.github.io/DungeonDash/TEXTURES/ITEMS/ITEM_POTION_HEALTH.PNG";
        const SPRITE_SHEET_GOLD_COIN = new Image();
        SPRITE_SHEET_GOLD_COIN.src = "TEXTURES/ITEMS/ITEM_GOLD_COIN.PNG";

        const ITEM_PLAYER_DAGGER = new Image();
        ITEM_PLAYER_DAGGER.src = "TEXTURES/ITEMS/ITEM_PLAYER_DAGGER.PNG";
        const ITEM_SAW_BLADE = new Image();
        ITEM_SAW_BLADE.src = "TEXTURES/ITEMS/ITEM_SAW_BLADE.PNG";

        // AUDIO FILES
        var sounds = {
            SFX_CAVE_AMBIENCE: new Howl({
                src: ["AUDIO/SFX_CAVE_AMBIENCE.mp3"],
                autoplay: true,
                loop: true,
                volume: 0,
            }),
            SFX_HORROR_AMBIENCE: new Howl({
                src: ["AUDIO/SFX_HORROR_AMBIENCE.mp3"],
                autoplay: true,
                loop: true,
                volume: 0,
            }),
            SFX_JUMP_CHARGE: new Howl({
                src: ["AUDIO/SFX_JUMP_CHARGE.mp3"],
                volume: 0.2,
            }),
            SFX_PLATFORM_BREAK: new Howl({
                src: ["AUDIO/SFX_PLATFORM_BREAK.mp3"],
                volume: 0.8,
            }),
            SFX_LANDING: new Howl({
                src: ["AUDIO/SFX_LANDING.mp3"],
                volume: 1,
            }),
            SFX_GHOST: new Howl({
                src: ["AUDIO/SFX_GHOST.mp3"],
                volume: 1,
            }),
            SFX_GHOST_SPAWN: new Howl({
                src: ["AUDIO/SFX_GHOST_SPAWN.mp3"],
            }),
            SFX_WIND: new Howl({
                src: ["AUDIO/SFX_WIND.mp3"],
            }),
            SFX_STEP: new Howl({
                src: ["AUDIO/SFX_STEP.mp3"],
            }),
            SFX_PLAYER_DEATH: new Howl({
                src: ["AUDIO/SFX_PLAYER_DEATH.mp3"],
            }),
            SFX_PLAYER_HURT: new Howl({
                src: ["AUDIO/SFX_PLAYER_HURT.mp3"],
            }),
            SFX_BAT_HURT: new Howl({
                src: ["AUDIO/SFX_BAT_HURT.mp3"],
            }),
            SFX_HEALTH_POTION: new Howl({
                src: ["AUDIO/SFX_HEALTH_POTION.mp3"],
                volume: 0.7,
            }),
            SFX_JUMP_BOOST: new Howl({
                src: ["AUDIO/SFX_BAT_HURT.mp3"],
            }),
            SFX_COIN_PICKUP: new Howl({
                src: ["AUDIO/SFX_COIN_PICKUP.mp3"],
            }),
            SFX_BAT_WING_FLAP_1: new Howl({
                src: ["AUDIO/SFX_BAT_WING_FLAP_1.mp3"],
            }),
            SFX_BAT_WING_FLAP_2: new Howl({
                src: ["AUDIO/SFX_BAT_WING_FLAP_2.mp3"],
            }),
            SFX_BAT_DEATH: new Howl({
                src: ["AUDIO/SFX_BAT_DEATH.mp3"],
            }),
            SFX_BAT_ALERT: new Howl({
                src: ["AUDIO/SFX_BAT_ALERT.mp3"],
                volume: 0.5,
            }),
            SFX_PLAYER_PROJECTILE: new Howl({
                src: ["AUDIO/SFX_PLAYER_PROJECTILE.mp3"],
            }),
            SFX_SAW_BLADE: new Howl({
                src: ["AUDIO/SFX_SAW_BLADE.wav"],
                loop: true,
                volume: 0,
            }),
            MUSIC_GAME_PLAY: new Howl({
                src: ["AUDIO/MUSIC_ICY_CAVE.wav"],
                loop: true,
                volume: 0.6,
            }),
            MUSIC_DEATH: new Howl({
                src: ["AUDIO/MUSIC_THE_FINAL_FANTASY.wav"],
                autoplay: false,
                loop: true,
                volume: 0.6,
            }),
            MUSIC_TITLE_SCREEN: new Howl({
                src: ["AUDIO/MUSIC_MYSTERIOUS_DUNGEON.wav"],
                loop: true,
                volume: 0.6,
            }),
        };

        // PLATFORM PROPERTIES
        let platforms = [];
        const initialPlatformCount = 30;
        const platformHeight = 20;
        const platformGap = 100;
        const platformGapVariation = 5;
        let adjustedPlatformGap = platformGap;
        const platformSizes = [10, 50, 100];
        const platformSpeeds = [0, 3, 0];
        const platformPickWeights = [0, 8, 2];
        const collapsablePlatform = [true, false];
        const collapsablePlatformWeights = [0.5, 9.5];
        const movingPlatform = [true, false];
        let movingPlatformWeights = [0.5, 9.5];
        const platformHealingPotionSpawn = [true, false];
        const platformHealingPotionSpawnWeights = [0.3, 9.7];
        let healthPotions = [];
        const platformGoldCoinSpawn = [true, false];
        const platformGoldCoinSpawnWeights = [4, 6];
        let goldCoins = [];
        let goldCoinPickupTextObjects = [];

        // PLAYER PROPERTIES (PLAYER FACES RIGHT BY DEFAULT)
        let basePlayerSpeed = 8;
        let playerStart = [];
        let playerScore = 0;
        let playerMaxJumpPower = 50;
        let lastSpeedBeforeIdle = 6;
        let nextFrame = 0;
        const staggerFrames = 5;
        let gameFrame = 0;
        let numOfFrames = 8;
        const playerSprites = {
            idle: {
                frames: 8,
                spriteSheet: SPRITE_SHEET_THIEF,
                width: 31,
                height: 17,
                speed: 5,
                startingFrameX: 0,
                nextFrameX: 17,
                startingY: 0,
            },
            run: {
                frames: 7,
                spriteSheet: SPRITE_SHEET_THIEF,
                width: 31,
                height: 17,
                speed: 5,
                startingFrameX: 0,
                nextFrameX: 17,
                startingY: 32,
            },
            attack: {
                frames: 6,
                spriteSheet: SPRITE_SHEET_THIEF,
                width: 31,
                height: 17,
                speed: 5,
                startingFrameX: 0,
                nextFrameX: 17,
                startingY: 64,
            },
            death: {
                frames: 4,
                spriteSheet: SPRITE_SHEET_THIEF,
                width: 31,
                height: 17,
                speed: 5,
                startingFrameX: 0,
                nextFrameX: 17,
                startingY: 96,
            },
            hurt: {
                frames: 2,
                spriteSheet: SPRITE_SHEET_THIEF,
                width: 31,
                height: 17,
                speed: 5,
                startingFrameX: 0,
                nextFrameX: 17,
                startingY: 128,
            },
        };

        // PROJECTILES PROPERTIES
        let projectiles = [];

        // TRACK TIME
        let startTime = new Date();
        let endTime = new Date();

        // HANDLE PLAYER DEATH
        function death() {
            // AUDIO: STOP ALL
            Object.values(sounds).forEach((sound) => {
                sound.stop();
            });
            // AUDIO: PLAY PLAYER DEATH SFX
            if (!sounds.SFX_PLAYER_DEATH.playing())
                sounds.SFX_PLAYER_DEATH.play();

            // AFTER 1.2s SHOW DEATH SCREEN
            setTimeout(() => {
                showDeathScreen = true;
            }, 1200);
        }

        // GHOST ENTITY PROPERTIES
        let ghostEntities = [];
        let ghostWidth = 32;
        let ghostHeight = 32;

        // BAT ENTITY PROPERTIES
        let batEntities = [];
        let batEntitySpawnRateDefault = 0.05;
        let batEntitySpawnRateArray = [0.05, 9.95];
        let batEntitySpawnRateIncrease = 0.01; // Effects how often the spawn is. Was 0.001
        let spawnBatEntityBoolean = [true, false];
        let playerDistanceTraveledToSpawnBatEntity = 0;
        let batEntityHasSpawned = false;

        // SAW BLADE ENTITY PROPERTIES
        let sawBladeEntities = [];
        let sawBladeEntitySpawnRateArray = [4, 6];
        let spawnSawBladeEntityBoolean = [true, false];
        let verticalDistanceForSpawnReached = false;
        let sawBladeSpawnAttempts = 0;
        let spawnRateIncreased = false;

        // GHOST CLASS: ENEMY THAT KILLS PLAYER ON COLLISION
        class GhostEntity {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = ghostWidth;
                this.height = ghostHeight;
                this.damageValue = 100;
                this.speed = 1;
                this.visible = true;
                this.spriteColumn = 0;
                this.spriteRow = 0;
                this.spriteWidth = 16;
                this.spriteHeight = 16;
                this.gameFrameCounter = 0;
                this.spriteFrameCount = 12;
                this.facingDirectionLeft = true;
            }
            draw(context) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    // DETERMINES SPEED AT WHICH ANIMATION IS PLAYED
                    if (gameFrame % 6 === 0 && !gamePause) {
                        this.gameFrameCounter++;
                        if (this.gameFrameCounter > this.spriteFrameCount) {
                            this.gameFrameCounter = 0;
                        }
                    }

                    // DRAW FACING LEFT
                    if (this.facingDirectionLeft) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        context.drawImage(
                            SPRITE_SHEET_GHOST_ENTITY,
                            this.gameFrameCounter * this.spriteWidth,
                            0,
                            this.spriteWidth,
                            this.spriteHeight,
                            (this.x - this.spriteWidth + 60) * -1,
                            this.y - this.spriteHeight / 2,
                            this.width * 2,
                            this.height * 2
                        );
                        ctx.restore();
                    }
                    // DRAW FACING RIGHT
                    else if (!this.facingDirectionLeft) {
                        context.drawImage(
                            SPRITE_SHEET_GHOST_ENTITY,
                            this.gameFrameCounter * this.spriteWidth,
                            0,
                            this.spriteWidth,
                            this.spriteHeight,
                            this.x - this.spriteWidth / 2 - 5,
                            this.y - this.spriteHeight / 2,
                            this.width * 2,
                            this.height * 2
                        );
                    }
                }
            }
            update(player) {
                if (gamePause === false) {
                    // USING PLAYER'S X/Y, DETERMINE THE NEXT X/Y FOR GHOST TO MOVE TO
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // NORMALIZE DIRECTION
                    const directionX = dx / distance;
                    const directionY = dy / distance;

                    // MOVE TOWARDS PLAYER
                    this.x += directionX * this.speed;
                    this.y += directionY * this.speed;

                    // DETERMINE FACING DIRECTION
                    if (directionX > 0) {
                        this.facingDirectionLeft = false;
                    } else {
                        this.facingDirectionLeft = true;
                    }

                    // IF GHOST ENTITY GOES BELOW CANVAS HEIGHT, DELETE IT
                    if (this.y > canvas.height + 600) {
                        this.visible = false;
                        this.height = 0;
                        this.width = 0;
                        let index = ghostEntities.indexOf(this);
                        ghostEntities.splice(index, 1);
                    }

                    // IF PLAYER COLLIDES WITH GHOST, DEAL DAMAGE TO PLAYER, PLAYER BECOME INVULNERABLE FOR 3s
                    if (checkCollision(player, this) && !player.invulnerable) {
                        player.invulnerable = true;
                        player.healthPoints -= 3;
                        sounds.SFX_PLAYER_HURT.play();
                        setTimeout(() => {
                            player.invulnerable = false;
                        }, 3000);
                    }

                    // IF GHOST EXISTS AND NOT ALREADY PLAYING, PLAY SFX AUDIO
                    if (
                        !sounds.SFX_GHOST.playing() &&
                        ghostEntities.length > 0
                    ) {
                        sounds.SFX_GHOST.play();
                    }
                    // ADJUST SFX AUDIO VOLUME BASED ON PLAYER DISTANCE
                    if (
                        sounds.SFX_GHOST.playing() &&
                        ghostEntities.length > 0
                    ) {
                        if (distance < 300) {
                            sounds.SFX_GHOST.volume(0.5);
                        } else if (distance < 400) {
                            sounds.SFX_GHOST.volume(0.4);
                        } else if (distance < 500) {
                            sounds.SFX_GHOST.volume(0.3);
                        } else if (distance < 600) {
                            sounds.SFX_GHOST.volume(0.2);
                        } else if (distance < 700) {
                            sounds.SFX_GHOST.volume(0.1);
                        } else if (distance > 700) {
                            sounds.SFX_GHOST.volume(0.05);
                        }
                    }
                    // IF NO GHOST, STOP AUDIO
                    if (
                        sounds.SFX_GHOST.playing() &&
                        ghostEntities.length === 0
                    ) {
                        sounds.SFX_GHOST.stop();
                    }
                }
            }
            // SCROLLS GHOST DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(scrollDistance) {
                this.y += Math.abs(scrollDistance);
            }
        }

        // BACKGROUND CLASS: SCROLLS ON VERTICAL PLAYER MOVEMENT
        class Background {
            constructor(x, y, src) {
                this.x = x;
                this.y = y;
                this.image = new Image();
                this.image.src = src;
                this.visible = true;
                this.generateNewBackground = true;
            }
            draw() {
                // IF IMAGES EXISTS AND VISIBLE, DRAW
                if (this.image && this.visible)
                    ctx.drawImage(this.image, this.x, this.y, 500, 500);
            }
            update() {
                // UPDATE DRAW
                this.draw();

                // IF BACKGROUND IS BELOW CANVAS HEIGHT, DELETE IT
                if (this.y > canvas.height) {
                    this.visible = false;
                    backgrounds = backgrounds.slice(1);
                }
                // CREATE NEW BACKGROUND WHEN CURRENT BACKGROUND IS FULLY SHOWN
                if (this.y > 0 && this.generateNewBackground) {
                    // GETS A RANDOM BACKGROUND IMAGE
                    let randomBG = randomNumber(2, 6);
                    backgrounds.push(
                        new Background(
                            0,
                            this.x - this.image.height * 0.7, // was 495
                            `TEXTURES/BACKGROUNDS/BACKGROUND_${randomBG}.png`
                        )
                    );
                    this.generateNewBackground = false;
                }
            }
        }

        // GENERATE RANDOM NUM IN RANGE, DOES NOT INCLUDE MAX
        function randomNumber(min, max) {
            return parseInt(Math.random() * (max - min) + min);
        }

        // COLLISION CHECK BETWEEN TWO OBJECTS
        function checkCollision(obj1, obj2) {
            if (obj1.x >= obj2.x + obj2.width) {
                edge = "right";
                return false;
            } else if (obj1.x + obj1.width <= obj2.x) {
                edge = "left";
                return false;
            } else if (obj1.y >= obj2.y + obj2.height) {
                edge = "bottom";
                return false;
            } else if (obj1.y + obj1.height <= obj2.y) {
                edge = "top";
                return false;
            } else {
                return true;
            }
        }

        // PLATFORM COLLISION HANDLER
        function handleCollision(player, platform) {
            // CALCULATE THE OVERLAP OF PLAYER AND PLATFORM
            let overlapY =
                Math.min(
                    player.y + player.height,
                    platform.y + platform.height
                ) - Math.max(player.y, platform.y);
            overlapY = overlapY.toFixed(13);

            // HANDLES PLAYER JUMP CHARGING SOUND. PITCH DEPENDENT ON JUMP POWER. (JUMP CHARGING DISABLED)
            if (
                player.y < platform.y &&
                player.vy > 0 &&
                player.jumpPower > 0
            ) {
                let pitch = 1;
                if (player.jumpPower <= playerMaxJumpPower / 2.5) {
                    pitch = 0.8;
                } else if (player.jumpPower <= playerMaxJumpPower / 1.5) {
                    pitch = 1;
                } else if (player.jumpPower <= playerMaxJumpPower) {
                    pitch = 1.3;
                }
                sounds.SFX_JUMP_CHARGE.rate(pitch);
                sounds.SFX_JUMP_CHARGE.play();
            }

            // HANDLES SOUND FOR WHEN PLAYER LANDS ON PLATFORMS
            if (
                player.isInAir === true &&
                player.vy > 0 &&
                player.y + player.height - 1 <= platform.y
            ) {
                sounds.SFX_LANDING.stop();
                sounds.SFX_LANDING.play();
                player.isInAir = false;
            }

            // PLAYER PLATFORM COLLISION (ONLY COLLIDES WHEN PLAYER FALLS ONTO PLATFORM)
            if (
                player.y + player.height - 13 < platform.y &&
                player.vy >= 0 &&
                platform.collapsable === false
            ) {
                player.y -= overlapY;
                player.vy = 0;
                let sizeIndex = platformSizes.indexOf(platform.width);

                // MOVE PLAYER WITH MOVING PLATFORMS
                if (platform.moving) {
                    if (platform.startLeft === false)
                        player.speed = platformSpeeds[sizeIndex];

                    if (platform.startLeft === true)
                        player.speed = -platformSpeeds[sizeIndex];
                } else if (platform.moving === false) player.speed = 0;
            }

            // PLAYER COLLISION ON COLLAPSABLE PLATFORMS
            if (
                player.y + player.height - 13 < platform.y &&
                player.vy >= 0 &&
                platform.collapsable === true
            ) {
                platform.visible = false;
                platform.width = 0;
                platform.height = 0;
                sounds.SFX_PLATFORM_BREAK.stop();
                sounds.SFX_PLATFORM_BREAK.play();
            }
        }

        // USER INPUT HANDLER CLASS: MOVEMENT, PAUSE, SHOOT
        class inputHandler {
            constructor() {
                this.keys = [];
                this.isShooting = false;

                // EVENT LISTENER: KEY DOWN
                window.addEventListener("keydown", (e) => {
                    // MOVEMENT KEYS
                    if (
                        (e.key === "ArrowDown" ||
                            e.key === "ArrowUp" ||
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight") &&
                        this.keys.indexOf(e.key) === -1
                    ) {
                        this.keys.push(e.key);
                    }
                    // PAUSE KEY
                    if (
                        (e.key === "p" && !showDeathScreen) ||
                        (e.key === "P" && !showDeathScreen)
                    ) {
                        this.keys.push(e.key);
                    }
                    // SHOOT PROJECTILE KEY
                    if (e.key === "z" || e.key === "Z") {
                        this.isShooting = true;
                    }
                    // SPACE BAR
                    if (
                        (e.key === " " &&
                            showDeathScreen &&
                            this.keys.indexOf(e.key) === -1) ||
                        (e.key === " " &&
                            showTitleScreen &&
                            this.keys.indexOf(e.key) === -1)
                    ) {
                        this.keys.push(e.key);
                    }
                });

                // EVENT LISTENER: KEY UP
                window.addEventListener("keyup", (e) => {
                    // MOVEMENT KEYS
                    if (
                        e.key === "ArrowDown" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowRight"
                    ) {
                        this.keys.splice(this.keys.indexOf(e.key), 1);
                    }
                    // SHOOT PROJECTILE KEY
                    if (e.key === "z" || e.key === "Z") {
                        this.isShooting = false;
                    }
                    // SPACE BAR
                    if (e.key === " ") {
                        this.keys.splice(this.keys.indexOf(e.key), 1);
                    }
                });
            }
        }

        // HEALTH POTION CLASS: GRANTS PLAYER HEART POINTS
        class HealthPotion {
            constructor(x, y) {
                this.width = 32;
                this.height = 32;
                this.x = x - this.width / 2;
                this.y = y - this.height - 10;
                this.healingValue = 1;
                this.visible = true;
                this.spriteColumn = 0;
                this.spriteRow = 0;
                this.spriteWidth = 16;
                this.spriteHeight = 16;
                this.showNextAnimationFrame = true;
            }
            draw(context, nextFrame) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    context.save();
                    context.shadowBlur = 5;
                    context.shadowColor = "#ff2929";
                    context.drawImage(
                        SPRITE_SHEET_HEALTH_POTION,
                        this.spriteColumn * this.spriteWidth,
                        this.spriteRow * this.spriteHeight,
                        this.spriteWidth,
                        this.spriteHeight,
                        this.x,
                        this.y,
                        this.width,
                        this.height
                    );
                    context.restore();
                }

                // HANDLES ORDER IN WHICH ANIMATION IS PLAYED
                if (
                    ((nextFrame === 0 && this.showNextAnimationFrame) ||
                        (nextFrame === 4 && this.showNextAnimationFrame)) &&
                    !gamePause
                ) {
                    this.showNextAnimationFrame = false;
                    // ITERATES THROUGH EACH COLUMN AND ROW OF HEALTH POTION SPRITE SHEET
                    if (this.spriteRow < 2) {
                        if (this.spriteRow === 0 && this.spriteColumn <= 1) {
                            this.spriteColumn += 1;
                        } else if (
                            this.spriteRow === 1 &&
                            this.spriteColumn <= 1
                        ) {
                            this.spriteColumn += 1;
                        } else if (
                            this.spriteRow === 2 &&
                            this.spriteColumn <= 1
                        ) {
                            this.spriteColumn += 1;
                        } else {
                            this.spriteColumn = 0;
                            this.spriteRow += 1;
                        }
                    } else {
                        this.spriteRow = 0;
                        this.spriteColumn = 0;
                    }
                } else if (
                    nextFrame !== 0 &&
                    this.showNextAnimationFrame === false &&
                    nextFrame !== 4 &&
                    this.showNextAnimationFrame === false
                ) {
                    this.showNextAnimationFrame = true;
                }
            }
            update(player) {
                // IF PLAYER COLLIDES, GRANT PLAYER 1 HEART AND DELETE POTION
                if (checkCollision(this, player)) {
                    if (player.healthPoints < 3 && player.healthPoints > 0) {
                        this.visible = false;
                        let healthPotionIndex = healthPotions.indexOf(this);
                        healthPotions.splice(healthPotionIndex, 1);
                        sounds.SFX_HEALTH_POTION.play();
                        player.healthPoints += 1;
                    }
                }
                // IF POTION GOES BELOW THE CANVAS, DELETE IT
                if (this.y >= canvas.height + 10) {
                    this.visible = false;
                    this.height = 0;
                    this.width = 0;
                    let index = healthPotions.indexOf(this);
                    healthPotions.splice(index, 1);
                }
            }
            // SCROLLS POTION DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(scrollDistance) {
                this.y += Math.abs(scrollDistance);
            }
        }

        // GOLD COIN CLASS: GRANTS PLAYER COIN VALUE
        class GoldCoin {
            constructor(x, y) {
                this.width = 32;
                this.height = 32;
                this.x = x - this.width / 2;
                this.y = y - this.height - 10;
                this.coinValue = 1;
                this.visible = true;
                this.spriteColumn = 0;
                this.spriteRow = 0;
                this.spriteWidth = 16;
                this.spriteHeight = 16;
                this.gameFrameCounter = 0;
                this.spriteFrameCount = 5;
            }
            draw(context) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    // DETERMINES SPEED AT WHICH ANIMATION IS PLAYED
                    if (gameFrame % 6 === 0 && !gamePause) {
                        this.gameFrameCounter++;
                        if (this.gameFrameCounter > this.spriteFrameCount) {
                            this.gameFrameCounter = 0;
                        }
                    }
                    context.save();
                    context.scale(1, 1);
                    context.shadowBlur = 5;
                    context.shadowColor = "#EADA78";
                    context.drawImage(
                        SPRITE_SHEET_GOLD_COIN,
                        this.gameFrameCounter * this.spriteWidth,
                        this.spriteRow * this.spriteHeight,
                        this.spriteWidth,
                        this.spriteHeight,
                        this.x,
                        this.y,
                        this.width,
                        this.height
                    );
                    context.restore();
                }
            }
            update(player) {
                // IF PLAYER COLLIDES WITH COIN, DELETE IT
                if (checkCollision(this, player) && player.healthPoints > 0) {
                    goldCoinPickupTextObjects.push(
                        new GoldCoinPickupText(
                            player.x + player.width / 2,
                            player.y - 10,
                            `+${this.coinValue}`
                        )
                    );
                    this.visible = false;
                    this.height = 0;
                    this.width = 0;
                    let goldCoinIndex = goldCoins.indexOf(this);
                    goldCoins.splice(goldCoinIndex, 1);

                    // PLAY SOUND AND CREDIT PLAYER COIN VALUE
                    if (player.goldCoinsCollected % 2 === 0) {
                        sounds.SFX_COIN_PICKUP.rate(1);
                        sounds.SFX_COIN_PICKUP.play();
                    } else {
                        sounds.SFX_COIN_PICKUP.rate(1.1);
                        sounds.SFX_COIN_PICKUP.play();
                    }
                    player.goldCoinsCollected += 1;
                }
                // IF COIN GOES BELOW THE CANVAS, DELETE IT
                if (this.y >= canvas.height + 10) {
                    this.visible = false;
                    this.height = 0;
                    this.width = 0;
                    let goldCoinIndex = goldCoins.indexOf(this);
                    goldCoins.splice(goldCoinIndex, 1);
                }
            }
            // SCROLLS COIN DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(scrollDistance) {
                this.y += Math.abs(scrollDistance);
            }
        }

        // GOLD COIN TEXT: VISUAL FEEDBACK ON PLAYER COIN COLLISION
        class GoldCoinPickupText {
            constructor(x, y, goldCoinValue) {
                this.x = x;
                this.y = y;
                this.fontSize = 30;
                this.goldCoinValue = goldCoinValue;
                this.textAlpha = 1;
                this.gameFrameCounter = 0;
            }
            draw(context) {
                context.save();
                ctx.globalAlpha = this.textAlpha;
                context.shadowBlur = 5;
                context.shadowColor = "#EADA78";
                context.fillStyle = "#B88B32";
                context.font = `${this.fontSize}px ${fontFamily}`;
                context.fillText(this.goldCoinValue, this.x, this.y);
                context.restore();
            }
            update() {
                // IF GAME IS PAUSED, DON'T UPDATE
                if (gamePause === false) {
                    // DECREASES TEXT ALPHA WITH EVERY GAME FRAME
                    if (gameFrame % 2 === 0) {
                        this.gameFrameCounter++;
                        this.textAlpha -= 0.05;
                    }
                    // IF TEXT ALPHA IS 0, DELETE TEXT
                    if (this.textAlpha < 0) {
                        let goldCoinPickupTextIndex =
                            goldCoinPickupTextObjects.indexOf(this);
                        goldCoinPickupTextObjects.splice(
                            goldCoinPickupTextIndex,
                            1
                        );
                    }
                }
            }
            // SCROLLS TEXT DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(scrollDistance) {
                this.y += Math.abs(scrollDistance);
            }
        }

        // PLATFORM CLASS: HANDLES BEHAVIOR OF PLATFORM TYPES
        class Platform {
            constructor(
                x,
                y,
                platformWidth,
                startLeft,
                color,
                collapsable,
                startingPlatform,
                moving,
                hasHealthPotion,
                hasGoldCoin
            ) {
                this.width = platformWidth;
                this.height = platformHeight * 2;
                this.x = x;
                this.y = y;
                this.initialY = y;
                this.visible = true;
                this.startLeft = startLeft;
                this.color = color;
                this.collapsable = collapsable;
                this.startingPlatform = startingPlatform;
                this.moving = moving;
                this.hasHealthPotion = hasHealthPotion;
                this.hasGoldCoin = hasGoldCoin;
            }
            draw(context) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    // DRAWING NON-COLLAPSABLE PLATFORMS
                    if (!this.collapsable) {
                        // MEDIUM PLATFORM
                        if (
                            this.width === platformSizes[1] &&
                            this.moving === false
                        ) {
                            context.drawImage(
                                SPRITE_PLATFORM_MEDIUM,
                                this.x,
                                this.y,
                                this.width,
                                21
                            );
                        }
                        // MEDIUM PLATFORM, MOVING
                        else if (
                            this.width === platformSizes[1] &&
                            this.moving === true
                        ) {
                            context.drawImage(
                                SPRITE_PLATFORM_MEDIUM_MOVING,
                                this.x,
                                this.y,
                                this.width,
                                21
                            );
                        }
                        // LARGE PLATFORM, LEFT
                        else if (
                            this.width === platformSizes[2] &&
                            this.x === 0
                        ) {
                            context.drawImage(
                                SPRITE_PLATFORM_LARGE_LEFT,
                                this.x,
                                this.y,
                                this.width,
                                21
                            );
                        }
                        // LARGE PLATFORM, RIGHT
                        else if (
                            this.width === platformSizes[2] &&
                            this.x === canvas.width - this.width
                        ) {
                            context.drawImage(
                                SPRITE_PLATFORM_LARGE_RIGHT,
                                this.x,
                                this.y,
                                this.width,
                                21
                            );
                        }
                        // LARGE PLATFORM, MIDDLE
                        else if (this.width === platformSizes[2]) {
                            context.drawImage(
                                SPRITE_PLATFORM_LARGE_MIDDLE,
                                this.x,
                                this.y,
                                this.width,
                                21
                            );
                        } else {
                            context.fillStyle = "yellow";
                            context.fillRect(
                                this.x,
                                this.y,
                                this.width,
                                this.height
                            );
                        }
                    }
                    // DRAWING COLLAPSABLE PLATFORMS
                    if (this.collapsable) {
                        // MEDIUM PLATFORM
                        if (this.width === platformSizes[1]) {
                            context.drawImage(
                                SPRITE_PLATFORM_MEDIUM_COLLAPSABLE,
                                this.x,
                                this.y,
                                this.width,
                                21
                            );
                        }
                    }
                }
            }
            update() {
                // IF GAME PAUSED, DON'T UPDATE
                if (gamePause === false) {
                    // IF PLATFORM GOES BELOW CANVAS, DELETE IT
                    if (this.y > canvas.height && this.visible) {
                        this.visible = false;
                        this.height = 0;
                        this.width = 0;
                        let index = platforms.indexOf(this);
                        platforms.splice(index, 1);
                        createPlatform(adjustedPlatformGap);
                    }

                    let sizeIndex = platformSizes.indexOf(this.width);
                    // MEDIUM PLATFORM, MOVING
                    if (this.moving) {
                        // IF MOVING, DETERMINE MOVING DIRECTION
                        if (sizeIndex === 1 || sizeIndex === 0) {
                            // MOVE PLATFORM LEFT
                            if (this.startLeft) {
                                this.x -= platformSpeeds[sizeIndex];

                                if (this.x < 0) {
                                    this.startLeft = false;
                                }
                            }
                            // MOVE PLATFORM RIGHT
                            else if (this.startLeft === false) {
                                this.x += platformSpeeds[sizeIndex];

                                if (this.width + this.x > canvas.width) {
                                    this.startLeft = true;
                                }
                            }
                        }
                    }

                    // LARGE PLATFORM
                    if (this.moving) {
                        if (sizeIndex === 2 && !this.startingPlatform) {
                            if (this.startLeft) {
                                this.x = 0;
                            } else {
                                this.x = canvas.width - this.width;
                            }
                        }
                    }

                    // HANDLE POTION SPAWN
                    if (this.hasHealthPotion) {
                        // SET hasHealthPotion TO FALSE TO AVOID INFINITE SPAWNS ON THE SAME PLATFORM
                        this.hasHealthPotion = false;
                        // CREATE HEALTH POTION AT THIS PLATFORM
                        healthPotions.push(
                            new HealthPotion(this.x + this.width / 2, this.y)
                        );
                    }

                    // HANDLE GOLD COIN SPAWN
                    if (this.hasGoldCoin) {
                        // SET hasGoldCoin TO FALSE TO AVOID INFINITE SPAWNS ON THE SAME PLATFORM
                        this.hasGoldCoin = false;
                        // CREATE GOLD COIN AT THIS PLATFORM
                        goldCoins.push(
                            new GoldCoin(this.x + this.width / 2, this.y)
                        );
                    }
                }
            }
            // SCROLLS PLATFORM DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(scrollDistance) {
                this.y += Math.abs(scrollDistance);
                playerScore += Math.abs(scrollDistance) / 1000; // divided by 200
                backgrounds.forEach((background) => {
                    background.y +=
                        Math.abs(scrollDistance) / backgroundScrollSpeed;
                });
            }
        }

        // PLAYER CLASS: HANDLES PLAYER ANIMATIONS, COLLISION, AND SHOOT PROJECTILES
        class Player {
            constructor(gameWidth, gameHeight) {
                this.gameHeight = gameHeight;
                this.gameWidth = gameWidth;
                this.height = 50;
                this.width = 35;
                this.x = 0;
                this.y = 0;
                this.speed = 0;
                this.vy = 0;
                this.gravity = 0.4;
                this.jumpPower = 0; // 0
                this.startPositionSet = false;
                this.projectileShootDelay = 0;
                this.isInAir = false;
                this.animState = "idle";
                this.healthPoints = 3;
                this.invulnerable = false;
                this.maxDeathFrame = false;
                this.alive = true;
                this.controlsLocked = false;
                this.goldCoinsCollected = 0;
                this.jumpCount = 0; // EXPERIMENTAL DOUBLE JUMP
            }
            // START POSITION DETERMINED BY THE FIRST PLATFORM
            setStartPosition(playerStart) {
                if (this.startPositionSet === false) {
                    this.startPositionSet = true;
                    this.x = playerStart[0];
                    this.y = playerStart[1];
                }
            }

            draw(context, nextFrame, frame) {
                // IF GAME PAUSED, DO NOT UPDATE FRAME
                if (gamePause === false) {
                    frame = nextFrame * 48;
                } else frame = 0;

                // DRAWING PLAYER SPRITE ANIMATIONS
                ctx.save();
                ctx.scale(1, 1);
                // IF PLAYER DIES, DRAW DEATH ANIMATION (HIGHEST PRIORITY)
                if (this.animState === "death" && this.alive === false) {
                    ctx.scale(1, 1);
                    this.controlsLocked = true;
                    if (nextFrame >= 2 || frame > 144) {
                        this.maxDeathFrame = true;
                    }
                    // PREVENTS ANIMATION FROM REPLAYING (MAX: 3 FRAMES)
                    if (this.maxDeathFrame) {
                        frame = 3 * 48;
                    }
                    context.drawImage(
                        playerSprites.idle.spriteSheet,
                        frame,
                        97,
                        playerSprites.idle.width,
                        playerSprites.idle.height,
                        this.x,
                        this.y,
                        playerSprites.idle.width * 3,
                        playerSprites.idle.height * 3
                    );
                }
                // EVERY 15 GAME FRAMES, IF GREATER THAN HALF, THEN DRAW NOTHING, ELSE DRAW PLAYER
                else if (this.invulnerable && gameFrame % 15 >= 7.5) {
                    // IF THE PLAYER TAKES DAMAGE, INTERMITTENTLY DRAW NOTHING FOR A FLICKER EFFECT
                }
                // DEPENDING ON THE animState, DRAW CORRECT ANIMATION
                else {
                    switch (this.animState) {
                        case "idleRight":
                            ctx.scale(1, 1);
                            numOfFrames = 6;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                frame,
                                0,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                this.x - playerSprites.idle.width + 2,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "idleLeft":
                            ctx.scale(-1, 1);
                            numOfFrames = 6;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                frame,
                                0,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                (this.x - playerSprites.idle.width + 95) * -1,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "runningRight":
                            ctx.scale(1, 1);
                            numOfFrames = 5;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                frame,
                                playerSprites.idle.height + 15,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                this.x - playerSprites.idle.width + 2,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "runningLeft":
                            ctx.scale(-1, 1);
                            numOfFrames = 5;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                frame,
                                playerSprites.idle.height + 15,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                (this.x - playerSprites.idle.width + 95) * -1,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "jumpingRight":
                            ctx.scale(1, 1);
                            numOfFrames = 1;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                0,
                                playerSprites.idle.height + 15,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                this.x - playerSprites.idle.width + 2,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "jumpingLeft":
                            ctx.scale(-1, 1);
                            numOfFrames = 1;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                0,
                                playerSprites.idle.height + 15,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                (this.x - playerSprites.idle.width + 95) * -1,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "fallingRight":
                            ctx.scale(1, 1);
                            numOfFrames = 1;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                0,
                                playerSprites.idle.height + 15,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                this.x - playerSprites.idle.width + 2,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "fallingLeft":
                            ctx.scale(-1, 1);
                            numOfFrames = 1;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                0,
                                playerSprites.idle.height + 15,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                (this.x - playerSprites.idle.width + 95) * -1,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "poweringJumpRight":
                            ctx.scale(1, 1);
                            numOfFrames = 1;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                (playerSprites.idle.width + 17) * 5,
                                0,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                this.x - playerSprites.idle.width + 2,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "poweringJumpLeft":
                            ctx.scale(-1, 1);
                            numOfFrames = 1;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                (playerSprites.idle.width + 17) * 5,
                                0,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                (this.x - playerSprites.idle.width + 95) * -1,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                        case "attacking":
                            break;
                        default:
                            ctx.scale(1, 1);
                            numOfFrames = 6;
                            context.drawImage(
                                playerSprites.idle.spriteSheet,
                                frame,
                                0,
                                playerSprites.idle.width,
                                playerSprites.idle.height,
                                this.x - playerSprites.idle.width + 2,
                                this.y - 1,
                                playerSprites.idle.width * 3,
                                playerSprites.idle.height * 3
                            );
                            break;
                    }
                }
                ctx.restore();
            }

            // GETS CURRENT animState VALUE TO COMPARE NEXT
            get animState() {
                return this._animState;
            }
            set animState(newState) {
                // CHECK IF animState IS DIFFERENT FROM THE CURRENT VALUE
                if (newState !== this._animState) {
                    this._animState = newState;
                    // RESET nextFrame WHEN animState CHANGES
                    nextFrame = 0;
                }
            }
            update(input, platforms, basePlayerSpeed) {
                // IF GAME IS NOT PAUSED, UPDATE PLAYER
                if (gamePause === false) {
                    // HANDLE SPEEDS FOR KEY PRESS
                    if (
                        input.keys.indexOf("ArrowRight") > -1 &&
                        !this.controlsLocked
                    ) {
                        this.speed = basePlayerSpeed;
                        lastSpeedBeforeIdle = basePlayerSpeed;
                    }
                    if (
                        input.keys.indexOf("ArrowLeft") > -1 &&
                        !this.controlsLocked
                    ) {
                        this.speed = -basePlayerSpeed;
                        lastSpeedBeforeIdle = -basePlayerSpeed;
                    }

                    // PROJECTILES
                    this.handleProjectiles(input);

                    // POWER JUMPING - DISABLED
                    //this.handlePowerJump(input);

                    // STATIC JUMPING - IMPLEMENTED
                    this.handleNormalJump(input);

                    // IF NO MOVEMENT KEYS PRESSED, THEN SET PLAYER SPEED TO 0
                    if (
                        input.keys.indexOf("ArrowLeft") === -1 &&
                        input.keys.indexOf("ArrowRight") === -1 &&
                        !this.onPlatform()
                    ) {
                        this.speed = 0;
                    }

                    // SET PLAYER isInAir = True WHEN NOT ON PLATFORMS
                    if (!this.onPlatform() && (this.vy > 0.8 || this.vy < 0)) {
                        this.isInAir = true;
                    }

                    // HORIZONTAL MOVEMENT SPEED
                    this.x += this.speed;

                    // MOVEMENT BOUNDARIES
                    if (this.x + this.width < 0)
                        this.x = canvas.width - this.width;
                    // ALLOWS PLAYER TO APPEAR ON OPPOSITE SIDE OF SCREEN WHEN MOVING OFF ONE SIDE
                    else if (this.x > canvas.width) this.x = 0;

                    // VERTICAL MOVEMENT WITH GRAVITY
                    this.y += this.vy;
                    if (!this.onGround() || !this.onPlatform()) {
                        // CAP OUT FALLING SPEED
                        if (this.vy <= 15) {
                            this.vy += this.gravity;
                        }
                    } else {
                        this.vy = 0;
                    }

                    // FOR EACH PLATFORM, DETECT PLAYER COLLISION AND HANDLE IT ACCORDINGLY
                    platforms.forEach((platform) => {
                        if (checkCollision(this, platform)) {
                            handleCollision(player, platform);
                        }
                    });

                    // IF PLAYER FALLS BELOW CANVAS BOTTOM, SET HEALTH TO 0 (PLAYER DEATH)
                    if (this.y + this.height > canvas.height) {
                        this.healthPoints = 0;
                    }

                    // GHOST SPAWN
                    this.handleGhostSpawn();

                    // ANIMATION STATES
                    this.handleAnimState();

                    // WIND SFX
                    this.handleWindSFX();
                }
            }
            handleWindSFX() {
                // PLAY WIND SFX IF PLAYER IS IN AIR AND SFX NOT ALREADY PLAYING
                if (this.isInAir && !sounds.SFX_WIND.playing()) {
                    sounds.SFX_WIND.play();
                }
                // IF PLAYER NOT IN AIR, STOP WIND SFX
                if (this.isInAir === false) {
                    sounds.SFX_WIND.stop();
                }
                // DYNAMICALLY ADJUST THE WIND SFX VOLUME BASED ON PLAYER VELOCITY
                if (sounds.SFX_WIND.playing()) {
                    let isNegative = true;
                    if (this.vy > 0) {
                        isNegative = false;
                    }
                    var absVy = Math.abs(this.vy);
                    // THRESHOLD
                    var threshold = 0.01;
                    // CHECK IF |this.vy| IS CLOSE TO ZERO
                    if (absVy < threshold) {
                        // IF IT IS CLOSE TO ZERO, SET VOLUME LOWER
                        sounds.SFX_WIND.volume(0);
                    } else {
                        if (isNegative) sounds.SFX_WIND.volume(absVy / 40);
                        else sounds.SFX_WIND.volume(absVy / 200);
                    }
                }
            }
            handleNormalJump(input) {
                // IF UP ARROW PRESSED, PLAYER NOT IN AIR, CONTROLS ARE UNLOCKED, THEN ADJUST VERTICAL VELOCITY
                if (
                    input.keys.indexOf("ArrowUp") > -1 &&
                    this.isInAir === false &&
                    !this.controlsLocked
                ) {
                    this.vy -= 18;
                }

                // EXPERIMENTAL DOUBLE JUMP
                // if (
                //     input.keys.indexOf("ArrowUp") > -1 &&
                //     !this.controlsLocked &&
                //     this.jumpCount < 2
                // ) {
                //     let index = input.keys.indexOf("ArrowUp");
                //     input.keys.splice(index, 1);
                //     this.vy -= 13;
                //     this.jumpCount++;
                // }
                // if (this.onPlatform() === true) {
                //     this.jumpCount = 0;
                // }
            }
            // DISABLED
            handlePowerJump(input) {
                // IF ON PLATFORM AND KEYUP ArrowUp, JUMP AND RESET JUMP POWER
                if (
                    input.keys.indexOf("ArrowUp") &&
                    this.isInAir === false &&
                    !this.controlsLocked
                ) {
                    // EXPERIMENTAL MINIMUM JUMP POWER SO YOU CAN CHARGE JUMP AND NORM JUMP
                    // if (this.jumpPower > 0 && this.jumpPower <= 10) {
                    //     this.jumpPower = 15;
                    // } else if (this.jumpPower > 10) {
                    //     this.jumpPower += 15;
                    // }

                    // NO MINIMUM POWER JUMP
                    this.vy -= this.jumpPower;

                    this.jumpPower = 0;
                }

                // IF HOLDING ArrowUp ON A PLATFORM AND NOT MOVING LEFT/RIGHT, INCREMENT JUMP POWER
                if (
                    input.keys.indexOf("ArrowUp") > -1 &&
                    this.isInAir === false &&
                    !this.controlsLocked
                ) {
                    if (this.jumpPower < playerMaxJumpPower)
                        this.jumpPower += 0.5;
                }

                // IF MOVING LEFT/RIGHT, RESET JUMP POWER
                if (
                    input.keys.indexOf("ArrowLeft") > -1 ||
                    input.keys.indexOf("ArrowRight") > -1
                ) {
                    this.jumpPower = 0;
                }
            }
            handleAnimState() {
                // IF PLAYER IS ALIVE, SET VARIOUS ANIMATIONS
                if (this.healthPoints > 0 && this.alive) {
                    // CROUCHING ANIMATION FOR WHEN CHARGING JUMP - FACING RIGHT
                    if (
                        (this.jumpPower > 0 &&
                            input.keys.indexOf("ArrowRight") > -1) ||
                        (this.jumpPower > 0 && lastSpeedBeforeIdle > 0)
                    ) {
                        this.animState = "poweringJumpRight";
                    }
                    // CROUCHING ANIMATION FOR WHEN CHARGING JUMP - FACING RIGHT
                    else if (
                        (this.jumpPower > 0 &&
                            input.keys.indexOf("ArrowLeft") > -1) ||
                        (this.jumpPower > 0 && lastSpeedBeforeIdle < 0)
                    ) {
                        this.animState = "poweringJumpLeft";
                    }
                    // RUNNING ANIMATION - FACING RIGHT
                    else if (
                        input.keys.indexOf("ArrowRight") > -1 &&
                        this.onPlatform() &&
                        this.vy < 0.5
                    ) {
                        this.animState = "runningRight";
                    }
                    // RUNNING ANIMATION - FACING LEFT
                    else if (
                        input.keys.indexOf("ArrowLeft") > -1 &&
                        this.onPlatform() &&
                        this.vy < 0.5
                    ) {
                        this.animState = "runningLeft";
                    }
                    // FALLING ANIMATION - FACING RIGHT
                    else if (
                        (this.vy > 0.5 &&
                            input.keys.indexOf("ArrowRight") > -1) ||
                        (this.vy > 0.5 && lastSpeedBeforeIdle > 0)
                    ) {
                        this.animState = "fallingRight";
                    }
                    // FALLING ANIMATION - FACING LEFT
                    else if (
                        (this.vy > 0.5 &&
                            input.keys.indexOf("ArrowLeft") > -1) ||
                        (this.vy > 0.5 && lastSpeedBeforeIdle < 0)
                    ) {
                        this.animState = "fallingLeft";
                    }
                    // JUMPING ANIMATION - FACING RIGHT
                    else if (
                        (this.vy < 0 &&
                            input.keys.indexOf("ArrowRight") > -1) ||
                        (this.vy < 0 && lastSpeedBeforeIdle > 0)
                    ) {
                        this.animState = "jumpingRight";
                    }
                    // JUMPING ANIMATION - FACING LEFT
                    else if (
                        (this.vy < 0 && input.keys.indexOf("ArrowLeft") > -1) ||
                        (this.vy < 0 && lastSpeedBeforeIdle < 0)
                    ) {
                        this.animState = "jumpingLeft";
                    }
                    // IDLE ANIMATION - FACING LEFT
                    else if (
                        (!this.isInAir &&
                            this.speed === 0 &&
                            lastSpeedBeforeIdle < 0) ||
                        (!this.isInAir &&
                            this.onPlatform() &&
                            lastSpeedBeforeIdle < 0)
                    ) {
                        this.animState = "idleLeft";
                    }
                    // IDLE ANIMATION - FACING RIGHT
                    else if (
                        (!this.isInAir &&
                            this.speed === 0 &&
                            lastSpeedBeforeIdle > 0) ||
                        (!this.isInAir &&
                            this.onPlatform() &&
                            lastSpeedBeforeIdle > 0)
                    ) {
                        this.animState = "idleRight";
                    }
                    // IF PLAYER IS NOT ALIVE, SET DEATH ANIMATION
                } else if (this.healthPoints <= 0 && this.alive) {
                    this.alive = false;
                    this.vy -= 5;
                    this.x -= 8;
                    this.animState = "death";
                    death();
                }
            }
            handleProjectiles(input) {
                // CREATES PROJECTILES WHEN 'Z' KEY IS PRESSED, HOLDING THE KEY WILL INVOKE A DELAY
                if (input.isShooting && this.projectileShootDelay === 0) {
                    let element = projectiles.length;
                    projectiles.push(
                        new Projectile(
                            player.x + player.width / 2,
                            player.y,
                            element
                        )
                    );
                    sounds.SFX_PLAYER_PROJECTILE.play();
                    this.projectileShootDelay = 20;
                }
                if (!input.isShooting) this.projectileShootDelay = 0;
                else {
                    this.projectileShootDelay--;
                }
            }
            handleGhostSpawn() {
                // AFTER SOME TIME OF NO VERTICAL PLAYER MOVEMENT CHANGES, SPAWN GHOST

                // AN endTime AND startTime IS DEFINED
                if (this.onPlatform()) {
                    endTime = new Date();
                } else if (!this.onPlatform()) {
                    startTime = new Date();
                }

                // IF THE DIFFERENT BETWEEN THE START AND END IS GREATER THAN 3 SECONDS, CREATE NEW GHOST
                if (endTime.getSeconds() - startTime.getSeconds() >= 3) {
                    let randomBinaryNumber = randomNumber(0, 2);
                    let randomXSpawn = 0;
                    let randomYSpawn = randomNumber(
                        canvas.height / 2,
                        canvas.height
                    );

                    // DETERMINES A RANDOM CANVAS SIDE FOR THE GHOST TO SPAWN
                    if (randomBinaryNumber === 0) {
                        randomXSpawn = 0 - ghostWidth;
                    }
                    if (randomBinaryNumber === 1) {
                        randomXSpawn = canvas.width;
                    }

                    // CREATE NEW GHOST ENTITY
                    ghostEntities.push(
                        new GhostEntity(randomXSpawn, randomYSpawn)
                    );

                    // PLAY GHOST SFX ON CREATION
                    sounds.SFX_GHOST_SPAWN.stop();
                    sounds.SFX_GHOST_SPAWN.play();
                    startTime = new Date();
                    endTime = new Date();
                }
            }
            onGround() {
                // RETURNS TRUE IF PLAYER IS ABOVE CANVAS BOTTOM
                return this.y >= this.gameHeight - this.height;
            }
            onPlatform() {
                // RETURNS TRUE IF PLAYER IS ON ANY PLATFORM
                let isOnPlatform = false;
                platforms.forEach((platform) => {
                    if (
                        this.y + this.height >= platform.y &&
                        this.vy >= 0 &&
                        this.vy <= 0.8
                    ) {
                        isOnPlatform = true;
                    }
                });
                return isOnPlatform;
            }
        }

        // PLAYER HEARTS UI CLASS: DISPLAYS PLAYER HEALTH UI (HEART COUNT)
        class PlayerHeartsUI {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.healthPoints = 0;
                this.padding = 2;
            }
            draw(context) {
                ctx.save();
                ctx.scale(3.1 * zoomScale, 3.1 * zoomScale);
                // FOR EACH HEALTH VALUE (0/1/2/3), DISPLAY THE CORRECT UI
                switch (this.healthPoints) {
                    // 0 HEALTH POINTS
                    case 0: {
                        context.drawImage(
                            PLAYER_UI_HEARTS_ZERO,
                            this.x + this.padding,
                            this.y + this.padding
                        );
                        break;
                    }
                    // 1 HEALTH POINT
                    case 1: {
                        context.drawImage(
                            PLAYER_UI_HEARTS_ONE,
                            this.x + this.padding,
                            this.y + this.padding
                        );
                        break;
                    }
                    // 2 HEALTH POINTS
                    case 2: {
                        context.drawImage(
                            PLAYER_UI_HEARTS_TWO,
                            this.x + this.padding,
                            this.y + this.padding
                        );
                        break;
                    }
                    // 3 HEALTH POINTS
                    case 3: {
                        context.drawImage(
                            PLAYER_UI_HEARTS_THREE,
                            this.x + this.padding,
                            this.y + this.padding
                        );
                        break;
                    }
                }
                ctx.restore();
            }
            update(player, context) {
                // GET HEALTH POINTS VALUE FROM PLAYER AND DRAW
                this.healthPoints = player.healthPoints;
                this.draw(context);
            }
        }

        // SCORE COUNTER CLASS: DISPLAYS PLAYER VERTICAL DISTANCE SCORE
        class ScoreCounter {
            constructor(scoreValue) {
                this.fontSize = 30;
                this.x = canvas.width;
                this.y = this.fontSize;
                this.padding = 10;
                this.scoreValue = scoreValue;
                this.textMove = 0;
            }
            draw(context) {
                // ICON AND TEXT STYLING
                context.shadowBlur = 5;
                context.fillStyle = "#4df041";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 6;
                context.font = `${this.fontSize}px ${fontFamily}`;

                // DRAW ICON AND TEXT
                context.fillText(
                    this.scoreValue,
                    this.x - this.padding - 10,
                    this.y + this.padding + 12
                );
                context.drawImage(
                    UI_ICONS_ARROW_UP,
                    0,
                    0,
                    16,
                    16,
                    this.x - this.padding - 50,
                    this.y - 5,
                    32,
                    32
                );
            }
            update(playerScore) {
                // GET SCORE VALUE FROM PLAYER
                this.scoreValue = playerScore;

                // MEASURE TEXT WIDTH DYNAMICALLY AND UPDATE TEXT POSITION (TEXT ALIGNED TO RIGHT OF CANVAS)
                let scoreTextWidth = ctx.measureText(
                    this.scoreValue
                ).actualBoundingBoxRight;
                this.x = canvas.width - scoreTextWidth;
            }
        }

        // GOLD COIN COUNTER CLASS: DISPLAYS PLAYER GOLD COIN COUNT
        class GoldCoinCounter {
            constructor(coinCount) {
                this.fontSize = 30;
                this.x = 0;
                this.y = 0;
                this.padding = 10;
                this.coinCount = coinCount;
                this.textMove = 0;
            }
            draw(context) {
                // ICON AND TEXT STYLING
                context.save();
                context.shadowBlur = 5;
                context.fillStyle = "#FFEE83";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 6;
                context.font = `${this.fontSize}px ${fontFamily}`;

                // DRAW ICON AND TEXT
                context.fillText(
                    this.coinCount,
                    this.x - this.padding - 100,
                    this.y + this.padding + 12
                );
                context.drawImage(
                    SPRITE_SHEET_GOLD_COIN,
                    0,
                    0,
                    16,
                    16,
                    this.x - this.padding - 140,
                    this.y - 5,
                    32,
                    32
                );
                context.restore();
            }
            update(playerGoldCoinsCollected, scoreCounterX, scoreCounterY) {
                // GET COIN COUNT FROM PLAYER AND UPDATE TEXT/ICON POSITION
                this.coinCount = playerGoldCoinsCollected;
                this.x = scoreCounterX;
                this.y = scoreCounterY;
            }
        }

        // PROJECTILE CLASS: PROJECTILE (DAGGER SPRITE) EXPELLED FROM PLAYER THAT DAMAGES ENEMY BAT ENTITIES
        class Projectile {
            constructor(x, y, element) {
                this.x = x;
                this.y = y;
                this.vy = -10;
                this.width = 16;
                this.height = 16;
                this.visible = true;
                this.damageValue = 1;
                this.element = element;
            }
            draw(context) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    context.drawImage(
                        ITEM_PLAYER_DAGGER,
                        0,
                        0,
                        16,
                        16,
                        this.x - this.width / 2 - 16,
                        this.y - this.height / 2 - 16,
                        this.width * 4,
                        this.height * 4
                    );
                }
            }
            update() {
                // IF GAME IS NOT PAUSED, UPDATE
                if (gamePause === false) {
                    // MOVES VERTICALLY AT A FIXED SPEED (DEFINED IN CONSTRUCTOR)
                    this.y += this.vy;

                    // IF PROJECTILE GOES BEYOND THE TOP OF THE CANVAS, DELETE IT
                    if (this.y + this.height < 0) {
                        let index = projectiles.indexOf(this);
                        projectiles.splice(index, 1);
                    }

                    // IF PROJECTILE COLLIDES WITH BAT, DELETE PROJECTILE AND DAMAGE BAT
                    batEntities.forEach((batEntity) => {
                        if (checkCollision(this, batEntity)) {
                            batEntity.healthPoints -= 1;
                            if (batEntity.healthPoints === 0) {
                                batEntity.visible = false;
                                batEntity.height = 0;
                                batEntity.width = 0;
                                let batIndex = batEntities.indexOf(batEntity);
                                batEntities.splice(batIndex, 1);
                            }

                            this.visible = false;
                            this.height = 0;
                            this.width = 0;
                            let projectileIndex = projectiles.indexOf(this);
                            projectiles.splice(projectileIndex, 1);

                            // PLAY BAT SFX BASED ON HEALTH REMAINING
                            if (batEntity.healthPoints <= 0) {
                                sounds.SFX_BAT_DEATH.play();
                            } else if (batEntity.healthPoints === 1) {
                                sounds.SFX_BAT_HURT.rate(1.3);
                                sounds.SFX_BAT_HURT.play();
                            } else if (batEntity.healthPoints === 2) {
                                sounds.SFX_BAT_HURT.rate(1);
                                sounds.SFX_BAT_HURT.play();
                            }
                        }
                    });
                }
            }
        }

        // BAT ENTITY CLASS: RANDOMLY SPAWNING ENEMY THAT ATTACKS BY CHARGING PLAYER
        class BatEntity {
            constructor(x, y, spawnLeftSide) {
                this.x = x;
                this.y = y;
                this.width = 34;
                this.height = 34;
                this.visible = true;
                this.state = "patrolling";
                this.isInRangeOfPlayer = false;
                this.spawnLeftSide = spawnLeftSide;
                this.chargeSpeed = 15;
                this.patrolSpeed = 2;
                this.attackCoordinates = [0, 0];
                this.healthPoints = 3;
                this.spriteColumn = 0;
                this.spriteRow = 0;
                this.spriteWidth = 17;
                this.spriteHeight = 17;
                this.gameFrameCounter = 0;
                this.spriteFrameCount = 3;
                this.facingDirectionLeft = true;
                this.frameLoopCount = 0;
            }
            draw(context) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    // DETERMINES SPEED AT WHICH ANIMATION IS PLAYED
                    if (gameFrame % 8 === 0 && !gamePause) {
                        this.gameFrameCounter++;
                        if (this.gameFrameCounter > this.spriteFrameCount) {
                            this.gameFrameCounter = 0;
                            this.frameLoopCount++;
                        }
                    }

                    // PLAY ALTERNATING BAT WING FLAP SFX
                    if (this.gameFrameCounter === 0) {
                        switch (this.frameLoopCount % 2) {
                            case 0:
                                sounds.SFX_BAT_WING_FLAP_1.stop();
                                sounds.SFX_BAT_WING_FLAP_1.play();
                                break;
                            default:
                                sounds.SFX_BAT_WING_FLAP_2.stop();
                                sounds.SFX_BAT_WING_FLAP_2.play();
                                break;
                        }
                    }

                    // HANDLES BAT ANIMATION STATES FOR VARIOUS CONDITIONS
                    switch (this.state) {
                        // PATROLLING - MOVING SIDE TO SIDE, UNPROVOKED BY PLAYER
                        case "patrolling": {
                            // PATROLLING - MOVING LEFT
                            if (this.facingDirectionLeft) {
                                context.save();
                                context.scale(-1, 1);
                                context.drawImage(
                                    SPRITE_SHEET_BAT_ENTITY,
                                    this.gameFrameCounter * this.spriteWidth,
                                    this.spriteRow * this.spriteHeight,
                                    this.spriteWidth,
                                    this.spriteHeight,
                                    (this.x - this.spriteWidth + 60) * -1,
                                    this.y - this.spriteHeight / 2,
                                    this.width + this.spriteWidth,
                                    this.height + this.spriteHeight
                                );
                                context.restore();
                            }
                            // PATROLLING - MOVING RIGHT
                            else if (!this.facingDirectionLeft) {
                                context.save();
                                context.scale(1, 1);
                                context.drawImage(
                                    SPRITE_SHEET_BAT_ENTITY,
                                    this.gameFrameCounter * this.spriteWidth,
                                    this.spriteRow * this.spriteHeight,
                                    this.spriteWidth,
                                    this.spriteHeight,
                                    this.x - this.spriteWidth / 2,
                                    this.y - this.spriteHeight / 2,
                                    this.width + this.spriteWidth,
                                    this.height + this.spriteHeight
                                );
                                context.restore();
                            }
                            break;
                        }
                        // CHARGING - MOMENTARILY FIXED IN PLACE, PROVOKED BY PLAYER
                        case "charging": {
                            // CHARGING - MOVING LEFT
                            if (this.facingDirectionLeft) {
                                context.save();
                                context.scale(1, 1);
                                context.shadowBlur = 10;
                                context.shadowColor = "#ff61da";
                                context.drawImage(
                                    SPRITE_SHEET_BAT_ENTITY,
                                    this.gameFrameCounter * this.spriteWidth,
                                    this.spriteRow * this.spriteHeight,
                                    this.spriteWidth,
                                    this.spriteHeight,
                                    this.x - this.spriteWidth / 2,
                                    this.y - this.spriteHeight / 2,
                                    this.width + this.spriteWidth,
                                    this.height + this.spriteHeight
                                );
                                context.restore();
                            }
                            // CHARGING - MOVING RIGHT
                            else if (!this.facingDirectionLeft) {
                                context.save();
                                context.scale(-1, 1);
                                context.shadowBlur = 10;
                                context.shadowColor = "#ff61da";
                                context.drawImage(
                                    SPRITE_SHEET_BAT_ENTITY,
                                    this.gameFrameCounter * this.spriteWidth,
                                    this.spriteRow * this.spriteHeight,
                                    this.spriteWidth,
                                    this.spriteHeight,
                                    (this.x - this.spriteWidth + 60) * -1,
                                    this.y - this.spriteHeight / 2,
                                    this.width + this.spriteWidth,
                                    this.height + this.spriteHeight
                                );
                                context.restore();
                            }
                            break;
                        }
                        // DEFAULT - FOR ANY OTHER CONDITION NOT COVERED
                        default: {
                            // DEFAULT - MOVING LEFT
                            if (this.facingDirectionLeft) {
                                context.save();
                                context.scale(-1, 1);
                                context.shadowBlur = 10;
                                context.shadowColor = "#ff61da";
                                context.drawImage(
                                    SPRITE_SHEET_BAT_ENTITY,
                                    this.gameFrameCounter * this.spriteWidth,
                                    this.spriteRow * this.spriteHeight,
                                    this.spriteWidth,
                                    this.spriteHeight,
                                    (this.x - this.spriteWidth + 60) * -1,
                                    this.y - this.spriteHeight / 2,
                                    this.width + this.spriteWidth,
                                    this.height + this.spriteHeight
                                );
                                context.restore();
                            }
                            // DEFAULT - MOVING RIGHT
                            else if (!this.facingDirectionLeft) {
                                context.save();
                                context.scale(1, 1);
                                context.shadowBlur = 10;
                                context.shadowColor = "#ff61da";
                                context.drawImage(
                                    SPRITE_SHEET_BAT_ENTITY,
                                    this.gameFrameCounter * this.spriteWidth,
                                    this.spriteRow * this.spriteHeight,
                                    this.spriteWidth,
                                    this.spriteHeight,
                                    this.x - this.spriteWidth / 2,
                                    this.y - this.spriteHeight / 2,
                                    this.width + this.spriteWidth,
                                    this.height + this.spriteHeight
                                );
                                context.restore();
                            }
                            break;
                        }
                    }
                }
            }
            update(player) {
                // IF GAME IS NOT PAUSED, UPDATE
                if (gamePause === false) {
                    // PLAYS BAT WING FLAP SFX AT DIFFERENT VOLUMES BASED ON DISTANCE
                    // (CLOSER: LOUDER / FARTHER: QUIETER)
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        sounds.SFX_BAT_WING_FLAP_1.volume(0.5);
                        sounds.SFX_BAT_WING_FLAP_2.volume(0.5);
                    } else if (distance < 200) {
                        sounds.SFX_BAT_WING_FLAP_1.volume(0.4);
                        sounds.SFX_BAT_WING_FLAP_2.volume(0.4);
                    } else if (distance < 300) {
                        sounds.SFX_BAT_WING_FLAP_1.volume(0.3);
                        sounds.SFX_BAT_WING_FLAP_2.volume(0.3);
                    } else if (distance < 400) {
                        sounds.SFX_BAT_WING_FLAP_1.volume(0.2);
                        sounds.SFX_BAT_WING_FLAP_2.volume(0.2);
                    } else if (distance < 500) {
                        sounds.SFX_BAT_WING_FLAP_1.volume(0.1);
                        sounds.SFX_BAT_WING_FLAP_2.volume(0.1);
                    } else if (distance > 600) {
                        sounds.SFX_BAT_WING_FLAP_1.volume(0.05);
                        sounds.SFX_BAT_WING_FLAP_2.volume(0.05);
                    }

                    // UPDATE X/Y FOR A DEFAULT MOVE LEFT/RIGHT SEQUENCE
                    // PATROLLING - MOVING SIDE TO SIDE, UNPROVOKED BY PLAYER
                    if (this.state === "patrolling") {
                        let padding = 15;
                        if (this.x + this.width + padding >= canvas.width)
                            this.spawnLeftSide = false;
                        else if (this.x - padding <= 0)
                            this.spawnLeftSide = true;

                        if (this.spawnLeftSide) {
                            this.x += this.patrolSpeed;
                            this.facingDirectionLeft = false;
                        } else if (!this.spawnLeftSide) {
                            this.x -= this.patrolSpeed;
                            this.facingDirectionLeft = true;
                        }
                    }

                    // IF PLAYER IS IN RANGE, SAVE PLAYER X/Y, PAUSE FOR SOME TIME THEN CHARGE AT SAVED X/Y
                    // CHARGING - MOMENTARILY FIXED IN PLACE, PROVOKED BY PLAYER
                    // ATTACK - QUICKLY MOVE TOWARD SAVED PLAYER COORDINATES
                    if (this.isInRangeOfPlayer === false) {
                        let distanceFromPlayer = Math.sqrt(
                            Math.pow(this.x - player.x, 2) +
                                Math.pow(this.y - player.y, 2)
                        );
                        // 500 - DISTANCE AT WHICH BAT IS PROVOKED BY PLAYER
                        if (distanceFromPlayer <= 500) {
                            sounds.SFX_BAT_ALERT.play();
                            this.attackCoordinates = [
                                player.x + player.width / 2,
                                player.y + player.height / 2,
                            ];
                            this.state = "charging";
                            this.isInRangeOfPlayer = true;

                            if (player.x > this.x) {
                                this.facingDirectionLeft = false;
                            } else if (player.x < this.x) {
                                this.facingDirectionLeft = true;
                            }
                            // CHARGE FOR 1 SECOND
                            setTimeout(() => {
                                this.state = "attack";
                            }, 1000);
                        }
                    }

                    // DETERMINE WHAT HAPPENS AFTER CHARGING STATE
                    if (this.state === "attack") {
                        // USING PLAYER'S X/Y, DETERMINE THE NEXT X/Y FOR BAT TO GET CLOSER TO PLAYER
                        const dx =
                            this.attackCoordinates[0] - this.x - this.width / 2;
                        const dy =
                            this.attackCoordinates[1] - this.y - this.width / 2;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // NORMALIZE DIRECTION
                        const directionX = dx / distance;
                        const directionY = dy / distance;

                        // DETERMINE FACING DIRECTION
                        if (directionX > 0) {
                            this.facingDirectionLeft = false;
                        } else {
                            this.facingDirectionLeft = true;
                        }

                        // MOVE TOWARDS PLAYER
                        this.x += directionX * this.chargeSpeed;
                        this.y += directionY * this.chargeSpeed;

                        // SET BAT STATE TO PATROLLING AFTER CHARGING
                        if (distance <= 10) {
                            this.isInRangeOfPlayer = false;
                            this.state = "patrolling";
                        }
                    }

                    // IF BAT GOES BELOW CANVAS, DELETE IT
                    if (this.y >= canvas.height + 100) {
                        this.visible = false;
                        this.height = 0;
                        this.width = 0;
                        let index = batEntities.indexOf(this);
                        batEntities.splice(index, 1);
                    }

                    // IF PLAYER COLLIDES WITH BAT, DEAL DAMAGE TO PLAYER, PLAYER BECOME INVULNERABLE FOR 3s
                    if (checkCollision(player, this) && !player.invulnerable) {
                        player.invulnerable = true;
                        player.healthPoints -= 1;
                        sounds.SFX_PLAYER_HURT.play();
                        setTimeout(() => {
                            player.invulnerable = false;
                        }, 3000);
                    }
                }
            }
            // SCROLLS GHOST DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(playerVerticalVelocity) {
                this.y += Math.abs(playerVerticalVelocity);
                this.attackCoordinates[1] += Math.abs(playerVerticalVelocity);
            }
        }

        // HANDLES BAT SPAWNS
        function spawnBatEntity() {
            // ONLY SPAWN WHEN GAME IS UNPAUSED
            if (!gamePause) {
                // GENERATE RANDOM SIDE OF CANVAS TO SPAWN ON (LEFT OR RIGHT)
                let spawnX = 500;
                let spawnLeftSide = getRandomBoolean();
                if (spawnLeftSide) spawnX = 50;
                else if (!spawnLeftSide) spawnX = canvas.width - 50;

                // TRACK PLAYERS VERTICAL DISTANCE TRAVELED AND ATTEMPT TO SPAWN BAT EVERY 1000 TRAVELED
                if (player.vy < 0)
                    playerDistanceTraveledToSpawnBatEntity += Math.abs(
                        player.vy
                    );
                if (playerDistanceTraveledToSpawnBatEntity >= 1000)
                    playerDistanceTraveledToSpawnBatEntity = 0;

                // IF BAT SPAWNS, RESET THE SPAWN RATE TO DEFAULT
                // ALSO PREVENTS BATS FROM REPEATED SPAWNING WITHIN 801-1000 RANGE
                if (
                    weightedRandom(
                        spawnBatEntityBoolean,
                        batEntitySpawnRateArray
                    ) === true &&
                    playerDistanceTraveledToSpawnBatEntity > 800 &&
                    batEntityHasSpawned === false
                ) {
                    batEntities.push(new BatEntity(spawnX, -50, spawnLeftSide));
                    batEntityHasSpawned = true;
                    batEntitySpawnRateArray[0] = batEntitySpawnRateDefault;
                }
                // ONLY INCREASE SPAWN RATE WHEN PLAYER IS JUMPING
                else if (player.vy < 0) {
                    batEntitySpawnRateArray[0] += batEntitySpawnRateIncrease;
                    batEntitySpawnRateArray[1] =
                        10 - batEntitySpawnRateArray[0];
                }
                // IF WITHIN 0-799 RESET batEntityHasSpawned TO false
                if (
                    batEntityHasSpawned === true &&
                    playerDistanceTraveledToSpawnBatEntity >= 0 &&
                    playerDistanceTraveledToSpawnBatEntity <= 800
                ) {
                    batEntityHasSpawned = false;
                }
            }
        }

        // SAW BLADE ENTITY CLASS: RANDOMLY SPAWNING OBSTACLE THAT MOVES BACK AND FORTH HORIZONTALLY
        class SawBladeEntity {
            constructor(x, y, spawnLeftSide) {
                this.x = x;
                this.y = y;
                this.width = 64;
                this.height = 64;
                this.visible = true;
                this.spawnLeftSide = spawnLeftSide;
                this.patrolSpeed = 5;
                this.spriteColumn = 0;
                this.spriteRow = 0;
                this.spriteWidth = 32;
                this.spriteHeight = 32;
                this.gameFrameCounter = 0;
                this.spriteFrameCount = 7;
                this.facingDirectionLeft = true;
                this.frameLoopCount = 0;
            }
            draw(context) {
                // IF VISIBLE, DRAW
                if (this.visible) {
                    // IF GAME IS UNPAUSED, LOOP THROUGH ANIMATION FRAMES
                    if (!gamePause) {
                        this.gameFrameCounter++;
                        if (this.gameFrameCounter > this.spriteFrameCount) {
                            this.gameFrameCounter = 0;
                            this.frameLoopCount++;
                        }
                    }
                    context.drawImage(
                        ITEM_SAW_BLADE,
                        this.gameFrameCounter * this.spriteWidth,
                        this.spriteRow * this.spriteHeight,
                        this.spriteWidth,
                        this.spriteHeight,
                        this.x - this.spriteWidth / 2,
                        this.y - this.spriteHeight / 2,
                        this.width + this.spriteWidth,
                        this.height + this.spriteHeight
                    );
                }
            }
            update(player) {
                // IF GAME IS NOT PAUSED, UPDATE
                if (gamePause === false) {
                    // PLAYS SAW BLADE SFX AT DIFFERENT VOLUMES BASED ON DISTANCE
                    // (CLOSER: LOUDER / FARTHER: QUIETER)
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        sounds.SFX_SAW_BLADE.volume(0.8);
                    } else if (distance < 200) {
                        sounds.SFX_SAW_BLADE.volume(0.6);
                    } else if (distance < 300) {
                        sounds.SFX_SAW_BLADE.volume(0.4);
                    } else if (distance < 400) {
                        sounds.SFX_SAW_BLADE.volume(0.2);
                    } else if (distance > 400) {
                        sounds.SFX_SAW_BLADE.volume(0);
                    }

                    // UPDATE X/Y FOR A DEFAULT MOVE LEFT/RIGHT SEQUENCE
                    let padding = 15; // PADDING SO BLADE DOESN'T TOUCH CANVAS SIDES
                    if (this.x + this.width + padding >= canvas.width)
                        this.spawnLeftSide = false;
                    else if (this.x - padding <= 0) this.spawnLeftSide = true;

                    // BASED ON WHICH SIDE THE BLADE IN ON, MOVE TOWARDS THE OPPOSITE SIDE
                    if (this.spawnLeftSide) {
                        this.x += this.patrolSpeed;
                        this.facingDirectionLeft = false;
                    } else if (!this.spawnLeftSide) {
                        this.x -= this.patrolSpeed;
                        this.facingDirectionLeft = true;
                    }

                    // IF SAW BLADE GOES BELOW THE CANVAS, DELETE IT
                    if (this.y >= canvas.height + 10) {
                        sounds.SFX_SAW_BLADE.volume(0);
                        this.visible = false;
                        this.height = 0;
                        this.width = 0;
                        let index = sawBladeEntities.indexOf(this);
                        sawBladeEntities.splice(index, 1);
                    }

                    // IF PLAYER COLLIDES WITH BAT, DEAL DAMAGE TO PLAYER, PLAYER BECOME INVULNERABLE FOR 3s
                    if (checkCollision(player, this) && !player.invulnerable) {
                        player.invulnerable = true;
                        player.healthPoints -= 2;
                        sounds.SFX_PLAYER_HURT.play();
                        setTimeout(() => {
                            player.invulnerable = false;
                        }, 3000);
                    }
                }
            }
            // SCROLLS SAW BLADE DOWN WHEN PLAYER "JUMPS HIGHER"
            scroll(playerVerticalVelocity) {
                this.y += Math.abs(playerVerticalVelocity);
            }
        }

        // HANDLES SAW BLADE SPAWNS
        function spawnSawBladeEntity() {
            // ONLY SPAWN WHEN GAME IS UNPAUSED
            if (!gamePause) {
                // GENERATE RANDOM SIDE OF CANVAS TO SPAWN ON (LEFT OR RIGHT)
                let spawnX = 500;
                let spawnLeftSide = getRandomBoolean();
                let xDeviationLeftSide = randomNumber(50, canvas.width / 2);
                let xDeviationRightSide = randomNumber(
                    canvas.width / 2,
                    canvas.width - 50
                );
                if (spawnLeftSide) spawnX = xDeviationLeftSide; // 50
                else if (!spawnLeftSide) spawnX = xDeviationRightSide; // -50

                // ATTEMPT TO SPAWN BLADE EVERY 50 POINTS OF PLAYER SCORE:
                // IF RESULT RETURNS TRUE, SPAWN BLADE
                // IF RESULTS RETURNS FALSE, DO NOT SPAWN BLADE
                let result = weightedRandom(
                    spawnSawBladeEntityBoolean,
                    sawBladeEntitySpawnRateArray
                );
                if (
                    Math.floor(playerScore) % 50 === 0 &&
                    Math.floor(playerScore) !== 0 &&
                    verticalDistanceForSpawnReached === false
                ) {
                    verticalDistanceForSpawnReached = true;

                    if (result) {
                        sawBladeEntities.push(
                            new SawBladeEntity(spawnX, -120, spawnLeftSide)
                        );
                    } else {
                        sawBladeSpawnAttempts += 1;
                    }
                } else if (Math.floor(playerScore) % 50 !== 0) {
                    verticalDistanceForSpawnReached = false;
                }

                // IF A BLADE FAILS TO SPAWN 3 TIMES IN A ROW, INCREASE ITS CHANCE TO SPAWN
                if (
                    sawBladeSpawnAttempts % 3 === 0 &&
                    sawBladeSpawnAttempts !== 0 &&
                    spawnRateIncreased === false &&
                    sawBladeEntitySpawnRateArray[0] < 10
                ) {
                    sawBladeEntitySpawnRateArray = [
                        sawBladeEntitySpawnRateArray[0] + 1,
                        sawBladeEntitySpawnRateArray[1] - 1,
                    ];
                    spawnRateIncreased = true;
                } else if (sawBladeSpawnAttempts % 3 !== 0) {
                    spawnRateIncreased = false;
                }
            }
        }

        // DARKNESS CIRCLE CLASS: A BLACK IMAGE WITH A CIRCLE CUT OUT, CENTERED ONTO THE PLAYER TO SIMULATE A DARK ENVIRONMENT
        // BUG DISCLAIMER: DOES NOT LOAD UPON FIRST LOAD, REFRESHING THE PAGE PROPERLY LOADS IMAGE
        class DarknessCircle {
            constructor(x, y, src) {
                this.x = x;
                this.y = y;
                this.image = new Image();
                this.image.src = src;
                this.image.width =
                    this.image.width * zoomScale * playerVisibility;
                this.image.height =
                    this.image.height * zoomScale * playerVisibility;
            }
            draw(ctx, player) {
                // IF IMAGE EXISTS, DRAW
                if (this.image) {
                    // GETS PLAYER COORDINATES AND CENTERS THE IMAGE ONTO PLAYER
                    let playerCenterX = player.x + player.width / 2;
                    let playerCenterY = player.y + player.height / 2;
                    let imageCenterX = this.image.width / 2;
                    let imageCenterY = this.image.height / 2;
                    ctx.drawImage(
                        this.image,
                        playerCenterX - imageCenterX,
                        playerCenterY - imageCenterY,
                        this.image.width,
                        this.image.height
                    );
                }
            }
            update(player, ctx) {
                // DRAW
                this.draw(ctx, player);
            }
        }

        // CLASS INSTANCES
        const input = new inputHandler();
        const player = new Player(canvas.width, canvas.height, 0);
        const playerHeartsUI = new PlayerHeartsUI(0, 0);
        const scoreCounter = new ScoreCounter(playerScore);
        const goldCoinCounter = new GoldCoinCounter(player.goldCoinsCollected);
        backgrounds.push(
            new Background(0, 0, "TEXTURES/BACKGROUNDS/BACKGROUND_1.png")
        );
        const backgroundSolid = new Background(
            0,
            0,
            "TEXTURES/BACKGROUNDS/BACKGROUND_SOLID.png"
        );
        const darknessCircle = new DarknessCircle(
            0,
            0,
            "TEXTURES/BACKGROUNDS/BACKGROUND_DARKNESS_CIRCLE_3.png"
        );
        const titleScreenBackground = new Background(
            0,
            0,
            "TEXTURES/BACKGROUNDS/COVER_ART_4.png"
        );

        // GENERATE RANDOM WEIGHTED ITEM
        function weightedRandom(items, weights) {
            // ERROR CATCHING FOR EMPTY ARRAYS
            if (items.length !== weights.length) {
                throw new Error("Items and weights must be of the same size");
            }
            if (!items.length) {
                throw new Error("Items must not be empty");
            }

            // PREPARING THE CUMULATIVE WEIGHTS ARRAY
            const cumulativeWeights = [];
            for (let i = 0; i < weights.length; i += 1) {
                cumulativeWeights[i] =
                    weights[i] + (cumulativeWeights[i - 1] || 0);
            }

            // GETTING THE RANDOM NUMBER IN A RANGE OF [0... sum(weights)]
            const maxCumulativeWeight =
                cumulativeWeights[cumulativeWeights.length - 1];
            const randomNumber = maxCumulativeWeight * Math.random();

            // PICKING THE RANDOM ITEM BASED ON ITS WEIGHT
            for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
                if (cumulativeWeights[itemIndex] >= randomNumber) {
                    return items[itemIndex];
                }
            }
        }

        // GENERATE RANDOM BOOLEAN VALUE
        function getRandomBoolean() {
            if (Math.floor(Math.random() * 2) === 1) return false;
            else return true;
        }

        // GENERATE INITIAL PLATFORMS (30 PLATFORMS)
        for (let i = 1; i <= initialPlatformCount; i++) {
            // DEFAULT VALUES
            let startingPlatform = false;
            let hasHealthPotion = false;

            // DETERMINE IF PLATFORM IS A MOVING PLATFORM
            let moving = weightedRandom(movingPlatform, movingPlatformWeights);

            // DETERMINE IF PLATFORM IS A COLLAPSABLE PLATFORM
            let collapsable = weightedRandom(
                collapsablePlatform,
                collapsablePlatformWeights
            );

            // DETERMINE IF PLATFORM HAS A COIN
            // ONLY FOR NON-COLLAPSABLE, NON-MOVING PLATFORMS
            let hasGoldCoin = false;
            if (!collapsable && !moving && !hasHealthPotion) {
                hasGoldCoin = weightedRandom(
                    platformGoldCoinSpawn,
                    platformGoldCoinSpawnWeights
                );
            }

            // GENERATE A RANDOM WIDTH (SMALL, MEDIUM, LARGE)
            let random_width = weightedRandom(
                platformSizes,
                platformPickWeights
            );
            // GENERATE A RANDOM SPAWN X COORDINATE
            let random_x = randomNumber(20, canvas.width - random_width - 20);
            // GENERATE A RANDOM SPAWN Y COORDINATE
            let random_y = randomNumber(
                canvas.height - adjustedPlatformGap - platformGapVariation,
                canvas.height - adjustedPlatformGap + platformGapVariation
            );

            // SPECIFY SPECIFIC PROPERTIES FOR THE FIRST PLATFORM
            // PLACE PLAYER ON FIRST PLATFORM
            if (i === 1) {
                startingPlatform = true;
                collapsable = false;
                hasGoldCoin = false;
                random_width = platformSizes[2];
                random_y = canvas.height - adjustedPlatformGap;
                playerStart = [
                    parseInt(random_x + random_width / 2 - player.width / 2),
                    parseInt(
                        canvas.height - adjustedPlatformGap - player.height - 10
                    ),
                ];
            }

            // ONLY MEDIUM PLATFORMS CAN BE COLLAPSABLE
            if (
                random_width === platformSizes[2] ||
                random_width === platformSizes[0]
            ) {
                collapsable = false;
            }

            // IF A PLATFORM IS COLLAPSABLE, IT CANNOT MOVE
            if (collapsable) {
                moving = false;
            }

            // CREATE PLATFORM WITH THE PREVIOUSLY DEFINED PROPERTIES
            platforms.push(
                new Platform(
                    random_x,
                    random_y,
                    random_width,
                    getRandomBoolean(),
                    "aqua",
                    collapsable,
                    startingPlatform,
                    moving,
                    hasHealthPotion,
                    hasGoldCoin
                )
            );

            // SET lastInitialPlatformY SO THE DYNAMICALLY GENERATED PLATFORMS KNOW WHERE TO BEGIN
            if (i === initialPlatformCount) {
                lastInitialPlatformY = random_y;
            }

            // INCREMENT GAP FOR NEXT PLATFORM
            adjustedPlatformGap += platformGap;
        }

        // GENERATE ADDITIONAL PLATFORMS (PAST THE INITIAL 30)
        function createPlatform(adjustedPlatformGap) {
            // NO STARTING PLATFORMS
            let startingPlatform = false;

            // DETERMINE IF PLATFORM IS A MOVING PLATFORM
            let moving = weightedRandom(movingPlatform, movingPlatformWeights);

            // DETERMINE IF PLATFORM IS A COLLAPSABLE PLATFORM
            let collapsable = weightedRandom(
                collapsablePlatform,
                collapsablePlatformWeights
            );

            // DETERMINE IF PLATFORM HAS A POTION
            // ONLY FOR NON-COLLAPSABLE, NON-MOVING PLATFORMS
            let hasHealthPotion = false;
            if (!collapsable && !moving) {
                hasHealthPotion = weightedRandom(
                    platformHealingPotionSpawn,
                    platformHealingPotionSpawnWeights
                );
            }

            // DETERMINE IF PLATFORM HAS A COIN
            // ONLY FOR NON-COLLAPSABLE, NON-MOVING PLATFORMS THAT ALSO DO NOT CONTAIN A POTION
            let hasGoldCoin = false;
            if (!collapsable && !moving && !hasHealthPotion) {
                hasGoldCoin = weightedRandom(
                    platformGoldCoinSpawn,
                    platformGoldCoinSpawnWeights
                );
            }

            // GENERATE A RANDOM WIDTH (SMALL, MEDIUM, LARGE)
            let random_width = weightedRandom(
                platformSizes,
                platformPickWeights
            );
            // GENERATE A RANDOM SPAWN X COORDINATE
            let random_x = randomNumber(20, canvas.width - random_width - 20);
            // GENERATE A RANDOM SPAWN Y COORDINATE
            let random_y = randomNumber(
                canvas.height - adjustedPlatformGap - platformGapVariation,
                canvas.height - adjustedPlatformGap + platformGapVariation
            );

            // ONLY MEDIUM PLATFORMS CAN BE COLLAPSABLE
            if (
                random_width === platformSizes[2] ||
                random_width === platformSizes[0]
            ) {
                collapsable = false;
            }

            // IF A PLATFORM IS COLLAPSABLE, IT CANNOT MOVE
            if (collapsable) {
                moving = false;
            }

            // CREATE PLATFORM WITH THE PREVIOUSLY DEFINED PROPERTIES
            platforms.push(
                new Platform(
                    random_x,
                    random_y,
                    random_width,
                    getRandomBoolean(),
                    "tomato",
                    collapsable,
                    startingPlatform,
                    moving,
                    hasHealthPotion,
                    hasGoldCoin
                )
            );

            // INCREMENT GAP FOR NEXT PLATFORM
            adjustedPlatformGap += platformGap;
        }

        // OBJECT SCROLLING: MOVES ALL OBJECTS DOWNWARDS WHEN THE PLAYER JUMPS ABOVE A THRESHOLD, SIMULATES MOVING UPWARD
        function scrollAll(
            player,
            platforms,
            batEntities,
            sawBladeEntities,
            healthPotions,
            ghostEntities,
            goldCoins,
            goldCoinPickupTextObjects
        ) {
            player.y -= player.vy;
            platforms.forEach((platform) => {
                platform.scroll(player.vy);
            });
            batEntities.forEach((batEntity) => {
                batEntity.scroll(player.vy);
            });
            sawBladeEntities.forEach((sawBladeEntity) => {
                sawBladeEntity.scroll(player.vy);
            });
            healthPotions.forEach((healthPotion) => {
                healthPotion.scroll(player.vy);
            });
            ghostEntities.forEach((ghostEntity) => {
                ghostEntity.scroll(player.vy);
            });
            goldCoins.forEach((goldCoin) => {
                goldCoin.scroll(player.vy);
            });
            goldCoinPickupTextObjects.forEach((goldCoinPickupTextObject) => {
                goldCoinPickupTextObject.scroll(player.vy);
            });
        }

        // CORE GAME LOOP: HANDLES UPDATING/DRAWING OBJECTS, SPAWNING ENTITIES, PAUSE EVENT, ETC.
        function coreGameLoop() {
            if (!showDeathScreen && player.healthPoints > 0) {
                // AUDIO: PLAY NECESSARY FOR GAME LOOP
                if (sounds.MUSIC_GAME_PLAY.playing() === false) {
                    sounds.MUSIC_GAME_PLAY.play();
                }
                if (sounds.SFX_SAW_BLADE.playing() === false) {
                    sounds.SFX_SAW_BLADE.play();
                }
                // FIX: SKIPPING TITLE SCREEN QUICKLY WILL PLAY TITLE AND GAME LOOP MUSIC TOGETHER
                if (sounds.MUSIC_TITLE_SCREEN.playing() === true) {
                    sounds.MUSIC_TITLE_SCREEN.stop();
                }
            }

            // BACKGROUND OBJECTS
            ctx.save();
            let scaleX = 0.8 * zoomScale;
            let scaleY = 1.6 * zoomScale;
            ctx.scale(scaleX, scaleY);
            backgroundSolid.update();
            backgrounds.forEach((background) => {
                background.draw();
                background.update();
            });
            ctx.restore();

            // PLATFORMS: DRAW & UPDATE
            platforms.forEach((platform) => {
                platform.draw(ctx);
                platform.update(player);
            });

            // PROJECTILES: DRAW & UPDATE
            projectiles.forEach((projectile) => {
                projectile.draw(ctx);
                projectile.update();
            });

            // GHOST ENTITIES: DRAW & UPDATE
            ghostEntities.forEach((ghostEntity) => {
                ghostEntity.draw(ctx);
                ghostEntity.update(player);
            });

            // BAT ENTITIES: SPAWN, DRAW & UPDATE
            spawnBatEntity();
            batEntities.forEach((batEntity) => {
                batEntity.draw(ctx);
                batEntity.update(player);
            });

            // SAW BLADE ENTITIES: SPAWN, DRAW & UPDATE
            spawnSawBladeEntity(playerScore);
            sawBladeEntities.forEach((sawBladeEntity) => {
                sawBladeEntity.draw(ctx);
                sawBladeEntity.update(player);
            });

            // HEALTH POTIONS: DRAW & UPDATE
            healthPotions.forEach((healthPotion) => {
                healthPotion.draw(ctx, nextFrame);
                healthPotion.update(player);
            });

            // GOLD COINS: DRAW & UPDATE
            goldCoins.forEach((goldCoin) => {
                goldCoin.draw(ctx);
                goldCoin.update(player);
            });

            // PLAYER: SET START POSITION & DRAW
            player.setStartPosition(playerStart);
            player.draw(ctx, nextFrame);

            // HANDLE ANIMATION PLAY SPEED AND  PLAYER RUN ANIMATION FRAMES
            if (gameFrame % staggerFrames === 0) {
                if (nextFrame > numOfFrames) nextFrame = 0;
                else if (
                    (player.animState === "runningRight" ||
                        player.animState === "runningLeft") &&
                    (nextFrame === 1 || nextFrame === 3 || nextFrame === 6)
                ) {
                    sounds.SFX_STEP.rate(1.5);
                    sounds.SFX_STEP.stop();
                    sounds.SFX_STEP.play();
                    nextFrame++;
                } else {
                    nextFrame++;
                }
            }

            // PLAYER: UPDATE
            player.update(input, platforms, basePlayerSpeed);

            // GOLD COIN PICKUP TEXT: DRAW & UPDATE
            goldCoinPickupTextObjects.forEach((goldCoinPickupTextObject) => {
                goldCoinPickupTextObject.draw(ctx);
                goldCoinPickupTextObject.update(player);
            });

            // WHEN GAME IS NOT PAUSED, SCROLL OBJECTS WHEN PLAYER REACHES VERTICAL THRESHOLD (canvasSectionToStartScroll)
            if (gamePause === false) {
                let canvasSectionToStartScroll =
                    canvas.height - canvas.height / 3;
                if (
                    player.y + player.height / 2 < canvasSectionToStartScroll &&
                    player.vy < 0
                )
                    scrollAll(
                        player,
                        platforms,
                        // jumpBoosts,
                        batEntities,
                        sawBladeEntities,
                        healthPotions,
                        ghostEntities,
                        goldCoins,
                        goldCoinPickupTextObjects
                    );
            }

            // DARKNESS CIRCLE: UPDATE
            darknessCircle.update(player, ctx);

            // SCORE COUNTER: DRAW & UPDATE
            scoreCounter.draw(ctx);
            scoreCounter.update(parseInt(playerScore));

            // GOLD COIN COUNTER: DRAW & UPDATE
            goldCoinCounter.draw(ctx);
            goldCoinCounter.update(
                player.goldCoinsCollected,
                scoreCounter.x,
                scoreCounter.y
            );

            // PLAYER HEARTS UI: UPDATE
            playerHeartsUI.update(player, ctx);

            // IF GAME IS PAUSED AND PLAYER ALIVE, DRAW "PAUSED" TEXT ON SCREEN AND STOP ALL AUDIO
            if (gamePause && player.alive) {
                ctx.fillStyle = "white";
                ctx.font = `54px ${fontFamily}`;
                ctx.fillText(
                    pauseText,
                    canvas.width / 2 - pauseTextWidth * 2,
                    canvas.height / 2
                );

                if (showDeathScreen === false) {
                    // STOP ALL AUDIO
                    Object.values(sounds).forEach((sound) => {
                        if (sound.playing() && sound.mute(false))
                            sound.mute(true);
                    });
                }
            } else {
                if (showDeathScreen === false) {
                    // RESUME ALL AUDIO
                    Object.values(sounds).forEach((sound) => {
                        if (sound.playing() && sound.mute(true))
                            sound.mute(false);
                    });
                }
            }

            // DEATH SCREEN
            if (showDeathScreen) {
                // PAUSE GAME
                gamePause = true;

                // TEXT: YOU'VE DIED
                ctx.fillStyle = "white";
                ctx.font = `64px ${fontFamily}`;
                let text = "GAME OVER";
                let textWidth = ctx.measureText(text).width;
                ctx.fillText(
                    text,
                    canvas.width / 2 - textWidth / 2,
                    canvas.height / 2
                );

                // TEXT: PRESS SPACE TO RETRY
                ctx.save();
                if (blinkingTextAlpha > 1 || blinkingTextAlpha < 0) {
                    ctx.globalAlpha = 0;
                } else ctx.globalAlpha = blinkingTextAlpha;
                ctx.fillStyle = "yellow";
                ctx.font = `24px ${fontFamily}`;
                let textTwo = "Press space to retry";
                let textTwoWidth = ctx.measureText(textTwo).width;
                ctx.fillText(
                    textTwo,
                    canvas.width / 2 - textTwoWidth / 2,
                    canvas.height / 2 + 150
                );
                ctx.restore();
                if (gameFrame % 5 === 0) {
                    if (increaseBlinkingTextAlpha) {
                        blinkingTextAlpha += 0.1;
                    } else if (!increaseBlinkingTextAlpha) {
                        blinkingTextAlpha -= 0.1;
                    }
                }
                if (blinkingTextAlpha <= 0) {
                    increaseBlinkingTextAlpha = true;
                } else if (blinkingTextAlpha >= 1.0) {
                    increaseBlinkingTextAlpha = false;
                }

                // AUDIO: STOP ALL EXCEPT FOR DEATH MUSIC
                // IF DEATH MUSIC IS STOPPED HERE, IT WILL INFINITELY STOP AND START
                Object.values(sounds).forEach((sound) => {
                    if (sound.playing() && sound !== sounds.MUSIC_DEATH)
                        sound.stop();
                });

                // AUDIO: PLAY DEATH MUSIC IF NOT ALREADY PLAYING
                if (sounds.MUSIC_DEATH.playing() === false) {
                    sounds.MUSIC_DEATH.play();
                }

                // INPUT: [SPACE]
                if (input.keys.indexOf(" ") > -1 && loopGame) {
                    // AUDIO: STOP ALL
                    Object.values(sounds).forEach((sound) => {
                        if (sound.playing()) sound.stop();
                    });

                    // RESET PLAYER INVULNERABILITY
                    player.invulnerable = false;

                    // TEMPORARILY DISABLE GAME LOOP TO AVOID CREATING MULTIPLE INSTANCES
                    loopGame = false;

                    // RESET GAME PAUSE TO FALSE
                    gamePause = false;

                    // REBOOT GAME
                    playGame();
                }
            }
        }

        // ANIMATE: HANDLES CANVAS CLEARING, FRAMERATE, FRAME ITERATION, TITLE SCREEN AND PAUSE EVENT
        function animate() {
            // CLEAR CANVAS ON EVERY FRAME TO DRAW UPDATED OBJECTS
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ALLOWS ART ASSETS TO BE SHARP WHEN SCALED UP
            ctx.imageSmoothingEnabled = false;

            // SET gamePause VALUE WITH USER INPUT "p"/"P" KEY
            if (
                (input.keys.indexOf("p") > -1 && gamePause === false) ||
                (input.keys.indexOf("P") > -1 && gamePause === false)
            ) {
                gamePause = true;
                input.keys.splice(input.keys.indexOf("p"), 1);
            } else if (
                (input.keys.indexOf("p") > -1 && gamePause === true) ||
                (input.keys.indexOf("P") > -1 && gamePause === true)
            ) {
                gamePause = false;
                input.keys.splice(input.keys.indexOf("p"), 1);
            }

            // IF GAME LOOP IS TRUE
            if (loopGame) {
                // SHOW TITLE SCREEN IF showTitleScreen is true
                if (showTitleScreen) {
                    // AUDIO: STOP ALL EXCEPT FOR TITLE MUSIC
                    // IF DEATH MUSIC IS STOPPED HERE, IT WILL INFINITELY STOP AND START
                    Object.values(sounds).forEach((sound) => {
                        if (
                            sound.playing() &&
                            sound !== sounds.MUSIC_TITLE_SCREEN
                        )
                            sound.stop();
                    });
                    // AUDIO: PLAY TITLE MUSIC IF NOT ALREADY PLAYING
                    if (sounds.MUSIC_TITLE_SCREEN.playing() === false) {
                        sounds.MUSIC_TITLE_SCREEN.play();
                    }

                    // BACKGROUND: TITLE SCREEN
                    ctx.save();
                    let scaleX = 0.8 * zoomScale;
                    let scaleY = 1.6 * zoomScale;
                    ctx.scale(scaleX, scaleY);
                    titleScreenBackground.update();
                    ctx.restore();

                    ctx.save();
                    // TEXT: PRESS SPACE TO TRY AGAIN
                    if (blinkingTextAlpha > 1 || blinkingTextAlpha < 0) {
                        ctx.globalAlpha = 0;
                    } else ctx.globalAlpha = blinkingTextAlpha;
                    ctx.fillStyle = "yellow";
                    ctx.font = `24px ${fontFamily}`;
                    let textTwo = "Press space to play";
                    let textTwoWidth = ctx.measureText(textTwo).width;
                    ctx.fillText(
                        textTwo,
                        canvas.width / 2 - textTwoWidth / 2,
                        canvas.height / 2 + 150
                    );
                    ctx.restore();
                    if (gameFrame % 5 === 0) {
                        if (increaseBlinkingTextAlpha) {
                            blinkingTextAlpha += 0.1;
                        } else if (!increaseBlinkingTextAlpha) {
                            blinkingTextAlpha -= 0.1;
                        }
                    }
                    if (blinkingTextAlpha <= 0) {
                        increaseBlinkingTextAlpha = true;
                    } else if (blinkingTextAlpha >= 1.0) {
                        increaseBlinkingTextAlpha = false;
                    }

                    // INPUT: [SPACE]
                    if (input.keys.indexOf(" ") > -1) {
                        // AUDIO: STOP ALL
                        Object.values(sounds).forEach((sound) => {
                            if (sound.playing()) sound.stop();
                        });
                        showTitleScreen = false;
                    }
                }
                // ELSE IF SHOW TITLE SCREEN IS FALSE, LOOP THROUGH CORE GAME
                else if (!showTitleScreen) {
                    coreGameLoop();
                }

                // ITERATE gameFrame
                gameFrame++;

                // RESTRICT THE FRAMERATE SO THAT IT PLAYS AT THE SAME SPEED ON ANY SCREEN
                let framerate = 60;
                setTimeout(() => {
                    requestAnimationFrame(animate);
                }, 1000 / framerate);
            }
        }
        // EXECUTE GAME LOOP
        animate();
    }

    // PLAY GAME UPON LAUNCH
    playGame();
});
