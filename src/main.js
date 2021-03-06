class main extends Phaser.Scene {
    constructor() {
        super("main");
    }

    init() {
        this.arrPieces;
        this.atlasPieces;
        this.scaleNum;
        this.numPieces;
        this.piecesRender;
        this.piecesDropped;
        this.frame;
        this.framepicture;
        this.framepieces;
        this.timedEvent;
        this.arrPiecesDropped;
        this.changebtn;
        this.objectGame;
    }
    

    loadButton(sceneName, sound) {
        this.arrPiecesDropped = [];
        this.piecesRender = [];
        this.objectGame=[];
        this.piecesDropped = 0;
        this.objectGame.push(this.framepieces);
        this.objectGame.push(this.framepicture);
        var backbtn = sceneName.add.image(755, 180, "backbtn");
        backbtn.setInteractive({useHandCursor: true}).on('pointerdown', function () {
            sceneName.sound.play("clicksound", {loop: false});
            sceneName.add.image(755, 180, "backbtn_right");
            setTimeout(() => sceneName.scene.start("startGame"), 100);
            sound.stop();
        }, sceneName);
        this.objectGame.push(backbtn);

        var helpbtn = sceneName.add.image(755, 270, "helpbtn");
        this.objectGame.push(helpbtn);
        var haveImg = false;
        
        helpbtn.setInteractive({useHandCursor: true}).on('pointerdown', function () {
                sceneName.sound.play("clicksound", {loop: false});
                sceneName.orginpicture = sceneName.add.image(game.config.width/2 + 38, game.config.height/2, "originpicture");
                this.tweenfaded(sceneName, this.objectGame, 0, 0);
                this.tweenfaded(sceneName, this.piecesRender, 0, 0);

                sceneName.closebtn = sceneName.add.image(game.config.width*3/4 - 5, game.config.height/2 - 115, "backbtn").setScale(0.5);
                sceneName.closebtn.setInteractive({useHandCursor: true}).on('pointerdown', function(){
                    sceneName.sound.play("clicksound", {loop: false});
                    sceneName.orginpicture.destroy();
                    sceneName.closebtn.destroy();
                    this.tweenfaded(sceneName, this.objectGame, 1, 300);
                    this.tweenfaded(sceneName, this.piecesRender, 1, 300);
                }, this)
            }, this);

        var musiconbtn = sceneName.add.image(755, 360, "musicon");
        this.objectGame.push(musiconbtn);
        var haveMusic = true;
        musiconbtn.setInteractive({useHandCursor: true}).on('pointerdown', function () {
            if (haveMusic == true) {
                sceneName.sound.play("clicksound", {loop: false});
                sceneName.musicoffbtn = sceneName.add.image(755, 360, "musicoff");
                haveMusic = false;
                sound.pause();
                this.objectGame.push(sceneName.musicoffbtn);
            } else {
                sceneName.sound.play("clicksound", {loop: false});
                sceneName.musicoffbtn.destroy();
                sceneName.musicoffbtn = null;
                haveMusic = true;
                sound.resume();
            }
        }, this);

        this.changebtn = sceneName.add.image(game.config.width / 2 - 360 / 2 - 80 + 105 / 2, game.config.height - 110, "changepieces");
        this.changebtn.setInteractive({useHandCursor: true}).on('pointerdown', function () {
            sceneName.sound.play("clicksound", {loop: false});
            this.destroyPieces(this.piecesRender);
            this.shuffle(this.piecesRender);
            this.loadPieces(sceneName, this.atlasPieces, this.arrPieces, this.scaleNum, 1, this.numPieces);
            for (let i = 0; i < this.piecesRender.length; i++) {
                this.setDragAndDrop(sceneName, this.piecesRender[i], this.scaleNum);
            }
        }, this);
        this.objectGame.push(this.changebtn);
    }
    loadMusic(sound){
        var soundtrack = this.sound.add(sound, {loop: true})
        return soundtrack;
    }

    loadBackground(sceneName) {
        this.frame = sceneName.add.image(0, 0, "frame");
        this.frame.setOrigin(0);
    }

    destroyPieces(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].destroy();
        }
    }

    loadFrame(sceneName) {
        this.framepicture = sceneName.add.image(game.config.width / 2 - 360 / 2 + 40, game.config.height / 2 - 252 / 2 - 10, "framepicture");
        this.framepicture.setOrigin(0);
        this.framepieces = sceneName.add.image(game.config.width / 2 - 360 / 2 - 80, game.config.height / 2 - 252 / 2 - 10, "framepiece").setOrigin(0);
    }

    loadPieces(sceneName, atlas, arr, x, shuffle, numZone) {
        let count = 4;
        this.piecesRender = [];
        this.atlasPieces = atlas;
        this.scaleNum = x;
        this.numPieces = numZone;
        this.setZone(sceneName, numZone);
        var ax = x * 360 / (2 * (Math.sqrt(numZone)));
        var ay = x * 252 / (2 * (Math.sqrt(numZone)));
        var location = [[game.config.width / 2 - 360 / 2 - 73, game.config.height / 2 - 252 / 2 - 3],
            [game.config.width / 2 - 360 / 2 - 73, game.config.height / 2 - 252 / 2 - 3 + 65],
            [game.config.width / 2 - 360 / 2 - 73, game.config.height / 2 - 252 / 2 - 3 + 129],
            [game.config.width / 2 - 360 / 2 - 73, game.config.height / 2 - 252 / 2 - 3 + 193]
        ]
        if (shuffle == 1) {
            arr = this.shuffle(arr);
        }
        this.arrPieces = arr;
        if (arr.length >= 4) {
            count = 4;
        } else {
            count = arr.length;
        }
        for (let i = 0; i < count; i++) {
            let pic = sceneName.add.image(location[i][0] + ax, location[i][1] + ay, atlas, arr[i]).setScale(x);
            pic.setName(arr[i]);
            this.piecesRender.push(pic);
        }
        return this.piecesRender;

    }

    setDragAndDrop(sceneName, picture, scaleNum) {
        this.piecesDrag(sceneName, picture, scaleNum);
        this.piecesDrop(sceneName, scaleNum);
    
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    piecesDrag(sceneName, image, scaleNum) {
        image.setInteractive();
        sceneName.input.setDraggable(image);
        image.on('dragstart', function (pointer, gameObject) {
            image.setScale(1);
        });
        sceneName.input.on('dragstart', function (pointer, gameObject) {
            sceneName.children.bringToTop(gameObject);
        }, sceneName);

        sceneName.input.on('drag', function (pointer, gameObject, dragX, dragY, dropZone) {
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
        });
        sceneName.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.setScale(scaleNum);
            }
        });
    }

    piecesDrop(sceneName, scaleNum) {
        sceneName.input.on('drop', function (pointer, gameObject, dropZone) {

            if (dropZone.name == gameObject.name && this.arrPieces.indexOf(gameObject.name) >= 0) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.input.enabled = false;
                
                
                if (this.arrPieces.indexOf(gameObject.name) >= 0) {
                    this.arrPieces.splice(this.arrPieces.indexOf(gameObject.name), 1);
                    this.piecesRender.splice(this.piecesRender.indexOf(gameObject), 1);
                    for (let i = 0; i < this.piecesRender.length; i++) {
                        this.piecesRender[i].destroy();
                    }
                    let pieces = this.loadPieces(sceneName, this.atlasPieces, this.arrPieces, this.scaleNum, 0, this.numPieces);
                    for (let i = 0; i < this.piecesRender.length; i++) {
                        this.setDragAndDrop(sceneName, this.piecesRender[i], this.scaleNum);
                    }
                }
                this.piecesDropped++;
                this.arrPiecesDropped.push(gameObject);
                this.sound.play("done", {loop:false});
                
            } else if (this.arrPieces.indexOf(gameObject.name) >= 0) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.setScale(scaleNum);
            }
            

        }, this);
        
    }

    setZone(sceneName, num) {
        var zone;
        var ax = 360 / (Math.sqrt(num));
        var ay = 252 / (Math.sqrt(num));
        for (let i = 0; i < Math.sqrt(num); i++) {
            for (let j = 0; j < Math.sqrt(num); j++) {
                zone = sceneName.add.zone(348 + i * ax + ax / 2, 143 + j * ay + ay / 2, ax, ay).setDropZone();
                zone.setName(j * Math.sqrt(num) + i + 1);
                sceneName.graphics = sceneName.add.graphics();
                sceneName.graphics.lineStyle(2, 0xFCDCEA);
                sceneName.graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

            }
        }
    }

    formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        // Seconds
        var partInSeconds = seconds % 60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, '0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }

    countdown(sceneName, initialTime, sound){
        sceneName.text = sceneName.add.text(450, 420, 'Time left: ' + this.formatTime(initialTime)).setStroke('#EFAB0C', 8);
        
        this.timedEvent = sceneName.time.addEvent({
            delay: 1000,
            callback:  ()=> {
                initialTime -= 1; // One second
                if (initialTime < 11){
                    sceneName.sound.play("countdown", {loop:false});
                }
                sceneName.text.setText('Time left: ' + this.formatTime(initialTime));
                if (initialTime == 0){
                    this.timedEvent.remove();
                    this.destroyPieces(this.piecesRender);
                    this.destroyPieces(this.objectGame);
                    sceneName.sound.play("fail", {loop:false})
                    
                    this.tweenfaded(sceneName, this.objectGame, 0, 1000);
                    this.tweenfaded(sceneName, [this.frame], 0.3, 1000);
                    var timesup = sceneName.add.image(game.config.width/2, 0, "timesup");
                    sound.stop();
                    sceneName.tweens.add({
                        targets: timesup.setScale(0.9),
                                props: {
                                    y: {value: game.config.height/3, duration: 1500, ease: 'Bounce.easeOut'}
                                },
                                delay: 0
                    })

                    var replaybtn = sceneName.add.image(game.config.width/2, game.config.height *3/4, "replaybtn").setScale(1.2, 0.9)
                    replaybtn.setInteractive( { useHandCursor: true  }).on('pointerdown', function(){
                        sceneName.sound.play("clicksound", {loop: false});
                        sceneName.scene.start(sceneName);
                           
                    },this); 
                    this.tweeneaseInOut(sceneName, replaybtn, 0)
                }
                
                if (this.piecesDropped == this.numPieces){
                    this.timedEvent.remove();
                    sound.stop();
                    setTimeout(() => sceneName.sound.play("winner",{loop: false}), 500)
                    this.tweenfaded(sceneName, this.objectGame, 0, 1000);
                    this.tweenfaded(sceneName, [this.frame], 0.5, 1000)
                    
                    if (this.numPieces != 16){
                        var welldone = sceneName.add.image(0, game.config.height/6, "welldone").setOrigin(0);
                        
                        this.tweeneaseInOut(sceneName, welldone, 0);
                        var nextbtn = sceneName.add.image(game.config.width*5/6, game.config.height*5/6, "nextbutton_large").setScale(0.3);
                        nextbtn.setInteractive({useHandCursor: true}).on('pointerdown', function () {
                        sceneName.sound.play("clicksound", {loop: false});
                        
                        if (this.numPieces == 4){
                            setTimeout(() => sceneName.scene.start('level2'), 100);
                            

                        } else if (this.numPieces == 9){
                            setTimeout(() => sceneName.scene.start('level3'), 100);
                            
                        }
                        }, this)
                        this.tweeneaseInOut(sceneName, nextbtn, 0);
                    } else {
                        var winner = sceneName.add.image(game.config.width/2 - 200, game.config.height/2 - 50, "winner");
                        var homebtn = sceneName.add.image(game.config.width/2 - 220, game.config.height/2 + 100, "homebtn");
                        this.tweeneaseInOut(sceneName, winner, 0);
                        this.tweeneaseInOut(sceneName, homebtn, 0);
                        homebtn.setInteractive( { useHandCursor: true  }).on('pointerdown', function(){
                            sceneName.sound.play("clicksound", {loop: false});
                            sceneName.scene.start('startGame');   
                            
                        },this); 
                    }
                } 
            },
            callbackScope: this,
            loop: true});
            this.objectGame.push(sceneName.text);
    }
    tweenfaded(sceneName, array, a,t){
        sceneName.tween = sceneName.tweens.add({
            targets: array,
            alpha: a,
            delay: t,
            duration: 1000
        }, this);
    }
    tweeneaseInOut(sceneName, image, x){
        sceneName.tweens.add({
            targets: image.setScale(x),
            scaleX: '+=1',
            scaleY: '+=1',
            duration: 1000,
            ease: 'Sine.easeInOut',
            delay: 1000,
            paused: false,
            repeat: 0
        })
    }
    debugTweenData (tweenData){
}
    update (){
        this.debugTweenData(this.tween.data);
    }
}